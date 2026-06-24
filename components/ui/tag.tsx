import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  className?: string;
};

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md border border-stroke bg-bg-elevated px-2 py-0.5",
        "font-mono text-xs tracking-wide text-text-secondary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
