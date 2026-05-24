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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard?welcome=true');
    });
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { business_name: businessName },
          emailRedirectTo: `${window.location.origin}/signup?confirmed=true&email=${encodeURIComponent(email)}&business=${encodeURIComponent(businessName)}`,
        },
      });

      if (signupError) {
        // If user already exists, try signing in
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

      // If we got a session (email confirmation OFF), sync to cookies and go to dashboard
      if (data?.session) {
        // Update profile
        if (data.user) {
          await supabase
            .from('profiles')
            .update({ business_name: businessName })
            .eq('id', data.user.id);
        }

        // Sync session to server-side cookies (so middleware recognizes it)
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

      // Email confirmation required
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border border-[#e5edf5] p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#533afd]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-[#061b31] mb-2">Check your email</h2>
          <p className="text-[#64748d] text-sm mb-6">
            We sent a confirmation link to <strong className="text-[#061b31]">{email}</strong>. Click it to verify your account.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[#64748d]">
            <div className="w-4 h-4 border-2 border-[#533afd] border-t-transparent rounded-full animate-spin" />
            Waiting for confirmation...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-[#e5edf5] p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#533afd] to-[#7c5cff] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-light text-[#061b31]">Create your account</h1>
          <p className="text-[#64748d] text-sm mt-2">14-day free trial · No credit card required</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#273951] mb-1">Business name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Jake's Landscaping"
              required
              className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#273951] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com.au"
              required
              className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#273951] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-lg border border-[#e5edf5] text-[#061b31] placeholder-[#64748d] focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] outline-none transition text-sm"
            />
          </div>

          {error && (
            <div className="p-3 bg-[#ea2261]/10 border border-[#ea2261]/20 rounded-lg text-[#ea2261] text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#533afd] hover:bg-[#4434d4] text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Creating account...' : 'Start your free trial'}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748d] mt-6">
          Already have an account?{' '}
          <button onClick={() => router.push('/login')} className="text-[#533afd] font-medium hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
