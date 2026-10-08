import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware drop-in replacements for Next.js navigation APIs.
// `<Link href="/blog">` renders `/ar/blog` or `/en/blog` automatically.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
