export type Section = {
  id: string;
  field: string;
  titleKey: string;
};

/**
 * Ordered registry of the 8 ticket sections. Single source of truth for
 * navigation, scroll-spy, and rendering order.
 *
 * `field` is the monospace ticket label. `titleKey` indexes into the
 * `sections.<key>` structure in messages/ru.json & messages/en.json
 * (each key exposes `field` and `label`).
 */
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

export function sectionIds(): string[] {
  return SECTIONS.map((section) => section.id);
}
