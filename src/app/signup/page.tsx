'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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
      if (session) router.push('/dashboard');
    });
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Sign up
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { business_name: businessName },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      // Step 2: If we got a session (email confirmation disabled), go straight to dashboard
      if (signupData?.session) {
        // Update profile with business name
        if (signupData.user) {
          await supabase
            .from('profiles')
            .update({ business_name: businessName })
            .eq('id', signupData.user.id);
        }
        router.push('/dashboard');
        return;
      }

      // Step 3: If no session (email confirmation enabled), try signing in anyway
      // This works if "Confirm email" is disabled in Supabase settings
      const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signinError) {
        // Email confirmation is required — show message but still try to help
        setSuccess(true);
        return;
      }

      // Signed in successfully
      if (signinData?.user) {
        await supabase
          .from('profiles')
          .update({ business_name: businessName })
          .eq('id', signinData.user.id);
        router.push('/dashboard');
      }
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
          <div className="w-16 h-16 bg-[#f59e0b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-[#061b31] mb-2">Check your email</h2>
          <p className="text-[#64748d] text-sm mb-4">
            We sent a confirmation link to <strong>{email}</strong>. Click it to verify your account.
          </p>
          <div className="bg-[#f8f7ff] rounded-lg p-4 text-left text-sm text-[#64748d] mb-4">
            <p className="font-medium text-[#273951] mb-1">💡 Quick fix:</p>
            <p>After clicking the confirmation link, come back and <strong>sign in</strong> with your email and password.</p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="text-[#533afd] text-sm font-medium hover:underline"
          >
            Go to sign in →
          </button>
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
