'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('admin@college.edu');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(errorParam === 'unauthorized' ? 'Unauthorized role or session expired' : '');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
      <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white mb-6 transition">
        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Portal Selection
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Faculty & Admin Sign In</h2>
          <p className="text-xs text-slate-400">Institutional control & management</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-lg flex items-center gap-2 text-red-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
            placeholder="admin@college.edu"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm rounded-lg transition disabled:opacity-50 shadow-md"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-700/80 text-center">
        <p className="text-xs text-slate-400 mb-3 font-medium flex items-center justify-center gap-1">
          <KeyRound className="w-3.5 h-3.5 text-purple-400" />
          Quick Demo Login
        </p>
        <button
          onClick={() => {
            setEmail('admin@college.edu');
            setPassword('Password123!');
          }}
          className="text-xs text-purple-400 hover:text-purple-300 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-700 transition"
        >
          Fill Seed Credentials (admin@college.edu)
        </button>
      </div>
    </div>
  );
}

export default function AdminAuthPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-white text-sm">Loading login form...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
