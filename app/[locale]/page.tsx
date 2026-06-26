import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { LandingAnimated, type TicketCardData } from "@/components/landing/landing-animated";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "landing" });

  const cards: TicketCardData[] = [
    {
      id: t("qa.id"),
      status: "open",
      statusLabel: t("qa.status"),
      title: t("qa.title"),
      desc: t("qa.desc"),
      tags: t.raw("qa.tags") as string[],
      cta: t("qa.cta"),
      href: "/qa",
    },
    {
      id: t("dev.id"),
      status: "review",
      statusLabel: t("dev.status"),
      title: t("dev.title"),
      desc: t("dev.desc"),
      tags: t.raw("dev.tags") as string[],
      cta: t("dev.cta"),
      href: "/dev",
    },
    {
      id: t("articles.id"),
      status: "active",
      statusLabel: t("articles.status"),
      title: t("articles.title"),
      desc: t("articles.desc"),
      tags: t.raw("articles.tags") as string[],
      cta: t("articles.cta"),
      href: "/articles",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <LandingAnimated subtitle={t("subtitle")} cards={cards} />
    </div>
  );
}
