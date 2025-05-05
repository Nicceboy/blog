import type { MetaData } from "./post_layout.tsx";
import type { MDXContent } from "mdx/types";

interface MdxModule {
  default: MDXContent;
  metadata: MetaData;
}
export interface Post extends MetaData {
  slug: string;
  path: string;
}

type MdxGlobResult = Record<string, MdxModule>;
// NOTE - loads all posts eagerly into memory
const modules = import.meta.glob("/app/posts/*/index.mdx", { eager: true }) as MdxGlobResult;
let _allMetadata: Post[];

// Function to get metadata list (now synchronous as modules are eager)
export function getAllPostsMetadata(): Post[] {
  if (_allMetadata) return _allMetadata;

  const postsData = Object.entries(modules).map(
    ([path, mod]) => { 
      const slug = path.split("/").slice(-2)[0];
      const metadata = mod.metadata; 

      // If it's a draft post, return null. We will filter these out later.
      if (metadata.draft) {
        return null;
      }

      if (!metadata.created) {
        throw new Error(`Post "${path}" is missing the 'created' date.`);
      }
      const processedMetadata: MetaData = {
        ...metadata,
        title: metadata.title || "Untitled Post",
        created: new Date(metadata.created),
        updated: metadata.updated ? new Date(metadata.updated) : undefined,
        tags: metadata.tags || [],
        toc: metadata.toc ?? false,
      };
      return {
        ...processedMetadata,
        slug,
        path,
      };
    },
  ).filter((post): post is Post => post !== null); // Filter out nulls (drafts)

  _allMetadata = postsData.sort((a, b) =>
    new Date(b.created).getTime() - new Date(a.created).getTime()
  );
  return _allMetadata;
}
// Get metadata for a single post by slug
export function getPostMetadataBySlug(slug: string): Post | null {
  const allPosts = getAllPostsMetadata();
  const post = allPosts.find((post) => post.slug === slug);
  if (!post) {
    console.log(`Post with slug "${slug}" not found.`);
    return null;
  }
  return post;
}

// To get a single post's content
export function getPostBySlug(slug: string): MDXContent | null {
  const path = `/app/posts/${slug}/index.mdx`;
  console.log("Modules:", modules);
  console.log("Path:", path);
  const mod = modules[path]; 
  if (!mod) {
    console.log(`Post module with slug "${slug}" not found.`);
    return null;
  }
  return mod.default;
}
