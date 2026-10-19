import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'About Maybout',
  description: 'Learn more about Maybout and our mission to help everyone build a public profile that ranks on Google.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 space-y-6">
          <h1 className="text-3xl font-bold">About Maybout</h1>
          <p className="text-muted-foreground">
            Maybout is a platform designed to give anyone a clean, professional public profile page that is optimized to appear on Google when someone searches their name.
          </p>
          <h2 className="text-xl font-semibold pt-4">Our Mission</h2>
          <p className="text-muted-foreground">
            In today&apos;s digital world, having a presence on search engines is essential. Whether you are a creator, professional, student, or freelancer, when someone looks up your name, you deserve a great, authoritative page at the top of the search results.
          </p>
          <h2 className="text-xl font-semibold pt-4">SEO First</h2>
          <p className="text-muted-foreground">
            Every technical decision on Maybout—from server-side rendering and structured JSON-LD schema markup to clean semantic HTML and fast loading times—is engineered to satisfy search engine algorithms.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
