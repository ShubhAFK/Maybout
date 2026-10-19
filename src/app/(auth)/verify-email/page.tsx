import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function VerifyEmailPage() {
  return (
    <>
      <Header showAuth={false} />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold">Verify your email</h1>
          <p className="mt-4 text-muted-foreground">
            We sent a verification link to your email address. Please click the link to activate your account and make your profile public.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
