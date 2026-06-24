export type ContactKey = "telegram" | "email";

export type Contact = {
  key: ContactKey;
  href: string;
  /** Shown in monospace as the "value" of the attachment row. */
  handle: string;
};

export const CONTACTS: Contact[] = [
  { key: "telegram", href: "https://t.me/url64", handle: "@url64" },
  { key: "email", href: "mailto:blckwdmayday@gmail.com", handle: "blckwdmayday@gmail.com" },
];
