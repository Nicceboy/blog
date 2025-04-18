import type { LoaderFunction } from "react-router";
import { getAllPostsMetadata } from "~/lib/posts.ts";

export const loader: LoaderFunction = async () => {
  try {
    const posts = await getAllPostsMetadata();
    return { posts, status: 200 };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      error: "Failed to fetch posts",
      status: 500,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
