<p align="center">
  <img src="docs/preview.png" alt="The starter's home page in Arabic (light) and English (dark)" width="100%">
</p>

<h1 align="center">next-arabic-starter</h1>

<p align="center">
  A Next.js starter for websites in Arabic and English.<br>
  Right-to-left layout, Arabic fonts, number and date formatting, SEO and an MDX blog, already set up.
</p>

<p align="center">
  <a href="https://next-arabic-starter.vercel.app"><strong>Live demo</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="README.ar.md">اقرأ بالعربية</a>
</p>

<p align="center">
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-000?logo=next.js">
  <img alt="next-intl 4" src="https://img.shields.io/badge/next--intl-4-2c42cf">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white">
  <img alt="MIT license" src="https://img.shields.io/badge/license-MIT-e39a2d">
</p>

---

Every Arabic and English site runs into the same problems: layouts that don't mirror, fonts that don't match, plurals and Hijri dates written by hand, missing hreflang tags, and share images where the Arabic comes out backwards. This starter solves them once, so a new project starts from a working base instead of a blank `create-next-app`.

<p align="center">
  <img src="docs/demo.gif" alt="Switching between English and Arabic, the plural forms demo and dark mode" width="100%">
</p>

## What's included

| | |
| --- | --- |
| **Locale routing** | `/ar` and `/en` on every URL. First-time visitors go to their browser's language. |
| **Right-to-left layout** | `lang` and `dir` set on `<html>`, logical Tailwind classes everywhere, and `rtl:` / `ltr:` variants that work inside nested directions. |
| **Arabic typography** | IBM Plex Sans Arabic for text and Reem Kufi for headlines, self-hosted so nothing is fetched from Google. |
| **Formatting** | Arabic's six plural forms, numbers, currency, Gregorian and Hijri (Umm al-Qura) dates, and an option for Arabic-Indic digits (٠١٢٣). |
| **Language switcher** | Takes you to the same page in the other language. |
| **Dark mode** | Follows the system, remembers the visitor's choice, no flash on load. |
| **SEO** | A title and description per language, canonical and hreflang links, a multilingual sitemap and `robots.txt`. |
| **Share images** | Open Graph images for every page and post, with Arabic that renders correctly ([see below](#arabic-share-images)). |
| **MDX blog** | Posts in Markdown with React components, one folder per language. No CMS. |
| **Checked translations** | Typed message keys, plus `npm run check:i18n` to compare languages. |
| **AGENTS.md** | Teaches AI coding assistants the RTL rules, so the code they write flips correctly too. |

Built with Next.js 16 (App Router, Cache Components, `proxy.ts`), React 19, next-intl 4, Tailwind CSS 4 and TypeScript. Every page is static at build time.

## Quick start

```bash
npx create-next-app@latest my-site -e https://github.com/mahmoudaladin7/next-arabic-starter
cd my-site
npm run dev
```

Open [localhost:3000](http://localhost:3000). You can also click **Use this template** at the top of this page, or deploy a copy straight away:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmahmoudaladin7%2Fnext-arabic-starter)

### Make it yours

1. Set your site name, URL and links in `src/config/site.ts`.
2. Replace the text in `messages/ar.json` and `messages/en.json`.
3. Replace the home page in `src/app/[locale]/page.tsx`. The demos in `src/components/home/` can be deleted.
4. Write posts in `src/content/blog/`, or delete the blog.
5. Delete the `docs/` folder (it only holds the images for this README).
6. When you deploy, set `NEXT_PUBLIC_SITE_URL` to your domain (Vercel fills it in for you if you skip this).

## Project structure

```
messages/
  ar.json, en.json          Translations
src/
  app/
    [locale]/               Every page lives under the locale
      layout.tsx            Sets <html lang dir>, fonts, theme
      page.tsx              Home page
      blog/                 Blog index and posts
      opengraph-image.tsx   Share image
    sitemap.ts, robots.ts
    globals.css             Colors, dark mode, rtl:/ltr: variants
  components/
  config/site.ts            Site name, URL, links
  content/blog/<locale>/    MDX posts
  fonts/                    Self-hosted font files
  i18n/
    routing.ts              Languages and their direction
    request.ts              Loads messages for each request
    navigation.ts           Locale-aware Link, redirect, useRouter
  lib/
    og/                     Share images and Arabic text shaping
  proxy.ts                  Language detection and redirects
scripts/check-messages.mjs  Compares translation files
AGENTS.md                   Rules for AI coding assistants
```

## Guide

### Writing components that work in both directions

Use logical classes, and the browser mirrors the layout from the page's `dir`:

| Instead of | Use |
| --- | --- |
| `ml-4`, `mr-4` | `ms-4`, `me-4` |
| `pl-4`, `pr-4` | `ps-4`, `pe-4` |
| `left-0`, `right-0` | `start-0`, `end-0` |
| `text-left`, `text-right` | `text-start`, `text-end` |
| `rounded-l-lg`, `border-l` | `rounded-s-lg`, `border-s` |

Mirror icons that point somewhere with `rtl:-scale-x-100`, or use `ForwardArrowIcon`, `BackArrowIcon` and `ChevronIcon` from `src/components/icons.tsx`. Don't mirror logos, checkmarks or play buttons.

Tailwind's built-in `rtl:` variant matches anything inside a `[dir="rtl"]` ancestor, so an English block inside an Arabic page gets flipped by mistake. `globals.css` redefines `rtl:` and `ltr:` with the CSS `:dir()` selector, which follows each element's real direction.

Wrap code, paths, phone numbers and emails inside Arabic text in `<span dir="ltr">` so they don't get scrambled.

### Translations

Messages live in `messages/<locale>.json` and use [ICU syntax](https://next-intl.dev/docs/usage/messages). Keys are typed from `en.json`, so a typo is a type error.

```tsx
// Server Component
const t = await getTranslations("Blog");
return <h1>{t("title")}</h1>;

// Client Component
const t = useTranslations("Blog");
```

Run `npm run check:i18n` to list keys that are missing from, or extra in, any language.

### Numbers, dates and plurals

Arabic has six plural forms. Write them once in the message:

```json
"posts": "{count, plural, =0 {لا توجد مقالات} one {مقالة واحدة} two {مقالتان} few {# مقالات} many {# مقالة} other {# مقالة}}"
```

Format numbers and dates with next-intl's formatter, never by hand:

```tsx
const format = await getFormatter();
format.number(1499, { style: "currency", currency: "SAR" }); // ‏1,499.00 ر.س.‏
format.dateTime(date, { dateStyle: "long" });                 // 20 مارس 2026
```

For a Hijri date, use `calendar: "islamic-umalqura"`. For Arabic-Indic digits (١٢٣), add the `-u-nu-arab` extension to the locale passed to `Intl` or to a `NextIntlClientProvider`. The home page demo shows both.

### Adding a language

1. Add the code to `locales` in `src/i18n/routing.ts`, and add a row to `localeMeta` with its `dir`.
2. Copy `messages/en.json` to `messages/<code>.json` and translate it.
3. Add posts in `src/content/blog/<code>/`.

Routing, the switcher, hreflang links and the sitemap pick it up automatically. There's a [full walkthrough on the demo blog](https://next-arabic-starter.vercel.app/en/blog/adding-a-language).

### Blog posts

Create `src/content/blog/<locale>/<slug>.mdx`:

```mdx
export const metadata = {
  title: "My first post",
  description: "One sentence for the post list and share image.",
  date: "2026-10-08",
};

Write your post in **Markdown**. GitHub-flavored tables and lists work.
```

Use the same file name in each language so the language switcher can link the translations. A post that only exists in one language works too: it's left out of the other language's list, sitemap entry and hreflang links (the switcher shows the not-found page for the missing translation).

### SEO

The root layout sets a title and description for each language, and pages override them with `generateMetadata`. `alternates()` in `src/lib/metadata.ts` adds the canonical URL and hreflang links (including `x-default`). The sitemap lists every page in every language with its translations and `x-default`.

### Arabic share images

`next/og` turns JSX into an image, but it doesn't handle right-to-left text. Arabic words come out in reverse order with uneven gaps between them.

<p align="center">
  <img src="docs/og-before-after.png" alt="The same Arabic title rendered by default next/og and by this starter" width="100%">
</p>

`src/lib/og/arabic-text.ts` fixes this. It joins the letters into their connected forms, puts them in visual order, and lays the words out right to left, while keeping Latin words and numbers readable. It covers Arabic plus the common Persian and Urdu letters. Every page and post gets a share image in its own language, generated at build time.

### Fonts

Fonts are self-hosted in `src/fonts` and loaded with `next/font/local`, so builds don't depend on Google Fonts being reachable. Latin and Arabic come from separate files and are stacked in CSS. The Arabic files have a `unicode-range`, so the browser only downloads them when a page shows Arabic text.

To use Google Fonts instead, swap the calls in `src/lib/fonts.ts`:

```ts
import { IBM_Plex_Sans_Arabic } from "next/font/google";

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-plex-arabic",
});
```

Share images use the `.woff` files in `src/fonts/og`, because the image renderer can't read `.woff2`.

### Dark mode

[next-themes](https://github.com/pacocoursey/next-themes) sets `data-theme` on `<html>`, and colors are CSS variables in `globals.css`. Use `dark:` classes as usual.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run check:i18n` | Compare translation files |

## Contributing

Issues and pull requests are welcome, especially fixes for RTL edge cases. Please run `npm run lint`, `npm run typecheck`, `npm run check:i18n` and `npm run build` before you open a PR.

## License

[MIT](LICENSE). The fonts in `src/fonts` are under the SIL Open Font License.

Built by [Mahmoud Aladin](https://mahmoudaladin.netlify.app).
