"use client";

import { useEffect, useRef, useState } from "react";

export type SpyEntry = {
  id: string;
  isIntersecting: boolean;
  top: number;
};

/** @deprecated use useScrollSpy directly */
export function pickActive(entries: SpyEntry[]): string | null {
  let active: SpyEntry | null = null;
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    if (active === null || entry.top < active.top) active = entry;
  }
  return active?.id ?? null;
}

export type UseScrollSpyOptions = {
  rootMargin?: string;
};

/**
 * Scroll-spy based on scroll position rather than IntersectionObserver margins.
 * Picks the section whose top is closest to (but not below) the viewport top.
 * Always activates the last section when scrolled to the bottom of the page.
 */
export function useScrollSpy(
  ids: string[],
  _options: UseScrollSpyOptions = {}
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getActive = (): string | null => {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const pageH = document.documentElement.scrollHeight;

      // Pick the section whose top has most recently crossed 35% from the
      // viewport top. Using 35% (up from 25%) so near-bottom sections
      // on short pages still register before the fallback fires.
      const threshold = scrollY + viewportH * 0.35;
      let best: string | null = null;
      let bestTop = -Infinity;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + scrollY;
        if (top <= threshold && top > bestTop) {
          bestTop = top;
          best = id;
        }
      }

      // Fallback only: if no section crossed the threshold (short page /
      // large viewport) and we are truly at the page bottom, activate the
      // last section. Keeping this AFTER the loop prevents it from
      // overriding the correct section when near-bottom sections are visible.
      if (best === null && scrollY + viewportH >= pageH - 80) {
        return ids[ids.length - 1] ?? null;
      }

      return best;
    };

    const onScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const next = getActive();
        if (next !== null) setActiveId(next);
      });
    };

    // Run once on mount
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [ids]);

  return activeId;
}

export default useScrollSpy;
