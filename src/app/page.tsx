export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100" role="navigation" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PR</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Payment Rescue</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition">How It Works</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition">Pricing</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#pricing" className="hidden sm:inline text-sm text-gray-600 hover:text-gray-900 transition">Sign In</a>
            <a href="#cta" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              Start Free Trial
            </a>
          </div>
        </div>
      </nav>

      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Now available in Australia
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight">
              Get Paid Faster.
              <br />
              <span className="text-blue-600">Chase Less. Lose Less.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Automated SMS payment reminders for Australian tradies and small businesses.
              Connect your existing tools, set your schedule, and let us handle the awkward conversations.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#cta" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/25">
                Start Your Free Trial
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-xl text-lg transition border border-gray-200">
                See How It Works
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">$2.2T</div>
                <div className="mt-1 text-sm text-gray-600">In late payments across AU small business each year</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">54%</div>
                <div className="mt-1 text-sm text-gray-600">Of invoices paid late by Australian businesses</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">30+</div>
                <div className="mt-1 text-sm text-gray-600">Days average late payment delay</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">93%</div>
                <div className="mt-1 text-sm text-gray-600">Of tradies say chasing payments is their #1 admin headache</div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Sound familiar?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                You did the work. You sent the invoice. Now you're waiting... and chasing... and waiting some more.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">😤</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">The Awkward Chase</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  You hate chasing money. It feels pushy. But the invoice is 30 days overdue and you've got bills to pay.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">The Phone Tag Game</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  You call, they don't pick up. You text, they say "I'll transfer it today." A week later, still nothing.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">💸</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">The Cash Flow Hole</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Late payments create a domino effect. You can't pay your suppliers, your subbies, or yourself on time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                How Payment Rescue Works
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Three simple steps to stop chasing and start getting paid.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
                <h3 className="text-xl font-semibold mb-3">Connect Your Tools</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Link your Square, Xero, or QuickBooks account in 2 minutes. We pull in your invoices automatically.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
                <h3 className="text-xl font-semibold mb-3">Set Your Schedule</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Choose when and how often to send reminders. Friendly, professional SMS messages that you customise.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
                <h3 className="text-xl font-semibold mb-3">Get Paid</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We send the reminders, track responses, and alert you when payments come in. Less chasing, more cash.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Everything You Need to Get Paid
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Built for tradies, by people who understand the grind.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "📱", title: "SMS Reminders", desc: "Automated text messages to customers with overdue invoices. Professional, not pushy." },
                { icon: "🔗", title: "Square & Xero Sync", desc: "Connects to your existing tools. No double entry, no new software to learn." },
                { icon: "📊", title: "Payment Dashboard", desc: "See who's paid, who's late, and who needs a nudge — all in one place." },
                { icon: "⚡", title: "Auto-Escalation", desc: "Automatically increase reminder frequency the longer an invoice goes unpaid." },
                { icon: "🛡️", title: "Chargeback Protection", desc: "Build evidence packs automatically if a customer disputes a payment." },
                { icon: "📈", title: "Cash Flow Forecast", desc: "See expected incoming payments so you can plan your week with confidence." },
                { icon: "✉️", title: "Email + SMS", desc: "Multi-channel reminders. Some people respond to text, others to email." },
                { icon: "🎯", title: "Custom Templates", desc: "Write your own reminder messages or use our proven templates." },
                { icon: "🇦🇺", title: "Built for Australia", desc: "Australian SMS numbers, AU-friendly language, local support." },
              ].map((f, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 sm:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                No hidden fees. No lock-in contracts. Cancel anytime.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Starter</h3>
                <p className="text-sm text-gray-500 mt-1">Perfect for solo tradies</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {["Up to 50 invoices/month", "SMS reminders", "Square or Xero sync", "Email support", "Basic dashboard"].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#cta" className="mt-8 block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition">
                  Start Free Trial
                </a>
              </div>

              {/* Growth */}
              <div className="bg-blue-600 text-white border border-blue-600 rounded-2xl p-8 shadow-lg relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <h3 className="text-lg font-semibold">Growth</h3>
                <p className="text-sm text-blue-200 mt-1">For growing businesses</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold">$59</span>
                  <span className="text-blue-200">/mo</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {["Up to 200 invoices/month", "SMS + Email reminders", "Square, Xero & QuickBooks", "Priority support", "Cash flow forecast", "Chargeback protection"].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-100">
                      <span className="text-blue-300 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#cta" className="mt-8 block w-full text-center bg-white hover:bg-blue-50 text-blue-600 font-semibold py-3 rounded-xl transition">
                  Start Free Trial
                </a>
              </div>

              {/* Pro */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
                <p className="text-sm text-gray-500 mt-1">For established teams</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {["Unlimited invoices", "SMS + Email + Voice", "All integrations", "Dedicated account manager", "Custom templates", "API access", "White-label options"].map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#cta" className="mt-8 block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition">
                  Start Free Trial
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                What Tradies Are Saying
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Jake M.", role: "Landscaping, Brisbane", quote: "I was spending 3-4 hours a week chasing invoices. Now it's maybe 30 minutes. Game changer." },
                { name: "Sarah K.", role: "Cleaning Business, Sydney", quote: "The SMS reminders are perfect. Professional but friendly. My clients actually thank me for the reminders!" },
                { name: "Dave R.", role: "Plumbing, Melbourne", quote: "Went from 40% of invoices paid late to under 10%. This thing pays for itself in the first week." },
              ].map((t, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 sm:py-28 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-6">
              {[
                { q: "How does Payment Rescue work?", a: "Payment Rescue connects to your existing tools (Square, Xero, QuickBooks) and automatically sends SMS reminders to customers with overdue invoices. You set the schedule, we handle the rest." },
                { q: "How much does it cost?", a: "Plans start from $29/month with no lock-in contract. All plans include a 14-day free trial." },
                { q: "Is it only for tradies?", a: "No! Any Australian small business can use Payment Rescue. It's built for tradies but works for cleaners, landscapers, builders, consultants, and more." },
                { q: "Will my customers find the SMS messages annoying?", a: "Our templates are written to be friendly and professional. Most customers actually appreciate the reminder — it helps them stay on top of their payments too." },
                { q: "What happens after the free trial?", a: "After 14 days, you'll be asked to pick a plan. If you don't, your account will be paused (not deleted). You can reactivate anytime." },
                { q: "Can I customise the reminder messages?", a: "Absolutely. You can edit the default templates or write your own. You can also set different messages for different reminder stages." },
              ].map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-20 sm:py-28 bg-blue-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Stop Chasing. Start Getting Paid.
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join hundreds of Australian tradies who are getting paid faster with Payment Rescue.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#" className="w-full sm:w-auto bg-white hover:bg-blue-50 text-blue-600 font-semibold px-8 py-4 rounded-xl text-lg transition shadow-lg">
                Start Your Free Trial
              </a>
              <a href="#" className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-xl text-lg transition border border-blue-500">
                Book a Demo
              </a>
            </div>
            <p className="mt-4 text-sm text-blue-200">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PR</span>
                </div>
                <span className="font-bold text-white">Payment Rescue</span>
              </div>
              <p className="text-sm">Helping Australian tradies get paid faster since 2026.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
            <p>© 2026 Payment Rescue. All rights reserved. Built in Australia. 🇦🇺</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
