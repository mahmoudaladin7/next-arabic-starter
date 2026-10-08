import localFont from "next/font/local";

/**
 * Fonts are self-hosted from `src/fonts`, so builds never depend on a
 * network request and nothing is fetched from Google at runtime.
 *
 * Latin and Arabic come from separate files. CSS stacks them
 * (`--font-sans: latin, arabic`), so each script uses its own design.
 * The Arabic files have a unicode-range, so the browser only fetches them
 * for Arabic characters.
 *
 * Want different fonts? Drop the .woff2 files into `src/fonts` and change
 * the paths below. See the README for using `next/font/google` instead.
 */

// next/font options must be literal values (they're read at build time),
// so the Arabic unicode-range below is repeated rather than stored in a variable.

export const plexSans = localFont({
  src: "../fonts/ibm-plex-sans-latin.woff2",
  variable: "--font-plex-sans",
  weight: "100 700",
  display: "swap",
  // No automatic Arial fallback here: Arial has Arabic glyphs on Windows and
  // macOS, so it would catch Arabic text before it reaches the Arabic font.
  adjustFontFallback: false,
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
});

export const plexArabic = localFont({
  src: [
    { path: "../fonts/ibm-plex-sans-arabic-400.woff2", weight: "400" },
    { path: "../fonts/ibm-plex-sans-arabic-600.woff2", weight: "600" },
  ],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0600-06FF, U+0750-077F, U+0870-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FEFC" }],
});

/** Geometric Kufi for Arabic headlines. */
export const reemKufi = localFont({
  src: "../fonts/reem-kufi-arabic.woff2",
  variable: "--font-reem-kufi",
  weight: "400 700",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0600-06FF, U+0750-077F, U+0870-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FEFC" }],
});

export const fontVariables = [
  plexSans.variable,
  plexArabic.variable,
  reemKufi.variable,
].join(" ");
