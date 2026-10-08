import type { ReactNode } from "react";

/**
 * Tags you can use inside translation strings with `t.rich()`.
 *   "Edit <code>src/config/site.ts</code>"
 *
 * Code is wrapped in an isolated left-to-right span, so a path like
 * `/ar` doesn't turn into `ar/` inside Arabic text.
 */
export const richTags = {
  code: (chunks: ReactNode) => (
    <code
      dir="ltr"
      className="rounded-[5px] border border-line bg-surface px-[0.35em] py-[0.05em] font-mono text-[0.86em] [unicode-bidi:isolate]"
    >
      {chunks}
    </code>
  ),
};
