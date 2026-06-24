/**
 * Contact links for the Attachments section.
 *
 * NOTE: these are CLEARLY-MARKED PLACEHOLDERS — replace `href` values with the
 * real handles before shipping. Labels are localized in messages
 * (`content.attachments.contacts`); the handle/href lives here so it is easy to
 * edit in one place.
 */
export type ContactKey = "telegram" | "email" | "linkedin";

export type Contact = {
  key: ContactKey;
  href: string;
  /** Shown in monospace as the "value" of the attachment row. */
  handle: string;
};

export const CONTACTS: Contact[] = [
  { key: "telegram", href: "https://t.me/url64", handle: "@url64" },
  { key: "email", href: "mailto:blckwdmayday@gmail.com", handle: "blckwdmayday@gmail.com" },
  {
    key: "linkedin",
    href: "https://linkedin.com/in/your-handle",
    handle: "in/your-handle",
  },
];
