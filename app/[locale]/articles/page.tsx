import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { ArticleCard } from "@/components/articles/article-card";
import { getAllArticlesMeta, type Locale } from "@/lib/articles";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  return {
    title: t("indexTitle"),
    description: t("indexDescription"),
  };
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations("articles");
  const articles = getAllArticlesMeta(locale as Locale);

  return (
    <main className="flex w-full flex-col gap-6 py-10 lg:py-16">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 font-mono text-xs text-text-tertiary transition-colors hover:text-accent"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("backHome")}
      </Link>

      <header className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-wider text-text-quaternary">
          Attachments
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary lg:text-3xl">
          {t("indexTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t("indexDescription")}
        </p>
      </header>

      {articles.length > 0 ? (
        <ul className="grid gap-3 lg:grid-cols-2">
          {articles.map((article, i) => (
            <Reveal as="li" key={article.slug} delay={i * 0.06}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-text-tertiary">{t("empty")}</p>
      )}
    </main>
  );
}
