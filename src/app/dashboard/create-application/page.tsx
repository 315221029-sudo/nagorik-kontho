// src/app/dashboard/create-application/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CreateApplicationPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('সড়ক ও যোগাযোগ');
  const [authority, setAuthority] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // রিঅ্যাক্ট স্ট্যান্ডার্ড উপায়ে সুরক্ষিত রিডাইরেক্ট হ্যান্ডেল করা
  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>;
  if (!user || !profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    // ৮ ডিজিটের ইউনিক ট্র্যাকিং নম্বর জেনারেট করা
    const trackingNumber = 'NK-' + Math.floor(10000000 + Math.random() * 90000000).toString();

    const { error } = await supabase
      .from('applications')
      .insert([
        {
          user_id: user.id,
          tracking_number: trackingNumber,
          title,
          description,
          category,
          target_authority: authority,
          status: 'Submitted'
        }
      ]);

    if (error) {
      setMessage('⚠️ আবেদন জমা দেওয়া যায়নি: ' + error.message);
    } else {
      setMessage(`✅ আপনার আবেদনটি সফলভাবে জমা হয়েছে। ট্র্যাকিং নম্বর: ${trackingNumber}`);
      setTitle('');
      setDescription('');
      setAuthority('');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-950 border-b pb-3 mb-6">নতুন নাগরিক আবেদন/প্রস্তাবনা</h1>

        {message && (
          <div className={`p-4 rounded-md mb-6 text-sm font-medium ${message.startsWith('⚠️') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">আবেদনের শিরোনাম</label>
            <input type="text" required placeholder="উদাঃ মিরপুর ১০ নম্বর গোলচত্বরের ভাঙা রাস্তা সংস্কারের আবেদন" className="mt-1 block w-full p-2.5 border rounded-md focus:ring-emerald-500 focus:border-emerald-500" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ক্যাটাগরি</label>
            <select className="mt-1 block w-full p-2.5 border rounded-md bg-white focus:ring-emerald-500 focus:border-emerald-500" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="সড়ক ও যোগাযোগ">সড়ক ও যোগাযোগ</option>
              <option value="জনস্বাস্থ্য ও স্যানিটেশন">জনস্বাস্থ্য ও স্যানিটেশন</option>
              <option value="আইন-শৃঙ্খলা ও নিরাপত্তা">আইন-শৃঙ্খলা ও নিরাপত্তা</option>
              <option value="স্থানীয় প্রশাসন দুর্নীতি">স্থানীয় প্রশাসন ও দুর্নীতি প্রতিরোধ</option>
              <option value="অন্যান্য">অন্যান্য</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">টার্গেট কর্তৃপক্ষ/দপ্তর</label>
            <input type="text" required placeholder="উদাঃ ঢাকা উত্তর সিটি কর্পোরেশন (DNCC)" className="mt-1 block w-full p-2.5 border rounded-md focus:ring-emerald-500 focus:border-emerald-500" value={authority} onChange={e => setAuthority(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">বিস্তারিত বিবরণ ও প্রস্তাবনা</label>
            <textarea rows={5} required placeholder="সমস্যার বিবরণ এবং সম্ভাব্য সমাধান সম্পর্কে বিস্তারিত এখানে লিখুন..." className="mt-1 block w-full p-2.5 border rounded-md focus:ring-emerald-500 focus:border-emerald-500" value={description} onChange={e => setDescription(e.target.value)}></textarea>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold shadow-md transition disabled:bg-gray-400">
            {submitting ? 'আবেদন প্রক্রিয়াকরণ হচ্ছে...' : 'ডিজিটাল আবেদন সাবমিট করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}
