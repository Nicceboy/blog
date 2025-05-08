import { PageLayout } from "~/layouts/default.tsx";
import { getPostBySlug, getPostMetadataBySlug, type Post } from "./get_posts_cached.ts"; // Import Post type
import Components from "~/typography.tsx";
import type { Route } from "+types/post.tsx";
import { useMemo } from "react";
import type { MDXContent } from "mdx/types";

interface PostsProps {
  loaderData: Post;
}

// Loader always returns a Post object, with 404 content if needed
export function loader(
  { params }: Route.LoaderArgs,
): Post {
  if (!params.slug) {
    console.error("[loader] Missing slug parameter");
    throw new Error("Bad Request: Missing slug parameter");
  }
  
  const metadata = getPostMetadataBySlug(params.slug);
  
  if (metadata) {
    return metadata;
  }
  
  // Return 404 content as Post type
  return {
    slug: params.slug,
    title: "Post Not Found",
    description: `The post with slug "${params.slug}" could not be found`,
    image: "",
    path: "",
    created: new Date(),
    toc: false,
    draft: "",
  };
}

export function HydrateFallback() {
  return (
    <PageLayout>
      <section className="prose max-w-screen md:max-w-[85ch] w-full space-y-6 sm:px-4 md:px-6 relative p-4">
        <h1 className="text-xl font-bold text-center">Loading post...</h1>
        <div className="flex flex-col items-center pt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white">
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default function Posts({ loaderData }: PostsProps) {
  const PostContentComponent: MDXContent | null = getPostBySlug(loaderData.slug);
  const memoizedPostContentElement = useMemo(() => {
    // Check for notFound flag or missing PostContentComponent
    if (PostContentComponent === null || PostContentComponent === undefined) {
      return (
        <div className="prose max-w-screen md:max-w-[85ch] w-full p-4">
          <h2>Post Not Found</h2>
          <p>We couldn't find a post with the slug "{loaderData.slug}". Please check the URL and try again.</p>
        </div>
      );
    }
    return <PostContentComponent components={Components} />;
  }, [PostContentComponent, loaderData]);

  return (
    <PageLayout>
      {memoizedPostContentElement}
    </PageLayout>
  );
}

// TODO https://github.com/remix-run/react-router/discussions/12672
export function meta({ data }: { data: Post }) {
  // Use data directly since it's always a Post object
  return [
    { title: data.title },
    {
      name: "description",
      content: data.description,
    },
    {
      name: "author",
      content: "Niklas Saari",
    },
    {
      property: "og:title",
      content: data.title,
    },
    {
      property: "og:description",
      content: data.description,
    },
    {
      property: "og:image",
      content: data.image,
    },
  ];
}

