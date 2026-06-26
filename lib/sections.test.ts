import { describe, it, expect } from "vitest";
import { SECTIONS, DEV_SECTIONS, sectionIds, devSectionIds } from "./sections";

describe("SECTIONS", () => {
  it("has 8 QA sections", () => {
    expect(SECTIONS).toHaveLength(8);
  });

  it("sectionIds returns all QA ids", () => {
    expect(sectionIds()).toEqual(SECTIONS.map((s) => s.id));
  });
});

describe("DEV_SECTIONS", () => {
  it("has 7 dev sections", () => {
    expect(DEV_SECTIONS).toHaveLength(7);
  });

  it("devSectionIds returns all dev ids", () => {
    expect(devSectionIds()).toEqual(DEV_SECTIONS.map((s) => s.id));
  });

  it("all dev section ids start with dev-", () => {
    expect(DEV_SECTIONS.every((s) => s.id.startsWith("dev-"))).toBe(true);
  });
});
