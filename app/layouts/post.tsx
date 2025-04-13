"use client";

import { MDXProvider } from "@mdx-js/react";
import { ClockAlert } from "lucide-react";
import Components from "~/typography.tsx";
import { Alert, AlertTitle } from "~/components/alert.tsx";
import { TableOfContents } from "~/lib/toc.tsx";
import { Sidenotes } from "~/components/sidenotes.tsx";

export type MetaData = {
  title: string;
  created: number;
  updated: number;
  tags: string[];
  author: string;
  description: string;
};

export const PostContainer = (
  { children, meta }: { children: React.ReactNode; meta: MetaData },
) => {
  // @ts-expect-error Components.h1 is actually a valid component function
  const Title = () => Components.h1({ children: meta.title });
  const PostAgeWarning = () => {
    const ageInYears = Math.floor(
      (Date.now() - meta.created) / (1000 * 60 * 60 * 24 * 365),
    );

    if (ageInYears >= 2) {
      return (
        <Alert className="border-none text-red-my font-black">
          <ClockAlert className="h-7 w-7" />
          <AlertTitle className="text-xl font-bold">
            This post is over {ageInYears} years old.
          </AlertTitle>
        </Alert>
      );
    }

    return null;
  };
  const DateInfo = () => {
    const createdDate: string = new Date(meta.created)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const updatedDate = meta.updated
      ? new Date(meta.updated).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : null;

    return (
      <div className="text-gray-500 text-md font-bold mb-4 flex flex-col sm:flex-row">
        <span>Published on {createdDate}</span>
        {updatedDate && (
          <span className="sm:ml-4 mt-1 sm:mt-0">
            Updated: {updatedDate}
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
            className="text-red-my font-medium cursor-pointer hover:text-red-my-hover  transition-colors"
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

  const EOF_TEXT_CLASS = "text-gray-700 text-sm font-bold font-mono py-1";

  return (
    <>
      <section
        className={`lg:-left-50 prose max-w-screen md:max-w-[85ch] w-full space-y-6 sm:px-4 md:px-6 relative`}
      >
        <div className="bg-black p-6 space-y-4 rounded-3xl relative">
          <div className="flex items-center">
            <span className={EOF_TEXT_CLASS}>
            </span>
            {/* <div className="ml-2 border-l-2 h-5 dark:border-gray-700 " /> */}
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-gray-700 to-gray-700" />
          </div>
          <Title />
          <DateInfo />
          <PostAgeWarning />
          <TableOfContents />
          <MDXProvider components={Components}>
            {children}
          </MDXProvider>
          <TagsList />
          <div className="flex items-center my-2">
            <div className="flex-1 h-[2px] dark:border-gray-700 bg-gradient-to-r from-gray-700  via-gray-700 to-transparent" />
            <span className={`${EOF_TEXT_CLASS} mx-4`}></span>
            {/* <div className="flex-1 border-t-2 dark:border-gray-700" /> */}
          </div>

          <Sidenotes />
        </div>
      </section>
    </>
  );
};
