"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Post } from "./get_posts_cached.ts";

const PostCard = ({ post }: { post: Post }) => {
  const formattedDate = new Date(post.created).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col h-full rounded p-4 shadow-sm hover:shadow-md transition-shadow box-border border border-gray-300 dark:border-gray-800">
      {/* Content Section */}
      <div className="flex-grow mb-4">
        <Link to={`/posts/${post.slug}`} className="no-underline">
          <h2 className="text-2xl font-bold dark:text-gray-400 mb-2 hover:text-red-my transition-colors">
            {post.title}
          </h2>
        </Link>
        <div className="py-1 border-t border-gray-300 dark:border-gray-900"></div>
        <div className="dark:text-gray-400 text-sm mb-3">{formattedDate}</div>
        {post.description && (
          <p className="dark:text-gray-500 mb-3">{post.description}</p>
        )}
      </div>

      {/* Image Section - Moved outside content div to position at bottom */}
      {post.image && (
        <div className="mt-auto mb-3">
          <img
            src={post.image}
            alt={post.title || "Post image"}
            className="w-full object-cover rounded-md opacity-95"
          />
        </div>
      )}

      {post.tags && post.tags.length < 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-900">
          {/* Added top border for separation */}
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="text-[1rem] text-black dark:text-red-my"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="py-1 border-b border-gray-300 dark:border-gray-900"></div>
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
    <div className="container mx-auto lg:px-4 b-14">
      {isLoading
        ? (
          <div className="text-center py-[1rem]">
            <div className="inline-block animate-spin rounded-full h-[3rem] w-12 border-4 border-gray-200 dark:border-gray-900 border-t-red-my-for-light dark:border-t-red-my">
            </div>
            <p className="mt-2 font-bold">Loading posts...</p>
          </div>
        )
        : posts.length > 0
        ? (
          <>
            <h1 className="pl-[1rem] mb-[2rem] font-bold text-3xl text-red-my-for-light dark:text-red-my">Writings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[3rem]">
              {posts.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          </>
        )
        : <div className="text-center py-8">No posts found</div>}
    </div>
  );
};
