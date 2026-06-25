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

      // If we're within 80px of the page bottom → last section wins
      if (scrollY + viewportH >= pageH - 80) {
        return ids[ids.length - 1] ?? null;
      }

      // Find all section tops, pick the last one that has scrolled past the
      // top third of the viewport
      const threshold = scrollY + viewportH * 0.25;
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
