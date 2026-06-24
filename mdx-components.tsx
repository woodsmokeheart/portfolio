import type { MDXComponents } from "mdx/types";

/**
 * Base styled element map for MDX content. Everything is keyed off the Tailwind
 * design tokens so prose matches the rest of the ticket: comfortable line
 * length, monospace code, accent links. Exported as a plain object so it can be
 * reused by `MDXRemote` (next-mdx-remote/rsc) without invoking a hook in an
 * async server component.
 */
export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
      <h1 className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-text-primary first:mt-0 lg:text-3xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-3 text-xl font-semibold tracking-tight text-text-primary first:mt-0 lg:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-2 text-lg font-semibold tracking-tight text-text-primary first:mt-0">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="my-4 leading-relaxed text-text-secondary">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="my-4 flex list-disc flex-col gap-2 pl-5 text-text-secondary marker:text-text-quaternary">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 flex list-decimal flex-col gap-2 pl-5 text-text-secondary marker:text-text-quaternary">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-accent underline decoration-stroke underline-offset-4 transition-colors hover:decoration-accent"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded border border-stroke bg-bg-elevated px-1.5 py-0.5 font-mono text-sm text-text-primary">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-5 overflow-x-auto rounded-md border border-stroke bg-bg-elevated p-4 font-mono text-sm text-text-primary [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-5 border-l-2 border-accent pl-4 text-text-tertiary italic">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-8 border-stroke" />,
    strong: ({ children }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),
};

/**
 * Required by @next/mdx for the App Router. Merges the base styled element map
 * with any components passed in by the MDX runtime.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}
