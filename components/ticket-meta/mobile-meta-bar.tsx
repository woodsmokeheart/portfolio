"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { LangSwitcher } from "@/components/lang-switcher";
import { SECTIONS } from "@/lib/sections";
import { StatusBadge } from "./status-badge";

const TICKET_ID = "QA-001";

export function MobileMetaBar() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div
      className="sticky top-0 z-20 border-b border-stroke backdrop-blur lg:hidden"
      style={{
        backgroundColor: "rgba(10, 10, 11, 0.85)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-text-primary">
            {TICKET_ID}
          </span>
          <StatusBadge compact />
        </div>

        <div className="flex items-center gap-3">
          <LangSwitcher />
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
            className="rounded border border-stroke px-2.5 py-1 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            {t("meta.jump")}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id={menuId}
          aria-label={t("meta.jump")}
          className="mx-auto flex w-full max-w-3xl flex-col gap-0.5 px-4 pb-3"
        >
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 font-mono text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              {t(`sections.${section.titleKey}.label`)}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
