import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";
import { SectionShell } from "./section-shell";

type Case = {
  title: string;
  sub: string;
  tags: string[];
  year: string;
};

/**
 * Actual Result section — the cases/outcomes that actually happened. Each row
 * shows a year, title, summary, and tag pills. Content lives in
 * `content.actual.items` so the cases stay editable.
 *
 * Hover (desktop, ≥lg): the title nudges right, an accent `→` slides in, and
 * the row gets a subtle background — pure CSS group-hover, so this can stay a
 * server component. On touch/mobile the arrow is statically visible and the
 * full row stays readable and tappable (≥44px) without any hover dependency.
 * The per-row stagger degrades gracefully via <Reveal> (reduced-motion safe).
 */
export function ActualSection() {
  const t = useTranslations("content.actual");
  const tField = useTranslations("sections.actual");
  const items = t.raw("items") as Case[];

  return (
    <SectionShell id="actual" field={tField("field")} title={tField("label")}>
      <ul className="flex flex-col">
        {items.map((item, i) => (
          <Reveal
            as="li"
            key={item.title}
            delay={i * 0.08}
            className="border-t border-stroke first:border-t-0"
          >
          <div className="-mx-2 flex min-h-[44px] flex-col gap-2 rounded-md px-2 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="origin-left text-base font-semibold text-text-primary lg:text-lg">
                  {item.title}
                </h3>
                <span className="shrink-0 font-mono text-sm font-medium text-accent">
                  {item.year}
                </span>
              </div>

              <p className="text-pretty text-sm leading-relaxed text-text-secondary">
                {item.sub}
              </p>

              <ul className="flex flex-wrap gap-2 pt-1">
                {item.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ul>
    </SectionShell>
  );
}
