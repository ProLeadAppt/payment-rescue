'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        setError(loginError.message);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-[#e5edf5] p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#533afd] to-[#7c5cff] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M8 5V11M5 8H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-light text-[#061b31]">Welcome back</h1>
          <p className="text-[#64748d] text-sm mt-2">Sign in to your Payment Rescue dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Your password"
              required
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
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748d] mt-6">
          Don't have an account?{' '}
          <button onClick={() => router.push('/signup')} className="text-[#533afd] font-medium hover:underline">
            Start free trial
          </button>
        </p>
      </div>
    </div>
  );
}
