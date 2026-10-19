import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Terms of Service',
  description: 'Maybout Terms of Service - rules and guidelines for using the platform.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 space-y-6">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 18, 2026</p>
          <p className="text-muted-foreground">
            Welcome to Maybout. By accessing our website, you agree to comply with these terms of service.
          </p>
          <h2 className="text-xl font-semibold pt-4">Eligibility & Consent</h2>
          <p className="text-muted-foreground">
            You must be at least 18 years old to use Maybout. You acknowledge and consent that your profile information is public and may appear in search engines.
          </p>
          <h2 className="text-xl font-semibold pt-4">Acceptable Use</h2>
          <p className="text-muted-foreground">
            You agree not to post impersonating, fraudulent, defamatory, or inappropriate content. We reserve the right to suspend or remove profiles that violate our safety policies.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
