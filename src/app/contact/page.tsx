import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Maybout team.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 space-y-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground">
            Have questions, feedback, or need support? Reach out to us at{' '}
            <a href="mailto:support@maybout.com" className="text-accent underline">
              support@maybout.com
            </a>
            {' '}(TODO: Update support email).
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
