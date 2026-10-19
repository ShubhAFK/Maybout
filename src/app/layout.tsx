import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maybout.com';

export const metadata: Metadata = {
  title: {
    default: 'Maybout - Create a public profile that shows up on Google',
    template: '%s | Maybout',
  },
  description:
    'Create your public profile on Maybout. When people search your name with "bout" or "maybout", your profile appears on Google.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    siteName: 'Maybout',
    title: 'Maybout - Create a public profile that shows up on Google',
    description:
      'Create your public profile on Maybout. When people search your name, your profile appears on Google.',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maybout - Create a public profile that shows up on Google',
    description:
      'Create your public profile on Maybout. When people search your name, your profile appears on Google.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
