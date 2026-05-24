'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        // Map common errors to friendly messages
        const msg = loginError.message;
        if (msg.includes('Invalid login')) {
          setError('Invalid email or password. Please try again.');
        } else if (msg.includes('Email not confirmed')) {
          setError('Please verify your email first. Check your inbox for the confirmation link.');
        } else {
          setError(msg);
        }
        return;
      }

      // Sync session to server-side cookies (so middleware recognizes it)
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: sessionData.session.access_token,
            refresh_token: sessionData.session.refresh_token,
          }),
        });
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col">
      {/* Subtle top accent */}
      <div className="h-1 bg-gradient-to-r from-[#533afd] via-[#7c5cff] to-[#f96bee]"></div>

      {/* Header */}
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#533afd] to-[#7c5cff] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-semibold text-[#061b31] hidden sm:inline">Payment Rescue</span>
        </Link>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-xl border border-[#e5edf5] p-8 shadow-sm transform transition-all duration-500 hover:shadow-xl">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-light text-[#061b31] tracking-tight mb-2">Welcome back</h1>
              <p className="text-[#64748d] text-sm mt-0">Sign in to your Payment Rescue dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#273951] mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com.au"
                  required
                  autoComplete="email"
                  autoFocus
                  className="w-full px-5 py-4 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#a0aec0] focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 outline-none transition-all duration-200 hover:border-[#d1d5db]"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#273951] mb-2 flex items-center">
                  Password
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 p-1 rounded hover:text-[#273951] transition-colors duration-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    autoComplete="current-password"
                    className="w-full px-5 py-4 pr-11 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#a0aec0] focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/10 outline-none transition-all duration-200 hover:border-[#d1d5db]"
                  />
                </div>
              </div>

              {/* Remember + Forgot (placeholder) */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#e5edf5] text-[#533afd] focus:ring-[#533afd]/20" />
                  <span className="text-sm text-[#64748d]">Remember me</span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-[#ea2261]/10 border border-[#ea2261]/15 rounded-lg text-[#ea2261] text-sm flex items-start gap-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 018 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-[#533afd] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#4434d4] focus:outline-none focus:ring-2 focus:ring-[#533afd]/50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform duration-200 active:scale-[0.98] shadow-lg shadow-[#533afd]/20"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M9 16h9a1 1 0 001-1v-1a1 1 0 00-1-1v-1a1 1 0 001-1h-9a1 1 0 001-1v1a1 1 0 001-1h-9a1 1 0 00-1 1v1z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                    <span>Sign in</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-[#64748d]">Don't have an account? </span>
              <Link href="/signup" className="text-sm text-[#533afd] font-medium hover:underline transition-colors duration-200">
                Start free trial
              </Link>
            </div>
          </div>

          {/* Trust line */}
          <p className="text-center text-xs text-[#a0aec0] mt-6">
            Secure login · Your data is encrypted with TLS 1.3
          </p>
        </div>
      </main>
    </div>
  );
}