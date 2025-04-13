import { visit } from "https://esm.sh/unist-util-visit@5";
import type {
  Element,
  ElementContent,
  Root,
} from "https://esm.sh/@types/hast@3";

export type TypographyOptions = {
  initial_classes: string[];
  heading_depth: number;
};

/**
 * Creates a rehype plugin that inspects the document structure
 * and can extract headings, paragraphs, etc.
 */
export function rehypeTypographyInjector(_options: TypographyOptions) {
  // Allow any type for deno

  return (tree: Root) => {
    const headings: {
      type: string;
      level: number;
      text: string;
      id?: string;
    }[] = [];
    let firstParagraph: string = "";
    // @ts-ignore - Tree type not exported by unist-util-visit :(
    visit(tree, ["element"], (node: Element) => {
      //   Extract headings (h1, h2, etc)
      if (node.tagName?.match(/^h[1-6]$/)) {
        const level = parseInt(node.tagName.charAt(1), 10);
        const text = getTextContent(node);
        const id = node.properties?.id as string | undefined;
        headings.push({
          type: node.tagName,
          level,
          text,
          id,
        });
      }

      // Extract the first paragraph
      if (node.tagName === "p" && !firstParagraph) {
        firstParagraph = getTextContent(node);
        // Initialize properties object if it doesn't exist
        if (!node.properties) {
          node.properties = {};
        }
        node.properties["first"] = "true";
      }
    });

    return tree;
  };
}

// Helper function to extract text content from nodes
function getTextContent(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "comment") return "";

  if (!("children" in node)) return "";
  if (!node.children) return "";

  return node.children
    .map((child: ElementContent) => getTextContent(child))
    .join("");
}
