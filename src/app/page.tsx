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
            <a href="#how-it-works" className="text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">How It Works</a>
            <a href="#pricing" className="text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">Pricing</a>
            <a href="#faq" className="text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#pricing" className="hidden sm:inline text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">Sign in</a>
            <a href="#cta" className="bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium px-4 py-2 rounded transition shadow-sm">
              Start free trial
            </a>
          </div>
        </div>
      </nav>

      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7ff] via-white to-white"></div>
          {/* Decorative gradient orb */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#533afd]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#ea2261]/3 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative max-w-[1080px] mx-auto px-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#533afd]/10 text-[#533afd] text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-[#533afd]/15">
              <span className="w-2 h-2 bg-[#15be53] rounded-full"></span>
              Trusted by Australian tradies
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-light tracking-[-0.02em] text-[#061b31] max-w-4xl mx-auto leading-[1.05]">
              Get paid faster.
              <br />
              <span className="bg-gradient-to-r from-[#533afd] to-[#7c5cff] bg-clip-text text-transparent">Chase less. Lose less.</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-[#64748d] max-w-2xl mx-auto leading-relaxed font-light">
              Automated SMS payment reminders for Australian tradies and small businesses.
              Connect your existing tools, set your schedule, and let us handle the awkward conversations.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#cta" className="w-full sm:w-auto bg-[#533afd] hover:bg-[#4434d4] text-white font-medium px-8 py-4 rounded text-lg transition shadow-lg shadow-[#533afd]/20">
                Start your free trial
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto bg-white hover:bg-[#f8f7ff] text-[#533afd] font-medium px-8 py-4 rounded text-lg transition border border-[#b9b9f9]">
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-[#64748d]">No credit card required · 14-day free trial · Cancel anytime</p>

            {/* Social proof logos */}
            <div className="mt-16 pt-8 border-t border-[#e5edf5]">
              <p className="text-xs text-[#64748d] uppercase tracking-wider mb-6 font-medium">Works with the tools you already use</p>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
                {['Square', 'Xero', 'QuickBooks', 'Stripe'].map((name) => (
                  <div key={name} className="text-lg font-semibold text-[#273951] tracking-tight">{name}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats — fintech style with dollar amounts */}
        <section className="py-16 bg-[#061b31] text-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-white/10">
              <div>
                <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">$2.2T</div>
                <div className="mt-2 text-sm text-white/60 font-light">in late payments across AU small business each year</div>
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
                <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">93%</div>
                <div className="mt-2 text-sm text-white/60 font-light">of tradies say chasing payments is their #1 admin headache</div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem — emotional, specific */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">The problem</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                You did the work. You sent the invoice.
                <br />
                <span className="text-[#64748d]">Now you're just... waiting.</span>
              </h2>
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
                  You hate chasing money. It feels pushy. But the invoice is 30 days overdue and you've got bills to pay. So you send another text. And another.
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
                  You call, they don't pick up. You text, they say "I'll transfer it today." A week later, still nothing. Meanwhile you're out of pocket.
                </p>
              </div>
              <div className="bg-[#f8f7ff] p-8 rounded-lg border border-[#e5edf5]">
                <div className="w-10 h-10 bg-[#15be53]/10 rounded-lg flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-[#108c3d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[#061b31] mb-2">The cash flow hole</h3>
                <p className="text-[#64748d] text-sm leading-relaxed">
                  Late payments create a domino effect. You can't pay your suppliers, your subbies, or yourself on time. One late invoice becomes a cash flow crisis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — clean, minimal */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-[#f8f7ff]">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                Three steps to stop chasing
                <br />
                <span className="text-[#64748d]">and start getting paid</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#533afd] text-white rounded-lg flex items-center justify-center text-lg font-medium mx-auto mb-5 shadow-lg shadow-[#533afd]/20">1</div>
                <h3 className="text-lg font-medium text-[#061b31] mb-2">Connect your tools</h3>
                <p className="text-[#64748d] text-sm leading-relaxed">
                  Link your Square, Xero, or QuickBooks account in 2 minutes. We pull in your invoices automatically. No double entry.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#533afd] text-white rounded-lg flex items-center justify-center text-lg font-medium mx-auto mb-5 shadow-lg shadow-[#533afd]/20">2</div>
                <h3 className="text-lg font-medium text-[#061b31] mb-2">Set your schedule</h3>
                <p className="text-[#64748d] text-sm leading-relaxed">
                  Choose when and how often to send reminders. Friendly, professional SMS messages that you customise. Not pushy — just persistent.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#533afd] text-white rounded-lg flex items-center justify-center text-lg font-medium mx-auto mb-5 shadow-lg shadow-[#533afd]/20">3</div>
                <h3 className="text-lg font-medium text-[#061b31] mb-2">Get paid</h3>
                <p className="text-[#64748d] text-sm leading-relaxed">
                  We send the reminders, track responses, and alert you when payments come in. Less chasing, more cash in your account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features — Stripe-style grid with icons */}
        <section id="features" className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">Features</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                Everything you need to
                <br />
                <span className="text-[#64748d]">get paid on time</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: 'SMS Reminders', desc: 'Automated text messages to customers with overdue invoices. Professional, not pushy. Written in your voice.' },
                { title: 'Square & Xero Sync', desc: 'Connects to your existing tools. No double entry, no new software to learn. Works with what you\'ve got.' },
                { title: 'Payment Dashboard', desc: 'See who\'s paid, who\'s late, and who needs a nudge — all in one place. Clear, not cluttered.' },
                { title: 'Auto-Escalation', desc: 'Automatically increase reminder frequency the longer an invoice goes unpaid. You set the rules.' },
                { title: 'Chargeback Protection', desc: 'Build evidence packs automatically if a customer disputes a payment. Documentation ready when you need it.' },
                { title: 'Cash Flow Forecast', desc: 'See expected incoming payments so you can plan your week with confidence. No more guessing.' },
                { title: 'Email + SMS', desc: 'Multi-channel reminders. Some people respond to text, others to email. Cover both bases.' },
                { title: 'Custom Templates', desc: 'Write your own reminder messages or use our proven templates. Match your brand, your tone.' },
                { title: 'Built for Australia', desc: 'Australian SMS numbers, AU-friendly language, local support. We get how things work here.' },
              ].map((f, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border border-[#e5edf5] hover:border-[#b9b9f9] transition group">
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

        {/* Social Proof — testimonials with real detail */}
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
                { name: 'Jake M.', role: 'Landscaping, Brisbane', quote: 'I was spending 3-4 hours a week chasing invoices. Now it\'s maybe 30 minutes. The SMS reminders do the awkward part for me.', metric: '75% less time chasing' },
                { name: 'Sarah K.', role: 'Cleaning Business, Sydney', quote: 'My clients actually thank me for the reminders. They\'re professional but friendly. I\'ve had zero pushback.', metric: '40% faster payments' },
                { name: 'Dave R.', role: 'Plumbing, Melbourne', quote: 'Went from 40% of invoices paid late to under 10%. This thing pays for itself in the first week.', metric: '30% reduction in late payments' },
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

        {/* Pricing — Stripe-style */}
        <section id="pricing" className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">Pricing</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                Simple, transparent pricing.
                <br />
                <span className="text-[#64748d]">No hidden fees. No lock-in.</span>
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
                  {['Unlimited invoices', 'SMS + Email + Voice', 'All integrations', 'Dedicated account manager', 'Custom templates', 'API access'].map((f, i) => (
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
                Frequently asked questions
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { q: 'How does Payment Rescue work?', a: 'Payment Rescue connects to your existing tools (Square, Xero, QuickBooks) and automatically sends SMS reminders to customers with overdue invoices. You set the schedule, we handle the rest.' },
                { q: 'How much does it cost?', a: 'Plans start from $29/month with no lock-in contract. All plans include a 14-day free trial.' },
                { q: 'Is it only for tradies?', a: 'No! Any Australian small business can use Payment Rescue. It\'s built for tradies but works for cleaners, landscapers, builders, consultants, and more.' },
                { q: 'Will my customers find the SMS messages annoying?', a: 'Our templates are written to be friendly and professional. Most customers actually appreciate the reminder — it helps them stay on top of their payments too.' },
                { q: 'What happens after the free trial?', a: 'After 14 days, you\'ll be asked to pick a plan. If you don\'t, your account will be paused (not deleted). You can reactivate anytime.' },
                { q: 'Can I customise the reminder messages?', a: 'Absolutely. You can edit the default templates or write your own. You can also set different messages for different reminder stages.' },
              ].map((faq, i) => (
                <details key={i} className="group bg-white border border-[#e5edf5] rounded-lg">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="font-medium text-[#061b31] text-[15px]">{faq.q}</h3>
                    <svg className="w-5 h-5 text-[#64748d] group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
              Stop chasing.
              <br />
              <span className="bg-gradient-to-r from-[#7c5cff] to-[#f96bee] bg-clip-text text-transparent">Start getting paid.</span>
            </h2>
            <p className="mt-4 text-lg text-white/60 font-light max-w-xl mx-auto">
              Join hundreds of Australian tradies who are getting paid faster with Payment Rescue.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#" className="w-full sm:w-auto bg-[#533afd] hover:bg-[#4434d4] text-white font-medium px-8 py-4 rounded text-lg transition shadow-lg shadow-[#533afd]/30">
                Start your free trial
              </a>
              <a href="#" className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-4 rounded text-lg transition border border-white/10">
                Book a demo
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
                <li><a href="#pricing" className="text-white/40 hover:text-white/70 transition">Pricing</a></li>
                <li><a href="#faq" className="text-white/40 hover:text-white/70 transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/40 hover:text-white/70 transition">About</a></li>
                <li><a href="#" className="text-white/40 hover:text-white/70 transition">Blog</a></li>
                <li><a href="#" className="text-white/40 hover:text-white/70 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-white/40 hover:text-white/70 transition">Privacy Policy</a></li>
                <li><a href="#" className="text-white/40 hover:text-white/70 transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/30 text-center">
            <p>© 2026 Payment Rescue. All rights reserved. Built in Australia. 🇦🇺</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
