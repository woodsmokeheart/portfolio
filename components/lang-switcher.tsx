"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="inline-flex items-center gap-1 font-mono text-sm">
      {routing.locales.map((loc, i) => {
        const active = loc === locale;
        return (
          <span key={loc} className="inline-flex items-center">
            {i > 0 && <span className="px-1 text-text-quaternary">/</span>}
            <button
              type="button"
              aria-current={active ? "true" : undefined}
              onClick={() => {
                if (active) return;
                const hash =
                  typeof window !== "undefined" ? window.location.hash : "";
                router.replace(`${pathname}${hash}`, { locale: loc });
              }}
              className={
                active
                  ? "uppercase text-accent"
                  : "uppercase text-text-tertiary transition-colors hover:text-text-secondary"
              }
            >
              {loc}
            </button>
          </span>
        );
      })}
    </div>
  );
}
