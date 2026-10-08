import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { BackArrowIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getPost, getPosts } from "@/lib/blog";
import { alternates, openGraphLocale } from "@/lib/metadata";

// Posts must be fully static. This also makes an unknown slug wait for the
// full render, so it gets a real 404 status instead of a streamed 200.
export const ensureStatic = "navigation";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const posts = await getPosts(params.locale as Locale);
  // Next.js needs at least one param per language. If a language has no posts
  // yet, return a placeholder that getPost() rejects, so it renders the 404 page.
  if (posts.length === 0) return [{ slug: "_" }];
  return posts.map((post) => ({ slug: post.slug }));
}

/** Languages this post has been translated into, for hreflang links. */
async function getTranslatedLocales(slug: string) {
  const found = await Promise.all(routing.locales.map(async (l) => ((await getPost(l, slug)) ? l : null)));
  return found.filter((l): l is Locale => l !== null);
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPost(locale, slug);
  if (!post) return {};

  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: alternates(locale, `/blog/${slug}`, await getTranslatedLocales(slug)),
    openGraph: {
      type: "article",
      siteName: siteConfig.name,
      title: post.meta.title,
      description: post.meta.description,
      publishedTime: post.meta.date,
      ...openGraphLocale(locale),
    },
  };
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPost(locale, slug);
  if (!post) notFound();

  const t = await getTranslations("Blog");
  const format = await getFormatter();
  const { Content, meta } = post;

  return (
    <article className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-16">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <BackArrowIcon width={16} height={16} />
        {t("allPosts")}
      </Link>

      <header className="mt-8 border-b border-line pb-8">
        <time dateTime={meta.date} className="text-sm text-muted">
          {format.dateTime(new Date(meta.date), { dateStyle: "long" })}
        </time>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">{meta.title}</h1>
        <p className="mt-4 text-lg text-muted">{meta.description}</p>
      </header>

      <div className="prose mt-10">
        <Content />
      </div>
    </article>
  );
}
