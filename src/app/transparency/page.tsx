// src/app/transparency/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface StatsState {
  totalApps: number;
  approvedApps: number;
  totalPolls: number;
  totalVideos: number;
}

export default function TransparencyPage() {
  const [stats, setStats] = useState<StatsState>({ totalApps: 0, approvedApps: 0, totalPolls: 0, totalVideos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAggregateStats = async () => {
      const { count: countAllApps } = await supabase.from('applications').select('*', { count: 'exact', head: true });
      const { count: countApprovedApps } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'Approved_For_Forwarding');
      const { count: countPolls } = await supabase.from('polls').select('*', { count: 'exact', head: true });
      const { count: countVideos } = await supabase.from('videos').select('*', { count: 'exact', head: true }).eq('status', 'Approved');

      setStats({
        totalApps: countAllApps || 0,
        approvedApps: countApprovedApps || 0,
        totalPolls: countPolls || 0,
        totalVideos: countVideos || 0,
      });
      setLoading(false);
    };

    fetchAggregateStats();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">উপাত্ত লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-extrabold text-gray-950 mb-3">📊 স্বচ্ছতা ও পাবলিক অডিট পোর্টাল</h1>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
          &quot;নাগরিক কণ্ঠ&quot; অ্যাপ্লিকেশনের সমস্ত ডেটা সংগ্রহ এবং প্রক্রিয়াকরণ সম্পূর্ণ স্বচ্ছ। নিচে প্ল্যাটফর্মের রিয়েল-টাইম ভেরিফাইড পরিসংখ্যান দেওয়া হলো।
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <span className="block text-3xl font-black text-emerald-600 font-mono">{stats.totalApps}</span>
            <span className="text-sm font-medium text-gray-600 mt-1 block">মোট নাগরিক আবেদন</span>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <span className="block text-3xl font-black text-blue-600 font-mono">{stats.approvedApps}</span>
            <span className="text-sm font-medium text-gray-600 mt-1 block">অনুমোদিত ও প্রেরিত</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <span className="block text-3xl font-black text-purple-600 font-mono">{stats.totalPolls}</span>
            <span className="text-sm font-medium text-gray-600 mt-1 block">সক্রিয় জনমত জরিপ</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <span className="block text-3xl font-black text-amber-600 font-mono">{stats.totalVideos}</span>
            <span className="text-sm font-medium text-gray-600 mt-1 block">নাগরিক কন্টেন্ট সাক্ষ্য</span>
          </div>
        </div>

        <div className="mt-12 bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-left">
          <h3 className="font-bold text-emerald-900 text-lg mb-2">🛡️ ডেটা ইন্টেগ্রিটি ডিক্লেয়ারেশন</h3>
          <p className="text-sm text-emerald-800 leading-relaxed">
            এখানে প্রদর্শিত উপাত্ত সরাসরি সুনির্দিষ্ট ডেটাবেস এগ্রিগেশন কোয়েরি থেকে রেন্ডার হচ্ছে। কোনো প্রকার ফেক ডাটা বা ম্যানুয়াল এন্ট্রি এর অন্তর্ভুক্ত নয়। স্বাধীন অডিটররা চাইলে যেকোনো সময় ব্যাকএন্ড ইন্টেগ্রিটি লগ যাচাই করতে পারেন।
          </p>
        </div>
      </div>
    </div>
  );
}
