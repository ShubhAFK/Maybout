import type { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maybout.com';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let profiles: { slug: string; updated_at: string | null }[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('profiles')
      .select('slug, updated_at')
      .eq('is_public', true)
      .eq('is_verified', true)
      .order('updated_at', { ascending: false });
    profiles = data ?? [];
  }

  return [
    {
      url: siteUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/explore`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...(profiles ?? []).map((profile) => ({
      url: `${siteUrl}/${profile.slug}`,
      lastModified: profile.updated_at ? new Date(profile.updated_at) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
