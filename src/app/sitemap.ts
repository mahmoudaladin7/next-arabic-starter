import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";
import { getPosts } from "@/lib/blog";
import { xDefault } from "@/lib/metadata";

const STATIC_PAGES = ["/", "/blog"];

/**
 * One entry per URL per language. Each entry lists its translations,
 * which is how Google learns that /ar/blog and /en/blog are the same page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const url = (locale: Locale, pathname: string) =>
    `${siteConfig.url}/${locale}${pathname === "/" ? "" : pathname}`;

  const addPage = (pathname: string, locales: readonly Locale[], lastModified?: string) => {
    const path = pathname === "/" ? "" : pathname;
    const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, url(l, pathname)]));
    languages["x-default"] = `${siteConfig.url}${xDefault(path, locales)}`;
    for (const locale of locales) {
      entries.push({
        url: url(locale, pathname),
        lastModified,
        alternates: { languages },
      });
    }
  };

  for (const page of STATIC_PAGES) addPage(page, routing.locales);

  // Posts may exist in only some languages.
  const postsByLocale = await Promise.all(routing.locales.map((l) => getPosts(l)));
  const slugs = new Set(postsByLocale.flat().map((p) => p.slug));
  for (const slug of slugs) {
    const locales = routing.locales.filter((_, i) => postsByLocale[i].some((p) => p.slug === slug));
    const date = postsByLocale.flat().find((p) => p.slug === slug)?.date;
    addPage(`/blog/${slug}`, locales, date);
  }

  return entries;
}
