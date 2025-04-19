import type { MetaData } from "~/layouts/post.tsx";
import type { MDXContent} from "mdx/types"
// import {PostContainer} from "~/layouts/post.tsx"

// Interface for the module structure when NOT eager
interface MdxModule {
  default: MDXContent; // Use MDXContent type
  metadata: MetaData; // Raw metadata from the file
}
export interface Post extends MetaData {
  slug: string;
  path: string;
}
// Type for the glob result when NOT eager
type MdxGlobResult = Record<string, () => Promise<MdxModule>>;

// Get functions to load modules, doesn't load content immediately
const modules = import.meta.glob("../posts/*/index.mdx") as MdxGlobResult;

// Cache for metadata only (avoids re-parsing all files)
let _allMetadata: Post[] ; 

// Function to get metadata list (can potentially run at build time or on server)
export async function getAllPostsMetadata(): Promise<Post[]> {
  if (_allMetadata) return _allMetadata;

  const postsData = await Promise.all(
    Object.entries(modules).map(async ([path, loadModule]) => {
      const slug = path.split("/").slice(-2)[0];
      // Load module just to get metadata
      const mod = await loadModule();
      const metadata = mod.metadata;

      if (!metadata.created) {
        throw new Error(`Post "${path}" is missing the 'created' date.`);
      }
      // Process metadata similarly to your original function
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
    }),
  );

  _allMetadata = postsData.sort((a, b) =>
    new Date(b.created).getTime() - new Date(a.created).getTime()
  );
  return _allMetadata;
}

// Function to get a single post's content and metadata dynamically
export async function getPostBySlug(slug: string): Promise<MDXContent | null> {
  const path = `../posts/${slug}/index.mdx`;
  const loadModule = modules[path];

  if (!loadModule) {
    console.log(`Post module with slug "${slug}" not found.`);
    return null;
  }

  try {
    const mod = await loadModule(); // Dynamically load the specific post module
    return mod.default;

  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}
