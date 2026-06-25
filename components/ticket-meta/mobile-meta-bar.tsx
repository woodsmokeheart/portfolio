"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { SECTIONS } from "@/lib/sections";
import { StatusBadge } from "./status-badge";

const TICKET_ID = "QA-001";

/**
 * Mobile-only secondary bar for QA sections navigation.
 * Lang and cross-section nav are handled by the GlobalNav pill above.
 */
export function MobileMetaBar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const isQaPage = pathname === `/${locale}/qa`;
  const sectionHref = (id: string) => (isQaPage ? `#${id}` : `/${locale}/qa#${id}`);

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

      {open && (
        <nav
          id={menuId}
          aria-label={t("meta.jump")}
          className="mx-auto flex w-full max-w-3xl flex-col gap-0.5 px-4 pb-3"
        >
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={sectionHref(section.id)}
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
