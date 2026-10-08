import fs from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import type { ComponentType } from "react";
import type { Locale } from "@/i18n/routing";

/**
 * Posts live in `src/content/blog/<locale>/<slug>.mdx`.
 * Use the same file name in every language so the language switcher
 * can take readers from one translation to the other.
 *
 * Each post exports its own metadata:
 *   export const metadata = { title: "...", description: "...", date: "2026-10-01" };
 */
export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, e.g. "2026-10-01". */
  date: string;
};

type PostModule = {
  default: ComponentType;
  metadata: Omit<PostMeta, "slug">;
};

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

async function importPost(locale: Locale, slug: string): Promise<PostModule | null> {
  try {
    return await import(`@/content/blog/${locale}/${slug}.mdx`);
  } catch {
    return null;
  }
}

/** All posts in a language, newest first. Cached, so the folder is read once per build. */
export async function getPosts(locale: Locale): Promise<PostMeta[]> {
  "use cache";
  cacheLife("max");

  let files: string[] = [];
  try {
    files = await fs.readdir(path.join(CONTENT_DIR, locale));
  } catch {
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const mod = await importPost(locale, slug);
        return mod ? { slug, ...mod.metadata } : null;
      }),
  );

  return posts
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(locale: Locale, slug: string) {
  // Only allow simple slugs, so a URL can't reach outside the content folder.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const mod = await importPost(locale, slug);
  if (!mod) return null;
  return { Content: mod.default, meta: { slug, ...mod.metadata } satisfies PostMeta };
}
