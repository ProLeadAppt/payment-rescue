'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard?welcome=true');
    });
  }, []);

  function formatMobile(input: string): string {
    const digits = input.replace(/[^0-9]/g, '');
    // If starts with 0 and is 10 digits, convert to 61 format
    if (digits.startsWith('0') && digits.length === 10) {
      return `61${digits.slice(1)}`;
    }
    // If starts with 61 and is 11 digits, keep as is
    if (digits.startsWith('61') && digits.length === 11) {
      return digits;
    }
    return digits;
  }

  function displayMobile(stored: string): string {
    // Display 61412345678 as 0412 345 678
    if (stored.startsWith('61') && stored.length === 11) {
      const n = stored.slice(2);
      return `0${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
    }
    return stored;
  }

  const isValidMobile = (m: string) => {
    const digits = m.replace(/[^0-9]/g, '');
    // Australian: 04XX XXX XXX (10 digits starting with 0) or 614XXXXXXXX (11 digits starting with 61)
    return (digits.startsWith('04') && digits.length === 10) || (digits.startsWith('614') && digits.length === 11);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isValidMobile(mobile)) {
      setError('Please enter a valid Australian mobile number (e.g. 0412 345 678)');
      setLoading(false);
      return;
    }

    const formattedMobile = formatMobile(mobile);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { business_name: businessName, mobile: formattedMobile },
          emailRedirectTo: `${window.location.origin}/signup?confirmed=true&email=${encodeURIComponent(email)}&business=${encodeURIComponent(businessName)}`,
        },
      });

      if (signupError) {
        if (signupError.message?.toLowerCase().includes('already') || signupError.message?.toLowerCase().includes('exists')) {
          const { error: signinError } = await supabase.auth.signInWithPassword({ email, password });
          if (!signinError) {
            router.replace('/dashboard');
            return;
          }
          setError('Account already exists. Try signing in.');
          return;
        }
        setError(signupError.message);
        return;
      }

      if (data?.session) {
        if (data.user) {
          await supabase
            .from('profiles')
            .update({ business_name: businessName, mobile: formattedMobile })
            .eq('id', data.user.id);
        }

        await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          }),
        });

        router.replace('/dashboard?welcome=true');
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-xl border border-[#e5edf5] p-8 max-w-md w-full text-center transform transition-all duration-500">
          <div className="w-16 h-16 bg-[#533afd]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-[#061b31] mb-4">Check your email</h2>
          <p className="text-[#64748d] text-sm mb-6">
            We sent a confirmation link to <strong className="text-[#061b31]">{email}</strong>. Click it to verify your account.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-[#64748d]">
            <div className="w-5 h-5 border-2 border-[#533afd] border-t-transparent rounded-full animate-spin duration-200" />
            <span>Waiting for confirmation...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl border border-[#e5edf5] p-8 max-w-md w-full shadow-lg transform transition-all duration-500 hover:shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#533afd] to-[#7c5cff] flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-light text-[#061b31] mb-3">Create your account</h1>
          <p className="text-[#64748d] text-sm mt-2">14-day free trial · No credit card required</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#273951] mb-2">Business name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Jake's Landscaping"
              required
              className="w-full px-5 py-4 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/20 outline-none transition-all duration-200 hover:border-[#d1d5db]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#273951] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com.au"
              required
              className="w-full px-5 py-4 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/20 outline-none transition-all duration-200 hover:border-[#d1d5db]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#273951] mb-2 flex items-center">
              Your mobile number
              <span className="ml-2 text-xs text-[#ea2261]">*</span>
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="0412 345 678"
              required
              className="w-full px-5 py-4 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/20 outline-none transition-all duration-200 hover:border-[#d1d5db]"
            />
            <p className="text-xs text-[#64748d] mt-2">
              SMS reminders will be sent from this number so customers recognise you.
            </p>
            {mobile && !isValidMobile(mobile) && (
              <p className="mt-2 text-xs text-[#ea2261] flex items-center">
                <svg className="w-3 h-3 me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Please enter a valid Australian mobile number (e.g. 0412 345 678)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#273951] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              minLength={8}
              className="w-full px-5 py-4 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] focus:ring-2 focus:ring-[#533afd]/20 outline-none transition-all duration-200 hover:border-[#d1d5db]"
            />
          </div>

          {error && (
            <div className="p-4 bg-[#ea2261]/10 border border-[#ea2261]/20 rounded-lg text-[#ea2261] text-sm flex items-center space-x-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-[#533afd] text-white font-medium rounded-lg transition-all duration-200 hover:bg-[#4434d4] focus:outline-none focus:ring-2 focus:ring-[#533afd]/50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform duration-200 active:scale-[0.98] shadow-lg shadow-[#533afd]/20"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M9 16h9a1 1 0 001-1v-1a1 1 0 00-1-1v-1a1 1 0 001-1h-9a1 1 0 00-1 1v1a1 1 0 001 1v1a1 1 0 00-1 1h-9a1 1 0 00-1 1v1z" />
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                </svg>
                <span>Start your free trial</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748d] mt-6">
          Already have an account?{' '}
          <button onClick={() => router.push('/login')} className="text-[#533afd] font-medium hover:underline transition-colors duration-200">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}