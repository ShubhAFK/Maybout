import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim());

async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  return ADMIN_EMAILS.includes(user.email || '');
}

export async function GET() {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: reports } = await supabase
    .from('reports')
    .select('*, profiles(full_name, slug)')
    .order('created_at', { ascending: false });

  return NextResponse.json({ reports });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { report_id, action, profile_id } = body;

  if (action === 'dismiss') {
    await supabase.from('reports').update({ status: 'dismissed' }).eq('id', report_id);
  } else if (action === 'unpublish') {
    await supabase.from('profiles').update({ is_public: false }).eq('id', profile_id);
    await supabase.from('reports').update({ status: 'reviewed' }).eq('id', report_id);
  } else if (action === 'delete') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('image_path')
      .eq('id', profile_id)
      .single();
    if (profile?.image_path) {
      await supabase.storage.from('profile-images').remove([profile.image_path]);
    }
    await supabase.from('links').delete().eq('profile_id', profile_id);
    await supabase.from('profiles').delete().eq('id', profile_id);
    await supabase.from('reports').update({ status: 'reviewed' }).eq('id', report_id);
  }

  return NextResponse.json({ success: true });
}
