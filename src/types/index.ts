export interface Profile {
  id: string;
  user_id: string;
  slug: string;
  full_name: string;
  headline: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  image_path: string | null;
  is_public: boolean;
  is_verified: boolean;
  noindex: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileLink {
  id: string;
  profile_id: string;
  label: string;
  url: string;
  position: number;
}

export interface Report {
  id: string;
  profile_id: string;
  reason: string;
  details: string | null;
  status: 'pending' | 'reviewed' | 'dismissed';
  reporter_email: string | null;
  created_at: string;
}

export interface ProfileWithLinks extends Profile {
  links: ProfileLink[];
}

export type SocialPlatform =
  | 'instagram'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'x'
  | 'website'
  | 'facebook'
  | 'tiktok'
  | 'other';

export const SOCIAL_PLATFORMS: Record<SocialPlatform, { label: string; icon: string; baseUrl?: string }> = {
  instagram: { label: 'Instagram', icon: 'instagram', baseUrl: 'https://instagram.com/' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin', baseUrl: 'https://linkedin.com/in/' },
  github: { label: 'GitHub', icon: 'github', baseUrl: 'https://github.com/' },
  youtube: { label: 'YouTube', icon: 'youtube', baseUrl: 'https://youtube.com/' },
  x: { label: 'X (Twitter)', icon: 'x', baseUrl: 'https://x.com/' },
  website: { label: 'Website', icon: 'globe' },
  facebook: { label: 'Facebook', icon: 'facebook', baseUrl: 'https://facebook.com/' },
  tiktok: { label: 'TikTok', icon: 'tiktok', baseUrl: 'https://tiktok.com/@' },
  other: { label: 'Link', icon: 'link' },
};

export const RESERVED_SLUGS = [
  'admin', 'login', 'signup', 'api', 'dashboard', 'explore',
  'about', 'privacy', 'terms', 'contact', 'people', 'settings',
  'auth', 'verify-email', 'forgot-password', 'reset-password',
  'sitemap', 'robots', 'favicon', 'public', 'static', 'assets',
  'blog', 'help', 'support', 'feedback', 'report', 'search',
  'home', 'index', 'new', 'edit', 'delete', 'create', 'update',
];
