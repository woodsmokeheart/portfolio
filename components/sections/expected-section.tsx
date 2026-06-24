import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "./section-shell";

/**
 * Expected Result section — the goals/aspirations a QA Lead is driving toward.
 * Items live in messages (`content.expected.items`) so they stay editable, and
 * each one reveals with a small stagger. The accent `→` marker keeps the
 * forward-looking, ticket-like aesthetic. No motion hooks here, so this stays a
 * server component (the in-view stagger is handled by the client <Reveal>).
 */
export function ExpectedSection() {
  const t = useTranslations("content.expected");
  const tField = useTranslations("sections.expected");
  const items = t.raw("items") as string[];

  return (
    <SectionShell id="expected" field={tField("field")} title={tField("label")}>
      <ul className="flex max-w-2xl flex-col gap-3">
        {items.map((item, i) => (
          <Reveal as="li" key={item} delay={i * 0.08}>
            <span className="flex gap-3">
              <span aria-hidden className="select-none font-mono text-accent">
                →
              </span>
              <span className="text-pretty text-base leading-relaxed text-text-secondary">
                {item}
              </span>
            </span>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}
