import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { TitleSection } from "@/components/sections/title-section";
import { DescriptionSection } from "@/components/sections/description-section";
import { PreconditionsSection } from "@/components/sections/preconditions-section";
import { StepsSection } from "@/components/sections/steps-section";
import { ExpectedSection } from "@/components/sections/expected-section";
import { ActualSection } from "@/components/sections/actual-section";
import { EnvironmentSection } from "@/components/sections/environment-section";
import { AttachmentsSection } from "@/components/sections/attachments-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function QaPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main className="flex w-full flex-col gap-4 py-10 lg:py-16">
      <TitleSection />
      <DescriptionSection />
      <PreconditionsSection />
      <StepsSection />
      <ExpectedSection />
      <ActualSection />
      <EnvironmentSection />
      <AttachmentsSection />
    </main>
  );
}
