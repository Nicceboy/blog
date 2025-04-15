"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { MetaData } from "./post.tsx";

interface Post extends MetaData {
  slug: string;
}

const PostCard = ({ post }: { post: Post }) => {
  const formattedDate = new Date(post.created).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-black p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-800 mb-3">
      <Link to={`/posts/${post.slug}`} className="no-underline">
        <h2 className="text-2xl font-bold text-gray-400 mb-2 hover:text-red-my transition-colors">
          {post.title}
        </h2>
      </Link>
      <div className="text-gray-400 text-sm mb-3">{formattedDate}</div>
      {post.description && (
        <p className="text-gray-500 mb-3">{post.description}</p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span key={index} className="text-sm text-red-my">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const PostsLayout = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
      } else {
        setError(data.error || "Failed to fetch posts");
      }
    } catch (_err) {
      setError("An error occurred while fetching post!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto lg:px-4 mb-14">
      {isLoading
        ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-red-my">
            </div>
            <p className="mt-2">Loading posts...</p>
          </div>
        )
        : posts.length > 0
        ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {posts.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          </>
        )
        : <div className="text-center py-8">No posts found</div>}
    </div>
  );
};
