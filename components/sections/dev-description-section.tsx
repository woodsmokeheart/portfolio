import { useTranslations } from "next-intl";
import { SectionShell } from "./section-shell";

export function DevDescriptionSection() {
  const t = useTranslations("content.dev.description");
  const tField = useTranslations("sections.dev.description");

  return (
    <SectionShell
      id="dev-description"
      field={tField("field")}
      title={tField("label")}
    >
      <p className="max-w-2xl text-pretty text-base leading-relaxed text-text-secondary">
        {t("body")}
      </p>
    </SectionShell>
  );
}
