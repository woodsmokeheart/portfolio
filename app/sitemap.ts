import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getArticleSlugs, getArticle, type Locale } from "@/lib/articles";
import { siteUrl } from "@/lib/site";

const locales = routing.locales as readonly Locale[];

function languagesFor(path: string): Record<string, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: languagesFor("") },
    });
    entries.push({
      url: `${siteUrl}/${locale}/qa`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: languagesFor("/qa") },
    });
    entries.push({
      url: `${siteUrl}/${locale}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languagesFor("/articles") },
    });
  }

  for (const slug of getArticleSlugs()) {
    for (const locale of locales) {
      const article = getArticle(slug, locale);
      if (!article) continue;

      const date = article.meta.date ? new Date(article.meta.date) : now;
      entries.push({
        url: `${siteUrl}/${locale}/articles/${slug}`,
        lastModified: Number.isNaN(date.getTime()) ? now : date,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: languagesFor(`/articles/${slug}`) },
      });
    }
  }

  return entries;
}
