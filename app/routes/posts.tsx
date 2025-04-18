import { PageLayout } from "~/layouts/default.tsx";
import { PostContainer } from "~/layouts/post.tsx";
import { getPostBySlug, type Post } from "~/lib/posts.ts"; // Import Post type
import Components from "~/typography.tsx";
import type { Route } from "+types/posts.ts";
import { useMemo } from "react"; 
import type {MDXContent} from "mdx";

// // Define the props for the Posts component
interface PostsProps {
  // loaderData comes from clientLoader, should contain the component
  loaderData: Post;
}

// clientLoader fetches metadata AND component on the client
export async function clientLoader({ params }: Route.LoaderArgs): Promise<Post> {
  if (!params.slug) {
    console.error("[clientLoader] Missing slug parameter");
    throw new Error("Bad Request: Missing slug parameter"); // Or return null/error object
  }

  const postData = await getPostBySlug(params.slug);

  if (!postData || typeof postData.default !== 'function') {
    console.error(`[clientLoader] Failed to get valid post data or component for slug: ${params.slug}`);
    throw new Error("Not Found or Invalid Post Data"); // Or return null/error object
  }
  return postData;
}

export function HydrateFallback() {

  return (
      <PageLayout>
        <section className="prose max-w-screen md:max-w-[85ch] w-full space-y-6 sm:px-4 md:px-6 relative p-4">
            <h1 className="text-xl font-bold text-center">Loading post...</h1>
            <div className="flex flex-col items-center pt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        </section>
      </PageLayout>
  );
}

export default function Posts({ loaderData }: PostsProps) {
  // Handle error state (if clientLoader resolved but data is invalid - though it should throw)
  if (typeof loaderData.default !== "function") {
     console.error("Rendering error state. Invalid loaderData:", loaderData);
    return (
      <PageLayout>
        <section className="prose max-w-screen md:max-w-[85ch] w-full space-y-6 sm:px-4 md:px-6 relative p-4">
          <h1 className="text-xl font-bold text-red-600">
            Error: Post content not available or invalid.
          </h1>
        </section>
      </PageLayout>
    );
  }

  // Data is valid
  const PostContent: MDXContent = loaderData.default;

  const memoizedContent = useMemo(() => {
    return <PostContent components={Components} />;
  }, [PostContent]);

  const memoizedPostContainer = useMemo(() => {
    return (
      <PostContainer meta={loaderData}>
        {memoizedContent}
      </PostContainer>
    );
  }, [loaderData, memoizedContent]);

  return (
    <PageLayout>
        {memoizedPostContainer}
    </PageLayout>
  );
}
