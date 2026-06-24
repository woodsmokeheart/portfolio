import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SECTIONS } from "@/lib/sections";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <main className="flex w-full flex-col gap-4 py-10 lg:py-16">
      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="flex scroll-mt-24 flex-col gap-1 rounded-md border border-stroke bg-bg-elevated p-4 lg:scroll-mt-10"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-text-quaternary">
            {section.field}
          </span>
          <span className="text-base text-text-primary">
            {t(`sections.${section.titleKey}.label`)}
          </span>
        </section>
      ))}
    </main>
  );
}
