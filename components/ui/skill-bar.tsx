"use client";

import { motion, useReducedMotion } from "motion/react";

type SkillBarProps = {
  label: string;
  level: number;
  className?: string;
};

export function SkillBar({ label, level, className }: SkillBarProps) {
  const reduce = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, level));

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="font-mono text-xs tabular-nums text-text-tertiary">
          {clamped}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stroke">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={reduce ? false : { width: 0 }}
          whileInView={{ width: `${clamped}%` }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </div>
    </div>
  );
}
