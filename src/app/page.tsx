import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Rescue — Get Paid Faster, Chase Less | SMS Payment Reminders for Australian Tradies",
  description: "Payment Rescue sends automatic SMS payment reminders when your invoices go overdue. Built for Australian tradies and service businesses. Connect Xero or Square. Free beta access.",
  keywords: ["payment reminders Australia", "SMS invoice chasing", "tradie payment tool", "Xero SMS reminders", "get paid faster", "late payment solution"],
  openGraph: {
    title: "Payment Rescue — Get Paid Faster, Chase Less",
    description: "Automatic SMS payment reminders for Australian tradies. Connect Xero or Square. Free beta access.",
    type: "website",
    url: "https://paymentrescue.com.au",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://paymentrescue.com.au",
  },
};

// Structured data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Payment Rescue",
  description: "SMS payment reminders for Australian tradies and service businesses",
  url: "https://paymentrescue.com.au",
  founder: {
    "@type": "Person",
    name: "Tyson Kaye",
    description: "Nunukul/Quandamooka founder building AI-powered payment solutions for Australian trades",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "AU",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Payment Rescue work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Connect your Xero or Square account. Payment Rescue automatically detects overdue invoices and sends SMS payment reminders at 7, 14, and 21 days overdue. You track everything in a simple dashboard. It takes about 2 minutes to set up.",
      },
    },
    {
      "@type": "Question",
      name: "What does Payment Rescue cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beta testers get free access for one month. After that, Starter is $29/month (up to 50 invoices), Pro is $59/month (unlimited), Growth is $99/month (multi-user + advanced features). Month-to-month, no lock-in.",
      },
    },
    {
      "@type": "Question",
      name: "Will my clients know the SMS is automated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The SMS messages sound like they're from you. You set the tone — friendly, firm, or somewhere in between. Your clients just see a text from your business number.",
      },
    },
    {
      "@type": "Question",
      name: "Which tools does Payment Rescue connect to?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently Xero and Square. We're adding Stripe and QuickBooks soon. If you use something else, let us know and we'll prioritise it.",
      },
    },
    {
      "@type": "Question",
      name: "Is Payment Rescue just another invoicing tool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Invoicing tools CREATE invoices. Payment Rescue CHASES them. We work WITH your existing tools — you keep using Xero or Square, we handle the automated follow-up.",
      },
    },
    {
      "@type": "Question",
      name: "When will Payment Rescue be available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beta launches June 2026. First 10 users get free access. Join the waitlist to secure your spot.",
      },
    },
  ],
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Payment Rescue",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "29",
    priceCurrency: "AUD",
  },
  description: "SMS payment reminders for Australian tradies and service businesses. Automates invoice follow-up via SMS.",
};

export default function Home() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Skip Link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 text-xl font-bold text-blue-600 no-underline hover:no-underline">
            💳 Payment Rescue
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-md font-semibold">BETA</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">How it works</a>
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900">FAQ</a>
            <a href="#cta" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 no-underline">Get Early Access</a>
          </div>
        </div>
      </nav>

      <main id="main">
        {/* Hero */}
        <section className="py-20 md:py-28 text-center px-6" aria-labelledby="hero-heading">
          <div className="max-w-4xl mx-auto">
            <h1 id="hero-heading" className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
              Stop chasing money.
              <br />
              <span className="text-blue-600">Start getting paid.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Payment Rescue sends automatic SMS reminders when your invoices go overdue. Sounds like you, not a debt collector. Built for Australian tradies and service businesses.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-6" action="#" method="POST" aria-label="Join the beta waitlist">
              <input
                type="email"
                placeholder="Enter your email"
                required
                aria-label="Email address"
                className="flex-1 min-w-0 px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:border-blue-600 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-7 py-4 bg-blue-600 text-white rounded-xl text-base font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Get Early Access →
              </button>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">✓ Free for first 10 beta users</span>
              <span className="flex items-center gap-1.5">✓ No lock-in</span>
              <span className="flex items-center gap-1.5">✓ Works with Xero & Square</span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-slate-900 py-16" aria-label="Key statistics">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-black text-white">58%</div>
                <div className="text-sm text-slate-400 mt-1">of Aussie small businesses experience late payments</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-white">$13B</div>
                <div className="text-sm text-slate-400 mt-1">lost to late payments every year in Australia</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-white">$53K</div>
                <div className="text-sm text-slate-400 mt-1">average unpaid invoices per small business</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-white">98%</div>
                <div className="text-sm text-slate-400 mt-1">SMS open rate vs 20% for email</div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="py-20 md:py-28 px-6" aria-labelledby="problem-heading">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2" id="problem-heading">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Late payments are killing your business</h2>
            <p className="text-lg text-gray-600 max-w-2xl mb-12">You did the work. You sent the invoice. Now you're waiting, stressing, and sending awkward texts. It doesn't have to be this way.</p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: "😤", title: "Awkward follow-ups", desc: "You feel guilty chasing money you're already owed. Every text feels pushy. But you have bills to pay too." },
                { icon: "⏰", title: "Wasted time", desc: "26 hours a year chasing invoices. That's $2,000+ of your productive time spent on collections instead of actual work." },
                { icon: "💸", title: "Cash flow stress", desc: "One late payment can mess up your whole month. Materials, wages, rent — all waiting on someone else's timeline." },
                { icon: "📱", title: "No system", desc: "You're relying on memory and awkward texts. No process. No automation. Just hope and discomfort." },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                  <div className="text-3xl mb-4" aria-hidden="true">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28 px-6 bg-blue-50" aria-labelledby="solution-heading">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2" id="solution-heading">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Set it and forget it</h2>
            <p className="text-lg text-gray-600 max-w-2xl mb-12">Connect your existing tools, set your reminder tone, and let Payment Rescue chase your invoices for you.</p>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { num: 1, title: "Connect", desc: "Link your Xero or Square account. Takes 2 minutes." },
                { num: 2, title: "Set your tone", desc: "Choose how firm or friendly your reminders sound." },
                { num: 3, title: "Automate", desc: "SMS reminders go out at 7, 14, and 21 days overdue." },
                { num: 4, title: "Get paid", desc: "Track payments in your dashboard. No more awkward texts." },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-full inline-flex items-center justify-center text-xl font-bold mb-4" aria-hidden="true">{step.num}</div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm max-w-xs mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 md:py-28 px-6" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2" id="features-heading">Features</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-12">Everything you need. Nothing you don't.</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "💬", title: "SMS-first reminders", desc: "98% of SMS messages get opened. Your clients will actually see the reminder." },
                { icon: "🎨", title: "Your tone, not ours", desc: "Reminders sound like you wrote them. Professional, not corporate." },
                { icon: "📊", title: "Payment dashboard", desc: "See who's paid, who's overdue, and who needs a nudge." },
                { icon: "🔗", title: "Works with your tools", desc: "Connects to Xero, Square, and Stripe. No rip-and-replace." },
                { icon: "⚡", title: "3-step sequence", desc: "Friendly → Firm → Final notice. Escalates automatically." },
                { icon: "🇦🇺", title: "Built for Australia", desc: "Designed for Australian tradies. Local Australian company." },
              ].map((feat, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-xl transition-shadow">
                  <div className="text-2xl mb-3" aria-hidden="true">{feat.icon}</div>
                  <h3 className="text-base font-bold mb-2">{feat.title}</h3>
                  <p className="text-gray-600 text-sm">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 md:py-28 px-6 bg-gray-50" aria-labelledby="pricing-heading">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2" id="pricing-heading">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mb-12">No hidden fees. No lock-in. Cancel anytime.</p>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Starter */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center">
                <h3 className="text-lg font-bold mb-1">Starter</h3>
                <p className="text-sm text-gray-500 mb-4">For solo tradies</p>
                <div className="text-4xl font-black mb-6">$29<span className="text-base font-normal text-gray-500">/mo</span></div>
                <ul className="text-left space-y-3 mb-8">
                  {["Up to 50 invoices/month", "SMS reminders (3-step)", "Xero or Square connection", "Basic dashboard", "Email support"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm"><span className="text-green-600 font-bold">✓</span> {f}</li>
                  ))}
                </ul>
                <a href="#cta" className="block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 no-underline text-center">Get Started</a>
              </div>
              {/* Pro */}
              <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 text-center relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full font-semibold">Most Popular</span>
                <h3 className="text-lg font-bold mb-1">Pro</h3>
                <p className="text-sm text-gray-500 mb-4">For growing businesses</p>
                <div className="text-4xl font-black mb-6">$59<span className="text-base font-normal text-gray-500">/mo</span></div>
                <ul className="text-left space-y-3 mb-8">
                  {["Unlimited invoices", "SMS + email reminders", "Xero, Square + Stripe", "Advanced dashboard", "Priority support"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm"><span className="text-green-600 font-bold">✓</span> {f}</li>
                  ))}
                </ul>
                <a href="#cta" className="block w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 no-underline text-center">Get Started</a>
              </div>
              {/* Growth */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center">
                <h3 className="text-lg font-bold mb-1">Growth</h3>
                <p className="text-sm text-gray-500 mb-4">For teams & high volume</p>
                <div className="text-4xl font-black mb-6">$99<span className="text-base font-normal text-gray-500">/mo</span></div>
                <ul className="text-left space-y-3 mb-8">
                  {["Everything in Pro", "Multi-user access", "Dispute evidence packs", "Cash flow insights", "Phone support"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm"><span className="text-green-600 font-bold">✓</span> {f}</li>
                  ))}
                </ul>
                <a href="#cta" className="block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 no-underline text-center">Get Started</a>
              </div>
            </div>
            <p className="text-center mt-8 text-sm text-gray-500">Beta testers get free access for the first month on any plan.</p>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 md:py-28 px-6 bg-white border-y border-gray-200" aria-labelledby="social-heading">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2" id="social-heading">Beta Testers Say</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-12">Real tradies. Real results.</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "I was spending every Friday afternoon chasing invoices. Now it just... happens. I got paid 2 weeks faster on average.", name: "Beta Tester", role: "Landscaper, Gold Coast" },
                { quote: "The SMS reminders sound like me, not some robot. My clients actually respond to them. Game changer.", name: "Beta Tester", role: "Electrician, Brisbane" },
                { quote: "I didn't realise how much time I was wasting on follow-ups until I stopped. Getting that time back is huge.", name: "Beta Tester", role: "Plumber, Sydney" },
              ].map((t, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <div className="text-amber-500 text-lg mb-3" aria-label="5 stars">★★★★★</div>
                  <p className="italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="font-bold text-sm">— {t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              ))}
            </div>
            <p className="text-center mt-6 text-sm text-gray-400 italic">These are placeholder testimonials. Real ones coming from our first beta users.</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-28 px-6 bg-white" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2" id="faq-heading">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-12">Common questions</h2>
            <div className="space-y-0 divide-y divide-gray-200">
              {[
                { q: "How does Payment Rescue work?", a: "Connect your Xero or Square account. Payment Rescue automatically detects overdue invoices and sends SMS reminders at 7, 14, and 21 days. You track everything in a simple dashboard. It takes about 2 minutes to set up." },
                { q: "What does Payment Rescue cost?", a: "Beta testers get free access for one month. After that, Starter is $29/month (up to 50 invoices), Pro is $59/month (unlimited), Growth is $99/month (multi-user + advanced features). Month-to-month, no lock-in." },
                { q: "Will my clients know the SMS is automated?", a: "No. The SMS messages sound like they're from you. You set the tone — friendly, firm, or somewhere in between. Your clients just see a text from your business number." },
                { q: "Which tools does Payment Rescue connect to?", a: "Currently Xero and Square. We're adding Stripe and QuickBooks soon. If you use something else, let us know and we'll prioritise it." },
                { q: "Is Payment Rescue just another invoicing tool?", a: "No. Invoicing tools CREATE invoices. Payment Rescue CHASES them. We work WITH your existing tools — you keep using Xero or Square, we handle the follow-up." },
                { q: "When will Payment Rescue be available?", a: "Beta launches June 2026. First 10 users get free access. Join the waitlist to secure your spot." },
              ].map((faq, i) => (
                <div key={i} className="py-7">
                  <h3 className="text-base font-bold mb-3">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-20 md:py-28 px-6 bg-slate-900 text-center" aria-labelledby="cta-heading">
          <div className="max-w-3xl mx-auto">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to stop chasing money?</h2>
            <p className="text-lg text-slate-300 mb-10">We're looking for 10 Australian tradies to test Payment Rescue free for one month. No lock-in. No credit card. Just faster payments.</p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto" action="#" method="POST" aria-label="Join the beta waitlist">
              <input
                type="email"
                placeholder="Enter your email"
                required
                aria-label="Email address"
                className="flex-1 min-w-0 px-5 py-4 border-2 border-slate-700 rounded-xl text-base bg-slate-800 text-white placeholder-slate-400 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-7 py-4 bg-blue-600 text-white rounded-xl text-base font-bold hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Join the Beta →
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-200 text-center" role="contentinfo">
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <a href="#" className="text-sm text-gray-600">Privacy</a>
          <a href="#" className="text-sm text-gray-600">Terms</a>
          <a href="mailto:hello@paymentrescue.com.au" className="text-sm text-gray-600">Contact</a>
        </div>
        <p className="text-sm text-gray-500">© 2026 Payment Rescue. Built in Australia for Australian tradies and service businesses.</p>
      </footer>
    </>
  );
}
