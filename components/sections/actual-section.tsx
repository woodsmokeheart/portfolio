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
            className="group border-t border-stroke first:border-t-0"
          >
            <div className="-mx-2 flex min-h-[44px] flex-col gap-2 rounded-md px-2 py-4 transition-colors lg:group-hover:bg-bg">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span
                    aria-hidden
                    className="select-none font-mono text-accent transition-all duration-200 lg:-translate-x-1 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100"
                  >
                    →
                  </span>
                  <h3 className="origin-left text-base font-semibold text-text-primary transition-transform duration-200 lg:text-lg lg:group-hover:translate-x-0.5">
                    {item.title}
                  </h3>
                </div>
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
