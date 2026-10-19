import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { buildMetaDescription } from '@/lib/utils';
import type { Metadata } from 'next';
import type { ProfileWithLinks } from '@/types';
import { ProfilePage } from '@/components/profile/profile-page';
import { RESERVED_SLUGS } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProfile(slug: string): Promise<ProfileWithLinks | null> {
  if (RESERVED_SLUGS.includes(slug)) return null;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('profiles')
    .select('*, links(*)')
    .eq('slug', slug)
    .eq('is_public', true)
    .eq('is_verified', true)
    .single();

  if (!data) return null;

  return {
    ...data,
    links: (data.links || []).sort((a: { position: number }, b: { position: number }) => a.position - b.position),
  } as ProfileWithLinks;
}

function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${imagePath}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) return { title: 'Profile not found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maybout.com';
  const title = `${profile.full_name} | Maybout`;
  const description = buildMetaDescription(profile.full_name, profile.headline, profile.bio);
  const imageUrl = getImageUrl(profile.image_path);
  const profileUrl = `${siteUrl}/${profile.slug}`;

  return {
    title,
    description,
    alternates: { canonical: profileUrl },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: profileUrl,
      siteName: 'Maybout',
      ...(imageUrl && {
        images: [{
          url: imageUrl,
          width: 400,
          height: 400,
          alt: profile.full_name,
        }],
      }),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
    robots: profile.noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export const revalidate = 3600;

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maybout.com';
  const imageUrl = getImageUrl(profile.image_path);
  const profileUrl = `${siteUrl}/${profile.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: profile.full_name,
      ...(profile.headline && { jobTitle: profile.headline }),
      ...(profile.bio && { description: profile.bio }),
      ...(imageUrl && { image: imageUrl }),
      url: profileUrl,
      ...((profile.city || profile.country) && {
        address: {
          '@type': 'PostalAddress',
          ...(profile.city && { addressLocality: profile.city }),
          ...(profile.country && { addressCountry: profile.country }),
        },
      }),
      ...(profile.links.length > 0 && {
        sameAs: profile.links.map((l) => l.url),
      }),
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Maybout',
      url: siteUrl,
    },
    url: profileUrl,
  };

  const relatedProfiles = await getRelatedProfiles(profile.city, profile.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfilePage
        profile={profile}
        imageUrl={imageUrl}
        profileUrl={profileUrl}
        relatedProfiles={relatedProfiles}
      />
    </>
  );
}

async function getRelatedProfiles(city: string | null, currentSlug: string) {
  const supabase = createAdminClient();
  let query = supabase
    .from('profiles')
    .select('slug, full_name, headline, image_path')
    .eq('is_public', true)
    .eq('is_verified', true)
    .neq('slug', currentSlug)
    .limit(6);

  if (city) {
    query = query.eq('city', city);
  }

  const { data } = await query;
  return data || [];
}
