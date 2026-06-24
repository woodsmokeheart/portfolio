import { describe, it, expect } from "vitest";
import { pickActive } from "./use-scroll-spy";

describe("pickActive", () => {
  it("returns the topmost intersecting entry's id", () => {
    const result = pickActive([
      { id: "title", isIntersecting: false, top: -200 },
      { id: "description", isIntersecting: true, top: 40 },
      { id: "steps", isIntersecting: true, top: 320 },
    ]);

    expect(result).toBe("description");
  });

  it("ignores non-intersecting entries even if they are higher", () => {
    const result = pickActive([
      { id: "title", isIntersecting: false, top: -500 },
      { id: "steps", isIntersecting: true, top: 120 },
    ]);

    expect(result).toBe("steps");
  });

  it("returns null when nothing is intersecting", () => {
    const result = pickActive([
      { id: "title", isIntersecting: false, top: -200 },
      { id: "description", isIntersecting: false, top: 800 },
    ]);

    expect(result).toBeNull();
  });

  it("returns null for an empty list", () => {
    expect(pickActive([])).toBeNull();
  });
});
