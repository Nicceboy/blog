import type { LoaderFunction } from "react-router";
import { getAllPostsMetadata } from "./get_posts_cached.ts";

export const loader: LoaderFunction = () => {
  try {
    const posts = getAllPostsMetadata();
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
