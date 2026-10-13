// src/app/polls/[id]/page.tsx
'use client';

import React, { useEffect, useState, use } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface PollOption {
  id: number;
  text: string;
}

interface PollDetail {
  id: string;
  question: string;
  description: string;
  options: PollOption[];
  end_date: string;
}

export default function PollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const pollId = resolvedParams.id;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [poll, setPoll] = useState<PollDetail | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPollAndStatus = async () => {
      const { data: pollData } = await supabase
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .single();

      if (pollData) {
        setPoll(pollData as unknown as PollDetail);
      }

      if (user) {
        const { data: eligibility } = await supabase
          .from('poll_eligibility_records')
          .select('id')
          .eq('poll_id', pollId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (eligibility) {
          setHasVoted(true);
        }
      }
      setLoading(false);
    };

    checkPollAndStatus();
  }, [pollId, user]);

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (selectedOption === null) {
      setMessage('অনুগ্রহ করে একটি অপশন সিলেক্ট করুন।');
      return;
    }

    setSubmitting(true);
    setMessage('');

    const { error: eligibilityError } = await supabase
      .from('poll_eligibility_records')
      .insert([{ poll_id: pollId, user_id: user.id }]);

    if (eligibilityError) {
      setMessage('⚠️ আপনি ইতিমধ্যে এই জরিপে vote দিয়েছেন অথবা কোনো ত্রুটি ঘটেছে।');
      setSubmitting(false);
      return;
    }

    const { error: voteError } = await supabase
      .from('votes')
      .insert([{ poll_id: pollId, option_id: selectedOption }]);

    if (voteError) {
      setMessage('ভোট নিবন্ধনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setSubmitting(false);
    } else {
      setHasVoted(true);
      setMessage('✅ আপনার মূল্যবান ভোটটি সফলভাবে এবং নিরাপদে নিবন্ধিত হয়েছে।');
      setSubmitting(false);
    }
  };

  if (loading || authLoading) return <div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>;
  if (!poll) return <div className="min-h-screen flex items-center justify-center">দুঃখিত, জরিপটি খুঁজে পাওয়া যায়নি।</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-950 mb-3">{poll.question}</h1>
        <p className="text-gray-600 mb-6 text-sm">{poll.description}</p>

        {message && (
          <div className={`p-4 rounded-md mb-6 text-sm ${hasVoted ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        {hasVoted ? (
          <div className="text-center py-6">
            <p className="text-emerald-600 font-semibold mb-4">আপনি এই জরিপে অংশ নিয়েছেন। গোপনীয়তা সুরক্ষার স্বার্থে আপনার নির্দিষ্ট ব্যালট চয়েস ডাটাবেসে বেনামী রাখা হয়েছে।</p>
            <button onClick={() => router.push('/polls')} className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition">
              জরিপ তালিকায় ফিরে যান
            </button>
          </div>
        ) : (
          <form onSubmit={handleVoteSubmit} className="space-y-4">
            <div className="space-y-2">
              {poll.options && Array.isArray(poll.options) && poll.options.map((option) => (
                <label key={option.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition border-gray-200">
                  <input type="radio" name="poll_option" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500" checked={selectedOption === option.id} onChange={() => setSelectedOption(option.id)} />
                  <span className="ml-3 font-medium text-gray-800">{option.text}</span>
                </label>
              ))}
            </div>

            <button type="submit" disabled={submitting || !user} className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md transition mt-6 disabled:bg-gray-400">
              {!user ? 'ভোট দিতে লগইন করুন' : submitting ? 'ভোট জমা হচ্ছে...' : 'নিরাপদ ভোট প্রদান করুন'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
