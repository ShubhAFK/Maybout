import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maybout.com';

function HomeJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Maybout',
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/explore?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        name: 'Maybout',
        url: siteUrl,
        description:
          'Create a public profile that shows up on Google when someone searches your name.',
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Create a public profile that shows&nbsp;up&nbsp;on{' '}
            <span className="text-accent">Google</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            When someone searches &ldquo;your name bout&rdquo; or &ldquo;your name maybout&rdquo;,
            your Maybout profile appears in the results.
          </p>

          <div className="mt-10 mx-auto max-w-md">
            <div className="rounded-xl border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span className="text-muted-foreground">pawan bout</span>
              </div>
              <div className="mt-3 rounded-lg bg-background border border-border p-4 text-left">
                <p className="text-accent text-sm">maybout.com/pawan-kumar</p>
                <p className="font-medium mt-1">Pawan Kumar | Maybout</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pawan Kumar - Photographer from Pune. View profile, links and more on Maybout.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-full bg-accent px-8 py-3 text-base font-medium text-white hover:bg-accent-hover transition-colors"
            >
              Create your profile
            </Link>
            <Link
              href="/explore"
              className="rounded-full border border-border px-8 py-3 text-base font-medium hover:bg-muted transition-colors"
            >
              Explore profiles
            </Link>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                { step: '1', title: 'Sign up', desc: 'Create your account with email or Google in under a minute.' },
                { step: '2', title: 'Fill your profile', desc: 'Add your name, photo, headline, bio, and social links.' },
                { step: '3', title: 'Get found', desc: 'Your profile page is optimized to appear when people search your name.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'What is Maybout?',
                  a: 'Maybout is a platform where you can create a public profile page that is optimized to appear on Google when someone searches your name.',
                },
                {
                  q: 'How does it work?',
                  a: 'When you create a profile on Maybout, we generate an SEO-optimized page with your information. Over time, Google indexes this page, and it can appear when someone searches for your name along with "bout" or "maybout".',
                },
                {
                  q: 'How long does it take to show up on Google?',
                  a: 'Google typically takes a few days to a few weeks to index new pages. Adding your Maybout profile link to your other social profiles (as a backlink) helps Google discover it faster. Ranking takes time—it is not instant.',
                },
                {
                  q: 'Is it free?',
                  a: 'Yes, Maybout is completely free to use.',
                },
                {
                  q: 'Can I remove my profile?',
                  a: 'Yes, you can delete your account and profile at any time from your dashboard. We also provide a "Hide from Google" toggle if you want to temporarily hide your profile from search engines.',
                },
                {
                  q: 'Is my email visible to others?',
                  a: 'No. Your email is used only for login and is never shown publicly on your profile unless you add it as a link yourself.',
                },
              ].map((faq) => (
                <details key={faq.q} className="group border border-border rounded-lg">
                  <summary className="cursor-pointer px-4 py-3 font-medium flex items-center justify-between">
                    {faq.q}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-open:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-accent py-16 text-center text-white">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-bold">Ready to be found on Google?</h2>
            <p className="mt-4 text-lg opacity-90">
              Create your Maybout profile today. It&apos;s free and takes less than 2 minutes.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-medium text-accent hover:bg-gray-100 transition-colors"
            >
              Get started
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
