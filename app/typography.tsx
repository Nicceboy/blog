import type { MDXComponents } from "mdx/types";
import type { JSX } from "react";
import { Link } from "lucide-react";

export function useMDXComponents(): MDXComponents {
  return {
    h1: (
      { id, children }: { id: string; children: React.ReactNode },
    ): JSX.Element => (
      <h1
        id={id}
        className="scroll-m-20 text-red-my text-4xl font-extrabold tracking-tight lg:text-5xl"
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
      const isFirstParagraph = props["first"] === "true";
      return (
        <p
          {...props}
          className={` leading-7 [&:not(:first-child)]:mt-6 
            ${
            isFirstParagraph
              ? "first-line:tracking-widest first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-bold first-letter:text-red-my"
              : ""
          }
          `}
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
    code: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <code className="relative rounded bg-muted font-mono text-sm font-semibold text-red-my transition-colors">
        {children}
      </code>
    ),
    pre: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <pre className="mb-4 mt-6 p-2  overflow-x-auto rounded-lg bg-muted font-mono text-sm border border-solid dark:border-gray-900">
        {children}
      </pre>
    ),
    blockquote: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        {children}
      </blockquote>
    ),
    a: (
      { children, href }: { children: React.ReactNode; href?: string },
    ): JSX.Element => {
      // Check if this is an anchor link pointing to itself
      const isAnchorSelfRef = href?.startsWith("#") &&
        children &&
        typeof children === "string";
      // &&
      // href.substring(1) === children.toLowerCase().replace(/\s+/g, "-");

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

      if (isAnchorSelfRef) {
        return (
          <a
            href={href}
            onClick={handleAnchorClick}
            className="group relative font-medium text-primary"
          >
            <span
              className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            >
              <Link size={16} className="text-muted-foreground" />
            </span>
            {children}
          </a>
        );
      }

      return (
        <a
          href={href}
          onClick={href?.startsWith("#") ? handleAnchorClick : undefined}
          className="font-medium text-primary underline underline-offset-4 decoration-red-my decoration-3"
        >
          {children}
        </a>
      );
    },
    table: ({ children }: { children: React.ReactNode }): JSX.Element => (
      <div className="my-6 w-full overflow-y-auto">
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
      <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </td>
    ),
  };
}

const Components: MDXComponents = useMDXComponents();
export default Components;
