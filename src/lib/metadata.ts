import type { Metadata } from "next";
import { localeMeta, routing, type Locale } from "@/i18n/routing";

/**
 * Canonical + hreflang links for a page.
 * `pathname` is the path without the locale, e.g. "/" or "/blog/rtl-checklist".
 * Pass `locales` when a page only exists in some languages.
 */
export function alternates(
  locale: Locale,
  pathname: string,
  locales: readonly Locale[] = routing.locales,
): Metadata["alternates"] {
  const path = pathname === "/" ? "" : pathname;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}${path}`;
  languages["x-default"] = xDefault(path, locales);

  return { canonical: `/${locale}${path}`, languages };
}

/**
 * The URL for visitors whose language isn't listed. When a page exists in every
 * language, that's the un-prefixed URL, which redirects to the visitor's language.
 * Otherwise it's the default (or first) language that has the page.
 */
export function xDefault(path: string, locales: readonly Locale[] = routing.locales) {
  if (locales.length === routing.locales.length) return path || "/";
  const fallback = locales.includes(routing.defaultLocale) ? routing.defaultLocale : locales[0];
  return `/${fallback}${path}`;
}

export function openGraphLocale(locale: Locale) {
  return {
    locale: localeMeta[locale].ogLocale,
    alternateLocale: routing.locales
      .filter((l) => l !== locale)
      .map((l) => localeMeta[l].ogLocale),
  };
}
