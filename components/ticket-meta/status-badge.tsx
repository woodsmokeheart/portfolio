import { useTranslations } from "next-intl";

type StatusBadgeProps = {
  /** When true, renders only the pulsing dot without the text label. */
  compact?: boolean;
  className?: string;
};

/**
 * "Available for work" indicator: a pulsing green dot plus a localized label.
 * The pulse ring respects prefers-reduced-motion (see globals.css).
 */
export function StatusBadge({ compact = false, className }: StatusBadgeProps) {
  const t = useTranslations();

  return (
    <span
      className={[
        "inline-flex items-center gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="relative inline-flex h-2 w-2 shrink-0">
        <span className="status-pulse-ring absolute inset-0 rounded-full bg-accent" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      {!compact && (
        <span className="text-sm text-accent">{t("meta.available")}</span>
      )}
    </span>
  );
}
