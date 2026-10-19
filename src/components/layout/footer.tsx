import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto bg-muted/50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="font-semibold text-sm mb-3">Maybout</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/explore" className="hover:text-foreground transition-colors">Explore</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Browse</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                <li key={letter}>
                  <Link href={`/people/${letter.toLowerCase()}`} className="hover:text-foreground transition-colors">
                    Names starting with {letter}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Get Started</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/signup" className="hover:text-foreground transition-colors">Create your profile</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Log in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Maybout. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
