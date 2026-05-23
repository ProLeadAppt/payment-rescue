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
  reminder_count: number;
  last_reminder_sent_at: string | null;
  customers: { name: string; phone: string } | null;
}

interface Settings {
  business_name: string;
  phone: string;
  mobile_message_sender: string;
  has_mobile_message_key: boolean;
}

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [sendingSms, setSendingSms] = useState<string | null>(null);
  const [smsResult, setSmsResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [newInvoice, setNewInvoice] = useState({
    customer_name: '',
    customer_phone: '',
    amount: '',
    description: '',
    due_date: '',
  });

  const [settings, setSettings] = useState<Settings>({
    business_name: '',
    phone: '',
    mobile_message_sender: '',
    has_mobile_message_key: false,
  });
  const [settingsForm, setSettingsForm] = useState({
    business_name: '',
    phone: '',
    mobile_message_api_key: '',
    mobile_message_sender: '',
  });

  useEffect(() => {
    checkUser();
    // Show welcome modal for new signups
    if (typeof window !== 'undefined' && window.location.search.includes('welcome=true')) {
      setShowWelcomeModal(true);
    }
  }, []);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setUser(session.user);
    loadInvoices(session.user.id);
    loadSettings();
  }

  async function loadSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setSettingsForm({
          business_name: data.business_name || '',
          phone: data.phone || '',
          mobile_message_api_key: '',
          mobile_message_sender: data.mobile_message_sender || '',
        });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }

  async function loadInvoices(userId: string) {
    setLoading(true);
    const { data } = await supabase
      .from('invoices')
      .select('*, customers(name, phone)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setInvoices(data || []);
    setLoading(false);
  }

  async function handleAddInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

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
          .insert({
            user_id: user.id,
            name: newInvoice.customer_name,
            phone: newInvoice.customer_phone || null,
          })
          .select('id')
          .single();
        customerId = created?.id;
      }
    }

    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;

    const { error } = await supabase.from('invoices').insert({
      user_id: user.id,
      customer_id: customerId,
      invoice_number: invoiceNumber,
      amount: parseFloat(newInvoice.amount),
      description: newInvoice.description,
      due_date: newInvoice.due_date || null,
      status: 'pending',
      source: 'manual',
    });

    if (!error) {
      setShowAddModal(false);
      setNewInvoice({ customer_name: '', customer_phone: '', amount: '', description: '', due_date: '' });
      loadInvoices(user.id);
    }
  }

  async function handleSendReminder(invoiceId: string, templateType: string = 'initial') {
    if (!settings.has_mobile_message_key) {
      setSmsResult({ type: 'error', message: 'Set up Mobile Message in Settings first.' });
      return;
    }

    setSendingSms(invoiceId);
    setSmsResult(null);

    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, templateType }),
      });

      const data = await res.json();

      if (res.ok) {
        setSmsResult({ type: 'success', message: 'SMS sent successfully!' });
        loadInvoices(user.id);
      } else {
        setSmsResult({ type: 'error', message: data.error || 'Failed to send SMS' });
      }
    } catch (e: any) {
      setSmsResult({ type: 'error', message: e.message || 'Failed to send SMS' });
    } finally {
      setSendingSms(null);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });

      if (res.ok) {
        setShowSettingsModal(false);
        setShowWelcomeModal(false);
        loadSettings();
        setSmsResult({ type: 'success', message: 'Settings saved! You can now send SMS reminders.' });
      } else {
        const data = await res.json();
        setSmsResult({ type: 'error', message: data.error || 'Failed to save settings' });
      }
    } catch (e: any) {
      setSmsResult({ type: 'error', message: e.message });
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  async function handleMarkPaid(invoiceId: string) {
    await supabase
      .from('invoices')
      .update({ status: 'paid', paid_date: new Date().toISOString().split('T')[0] })
      .eq('id', invoiceId);
    loadInvoices(user.id);
  }

  // Calculate stats
  const stats = {
    totalOutstanding: invoices
      .filter((i) => ['pending', 'sent', 'overdue'].includes(i.status))
      .reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter((i) => i.status === 'overdue').length,
    pending: invoices.filter((i) => ['pending', 'sent'].includes(i.status)).length,
    paid: invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-[#f59e0b]/10 text-[#d97706]',
    sent: 'bg-[#3b82f6]/10 text-[#2563eb]',
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
                <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="white" strokeWidth="1.5" fill="none" />
                <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-semibold text-lg text-[#061b31]">Payment Rescue</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-sm text-[#64748d] hover:text-[#533afd] transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <span className="text-sm text-[#64748d] hidden sm:block">{user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-[#64748d] hover:text-[#061b31] transition">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* SMS Result Toast */}
        {smsResult && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between ${
              smsResult.type === 'success'
                ? 'bg-[#15be53]/10 text-[#108c3d] border border-[#15be53]/20'
                : 'bg-[#ea2261]/10 text-[#ea2261] border border-[#ea2261]/20'
            }`}
          >
            <span>{smsResult.message}</span>
            <button onClick={() => setSmsResult(null)} className="text-current opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Mobile Message not configured warning */}
        {!settings.has_mobile_message_key && (
          <div className="mb-6 px-4 py-3 rounded-lg text-sm bg-[#f59e0b]/10 text-[#92400e] border border-[#f59e0b]/20 flex items-center justify-between">
            <span>
              ⚡ <strong>Almost there!</strong> Connect your Mobile Message API to start sending SMS reminders.{' '}
              <button onClick={() => setShowSettingsModal(true)} className="underline font-medium">
                Set up now →
              </button>
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Outstanding',
              value: `$${stats.totalOutstanding.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`,
              color: 'text-[#061b31]',
            },
            { label: 'Overdue', value: stats.overdue.toString(), color: 'text-[#ea2261]' },
            { label: 'Pending', value: stats.pending.toString(), color: 'text-[#d97706]' },
            {
              label: 'Paid (Total)',
              value: `$${stats.paid.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`,
              color: 'text-[#108c3d]',
            },
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
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Invoice</th>
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Customer</th>
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Amount</th>
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Due Date</th>
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Status</th>
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Reminders</th>
                    <th className="text-left px-6 py-3 text-[#273951] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5edf5]">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-[#f8f7ff]">
                      <td className="px-6 py-4 text-[#061b31] font-mono text-xs">
                        {invoice.invoice_number || invoice.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-[#061b31]">
                        <div className="font-medium">{invoice.customers?.name || '—'}</div>
                        {invoice.customers?.phone && (
                          <div className="text-xs text-[#64748d]">📱 {invoice.customers.phone}</div>
                        )}
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
                      <td className="px-6 py-4">
                        {invoice.reminder_count > 0 ? (
                          <span className="text-xs text-[#108c3d]">
                            ✓ {invoice.reminder_count} sent
                            {invoice.last_reminder_sent_at && (
                              <span className="text-[#64748d]">
                                {' '}
                                · {new Date(invoice.last_reminder_sent_at).toLocaleDateString('en-AU')}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-[#64748d]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {invoice.status !== 'paid' && (
                            <>
                              <button
                                onClick={() => handleSendReminder(invoice.id, 'initial')}
                                disabled={sendingSms === invoice.id || !invoice.customers?.phone}
                                className="text-xs px-3 py-1.5 rounded-md bg-[#533afd]/10 text-[#533afd] hover:bg-[#533afd]/20 transition disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                                title={!invoice.customers?.phone ? 'Add customer phone number first' : 'Send SMS reminder'}
                              >
                                {sendingSms === invoice.id ? '...' : '📱 SMS'}
                              </button>
                              <button
                                onClick={() => handleMarkPaid(invoice.id)}
                                className="text-xs px-3 py-1.5 rounded-md bg-[#15be53]/10 text-[#108c3d] hover:bg-[#15be53]/20 transition font-medium"
                              >
                                ✓ Paid
                              </button>
                            </>
                          )}
                          {invoice.status === 'paid' && <span className="text-xs text-[#108c3d] font-medium">✓ Paid</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Welcome Modal — shown on first signup */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg border border-[#e5edf5] p-8 max-w-lg w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#533afd]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-xl font-medium text-[#061b31] mb-2">Welcome to Payment Rescue!</h3>
              <p className="text-sm text-[#64748d]">One last step — connect your SMS provider to start sending payment reminders.</p>
            </div>

            <div className="bg-[#f8f7ff] rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-[#273951] mb-2">📱 Mobile Message Setup</h4>
              <ol className="text-sm text-[#64748d] space-y-1.5 list-decimal list-inside">
                <li>Go to <a href="https://app.mobilemessage.com.au" target="_blank" rel="noopener noreferrer" className="text-[#533afd] underline">app.mobilemessage.com.au</a></li>
                <li>Sign up free (50 free SMS credits)</li>
                <li>Go to Settings → API → Create New API Key</li>
                <li>Copy the username:password and paste below</li>
              </ol>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">API Key (username:password)</label>
                <input
                  type="text"
                  value={settingsForm.mobile_message_api_key}
                  onChange={(e) => setSettingsForm({ ...settingsForm, mobile_message_api_key: e.target.value })}
                  placeholder="username:password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">Sender ID <span className="text-[#64748d] font-normal">(your business name, max 11 chars)</span></label>
                <input
                  type="text"
                  value={settingsForm.mobile_message_sender}
                  onChange={(e) => setSettingsForm({ ...settingsForm, mobile_message_sender: e.target.value })}
                  placeholder="e.g. PayRescue"
                  maxLength={11}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWelcomeModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#e5edf5] text-[#64748d] text-sm font-medium hover:bg-[#f8f7ff] transition"
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium py-3 rounded-lg transition"
                >
                  Connect & Start
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <label className="block text-sm font-medium text-[#273951] mb-1">
                  Customer phone <span className="text-[#64748d] font-normal">(for SMS reminders)</span>
                </label>
                <input
                  type="tel"
                  value={newInvoice.customer_phone}
                  onChange={(e) => setNewInvoice({ ...newInvoice, customer_phone: e.target.value })}
                  placeholder="e.g. 0412 345 678"
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

      {/* Settings Modal */}
      {showSettingsModal && !showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg border border-[#e5edf5] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-[#061b31] mb-4">Settings</h3>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-[#273951] mb-3">Business Info</h4>
                <div>
                  <label className="block text-sm text-[#64748d] mb-1">Business name</label>
                  <input
                    type="text"
                    value={settingsForm.business_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, business_name: e.target.value })}
                    placeholder="e.g. Smith Landscaping"
                    className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                  />
                </div>
              </div>

              <div className="border-t border-[#e5edf5] pt-6">
                <h4 className="text-sm font-medium text-[#273951] mb-1">Mobile Message SMS</h4>
                <p className="text-xs text-[#64748d] mb-3">
                  Get your API credentials from{' '}
                  <a href="https://app.mobilemessage.com.au" target="_blank" rel="noopener noreferrer" className="text-[#533afd] underline">
                    app.mobilemessage.com.au
                  </a>{' '}
                  → Settings → API. Free account includes 50 SMS credits.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-[#64748d] mb-1">
                      API Key <span className="text-[#64748d]">(username:password)</span>
                    </label>
                    <input
                      type="password"
                      value={settingsForm.mobile_message_api_key}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mobile_message_api_key: e.target.value })}
                      placeholder={settings.has_mobile_message_key ? '•••••••• (configured)' : 'username:password'}
                      className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#64748d] mb-1">
                      Sender ID <span className="text-[#64748d]">(your business name, max 11 chars)</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.mobile_message_sender}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mobile_message_sender: e.target.value })}
                      placeholder="e.g. SmithLand"
                      maxLength={11}
                      className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#e5edf5] text-[#64748d] text-sm font-medium hover:bg-[#f8f7ff] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium py-3 rounded-lg transition"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
