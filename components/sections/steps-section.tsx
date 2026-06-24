"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "./section-shell";

type Step = {
  year: string;
  role: string;
  org: string;
  detail: string;
};

/**
 * Steps section — the QA career timeline. A vertical line connects numbered
 * milestones; its height draws in as the reader scrolls through the timeline
 * (motion `useScroll` + `useTransform` driving `scaleY` from a top origin).
 *
 * Reduced-motion: the connecting line is shown full-height and static, and the
 * per-step reveals degrade to plain visible content (handled by <Reveal>).
 *
 * Content lives in `content.steps.items` so the timeline stays editable.
 * Client component because it relies on scroll/motion hooks.
 */
export function StepsSection() {
  const t = useTranslations("content.steps");
  const tField = useTranslations("sections.steps");
  const reduce = useReducedMotion();
  const items = t.raw("items") as Step[];

  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <SectionShell id="steps" field={tField("field")} title={tField("label")}>
      <ol ref={timelineRef} className="relative flex flex-col gap-8">
        {/* Track + progress line, centered under the marker dots (7px). */}
        <span
          aria-hidden
          className="absolute bottom-3 left-[6px] top-3 w-0.5 bg-stroke"
        />
        <motion.span
          aria-hidden
          style={reduce ? undefined : { scaleY }}
          className="absolute bottom-3 left-[6px] top-3 w-0.5 origin-top bg-accent"
        />

        {items.map((step, i) => (
          <Reveal
            as="li"
            key={step.year + step.role}
            delay={i * 0.08}
            className="relative flex gap-4"
          >
            <span className="relative z-10 mt-1.5 block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-accent bg-bg" />

            <div className="flex flex-col gap-1 pb-1">
              <span className="font-mono text-sm font-medium text-accent">
                {step.year}
              </span>
              <h3 className="text-base font-semibold text-text-primary lg:text-lg">
                {step.role}
                <span className="text-text-tertiary"> · {step.org}</span>
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-text-secondary">
                {step.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}
