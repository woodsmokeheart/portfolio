"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LangSwitcher } from "@/components/lang-switcher";
import { Tag } from "@/components/ui/tag";
import { SECTIONS, sectionIds } from "@/lib/sections";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { StatusBadge } from "./status-badge";

const TICKET_ID = "QA-001";
const LABELS = ["qa-lead", "automation", "go", "kafka"] as const;

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
  const activeId = useScrollSpy(sectionIds());

  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-6 lg:self-start lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto lg:py-10 lg:pr-2">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-lg font-semibold tracking-tight text-text-primary">
          {TICKET_ID}
        </span>
        <StatusBadge />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs uppercase tracking-wider text-text-tertiary">
          {t("meta.priority")}
        </span>
        <Tag className="self-start text-accent">{t("meta.priorityValue")}</Tag>
      </div>

      <div className="flex items-center gap-3">
        <Avatar />
        <div className="flex flex-col">
          <span className="text-sm text-text-primary">
            {t("meta.assigneeName")}
          </span>
          <span className="text-xs text-text-tertiary">
            {t("meta.assigneeRole")}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {LABELS.map((label) => (
          <Tag key={label}>{label}</Tag>
        ))}
      </div>

      <LangSwitcher />

      <nav aria-label={t("meta.jump")} className="flex flex-col gap-1 border-t border-stroke pt-5">
        {SECTIONS.map((section) => {
          const active = section.id === activeId;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
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
