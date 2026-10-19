import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Maybout Privacy Policy - how we collect, use, and protect your information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 space-y-6">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 18, 2026</p>
          <p className="text-muted-foreground">
            At Maybout, accessible from maybout.com, your privacy is extremely important to us. This Privacy Policy document contains types of information that is collected and recorded by Maybout and how we use it.
          </p>
          <h2 className="text-xl font-semibold pt-4">Public Profile Information</h2>
          <p className="text-muted-foreground">
            Information you provide for your profile (such as your full name, headline, bio, city, and links) is public and may be indexed by search engines like Google. Your email address is never published publicly.
          </p>
          <h2 className="text-xl font-semibold pt-4">Data Deletion</h2>
          <p className="text-muted-foreground">
            You can delete your profile and account at any time from your dashboard, which immediately removes your page, photo, and links.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
