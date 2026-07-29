'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { marketingFaqs } from '@/lib/marketing-content';

/* ============================================
   INTERSECTION OBSERVER HOOK
   For reveal-on-scroll animations
   ============================================ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if native scroll-driven animations are supported
    const supportsNative = CSS.supports('animation-timeline', 'view()');
    if (supportsNative) {
      // Native handles it — just set visible
      setIsVisible(true);
      return;
    }

    // Fallback: IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: delay > 0 ? `${delay * 0.1}s` : undefined }}
    >
      {children}
    </div>
  );
}

/* ============================================
   MOBILE MENU COMPONENT
   ============================================ */
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`mobile-menu-overlay fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm ${isOpen ? 'open' : 'closed'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Panel */}
      <div
        className={`mobile-menu-panel fixed top-0 right-0 bottom-0 z-[70] w-[85%] max-w-sm bg-white shadow-2xl ${isOpen ? 'open' : 'closed'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#e5edf5]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#533afd] to-[#7c5cff] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                  <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-semibold text-[#061b31]">Payment Rescue</span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f8f7ff] transition"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-[#64748d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 px-6 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {[
                { href: '#features', label: 'Features' },
                { href: '#dashboard', label: 'Dashboard' },
                { href: '#faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="block py-3 px-4 text-[#061b31] font-medium rounded-lg hover:bg-[#f8f7ff] transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA area */}
          <div className="px-6 py-6 border-t border-[#e5edf5] space-y-3">
            <Link
              href="/login"
              onClick={onClose}
              className="block w-full text-center py-3 px-4 border border-[#e5edf5] hover:border-[#b9b9f9] text-[#061b31] font-medium rounded-lg transition text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={onClose}
              className="block w-full text-center bg-[#533afd] hover:bg-[#4434d4] text-white font-medium py-3 px-4 rounded-lg transition text-sm btn-press shadow-lg shadow-[#533afd]/20"
            >
              Create account
            </Link>
            <p className="text-xs text-[#64748d] text-center">Create an account to get started</p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for nav styling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#061b31] font-sans antialiased">
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-[#533afd] focus:text-white focus:px-4 focus:py-2 focus:rounded z-[80]">
        Skip to main content
      </a>

      {/* ===== NAVIGATION ===== */}
      <nav
        className={`nav-blur sticky top-0 z-50 bg-white/95 backdrop-blur border-b ${scrolled ? 'scrolled border-[#e5edf5]' : 'border-transparent'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1080px] mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#533afd] to-[#7c5cff] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#061b31]">Payment Rescue</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">Features</a>
            <a href="#dashboard" className="text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">Dashboard</a>
            <a href="#faq" className="text-sm text-[#64748d] hover:text-[#061b31] transition font-medium">FAQ</a>
          </div>

          {/* Desktop CTA + Login */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#64748d] hover:text-[#061b31] transition px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-[#533afd] hover:bg-[#4434d4] text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm btn-press"
            >
              Create account
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-[#f8f7ff] transition"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="block w-5 h-0.5 bg-[#061b31] rounded-full transition-all"></span>
            <span className="block w-5 h-0.5 bg-[#061b31] rounded-full transition-all"></span>
            <span className="block w-5 h-0.5 bg-[#061b31] rounded-full transition-all"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main id="main">

        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Background orbs — GPU-accelerated */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7ff] via-white to-white pointer-events-none"></div>
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-bl from-[#533afd]/6 to-transparent rounded-full blur-[80px] pointer-events-none orb-float-1"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] bg-gradient-to-tr from-[#ea2261]/4 to-transparent rounded-full blur-[60px] pointer-events-none orb-float-2"></div>

          <div className="relative max-w-[1080px] mx-auto px-6">
            <div className="max-w-3xl">
              <RevealSection>
                <div className="inline-flex items-center gap-2 bg-[#533afd]/8 text-[#533afd] text-sm font-medium px-4 py-2 rounded-full mb-8 border border-[#533afd]/10">
                  <span className="w-2 h-2 bg-[#15be53] rounded-full pulse-dot"></span>
                  Built for Australian tradies
                </div>
              </RevealSection>

              <RevealSection delay={1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-light tracking-[-0.02em] text-[#061b31] leading-[1.05]">
                  Stop chasing invoices.
                  <br />
                  <span className="bg-gradient-to-r from-[#533afd] to-[#7c5cff] bg-clip-text text-transparent gradient-animate">Get back to the work you love.</span>
                </h1>
              </RevealSection>

              <RevealSection delay={2}>
                <p className="mt-6 text-lg sm:text-xl text-[#64748d] leading-relaxed font-light max-w-2xl">
                  Keep invoices, customer details, and SMS payment reminders together in one simple dashboard.
                  Add an invoice, send a reminder when it is due, and mark it paid when the money arrives.
                </p>
              </RevealSection>

              <RevealSection delay={3}>
                <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
                  <a href="/signup" className="w-full sm:w-auto bg-[#533afd] hover:bg-[#4434d4] text-white font-medium px-8 py-4 rounded-lg text-lg transition shadow-lg shadow-[#533afd]/20 text-center btn-press">
                    Create your account
                  </a>
                  <a href="#how-it-works" className="w-full sm:w-auto bg-white hover:bg-[#f8f7ff] text-[#533afd] font-medium px-8 py-4 rounded-lg text-lg transition border border-[#b9b9f9] text-center btn-press">
                    See how it works
                  </a>
                </div>
                <p className="mt-4 text-sm text-[#64748d]">Create an account, add an invoice, and send your first reminder.</p>
              </RevealSection>
            </div>
          </div>
        </section>


        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <RevealSection>
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
            </RevealSection>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#ea2261]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  ),
                  iconBg: 'bg-[#ea2261]/10',
                  title: 'The awkward chase',
                  desc: "You hate chasing money. It feels pushy. But the invoice is 30 days overdue and you've got bills to pay. So you send another text. And another. And now it's personal.",
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  iconBg: 'bg-[#533afd]/10',
                  title: 'The phone tag game',
                  desc: "You call, they don't pick up. You text, they say \"I'll transfer it today.\" A week later — still nothing. Meanwhile you're out of pocket for materials and your subbies are asking about pay.",
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-[#108c3d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  iconBg: 'bg-[#15be53]/10',
                  title: 'The cash flow crunch',
                  desc: "One late invoice becomes two. Then three. Suddenly you can't pay your supplier, your subbies are grumpy, and you're thinking about putting it on the credit card — again.",
                },
              ].map((card, i) => (
                <RevealSection key={i} delay={i + 1}>
                  <div className="bg-[#f8f7ff] p-8 rounded-lg border border-[#e5edf5] h-full">
                    <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center mb-5`}>
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-medium text-[#061b31] mb-2">{card.title}</h3>
                    <p className="text-[#64748d] text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section id="how-it-works" className="py-20 sm:py-28 bg-[#f8f7ff]">
          <div className="max-w-[1080px] mx-auto px-6">
            <RevealSection>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">How it works</p>
                <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                  Add the invoice. Send the reminder.
                  <br />
                  <span className="text-[#64748d]">See what still needs attention.</span>
                </h2>
              </div>
            </RevealSection>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Add the invoice', desc: 'Enter the customer, amount, due date, and phone number. Each invoice stays tied to your account.' },
                { step: '2', title: 'Send an SMS reminder', desc: 'Choose the invoice and send a payment reminder from the dashboard when it needs a follow-up.' },
                { step: '3', title: 'Track the outcome', desc: "See the reminder count, review what is still outstanding, and mark the invoice paid when it is settled." },
              ].map((item, i) => (
                <RevealSection key={i} delay={i + 1}>
                  <div className="bg-white p-8 rounded-lg border border-[#e5edf5] text-center hover-lift h-full">
                    <div className="w-12 h-12 bg-[#533afd] text-white rounded-lg flex items-center justify-center text-lg font-medium mx-auto mb-5 shadow-lg shadow-[#533afd]/20">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-medium text-[#061b31] mb-2">{item.title}</h3>
                    <p className="text-[#64748d] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DASHBOARD MOCKUP ===== */}
        <section id="dashboard" className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <RevealSection>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">Dashboard</p>
                <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                  Everything you need.
                  <br />
                  <span className="text-[#64748d]">Nothing you don't.</span>
                </h2>
                <p className="mt-4 text-lg text-[#64748d] font-light">
                  An illustrative view of how invoices, payment status, due dates, and reminder counts appear in the dashboard.
                </p>
              </div>
            </RevealSection>

            <RevealSection delay={2}>
              <div className="bg-white rounded-lg border border-[#e5edf5] shadow-xl shadow-[#533afd]/5 overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-[#ffffff] border-b border-[#e5edf5] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-[#15be53] rounded-full pulse-dot"></div>
                    <span className="text-sm font-medium text-[#061b31]">Invoice Overview</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-[#64748d]">Total Outstanding: <strong className="text-[#061b31]">$12,450</strong></span>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Overdue', value: '$4,200', color: 'text-[#ea2261]', bg: 'bg-[#ea2261]/8', count: '3 invoices' },
                      { label: 'Pending', value: '$8,250', color: 'text-[#d97706]', bg: 'bg-[#f59e0b]/10', count: '5 invoices' },
                      { label: 'Paid (This Month)', value: '$18,700', color: 'text-[#108c3d]', bg: 'bg-[#15be53]/10', count: '12 invoices' },
                      { label: 'Sent Today', value: '$2,100', color: 'text-[#533afd]', bg: 'bg-[#533afd]/8', count: '2 invoices' },
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
                          <tr key={i} className="hover:bg-[#f8f7ff] transition-colors">
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
            </RevealSection>
          </div>
        </section>

        {/* ===== COMPARISON ===== */}
        <section className="py-20 sm:py-28 bg-[#f8f7ff]">
          <div className="max-w-[1080px] mx-auto px-6">
            <RevealSection>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">The difference</p>
                <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                  Manual invoice follow-up vs.
                  <br />
                  <span className="text-[#64748d]">one focused dashboard</span>
                </h2>
              </div>
            </RevealSection>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Without */}
              <RevealSection delay={1}>
                <div className="bg-white rounded-lg border border-[#e5edf5] p-8 h-full">
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
                      'Invoice details kept in notes, messages, or spreadsheets',
                      'Customer phone numbers stored separately',
                      'No record of which reminder was sent',
                      'Hard to see what is still outstanding',
                      'Payment status updated in more than one place',
                      'Follow-up history easy to lose',
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
              </RevealSection>

              {/* With */}
              <RevealSection delay={2}>
                <div className="bg-white rounded-lg border-2 border-[#533afd] p-8 relative shadow-xl shadow-[#533afd]/10 h-full">
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
                      'Invoices and customer details in one dashboard',
                      'SMS reminders sent from the invoice record',
                      'Reminder counts and send times recorded',
                      'Outstanding and paid invoices kept visible',
                      'Invoices marked paid from the dashboard',
                      'Business and sender details stored with the account',
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
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section id="features" className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1080px] mx-auto px-6">
            <RevealSection>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">Features</p>
                <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                  Built for tradies who'd rather
                  <br />
                  <span className="text-[#64748d]">work than chase.</span>
                </h2>
              </div>
            </RevealSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: 'Manual Invoice Tracking', desc: 'Add the customer, amount, due date, and description without moving between separate notes and spreadsheets.' },
                { title: 'SMS Payment Reminders', desc: 'Send a payment reminder from an invoice when you decide it needs a follow-up.' },
                { title: 'Payment Dashboard', desc: "See what is outstanding, what has been paid, and how many reminders each invoice has received." },
                { title: 'Reminder Records', desc: 'Keep the send time, message, provider reference, and reminder count attached to the invoice.' },
                { title: 'Mark Invoices Paid', desc: 'Update the payment status from the dashboard when an invoice is settled.' },
                { title: 'Business Settings', desc: 'Store your business and sender details with your account, including mobile verification for SMS.' },
              ].map((f, i) => (
                <RevealSection key={i} delay={(i % 3) + 1}>
                  <div className="bg-[#f8f7ff] p-6 rounded-lg border border-[#e5edf5] hover:border-[#b9b9f9] transition-all hover-lift group h-full">
                    <div className="w-8 h-8 bg-[#533afd]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#533afd]/15 transition">
                      <svg className="w-4 h-4 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-[#061b31] mb-1 text-[15px]">{f.title}</h3>
                    <p className="text-sm text-[#64748d] leading-relaxed">{f.desc}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>


        <section id="access" className="py-20 sm:py-28 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <RevealSection>
              <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">Get started</p>
              <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight leading-tight">
                Create an account and try the current workflow.
              </h2>
              <p className="mt-4 text-lg text-[#64748d] font-light">
                Pricing and paid plans are not published yet. Create an account to add invoices and send SMS reminders.
              </p>
              <a href="/signup" className="mt-8 inline-block bg-[#533afd] hover:bg-[#4434d4] text-white font-medium px-8 py-4 rounded-lg transition shadow-lg shadow-[#533afd]/20 btn-press">
                Create account
              </a>
            </RevealSection>
          </div>
        </section>


        <section id="faq" className="py-20 sm:py-28 bg-[#f8f7ff]">
          <div className="max-w-2xl mx-auto px-6">
            <RevealSection>
              <div className="text-center mb-16">
                <p className="text-sm font-medium text-[#533afd] uppercase tracking-wider mb-3">FAQ</p>
                <h2 className="text-3xl sm:text-4xl font-light text-[#061b31] tracking-tight">
                  Questions? We've got answers.
                </h2>
              </div>
            </RevealSection>

            <div className="space-y-4">
              {marketingFaqs.map((faq, i) => (
                <RevealSection key={i} delay={Math.min(i, 3)}>
                  <details className="group bg-white border border-[#e5edf5] rounded-lg hover:border-[#b9b9f9] transition-colors">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <h3 className="font-medium text-[#061b31] text-[15px] pr-4">{faq.q}</h3>
                      <svg className="w-5 h-5 text-[#64748d] group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-[#64748d] text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section id="cta" className="py-20 sm:py-28 bg-[#061b31] text-white relative overflow-hidden">
          {/* Subtle orb */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[#533afd]/10 to-transparent rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative max-w-[1080px] mx-auto px-6 text-center">
            <RevealSection>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight leading-tight">
                Stop chasing invoices.
                <br />
                <span className="bg-gradient-to-r from-[#7c5cff] to-[#f96bee] bg-clip-text text-transparent gradient-animate">Start getting paid.</span>
              </h2>
              <p className="mt-4 text-lg text-white/50 font-light max-w-xl mx-auto">
                Spend less time following up on invoices and more time doing the work.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/signup" className="w-full sm:w-auto bg-[#533afd] hover:bg-[#4434d4] text-white font-medium px-8 py-4 rounded-lg text-lg transition shadow-lg shadow-[#533afd]/30 btn-press">
                  Create your account
                </a>
                <a href="#how-it-works" className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-4 rounded-lg text-lg transition border border-white/10 btn-press">
                  See how it works
                </a>
              </div>
              <p className="mt-4 text-sm text-white/30">Add invoices manually and send SMS reminders from the dashboard.</p>
            </RevealSection>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#061b31] border-t border-white/10 py-12">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="grid sm:grid-cols-2 gap-8">
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
              <p className="text-sm text-white/40 leading-relaxed">Helping Australian tradies spend less time chasing invoices.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="text-white/40 hover:text-white/70 transition">How it works</a></li>
                <li><a href="#features" className="text-white/40 hover:text-white/70 transition">Features</a></li>
                <li><a href="#faq" className="text-white/40 hover:text-white/70 transition">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-sm text-white/30 text-center">
            <p>© 2026 Payment Rescue. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ===== STICKY MOBILE CTA ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-[#e5edf5] p-4 shadow-lg no-print">
        <a href="/signup" className="block w-full bg-[#533afd] hover:bg-[#4434d4] text-white font-medium py-3 rounded-lg text-center text-base transition btn-press shadow-lg shadow-[#533afd]/20">
          Create your account
        </a>
      </div>
    </div>
  );
}
