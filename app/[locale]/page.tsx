import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SECTIONS } from "@/lib/sections";
import { TitleSection } from "@/components/sections/title-section";
import { DescriptionSection } from "@/components/sections/description-section";
import { PreconditionsSection } from "@/components/sections/preconditions-section";
import { StepsSection } from "@/components/sections/steps-section";
import { ExpectedSection } from "@/components/sections/expected-section";
import { ActualSection } from "@/components/sections/actual-section";
import { EnvironmentSection } from "@/components/sections/environment-section";

type Props = {
  params: Promise<{ locale: string }>;
};

const REAL_SECTIONS = new Set([
  "title",
  "description",
  "preconditions",
  "steps",
  "expected",
  "actual",
  "environment",
]);

export default function Home({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <main className="flex w-full flex-col gap-4 py-10 lg:py-16">
      <TitleSection />
      <DescriptionSection />
      <PreconditionsSection />
      <StepsSection />
      <ExpectedSection />
      <ActualSection />
      <EnvironmentSection />

      {SECTIONS.filter((section) => !REAL_SECTIONS.has(section.id)).map(
        (section) => (
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
        ),
      )}
    </main>
  );
}
