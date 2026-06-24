import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Locale = "ru" | "en";

export type ArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  cover?: string;
  locale: Locale;
  availableLocales: Locale[];
};

export type Article = {
  meta: ArticleMeta;
  content: string;
};

const LOCALES: Locale[] = ["ru", "en"];
const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

const fileName = (slug: string, locale: Locale) => `${slug}.${locale}.mdx`;
const filePath = (slug: string, locale: Locale) =>
  path.join(ARTICLES_DIR, fileName(slug, locale));

function readDirSafe(): string[] {
  try {
    return fs.readdirSync(ARTICLES_DIR);
  } catch {
    return [];
  }
}

export function getArticleSlugs(): string[] {
  const slugs = new Set<string>();
  for (const entry of readDirSafe()) {
    const match = entry.match(/^(.+)\.(ru|en)\.mdx$/);
    if (match) slugs.add(match[1]);
  }
  return Array.from(slugs);
}

function availableLocalesFor(slug: string): Locale[] {
  return LOCALES.filter((locale) => fs.existsSync(filePath(slug, locale)));
}

function buildMeta(
  slug: string,
  locale: Locale,
  data: Record<string, unknown>,
  availableLocales: Locale[]
): ArticleMeta {
  const title =
    (data[`title_${locale}`] as string) ?? (data.title as string) ?? slug;
  const excerpt =
    (data[`excerpt_${locale}`] as string) ?? (data.excerpt as string) ?? "";
  return {
    slug,
    title,
    excerpt,
    date: (data.date as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    cover: data.cover as string | undefined,
    locale,
    availableLocales,
  };
}

export function getArticle(slug: string, locale: Locale): Article | null {
  const target = filePath(slug, locale);
  if (!fs.existsSync(target)) return null;

  const raw = fs.readFileSync(target, "utf8");
  const { data, content } = matter(raw);

  return {
    meta: buildMeta(slug, locale, data, availableLocalesFor(slug)),
    content,
  };
}

export function getAllArticlesMeta(locale: Locale): ArticleMeta[] {
  const metas: ArticleMeta[] = [];

  for (const slug of getArticleSlugs()) {
    const available = availableLocalesFor(slug);
    if (available.length === 0) continue;

    const sourceLocale = available.includes(locale) ? locale : available[0];
    const raw = fs.readFileSync(filePath(slug, sourceLocale), "utf8");
    const { data } = matter(raw);

    metas.push(buildMeta(slug, sourceLocale, data, available));
  }

  return metas.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
