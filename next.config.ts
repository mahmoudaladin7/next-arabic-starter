import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Blog posts are read from disk when the post list is built.
  // This makes sure they ship with the server bundle on Vercel.
  outputFileTracingIncludes: {
    "/[locale]/**": ["./src/content/**/*", "./src/fonts/og/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withMDX = createMDX({
  options: {
    // Plugins are passed by name so they work with Turbopack.
    remarkPlugins: ["remark-gfm"],
  },
});

export default withNextIntl(withMDX(nextConfig));
