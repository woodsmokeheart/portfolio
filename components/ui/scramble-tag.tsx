"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
const FRAMES = 22;
const FRAME_MS = 35;

function scrambleFrame(target: string, progress: number): string {
  const revealedCount = Math.floor(progress * target.length);
  return target
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      if (i < revealedCount) return char;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join("");
}

type ScrambleTagProps = {
  children: string;
  className?: string;
};

/**
 * Ticket field label tag with a terminal-style scramble reveal animation.
 * Triggers once when the element enters the viewport. Respects
 * prefers-reduced-motion — skips the animation entirely if requested.
 */
export function ScrambleTag({ children, className }: ScrambleTagProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });
  const reduce = useReducedMotion();
  const [displayed, setDisplayed] = useState(children);
  const animated = useRef(false);

  useEffect(() => {
    if (!isInView || reduce || animated.current) return;
    animated.current = true;

    let frame = 0;
    const id = setInterval(() => {
      frame++;
      setDisplayed(scrambleFrame(children, frame / FRAMES));
      if (frame >= FRAMES) {
        clearInterval(id);
        setDisplayed(children);
      }
    }, FRAME_MS);

    return () => clearInterval(id);
  }, [isInView, children, reduce]);

  return (
    <span
      ref={ref}
      className={[
        "inline-flex items-center rounded-md border border-stroke bg-bg-elevated px-2 py-0.5",
        "font-mono text-xs tracking-wide text-text-secondary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {displayed}
    </span>
  );
}
