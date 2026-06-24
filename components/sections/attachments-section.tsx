import { getLocale, getTranslations } from "next-intl/server";
import { Send, Mail, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { ArticleCard } from "@/components/articles/article-card";
import { SectionShell } from "./section-shell";
import { getAllArticlesMeta, type Locale } from "@/lib/articles";
import { CONTACTS, type ContactKey } from "@/lib/contacts";

const CONTACT_ICONS: Record<ContactKey, LucideIcon> = {
  telegram: Send,
  email: Mail,
  linkedin: Briefcase,
};

const LATEST_COUNT = 3;

/**
 * Attachments section — the ticket's "files": latest writing plus contact
 * links. Server component: reads the article frontmatter off disk via
 * `getAllArticlesMeta` and the active locale from next-intl/server. Article
 * cards stack on mobile and form a grid on `lg`; contact rows render as
 * monospace "attachment" items with accent-on-hover. Contact hrefs are
 * placeholders living in `lib/contacts.ts`.
 */
export async function AttachmentsSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("content.attachments");
  const tField = await getTranslations("sections.attachments");

  const articles = getAllArticlesMeta(locale).slice(0, LATEST_COUNT);

  return (
    <SectionShell id="attachments" field={tField("field")} title={tField("label")}>
      <div className="flex flex-col gap-8">
        <p className="text-sm leading-relaxed text-text-secondary">
          {t("intro")}
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-mono text-xs uppercase tracking-wider text-text-quaternary">
              {t("articlesHeading")}
            </h3>
            <Link
              href="/articles"
              className="font-mono text-xs text-text-tertiary underline decoration-stroke underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {t("allArticles")}
            </Link>
          </div>

          {articles.length > 0 ? (
            <ul className="grid gap-3 lg:grid-cols-2">
              {articles.map((article, i) => (
                <Reveal as="li" key={article.slug} delay={i * 0.06}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-tertiary">{t("empty")}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-text-quaternary">
            {t("contactsHeading")}
          </h3>
          <ul className="flex flex-col gap-2">
            {CONTACTS.map((contact) => {
              const Icon = CONTACT_ICONS[contact.key];
              const external = contact.href.startsWith("http");
              return (
                <li key={contact.key}>
                  <a
                    href={contact.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex min-h-11 items-center gap-3 rounded-md border border-stroke bg-bg px-3 py-2 transition-colors hover:border-accent focus-visible:border-accent focus-visible:outline-none"
                  >
                    <Icon
                      className="size-4 shrink-0 text-text-tertiary transition-colors group-hover:text-accent"
                      aria-hidden
                    />
                    <span className="text-sm text-text-secondary">
                      {t(`contacts.${contact.key}`)}
                    </span>
                    <span className="ml-auto truncate font-mono text-xs text-text-quaternary transition-colors group-hover:text-text-tertiary">
                      {contact.handle}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
