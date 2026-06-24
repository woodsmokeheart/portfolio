import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LangSwitcher } from "@/components/lang-switcher";

const SECTION_KEYS = [
  "title",
  "description",
  "preconditions",
  "steps",
  "expected",
  "actual",
  "environment",
  "attachments",
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex items-center justify-between border-b border-stroke pb-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-wider text-text-tertiary">
            {t("meta.status")}
          </span>
          <span className="text-sm text-accent">{t("meta.available")}</span>
        </div>
        <LangSwitcher />
      </header>

      <section className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-wider text-text-tertiary">
          {t("meta.priority")}
        </span>
        <span className="font-mono text-sm text-text-primary">
          {t("meta.priorityValue")}
        </span>
      </section>

      <ol className="flex flex-col gap-4">
        {SECTION_KEYS.map((key) => (
          <li
            key={key}
            className="flex flex-col gap-1 rounded-md border border-stroke bg-bg-elevated p-4"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-text-quaternary">
              {t(`sections.${key}.field`)}
            </span>
            <span className="text-base text-text-primary">
              {t(`sections.${key}.label`)}
            </span>
          </li>
        ))}
      </ol>
    </main>
  );
}
