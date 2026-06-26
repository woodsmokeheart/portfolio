"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "./section-shell";

type Commit = {
  period: string;
  message: string;
  detail: string;
};

export function DevCommitsSection() {
  const t = useTranslations("content.dev.commits");
  const tField = useTranslations("sections.dev.commits");
  const reduce = useReducedMotion();
  const items = t.raw("items") as Commit[];

  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <SectionShell
      id="dev-commits"
      field={tField("field")}
      title={tField("label")}
    >
      <ol ref={timelineRef} className="relative flex flex-col gap-8">
        <span
          aria-hidden
          className="absolute bottom-3 left-[6px] top-3 w-0.5 bg-stroke"
        />
        <motion.span
          aria-hidden
          style={reduce ? undefined : { scaleY }}
          className="absolute bottom-3 left-[6px] top-3 w-0.5 origin-top bg-accent"
        />

        {items.map((commit, i) => (
          <Reveal
            as="li"
            key={commit.period}
            delay={i * 0.08}
            className="relative flex gap-4"
          >
            <span className="relative z-10 mt-1.5 block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-accent bg-bg" />

            <div className="flex flex-col gap-1 pb-1">
              <span className="font-mono text-sm font-medium text-accent">
                {commit.period}
              </span>
              <h3 className="font-mono text-sm text-text-primary">
                {commit.message}
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-text-secondary">
                {commit.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}
