import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  generateSlugVariants,
  isReservedSlug,
  sanitizeText,
  containsProfanity,
  isValidUrl,
} from '@/lib/utils';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, links(*)')
    .eq('user_id', user.id)
    .single();

  return NextResponse.json({ profile });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { full_name, headline, bio, city, country, links, noindex } = body;

  if (!full_name || full_name.trim().length < 2) {
    return NextResponse.json({ error: 'Full name is required (at least 2 characters).' }, { status: 400 });
  }
  if (bio && bio.length > 500) {
    return NextResponse.json({ error: 'Bio must be 500 characters or less.' }, { status: 400 });
  }
  if (links && links.length > 10) {
    return NextResponse.json({ error: 'Maximum 10 links allowed.' }, { status: 400 });
  }

  const sanitizedName = sanitizeText(full_name);
  const sanitizedHeadline = headline ? sanitizeText(headline) : null;
  const sanitizedBio = bio ? sanitizeText(bio) : null;

  if (containsProfanity(sanitizedName) || (sanitizedHeadline && containsProfanity(sanitizedHeadline)) || (sanitizedBio && containsProfanity(sanitizedBio))) {
    return NextResponse.json({ error: 'Content contains inappropriate language.' }, { status: 400 });
  }

  if (links) {
    for (const link of links) {
      if (!isValidUrl(link.url)) {
        return NextResponse.json({ error: `Invalid URL: ${link.url}. Only HTTPS URLs are allowed.` }, { status: 400 });
      }
    }
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id, slug')
    .eq('user_id', user.id)
    .maybeSingle();

  let slug = existing?.slug || '';
  const needsSlug = !slug || slug === '';

  if (needsSlug) {
    const variants = generateSlugVariants(sanitizedName, city);
    for (const candidate of variants) {
      if (isReservedSlug(candidate)) continue;
      const { data: taken } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', candidate)
        .neq('user_id', user.id)
        .maybeSingle();
      if (!taken) {
        slug = candidate;
        break;
      }
    }
    if (!slug) {
      return NextResponse.json({ error: 'Could not generate a unique URL. Try a different name.' }, { status: 400 });
    }
  }

  const profileData = {
    user_id: user.id,
    slug,
    full_name: sanitizedName,
    headline: sanitizedHeadline,
    bio: sanitizedBio,
    city: city ? sanitizeText(city) : null,
    country: country ? sanitizeText(country) : null,
    noindex: noindex ?? false,
    is_public: true,
    updated_at: new Date().toISOString(),
  };

  const { data: savedProfile, error: profileError } = await supabase
    .from('profiles')
    .upsert({ ...profileData, is_verified: true }, { onConflict: 'user_id' })
    .select('id')
    .single();
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });
  const profileId = savedProfile.id;

  if (links) {
    await supabase.from('links').delete().eq('profile_id', profileId);
    if (links.length > 0) {
      const linkRows = links.map((l: { label: string; url: string }, i: number) => ({
        profile_id: profileId,
        label: sanitizeText(l.label),
        url: l.url,
        position: i,
      }));
      await supabase.from('links').insert(linkRows);
    }
  }

  const { data: updated } = await supabase
    .from('profiles')
    .select('*, links(*)')
    .eq('id', profileId)
    .single();

  return NextResponse.json({ profile: updated });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, slug, image_path')
    .eq('user_id', user.id)
    .single();

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  if (profile.image_path) {
    await supabase.storage.from('profile-images').remove([profile.image_path]);
  }

  await supabase.from('links').delete().eq('profile_id', profile.id);
  await supabase.from('profiles').delete().eq('id', profile.id);

  return NextResponse.json({ success: true, deletedSlug: profile.slug });
}
