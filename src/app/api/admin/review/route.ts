// src/app/api/admin/review/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { targetId, targetType, newStatus, comments, adminUserId } = await request.json();

    // ১. রিকোয়েস্টকারী আসলে রিভিউয়ার বা এডমিন কিনা তা ডেটাবেস থেকে নিশ্চিত করা (Server-Side RBAC)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', adminUserId)
      .single();

    if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'reviewer')) {
      return NextResponse.json({ error: 'অননুমোদিত অ্যাক্সেস! আপনার এই কাজটি করার পারমিশন নেই।' }, { status: 403 });
    }

    // ২. টার্গেট টাইপ অনুযায়ী স্ট্যাটাস আপডেট করা (Application অথবা Video)
    if (targetType === 'application') {
      const { error: appError } = await supabase
        .from('applications')
        .update({ status: newStatus, reviewer_comments: comments, updated_at: new Date().toISOString() })
        .eq('id', targetId);

      if (appError) throw appError;
    } else if (targetType === 'video') {
      const { error: vidError } = await supabase
        .from('videos')
        .update({ status: newStatus })
        .eq('id', targetId);

      if (vidError) throw vidError;
    }

    return NextResponse.json({ success: true, message: 'সফলভাবে আপডেট করা হয়েছে।' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'সার্ভারে অভ্যন্তরীণ ত্রুটি ঘটেছে।';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
