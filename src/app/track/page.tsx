// src/app/track/page.tsx
'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TrackedApplication {
  tracking_number: string;
  title: string;
  category: string;
  target_authority: string;
  status: string;
  reviewer_comments: string | null;
  updated_at: string;
}

export default function PublicTrackingPage() {
  const [trackingInput, setTrackingInput] = useState('');
  const [result, setResult] = useState<TrackedApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [searching, setSearching] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setErrorMsg('');
    setResult(null);

    const { data, error } = await supabase
      .from('applications')
      .select('tracking_number, title, category, target_authority, status, reviewer_comments, updated_at')
      .eq('tracking_number', trackingInput.trim())
      .single();

    if (error || !data) {
      setErrorMsg('দুঃখিত, এই ট্র্যাকিং নম্বরের কোনো আবেদন খুঁজে পাওয়া যায়নি। নম্বরটি আবার চেক করুন।');
    } else {
      setResult(data as TrackedApplication);
    }
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-950 mb-2">আবেদন ট্র্যাকিং পোর্টাল</h1>
        <p className="text-sm text-center text-gray-600 mb-6">আপনার আবেদনের বর্তমান অবস্থা জানতে ট্র্যাকিং নম্বরটি প্রবেশ করুন</p>

        <form onSubmit={handleTrack} className="flex gap-2">
          <input type="text" required placeholder="উদাঃ NK-20261013-1234" className="flex-1 p-2.5 border rounded-md font-mono" value={trackingInput} onChange={e => setTrackingInput(e.target.value)} />
          <button type="submit" disabled={searching} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition">
            {searching ? 'খোঁজা হচ্ছে...' : 'ট্র্যাক'}
          </button>
        </form>

        {errorMsg && <div className="mt-4 bg-red-50 text-red-700 p-3 rounded text-sm text-center">{errorMsg}</div>}
      </div>

      {result && (
        <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-6 border-t-4 border-emerald-500">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-mono text-center">{result.tracking_number}</h2>
          
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block">আবেদনের বিষয়</span>
              <p className="text-gray-950 font-medium">{result.title}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase block">ক্যাটাগরি</span>
                <p className="text-gray-800">{result.category}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase block">টার্গেট কর্তৃপক্ষ</span>
                <p className="text-gray-800">{result.target_authority}</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block">বর্তমান স্থিতি (Status)</span>
              <span className="mt-1 inline-block px-3 py-1 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {result.status}
              </span>
            </div>

            {result.reviewer_comments && (
              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <span className="text-xs font-bold text-amber-800 block mb-1">কর্তৃপক্ষ/রিভিউয়ারের মন্তব্য:</span>
                <p className="text-sm text-amber-950">{result.reviewer_comments}</p>
              </div>
            )}

            <div className="text-right border-t pt-3">
              <span className="text-xs text-gray-400">সর্বশেষ আপডেট: {new Date(result.updated_at).toLocaleString('bn-BD')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
