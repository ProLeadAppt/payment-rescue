'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  invoice_number: string;
  description: string;
  amount: number;
  status: string;
  due_date: string;
  customers: { name: string } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customer_name: '',
    amount: '',
    description: '',
    due_date: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setUser(session.user);
    loadInvoices(session.user.id);
  }

  async function loadInvoices(userId: string) {
    setLoading(true);
    const { data } = await supabase
      .from('invoices')
      .select('*, customers(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setInvoices(data || []);
    setLoading(false);
  }

  async function handleAddInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    // Create or find customer
    let customerId = null;
    if (newInvoice.customer_name) {
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', newInvoice.customer_name)
        .single();

      if (existing) {
        customerId = existing.id;
      } else {
        const { data: created } = await supabase
          .from('customers')
          .insert({ user_id: user.id, name: newInvoice.customer_name })
          .select('id')
          .single();
        customerId = created?.id;
      }
    }

    // Create invoice
    const { error } = await supabase.from('invoices').insert({
      user_id: user.id,
      customer_id: customerId,
      amount: parseFloat(newInvoice.amount),
      description: newInvoice.description,
      due_date: newInvoice.due_date || null,
      status: 'pending',
      source: 'manual',
    });

    if (!error) {
      setShowAddModal(false);
      setNewInvoice({ customer_name: '', amount: '', description: '', due_date: '' });
      loadInvoices(user.id);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  // Calculate stats
  const stats = {
    totalOutstanding: invoices.filter(i => ['pending', 'overdue'].includes(i.status)).reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter(i => i.status === 'overdue').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-[#f59e0b]/10 text-[#d97706]',
    overdue: 'bg-[#ea2261]/10 text-[#ea2261]',
    paid: 'bg-[#15be53]/10 text-[#108c3d]',
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5edf5] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#533afd] to-[#7c5cff] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-lg text-[#061b31]">Payment Rescue</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#64748d] hidden sm:block">{user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-[#64748d] hover:text-[#061b31] transition">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Outstanding', value: `$${stats.totalOutstanding.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`, color: 'text-[#061b31]' },
            { label: 'Overdue', value: stats.overdue.toString(), color: 'text-[#ea2261]' },
            { label: 'Pending', value: stats.pending.toString(), color: 'text-[#d97706]' },
            { label: 'Paid (Total)', value: `$${stats.paid.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`, color: 'text-[#108c3d]' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg border border-[#e5edf5] p-5">
              <div className="text-xs text-[#64748d] mb-1">{stat.label}</div>
              <div className={`text-2xl font-medium ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg border border-[#e5edf5]">
          <div className="px-6 py-4 border-b border-[#e5edf5] flex items-center justify-between">
            <h2 className="font-medium text-[#061b31]">Invoices</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              + Add Invoice
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#64748d]">Loading...</div>
          ) : invoices.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[#f8f7ff] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#b9b9f9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#061b31] mb-2">No invoices yet</h3>
              <p className="text-[#64748d] text-sm mb-4">Add your first invoice to get started with automated reminders.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium px-6 py-2 rounded-lg transition"
              >
                + Add Invoice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8f7ff]">
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Customer</th>
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Amount</th>
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Due Date</th>
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5edf5]">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-[#f8f7ff]">
                      <td className="px-6 py-4 text-[#061b31]">
                        <div className="font-medium">{invoice.customers?.name || '—'}</div>
                        {invoice.description && <div className="text-xs text-[#64748d]">{invoice.description}</div>}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#061b31]">
                        ${invoice.amount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-[#64748d]">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-AU') : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColors[invoice.status] || ''}`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg border border-[#e5edf5] p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-[#061b31] mb-4">Add Invoice</h3>
            <form onSubmit={handleAddInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">Customer name</label>
                <input
                  type="text"
                  value={newInvoice.customer_name}
                  onChange={(e) => setNewInvoice({ ...newInvoice, customer_name: e.target.value })}
                  placeholder="e.g. John Smith"
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">Amount (AUD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  placeholder="e.g. 1500.00"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">Description</label>
                <input
                  type="text"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                  placeholder="e.g. Lawn mowing - March"
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">Due date</label>
                <input
                  type="date"
                  value={newInvoice.due_date}
                  onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] focus:border-[#533afd] outline-none transition text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#e5edf5] text-[#64748d] text-sm font-medium hover:bg-[#f8f7ff] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium py-3 rounded-lg transition"
                >
                  Add Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
