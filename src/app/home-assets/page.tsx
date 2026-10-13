// src/app/home-assets/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface HomeStats {
  apps: number;
  polls: number;
  videos: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<HomeStats>({ apps: 0, polls: 0, videos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeStats() {
      const { count: countApps } = await supabase.from('applications').select('*', { count: 'exact', head: true });
      const { count: countPolls } = await supabase.from('polls').select('*', { count: 'exact', head: true });
      const { count: countVideos } = await supabase.from('videos').select('*', { count: 'exact', head: true }).eq('status', 'Approved');

      setStats({
        apps: countApps || 0,
        polls: countPolls || 0,
        videos: countVideos || 0
      });
      setLoading(false);
    }
    fetchHomeStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* নেভিগেশন বার */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-emerald-600 tracking-tight">নাগরিক কণ্ঠ</Link>
          <div className="flex items-center space-x-3">
            <Link href="/track" className="text-sm font-medium text-gray-600 hover:text-gray-900">আবেদন ট্র্যাকিং</Link>
            <Link href="/login" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition">লগইন</Link>
            <Link href="/register" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition">নিবন্ধন</Link>
          </div>
        </div>
      </nav>

      {/* হিরো সেকশন */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center md:py-24">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-none">
            স্বাধীন, শান্তিপূর্ণ ও <span className="text-emerald-600">স্বচ্ছ নাগরিক কণ্ঠস্বর</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            বাংলাদেশের নাগরিকদের জন্য একটি সম্পূর্ণ স্বাধীন ও ভেরিফাইড পাবলিক প্ল্যাটফর্ম। এখানে আপনার প্রস্তাবনা জমা দিন, জনমত জরিপে অংশ নিন এবং আপনার এলাকার বাস্তব চিত্র তুলে ধরুন।
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/dashboard/create-application" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow flex items-center gap-2 transition">
              আবেদন বা প্রস্তাবনা জমা দিন →
            </Link>
            <Link href="/polls" className="px-6 py-3 bg-white border border-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-50 transition">
              চলমান জরিপসমূহ দেখুন
            </Link>
          </div>
        </div>

        {/* রিয়েল-টাইম পরিসংখ্যান বার */}
        <div className="bg-white border-y py-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <span className="block text-4xl font-black text-gray-950 font-mono">{loading ? '...' : stats.apps}</span>
              <span className="text-sm font-medium text-gray-500 mt-1 block">জমাকৃত নাগরিক আবেদন</span>
            </div>
            <div className="p-4">
              <span className="block text-4xl font-black text-gray-950 font-mono">{loading ? '...' : stats.polls}</span>
              <span className="text-sm font-medium text-gray-500 mt-1 block">সক্রিয় জনমত জরিপ</span>
            </div>
            <div className="p-4">
              <span className="block text-4xl font-black text-gray-950 font-mono">{loading ? '...' : stats.videos}</span>
              <span className="text-sm font-medium text-gray-500 mt-1 block">অনুমোদিত ভিডিও সাক্ষ্য</span>
            </div>
          </div>
        </div>

        {/* প্ল্যাটফর্ম ফিচার সেকশন */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-950 text-center mb-12">প্ল্যাটফর্মের মূল সেবাসমূহ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/create-application" className="bg-white p-6 rounded-xl border hover:shadow-md transition flex flex-col items-start">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 mb-4">📄</div>
              <h3 className="font-bold text-gray-950 mb-1">Public Proposal</h3>
              <p className="text-sm text-gray-600">জনস্বার্থমূলক সমস্যার জন্য ট্র্যাকিং নম্বর সহ আবেদন সাবমিট করুন।</p>
            </Link>

            <Link href="/polls" className="bg-white p-6 rounded-xl border hover:shadow-md transition flex flex-col items-start">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mb-4">🗳️</div>
              <h3 className="font-bold text-gray-950 mb-1">Secret Ballot</h3>
              <p className="text-sm text-gray-600">গোপন ব্যালট এবং ওয়ান-ভোট পলিসির মাধ্যমে জরিপে অংশগ্রহণ করুন।</p>
            </Link>

            <Link href="/videos" className="bg-white p-6 rounded-xl border hover:shadow-md transition flex flex-col items-start">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-600 mb-4">📹</div>
              <h3 className="font-bold text-gray-950 mb-1">Video Gallery</h3>
              <p className="text-sm text-gray-600">ইউটিউব এম্বেড ফিল্টারিংয়ের মাধ্যমে মাঠপর্যায়ের কন্টেন্ট দেখুন।</p>
            </Link>

            <Link href="/transparency" className="bg-white p-6 rounded-xl border hover:shadow-md transition flex flex-col items-start">
              <div className="p-3 bg-purple-50 rounded-lg text-purple-600 mb-4">📊</div>
              <h3 className="font-bold text-gray-950 mb-1">Live Audit</h3>
              <p className="text-sm text-gray-600">অ্যাপ্লিকেশনের রিয়েল-টাইম লাইভ পরিসংখ্যান সরাসরি যাচাই করুন।</p>
            </Link>
          </div>
        </div>
      </main>

      {/* ফুটার */}
      <footer className="bg-white border-t py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© ২০২৬ নাগরিক কণ্ঠ প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">🛡️ এটি কোনো অফিশিয়াল সরকারি প্ল্যাটফর্ম নয়</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
