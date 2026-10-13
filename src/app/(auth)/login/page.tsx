'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('ইমেইল বা পাসওয়ার্ড সঠিক নয় অথবা ইমেইল ভেরিফাই করা হয়নি।');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-950">নাগরিক কণ্ঠ</h2>
        <p className="mt-2 text-center text-sm text-gray-600">আপনার অ্যাকাউন্টে লগইন করুন</p>

        {errorMsg && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{errorMsg}</div>}

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">ইমেইল ঠিকানা</label>
            <input type="email" required className="mt-1 block w-full p-2 border rounded-md" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
            <input type="password" required className="mt-1 block w-full p-2 border rounded-md" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition">
            {loading ? 'লগইন হচ্ছে...' : 'লগইন'}
          </button>
        </form>
      </div>
    </div>
  );
}

