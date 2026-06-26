export type Section = {
  id: string;
  field: string;
  titleKey: string;
};

/** Ordered registry of 8 QA ticket sections. Single source of truth for nav, scroll-spy, and render order. */
export const SECTIONS: Section[] = [
  { id: "title", field: "Title", titleKey: "title" },
  { id: "description", field: "Description", titleKey: "description" },
  { id: "preconditions", field: "Preconditions", titleKey: "preconditions" },
  { id: "steps", field: "Steps to Reproduce", titleKey: "steps" },
  { id: "expected", field: "Expected Result", titleKey: "expected" },
  { id: "actual", field: "Actual Result", titleKey: "actual" },
  { id: "environment", field: "Environment", titleKey: "environment" },
  { id: "attachments", field: "Attachments", titleKey: "attachments" },
];

/** Ordered registry of 7 dev portfolio (PR-metaphor) sections. */
export const DEV_SECTIONS: Section[] = [
  { id: "dev-title", field: "PR_TITLE", titleKey: "dev.title" },
  { id: "dev-description", field: "Description", titleKey: "dev.description" },
  { id: "dev-files", field: "Files Changed", titleKey: "dev.files" },
  { id: "dev-diff", field: "Diff", titleKey: "dev.diff" },
  { id: "dev-commits", field: "Commits", titleKey: "dev.commits" },
  { id: "dev-checks", field: "Checks", titleKey: "dev.checks" },
  { id: "dev-attachments", field: "Attachments", titleKey: "dev.attachments" },
];

export function sectionIds(): string[] {
  return SECTIONS.map((s) => s.id);
}

export function devSectionIds(): string[] {
  return DEV_SECTIONS.map((s) => s.id);
}
