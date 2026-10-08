"use client";

import { useLocale } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import { localeMeta, routing } from "@/i18n/routing";

/**
 * Links to the current page in every other language.
 * /en/blog/rtl-checklist  ->  /ar/blog/rtl-checklist
 *
 * These are plain <a> links, not client-side navigation. Changing language
 * swaps the whole document (lang, dir, fonts, messages), and a full page load
 * is the most reliable way to do that. It also works before hydration and
 * search engines can follow it.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {routing.locales
        .filter((l) => l !== locale)
        .map((other) => (
          <a
            key={other}
            href={getPathname({ href: pathname, locale: other })}
            lang={other}
            hrefLang={other}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            {localeMeta[other].nativeName}
          </a>
        ))}
    </div>
  );
}
