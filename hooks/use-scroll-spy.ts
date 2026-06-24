"use client";

import { useEffect, useState } from "react";

export type SpyEntry = {
  id: string;
  isIntersecting: boolean;
  top: number;
};

/**
 * Pure selection logic for scroll-spy: from a set of observed sections pick the
 * topmost one that is currently intersecting the viewport. Returns `null` when
 * nothing intersects so callers can decide how to fall back.
 */
export function pickActive(entries: SpyEntry[]): string | null {
  let active: SpyEntry | null = null;

  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    if (active === null || entry.top < active.top) {
      active = entry;
    }
  }

  return active?.id ?? null;
}

export type UseScrollSpyOptions = {
  /**
   * Margin applied to the observer root. Default shifts the active region near
   * the top of the viewport so a section becomes active as it scrolls up.
   */
  rootMargin?: string;
};

/**
 * Tracks which of the given section ids is currently active based on scroll
 * position. SSR-safe: returns `null` until the observer runs in the browser.
 */
export function useScrollSpy(
  ids: string[],
  options: UseScrollSpyOptions = {}
): string | null {
  const { rootMargin = "-20% 0px -70% 0px" } = options;
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        const mapped: SpyEntry[] = observerEntries.map((entry) => ({
          id: entry.target.id,
          isIntersecting: entry.isIntersecting,
          top: entry.boundingClientRect.top,
        }));

        const next = pickActive(mapped);
        if (next !== null) setActiveId(next);
      },
      { rootMargin, threshold: 0 }
    );

    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return activeId;
}

export default useScrollSpy;
