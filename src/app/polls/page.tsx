// src/app/polls/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Poll {
  id: string;
  question: string;
  description: string;
  end_date: string;
}

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      // টাইমজোন কনফ্লিক্ট এড়াতে সরাসরি সব সক্রিয় জরিপ ডেটাবেস থেকে ফিল্টার ছাড়া আনা হচ্ছে
      const { data, error } = await supabase
        .from('polls')
        .select('id, question, description, end_date')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPolls(data as Poll[]);
      }
      setLoading(false);
    };

    fetchPolls();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">জরিপ তালিকা লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-950 mb-2">চলমান জনমত জরিপ</h1>
        <p className="text-gray-600 mb-8">জনস্বার্থ ও জাতীয় নীতি নির্ধারণে আপনার মতামত দিন। প্রতিটি vote মূল্যবান।</p>

        {polls.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow border text-center text-gray-500">
            এই মুহূর্তে কোনো সক্রিয় জনমত জরিপ উপলব্ধ নেই।
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-white p-6 rounded-xl shadow-md border hover:border-emerald-500 transition duration-200">
                <h2 className="text-xl font-bold text-gray-950 mb-2">{poll.question}</h2>
                <p className="text-sm text-gray-600 mb-4">{poll.description}</p>
                <div className="flex justify-between items-center pt-2 border-t text-xs">
                  <span className="text-amber-600 font-medium">⏳ শেষ সময়: {new Date(poll.end_date).toLocaleDateString('bn-BD')}</span>
                  <Link href={`/polls/${poll.id}`} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md transition text-sm">
                    মতামত দিন
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
