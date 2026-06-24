import type { Locale } from "@/lib/articles";

const LOCALE_TAG: Record<Locale, string> = {
  ru: "ru-RU",
  en: "en-US",
};

/** Localized, human-readable article date. Falls back to the raw string. */
export function formatDate(date: string, locale: Locale): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(LOCALE_TAG[locale] ?? "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
