# NepaliTyping

NepaliTyping is a Next.js App Router starter for Nepali keyboard practice, guided lessons and typing speed tests. The architecture separates keyboard maps, lesson content, reusable practice UI, persistence models, score routes and public SEO pages.

## Architecture and file tree

```text
app/                  App Router pages, API route, metadata, sitemap, icons
  api/scores/         validated score submission boundary
components/           shared header, keyboard and typing practice
lib/layouts/           typed physical-key mappings for five layouts
lib/                   lesson data, grapheme metrics, cached MongoDB connection
models/                Mongoose User, Progress, Content, TestResult, token schemas
scripts/db-setup.ts     create remote Atlas collections and synchronize indexes
scripts/seed.ts         idempotently seed practice content
instrumentation.ts      bootstrap Atlas collections and indexes on Node server start
requirements.md         product and implementation requirements
```

## Current implementation

- Server-rendered SEO landing pages for Nepali typing test/practice, Preeti, Unicode, Inscript, romanized input and Lok Sewa preparation, plus Nepali-language routes.
- Static lesson detail pages and eight starter typing guides with article metadata and structured data.
- Beginner lesson groups, intermediate text drills, and a basic timed typing exercise.
- Physical `KeyboardEvent.code` maps, layout preference stored in localStorage, keyboard display and next-character key hint.
- Grapheme-aware Nepali character counts and WPM/accuracy calculations.
- MongoDB models, a content seeder, environment-based canonical URLs, sitemap/robots, dynamic Open Graph image and SVG app icon.
- Auth.js v5 OAuth and credentials sign-in, password signup, email verification, reset tokens, rate limits, guest-progress merge and account menu.

Score submission remains disabled until signed server-issued test tokens and verified-user checks are completed. Configure all OAuth and email secrets before enabling account flows in production. The built-in MongoDB rate-limit buckets are appropriate for this starter; use a shared rate-limit store if deploying across independently scaled databases or regions.

## Setup

Requirements: Node.js 20+, npm and a MongoDB database (Atlas works).

```bash
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` to the canonical site URL. Keep `MONGODB_URI` and `AUTH_SECRET` in `.env.local` and never commit them. Email signup and password reset use Resend; configure `RESEND_API_KEY` and a verified `EMAIL_FROM` sender. Configure Google OAuth with `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`. GitHub and Facebook buttons appear only when both credentials for that provider are set. Search Console and Bing verification use `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION`. Optional privacy-friendly Plausible analytics uses `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` and loads after interactivity.

When the Node.js server starts, `instrumentation.ts` connects to Atlas and idempotently creates the application's collections and indexes. You can run the same setup manually with `npm run db:setup`. Both operations target the remote database in `MONGODB_URI`; no local database is used. Seed starter lessons and typing content with `npm run seed`.

Seed the included starter content with `npm run seed`. The current seed script creates 300 word records, 100 sentence records and 30 paragraph records; the repeated vocabulary is placeholder content and should be replaced with editorially reviewed Nepali material before launch.

## Deployment

Import the repository into Vercel, set the environment variables in project settings, and deploy. Configure MongoDB Atlas Network Access to allow the deployment's outbound IP addresses; if the hosting plan does not provide stable egress addresses, configure a suitable Atlas network access strategy. Run `npm run db:setup` against the production environment before serving traffic. Register these exact OAuth callback URLs with each provider:

- Google local: `http://localhost:3000/api/auth/callback/google`
- GitHub local: `http://localhost:3000/api/auth/callback/github`
- Facebook local: `http://localhost:3000/api/auth/callback/facebook`
- Google production: `https://nepalityping.bikashkhanal07.com.np/api/auth/callback/google`
- GitHub production: `https://nepalityping.bikashkhanal07.com.np/api/auth/callback/github`
- Facebook production: `https://nepalityping.bikashkhanal07.com.np/api/auth/callback/facebook`

These production callback URLs must match the origin in `NEXT_PUBLIC_SITE_URL`. Configure the Resend sender domain before testing email verification and password reset.

### Post-deploy SEO checklist

1. Open `/sitemap.xml` and submit it in Google Search Console and Bing Webmaster Tools.
2. Request indexing for the home page, Nepali typing test, Lok Sewa practice, a lesson, and a guide article.
3. Verify canonical host and `hreflang` alternates, then test a trailing slash and `www` URL for a single 301 redirect.
4. Check representative URLs in PageSpeed Insights and the Rich Results Test / Schema Markup Validator. Confirm server HTML contains the page H1 and body copy.
5. Review the Core Web Vitals report after 28 days of field data. Keep `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` configured if you want privacy-friendly event and Web Vitals reporting.

## Keyboard layout sources and assumptions

- Unicode InScript: the map is based on published C-DAC / Government of India InScript keyboard diagrams, including the [localisation guidelines chart](https://localisation.gov.in/index.php/Guidelines_CDAC_Ver-5-6bc0b.pdf?download=4%3Alocalisation-guidelines&start=10). Confirm exact modifier levels against the target OS version before representing this as an exact OS clone.
- Nepali Traditional and Romanized: the project uses commonly circulated Windows/Nepali Unicode key charts and a simple starter phonetic profile. Windows IME and NepaLinux variants differ; verify the complete map against the specific distribution used by the intended learners.
- Preeti: the typing layout remains a starter subset. The Preeti↔Unicode tool includes a community-derived conversion table; legacy font variants still require proofreading and the converter may not cover every source font.
- macOS: the map is an approximation of the macOS Devanagari QWERTY phonetic layout; macOS versions and installed input sources differ. Verify against a target macOS release.

Useful references include [Language Technology Kendra's NepaLinux downloads](https://ltk.org.np/downloads.php), [Preeti keyboard chart](https://nepalilanguagetools.com/preeti-keyboard-guide/) and the [C-DAC InScript chart](https://localisation.gov.in/index.php/Guidelines_CDAC_Ver-5-6bc0b.pdf?download=4%3Alocalisation-guidelines&start=10). Layout sources are references, not evidence that every key or modifier in this starter is complete.

## Known next steps

Finish signed server-issued score tokens and leaderboard persistence; expand/validate all key maps; persist lesson and test history; add real category content, score graph and filtered leaderboard; add real keyboard/accessibility tests. Noto Sans Devanagari is subsetted at build time through `next/font`.
