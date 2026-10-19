import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are allowed.' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Image must be 5 MB or smaller.' }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('slug, image_path')
    .eq('user_id', user.id)
    .single();

  if (profile?.image_path) {
    await supabase.storage.from('profile-images').remove([profile.image_path]);
  }

  const slug = profile?.slug || user.id;
  const ext = 'webp';
  const filePath = `${slug}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(filePath, buffer, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  await supabase
    .from('profiles')
    .update({ image_path: filePath, updated_at: new Date().toISOString() })
    .eq('user_id', user.id);

  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath);

  return NextResponse.json({ path: filePath, url: publicUrl });
}
