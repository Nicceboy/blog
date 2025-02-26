import { MDXProvider } from "@mdx-js/react";
import { ClockAlert } from "lucide-react";
import Components from "~/typography.tsx";
import { Alert, AlertDescription, AlertTitle } from "~/components/alert.tsx";

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
  // const AuthorInfo = () => {
  //   if (!meta.author) return null;
  //   return (
  //     <div className="text-gray-500 font-medium mb-2">
  //       By {meta.author}
  //     </div>
  //   );
  // };
  const PostAgeWarning = () => {
    const ageInYears = Math.floor(
      (Date.now() - meta.created) / (1000 * 60 * 60 * 24 * 365),
    );

    if (ageInYears >= 2) {
      return (
        <Alert className="text-bg-amber-50 border-amber-500 dark:text-white dark:border-red-my">
          {/* <Alert className="text-bg-amber-50 border-amber-500 dark:text-amber-200 dark:border-amber-700"> */}
          <ClockAlert className="h-5 w-5" />
          <AlertTitle>Outdated!</AlertTitle>
          <AlertDescription>
            This post{" "}
            <b>
              is over {ageInYears} years old. {" "}
            </b>
            While the core concepts may still apply, some details might be
            outdated.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };
  const DateInfo = () => {
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

    return (
      <div className="text-gray-500 text-sm font-bold mb-4 flex flex-col sm:flex-row">
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
            className="text-red-my font-medium cursor-pointer hover:text-red-my-hover transition-colors"
            onClick={() => {
              // You can add tag navigation logic here in the future
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
    <>
      <section className="prose max-w-screen md:max-w-[85ch] w-full space-y-6 px-3 sm:px-4 md:px-6">
        {/* <section className="prose max-w-screen md:max-w-[900px] w-full space-y-6 px-3 sm:px-4 md:px-6"> */}
        <div className="bg-black rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
          <Title />
          {/* <AuthorInfo /> */}
          <DateInfo />
          <PostAgeWarning />
          <TagsList />
          <MDXProvider components={Components}>
            {children}
          </MDXProvider>
        </div>
      </section>
    </>
  );
};
