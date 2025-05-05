"use client";

import { MDXProvider } from "@mdx-js/react";
import Components from "~/typography.tsx";
import { TableOfContents } from "~/lib/toc.tsx";
import { isValidElement, useMemo } from "react";
import { CalendarBlank } from "@phosphor-icons/react";
import { Sidenotes } from "~/components/sidenote.tsx";

export type MetaData = {
  title: string;
  description?: string;
  created: Date | number;
  updated?: Date | number;
  tags?: string[];
  image?: string;
  toc: boolean;
  draft: boolean;
};

export const PostContainer = (
  { children, meta }: { children: React.ReactNode; meta: MetaData },
) => {
  // @ts-expect-error Components.h1 is actually a valid component function
  const Title = () => Components.h1({ children: meta.title });

  const formattedDates = useMemo(() => {
    const createdDate = new Date(meta.created).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const updatedDate = meta.updated
      ? new Date(meta.updated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : null;

    return { createdDate, updatedDate };
  }, [meta.created, meta.updated]);

  const DateInfo = () => {
    return (
      <div className="text-gray-800 dark:text-gray-200 text-md font-light mb-4 flex flex-col sm:flex-row">
          <div className="flex items-center">
            <CalendarBlank weight="thin" aria-label="Published" size="1.5rem" className="mr-1" />
            <span>Published on {formattedDates.createdDate}</span>
          </div>
        {formattedDates.updatedDate && (
          <span className="sm:ml-4 mt-1 sm:mt-0">
            Updated: {formattedDates.updatedDate}
          </span>
        )}
      </div>
    );
  };

  const TagsList = () => {
    if (!meta.tags || meta.tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {meta.tags.map((tag, index) => (
          <span
            key={index}
            className="text-red-my-for-light dark:text-red-my font-medium cursor-pointer hover:text-red-my-hover  transition-colors"
            onClick={() => {
              // TODO: Implement tag click logic
              console.log(`Tag clicked: ${tag}`);
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  };


  return (
    <div className="max-w-[70ch] relative">
      <div className="flex flex-row">
      <section
        className={`prose  w-full space-y-6 md:px-[calc(1rem)] relative`}
      >
        <div className="pb-6 space-y-4 relative">
      
          <Title />
          {meta.description && (
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-2 mb-2">
              {meta.description}
            </p>
          )}
          <DateInfo />
          {meta.toc && <TableOfContents />}

          {/* Safely render the MDX content with error boundary */}
          <div className="mdx-content">
            {typeof children === "function" || isValidElement(children)
              ? (
                <MDXProvider components={Components}>
                  {children}
                </MDXProvider>
              )
              : <div className="text-red-500">Invalid MDX content</div>}
          </div>

          <TagsList />
        </div>
      </section>
      <Sidenotes />
      </div>
      </div>

  );
};

export default PostContainer;