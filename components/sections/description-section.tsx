import { useTranslations } from "next-intl";
import { SectionShell } from "./section-shell";

/**
 * Description section — a short bio pitch. Body copy lives in messages so it
 * stays editable. Wrapped in the generic SectionShell.
 */
export function DescriptionSection() {
  const t = useTranslations("content.description");
  const tField = useTranslations("sections.description");

  return (
    <SectionShell
      id="description"
      field={tField("field")}
      title={tField("label")}
    >
      <p className="max-w-2xl text-pretty text-base leading-relaxed text-text-secondary">
        {t("body")}
      </p>
    </SectionShell>
  );
}
