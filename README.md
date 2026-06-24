# QA-001 — Denis Kukobin Portfolio

A bilingual (RU/EN) personal portfolio for a **QA Lead**, designed as a single
QA **bug ticket** (`QA-001`). Each résumé section maps to a ticket field —
_Title, Description, Preconditions, Steps to Reproduce, Expected Result, Actual
Result, Environment, Attachments_ — with a ticket meta panel (status, priority,
assignee) and a writing/contacts "attachments" block.

The whole site is statically generated and ships with system fonts only — no
external font or runtime data fetches.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens defined in `app/globals.css`)
- **next-intl** for RU/EN routing and messages (`defaultLocale: ru`)
- **motion** (`motion/react`) for in-view reveals, counters, and skill bars
  (all reduced-motion aware)
- **MDX articles** via `@next/mdx` (config) + `next-mdx-remote/rsc` (rendering)
  with `gray-matter` for frontmatter
- **lucide-react** icons
- **Vitest** (+ `@vitejs/plugin-react`) for unit tests

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the dev server on http://localhost:3000
npm run build      # production build (also verifies SSG + TypeScript)
npm run start      # serve the production build
npm run lint       # eslint
npx vitest run     # run the unit test suite (articles + scroll-spy)
```

> There is no `test` script in `package.json`; run the suite directly with
> `npx vitest run` (or `vitest` for watch mode).

## Project structure

```
portfolio/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx            # locale layout, <html>, metadata/OG, meta panel
│   │   ├── page.tsx              # home: the 8 ticket sections in order
│   │   └── articles/
│   │       ├── page.tsx          # /[locale]/articles — article index
│   │       └── [slug]/page.tsx   # article detail (MDX, locale fallback)
│   ├── globals.css               # Tailwind v4 + design tokens + keyframes
│   ├── robots.ts                 # robots.txt
│   └── sitemap.ts                # sitemap.xml
├── components/
│   ├── sections/                 # one component per ticket field + section-shell
│   ├── ui/                       # primitives: skill-bar, counter, reveal, tag
│   ├── ticket-meta/              # status badge, desktop meta panel, mobile bar
│   ├── articles/                 # article-card
│   ├── cursor-glow.tsx
│   └── lang-switcher.tsx
├── lib/
│   ├── articles.ts               # read/parse MDX frontmatter from disk
│   ├── contacts.ts               # contact links (PLACEHOLDERS)
│   ├── sections.ts               # ordered registry of the 8 ticket sections
│   ├── site.ts                   # canonical site URL + OG image
│   ├── format.ts                 # date formatting
│   └── motion.ts                 # shared motion variants
├── hooks/
│   └── use-scroll-spy.ts         # active-section tracking for nav
├── content/articles/             # MDX articles: <slug>.<locale>.mdx
├── messages/                     # ru.json & en.json (all UI + section copy)
├── i18n/                         # routing, navigation, request (next-intl)
├── mdx-components.tsx            # MDX element styling
├── proxy.ts                      # next-intl middleware (locale negotiation)
└── vitest.config.ts
```

## How to add an article

1. Create one or both locale files in `content/articles/`:
   - `content/articles/<slug>.ru.mdx`
   - `content/articles/<slug>.en.mdx`
2. Add frontmatter at the top of each file:

```mdx
---
title_ru: "Заголовок статьи"
title_en: "Article title"
date: "2026-06-20"            # ISO date, used for sorting (newest first)
tags: ["kafka", "qa"]
cover: "/articles/<slug>.jpg" # optional; served from /public
excerpt_ru: "Краткое описание."
excerpt_en: "Short summary."
---

Markdown / MDX body goes here.
```

3. That's it — the article auto-appears in the **Attachments** section (latest 3)
   and on the `/[locale]/articles` index. No registration step required; the slug
   is derived from the filename.

**Locale fallback:**

- The **article index / Attachments** list always shows every article. If the
  current locale's file is missing, it falls back to the other locale's
  frontmatter (so `title_ru`/`excerpt_ru` etc. should ideally be present in
  whichever file exists).
- The **article detail page** renders the requested locale's MDX; if that locale
  file is absent it falls back to the other locale's body and shows a small
  "this article is only available in <lang>" notice. If no locale exists, it
  404s.
- Per-locale frontmatter keys (`title_<locale>`, `excerpt_<locale>`) take
  precedence; the generic `title` / `excerpt` keys are used as a last resort.

## How to edit section content

All visible copy lives in **`messages/ru.json`** and **`messages/en.json`**
(keep the two files structurally in sync):

- `sections.*` — the ticket field labels. Each section key (e.g. `steps`) exposes
  a `field` (the monospace English ticket label like `Steps to Reproduce`) and a
  localized `label`. The order/registry of sections is in `lib/sections.ts`.
- `content.*` — the actual body copy for each section (e.g. `content.title`,
  `content.description`, `content.attachments`, …). Edit the strings here to
  change what each section says.
- `seo.*`, `nav.*`, `meta.*`, `articles.*` — page metadata, navigation labels,
  ticket meta panel (status/priority/assignee), and article-page strings.

Skill levels shown in skill bars and other structured data are defined in the
relevant section components under `components/sections/`.

## Personalization checklist (TODO for the owner)

> The repo ships with clearly-marked placeholders. Before going live:

- [ ] **Add a real photo** at `public/denis.jpg` (referenced by
      `components/sections/title-section.tsx`, square ~600×600). _Currently this
      file does not exist and will 404 until added._
- [ ] **Set real contact links** in `lib/contacts.ts` — Telegram, email, and
      LinkedIn `href`/`handle` are placeholders (`@your_handle`,
      `you@example.com`, `in/your-handle`).
- [ ] **Set `NEXT_PUBLIC_SITE_URL`** to the real domain (defaults to
      `https://deniskukobin.vercel.app` in `lib/site.ts`). This drives canonical
      URLs, the sitemap, and Open Graph URLs.
- [ ] **Review draft copy and skill levels** in `messages/ru.json` /
      `messages/en.json` and the section components.
- [ ] **Add an OG image** at `public/og.png` (1200×630). _Currently missing; the
      OG/Twitter card will not render an image until added._
- [ ] **Add article cover images** referenced by article frontmatter `cover:`
      (e.g. `public/articles/kafka-testing.jpg`) if you want covers.

## Deploy to Vercel

1. Push this project to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the repo in [Vercel](https://vercel.com/new) — the framework is
   auto-detected as **Next.js** (no custom build/output settings needed).
3. Add an environment variable: `NEXT_PUBLIC_SITE_URL` = your production domain
   (e.g. `https://your-domain.com`).
4. Deploy.

The site is fully static-friendly (all content pages are pre-rendered; only the
next-intl locale middleware runs at the edge), so it fits comfortably on
Vercel's free tier.
