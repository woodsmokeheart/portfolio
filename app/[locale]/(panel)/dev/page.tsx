import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { DevTitleSection } from "@/components/sections/dev-title-section";
import { DevDescriptionSection } from "@/components/sections/dev-description-section";
import { DevFilesSection } from "@/components/sections/dev-files-section";
import { DevDiffSection } from "@/components/sections/dev-diff-section";
import { DevCommitsSection } from "@/components/sections/dev-commits-section";
import { DevChecksSection } from "@/components/sections/dev-checks-section";
import { AttachmentsSection } from "@/components/sections/attachments-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function DevPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main className="flex w-full flex-col gap-4 py-10 lg:pt-8 lg:pb-16">
      <DevTitleSection />
      <DevDescriptionSection />
      <DevFilesSection />
      <DevDiffSection />
      <DevCommitsSection />
      <DevChecksSection />
      <AttachmentsSection />
    </main>
  );
}
