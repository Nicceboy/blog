import path from "node:path";
import deno from "@deno/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import type {RehypeShikiOptions} from '@shikijs/rehype';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import { createHighlighterCore } from 'shiki/core';

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


const highlighter = await createHighlighterCore ({
  themes : [
    import('@shikijs/themes/github-light-default'),
    import('@shikijs/themes/github-dark-default'),
  ],
  langs : [
    import('@shikijs/langs/typescript'), 
    import('@shikijs/langs/rust'),
    import('@shikijs/langs/bash'),
    import('@shikijs/langs/dockerfile'),
    import('@shikijs/langs/yaml'),
    import('@shikijs/langs/json'),
    import('@shikijs/langs/hcl'),
  ],
  engine : createOnigurumaEngine (() => import('shiki/wasm'))
});



 const shiki_opts: RehypeShikiOptions =  {
    themes: {
      light: 'github-light-default',
      dark: 'github-dark-default',
    },
    colorReplacements: {
      'github-light-default': {
        '#953800': '#b7384b',
      },
      'github-dark-default': {
        '#ffa657': '#b7384b',
      },
    },
    transformers: [
    //   {
    //     // Transformer hook for the <pre> element
    //     pre(node) {
    //       // Ensure the pre element preserves whitespace and line breaks
    //       const existingStyle = node.properties.style || '';
    //       // Check if white-space is already set, if not, add it.
    //       if (!/white-space\s*:/.test(String(existingStyle))) {
    //         node.properties.style = `white-space: pre;${existingStyle ? ' ' + existingStyle : ''}`;
    //       }
    //       // You can add other classes or styles to the <pre> element here if needed
    //       // node.properties.class = (node.properties.class || '') + ' custom-pre-class';
    //     },
    //     // Transformer hook for the <code> element
    //     code(node) {
    //       // `node` is the Hast node for the <code> element
    //       // Add the custom class
    //       node.properties.class = (node.properties.class || '') + ' processed-code-block';
    //     }
    //     // You can add other hooks like `line`, `span` if needed
    //     // line(node, line) { ... }
    //   }
    // ]
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
    reactRouter(),
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
