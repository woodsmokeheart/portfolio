/** Canonical site origin, overridable via env for previews/production. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://deniskukobin.vercel.app";

/** Default OG image path (served from /public). */
export const ogImage = "/og.png";
