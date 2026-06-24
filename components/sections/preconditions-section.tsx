import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "./section-shell";

/**
 * Preconditions section — background context that shaped Denis as a QA. Bullets
 * live in messages (`content.preconditions.items`) so they stay editable, and
 * each one reveals with a small stagger. The monospace `–` marker keeps the
 * ticket aesthetic.
 */
export function PreconditionsSection() {
  const t = useTranslations("content.preconditions");
  const tField = useTranslations("sections.preconditions");
  const items = t.raw("items") as string[];

  return (
    <SectionShell
      id="preconditions"
      field={tField("field")}
      title={tField("label")}
    >
      <ul className="flex max-w-2xl flex-col gap-3">
        {items.map((item, i) => (
          <Reveal as="li" key={item} delay={i * 0.08}>
            <span className="flex gap-3">
              <span
                aria-hidden
                className="select-none font-mono text-accent"
              >
                –
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
