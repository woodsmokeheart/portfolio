import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { CursorGlow } from "@/components/cursor-glow";
import { TicketMetaPanel } from "@/components/ticket-meta/ticket-meta-panel";
import { MobileMetaBar } from "@/components/ticket-meta/mobile-meta-bar";
import "../globals.css";

export const metadata: Metadata = {
  title: "Denis Kukobin — QA Lead",
  description: "QA Lead portfolio, rendered as a bug ticket.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

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
