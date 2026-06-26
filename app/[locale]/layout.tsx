import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ogImage, siteUrl } from "@/lib/site";
import { CursorGlow } from "@/components/cursor-glow";
import { DotGrid } from "@/components/dot-grid";
import { GlobalNav } from "@/components/global-nav";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t("title");
  const description = t("description");
  const path = `/${locale}`;
  const ogLocale = locale === "ru" ? "ru_RU" : "en_US";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s — Denis Kukobin",
    },
    description,
    keywords: [
      "Denis Kukobin",
      "QA Lead",
      "Senior QA Engineer",
      "Frontend Developer",
      "React developer",
      "Next.js",
      "Playwright automation",
      "iGaming QA",
      "AI-assisted testing",
      "test automation engineer",
      "микросервисы тестирование",
      "Go Kafka Kubernetes QA",
      "фронтенд разработчик",
      "автоматизация тестирования",
      "LLM testing",
      "Web3 developer",
    ],
    authors: [{ name: "Denis Kukobin", url: siteUrl }],
    alternates: {
      canonical: path,
      languages: { ru: "/ru", en: "/en" },
    },
    openGraph: {
      title,
      description,
      type: "profile",
      url: path,
      siteName: "Denis Kukobin",
      locale: ogLocale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function PersonSchema({ locale }: { locale: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Denis Kukobin",
    url: siteUrl,
    jobTitle: locale === "ru" ? "QA Lead / Frontend Engineer" : "QA Lead / Frontend Engineer",
    description:
      locale === "ru"
        ? "QA Lead с 6+ лет опыта в iGaming (21 микросервис, Go, Kafka, K8s) и Frontend Engineer с 8+ продуктами в проде. Эксперт по AI-assisted тестированию и React/Next.js разработке."
        : "QA Lead with 6+ years in iGaming (21 microservices, Go, Kafka, K8s) and Frontend Engineer with 8+ products shipped. Expert in AI-assisted testing and React/Next.js development.",
    email: "blckwdmayday@gmail.com",
    sameAs: ["https://t.me/url64"],
    knowsAbout: [
      "QA Engineering",
      "Test Automation",
      "AI-assisted Testing",
      "Playwright",
      "iGaming",
      "Microservices",
      "Go",
      "Kafka",
      "Kubernetes",
      "React",
      "Next.js",
      "TypeScript",
      "Web3",
      "LLM Agents",
      "MCP",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <PersonSchema locale={locale} />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <DotGrid />
          <CursorGlow />
          <GlobalNav />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
