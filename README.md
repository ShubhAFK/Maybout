# Maybout

A public profile platform engineered for personal search engine optimization (SEO) and online presence management.

## Overview

Maybout allows users to create search-optimized public profiles accessible at custom URL paths (such as `/firstname-lastname`). The platform is built to maximize discoverability on major search engines when individuals are queried by name, providing a clean, accessible, and high-performance digital identity page.

---

## Key Capabilities

* **Personal Brand Optimization:** Generates dynamic, canonical public profile pages structured specifically for search engine indexing.
* **Automated Asset Processing:** Handles uploaded media by automatically cropping, resizing, compressing, and stripping EXIF metadata to ensure privacy and optimal load performance.
* **Live SEO Analysis:** Provides real-time SEO scoring (0–100) with tailored recommendations to improve profile visibility and search ranking potential.
* **Granular Privacy Controls:** Includes a one-click indexing toggle (`noindex`) allowing users to instantly hide or expose their profile to search engine crawlers.
* **Safety and Content Moderation:** Features built-in profile reporting, automated content and link sanitation, rate-limiting protections, and compliant account deletion workflows.
* **Responsive and Accessible Interface:** Built using semantic HTML and accessible UI components with native dark and light mode support across mobile, tablet, and desktop viewports.

---

## How It Works

1. **Account Registration:** Users register with an email address and complete basic age and identity verification.
2. **Profile Configuration:** Users input their public information, including full name, location, headline, bio, professional or personal links, and a profile photo.
3. **Indexing and Visibility:** Maybout automatically formats the metadata, generates Schema.org JSON-LD structured data, and makes the profile indexable by global search crawlers.

---

## Technical Architecture and Specifications

* **Framework:** Next.js (App Router, Server-Side Rendering, Incremental Static Regeneration)
* **Styling:** Tailwind CSS with dynamic theme switching and reduced-motion support
* **Backend Services:** Supabase (Authentication, PostgreSQL Database, Object Storage, Row Level Security)
* **Search Engine Optimization:**
  * Dynamic `<title>` and meta description tags optimized for character limits
  * Open Graph and Twitter Card metadata for social media preview cards
  * Auto-generated `sitemap.xml` and `robots.txt` configurations
  * Schema.org `ProfilePage` and `Person` structured data markup
