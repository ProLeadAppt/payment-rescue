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
  sms_configured: boolean;
}

type OnboardingStep = 'welcome' | 'add_invoice' | 'send_sms' | 'complete';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendingSms, setSendingSms] = useState<string | null>(null);
  const [smsResult, setSmsResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [totalRemindersSent, setTotalRemindersSent] = useState(0);

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
    sms_configured: false,
  });

  const [settingsForm, setSettingsForm] = useState({
    business_name: '',
    phone: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('welcome=true')) {
      setShowWelcomeModal(true);
      setOnboardingStep('welcome');
    }
  }, []);

  // Track onboarding progress
  useEffect(() => {
    if (invoices.length === 0 && !showWelcomeModal) {
      setOnboardingStep('add_invoice');
    }
    const total = invoices.reduce((sum, inv) => sum + (inv.reminder_count || 0), 0);
    setTotalRemindersSent(total);
    if (total > 0 && onboardingStep !== 'complete') {
      setOnboardingStep('complete');
    }
  }, [invoices, showWelcomeModal]);

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
    if (!invoiceId) return;
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
        const newTotal = totalRemindersSent + 1;
        setSmsResult({ type: 'success', message: `SMS sent successfully! (ID: ${data.messageId || 'N/A'})` });
        if (newTotal === 1) {
          setShowSuccessModal(true);
        }
        loadInvoices(user.id);
      } else {
        setSmsResult({ type: 'error', message: data.error || 'Failed to send SMS' });
      }
    } catch (error: any) {
      setSmsResult({ type: 'error', message: error.message || 'Network error' });
    } finally {
      setSendingSms(null);
      setTimeout(() => setSmsResult(null), 5000);
    }
  }

  async function handleMarkPaid(invoiceId: string) {
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId);
    loadInvoices(user.id);
  }

  async function handleSaveSettings(e?: React.FormEvent) {
    if (e) e.preventDefault();

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_name: settingsForm.business_name,
        phone: settingsForm.phone,
      }),
    });

    if (res.ok) {
      setSettings({
        ...settings,
        business_name: settingsForm.business_name,
        phone: settingsForm.phone,
      });
      setShowSettingsModal(false);
      setShowWelcomeModal(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-[#f59e0b]/10 text-[#d97706]',
    sent: 'bg-[#533afd]/10 text-[#533afd]',
    paid: 'bg-[#15be53]/10 text-[#108c3d]',
    overdue: 'bg-[#ea2261]/10 text-[#ea2261]',
  };

  const now = new Date();
  const stats = {
    totalOutstanding: invoices
      .filter((i) => i.status !== 'paid')
      .reduce((sum, i) => sum + (i.amount || 0), 0),
    overdue: invoices.filter(
      (i) => i.status !== 'paid' && i.due_date && new Date(i.due_date) < now
    ).length,
    pending: invoices.filter((i) => i.status === 'pending' || i.status === 'sent').length,
    paid: invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5edf5] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#533afd] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PR</span>
          </div>
          <span className="font-medium text-[#061b31]">Payment Rescue</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#64748d] hidden sm:block">{user?.email}</span>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="text-sm px-3 py-1.5 rounded-lg border border-[#e5edf5] text-[#64748d] hover:bg-[#f8f7ff] transition"
          >
            ⚙️ Settings
          </button>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg border border-[#e5edf5] text-[#64748d] hover:bg-[#f8f7ff] transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Onboarding Progress Bar */}
        {onboardingStep !== 'complete' && (
          <div className="mb-6 bg-white rounded-lg border border-[#e5edf5] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#273951]">Getting Started</span>
              <span className="text-xs text-[#64748d]">
                {onboardingStep === 'welcome' ? 'Step 1 of 3' : onboardingStep === 'add_invoice' ? 'Step 2 of 3' : 'Step 3 of 3'}
              </span>
            </div>
            <div className="flex gap-2">
              <div className={`h-1.5 flex-1 rounded-full ${onboardingStep !== 'welcome' ? 'bg-[#15be53]' : 'bg-[#533afd]'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${onboardingStep === 'add_invoice' ? 'bg-[#533afd]' : totalRemindersSent > 0 ? 'bg-[#15be53]' : 'bg-[#e5edf5]'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${totalRemindersSent > 0 ? 'bg-[#15be53]' : 'bg-[#e5edf5]'}`} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className={`text-[10px] ${onboardingStep !== 'welcome' ? 'text-[#108c3d]' : 'text-[#533afd]'}`}>✓ Welcome</span>
              <span className={`text-[10px] ${onboardingStep === 'add_invoice' ? 'text-[#533afd]' : totalRemindersSent > 0 ? 'text-[#108c3d]' : 'text-[#64748d]'}`}>Add Invoice</span>
              <span className={`text-[10px] ${totalRemindersSent > 0 ? 'text-[#108c3d]' : 'text-[#64748d]'}`}>Send SMS</span>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-medium text-[#061b31] mb-1">
            {settings.business_name ? `Welcome, ${settings.business_name}` : 'Dashboard'}
          </h1>
          <p className="text-[#64748d] text-sm">Track invoices and send SMS reminders to get paid faster.</p>
        </div>

        {/* SMS Result Toast */}
        {smsResult && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
              smsResult.type === 'success'
                ? 'bg-[#15be53]/10 text-[#108c3d] border border-[#15be53]/20'
                : 'bg-[#ea2261]/10 text-[#ea2261] border border-[#ea2261]/20'
            }`}
          >
            {smsResult.type === 'success' ? '✅' : '❌'} {smsResult.message}
            <button onClick={() => setSmsResult(null)} className="ml-2 opacity-60 hover:opacity-100">
              ✕
            </button>
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
            <div className="p-8 md:p-12 text-center">
              {onboardingStep === 'add_invoice' ? (
                /* Onboarding Step 2: Guided Add Invoice */
                <>
                  <div className="w-16 h-16 bg-[#533afd]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="text-lg font-medium text-[#061b31] mb-2">
                    Step 2: Add your first invoice
                  </h3>
                  <p className="text-[#64748d] text-sm mb-6 max-w-sm mx-auto">
                    Enter a customer name, amount, and their phone number. You can add a due date too if you want.
                  </p>
                  <div className="bg-[#f8f7ff] rounded-lg p-6 mb-6 max-w-sm mx-auto text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#533afd] text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                      <p className="text-sm text-[#273951]">Click the button below to open the invoice form</p>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#533afd] text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                      <p className="text-sm text-[#273951]">Fill in customer name, amount, and phone number</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#533afd] text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                      <p className="text-sm text-[#273951]">Hit "Add Invoice" — you're ready to send your first SMS!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium px-8 py-3 rounded-lg transition inline-flex items-center gap-2"
                  >
                    <span>📝</span> Add Your First Invoice
                  </button>
                </>
              ) : (
                /* Fallback empty state (post-onboarding or returning user) */
                <>
                  <div className="w-16 h-16 bg-[#f8f7ff] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-[#b9b9f9]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-[#061b31] mb-2">No invoices yet</h3>
                  <p className="text-[#64748d] text-sm mb-4 max-w-sm mx-auto">
                    Add your first invoice with a customer phone number, then send an SMS reminder with one tap.
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium px-6 py-2 rounded-lg transition"
                  >
                    + Add Your First Invoice
                  </button>
                </>
              )}
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
                        {invoice.description && (
                          <div className="text-xs text-[#64748d]">{invoice.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#061b31]">
                        ${invoice.amount.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-[#64748d]">
                        {invoice.due_date
                          ? new Date(invoice.due_date).toLocaleDateString('en-AU')
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            statusColors[invoice.status] || ''
                          }`}
                        >
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
                                title={
                                  !invoice.customers?.phone
                                    ? 'Add customer phone number first'
                                    : 'Send SMS reminder'
                                }
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
                          {invoice.status === 'paid' && (
                            <span className="text-xs text-[#108c3d] font-medium">✓ Paid</span>
                          )}
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

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg border border-[#e5edf5] p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#533afd]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-medium text-[#061b31] mb-2">Welcome to Payment Rescue!</h3>
            <p className="text-sm text-[#64748d] mb-6">
              You're ready to start getting paid faster. SMS reminders are connected and working.
            </p>

            <div className="bg-[#f8f7ff] rounded-lg p-4 mb-6 text-left">
              <h4 className="text-sm font-medium text-[#273951] mb-2">How it works:</h4>
              <ol className="text-sm text-[#64748d] space-y-1.5 list-decimal list-inside">
                <li>Add an invoice with a customer phone number</li>
                <li>
                  Tap the <strong>📱 SMS</strong> button to send a reminder
                </li>
                <li>Your customer gets a friendly text message</li>
              </ol>
            </div>

            {/* Business name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#273951] mb-1 text-left">
                Your business name{' '}
                <span className="text-[#64748d] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={settingsForm.business_name}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, business_name: e.target.value })
                }
                placeholder="e.g. Smith Landscaping"
                className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
              />
            </div>

            <button
              onClick={() => { handleSaveSettings(); }}
              className="w-full bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium py-3 rounded-lg transition"
            >
              {settingsForm.business_name ? `Let's Go, ${settingsForm.business_name} →` : "Let's Go →"}
            </button>

            <button
              onClick={() => setShowWelcomeModal(false)}
              className="mt-3 text-sm text-[#64748d] hover:text-[#061b31] transition"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* First SMS Success Celebration Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg border border-[#e5edf5] p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#15be53]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-xl font-medium text-[#061b31] mb-2">You sent your first SMS!</h3>
            <p className="text-sm text-[#64748d] mb-6">
              Nice one! Your customer just got a friendly reminder. This is how you start getting paid faster.
            </p>

            <div className="bg-[#f8f7ff] rounded-lg p-4 mb-6 text-left">
              <h4 className="text-sm font-medium text-[#273951] mb-2">What's next?</h4>
              <ul className="text-sm text-[#64748d] space-y-1.5 list-disc list-inside">
                <li>Add more invoices as they come in</li>
                <li>Tap <strong>📱 SMS</strong> on any overdue invoice</li>
                <li>Mark invoices as <strong>Paid</strong> when you get payment</li>
              </ul>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium py-3 rounded-lg transition"
            >
              Got it, let's keep going →
            </button>

            <div className="mt-4 pt-4 border-t border-[#e5edf5]">
              <p className="text-xs text-[#64748d] mb-2">Loving Payment Rescue?</p>
              <a
                href="https://apps.apple.com/search?term=payment+rescue"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#533afd] hover:underline"
              >
                ⭐ Leave us a review — it helps other tradies find us
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg border border-[#e5edf5] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-[#061b31] mb-4">Add Invoice</h3>
            <form onSubmit={handleAddInvoice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">
                  Customer name <span className="text-[#ea2261]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newInvoice.customer_name}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, customer_name: e.target.value })
                  }
                  placeholder="e.g. John Smith"
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">
                  Customer phone{' '}
                  <span className="text-[#64748d] font-normal">(for SMS reminders)</span>
                </label>
                <input
                  type="tel"
                  value={newInvoice.customer_phone}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, customer_phone: e.target.value })
                  }
                  placeholder="e.g. 0412 345 678"
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#273951] mb-1">
                    Amount <span className="text-[#ea2261]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newInvoice.amount}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, amount: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#273951] mb-1">Due date</label>
                  <input
                    type="date"
                    value={newInvoice.due_date}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, due_date: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] focus:border-[#533afd] outline-none transition text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">Description</label>
                <input
                  type="text"
                  value={newInvoice.description}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, description: e.target.value })
                  }
                  placeholder="e.g. Lawn mowing - 123 Smith St"
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
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
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg border border-[#e5edf5] p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-[#061b31] mb-4">Settings</h3>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">
                  Business name
                </label>
                <input
                  type="text"
                  value={settingsForm.business_name}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, business_name: e.target.value })
                  }
                  placeholder="e.g. Smith Landscaping"
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#273951] mb-1">Phone</label>
                <input
                  type="tel"
                  value={settingsForm.phone}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, phone: e.target.value })
                  }
                  placeholder="e.g. 0412 345 678"
                  className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] outline-none transition text-sm"
                />
              </div>

              <div className="bg-[#f8f7ff] rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[#273951]">SMS Status</span>
                  {settings.sms_configured ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-[#15be53]/10 text-[#108c3d] font-medium">
                      ✓ Connected
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded bg-[#f59e0b]/10 text-[#d97706] font-medium">
                      Not configured
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748d]">
                  {settings.sms_configured
                    ? 'SMS reminders are ready to send.'
                    : 'Contact support to enable SMS reminders.'}
                </p>
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
