/**
 * Site-wide settings. Change these first when you start a new project.
 */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  // Set automatically on Vercel.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  /** Used in the header, page titles and share images. */
  name: "next-arabic-starter",
  /** Absolute URL without a trailing slash. Used for canonical links and the sitemap. */
  url: resolveSiteUrl().replace(/\/$/, ""),
  repo: "https://github.com/mahmoudaladin7/next-arabic-starter",
  author: {
    /** One entry per language in src/i18n/routing.ts. */
    name: { ar: "محمود علاء الدين", en: "Mahmoud Aladin" },
    url: "https://mahmoudaladin.netlify.app",
  },
};
