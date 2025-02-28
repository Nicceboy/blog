import path from "node:path";
import deno from "@deno/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import rehypeSlug from "https://esm.sh/rehype-slug@6";
import rehypeAutolinkHeadings from "https://esm.sh/rehype-autolink-headings@7";
// import remarkToc from "https://esm.sh/remark-toc@9";

import rehypeExpressiveCode from "rehype-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

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

export default defineConfig({
  plugins: [
    deno(),
    tailwindcss(),
    reactRouter(),
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        // remarkPlugins: [remarkToc],
        rehypePlugins: [
          [rehypeSlug],
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [rehypeExpressiveCode, rehypeExpressiveCodeOptions],
          // rehypeStringify,
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
