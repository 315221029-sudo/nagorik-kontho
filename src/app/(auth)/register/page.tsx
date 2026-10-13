'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: data.user.id,
            full_name_bn: nameBn,
            full_name_en: nameEn,
            phone_number: phone || null,
            role: 'citizen',
          },
        ]);

      if (profileError) {
        setErrorMsg('প্রোফাইল তৈরি করতে সমস্যা হয়েছে: ' + profileError.message);
      } else {
        setSuccessMsg('নিবন্ধন সফল হয়েছে! দয়া করে আপনার ইমেইল ইনবক্স চেক করে ভেরিফাই করুন।');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-950">নাগরিক কণ্ঠ</h2>
          <p className="mt-2 text-center text-sm text-gray-600">নতুন নাগরিক অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        {errorMsg && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{errorMsg}</div>}
        {successMsg && <div className="bg-green-50 text-green-700 p-3 rounded text-sm">{successMsg}</div>}

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700">পূর্ণ নাম (বাংলায়)</label>
            <input type="text" required className="mt-1 block w-full p-2 border rounded-md" value={nameBn} onChange={e => setNameBn(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name (English)</label>
            <input type="text" required className="mt-1 block w-full p-2 border rounded-md" value={nameEn} onChange={e => text => setNameEn(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ইমেইল ঠিকানা (Email Address)</label>
            <input type="email" required className="mt-1 block w-full p-2 border rounded-md" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">মোবাইল নম্বর (ঐচ্ছিক)</label>
            <input type="tel" className="mt-1 block w-full p-2 border rounded-md" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">পাসওয়ার্ড (Password)</label>
            <input type="password" required className="mt-1 block w-full p-2 border rounded-md" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition duration-200">
            {loading ? 'প্রক্রিয়াধীন...' : 'নিবন্ধন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}
