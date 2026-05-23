export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#061b31] font-sans antialiased">
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-[#533afd] focus:text-white focus:px-4 focus:py-2 focus:rounded">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#e5edf5]" role="navigation" aria-label="Main navigation">
        <div className="max-w-[1080px] mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#533afd] to-[#7c5cff] flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#061b31]">Payment Rescue</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">Features</a>
            <a href="#dashboard" className="text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">Dashboard</a>
            <a href="#pricing" className="text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">Pricing</a>
            <a href="#faq" className="text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#cta" className="bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium px-4 py-2 rounded transition shadow-sm">
              Start free trial
            </a>
          </div>
        </div>
      </nav>

      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7ff] via-white to-white"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#533afd]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#ea2261]/3 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative max-w-[1080px] mx-auto px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#533afd]/10 text-[#533afd] text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-[#533afd]/15">
                <span className="w-2 h-2 bg-[#15be53] rounded-full"></span>
                Built for Australian tradies
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-light tracking-[-0.02em] text-[#061b31] leading-[1.05]">
                Stop chasing invoices.
                <br />
                <span className="bg-gradient-to-r from-[#533afd] to-[#7c5cff] bg-clip-text text-transparent">Get back to the work you love.</span>
              </h1>
              
              <p className="mt-6 text-lg sm:text-xl text-[#64748d] leading-relaxed font-light max-w-2xl">
                Your customers forget. Their banks hold them up. Meanwhile you're out of pocket. 
                Payment Rescue sends automated SMS reminders so you don't have to be the bad guy.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                <a href="#cta" className="w-full sm:w-auto bg-[#533afd] hover:bg-[#4434d4] text-white font-medium px-8 py-4 rounded text-lg transition shadow-lg shadow-[#533afd]/20 text-center">
                  Start your free trial
                </a>
                <a href="#how-it-works" className="w-full sm:w-auto bg-white hover:bg-[#f8f7ff] text-[#533afd] font-medium px-8 py-4 rounded text-lg transition border border-[#b9b9f9] text-center">
                  See how it works
                </a>
              </div>
              <p className="mt-4 text-sm text-[#64748d]">No credit card required · 14-day free trial · Cancel anytime</p>
            </div>

            {/* Social proof logos */}
            <div className="mt-16 pt-8 border-t border-[#e5edf5]">
              <p className="text-xs text-[#64748d] uppercase tracking-wider mb-6 font-medium">Works with tools you already use</p>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
                {['Square', 'Xero', 'QuickBooks', 'Stripe'].map((name) => (
                  <div key={name} className="text-lg font-semibold text-[#273951] tracking-tight">{name}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-[#061b31] text-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-white/10">
              <div>
                <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">$42K</div>
                <div className="mt-2 text-sm text-white/60 font-light">average annual revenue lost per tradie to late payments</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">54%</div>
                <div className="mt-2 text-sm text-white/60 font-light">of invoices paid late by Australian businesses</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">32 days</div>
                <div className="mt-2 text-sm text-white/60 font-light">average payment delay for tradies</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">5 hrs</div>
                <div className="mt-2 text-sm text-white/60 font-light">per week wasted chasing invoices</div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem — relatable, emotional */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">Sound familiar?</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                You did the work. You sent the invoice.
                <br />
                <span className="text-[#64748d]">Now you're just waiting.</span>
              </h2>
              <p className="mt-4 text-lg text-[#64748d] font-light">
                Late payments aren't just annoying — they're killing your cash flow, your time, and your sanity.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#f8f7ff] p-8 rounded-lg border border-[#e5edf5]">
                <div className="w-10 h-10 bg-[#ea2261]/10 rounded-lg flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-[#ea2261]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#061b31] mb-2">The awkward chase</h3>
                <p className="text-[#64748d] text-sm leading-relaxed">
                  You hate chasing money. It feels pushy. But the invoice is 30 days overdue and you've got bills to pay. So you send another text. And another. And now it's personal.
                </p>
              </div>
              <div className="bg-[#f8f7ff] p-8 rounded-lg border border-[#e5edf5]">
                <div className="w-10 h-10 bg-[#533afd]/10 rounded-lg flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#061b31] mb-2">The phone tag game</h3>
                <p className="text-[#64748d] text-sm leading-relaxed">
                  You call, they don't pick up. You text, they say "I'll transfer it today." A week later — still nothing. Meanwhile you're out of pocket for materials and your subbies are asking about pay.
                </p>
              </div>
              <div className="bg-[#f8f7ff] p-8 rounded-lg border border-[#e5edf5]">
                <div className="w-10 h-10 bg-[#15be53]/10 rounded-lg flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-[#108c3d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#061b31] mb-2">The cash flow crunch</h3>
                <p className="text-[#64748d] text-sm leading-relaxed">
                  One late invoice becomes two. Then three. Suddenly you can't pay your supplier, your subbies are grumpy, and you're thinking about putting it on the credit card — again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-[#f8f7ff]">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                Set it up once. Get paid faster
                <br />
                <span className="text-[#64748d]">every time after that.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg border border-[#e5edf5] text-center">
                <div className="w-12 h-12 bg-[#533afd] text-white rounded-lg flex items-center justify-center text-lg font-medium mx-auto mb-5 shadow-lg shadow-[#533afd]/20">1</div>
                <h3 className="text-lg font-medium text-[#061b31] mb-2">Connect in 2 minutes</h3>
                <p className="text-[#64748d] text-sm leading-relaxed">
                  Link your Square, Xero, or QuickBooks account. We pull in your invoices automatically — no double entry, no spreadsheets.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border border-[#e5edf5] text-center">
                <div className="w-12 h-12 bg-[#533afd] text-white rounded-lg flex items-center justify-center text-lg font-medium mx-auto mb-5 shadow-lg shadow-[#533afd]/20">2</div>
                <h3 className="text-lg font-medium text-[#061b31] mb-2">Set your schedule</h3>
                <p className="text-[#64748d] text-sm leading-relaxed">
                  Choose when reminders go out. 7 days overdue? 14? 30? You decide. Write your own messages or use our templates — friendly, not pushy.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg border border-[#e5edf5] text-center">
                <div className="w-12 h-12 bg-[#533afd] text-white rounded-lg flex items-center justify-center text-lg font-medium mx-auto mb-5 shadow-lg shadow-[#533afd]/20">3</div>
                <h3 className="text-lg font-medium text-[#061b31] mb-2">Get paid. Chase less.</h3>
                <p className="text-[#64748d] text-sm leading-relaxed">
                  We send the reminders, track who's paid, and show you who still owes. You focus on the work. We handle the awkward conversations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Mockup */}
        <section id="dashboard" className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">Dashboard</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                Everything you need.
                <br />
                <span className="text-[#64748d]">Nothing you don't.</span>
              </h2>
              <p className="mt-4 text-lg text-[#64748d] font-light">
                A clean dashboard that shows you exactly who owes what, who's paid, and who needs a nudge. No clutter. No learning curve.
              </p>
            </div>
            
            {/* Mock Dashboard */}
            <div className="bg-white rounded-lg border border-[#e5edf5] shadow-lg shadow-[#533afd]/5 overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-[#ffffff] border-b border-[#e5edf5] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#15be53] rounded-full"></div>
                  <span className="text-sm font-medium text-[#061b31]">Invoice Overview</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-[#64748d]">Total Outstanding: <strong className="text-[#061b31]">$12,450</strong></span>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Overdue', value: '$4,200', color: 'text-[#ea2261]', bg: 'bg-[#ea2261]/10', count: '3 invoices' },
                    { label: 'Pending', value: '$8,250', color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10', count: '5 invoices' },
                    { label: 'Paid (This Month)', value: '$18,700', color: 'text-[#15be53]', bg: 'bg-[#15be53]/10', count: '12 invoices' },
                    { label: 'Sent Today', value: '$2,100', color: 'text-[#533afd]', bg: 'bg-[#533afd]/10', count: '2 invoices' },
                  ].map((card, i) => (
                    <div key={i} className={`${card.bg} rounded-lg p-4`}>
                      <div className="text-xs text-[#64748d] mb-1">{card.label}</div>
                      <div className={`text-xl font-medium ${card.color}`}>{card.value}</div>
                      <div className="text-xs text-[#64748d] mt-1">{card.count}</div>
                    </div>
                  ))}
                </div>
                
                {/* Invoice Table */}
                <div className="rounded-lg border border-[#e5edf5] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#f8f7ff] border-b border-[#e5edf5]">
                        <th className="text-left px-4 py-3 text-[#273951] font-medium">Customer</th>
                        <th className="text-left px-4 py-3 text-[#273951] font-medium">Amount</th>
                        <th className="text-left px-4 py-3 text-[#273951] font-medium">Due Date</th>
                        <th className="text-left px-4 py-3 text-[#273951] font-medium">Status</th>
                        <th className="text-left px-4 py-3 text-[#273951] font-medium">Reminders</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5edf5]">
                      {[
                        { customer: 'Green Valley Landscaping', amount: '$2,400', due: '5 days ago', status: 'Overdue', statusColor: 'bg-[#ea2261]/10 text-[#ea2261]', reminders: '3 sent' },
                        { customer: 'Summit Property Services', amount: '$1,800', due: '12 days ago', status: 'Overdue', statusColor: 'bg-[#ea2261]/10 text-[#ea2261]', reminders: '2 sent' },
                        { customer: 'Harbor View Dental', amount: '$850', due: 'Due today', status: 'Pending', statusColor: 'bg-[#f59e0b]/10 text-[#d97706]', reminders: '1 sent' },
                        { customer: 'Northside Mechanics', amount: '$3,200', due: 'Due in 5 days', status: 'Pending', statusColor: 'bg-[#f59e0b]/10 text-[#d97706]', reminders: 'Scheduled' },
                        { customer: 'Bay Fitness Centre', amount: '$4,200', due: 'Due in 10 days', status: 'Pending', statusColor: 'bg-[#f59e0b]/10 text-[#d97706]', reminders: 'Scheduled' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-[#f8f7ff]">
                          <td className="px-4 py-3 text-[#061b31]">{row.customer}</td>
                          <td className="px-4 py-3 font-medium text-[#061b31]">{row.amount}</td>
                          <td className="px-4 py-3 text-[#64748d]">{row.due}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${row.statusColor}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#64748d] text-xs">{row.reminders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 sm:py-28 bg-[#f8f7ff]">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">The difference</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                Manual chasing vs.
                <br />
                <span className="text-[#64748d]">Payment Rescue</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Without */}
              <div className="bg-white rounded-lg border border-[#e5edf5] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-[#ea2261]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#ea2261]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-[#061b31]">Without Payment Rescue</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    'Manually track invoices in spreadsheets or your head',
                    'Call and text customers — feeling awkward and pushy',
                    'Forget to follow up on some invoices entirely',
                    'Pay your suppliers late because you got paid late',
                    'Spend 5+ hours a week chasing money instead of doing work',
                    'Stress about cash flow every weekend',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#64748d]">
                      <svg className="w-4 h-4 text-[#ea2261] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* With */}
              <div className="bg-white rounded-lg border-2 border-[#533afd] p-8 relative shadow-lg shadow-[#533afd]/10">
                <div className="absolute -top-3 left-6 bg-[#533afd] text-white text-xs font-medium px-3 py-1 rounded">
                  RECOMMENDED
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-[#15be53]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#15be53]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-[#061b31]">With Payment Rescue</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    'Invoices sync automatically from Square, Xero, or QuickBooks',
                    'Friendly SMS reminders sent on autopilot — you never feel pushy',
                    'Never miss a follow-up — the system does it for you',
                    'Get paid on time, pay your suppliers on time',
                    'Save 5+ hours a week. Get back to the work you love.',
                    'Peace of mind knowing your cash flow is on track',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#64748d]">
                      <svg className="w-4 h-4 text-[#15be53] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">Features</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                Built for tradies who'd rather
                <br />
                <span className="text-[#64748d]">work than chase.</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: 'Automated SMS Reminders', desc: 'Set it and forget it. We send friendly reminders to customers with overdue invoices. Written in your voice — professional, not robotic.' },
                { title: 'Square & Xero Sync', desc: 'Connects to your existing tools. No double entry, no new software to learn. Your invoices flow in automatically.' },
                { title: 'Payment Dashboard', desc: 'See who\'s paid, who\'s late, and who needs a nudge — all in one place. Clear, not cluttered.' },
                { title: 'Auto-Escalation', desc: 'The longer an invoice goes unpaid, the more frequently we remind. You set the rules, we execute.' },
                { title: 'Chargeback Protection', desc: 'Dispute a payment? We automatically build evidence packs with timestamps and communication logs.' },
                { title: 'Cash Flow Forecast', desc: 'See expected incoming payments so you can plan your week. No more guessing when money hits your account.' },
                { title: 'Email + SMS', desc: 'Multi-channel reminders. Some people respond to text, others to email. We cover both — automatically.' },
                { title: 'Custom Templates', desc: 'Write your own reminder messages or use our proven templates. Match your brand, your tone, your style.' },
                { title: 'Built for Australia', desc: 'Australian SMS numbers, AU-friendly language, local support. We get how things work here — ABN, GST and all.' },
              ].map((f, i) => (
                <div key={i} className="bg-[#f8f7ff] p-6 rounded-lg border border-[#e5edf5] hover:border-[#b9b9f9] transition group">
                  <div className="w-8 h-8 bg-[#533afd]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#533afd]/15 transition">
                    <svg className="w-4 h-4 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-[#061b31] mb-1 text-[15px]">{f.title}</h3>
                  <p className="text-sm text-[#64748d] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 sm:py-28 bg-[#f8f7ff]">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">What tradies are saying</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                Real results from
                <br />
                <span className="text-[#64748d]">real businesses</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Jake M.', role: 'Landscaping, Brisbane', quote: 'I was spending 3-4 hours a week chasing invoices. Now it\'s maybe 30 minutes. The SMS reminders do the awkward part for me. I just got back to doing quotes instead of chasing money.', metric: '75% less time chasing' },
                { name: 'Sarah K.', role: 'Cleaning Business, Sydney', quote: 'My clients actually thank me for the reminders. They\'re professional but friendly. I\'ve had zero pushback — and my payments come in 40% faster on average.', metric: '40% faster payments' },
                { name: 'Dave R.', role: 'Plumbing, Melbourne', quote: 'Went from 40% of invoices paid late to under 10% in the first month. This thing pays for itself in the first week. I only wish I\'d found it sooner.', metric: '30% fewer late payments' },
              ].map((t, i) => (
                <div key={i} className="bg-white p-8 rounded-lg border border-[#e5edf5] shadow-sm">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#061b31] leading-relaxed mb-6 text-[15px]">&ldquo;{t.quote}&rdquo;</p>
                  <div className="border-t border-[#e5edf5] pt-4">
                    <div className="font-medium text-[#061b31] text-sm">{t.name}</div>
                    <div className="text-xs text-[#64748d]">{t.role}</div>
                    <div className="mt-2 inline-flex items-center gap-1 bg-[#15be53]/10 text-[#108c3d] text-xs font-medium px-2 py-1 rounded">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                      </svg>
                      {t.metric}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="py-16 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">Security & trust</p>
              <h2 className="text-2xl sm:text-3xl font-light text-[#061b31] tracking-tight">
                Your data is safe. We take that seriously.
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { title: 'SSL Encrypted', desc: 'All data in transit is encrypted with TLS 1.3' },
                { title: 'Australian Hosted', desc: 'Data stored in Australian data centres' },
                { title: 'No Credit Card Stored', desc: 'We never store payment details' },
                { title: 'GDPR & Privacy Act', desc: 'Compliant with Australian privacy law' },
              ].map((item, i) => (
                <div key={i} className="text-center p-4">
                  <div className="w-10 h-10 bg-[#f8f7ff] rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-[#061b31] mb-1">{item.title}</h3>
                  <p className="text-xs text-[#64748d]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">Pricing</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                Simple, honest pricing.
                <br />
                <span className="text-[#64748d]">No surprises. No lock-in.</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Starter */}
              <div className="bg-white border border-[#e5edf5] rounded-lg p-8">
                <h3 className="text-lg font-medium text-[#061b31]">Starter</h3>
                <p className="text-sm text-[#64748d] mt-1">For solo tradies</p>
                <div className="mt-6">
                  <span className="text-4xl font-light text-[#061b31] tracking-tight">$29</span>
                  <span className="text-[#64748d]">/mo</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {['Up to 50 invoices/month', 'SMS reminders', 'Square or Xero sync', 'Email support', 'Basic dashboard'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#64748d]">
                      <svg className="w-4 h-4 text-[#15be53] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#cta" className="mt-8 block w-full text-center bg-[#f8f7ff] hover:bg-[#eeeaff] text-[#533afd] font-medium py-3 rounded transition text-sm">
                  Start free trial
                </a>
              </div>

              {/* Growth */}
              <div className="bg-[#533afd] text-white rounded-lg p-8 relative shadow-xl shadow-[#533afd]/15">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ea2261] text-white text-xs font-medium px-3 py-1 rounded">
                  MOST POPULAR
                </div>
                <h3 className="text-lg font-medium">Growth</h3>
                <p className="text-sm text-white/60 mt-1">For growing businesses</p>
                <div className="mt-6">
                  <span className="text-4xl font-light tracking-tight">$59</span>
                  <span className="text-white/60">/mo</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {['Up to 200 invoices/month', 'SMS + Email reminders', 'Square, Xero & QuickBooks', 'Priority support', 'Cash flow forecast', 'Chargeback protection'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <svg className="w-4 h-4 text-[#15be53] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#cta" className="mt-8 block w-full text-center bg-white hover:bg-white/90 text-[#533afd] font-medium py-3 rounded transition text-sm">
                  Start free trial
                </a>
              </div>

              {/* Pro */}
              <div className="bg-white border border-[#e5edf5] rounded-lg p-8">
                <h3 className="text-lg font-medium text-[#061b31]">Pro</h3>
                <p className="text-sm text-[#64748d] mt-1">For established teams</p>
                <div className="mt-6">
                  <span className="text-4xl font-light text-[#061b31] tracking-tight">$99</span>
                  <span className="text-[#64748d]">/mo</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {['Unlimited invoices', 'SMS + Email + Voice call reminders', 'All integrations', 'Dedicated account manager', 'Custom templates & API access', 'White-label options'].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#64748d]">
                      <svg className="w-4 h-4 text-[#15be53] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#cta" className="mt-8 block w-full text-center bg-[#f8f7ff] hover:bg-[#eeeaff] text-[#533afd] font-medium py-3 rounded transition text-sm">
                  Start free trial
                </a>
              </div>
            </div>
            <p className="text-center mt-8 text-sm text-[#64748d]">All plans include a 14-day free trial · No credit card required · Cancel anytime</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 sm:py-28 bg-[#f8f7ff]">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight">
                Questions? We've got answers.
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { q: 'How does Payment Rescue work?', a: 'Payment Rescue connects to your existing tools (Square, Xero, QuickBooks) and automatically sends SMS reminders to customers with overdue invoices. You set the schedule — we handle the rest. No awkward phone calls, no guilt-tripping texts from you.' },
                { q: 'Do I need to change my accounting software?', a: 'No! Payment Rescue works alongside your existing tools. We pull invoice data from Square, Xero, and QuickBooks via secure API connections. We don\'t replace your accounting software — we make it better.' },
                { q: 'Will my customers find the SMS messages annoying?', a: 'Our templates are written to be friendly and professional — not aggressive. Most customers actually appreciate the reminder. It helps them stay on top of their payments too. You can customise the tone to match your brand.' },
                { q: 'What happens after the free trial?', a: 'After 14 days, you\'ll be asked to pick a plan. If you don\'t, your account pauses (not deleted). You can reactivate anytime. No surprises, no hidden charges.' },
                { q: 'Is my data secure?', a: 'Absolutely. We use SSL encryption for all data in transit. We\'re Australian-hosted, GDPR & Privacy Act compliant. We never store payment details or sensitive financial data beyond what\'s needed to send reminders.' },
                { q: 'Can I cancel anytime?', a: 'Yes. No lock-in contracts. Cancel from your dashboard at any time. If you cancel, you keep all your data and can export it anytime.' },
                { q: 'What counts as an "invoice"?', a: 'Any invoice synced from your connected account (Square, Xero, or QuickBooks). The counter refreshes monthly based on your plan.' },
                { q: 'Do you send reminders on weekends?', a: 'By default, we only send reminders Monday-Friday between 8am-6pm AEST. You can customise these windows in your settings if you prefer different hours.' },
              ].map((faq, i) => (
                <details key={i} className="group bg-white border border-[#e5edf5] rounded-lg">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="font-medium text-[#061b31] text-[15px]">{faq.q}</h3>
                    <svg className="w-5 h-5 text-[#64748d] group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="CurrentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-[#64748d] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-20 sm:py-28 bg-[#061b31] text-white">
          <div className="max-w-[1080px] mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight leading-tight">
              Stop chasing invoices.
              <br />
              <span className="bg-gradient-to-r from-[#7c5cff] to-[#f96bee] bg-clip-text text-transparent">Start getting paid.</span>
            </h2>
            <p className="mt-4 text-lg text-white/60 font-light max-w-xl mx-auto">
              Join hundreds of Australian tradies who are getting their time — and their money — back.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/signup" className="w-full sm:w-auto bg-[#533afd] hover:bg-[#4434d4] text-white font-medium px-8 py-4 rounded text-lg transition shadow-lg shadow-[#533afd]/30">
                Start your free trial
              </a>
              <a href="/signup" className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-4 rounded text-lg transition border border-white/10">
                Talk to us first
              </a>
            </div>
            <p className="mt-4 text-sm text-white/40">No credit card required · 14-day free trial · Cancel anytime</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#061b31] border-t border-white/10 py-12">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#533afd] to-[#7c5cff] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                    <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="font-semibold text-white">Payment Rescue</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">Helping Australian tradies get paid faster since 2026.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-white/40 hover:text-white/70 transition">Features</a></li>
                <li><a href="#dashboard" className="text-white/40 hover:text-white/70 transition">Dashboard</a></li>
                <li><a href="#pricing" className="text-white/40 hover:text-white/70 transition">Pricing</a></li>
                <li><a href="#faq" className="text-white/40 hover:text-white/70 transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/signup" className="text-white/40 hover:text-white/70 transition">About</a></li>
                <li><a href="/signup" className="text-white/40 hover:text-white/70 transition">Blog</a></li>
                <li><a href="/signup" className="text-white/40 hover:text-white/70 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/signup" className="text-white/40 hover:text-white/70 transition">Privacy Policy</a></li>
                <li><a href="/signup" className="text-white/40 hover:text-white/70 transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/30 text-center">
            <p>© 2026 Payment Rescue. All rights reserved. Built in Australia. 🇦🇺</p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[#e5edf5] p-4 shadow-lg">
        <a href="#cta" className="block w-full bg-[#533afd] hover:bg-[#4434d4] text-white font-medium py-3 rounded text-center text-base transition">
          Start your free trial
        </a>
      </div>
    </div>
  );
}
