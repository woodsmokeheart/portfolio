import { Link } from "@/i18n/navigation";
import { Tag } from "@/components/ui/tag";
import { formatDate } from "@/lib/format";
import type { ArticleMeta } from "@/lib/articles";

type ArticleCardProps = {
  article: ArticleMeta;
};

/**
 * Ticket-styled link card for a single article. Reused by the Attachments
 * section and the full articles index. Whole card is a locale-aware Link to the
 * single article page; tap target spans the full card for comfortable mobile
 * use.
 */
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col gap-3 rounded-md border border-stroke bg-bg p-4 transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_rgba(74,222,128,0.18)] focus-visible:border-accent focus-visible:outline-none focus-visible:shadow-[0_0_24px_rgba(74,222,128,0.18)]"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent">
          {article.title}
        </h3>
        {article.date ? (
          <time
            dateTime={article.date}
            className="font-mono text-xs text-text-quaternary"
          >
            {formatDate(article.date, article.locale)}
          </time>
        ) : null}
      </div>

      {article.excerpt ? (
        <p className="text-sm leading-relaxed text-text-secondary">
          {article.excerpt}
        </p>
      ) : null}

      {article.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      ) : null}
    </Link>
  );
}
