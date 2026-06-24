import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Tag } from "@/components/ui/tag";
import { formatDate } from "@/lib/format";
import { mdxComponents } from "@/mdx-components";
import {
  getArticle,
  getArticleSlugs,
  type Article,
  type Locale,
} from "@/lib/articles";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getArticleSlugs().flatMap((slug) =>
    routing.locales.map((locale) => ({ locale, slug })),
  );
}

/** Load the requested locale, falling back to the other locale if missing. */
function resolveArticle(slug: string, locale: Locale): Article | null {
  const requested = getArticle(slug, locale);
  if (requested) return requested;

  for (const fallback of routing.locales) {
    if (fallback === locale) continue;
    const article = getArticle(slug, fallback as Locale);
    if (article) return article;
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = resolveArticle(slug, locale as Locale);
  if (!article) return {};

  return {
    title: article.meta.title,
    description: article.meta.excerpt,
    openGraph: {
      title: article.meta.title,
      description: article.meta.excerpt,
      type: "article",
      images: article.meta.cover ? [article.meta.cover] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const article = resolveArticle(slug, locale as Locale);
  if (!article) {
    notFound();
  }

  const t = await getTranslations("articles");
  const isFallback = article.meta.locale !== locale;

  return (
    <main className="flex w-full flex-col gap-6 py-10 lg:py-16">
      <Link
        href="/articles"
        className="inline-flex w-fit items-center gap-2 font-mono text-xs text-text-tertiary transition-colors hover:text-accent"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("backToArticles")}
      </Link>

      <header className="flex flex-col gap-3 border-b border-stroke pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary lg:text-3xl">
          {article.meta.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-text-quaternary">
          {article.meta.date ? (
            <time dateTime={article.meta.date}>
              {t("published")}: {formatDate(article.meta.date, article.meta.locale)}
            </time>
          ) : null}
        </div>

        {article.meta.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {article.meta.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        ) : null}

        {isFallback ? (
          <p className="rounded-md border border-stroke bg-bg-elevated px-3 py-2 text-xs text-text-tertiary">
            {t("localeNotice", { lang: t(`langName.${article.meta.locale}`) })}
          </p>
        ) : null}
      </header>

      <article className="max-w-[68ch] text-text-secondary">
        <MDXRemote source={article.content} components={mdxComponents} />
      </article>
    </main>
  );
}
