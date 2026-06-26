import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "./section-shell";

type CheckItem = {
  name: string;
  status: "passed" | "in-progress";
};

export function DevChecksSection() {
  const t = useTranslations("content.dev.checks");
  const tField = useTranslations("sections.dev.checks");
  const items = t.raw("items") as CheckItem[];

  return (
    <SectionShell
      id="dev-checks"
      field={tField("field")}
      title={tField("label")}
    >
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <Reveal as="li" key={item.name} delay={i * 0.06}>
            <div className="flex min-h-11 items-center gap-3 rounded-md border border-stroke bg-bg px-3 py-2">
              {item.status === "passed" ? (
                <span
                  className="font-mono text-sm font-semibold text-accent"
                  aria-label="passed"
                >
                  ✓
                </span>
              ) : (
                <span
                  className="font-mono text-sm font-semibold text-text-quaternary"
                  aria-label="in progress"
                >
                  ◎
                </span>
              )}
              <span className="text-sm text-text-secondary">{item.name}</span>
              <span className="ml-auto font-mono text-xs text-text-quaternary">
                {item.status === "passed" ? t("statusPassed") : t("statusInProgress")}
              </span>
            </div>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}
