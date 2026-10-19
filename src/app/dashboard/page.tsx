'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { calculateSeoScore } from '@/lib/utils';
import { SOCIAL_PLATFORMS, type SocialPlatform } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface LinkItem {
  id?: string;
  label: string;
  url: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [noindex, setNoindex] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/profile');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setFullName(data.profile.full_name || '');
        setHeadline(data.profile.headline || '');
        setBio(data.profile.bio || '');
        setCity(data.profile.city || '');
        setCountry(data.profile.country || '');
        setNoindex(data.profile.noindex || false);
        setLinks(data.profile.links || []);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        headline,
        bio,
        city,
        country,
        noindex,
        links,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setProfile(data.profile);
      setMessage('Profile saved successfully.');
    }
    setSaving(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setProfile({ ...profile, image_path: data.path });
      setMessage('Photo uploaded successfully.');
    }
    setUploading(false);
  }

  async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account and profile? This action cannot be undone.')) return;

    const res = await fetch('/api/profile', { method: 'DELETE' });
    if (res.ok) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
    }
  }

  function addLink() {
    if (links.length >= 10) return;
    setLinks([...links, { label: '', url: 'https://' }]);
  }

  function updateLink(index: number, field: 'label' | 'url', value: string) {
    const updated = [...links];
    updated[index][field] = value;
    setLinks(updated);
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </main>
        <Footer />
      </>
    );
  }

  const seo = calculateSeoScore({ full_name: fullName, headline, bio, city, image_path: profile?.image_path, links });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maybout.com';
  const profileUrl = profile?.slug ? `${siteUrl}/${profile.slug}` : null;
  const imageUrl = profile?.image_path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${profile.image_path}` : null;

  return (
    <>
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your public profile and SEO optimization.
              </p>
            </div>
            {profileUrl && profile?.slug && (
              <a
                href={`/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors text-center"
              >
                View live profile &rarr;
              </a>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <form onSubmit={handleSave} className="rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-lg">Profile Information</h2>

                <div>
                  <label className="block text-sm font-medium mb-1">Full name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Photographer from Pune"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio (max 500 chars)</label>
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    {imageUrl && (
                      <Image src={imageUrl} alt="Profile" width={64} height={64} className="rounded-full object-cover" />
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Max 5MB. JPG, PNG or WebP.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Links (up to 10)</label>
                    <button
                      type="button"
                      onClick={addLink}
                      className="text-xs text-accent font-medium hover:underline"
                    >
                      + Add link
                    </button>
                  </div>
                  <div className="space-y-3">
                    {links.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Label (e.g. GitHub)"
                          value={link.label}
                          onChange={(e) => updateLink(index, 'label', e.target.value)}
                          className="w-1/3 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                        <input
                          type="url"
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) => updateLink(index, 'url', e.target.value)}
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          className="text-xs text-destructive hover:underline px-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={noindex}
                      onChange={(e) => setNoindex(e.target.checked)}
                    />
                    <span>Hide from Google (noindex)</span>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    Check this if you do not want your profile to appear in search engines.
                  </p>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
                {message && <p className="text-sm text-success">{message}</p>}

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </form>

              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 space-y-3">
                <h2 className="font-semibold text-lg text-destructive">Danger Zone</h2>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your profile, photo, links and account data.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="rounded-full bg-destructive px-6 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition-colors"
                >
                  Delete account & profile
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-base">SEO Score</h2>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-xl">
                    {seo.score}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {seo.score >= 80 ? 'Great optimization' : 'Needs improvement'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Out of 100 points</p>
                  </div>
                </div>
                {seo.tips.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground">Recommendations:</p>
                    <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                      {seo.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border p-6 space-y-3">
                <h2 className="font-semibold text-base">Preview on Google</h2>
                <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">{profileUrl}</p>
                  <p className="text-sm font-medium text-accent hover:underline cursor-pointer">
                    {fullName || 'Your Name'} | Maybout
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {fullName} {headline ? `- ${headline}` : ''}. {bio || 'Create your public profile on Maybout...'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border p-6 space-y-3">
                <h2 className="font-semibold text-base">Get indexed on Google</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Google discovers new pages faster when they have backlinks. Add your Maybout profile URL to your Instagram bio, LinkedIn, X, and GitHub.
                </p>
                {profileUrl && (
                  <button
                    onClick={() => navigator.clipboard.writeText(profileUrl)}
                    className="w-full rounded-full border border-border py-2 text-xs font-medium hover:bg-muted transition-colors"
                  >
                    Copy profile URL
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
