'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface VideoItem {
  id: string;
  title: string;
  caption: string | null;
  youtube_id: string;
}

export default function VideoGalleryPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedVideos = async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('id, title, caption, youtube_id')
        .eq('status', 'Approved')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setVideos(data as VideoItem[]);
      }
      setLoading(false);
    };

    fetchApprovedVideos();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">গ্যালারি লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-950 mb-2">নাগরিক ভিডিও গ্যালারি</h1>
        <p className="text-gray-600 mb-8">নাগরিক পাঠানো বিভিন্ন জনস্বার্থমূলক সমস্যার বাস্তব চিত্র ও ভিডিও কন্টেন্টসমূহ।</p>

        {videos.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow border text-center text-gray-500">
            এই মুহূর্তে কোনো অনুমোদিত ভিডিও প্রদর্শনের জন্য নেই।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div key={vid.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full border-0"
                    src={`https://youtube.com{vid.youtube_id}`}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold text-gray-950 line-clamp-2 mb-1">{vid.title}</h2>
                    {vid.caption && <p className="text-xs text-gray-600 line-clamp-2">{vid.caption}</p>}
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
