import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Redirects `/` to the visitor's language (from the cookie or the
// Accept-Language header) and keeps the locale prefix on every URL.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next.js internals and files with an extension
  // (robots.txt, sitemap.xml, images, fonts...).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
