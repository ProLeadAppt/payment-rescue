'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [devCode, setDevCode] = useState('');
  const checkingRef = useRef(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });
  }, []);

  // Poll for session after signup (handles email confirmation redirect)
  useEffect(() => {
    if (step !== 'confirm' || checkingRef.current) return;
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('profiles')
          .update({ business_name: businessName })
          .eq('id', session.user.id);
        router.replace('/dashboard');
        return true;
      }
      return false;
    };

    // Check immediately
    checkingRef.current = true;
    checkSession().then((found) => {
      if (!found) {
        // Poll every 3 seconds for 2 minutes
        const interval = setInterval(async () => {
          const found = await checkSession();
          if (found) clearInterval(interval);
        }, 3000);
        
        // Stop after 2 minutes
        setTimeout(() => clearInterval(interval), 120000);
      }
    });
  }, [step, businessName, router]);

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
          emailRedirectTo: `${window.location.origin}/signup?confirmed=true&email=${encodeURIComponent(email)}&business=${encodeURIComponent(businessName)}`,
        },
      });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      // Step 2: Try immediate sign-in (works if email confirmation is disabled)
      const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!signinError && signinData?.session) {
        // Email confirmation NOT required — go straight to dashboard
        if (signinData.user) {
          await supabase
            .from('profiles')
            .update({ business_name: businessName })
            .eq('id', signinData.user.id);
        }
        router.replace('/dashboard');
        return;
      }

      // Step 3: Email confirmation required — show confirmation screen
      setStep('confirm');
      checkingRef.current = false; // Will trigger the polling effect
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Handle the redirect back from email confirmation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('confirmed') === 'true') {
      // User came back from email confirmation — try signing in
      const savedEmail = params.get('email');
      const savedBusiness = params.get('business') || '';
      if (savedEmail) {
        setEmail(savedEmail);
        setBusinessName(savedBusiness);
      }
    }
  }, []);

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border border-[#e5edf5] p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#533afd]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-[#061b31] mb-2">Check your email</h2>
          <p className="text-[#64748d] text-sm mb-4">
            We sent a confirmation link to <strong className="text-[#061b31]">{email}</strong>. Click it to verify your account.
          </p>
          <div className="bg-[#f8f7ff] rounded-lg p-4 text-left text-sm text-[#64748d] mb-6">
            <p className="font-medium text-[#273951] mb-1">💡 After clicking the link:</p>
            <p>Come back to this tab — we'll automatically sign you in and take you to the dashboard.</p>
          </div>
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
