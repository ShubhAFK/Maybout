import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeText } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  const { profile_id, reason, details, reporter_email } = body;

  if (!profile_id || !reason) {
    return NextResponse.json({ error: 'Profile ID and reason are required.' }, { status: 400 });
  }

  const validReasons = ['impersonation', 'harassment', 'fake_profile', 'privacy', 'spam', 'other'];
  if (!validReasons.includes(reason)) {
    return NextResponse.json({ error: 'Invalid reason.' }, { status: 400 });
  }

  const { error } = await supabase.from('reports').insert({
    profile_id,
    reason,
    details: details ? sanitizeText(details) : null,
    reporter_email: reporter_email || null,
    status: 'pending',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
