<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

This site is built in Arabic (right to left) and English (left to right). Every change must work in both directions.

## Layout and direction

- Never use physical direction classes. Use the logical ones:
  - `ms-*` / `me-*` instead of `ml-*` / `mr-*`
  - `ps-*` / `pe-*` instead of `pl-*` / `pr-*`
  - `start-*` / `end-*` instead of `left-*` / `right-*`
  - `text-start` / `text-end` instead of `text-left` / `text-right`
  - `rounded-s-*` / `rounded-e-*`, `border-s` / `border-e`
- In plain CSS, use `margin-inline-start`, `padding-inline-end`, `inset-inline-start` and so on.
- Physical classes are only allowed when something must stay on one side in every language (the bilingual hero headline is the one example). Leave a comment when you do this.
- Mirror icons that point (arrows, chevrons) with `rtl:-scale-x-100`, or use `ForwardArrowIcon`, `BackArrowIcon` and `ChevronIcon` from `src/components/icons.tsx`. Don't mirror logos, checkmarks, play buttons or clocks.
- `rtl:` and `ltr:` use the CSS `:dir()` selector (see `globals.css`), so they work inside nested `dir` attributes.
- Logical margins on an element with its own `dir="ltr"` follow that element's direction, not the page's. Put spacing on the parent (`gap-*`) instead.
- Wrap code, paths, phone numbers and emails inside Arabic text in `<span dir="ltr">` (or use the `<code>` tag from `richTags` in `src/lib/rich.tsx`).
- Never add `letter-spacing` / `tracking-*` to Arabic text.

## Text and translations

- No hard-coded user-facing strings. Add them to both `messages/en.json` and `messages/ar.json`, then run `npm run check:i18n`.
- Use `useTranslations` / `getTranslations` and `useFormatter` / `getFormatter` from next-intl for every number, date, price and plural. Don't build these strings by hand.
- Use `Link`, `redirect`, `usePathname` and `useRouter` from `@/i18n/navigation`, not from `next/link` or `next/navigation`, so URLs keep their locale.
- Server Components read the locale with `getLocale()` (it comes from `next/root-params`). Route Handlers, image routes and Server Actions can't do that yet: pass the locale explicitly, e.g. `getTranslations({ locale, namespace })`.

## Blog

- Posts are MDX files in `src/content/blog/<locale>/<slug>.mdx` and export `metadata` with `title`, `description` and `date`.
- Use the same slug in every language so the language switcher links translations.

## Checks

Run these before you finish:

```bash
npm run lint
npm run typecheck
npm run check:i18n
npm run build
```
