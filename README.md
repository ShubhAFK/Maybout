# Maybout

Maybout is a production-ready web platform where users can create SEO-optimized public profile pages that rank on Google when someone searches their name (e.g., "pawan bout" or "pawan maybout").

## Tech Stack
- Next.js 14+ (App Router), TypeScript, Tailwind CSS
- Supabase (Auth, Postgres, Storage, Row Level Security)
- Vercel Deployment

## Local Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/Kilo-Org/maybout.git
   cd Maybout
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

3. Run Supabase SQL migrations:
   Execute the SQL found in `supabase/schema.sql` in your Supabase SQL Editor.

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup
- Enable Email/Password authentication and Google OAuth in your Supabase Dashboard.
- Create a public Storage bucket named `profile-images`.
- Apply the RLS policies in `supabase/schema.sql`.

## Vercel Deployment
1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAILS`).
4. Deploy!

## Custom Domain & Google Search Console
1. Buy a custom domain (e.g. `maybout.com`) and add it to Vercel.
2. Verify your site in Google Search Console using HTML tag or DNS verification.
3. Submit your sitemap (`https://maybout.com/sitemap.xml`) in Google Search Console.
