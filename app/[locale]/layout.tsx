import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ogImage, siteUrl } from "@/lib/site";
import { CursorGlow } from "@/components/cursor-glow";
import { TicketMetaPanel } from "@/components/ticket-meta/ticket-meta-panel";
import { MobileMetaBar } from "@/components/ticket-meta/mobile-meta-bar";
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
    alternates: {
      canonical: path,
      languages: {
        ru: "/ru",
        en: "/en",
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
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

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <CursorGlow />
          <MobileMetaBar />
          <div className="mx-auto w-full max-w-6xl flex-1 px-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-12 lg:px-8">
            <TicketMetaPanel />
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
