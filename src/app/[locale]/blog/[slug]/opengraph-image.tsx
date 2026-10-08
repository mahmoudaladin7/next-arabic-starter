import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getPost, getPosts } from "@/lib/blog";
import { ogSize, renderOgImage } from "@/lib/og/og-image";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Blog post";

export async function generateStaticParams() {
  const all = await Promise.all(
    routing.locales.map(async (locale) => {
      const posts = await getPosts(locale);
      // Placeholder for a language with no posts yet (see the post page).
      return posts.length ? posts.map((p) => ({ locale, slug: p.slug })) : [{ locale, slug: "_" }];
    }),
  );
  return all.flat();
}

// Each post gets its own share image with its title.
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const post = await getPost(locale, slug);
  if (!post) notFound();
  const t = await getTranslations({ locale, namespace: "Blog" });

  return renderOgImage({
    locale,
    label: t("title"),
    title: post.meta.title,
    description: post.meta.description,
  });
}
