import type { MetaData } from "~/layouts/post.tsx";
import type React from "react"; // Import React type

// Extended post interface that includes a slug and the component
export interface Post extends MetaData {
  slug: string;
  default: React.ComponentType; // Add the component type
  path: string; // Ensure path is part of the interface if used
}

// Cache for posts to avoid reloading
let _posts: Post[] | null = null;

export function getAllLocalPosts(): Post[] {
  // If we've already loaded the posts, return them (client-side cache)
  if (_posts !== null) {
    return _posts;
  }

  try {
    // Use Vite's import.meta.glob to get all MDX files
    // With { eager: true }, this is transformed at build time into synchronous imports
    // This means the imports are already resolved when this code runs
    const modules = import.meta.glob("../posts/*/index.mdx", { eager: true });

    if (Object.keys(modules).length === 0) {
      console.warn("No MDX posts found in the posts directory");
    } else {
      console.log(`Found ${Object.keys(modules).length} posts`);
    }

    _posts = Object.entries(modules)
      .map(([path, module]) => {
        // Extract slug from path (assuming format ../posts/slug/index.mdx)
        const slug = path.split("/").slice(-2)[0];
        // Cast the module with proper typing for MDX content
        const mod = module as {
          default: React.ComponentType;
          metadata: MetaData;
        };
        const metadata = mod.metadata ;

        if (!metadata.created) {
          throw new Error(`Post "${path}" is missing the 'created' date in its frontmatter.`);
        }
        const created = new Date(metadata.created);

        // Updated can be optional
        const updated = metadata.updated
          ? new Date(metadata.updated)
          : undefined;

        return {
          slug,
          title: metadata.title || "Untitled Post",
          description: metadata.description,
          created,
          updated,
          tags: metadata.tags || [],
          image: metadata.image,
          path,
          default: mod.default, // Store the component itself
        } as Post;
      })
      // Sort by creation date, newest first
      .sort((a, b) =>
        new Date(b.created).getTime() - new Date(a.created).getTime()
      );

    return _posts;
  } catch (error) {
    console.error("Error loading posts:", error);
    // Return empty array in case of error
    return [];
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getAllLocalPosts();
  // Sort by creation date (newest first)
  posts.sort((a, b) =>
    new Date(b.created).getTime() - new Date(a.created).getTime()
  );
  return posts;
}

// get post by slug - Returns metadata AND the component from cache
export async function getPostBySlug(slug: string): Promise<Post | null> { // Update return type
  if (!slug) return null;

  // Ensure posts are loaded into the cache
  const posts = getAllLocalPosts();
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    console.log(`Post with slug "${slug}" not found.`);
    return null;
  }

  // The 'post' object from the cache contains everything:
  return post;
}
