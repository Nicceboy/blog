import path from "node:path";
import deno from "@deno/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import type { RehypeShikiOptions } from "@shikijs/rehype";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { createHighlighterCore } from "shiki/core";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

import { rehypeTypographyInjector } from "~/lib/mdx_inject.ts";
import type { TypographyOptions } from "~/lib/mdx_inject.ts";
import rehypeSlug from "https://esm.sh/rehype-slug@6";
import rehypeAutolinkHeadings from "https://esm.sh/rehype-autolink-headings@7";
import rehypeMathjax from "rehype-mathjax/chtml";

const typographyOptions: TypographyOptions = {
  initial_classes: [
    "first-letter:float-left",
    "first-letter:mr-3",
    "first-letter:text-7xl",
    "first-letter:font-bold",
    "first-letter:text-red-my",
  ],
  heading_depth: 3,
};

const highlighter = await createHighlighterCore({
  themes: [
    import("@shikijs/themes/github-light-default"),
    import("@shikijs/themes/vitesse-black"),
  ],
  langs: [
    import("@shikijs/langs/typescript"),
    import("@shikijs/langs/rust"),
    import("@shikijs/langs/bash"),
    import("@shikijs/langs/dockerfile"),
    import("@shikijs/langs/yaml"),
    import("@shikijs/langs/json"),
    import("@shikijs/langs/hcl"),
  ],
  engine: createOnigurumaEngine(() => import("shiki/wasm")),
});

const shiki_opts: RehypeShikiOptions = {
  themes: {
    light: "github-light-default",
    dark: "vitesse-black",
  },
  colorReplacements: {
    "github-light-default": {
      "#953800": "#b7384b",
    },
    "github-dark-default": {
      "#ffa657": "#b7384b",
    },
    "houston": {
      "#00daef": "#b7384b",
    },
    "vitesse-black": {
      "#80a665": "#b7384b",
    },
  },
  transformers: [
    {
      // Transformer hook for the <pre> element
      pre(_node) {
      },
      // Transformer hook for the <code> element
      code(_node) {
      },
      // Transformer hook for each line (span.line)
      line(node, line) {
        // `node` is the Hast node for the span.line element
        // `line` is the line number (1-based)
        node.properties.class = (node.properties.class || "") + "";

        // Create the line number element
        const lineNumberEl = {
          type: "element" as const,
          tagName: "span",
          properties: { className: ["line-number", ""] }, // Add class for styling
          children: [{ type: "text" as const, value: String(line) }],
        };

        node.children.unshift(lineNumberEl);
      },
    },
  ],
};

const mathjax_options = {
  chtml: {
    scale: 1, // global scaling factor for all expressions
    minScale: .5, // smallest scaling factor to use
    mtextInheritFont: false, // true to make mtext elements use surrounding font
    merrorInheritFont: true, // true to make merror text use surrounding font
    mathmlSpacing: true, // true for MathML spacing rules, false for TeX rules
    skipAttributes: {}, // RFDa and other attributes NOT to copy to the output
    exFactor: .5, // default size of ex in em units
    displayAlign: "center", // default for indentalign when set to 'auto'
    displayIndent: "0", // default for indentshift when set to 'auto'
    matchFontHeight: true, // true to match ex-height of surrounding font
    fontURL: "/fonts/woff-v2", // The URL where the fonts are found
    adaptiveCSS: true, // true means only produce CSS that is used in the processed equations
  },
};

export default defineConfig({
  plugins: [
    deno(),
    tailwindcss(),
    imagetools(),
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          [rehypeSlug],
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [rehypeTypographyInjector, typographyOptions],
          [rehypeMathjax, mathjax_options],
          [rehypeShikiFromHighlighter, highlighter, shiki_opts],
        ],
      }),
    },
    reactRouter(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
  ssr: {
    resolve: {
      conditions: ["module", "deno", "node", "development|production"],
      externalConditions: ["deno", "node"],
    },
  },
});
