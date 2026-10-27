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

- Responsive marketing landing page and metadata for Learn, Practice and Speed Test.
- Beginner lesson groups, intermediate text drills, and a basic timed typing exercise.
- Physical `KeyboardEvent.code` maps, layout preference stored in localStorage, keyboard display and next-character key hint.
- Grapheme-aware Nepali character counts and WPM/accuracy calculations.
- MongoDB model definitions, a content seeder, sitemap/robots, dynamic Open Graph image and SVG app icon.
- Signup/login/profile/verification/reset page shells.

This is a foundation, not yet a production-ready service. The account pages are UI shells; Google OAuth, credentials registration, email verification and password reset delivery are not wired. Score submission intentionally rejects writes until authenticated user resolution and signed server-issued test-token checks are added. Rate limiting and anti-cheat keystroke timing need a shared production store (for example Redis) and server-recorded test sessions. Do not advertise score submissions as enabled yet.

## Setup

Requirements: Node.js 20+, npm and a MongoDB database (Atlas works).

```bash
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` to the canonical site URL. Keep `MONGODB_URI` in `.env.local` and never commit it. Auth and mail variables are reserved for the account flows: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `EMAIL_SERVER` or `RESEND_API_KEY`, `EMAIL_FROM`, and `TEST_TOKEN_SECRET`.

When the Node.js server starts, `instrumentation.ts` connects to Atlas and idempotently creates the application's collections and indexes. You can run the same setup manually with `npm run db:setup`. Both operations target the remote database in `MONGODB_URI`; no local database is used. Seed starter lessons and typing content with `npm run seed`.

Seed the included starter content with `npm run seed`. The current seed script creates 300 word records, 100 sentence records and 30 paragraph records; the repeated vocabulary is placeholder content and should be replaced with editorially reviewed Nepali material before launch.

## Deployment

Import the repository into Vercel, set the environment variables in project settings, and deploy. Configure MongoDB Atlas Network Access to allow the deployment's outbound IP addresses; if the hosting plan does not provide stable egress addresses, configure a suitable Atlas network access strategy. Run `npm run db:setup` against the production environment before serving traffic. Add the production callback URL when Google OAuth is connected. Configure the mail provider's verified sender domain before enabling verification and reset emails.

## Keyboard layout sources and assumptions

- Unicode InScript: the map is based on published C-DAC / Government of India InScript keyboard diagrams, including the [localisation guidelines chart](https://localisation.gov.in/index.php/Guidelines_CDAC_Ver-5-6bc0b.pdf?download=4%3Alocalisation-guidelines&start=10). Confirm exact modifier levels against the target OS version before representing this as an exact OS clone.
- Nepali Traditional and Romanized: the project uses commonly circulated Windows/Nepali Unicode key charts and a simple starter phonetic profile. Windows IME and NepaLinux variants differ; verify the complete map against the specific distribution used by the intended learners.
- Preeti: the starter table covers only a small familiar subset. A Preeti font/license and complete, tested legacy glyph↔Unicode transliteration table are still required. The current map is not a complete Preeti converter.
- macOS: the map is an approximation of the macOS Devanagari QWERTY phonetic layout; macOS versions and installed input sources differ. Verify against a target macOS release.

Useful references include [Language Technology Kendra's NepaLinux downloads](https://ltk.org.np/downloads.php), [Preeti keyboard chart](https://nepalilanguagetools.com/preeti-keyboard-guide/) and the [C-DAC InScript chart](https://localisation.gov.in/index.php/Guidelines_CDAC_Ver-5-6bc0b.pdf?download=4%3Alocalisation-guidelines&start=10). Layout sources are references, not evidence that every key or modifier in this starter is complete.

## Known next steps

Implement Auth.js providers and verified email/password lifecycle, guest-progress merge, secure session-bound test tokens and persistent rate limiting; expand/validate all key maps and Preeti conversion; persist lessons and test history; add real category content, score graph and filtered leaderboard; provide bundled Noto Sans Devanagari and licensed Preeti font assets; add PNG/ICO app icons and real keyboard/accessibility tests. The app currently references Noto Sans Devanagari from Google Fonts; bundle it for deployments that require self-hosted fonts.
