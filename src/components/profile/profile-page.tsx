import Link from 'next/link';
import Image from 'next/image';
import type { ProfileWithLinks } from '@/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ReportButton } from './report-button';

interface RelatedProfile {
  slug: string;
  full_name: string;
  headline: string | null;
  image_path: string | null;
}

interface Props {
  profile: ProfileWithLinks;
  imageUrl: string | null;
  profileUrl: string;
  relatedProfiles: RelatedProfile[];
}

function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${imagePath}`;
}

export function ProfilePage({ profile, imageUrl, profileUrl, relatedProfiles }: Props) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-2xl px-4 py-12">
          <header className="text-center">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={profile.full_name}
                width={160}
                height={160}
                className="mx-auto rounded-full object-cover"
                priority
              />
            )}
            <h1 className="mt-6 text-3xl font-bold">{profile.full_name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.full_name} on Maybout
            </p>
            {profile.headline && (
              <p className="mt-3 text-lg text-muted-foreground">{profile.headline}</p>
            )}
            {(profile.city || profile.country) && (
              <p className="mt-1 text-sm text-muted-foreground">
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </p>
            )}
          </header>

          {profile.bio && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-muted-foreground whitespace-pre-line">{profile.bio}</p>
            </section>
          )}

          {profile.links.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Links</h2>
              <div className="space-y-3">
                {profile.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="me noopener"
                    className="flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 flex items-center justify-center gap-4">
            <ReportButton profileId={profile.id} />
          </div>
        </article>

        {relatedProfiles.length > 0 && (
          <section className="border-t border-border py-12">
            <div className="mx-auto max-w-4xl px-4">
              <h2 className="text-lg font-semibold mb-6 text-center">
                More profiles on Maybout
              </h2>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                {relatedProfiles.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/${rp.slug}`}
                    className="flex flex-col items-center rounded-lg border border-border p-4 hover:bg-muted transition-colors"
                  >
                    {rp.image_path && (
                      <Image
                        src={getImageUrl(rp.image_path)!}
                        alt={rp.full_name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <p className="mt-2 text-sm font-medium text-center">{rp.full_name}</p>
                    {rp.headline && (
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        {rp.headline}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-accent py-8 text-center text-white">
          <p className="text-sm">
            <Link href="/signup" className="font-medium underline">
              Create your own profile on Maybout
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
