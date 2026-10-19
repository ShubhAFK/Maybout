import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface Props {
  params: Promise<{ letter: string }>;
}

export const revalidate = 3600;

export default async function PeopleLetterPage({ params }: Props) {
  const { letter } = await params;
  const l = letter.charAt(0).toUpperCase();

  const supabase = createAdminClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('slug, full_name, headline, city')
    .eq('is_public', true)
    .eq('is_verified', true)
    .ilike('full_name', `${l}%`)
    .order('full_name', { ascending: true });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <>
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold mb-6">Profiles starting with {l}</h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {alphabet.map((char) => (
              <Link
                key={char}
                href={`/people/${char.toLowerCase()}`}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border border-border ${
                  char === l ? 'bg-accent text-white border-accent' : 'hover:bg-muted'
                }`}
              >
                {char}
              </Link>
            ))}
          </div>

          {profiles && profiles.length > 0 ? (
            <div className="space-y-4">
              {profiles.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted transition-colors"
                >
                  <div>
                    <h2 className="font-semibold">{p.full_name}</h2>
                    {p.headline && (
                      <p className="text-sm text-muted-foreground mt-0.5">{p.headline}</p>
                    )}
                  </div>
                  {p.city && (
                    <span className="text-xs text-muted-foreground">{p.city}</span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-12">No profiles found starting with {l}.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
