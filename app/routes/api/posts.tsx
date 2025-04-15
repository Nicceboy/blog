import type { LoaderFunction } from "react-router";
import { getAllPosts } from "~/lib/posts.ts";

export const loader: LoaderFunction = async () => {
  try {
    const posts = await getAllPosts();
    return { posts };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { error: "Failed to fetch posts", status: 500 };
  }
};
