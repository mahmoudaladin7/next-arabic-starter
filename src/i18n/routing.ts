import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // The first locale is not special; `defaultLocale` decides where `/` goes.
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Every URL carries its locale: /ar/blog, /en/blog.
  localePrefix: "always",
  // hreflang links are added per page in the HTML (see src/lib/metadata.ts),
  // which knows when a page only exists in some languages.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

/**
 * Everything the UI needs to know about a locale that isn't a translation.
 * Adding a language (say Persian or Urdu) means adding it to `routing.locales`,
 * adding a row here and adding a `messages/<locale>.json` file.
 */
export const localeMeta: Record<
  Locale,
  {
    /** Text direction for `<html dir>`. */
    dir: "rtl" | "ltr";
    /** The language's own name, shown in the switcher. */
    nativeName: string;
    /** Open Graph locale, e.g. `ar_SA`. */
    ogLocale: string;
  }
> = {
  ar: { dir: "rtl", nativeName: "العربية", ogLocale: "ar_SA" },
  en: { dir: "ltr", nativeName: "English", ogLocale: "en_US" },
};

export function getDirection(locale: Locale) {
  return localeMeta[locale].dir;
}
