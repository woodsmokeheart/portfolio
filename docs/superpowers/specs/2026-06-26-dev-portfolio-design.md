# Dev Portfolio Page — Design Spec

**Date:** 2026-06-26  
**Status:** Approved  
**Author:** Denis Kukobin / Jess

---

## Overview

A developer portfolio page (`/dev`) styled as a **merged GitHub Pull Request**. Shares the visual DNA of the existing QA portfolio page (same design system, same panel layout) but speaks the language of a developer. Denis is positioning himself as a public figure — the page must work for employers, freelance clients, and the tech community simultaneously.

---

## Metaphor

| Layer | QA page | Dev page |
|---|---|---|
| Document type | Jira ticket | GitHub Pull Request |
| Field labels | TITLE, DESCRIPTION, STEPS... | PR_TITLE, DESCRIPTION, FILES CHANGED... |
| Visual style | Ticket border + section shells | Same shells, PR-specific field names |
| Personality | QA engineer | Fullstack developer |

QA is mentioned on the dev page as context, not as the primary identity.

---

## Routing & Layout

- **Route:** `/[locale]/dev`
- **File:** `app/[locale]/(panel)/dev/page.tsx`
- **Layout:** Reuses existing `(panel)/layout.tsx` → `TicketMetaPanel` sidebar + main content
- **Sidebar metadata:** Adapted for PR context (Author, Branch, Review status: approved, Merged)

---

## Sections (top to bottom)

### 1. `PR_TITLE` — `components/sections/dev-title-section.tsx`
- Large `● merged` accent badge
- PR title: `feat: fullstack engineer`  
- Subtitle: role description  
- Stack tag pills (same `Tag` component)  
- Metrics row: projects count / years in dev / technologies  
- Photo: optional, same treatment as QA title  
- Mobile: single column, metrics wrap

### 2. `DESCRIPTION` — `components/sections/dev-description-section.tsx`
- Free-text pitch as a developer  
- Same `SectionShell` wrapper, same typography  
- Content in `messages/ru.json` + `messages/en.json` under `content.dev.description`

### 3. `FILES CHANGED` — `components/sections/dev-files-section.tsx`
- Project cards styled as diff file headers:
  ```
  ● src/projects/qa-sprint-board.tsx     +1204 −0
    QA Sprint Board · Next.js + Jira API
    [next.js] [typescript] [jira]   → link
  ```
- Green `+NNN` additions indicator on each card  
- Tags use existing `Tag` component  
- Grid: 1 col mobile → 2 cols `lg`  
- Data in `messages` under `content.dev.projects[]`

### 4. `DIFF` — `components/sections/dev-diff-section.tsx`
- Skill bars styled with `+` prefix and green fill (same `SkillBar` primitive)  
- Two groups (e.g. Languages / Testing) — same 2-col grid as `EnvironmentSection`  
- Tools row: `Tag` pills  
- Group titles removed (same pattern we applied to QA `EnvironmentSection`)  
- Mobile: stacks to single column

### 5. `COMMITS` — `components/sections/dev-commits-section.tsx`
- Vertical timeline with left accent line  
- Each commit:
  ```
  ● 2022–2024  feat: QA Lead @ SprutGaming
               Go, Kafka, Playwright, 21 microservices
  ```
- Animated with `Reveal` stagger  
- Mobile: line stays left, text wraps

### 6. `CHECKS` — `components/sections/dev-checks-section.tsx`
- CI-status list:
  ```
  ✓  ISTQB Foundation         passed
  ✓  Playwright Advanced       passed
  ◎  AWS Developer             in progress
  ```
- Green checkmark for passed, muted circle for in-progress  
- Data in `messages` under `content.dev.checks[]`

### 7. `ATTACHMENTS` — reuses `components/sections/attachments-section.tsx`
- No changes needed — already contacts-only after today's cleanup

---

## i18n

All content in `messages/ru.json` and `messages/en.json`:
- Namespace: `content.dev.*`
- Section field labels: `sections.dev.*`
- Same structure as `content.qa` / `sections.qa`

---

## TicketMetaPanel adaptation

The existing `TicketMetaPanel` likely reads from a config or translations. Need to:
- Add a `dev` variant with PR-specific metadata fields  
- Fields: Author, Branch (`feat/fullstack`), Status (`● Merged`), Labels, Milestone

---

## Technical constraints

### Responsiveness
- All layouts use existing Tailwind breakpoints (`lg:`)  
- No new breakpoints introduced  
- Cards: 1 col → 2 col at `lg`  
- Timeline: always single column, line on left  

### Browser support
- Chrome, Firefox, Safari, Edge — last 2 major versions  
- No exotic CSS features — stay within what the QA page already uses  
- `background-clip: text` already fixed with `padding-bottom: 0.1em`  
- `prefers-reduced-motion` already handled by `Reveal` and `SkillBar` primitives — inherited automatically

### Animations
- Same `Reveal` + stagger pattern as QA page  
- No new animation libraries

---

## File checklist

**New files:**
- `app/[locale]/(panel)/dev/page.tsx`
- `components/sections/dev-title-section.tsx`
- `components/sections/dev-description-section.tsx`
- `components/sections/dev-files-section.tsx`
- `components/sections/dev-diff-section.tsx`
- `components/sections/dev-commits-section.tsx`
- `components/sections/dev-checks-section.tsx`

**Modified files:**
- `messages/ru.json` — add `content.dev`, `sections.dev`
- `messages/en.json` — add `content.dev`, `sections.dev`
- `app/[locale]/page.tsx` — update landing card href from `undefined` to `/dev`
- `components/ticket-meta/ticket-meta-panel.tsx` — add PR variant for dev page

**Unchanged:**
- `components/sections/attachments-section.tsx` — reused as-is
- `app/[locale]/(panel)/layout.tsx` — no changes
- All UI primitives (`Tag`, `SkillBar`, `Reveal`, `Counter`, `SectionShell`)
