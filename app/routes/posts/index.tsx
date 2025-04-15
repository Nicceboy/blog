import { PostContainer } from "~/layouts/post.tsx";
import { getPostBySlug } from "~/lib/posts.ts";
import { PageLayout } from "~/layouts/default.tsx";
import Components from "~/typography.tsx";
import { Route } from "./+types/posts.tsx";
import { useMemo } from "react";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return post;
}

export default function Posts({ loaderData }) {
  if (!loaderData || typeof loaderData.default !== "function") {
    return (
      <PageLayout>
        <div className="p-4">
          <h1 className="text-xl font-bold">
            Error: Post content not available. Quite strange, huh?
          </h1>
        </div>
      </PageLayout>
    );
  }
  // Extract the MDX component and metadata
  const PostContent = loaderData.default;
  const metadata = loaderData.metadata;

  const memoizedContent = useMemo(() => {
    return <PostContent components={Components} />;
  }, [PostContent]);

  return (
    <PageLayout>
      <PostContainer meta={metadata}>
        {memoizedContent}
      </PostContainer>
    </PageLayout>
  );
}
