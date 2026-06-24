"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function CursorGlow() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduce) return;
    if (typeof window === "undefined") return;

    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!fine) return;

    setEnabled(true);

    let raf = 0;
    let nextX = window.innerWidth / 2;
    let nextY = window.innerHeight / 2;

    const apply = () => {
      raf = 0;
      document.documentElement.style.setProperty("--glow-x", `${nextX}px`);
      document.documentElement.style.setProperty("--glow-y", `${nextY}px`);
    };

    const onMove = (e: PointerEvent) => {
      nextX = e.clientX;
      nextY = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(420px circle at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)",
        filter: "blur(48px)",
      }}
    />
  );
}
