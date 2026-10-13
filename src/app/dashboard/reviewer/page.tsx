// src/app/dashboard/reviewer/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface PendingApplication {
  id: string;
  tracking_number: string;
  title: string;
  description: string;
  category: string;
  target_authority: string;
}

export default function ReviewerDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [apps, setApps] = useState<PendingApplication[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || (profile?.role !== 'admin' && profile?.role !== 'reviewer'))) {
      router.push('/dashboard');
    } else if (user) {
      const fetchPendingApplications = async () => {
        const { data } = await supabase
          .from('applications')
          .select('id, tracking_number, title, description, category, target_authority')
          .eq('status', 'Submitted');
        if (data) setApps(data as PendingApplication[]);
      };
      fetchPendingApplications();
    }
  }, [user, profile, loading, router]);

  const handleReviewAction = async (targetId: string, newStatus: 'Under_Review' | 'Approved_For_Forwarding' | 'Rejected') => {
    setActionLoading(targetId);
    
    const response = await fetch('/api/admin/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetId,
        targetType: 'application',
        newStatus,
        comments: comments[targetId] || '',
        adminUserId: user?.id,
      }),
    });

    const result = await response.json();
    if (result.success) {
      alert(`আবেদনটি সফলভাবে [${newStatus}] স্ট্যাটাসে আপডেট হয়েছে।`);
      // ডাটা রিলোড করা
      const { data } = await supabase
        .from('applications')
        .select('id, tracking_number, title, description, category, target_authority')
        .eq('status', 'Submitted');
      if (data) setApps(data as PendingApplication[]);
    } else {
      alert('ত্রুটি: ' + result.error);
    }
    setActionLoading(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-950 mb-6">🔍 রিভিউয়ার মডারেশন প্যানেল</h1>
        
        {apps.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            এই মুহূর্তে পর্যালোচনার জন্য কোনো নতুন আবেদন জমা নেই।
          </div>
        ) : (
          <div className="space-y-6">
            {apps.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded">
                    {app.tracking_number}
                  </span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded">
                    {app.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{app.title}</h3>
                <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">{app.description}</p>
                <p className="text-xs text-gray-500 mb-4">🎯 টার্গেট কর্তৃপক্ষ: <strong>{app.target_authority}</strong></p>
                
                <div className="mt-4 pt-4 border-t space-y-3">
                  <input
                    type="text"
                    placeholder="রিভিউ মন্তব্য বা বাতিলের কারণ এখানে লিখুন..."
                    className="w-full p-2 border rounded-md text-sm"
                    value={comments[app.id] || ''}
                    onChange={(e) => setComments({ ...comments, [app.id]: e.target.value })}
                  />
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      disabled={actionLoading === app.id}
                      onClick={() => handleReviewAction(app.id, 'Under_Review')}
                      className="px-4 py-2 bg-amber-500 text-white rounded text-xs font-semibold"
                    >
                      তদন্তাধীন (Under Review)
                    </button>
                    <button
                      disabled={actionLoading === app.id}
                      onClick={() => handleReviewAction(app.id, 'Approved_For_Forwarding')}
                      className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-semibold"
                    >
                      ফরওয়ার্ড করুন (Approve)
                    </button>
                    <button
                      disabled={actionLoading === app.id}
                      onClick={() => handleReviewAction(app.id, 'Rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded text-xs font-semibold"
                    >
                      বাতিল (Reject)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
