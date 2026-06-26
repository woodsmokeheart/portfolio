# Dev Portfolio Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/dev` page styled as a merged GitHub Pull Request, sharing the existing design system and panel layout with the QA portfolio page.

**Architecture:** New route `app/[locale]/(panel)/dev/page.tsx` reuses the existing `(panel)/layout.tsx` and `TicketMetaPanel`. The panel auto-detects the current route to show PR-specific metadata and DEV_SECTIONS nav. Six new section components follow the same `SectionShell` + translations pattern as the QA sections.

**Tech Stack:** Next.js 16, next-intl, Tailwind CSS, motion/react, TypeScript. All new components follow existing patterns — no new libraries introduced.

---

## Task 1: Extend lib/sections.ts with DEV_SECTIONS

**Files:**
- Modify: `lib/sections.ts`
- Create: `lib/sections.test.ts`

- [ ] **Step 1: Add DEV_SECTIONS and devSectionIds to lib/sections.ts**

Replace the full contents of `lib/sections.ts` with:

```typescript
export type Section = {
  id: string;
  field: string;
  titleKey: string;
};

export const SECTIONS: Section[] = [
  { id: "title", field: "Title", titleKey: "title" },
  { id: "description", field: "Description", titleKey: "description" },
  { id: "preconditions", field: "Preconditions", titleKey: "preconditions" },
  { id: "steps", field: "Steps to Reproduce", titleKey: "steps" },
  { id: "expected", field: "Expected Result", titleKey: "expected" },
  { id: "actual", field: "Actual Result", titleKey: "actual" },
  { id: "environment", field: "Environment", titleKey: "environment" },
  { id: "attachments", field: "Attachments", titleKey: "attachments" },
];

export const DEV_SECTIONS: Section[] = [
  { id: "dev-title", field: "PR_TITLE", titleKey: "dev.title" },
  { id: "dev-description", field: "Description", titleKey: "dev.description" },
  { id: "dev-files", field: "Files Changed", titleKey: "dev.files" },
  { id: "dev-diff", field: "Diff", titleKey: "dev.diff" },
  { id: "dev-commits", field: "Commits", titleKey: "dev.commits" },
  { id: "dev-checks", field: "Checks", titleKey: "dev.checks" },
  { id: "dev-attachments", field: "Attachments", titleKey: "dev.attachments" },
];

export function sectionIds(): string[] {
  return SECTIONS.map((s) => s.id);
}

export function devSectionIds(): string[] {
  return DEV_SECTIONS.map((s) => s.id);
}
```

- [ ] **Step 2: Write test for sections lib**

Create `lib/sections.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { SECTIONS, DEV_SECTIONS, sectionIds, devSectionIds } from "./sections";

describe("SECTIONS", () => {
  it("has 8 QA sections", () => {
    expect(SECTIONS).toHaveLength(8);
  });

  it("sectionIds returns all QA ids", () => {
    expect(sectionIds()).toEqual(SECTIONS.map((s) => s.id));
  });
});

describe("DEV_SECTIONS", () => {
  it("has 7 dev sections", () => {
    expect(DEV_SECTIONS).toHaveLength(7);
  });

  it("devSectionIds returns all dev ids", () => {
    expect(devSectionIds()).toEqual(DEV_SECTIONS.map((s) => s.id));
  });

  it("all dev section ids start with dev-", () => {
    expect(DEV_SECTIONS.every((s) => s.id.startsWith("dev-"))).toBe(true);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
cd /Users/deniskukobin/jessai/portfolio && npx vitest run lib/sections.test.ts
```

Expected: all 5 tests pass.

- [ ] **Step 4: Commit**

```bash
git add lib/sections.ts lib/sections.test.ts
git commit -m "feat(sections): add DEV_SECTIONS registry and devSectionIds helper"
```

---

## Task 2: Update TicketMetaPanel for dev page

**Files:**
- Modify: `components/ticket-meta/ticket-meta-panel.tsx`

- [ ] **Step 1: Replace TicketMetaPanel with page-aware version**

Replace the full contents of `components/ticket-meta/ticket-meta-panel.tsx`:

```typescript
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { LangSwitcher } from "@/components/lang-switcher";
import { Tag } from "@/components/ui/tag";
import { SECTIONS, DEV_SECTIONS } from "@/lib/sections";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { StatusBadge } from "./status-badge";

const QA_TICKET_ID = "QA-001";
const PR_ID = "PR-001";

const QA_LABELS = ["qa-lead", "fullstack", "playwright", "grafana"] as const;
const DEV_LABELS = ["next.js", "typescript", "playwright", "go"] as const;

function Avatar() {
  const [failed, setFailed] = useState(false);

  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stroke bg-bg-elevated font-mono text-sm text-text-secondary">
      DK
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/denis-photo.jpg"
          alt=""
          aria-hidden
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </span>
  );
}

export function TicketMetaPanel() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  const isQaPage = pathname === `/${locale}/qa`;
  const isDevPage = pathname === `/${locale}/dev`;

  const sections = isDevPage ? DEV_SECTIONS : SECTIONS;
  const activeId = useScrollSpy(sections.map((s) => s.id));

  const sectionHref = (id: string) => {
    if (isQaPage) return `#${id}`;
    if (isDevPage) return `#${id}`;
    return `/${locale}/qa#${id}`;
  };

  const ticketId = isDevPage ? PR_ID : QA_TICKET_ID;
  const labels = isDevPage ? DEV_LABELS : QA_LABELS;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-6 lg:self-start lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto lg:pt-8 lg:pb-24 lg:pr-2">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-lg font-semibold tracking-tight text-text-primary">
          {ticketId}
        </span>
        <StatusBadge />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-wider text-text-tertiary">
          {isDevPage ? "Branch" : t("meta.priority")}
        </span>
        <Tag className="self-start text-accent">
          {isDevPage ? "feat/fullstack" : t("meta.priorityValue")}
        </Tag>
      </div>

      <div className="flex items-center gap-3">
        <Avatar />
        <div className="flex flex-col">
          <span className="text-sm text-text-primary">
            {t("meta.assigneeName")}
          </span>
          <span className="text-xs text-text-tertiary">
            {isDevPage ? "Fullstack Engineer" : t("meta.assigneeRole")}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {labels.map((label) => (
          <Tag key={label}>{label}</Tag>
        ))}
      </div>

      <LangSwitcher />

      <nav aria-label={t("meta.jump")} className="flex flex-col gap-1 border-t border-stroke pt-5">
        {sections.map((section) => {
          const active = (isQaPage || isDevPage) && section.id === activeId;
          return (
            <a
              key={section.id}
              href={sectionHref(section.id)}
              aria-current={active ? "true" : undefined}
              className={[
                "rounded px-2 py-1 font-mono text-xs transition-colors",
                active
                  ? "text-accent"
                  : "text-text-tertiary hover:text-text-secondary",
              ].join(" ")}
            >
              {t(`sections.${section.titleKey}.label`)}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Verify lints pass**

```bash
cd /Users/deniskukobin/jessai/portfolio && npx eslint components/ticket-meta/ticket-meta-panel.tsx --max-warnings=0
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ticket-meta/ticket-meta-panel.tsx
git commit -m "feat(meta-panel): add dev page variant with PR_ID, branch tag and DEV_SECTIONS nav"
```

---

## Task 3: Add dev translations to messages/ru.json and messages/en.json

**Files:**
- Modify: `messages/ru.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Add dev sections labels to messages/ru.json**

In `messages/ru.json`, inside the `"sections"` object, add after the `"attachments"` entry:

```json
"dev": {
  "title":       { "field": "PR_TITLE",      "label": "Профиль" },
  "description": { "field": "Description",   "label": "Кто я как разработчик" },
  "files":       { "field": "Files Changed", "label": "Проекты" },
  "diff":        { "field": "Diff",          "label": "Стек" },
  "commits":     { "field": "Commits",       "label": "Опыт" },
  "checks":      { "field": "Checks",        "label": "Достижения" },
  "attachments": { "field": "Attachments",   "label": "Контакты" }
}
```

- [ ] **Step 2: Add dev content to messages/ru.json**

In `messages/ru.json`, inside the `"content"` object, add after the `"attachments"` entry:

```json
"dev": {
  "title": {
    "badge": "merged",
    "prTitle": "feat: fullstack engineer",
    "headline": "Пишу код, который не ломается. А если ломается — нахожу это первым.",
    "metrics": {
      "projects": "проектов",
      "years": "лет в коде",
      "technologies": "технологий"
    }
  },
  "description": {
    "body": "Начинал как фронтенд-разработчик на React — код был раньше, чем QA. Сейчас веду QA в SprutGaming и параллельно строю инструменты: от Playwright-фреймворков до AI-пайплайнов. Понимаю продукт изнутри: читаю Go-сервисы, разбираюсь в Kafka-топиках, нахожу баги на уровне архитектуры, а не только UI. Инструменты под задачу, а не ради стека."
  },
  "files": {
    "projects": [
      {
        "path": "src/projects/qa-sprint-board.tsx",
        "additions": 1840,
        "name": "QA Sprint Board",
        "desc": "Дашборд QA-команды: Jira API, спринт-прогресс, метрики команды в реальном времени.",
        "tags": ["Next.js", "TypeScript", "Jira API"],
        "url": null
      },
      {
        "path": "src/projects/portfolio.tsx",
        "additions": 3200,
        "name": "Portfolio Site",
        "desc": "Это портфолио: Next.js 16, next-intl, MDX-статьи, Tailwind, Framer Motion.",
        "tags": ["Next.js", "MDX", "Tailwind"],
        "url": null
      },
      {
        "path": "src/projects/playwright-framework.tsx",
        "additions": 960,
        "name": "Playwright E2E Framework",
        "desc": "Фреймворк для e2e-тестирования iGaming-платформы: Page Object, fixtures, отчёты.",
        "tags": ["Playwright", "TypeScript", "CI/CD"],
        "url": null
      },
      {
        "path": "src/projects/llm-test-toolkit.tsx",
        "additions": 540,
        "name": "LLM Test Toolkit",
        "desc": "Инструменты для тестирования LLM-чатов: верификация ответов, MCP-интеграции.",
        "tags": ["Python", "LLM", "MCP"],
        "url": null
      }
    ]
  },
  "diff": {
    "groups": [
      {
        "title": "Frontend",
        "skills": [
          { "label": "React / Next.js", "level": 100 },
          { "label": "TypeScript", "level": 88 },
          { "label": "Tailwind CSS", "level": 85 },
          { "label": "Framer Motion", "level": 75 }
        ]
      },
      {
        "title": "Automation & Backend",
        "skills": [
          { "label": "Playwright", "level": 85 },
          { "label": "Go (reading/debugging)", "level": 72 },
          { "label": "Node.js / Express", "level": 78 },
          { "label": "PostgreSQL", "level": 70 }
        ]
      }
    ],
    "tools": [
      "React", "Next.js", "TypeScript", "Playwright", "Vitest",
      "Tailwind CSS", "Framer Motion", "MDX", "Kafka", "Docker",
      "PostgreSQL", "Grafana", "Git", "Figma", "Cursor IDE"
    ]
  },
  "commits": {
    "items": [
      {
        "period": "2020",
        "message": "feat: first dev job — QA + React @ VegaAvangard",
        "detail": "CRM-система, белый ящик, параллельный фронтенд на React. Научился читать код до его запуска."
      },
      {
        "period": "2021–2024",
        "message": "feat: DEX, LLM-chat, crypto @ Aurora Infinity",
        "detail": "Playwright, Jest, ~70% покрытие. Написал тест-стратегии для LLM-чата и MCP-серверов там, где методик не было."
      },
      {
        "period": "2025",
        "message": "feat: AI-assisted QA tooling @ SprutGaming",
        "detail": "Автоматизация e2e iGaming-платформы: Page Object framework, Playwright + Cursor IDE + Claude. Зафиксировано как корпоративный стандарт."
      },
      {
        "period": "2026",
        "message": "feat: portfolio + qa-sprint-board (this PR)",
        "detail": "Портфолио на Next.js 16 + MDX. QA Sprint Board с Jira API. Публичное позиционирование как tech-лидера."
      }
    ]
  },
  "checks": {
    "items": [
      { "name": "ISTQB Foundation Level", "status": "passed" },
      { "name": "QA процессы с нуля → корпоративный стандарт", "status": "passed" },
      { "name": "AI-assisted QA как регламент компании", "status": "passed" },
      { "name": "Команда 14 человек — онбординг 8+ специалистов", "status": "passed" },
      { "name": "Open Source contributions", "status": "in-progress" }
    ]
  }
}
```

- [ ] **Step 3: Add dev sections labels to messages/en.json**

In `messages/en.json`, inside the `"sections"` object, add after the `"attachments"` entry:

```json
"dev": {
  "title":       { "field": "PR_TITLE",      "label": "Profile" },
  "description": { "field": "Description",   "label": "Who I am as a dev" },
  "files":       { "field": "Files Changed", "label": "Projects" },
  "diff":        { "field": "Diff",          "label": "Stack" },
  "commits":     { "field": "Commits",       "label": "Experience" },
  "checks":      { "field": "Checks",        "label": "Achievements" },
  "attachments": { "field": "Attachments",   "label": "Contacts" }
}
```

- [ ] **Step 4: Add dev content to messages/en.json**

In `messages/en.json`, inside the `"content"` object, add after the `"attachments"` entry:

```json
"dev": {
  "title": {
    "badge": "merged",
    "prTitle": "feat: fullstack engineer",
    "headline": "I write code that doesn't break. And when it does — I find it first.",
    "metrics": {
      "projects": "projects",
      "years": "years coding",
      "technologies": "technologies"
    }
  },
  "description": {
    "body": "Started as a React frontend developer — code came before QA. Now I lead QA at SprutGaming while building tools on the side: Playwright frameworks, AI pipelines, internal dashboards. I understand products from the inside: I read Go services, trace Kafka topics, find bugs at the architecture level, not just in the UI. Right tool for the job, not just a stack for the resume."
  },
  "files": {
    "projects": [
      {
        "path": "src/projects/qa-sprint-board.tsx",
        "additions": 1840,
        "name": "QA Sprint Board",
        "desc": "QA team dashboard: Jira API, sprint progress, real-time team metrics.",
        "tags": ["Next.js", "TypeScript", "Jira API"],
        "url": null
      },
      {
        "path": "src/projects/portfolio.tsx",
        "additions": 3200,
        "name": "Portfolio Site",
        "desc": "This portfolio: Next.js 16, next-intl, MDX articles, Tailwind, Framer Motion.",
        "tags": ["Next.js", "MDX", "Tailwind"],
        "url": null
      },
      {
        "path": "src/projects/playwright-framework.tsx",
        "additions": 960,
        "name": "Playwright E2E Framework",
        "desc": "E2E testing framework for iGaming platform: Page Object, fixtures, reports.",
        "tags": ["Playwright", "TypeScript", "CI/CD"],
        "url": null
      },
      {
        "path": "src/projects/llm-test-toolkit.tsx",
        "additions": 540,
        "name": "LLM Test Toolkit",
        "desc": "Tools for testing LLM-chat products: response verification, MCP integrations.",
        "tags": ["Python", "LLM", "MCP"],
        "url": null
      }
    ]
  },
  "diff": {
    "groups": [
      {
        "title": "Frontend",
        "skills": [
          { "label": "React / Next.js", "level": 100 },
          { "label": "TypeScript", "level": 88 },
          { "label": "Tailwind CSS", "level": 85 },
          { "label": "Framer Motion", "level": 75 }
        ]
      },
      {
        "title": "Automation & Backend",
        "skills": [
          { "label": "Playwright", "level": 85 },
          { "label": "Go (reading/debugging)", "level": 72 },
          { "label": "Node.js / Express", "level": 78 },
          { "label": "PostgreSQL", "level": 70 }
        ]
      }
    ],
    "tools": [
      "React", "Next.js", "TypeScript", "Playwright", "Vitest",
      "Tailwind CSS", "Framer Motion", "MDX", "Kafka", "Docker",
      "PostgreSQL", "Grafana", "Git", "Figma", "Cursor IDE"
    ]
  },
  "commits": {
    "items": [
      {
        "period": "2020",
        "message": "feat: first dev job — QA + React @ VegaAvangard",
        "detail": "CRM system, white-box testing, parallel React frontend work. Learned to read code before running it."
      },
      {
        "period": "2021–2024",
        "message": "feat: DEX, LLM-chat, crypto @ Aurora Infinity",
        "detail": "Playwright, Jest, ~70% coverage. Wrote test strategies for LLM-chat and MCP servers from scratch — no prior art."
      },
      {
        "period": "2025",
        "message": "feat: AI-assisted QA tooling @ SprutGaming",
        "detail": "E2E automation for iGaming platform: Page Object framework, Playwright + Cursor IDE + Claude. Adopted as company standard."
      },
      {
        "period": "2026",
        "message": "feat: portfolio + qa-sprint-board (this PR)",
        "detail": "Portfolio on Next.js 16 + MDX. QA Sprint Board with Jira API. Going public as a tech leader."
      }
    ]
  },
  "checks": {
    "items": [
      { "name": "ISTQB Foundation Level", "status": "passed" },
      { "name": "QA process from zero → company standard", "status": "passed" },
      { "name": "AI-assisted QA as a company regulation", "status": "passed" },
      { "name": "Team of 14 — onboarded 8+ specialists", "status": "passed" },
      { "name": "Open Source contributions", "status": "in-progress" }
    ]
  }
}
```

- [ ] **Step 5: Verify Next.js starts without translation errors**

```bash
cd /Users/deniskukobin/jessai/portfolio && npx next build 2>&1 | tail -20
```

Expected: build completes without "Missing message" errors.

- [ ] **Step 6: Commit**

```bash
git add messages/ru.json messages/en.json
git commit -m "feat(i18n): add dev page translations — sections labels and full content"
```

---

## Task 4: DevTitleSection component

**Files:**
- Create: `components/sections/dev-title-section.tsx`

- [ ] **Step 1: Create the component**

Create `components/sections/dev-title-section.tsx`:

```typescript
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";
import { ScrambleTag } from "@/components/ui/scramble-tag";

const DEV_LABELS = ["next.js", "typescript", "playwright", "go"] as const;

const DEV_METRICS = [
  { key: "projects", value: 8, suffix: "" },
  { key: "years", value: 6, suffix: "+" },
  { key: "technologies", value: 15, suffix: "+" },
] as const;

export function DevTitleSection() {
  const t = useTranslations("content.dev.title");
  const tField = useTranslations("sections.dev.title");

  return (
    <section
      id="dev-title"
      className="flex scroll-mt-24 flex-col gap-6 rounded-md border border-stroke bg-bg-elevated p-4 lg:scroll-mt-10 lg:p-6"
    >
      <ScrambleTag className="self-start uppercase tracking-wider text-text-quaternary">
        {tField("field")}
      </ScrambleTag>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="relative lg:order-2 lg:shrink-0">
          <div
            className="aurora-glow pointer-events-none absolute -inset-6 rounded-full bg-accent/15 blur-3xl"
            aria-hidden="true"
          />
          <Reveal delay={0.1}>
            <figure className="relative w-full max-w-xs overflow-hidden rounded-md border border-stroke bg-bg lg:w-56">
              <div className="flex items-center justify-between border-b border-stroke px-3 py-1.5">
                <span className="font-mono text-xs text-text-secondary">denis.jpg</span>
                <span className="font-mono text-xs text-text-quaternary">1024×1365</span>
              </div>
              <Image
                src="/denis-photo.jpg"
                alt={t("prTitle")}
                width={1024}
                height={1365}
                priority
                sizes="(min-width: 1024px) 224px, (min-width: 640px) 320px, 100vw"
                className="h-auto w-full"
              />
            </figure>
          </Reveal>
        </div>

        <div className="flex flex-col gap-5 lg:order-1">
          <Reveal>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 font-mono text-sm font-medium text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                {t("badge")}
              </span>
              <h1 className="gradient-text text-3xl font-semibold tracking-tight lg:text-5xl">
                {t("prTitle")}
              </h1>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="max-w-xl text-balance text-base text-text-secondary lg:text-lg">
              {t("headline")}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {DEV_LABELS.map((label) => (
                <Tag key={label}>{label}</Tag>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="flex flex-wrap gap-x-8 gap-y-4 pt-1">
              {DEV_METRICS.map((metric) => (
                <div key={metric.key} className="flex flex-col gap-0.5">
                  <dt className="order-2 font-mono text-xs uppercase tracking-wider text-text-tertiary">
                    {t(`metrics.${metric.key}`)}
                  </dt>
                  <dd className="order-1 text-3xl font-semibold tabular-nums text-accent lg:text-4xl">
                    <Counter value={metric.value} suffix={metric.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/dev-title-section.tsx
git commit -m "feat(dev): add DevTitleSection — merged badge, PR title, metrics"
```

---

## Task 5: DevDescriptionSection component

**Files:**
- Create: `components/sections/dev-description-section.tsx`

- [ ] **Step 1: Create the component**

Create `components/sections/dev-description-section.tsx`:

```typescript
import { useTranslations } from "next-intl";
import { SectionShell } from "./section-shell";

export function DevDescriptionSection() {
  const t = useTranslations("content.dev.description");
  const tField = useTranslations("sections.dev.description");

  return (
    <SectionShell
      id="dev-description"
      field={tField("field")}
      title={tField("label")}
    >
      <p className="max-w-2xl text-pretty text-base leading-relaxed text-text-secondary">
        {t("body")}
      </p>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/dev-description-section.tsx
git commit -m "feat(dev): add DevDescriptionSection"
```

---

## Task 6: DevFilesSection component (projects)

**Files:**
- Create: `components/sections/dev-files-section.tsx`

- [ ] **Step 1: Create the component**

Create `components/sections/dev-files-section.tsx`:

```typescript
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";
import { SectionShell } from "./section-shell";

type Project = {
  path: string;
  additions: number;
  name: string;
  desc: string;
  tags: string[];
  url: string | null;
};

export function DevFilesSection() {
  const t = useTranslations("content.dev.files");
  const tField = useTranslations("sections.dev.files");
  const projects = t.raw("projects") as Project[];

  return (
    <SectionShell
      id="dev-files"
      field={tField("field")}
      title={tField("label")}
    >
      <ul className="flex flex-col gap-3">
        {projects.map((project, i) => {
          const Wrapper = project.url ? "a" : "div";
          const wrapperProps = project.url
            ? { href: project.url, target: "_blank", rel: "noopener noreferrer" }
            : {};

          return (
            <Reveal as="li" key={project.path} delay={i * 0.07}>
              <Wrapper
                {...wrapperProps}
                className={[
                  "group flex flex-col gap-3 rounded-md border border-stroke bg-bg p-4 transition-colors",
                  project.url ? "hover:border-accent cursor-pointer" : "",
                ].join(" ")}
              >
                {/* diff file header row */}
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-mono text-xs text-text-quaternary">
                    {project.path}
                  </span>
                  <span className="shrink-0 font-mono text-xs font-medium text-accent">
                    +{project.additions.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-text-primary">
                    {project.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {project.desc}
                  </p>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              </Wrapper>
            </Reveal>
          );
        })}
      </ul>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/dev-files-section.tsx
git commit -m "feat(dev): add DevFilesSection — project cards with diff file header style"
```

---

## Task 7: DevDiffSection component (skills)

**Files:**
- Create: `components/sections/dev-diff-section.tsx`

- [ ] **Step 1: Create the component**

Create `components/sections/dev-diff-section.tsx`:

```typescript
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SkillBar } from "@/components/ui/skill-bar";
import { Tag } from "@/components/ui/tag";
import { SectionShell } from "./section-shell";

type SkillGroup = {
  title: string;
  skills: { label: string; level: number }[];
};

export function DevDiffSection() {
  const t = useTranslations("content.dev.diff");
  const tField = useTranslations("sections.dev.diff");
  const groups = t.raw("groups") as SkillGroup[];
  const tools = t.raw("tools") as string[];

  return (
    <SectionShell
      id="dev-diff"
      field={tField("field")}
      title={tField("label")}
    >
      <div className="flex flex-col gap-8">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {group.skills.map((skill, i) => (
                  <Reveal key={skill.label} delay={i * 0.06}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-accent select-none">+</span>
                      <SkillBar label={skill.label} level={skill.level} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

        <ul className="flex flex-wrap gap-2">
          {tools.map((tool, i) => (
            <Reveal as="li" key={tool} delay={i * 0.04}>
              <Tag>{tool}</Tag>
            </Reveal>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/dev-diff-section.tsx
git commit -m "feat(dev): add DevDiffSection — skill bars with diff + prefix, tools row"
```

---

## Task 8: DevCommitsSection component (timeline)

**Files:**
- Create: `components/sections/dev-commits-section.tsx`

- [ ] **Step 1: Create the component**

This is a client component (uses `motion/react` scroll animation), matching the pattern from `steps-section.tsx`.

Create `components/sections/dev-commits-section.tsx`:

```typescript
"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "./section-shell";

type Commit = {
  period: string;
  message: string;
  detail: string;
};

export function DevCommitsSection() {
  const t = useTranslations("content.dev.commits");
  const tField = useTranslations("sections.dev.commits");
  const reduce = useReducedMotion();
  const items = t.raw("items") as Commit[];

  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <SectionShell
      id="dev-commits"
      field={tField("field")}
      title={tField("label")}
    >
      <ol ref={timelineRef} className="relative flex flex-col gap-8">
        <span
          aria-hidden
          className="absolute bottom-3 left-[6px] top-3 w-0.5 bg-stroke"
        />
        <motion.span
          aria-hidden
          style={reduce ? undefined : { scaleY }}
          className="absolute bottom-3 left-[6px] top-3 w-0.5 origin-top bg-accent"
        />

        {items.map((commit, i) => (
          <Reveal
            as="li"
            key={commit.period}
            delay={i * 0.08}
            className="relative flex gap-4"
          >
            <span className="relative z-10 mt-1.5 block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-accent bg-bg" />

            <div className="flex flex-col gap-1 pb-1">
              <span className="font-mono text-sm font-medium text-accent">
                {commit.period}
              </span>
              <h3 className="font-mono text-sm text-text-primary">
                {commit.message}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-text-secondary">
                {commit.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/dev-commits-section.tsx
git commit -m "feat(dev): add DevCommitsSection — animated timeline of dev experience"
```

---

## Task 9: DevChecksSection component (achievements)

**Files:**
- Create: `components/sections/dev-checks-section.tsx`

- [ ] **Step 1: Create the component**

Create `components/sections/dev-checks-section.tsx`:

```typescript
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "./section-shell";

type CheckItem = {
  name: string;
  status: "passed" | "in-progress";
};

export function DevChecksSection() {
  const t = useTranslations("content.dev.checks");
  const tField = useTranslations("sections.dev.checks");
  const items = t.raw("items") as CheckItem[];

  return (
    <SectionShell
      id="dev-checks"
      field={tField("field")}
      title={tField("label")}
    >
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <Reveal as="li" key={item.name} delay={i * 0.06}>
            <div className="flex min-h-11 items-center gap-3 rounded-md border border-stroke bg-bg px-3 py-2">
              {item.status === "passed" ? (
                <span
                  className="font-mono text-sm font-semibold text-accent"
                  aria-label="passed"
                >
                  ✓
                </span>
              ) : (
                <span
                  className="font-mono text-sm font-semibold text-text-quaternary"
                  aria-label="in progress"
                >
                  ◎
                </span>
              )}
              <span className="text-sm text-text-secondary">{item.name}</span>
              <span className="ml-auto font-mono text-xs text-text-quaternary">
                {item.status === "passed" ? "passed" : "in progress"}
              </span>
            </div>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/dev-checks-section.tsx
git commit -m "feat(dev): add DevChecksSection — CI-style achievements list"
```

---

## Task 10: Dev page route + landing card href

**Files:**
- Create: `app/[locale]/(panel)/dev/page.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Create dev page route**

Create `app/[locale]/(panel)/dev/page.tsx`:

```typescript
import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { DevTitleSection } from "@/components/sections/dev-title-section";
import { DevDescriptionSection } from "@/components/sections/dev-description-section";
import { DevFilesSection } from "@/components/sections/dev-files-section";
import { DevDiffSection } from "@/components/sections/dev-diff-section";
import { DevCommitsSection } from "@/components/sections/dev-commits-section";
import { DevChecksSection } from "@/components/sections/dev-checks-section";
import { AttachmentsSection } from "@/components/sections/attachments-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function DevPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main className="flex w-full flex-col gap-4 py-10 lg:py-16">
      <DevTitleSection />
      <DevDescriptionSection />
      <DevFilesSection />
      <DevDiffSection />
      <DevCommitsSection />
      <DevChecksSection />
      <AttachmentsSection />
    </main>
  );
}
```

- [ ] **Step 2: Update landing card href from undefined to /dev**

In `app/[locale]/page.tsx`, find the dev card and change `href: undefined` to `href: "/dev"`:

```typescript
// Before:
{
  id: t("dev.id"),
  status: "review",
  statusLabel: t("dev.status"),
  title: t("dev.title"),
  desc: t("dev.desc"),
  tags: t.raw("dev.tags") as string[],
  cta: t("dev.cta"),
  href: undefined,
},

// After:
{
  id: t("dev.id"),
  status: "review",
  statusLabel: t("dev.status"),
  title: t("dev.title"),
  desc: t("dev.desc"),
  tags: t.raw("dev.tags") as string[],
  cta: t("dev.cta"),
  href: "/dev",
},
```

- [ ] **Step 3: Update landing CTA text in translations**

In `messages/ru.json`, find `"landing"` → `"dev"` → change `"cta": "Скоро"` to `"cta": "Открыть"`.

In `messages/en.json`, find `"landing"` → `"dev"` → change `"cta": "Soon"` to `"cta": "Open"`.

- [ ] **Step 4: Verify dev page loads**

```bash
cd /Users/deniskukobin/jessai/portfolio && npx next build 2>&1 | grep -E "error|Error|✓|○|●" | tail -30
```

Expected: `/dev` appears in build output as a valid route without errors.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/(panel)/dev/page.tsx" "app/[locale]/page.tsx" messages/ru.json messages/en.json
git commit -m "feat(dev): wire up /dev page route and enable landing card link"
```

---

## Task 11: Final lint check and push

- [ ] **Step 1: Run linter across new files**

```bash
cd /Users/deniskukobin/jessai/portfolio && npx eslint \
  components/sections/dev-title-section.tsx \
  components/sections/dev-description-section.tsx \
  components/sections/dev-files-section.tsx \
  components/sections/dev-diff-section.tsx \
  components/sections/dev-commits-section.tsx \
  components/sections/dev-checks-section.tsx \
  "app/[locale]/(panel)/dev/page.tsx" \
  --max-warnings=0
```

Expected: no errors or warnings.

- [ ] **Step 2: Run full test suite**

```bash
cd /Users/deniskukobin/jessai/portfolio && npx vitest run
```

Expected: all tests pass including the new `lib/sections.test.ts`.

- [ ] **Step 3: Push to remote**

```bash
cd /Users/deniskukobin/jessai/portfolio && git push
```
