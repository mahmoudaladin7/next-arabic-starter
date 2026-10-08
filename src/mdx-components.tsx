import type { MDXComponents } from "mdx/types";
import { Link } from "@/i18n/navigation";

// Customise how Markdown elements render in blog posts.
// Styling lives in the `.prose` class in globals.css.
const components: MDXComponents = {
  a: ({ href = "", children, ...props }) =>
    href.startsWith("/") ? (
      // Internal links get the current language prefix automatically.
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} {...props}>
        {children}
      </a>
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
