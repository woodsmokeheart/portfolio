"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Home, Bug, Code2, FileText } from "lucide-react";

function LangToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const next = locale === "ru" ? "en" : "ru";
  const rawPath = pathname.replace(/^\/(ru|en)/, "") || "/";

  return (
    <button
      type="button"
      aria-label={`Switch to ${next.toUpperCase()}`}
      onClick={() => router.replace(rawPath, { locale: next })}
      className="flex h-9 items-center rounded-full px-3 font-mono text-xs transition-all duration-200"
    >
      <span className={locale === "ru" ? "text-accent" : "text-text-tertiary"}>
        RU
      </span>
      <span className="mx-1.5 text-text-quaternary">|</span>
      <span className={locale === "en" ? "text-accent" : "text-text-tertiary"}>
        EN
      </span>
    </button>
  );
}

type NavItem =
  | { type: "link"; href: string; icon: React.ElementType; label: string; match: (p: string, l: string) => boolean; disabled?: false }
  | { type: "link"; href: string; icon: React.ElementType; label: string; match: (p: string, l: string) => boolean; disabled: true };

const NAV_ITEMS: NavItem[] = [
  { type: "link", href: "/",         icon: Home,     label: "Home",     match: (p, l) => p === `/${l}` || p === "/",          disabled: false },
  { type: "link", href: "/articles", icon: FileText,  label: "Articles", match: (p, l) => p.startsWith(`/${l}/articles`),      disabled: false },
  { type: "link", href: "/dev",      icon: Code2,     label: "Dev",      match: () => false,                                   disabled: true  },
  { type: "link", href: "/qa",       icon: Bug,       label: "QA",       match: (p, l) => p.startsWith(`/${l}/qa`),            disabled: false },
];

export function GlobalNav() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <nav
        className="flex items-center gap-0.5 rounded-full border border-accent/20 px-2 py-1.5"
        style={{
          background: "rgba(14, 14, 16, 0.80)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow:
            "0 0 0 1px rgba(74,222,128,0.08), 0 4px 24px rgba(0,0,0,0.4), 0 0 32px rgba(74,222,128,0.10)",
        }}
        aria-label="Main navigation"
      >
        {/* Home */}
        {NAV_ITEMS.slice(0, 2).map(({ href, icon: Icon, label, match, disabled }) => {
          const active = match(pathname, locale);
          if (disabled) {
            return (
              <span key={href} title={`${label} — coming soon`}
                className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full text-text-quaternary opacity-40">
                <Icon size={17} strokeWidth={1.8} />
              </span>
            );
          }
          return (
            <Link key={href} href={href} aria-label={label} title={label}
              className={["flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                active ? "bg-accent/15 text-accent shadow-[0_0_12px_rgba(74,222,128,0.2)]"
                       : "text-text-tertiary hover:text-text-secondary hover:bg-white/5",
              ].join(" ")}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
            </Link>
          );
        })}

        {/* Lang toggle */}
        <LangToggle />

        {/* Dev + QA */}
        {NAV_ITEMS.slice(2).map(({ href, icon: Icon, label, match, disabled }) => {
          const active = match(pathname, locale);
          if (disabled) {
            return (
              <span key={href} title={`${label} — coming soon`}
                className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full text-text-quaternary opacity-40">
                <Icon size={17} strokeWidth={1.8} />
              </span>
            );
          }
          return (
            <Link key={href} href={href} aria-label={label} title={label}
              className={["flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                active ? "bg-accent/15 text-accent shadow-[0_0_12px_rgba(74,222,128,0.2)]"
                       : "text-text-tertiary hover:text-text-secondary hover:bg-white/5",
              ].join(" ")}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
