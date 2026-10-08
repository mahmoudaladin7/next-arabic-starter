import type { Metadata } from "next";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPosts } from "@/lib/blog";
import { alternates } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Blog");
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale, "/blog"),
  };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getTranslations("Blog");
  const format = await getFormatter();
  const posts = await getPosts(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-20">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
      <p className="mt-3 text-lg text-muted">{t("description")}</p>

      {posts.length === 0 ? (
        <p className="mt-12 text-muted">{t("empty")}</p>
      ) : (
        <ul className="mt-12">
          {posts.map((post) => (
            <li key={post.slug} className="border-t border-line">
              <Link href={`/blog/${post.slug}`} className="group block py-7">
                <time dateTime={post.date} className="text-sm text-muted">
                  {format.dateTime(new Date(post.date), { dateStyle: "long" })}
                </time>
                <h2 className="mt-1 font-display text-2xl font-semibold group-hover:text-lapis">{post.title}</h2>
                <p className="mt-2 text-muted">{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
