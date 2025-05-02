import type { MDXComponents } from "mdx/types";
import type { JSX } from "react";
import { ArrowElbowRightUp, Link } from "@phosphor-icons/react";
import "./styles/footnotes.css";

export function useMDXComponents(): MDXComponents {
  return {
    h1: (
      { id, children }: { id: string; children: React.ReactNode },
    ): JSX.Element => (
      <h1
        id={id}
        className="scroll-m-20 text-red-my-for-light dark:text-red-my text-4xl font-bold tracking-tight lg:text-5xl"
      >
        {children}
      </h1>
    ),
    h2: (
      { id, children }: { id: string; children: React.ReactNode },
    ): JSX.Element => (
      <h2
        id={id}
        className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        {children}
      </h2>
    ),
    h3: (
      { id, children }: { id: string; children: React.ReactNode },
    ): JSX.Element => (
      <h3
        id={id}
        className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight"
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }: { children: React.ReactNode }): JSX.Element => {
      return (
        <p
          {...props}
          className="leading-7 [&:not(:first-child)]:mt-6 text-justify w-full hyphens-auto"
        >
          {children}
        </p>
      );
    },
    ul: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {children}
      </ul>
    ),
    ol: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
        {children}
      </ol>
    ),
    code: (
      { children, className }: {
        children: React.ReactNode;
        className?: string;
      },
    ): JSX.Element => {
      // Check if children is a plain string. If so, assume it's inline code.
      // If children is complex (e.g., React elements from syntax highlighting),
      // assume it's inside a <pre> block.
      const isInlineCode = typeof children === "string";
      if (isInlineCode) {
        return (
          <code className="relative rounded border border-black dark:border-gray-800 bg-muted/50 px-[0.25em] py-[0.15em] font-mono text-sm text-red-my-for-light dark:text-red-my whitespace-nowrap">
            {children}
          </code>
        );
      }
      // Render code block content without extra inline styling.
      // The parent <pre> component and syntax highlighting handle block styling.
      // Pass className along for the syntax highlighter.
      return (
        <code className={className}>
          {children}
        </code>
      );
    },
    // The 'pre' component wraps code blocks.
    // It receives children (usually a 'code' element with highlighted syntax)
    // and potentially other props like className from remark plugins.
    pre: (
      { children, className, ...props }: {
        children: React.ReactNode;
        className?: string;
      } & React.HTMLAttributes<HTMLPreElement>,
    ): JSX.Element => (
      // Extra div to hide scrollbar overflow
      <div className="mb-4 mt-4 overflow-hidden rounded-lg border border-solid dark:border-gray-900">
        <pre
          className={`p-3 overflow-x-auto bg-muted font-mono text-sm ${
            className || ""
          }`}
          {...props}
        >
      {children}
        </pre>
      </div>
    ),
    blockquote: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        {children}
      </blockquote>
    ),
    a: (
      { children, href, className, ...props }: {
        children: React.ReactNode;
        href?: string;
        className?: string;
      },
    ): JSX.Element => {
      // Check if this is a footnote reference (from remark-gfm)
      const isFootnoteRef = className?.includes("data-footnote-backref");
      // Check if this is an anchor link pointing to itself
      const isAnchorSelfRef = href?.startsWith("#") &&
        children;
      // &&
      // typeof children === "string"; // Does not work with MathJax

      const handleAnchorClick = (e: React.MouseEvent) => {
        if (href?.startsWith("#")) {
          e.preventDefault();
          const targetId = href.slice(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            // Update URL without causing navigation
            globalThis.history.pushState(null, "", href);
          }
        }
      };
      if (isFootnoteRef) {
        // Replace gfm added icon with Lucide icon to make it consistent regardless of UTF-8 rendering
        return (
          <a
            {...props}
            href={href}
            onClick={handleAnchorClick}
            className="footnote-ref inline-flex items-center"
          >
            <ArrowElbowRightUp
              className="inline"
              style={{ width: "1em", height: "1em" }}
            />
          </a>
        );
      }

      if (isAnchorSelfRef) {
        return (
          <a
            href={href}
            onClick={handleAnchorClick}
            // Added overflow-visible
            className="group relative font-medium text-primary"
            {...props}
          >
            <span
              // Added z-10
              className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            >
              {!href?.startsWith("#user-content-fn") && (
                <Link size={16} className="text-muted-foreground" />
              )}
            </span>
            {children}
          </a>
        );
      }

      return (
        <a
          href={href}
          onClick={href?.startsWith("#") ? handleAnchorClick : undefined}
          target={href?.startsWith("#") ? undefined : "_blank"}
          // See https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener
          // and https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noreferrer
          rel={href?.startsWith("#") ? undefined : "noopener noreferrer"}
          className="font-medium text-primary underline underline-offset-4 decoration-red-my-for-light dark:decoration-red-my decoration-2"
          {...props}
        >
          {children}
        </a>
      );
    },
    table: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <div className="my-6 w-full overflow-x-auto">
        <table className="w-full">{children}</table>
      </div>
    ),
    thead: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <thead>{children}</thead>
    ),
    tbody: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <tbody>{children}</tbody>
    ),
    tr: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <tr className="m-0 border-t p-0 even:bg-muted">{children}</tr>
    ),
    th: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </th>
    ),
    td: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <td className="border px-4 py-2 text-justify [&[align=center]]:text-center [&[align=left]]:text-left [&[align=right]]:text-right hyphens-auto">
        {children}
      </td>
    ),
    sup: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <sup className="font-medium text-red-my-for-light dark:text-red-my">
        [{children}]
      </sup>
    ),

    img: (props: React.ImgHTMLAttributes<HTMLImageElement>): JSX.Element => (
      <img
        {...props}
        alt={props.alt || ""}
        // Added max-w-full and h-auto for responsive images
        className={`max-w-full h-auto ${props.className || "py-2"}`}
      />
    ),
  };
}

const Components: MDXComponents = useMDXComponents();
export default Components;
