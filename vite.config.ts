import path from "node:path";
import deno from "@deno/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

import { rehypeTypographyInjector } from "~/lib/mdx_inject.ts";
import type { TypographyOptions } from "~/lib/mdx_inject.ts";
import rehypeSlug from "https://esm.sh/rehype-slug@6";
import rehypeAutolinkHeadings from "https://esm.sh/rehype-autolink-headings@7";
import rehypeMathjax from "rehype-mathjax/chtml";

import rehypeExpressiveCode from "rehype-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

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

const rehypeExpressiveCodeOptions = {
  // themes: ["ayu-dark"],
  // themes: ["github-dark-high-contrast"],
  themes: ["vesper"],
  // themes: ["vitesse-black", "solarized-light"],
  plugins: [pluginLineNumbers()],
  // shiki: {
  //   bundledLangs: [".ts", ".rs"],
  // },
  frames: {
    showCopyToClipboardButton: false,
  },
  styleOverrides: {
    borderRadius: "0.3rem",
    borderWidth: "1px",
    // borderColor: "var(--color-semi-dark)",
    borderColor: "rgb(56 56 56/1)",
    gutterBorderColor: "transparent",
    codeFontFamily: "var(--font-mono)",
    codeBackground: "var(--color-darkest-dark)",
    frames: {
      editorActiveTabIndicatorTopColor: "var(--color-red-my)",
      editorTabBarBorderBottomColor: "var(--color-semi-dark)",
      terminalTitlebarBackground: "var(--color-darkest-dark)",
      terminalTitlebarBorderBottomColor: "var(--color-semi-dark)",
      terminalBackground: "var(--color-darkest-dark)",
    },
    textMarkers: {
      inlineMarkerBorderWidth: "0.1rem",
    },
  },
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
    fontURL: "fonts/woff-v2", // The URL where the fonts are found
    adaptiveCSS: true, // true means only produce CSS that is used in the processed equations
  },
};

export default defineConfig({
  plugins: [
    deno(),
    tailwindcss(),
    reactRouter(),
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
          [rehypeExpressiveCode, rehypeExpressiveCodeOptions],
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
