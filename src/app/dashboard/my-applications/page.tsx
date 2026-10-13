// src/app/dashboard/my-applications/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Application {
  id: string;
  tracking_number: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
}

export default function MyApplicationsPage() {
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchMyApps = async () => {
        const { data, error } = await supabase
          .from('applications')
          .select('id, tracking_number, title, category, status, created_at')
          .eq('applicant_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setApplications(data as Application[]);
        }
        setFetching(false);
      };
      fetchMyApps();
    }
  }, [user]);

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-950 border-b pb-3 mb-6">আমার জমাকৃত আবেদনসমূহ</h1>

        {applications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">আপনি এখনও কোনো আবেদন জমা দেননি।</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-3">ট্র্যাকিং নম্বর</th>
                  <th className="px-4 py-3">বিষয়</th>
                  <th className="px-4 py-3">ক্যাটাগরি</th>
                  <th className="px-4 py-3">স্ট্যাটাস</th>
                  <th className="px-4 py-3">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600">{app.tracking_number}</td>
                    <td className="px-4 py-3 text-gray-950 font-medium">{app.title}</td>
                    <td className="px-4 py-3 text-gray-600">{app.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Submitted' ? 'bg-blue-50 text-blue-700' :
                        app.status === 'Under_Review' ? 'bg-amber-50 text-amber-700' :
                        app.status === 'Approved_For_Forwarding' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(app.created_at).toLocaleDateString('bn-BD')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
