'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export function Header({ showAuth = true }: { showAuth?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  }

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-accent">
          Maybout
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/explore" className="text-sm hover:text-accent transition-colors">
            Explore
          </Link>
          <ThemeToggle />
          {showAuth && !loading && (
            user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm hover:text-accent transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm hover:text-accent transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
                >
                  Sign up
                </Link>
              </>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
