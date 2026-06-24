"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

type CounterProps = {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function Counter({
  value,
  duration = 1.5,
  prefix = "",
  suffix = "",
  className,
}: CounterProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    if (!inView) return;

    let raf = 0;
    let start: number | null = null;
    const totalMs = duration * 1000;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / totalMs, 1);
      setDisplay(Math.round(easeOutCubic(progress) * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="tabular-nums">
        {prefix}
        {display}
        {suffix}
      </span>
    </span>
  );
}
