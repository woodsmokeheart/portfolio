# QA-001 Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (RU/EN), mobile-first personal portfolio for a QA Lead, framed as a single QA ticket, with MDX articles and no backend.

**Architecture:** Next.js 16 App Router with `[locale]` routing (next-intl). Single-scroll homepage composed of 8 sections mapped to ticket fields, with a sticky ticket-meta panel and scroll-spy. Articles are per-locale MDX files parsed at build time. Animations via `motion`, respecting `prefers-reduced-motion`. Deployed static to Vercel.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, next-intl, motion (framer-motion), @next/mdx + gray-matter, lucide-react, Vitest.

---

## File Structure

```
portfolio/
├── app/
│   ├── layout.tsx                  # root: fonts, html shell
│   ├── globals.css                 # Tailwind + design tokens
│   ├── sitemap.ts                  # SEO sitemap
│   ├── robots.ts                   # SEO robots
│   └── [locale]/
│       ├── layout.tsx              # i18n provider, ticket-meta shell, cursor glow
│       ├── page.tsx                # homepage: composes 8 sections
│       └── articles/
│           ├── page.tsx            # article index
│           └── [slug]/page.tsx     # single article (MDX)
├── components/
│   ├── ticket-meta/
│   │   ├── ticket-meta-panel.tsx   # sticky desktop panel
│   │   ├── mobile-meta-bar.tsx     # mobile sticky bar + jump menu
│   │   └── status-badge.tsx        # pulsing Available badge
│   ├── sections/
│   │   ├── section-shell.tsx       # field tag + human title wrapper
│   │   ├── title-section.tsx
│   │   ├── description-section.tsx
│   │   ├── preconditions-section.tsx
│   │   ├── steps-section.tsx
│   │   ├── expected-section.tsx
│   │   ├── actual-section.tsx
│   │   ├── environment-section.tsx
│   │   └── attachments-section.tsx
│   ├── lang-switcher.tsx
│   ├── cursor-glow.tsx
│   └── ui/
│       ├── tag.tsx                 # monospace ticket-style pill
│       ├── reveal.tsx              # scroll-triggered fade+slide
│       ├── counter.tsx             # animated number
│       └── skill-bar.tsx           # animated progress bar
├── lib/
│   ├── articles.ts                 # MDX discovery + frontmatter parsing
│   ├── motion.ts                   # shared variants + reduced-motion helper
│   └── sections.ts                 # section ids/labels (single source for scroll-spy + nav)
├── hooks/
│   └── use-scroll-spy.ts           # active-section tracking
├── content/articles/
│   └── kafka-testing.ru.mdx        # demo article (+ .en.mdx)
├── messages/{ru,en}.json
├── i18n/
│   ├── routing.ts                  # next-intl routing config
│   └── request.ts                  # next-intl request config
├── public/                         # photo, og images
├── middleware.ts                   # next-intl locale middleware
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

### Task 0: Scaffold project & dependencies

**Files:**
- Create: whole `portfolio/` Next.js skeleton (git already initialized; spec already committed)

- [ ] **Step 1: Scaffold Next.js into the existing folder**

Run (from `jessai/portfolio`, which already contains `.git`, `.gitignore`, `docs/`):
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --no-turbopack --use-npm
```
If it refuses due to non-empty dir, scaffold in a temp dir and copy over, preserving `docs/` and `.git/`.

- [ ] **Step 2: Pin Next/React to match qa-sprint-board**

Edit `package.json` deps to `next@16.2.9`, `react@19.2.4`, `react-dom@19.2.4`, then reinstall.

- [ ] **Step 3: Install runtime + dev deps**

```bash
npm i next-intl motion gray-matter lucide-react @next/mdx @mdx-js/react @mdx-js/loader
npm i -D vitest @vitejs/plugin-react @types/node
```

- [ ] **Step 4: Verify dev server boots**

Run: `npm run dev` → Expected: server starts on :3000 with default page, no errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js portfolio app"
```

---

### Task 1: Design tokens, fonts, globals

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Define dark theme tokens in globals.css**

Add CSS variables under `:root` for the flat dark palette: `--bg`, `--bg-elevated`, `--text-primary/secondary/tertiary/quaternary`, `--stroke`, `--accent` (teal/blue), `--mono` font stack. Set `body { background: var(--bg); color: var(--text-primary); }`. Add `@media (prefers-reduced-motion: reduce)` global that sets `* { animation: none !important; transition: none !important; }`.

- [ ] **Step 2: Wire system font stack + mono in root layout**

In `app/layout.tsx` set `<html lang>` dynamically later; for now use system-ui sans stack and a mono stack via CSS var. No external font fetch (perf).

- [ ] **Step 3: Verify build**

Run: `npm run build` → Expected: success, no CSS errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "style: dark theme tokens and base typography"
```

---

### Task 2: i18n (next-intl) with [locale] routing + language switcher

**Files:**
- Create: `i18n/routing.ts`, `i18n/request.ts`, `middleware.ts`, `messages/ru.json`, `messages/en.json`, `components/lang-switcher.tsx`
- Modify: `next.config.ts`, move pages under `app/[locale]/`

- [ ] **Step 1: Configure routing**

`i18n/routing.ts`:
```ts
import {defineRouting} from 'next-intl/routing';
export const routing = defineRouting({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
});
```

- [ ] **Step 2: Request config + middleware + next.config plugin**

`i18n/request.ts` loads `messages/${locale}.json`. `middleware.ts` exports next-intl middleware with a matcher excluding `/_next`, `/api`, static files. Wrap `next.config.ts` with `createNextIntlPlugin()`.

- [ ] **Step 3: Seed message catalogs**

`messages/ru.json` and `messages/en.json` with keys for nav, ticket meta (status, priority, labels), and the 8 section titles (field tag + human title).

- [ ] **Step 4: Move homepage under [locale] and add locale layout**

`app/[locale]/layout.tsx` sets `<html lang={locale}>`, wraps children in `NextIntlClientProvider`, calls `setRequestLocale`. Add `generateStaticParams` for `ru`/`en`.

- [ ] **Step 5: Build language switcher**

`components/lang-switcher.tsx` — client component, renders `RU / EN`, uses `usePathname`/`useRouter` from `next-intl/navigation` to swap locale preserving path + hash.

- [ ] **Step 6: Verify both locales render**

Run: `npm run dev`, visit `/ru` and `/en`. Expected: localized strings differ, switcher toggles and preserves path.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: bilingual ru/en routing with language switcher"
```

---

### Task 3: Article system (MDX + frontmatter) — with tests

**Files:**
- Create: `lib/articles.ts`, `lib/articles.test.ts`, `content/articles/kafka-testing.ru.mdx`, `content/articles/kafka-testing.en.mdx`, `vitest.config.ts`
- Modify: `next.config.ts` (MDX support)

- [ ] **Step 1: Write failing test for article discovery/parsing**

`lib/articles.test.ts`:
```ts
import {describe, it, expect} from 'vitest';
import {getArticleSlugs, getArticle, getAllArticlesMeta} from './articles';

describe('articles', () => {
  it('discovers slugs from content dir', () => {
    expect(getArticleSlugs()).toContain('kafka-testing');
  });
  it('parses bilingual frontmatter for a locale', () => {
    const a = getArticle('kafka-testing', 'en');
    expect(a?.meta.title).toBe('Testing Kafka without pain');
    expect(a?.meta.tags).toContain('kafka');
  });
  it('falls back across locales for listing', () => {
    const list = getAllArticlesMeta('ru');
    expect(list.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run lib/articles.test.ts` → Expected: FAIL (module/functions missing).

- [ ] **Step 3: Implement lib/articles.ts**

Implement `getArticleSlugs()` (scan `content/articles`, strip `.<locale>.mdx`, unique), `getArticle(slug, locale)` (read file, `gray-matter` parse, map `title_<locale>`/`excerpt_<locale>` to `title`/`excerpt`, return `{meta, content}`), `getAllArticlesMeta(locale)` (sorted by date desc, fallback to other locale's meta when missing).

- [ ] **Step 4: Add demo article files**

`kafka-testing.ru.mdx` / `kafka-testing.en.mdx` with frontmatter (`title_ru/title_en`, `date`, `tags`, `cover`, `excerpt_ru/excerpt_en`) and a few paragraphs of body.

- [ ] **Step 5: Run tests, verify pass**

Run: `npx vitest run lib/articles.test.ts` → Expected: PASS.

- [ ] **Step 6: Enable MDX in next.config + add vitest.config**

Configure `@next/mdx` (`pageExtensions` incl. `mdx`), `vitest.config.ts` with `@vitejs/plugin-react` and path alias.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: MDX article system with bilingual frontmatter (tested)"
```

---

### Task 4: Section registry + scroll-spy hook — with test

**Files:**
- Create: `lib/sections.ts`, `hooks/use-scroll-spy.ts`, `hooks/use-scroll-spy.test.ts`

- [ ] **Step 1: Define section registry**

`lib/sections.ts` exports ordered array of `{id, field, titleKey}` for the 8 sections (single source of truth for nav, scroll-spy, and rendering order). `field` is the monospace ticket label (e.g. `Steps to Reproduce`), `titleKey` indexes into messages.

- [ ] **Step 2: Write failing test for scroll-spy selection logic**

Extract pure logic `pickActive(entries)` (choose the topmost intersecting section). Test with mock IntersectionObserver entries asserting the right id is chosen.

- [ ] **Step 3: Run test, verify fail**

Run: `npx vitest run hooks/use-scroll-spy.test.ts` → Expected: FAIL.

- [ ] **Step 4: Implement hook + pure helper**

`use-scroll-spy.ts`: IntersectionObserver over section ids, exposes `activeId`. Pure `pickActive` exported for tests.

- [ ] **Step 5: Run test, verify pass**

Run: `npx vitest run hooks/use-scroll-spy.test.ts` → Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: section registry and scroll-spy hook (tested)"
```

---

### Task 5: Animation primitives + cursor glow

**Files:**
- Create: `lib/motion.ts`, `components/ui/reveal.tsx`, `components/ui/counter.tsx`, `components/ui/skill-bar.tsx`, `components/ui/tag.tsx`, `components/cursor-glow.tsx`

- [ ] **Step 1: Shared motion variants + reduced-motion helper**

`lib/motion.ts`: export `fadeSlide` variants and a `useReducedMotion`-aware wrapper so all effects degrade gracefully.

- [ ] **Step 2: Reveal component**

`reveal.tsx`: client; uses `motion` `whileInView` with `fadeSlide`, `viewport={{once:true, margin}}`.

- [ ] **Step 3: Counter component**

`counter.tsx`: animates 0→target with rAF + cubic ease when in view; `tabular-nums`.

- [ ] **Step 4: SkillBar component**

`skill-bar.tsx`: fills width to `level%` with eased transition when in view.

- [ ] **Step 5: Tag + cursor glow**

`tag.tsx`: monospace ticket pill. `cursor-glow.tsx`: client; radial accent glow following pointer, disabled on touch + reduced-motion.

- [ ] **Step 6: Verify build**

Run: `npm run build` → Expected: success.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: animation primitives and cursor glow"
```

---

### Task 6: App shell — ticket-meta panel, mobile bar, layout integration

**Files:**
- Create: `components/ticket-meta/ticket-meta-panel.tsx`, `components/ticket-meta/mobile-meta-bar.tsx`, `components/ticket-meta/status-badge.tsx`
- Modify: `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`

- [ ] **Step 1: Status badge**

Pulsing green dot + `Available for work` label; pulse respects reduced-motion.

- [ ] **Step 2: Ticket-meta panel (desktop sticky)**

Renders `QA-001`, status badge, priority, assignee avatar+name, labels, `LangSwitcher`, and quick links from `lib/sections.ts`; active link highlighted via scroll-spy. Hidden below `lg`.

- [ ] **Step 3: Mobile meta bar**

Sticky top bar with `QA-001` + status + lang switcher + a jump menu (sheet/dropdown) listing sections. Visible below `lg`.

- [ ] **Step 4: Integrate into locale layout**

Two-column grid on desktop (panel + main), single column on mobile with the bar on top. Mount `CursorGlow` once here.

- [ ] **Step 5: Verify responsive shell**

Run: `npm run dev`; check 375px (mobile bar, jump menu works) and ≥1280px (sticky panel, scroll-spy highlights). Expected: no overlap, smooth.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: ticket-meta panel and responsive app shell"
```

---

### Task 7: Section shell + Title & Description sections

**Files:**
- Create: `components/sections/section-shell.tsx`, `title-section.tsx`, `description-section.tsx`
- Add: `public/denis.jpg` placeholder, wire into `app/[locale]/page.tsx`

- [ ] **Step 1: Section shell**

Wrapper rendering the monospace `field` tag + human title (both from messages) and an `id` anchor for scroll-spy; wraps children in `Reveal`.

- [ ] **Step 2: Title section**

Hero: name, headline (reveal), status, label tags, animated `Counter` metrics (21 microservices, 5+ years, 3 led), and framed photo via `next/image` styled as a ticket attachment preview. Mobile: photo stacks above text.

- [ ] **Step 3: Description section**

Short bio питч from messages.

- [ ] **Step 4: Verify**

Run: `npm run dev` → Title + Description render in both locales, counters animate, photo responsive.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: section shell, Title and Description sections"
```

---

### Task 8: Preconditions & Steps (timeline) sections

**Files:**
- Create: `components/sections/preconditions-section.tsx`, `steps-section.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/*`

- [ ] **Step 1: Preconditions section**

Staggered list of background bullets (how Denis got into QA / context).

- [ ] **Step 2: Steps section (career timeline)**

Numbered vertical timeline; the connecting line draws via scroll-linked progress; each step reveals with stagger. Content (роли/вехи) from messages as an array.

- [ ] **Step 3: Verify**

Run: `npm run dev` → both render; timeline line animates on scroll; reduced-motion shows static.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: Preconditions and Steps timeline sections"
```

---

### Task 9: Expected & Actual (cases) sections

**Files:**
- Create: `components/sections/expected-section.tsx`, `actual-section.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/*`

- [ ] **Step 1: Expected section**

Goals / aspirations as a concise list (from messages).

- [ ] **Step 2: Actual section (cases)**

Case rows (title, sub, tags, year) with hover (title scales, accent `→` slides in) and staggered reveal. Data array in messages or a local typed const localized via keys.

- [ ] **Step 3: Verify**

Run: `npm run dev` → cases render, hover effects work on desktop, tappable on mobile.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: Expected goals and Actual cases sections"
```

---

### Task 10: Environment section (skills + tools)

**Files:**
- Create: `components/sections/environment-section.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/*`

- [ ] **Step 1: Skills groups with animated bars**

Two groups (Testing, Platform) using `SkillBar`, staggered, fill on view.

- [ ] **Step 2: Tools row**

`Tag` pills (Jira, Grafana, Playwright, …) with pop-in.

- [ ] **Step 3: Verify + commit**

Run: `npm run dev`; then:
```bash
git add -A && git commit -m "feat: Environment skills and tools section"
```

---

### Task 11: Attachments section + article pages

**Files:**
- Create: `components/sections/attachments-section.tsx`, `app/[locale]/articles/page.tsx`, `app/[locale]/articles/[slug]/page.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Attachments section**

Lists latest articles (via `getAllArticlesMeta(locale)`) as cards linking to article pages, plus contact links (Telegram, email, LinkedIn) as mailto/href.

- [ ] **Step 2: Article index page**

`/[locale]/articles` — full list with `generateStaticParams` over locales.

- [ ] **Step 3: Single article page**

`/[locale]/articles/[slug]` — `generateStaticParams` over slugs×locales; render MDX in a styled prose layout; `generateMetadata` per article; if locale missing, render available one with a notice.

- [ ] **Step 4: Verify**

Run: `npm run dev` → Attachments links work; demo article renders in RU and EN; metadata present.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: Attachments section and MDX article pages"
```

---

### Task 12: SEO — metadata, sitemap, robots, OG

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/[locale]/layout.tsx` (generateMetadata), add OG image to `public/`

- [ ] **Step 1: Per-locale metadata**

`generateMetadata` in locale layout: localized title/description, `alternates.languages` for ru/en, `openGraph` with og image.

- [ ] **Step 2: sitemap.ts + robots.ts**

Enumerate `/ru`, `/en`, article routes for both locales; robots allows all + points to sitemap.

- [ ] **Step 3: Verify**

Run: `npm run build` → static pages generated for all routes; visit `/sitemap.xml`, `/robots.txt`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: SEO metadata, sitemap, robots, OG image"
```

---

### Task 13: Responsive/perf QA pass + README + final build

**Files:**
- Create: `README.md`
- Modify: any fixes found

- [ ] **Step 1: Responsive sweep**

Manually verify 375 / 768 / 1280 / 1920: ticket panel↔mobile bar swap, no horizontal scroll, tap targets ≥44px, photo and timeline behave.

- [ ] **Step 2: Reduced-motion sweep**

Toggle OS reduced-motion: glow off, counters/bars/timeline static, content fully readable.

- [ ] **Step 3: Lighthouse**

Run production build + `next start`, run Lighthouse on `/ru`. Expected: Performance ≥ 90, SEO ≥ 95. Fix regressions (image sizing, unused JS) if below.

- [ ] **Step 4: README**

Document: run/dev/build, how to add an article (`<slug>.<locale>.mdx` + frontmatter), how to deploy to Vercel, how to edit section content in `messages/`.

- [ ] **Step 5: Final build + commit**

```bash
npm run build && git add -A && git commit -m "docs: README and final responsive/perf pass"
```

---

## Self-Review

**Spec coverage:**
- Bilingual + visible switcher → Task 2 ✓
- Mobile-first → Tasks 6, 13 ✓
- Articles without backend → Tasks 3, 11 ✓
- Ticket metaphor + 8 sections + dual labels → Tasks 4, 7–11 ✓
- Single-scroll + sticky meta + scroll-spy → Tasks 4, 6 ✓
- Photo (hero + assignee) → Tasks 6, 7 ✓
- Wow-effects + reduced-motion → Tasks 5, 7–10, 13 ✓
- Separate extractable folder + own git → Task 0 (git already init) ✓
- SEO/SSG → Task 12 ✓
- Stack versions match qa-sprint-board → Tasks 0, 1 ✓
- DoD items → covered across Tasks 11–13 ✓

**Placeholder scan:** No TBD/TODO; tested tasks (3,4) include real test code; visual tasks specify concrete content sources (messages) and behaviors.

**Type consistency:** `lib/sections.ts` `{id, field, titleKey}` is reused by scroll-spy (Task 4), meta panel (Task 6), and page composition (Tasks 7–11). Article API names `getArticleSlugs/getArticle/getAllArticlesMeta` consistent across Tasks 3 and 11.
