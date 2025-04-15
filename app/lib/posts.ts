import type { MetaData } from "~/layouts/post.tsx";

// Extended post interface that includes a slug
export interface Post extends MetaData {
  slug: string;
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
        // Get metadata from the module
        const mod = module as any;
        const metadata = mod.metadata || {};

        // Ensure dates are properly converted to Date objects
        const created = metadata.created
          ? new Date(metadata.created)
          : new Date();
        const updated = metadata.updated
          ? new Date(metadata.updated)
          : undefined;

        // Return a properly structured Post object
        return {
          slug,
          title: metadata.title || "Untitled Post",
          description: metadata.description,
          created,
          updated,
          tags: metadata.tags || [],
          image: metadata.image,
          // Store the path for potential future use
          path,
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
  //   await new Promise((resolve) => setTimeout(resolve, 3000));

  return posts;
}
// get post by slug
export async function getPostBySlug(slug: string) {
  const posts = getAllLocalPosts();
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return null;
  }

  try {
    // Dynamically import the MDX file
    const mdxModule = await import(`../posts/${slug}/index.mdx`);

    // Return a merged object with both post metadata and the MDX component
    return {
      ...post,
      default: mdxModule.default, // The React component from MDX
      metadata: mdxModule.metadata || post, // The metadata from MDX or fallback to post
    };
  } catch (error) {
    console.error(`Failed to load post content for ${slug}:`, error);
    return null;
  }
}
