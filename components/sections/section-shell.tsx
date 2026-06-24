import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";

type SectionShellProps = {
  id: string;
  field: string;
  title: string;
  children: ReactNode;
  className?: string;
};

/**
 * Generic wrapper for every ticket section. Renders the monospace English
 * ticket `field` label, the localized human `title`, and an `id` anchor whose
 * `scroll-mt` matches the page convention so scroll-spy targets land below the
 * mobile meta bar. Body content is wrapped in <Reveal> for the in-view effect.
 */
export function SectionShell({
  id,
  field,
  title,
  children,
  className,
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-label={title}
      className={[
        "flex scroll-mt-24 flex-col gap-4 rounded-md border border-stroke bg-bg-elevated p-4 lg:scroll-mt-10 lg:p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Tag className="self-start uppercase tracking-wider">{field}</Tag>

      <Reveal>{children}</Reveal>
    </section>
  );
}
