import { RESERVED_SLUGS } from '@/types';

export function generateSlug(fullName: string, city?: string | null): string {
  const base = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!base) return 'profile';
  return base;
}

export function generateSlugVariants(fullName: string, city?: string | null): string[] {
  const base = generateSlug(fullName);
  const variants = [base];

  if (city) {
    const citySlug = city
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    variants.push(`${base}-${citySlug}`);
  }

  for (let i = 1; i <= 99; i++) {
    variants.push(`${base}-${i}`);
  }

  return variants;
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}

const PROFANITY_LIST = [
  'fuck', 'shit', 'ass', 'damn', 'bitch', 'dick', 'pussy', 'cock',
  'nigger', 'faggot', 'retard', 'whore', 'slut',
];

export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase();
  return PROFANITY_LIST.some((word) => lower.includes(word));
}

export function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function buildMetaDescription(fullName: string, headline?: string | null, bio?: string | null): string {
  let desc = fullName;
  if (headline) desc += ` - ${headline}`;
  if (bio) {
    const remaining = 155 - desc.length - ' | Maybout'.length - 3;
    if (remaining > 20) {
      desc += `. ${bio.substring(0, remaining)}`;
    }
  }
  desc += ' | Maybout';
  return truncate(desc, 160);
}

export function calculateSeoScore(profile: {
  full_name: string;
  headline?: string | null;
  bio?: string | null;
  city?: string | null;
  image_path?: string | null;
  links?: { url: string }[];
}): { score: number; tips: string[] } {
  let score = 0;
  const tips: string[] = [];

  if (profile.full_name) score += 15;

  if (profile.image_path) {
    score += 20;
  } else {
    tips.push('Add a profile photo to improve your visibility in search results.');
  }

  if (profile.headline) {
    score += 15;
  } else {
    tips.push('Add a headline (e.g. "Photographer from Pune") to help people find you.');
  }

  if (profile.bio) {
    if (profile.bio.length >= 100) {
      score += 20;
    } else {
      score += 10;
      tips.push('Write a bio of at least 100 characters for better SEO.');
    }
  } else {
    tips.push('Add a bio to tell people about yourself.');
  }

  if (profile.city) {
    score += 10;
  } else {
    tips.push('Add your city to appear in location-based searches.');
  }

  const linkCount = profile.links?.length ?? 0;
  if (linkCount >= 3) {
    score += 20;
  } else if (linkCount > 0) {
    score += 10;
    tips.push(`Add at least ${3 - linkCount} more social links for a stronger profile.`);
  } else {
    tips.push('Add at least 3 social links (Instagram, LinkedIn, GitHub, etc.).');
  }

  return { score: Math.min(score, 100), tips };
}
