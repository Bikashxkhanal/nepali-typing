# NepaliTyping requirements

Product: **NepaliTyping (nepalityping.com)**, a free Nepali typing tutor and speed-test app. Build with Next.js App Router, TypeScript, React Server Components where useful, MongoDB Atlas through Mongoose, Tailwind, Framer Motion, Auth.js v5, Zod and rate limiting. Guest use is supported throughout except the global leaderboard.

## Environment and working rules

- The app is already scaffolded and dependencies are installed. Do not run installs. If a package is needed, provide the exact `npm install` command and wait.
- `.env.local` already has the remote Atlas `MONGODB_URI`. Never print or hardcode it, commit it, or create local database data.
- Work in this order: database/pooling/bootstrap; layouts and keyboard feedback; beginner lessons; intermediate practice; advanced tests; authentication; leaderboard; landing page/polish; SEO/icons; tests. After each step, report what to run/check and what to expect.

## Keyboard layouts and typing UI

Support Nepali Traditional (Windows), Nepali Romanized/Phonetic (Windows Unicode), Preeti (legacy font layout with conversion both ways), Unicode Inscript, and macOS Nepali. Put each as typed mapping data in `lib/layouts/*.ts`, mapping physical `KeyboardEvent.code` to normal, shift and optional AltGr output plus finger assignment. Implement input in-app without requiring an OS IME; cover conjuncts, virama, matras, reph and ra variants. Use `Intl.Segmenter` or equivalent grapheme-aware comparison/counting. Verify charts against authoritative sources and document assumptions.

Build a responsive, accessible full keyboard with Shift/AltGr states, finger colors and optional guides. Highlight next key and modifiers. Every `keydown` flashes the matching key green for correct or red for wrong for about 150–250ms, with a secondary icon/scale/shake cue, no layout-triggering animation, no stale flashes during rapid input, reduced-motion support and keyboard accessibility. Keep it visible in levels 1–2; allow hiding at higher levels; hidden by default for level 3 with toggle.

## Learning and tests

**Level 1:** lessons for vowels, consonant groups, matras, numerals and common conjuncts. Teach target key, repeat drills and short combinations. Unlock sequentially; persist guest progress in localStorage and account progress in MongoDB; award 1–3 stars based on accuracy.

**Level 2:** words, sentences and short paragraphs using all letters, across daily vocabulary, proverbs, stories and news-style content. Show mistakes, enforce backspace rules, show live WPM/accuracy and keyboard feedback.

**Level 3:** timed 1/2/3/5-minute tests and 25/50/100-word tests. Results show grapheme-aware WPM (characters ÷ 5 ÷ minutes), accuracy, errors, consistency, WPM-over-time graph and retry/next actions. Guests get a login prompt after a test; logged-in users can submit eligible scores.

## Leaderboard and accounts

Leaderboard is login-gated; its navbar icon is visible to all and sends guests to login/signup with an explanation and return redirect. Filter live results by timer/word mode, duration, layout and daily/weekly/all-time period. Show rank, avatar, name, WPM, accuracy, layout and date. Validate submissions server-side (plausible WPM, duration, keystroke timing, rate limits); bind them to text ID and signed server-issued test token. Polling/SSE/WebSocket may be used.

Auth.js v5 supports Google and email/password, bcrypt hashes, 24-hour tokenized email verification via Resend or Nodemailer, and resend/reset flows. Unverified users cannot submit. Pages: login, signup, verify-email, forgot-password, reset-password, profile. Profile includes stats, lesson progress, best scores, layout, display name/avatar and WPM history. Remember layout locally and in profile. Merge guest progress on login.

## MongoDB Atlas

Create `lib/db.ts` with one cached `globalThis.__mongoose = { conn, promise }` connector, clear missing-URI error, and no other `mongoose.connect()` calls. Configure maxPoolSize 10, minPoolSize 2, maxIdleTimeMS 60000, serverSelectionTimeoutMS 10000, socketTimeoutMS 45000, bufferCommands false and retryWrites true. Log connected/error/disconnected concisely; graceful shutdown outside serverless; autoIndex on in development and off in production. Every API route, server action and Auth.js callback awaits `connectDB()`.

`instrumentation.ts` `register()` runs on Node server start: connect, import models via `models/index.ts`, create every collection (ignore namespace-exists only), then `syncIndexes()`, with an idempotent summary. This targets the remote Atlas database and must never drop collections/data. Add `npm run db:setup` using `tsx scripts/db-setup.ts`; `npm run seed` must use idempotent upserts.

Models: User (name, email, verified, password hash, image/provider, preferred layout); verification and reset tokens with TTL; Progress; TestResult; leaderboard query/entry; Content. Add unique email and appropriate leaderboard/lookup compound indexes. Seed at least 300 words, 100 sentences and 30 paragraphs plus lessons.

## Landing page, design and accessibility

Make a polished, responsive Nepal-inspired crimson/deep-blue/white design with consistent Tailwind tokens, light/dark theme (no flash), reduced motion, clear typography, whitespace, cards and shadows. Landing page has bilingual Nepali/English hero, animated typing demo, learn/test CTAs, supported layouts, three levels, keyboard demo, blurred guest leaderboard teaser, benefits, FAQ with JSON-LD, footer, and a physical-keyboard note for mobile. Add English/Nepali UI readiness. Target WCAG AA, semantic HTML, keyboard navigation, focus rings, consistent empty/error states/toasts, mobile 360px through desktop.

Use matching skeletons and `loading.tsx`, Suspense/streaming, prefetch next lesson/test, 200–350ms Framer Motion transitions, lazy-load typing/chart/keyboard components with reserved space, SWR for profile/leaderboard with no refresh flicker, and keep typing input responsive (<16ms target) using refs/memoization/deferred stats. Include caret and micro-interactions, reduced-motion behavior and personal-best celebration.

## SEO and branding

Render/static-generate public pages with unique metadata, canonical, OG/Twitter, dynamic `opengraph-image.tsx`, sitemap, robots, WebSite/Organization/FAQ/Course-or-LearningResource/Breadcrumb JSON-LD. Optimize terms for Nepali typing practice, Preeti typing test, Nepali Unicode/Inscript typing and online tests; provide Nepali metadata/content and hreflang where relevant. Leaderboard/profile noindex as appropriate. Use next/image, next/font, one H1/page; Lighthouse target 95+ and Core Web Vitals focus.

Create `app/icon.svg`, favicon ICO, 180×180 apple icon, 192/512 PWA icons, manifest, and navbar SVG logo: Devanagari न or ट with keyboard-key shape in crimson/deep blue.

## Security, quality and deliverables

Use CSRF protection, Zod validation, secure cookies, environment secrets, server-only sensitive data and rate limiting. Optional installable PWA/offline lessons. Add ESLint/Prettier, Vitest layout/WPM/accuracy tests and Playwright core-flow tests.

Required deliverables: working codebase and clear architecture; pooled DB connector, instrumentation and DB setup script; idempotent seed; package scripts `dev`, `build`, `start`, `lint`, `test`, `test:e2e`, `db:setup`, `seed`; README with setup, env variables, Vercel/Atlas deployment and Atlas IP allowlist notes; layout source citations and explicit manual-verification assumptions.

Environment variables: `MONGODB_URI` (already in `.env.local`), `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `RESEND_API_KEY` or `EMAIL_SERVER`, `EMAIL_FROM`, `NEXT_PUBLIC_SITE_URL`, `TEST_TOKEN_SECRET`.
