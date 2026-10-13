'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { getYouTubeId } from '@/utils/video';
import { useRouter } from 'next/navigation';

export default function SubmitVideoPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
    setErrorMsg('');
    setSuccessMsg('');

    const ytId = getYouTubeId(url);
    if (!ytId) {
      setErrorMsg('অনুগ্রহ করে একটি সঠিক YouTube ভিডিও লিঙ্ক (URL) প্রদান করুন।');
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from('videos')
      .insert([
        {
          submitter_id: user.id,
          title,
          caption: caption || null,
          youtube_url: url,
          youtube_id: ytId,
          status: 'Pending'
        }
      ]);

    if (error) {
      setErrorMsg('ভিডিও লিঙ্ক জমা দেওয়া যায়নি: ' + error.message);
    } else {
      setSuccessMsg('YOUR_VIDEO_SUBMITTED_SUCCESSFULLY');
      setTitle('');
      setCaption('');
      setUrl('');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-950 border-b pb-3 mb-6">জনস্বার্থমূলক ভিডিও লিঙ্ক জমা দিন</h1>

        {errorMsg && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{errorMsg}</div>}
        {successMsg && <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm font-semibold">আপনার ভিডিওটি সফলভাবে পর্যালোচনার (Review) জন্য জমা হয়েছে।</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ভিডিওর শিরোনাম</label>
            <input type="text" required placeholder="উদাঃ আমাদের এলাকার ভাঙা ব্রিজের বাস্তব চিত্র" className="mt-1 block w-full p-2.5 border rounded-md" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">YouTube ভিডিও ইউআরএল (URL)</label>
            <input type="url" required placeholder="https://youtube.com..." className="mt-1 block w-full p-2.5 border rounded-md font-mono" value={url} onChange={e => setUrl(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)</label>
            <textarea rows={3} placeholder="ভিডিওটির বিষয়বস্তু সম্পর্কে সংক্ষেপে কিছু লিখুন..." className="mt-1 block w-full p-2.5 border rounded-md" value={caption} onChange={e => setCaption(e.target.value)}></textarea>
          </div>

          <div className="p-3 bg-amber-50 text-amber-800 rounded-md text-xs space-y-1">
            <p className="font-bold">⚠️ নিয়মনীতি ও সতর্কবার্তা:</p>
            <p>১. ভিডিওটি অবশ্যই জনস্বার্থ এবং সম্পূর্ণ শান্তিপূর্ণ নাগরিক অধিকার সংশ্লিষ্ট হতে হবে।</p>
            <p>২. কোনো প্রকার সহিংসতা, উস্কানিমূলক বক্তব্য বা কারো ব্যক্তিগত গোপনীয়তা ক্ষুণ্ন করে এমন কন্টেন্ট অনুমোদন করা হবে না।</p>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold transition">
            {submitting ? 'জমা হচ্ছে...' : 'ভিডিও লিঙ্ক সাবমিট করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}
