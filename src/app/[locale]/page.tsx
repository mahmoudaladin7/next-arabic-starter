import { getFormatter, getLocale, getMessages, getTranslations } from "next-intl/server";
import { CopyCommand } from "@/components/copy-command";
import { FormatPlayground } from "@/components/home/format-playground";
import { MirrorDemo } from "@/components/home/mirror-demo";
import { ForwardArrowIcon, GitHubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getPosts } from "@/lib/blog";
import { richTags } from "@/lib/rich";

const CREATE_COMMAND = `npx create-next-app@latest my-site -e ${siteConfig.repo}`;

// Paths are shown next to each feature so people know where to look.
const FEATURES = [
  { key: "routing", path: "src/i18n/routing.ts" },
  { key: "rtl", path: "src/app/[locale]/layout.tsx" },
  { key: "fonts", path: "src/lib/fonts.ts" },
  { key: "formatting", path: "messages/*.json" },
  { key: "switcher", path: "src/components/locale-switcher.tsx" },
  { key: "darkMode", path: "src/components/theme-toggle.tsx" },
  { key: "seo", path: "src/app/sitemap.ts" },
  { key: "og", path: "src/lib/og/" },
  { key: "blog", path: "src/content/blog/" },
  { key: "types", path: "scripts/check-messages.mjs" },
  { key: "agents", path: "AGENTS.md" },
] as const;

const STEPS = ["create", "customize", "content", "deploy"] as const;

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("Home");
  const format = await getFormatter();
  const posts = (await getPosts(locale)).slice(0, 2);

  // The formatting demo shows every language at once, so it needs all of their messages.
  const allMessages = await Promise.all(routing.locales.map((l) => getMessages({ locale: l })));
  const formatMessages = Object.fromEntries(
    routing.locales.map((l, i) => [l, allMessages[i].Format]),
  ) as Record<(typeof routing.locales)[number], (typeof allMessages)[number]["Format"]>;

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-16">
        <h1 className="font-display leading-[1.02]">
          {/* These two lines are pinned to physical edges on purpose: Arabic hugs
              the right, English hugs the left, in both languages of the page. */}
          <span lang="ar" dir="rtl" className="block text-right text-[clamp(3.5rem,13vw,10rem)] font-bold">
            موقع واحد،
          </span>
          <span
            lang="en"
            dir="ltr"
            className="mt-[0.15em] block text-left text-[clamp(2.6rem,9.6vw,7.75rem)] font-semibold tracking-[-0.02em] [font-stretch:85%]"
          >
            two directions.
          </span>
        </h1>

        <div className="mt-10 max-w-xl sm:mt-14">
          <p className="text-lg text-muted sm:text-xl">{t("intro")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`${siteConfig.repo}/generate`}
              className="inline-flex items-center gap-2 rounded-full bg-lapis px-5 py-3 font-medium text-on-lapis transition-opacity hover:opacity-90"
            >
              {t("useTemplate")}
              <ForwardArrowIcon width={18} height={18} />
            </a>
            <a
              href={siteConfig.repo}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-medium transition-colors hover:bg-surface"
            >
              <GitHubIcon width={18} height={18} />
              {t("viewOnGithub")}
            </a>
          </div>
          <div className="mt-5">
            <CopyCommand command={CREATE_COMMAND} />
          </div>
        </div>
      </section>

      {/* Mirror */}
      <Section title={t("mirror.title")} body={t.rich("mirror.body", richTags)}>
        <MirrorDemo />
      </Section>

      {/* Formatting */}
      <Section title={t("format.title")} body={t("format.body")}>
        <FormatPlayground messages={formatMessages} />
      </Section>

      {/* Features */}
      <Section title={t("features.title")}>
        <ul className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
          {FEATURES.map(({ key, path }) => (
            <li key={key} className="border-t border-line py-5">
              <h3 className="font-semibold">{t(`features.${key}.title`)}</h3>
              <p className="mt-1 text-muted">{t.rich(`features.${key}.body`, richTags)}</p>
              <p className="mt-2 font-mono text-xs text-muted">
                {/* dir="ltr" keeps the path readable inside Arabic text. */}
                <span dir="ltr">{path}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Blog */}
      {posts.length > 0 && (
        <Section title={t("blog.title")}>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-line p-6 transition-colors hover:border-lapis"
                >
                  <time dateTime={post.date} className="text-sm text-muted">
                    {format.dateTime(new Date(post.date), { dateStyle: "long" })}
                  </time>
                  <h3 className="mt-2 font-display text-xl font-semibold group-hover:text-lapis">{post.title}</h3>
                  <p className="mt-2 text-muted">{post.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog" className="mt-6 inline-flex items-center gap-2 font-medium text-lapis">
            {t("blog.all")}
            <ForwardArrowIcon width={16} height={16} />
          </Link>
        </Section>
      )}

      {/* Get started */}
      <Section title={t("start.title")}>
        <ol className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line font-semibold tabular-nums text-lapis">
                {format.number(i + 1)}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{t(`start.${step}.title`)}</h3>
                <p className="mt-1 text-muted">{t.rich(`start.${step}.body`, richTags)}</p>
                {step === "create" && (
                  <div className="mt-3">
                    <CopyCommand command={CREATE_COMMAND} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

function Section({
  title,
  body,
  children,
}: {
  title: string;
  body?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-4 sm:mt-32 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
        {body && <p className="mt-3 text-muted sm:text-lg">{body}</p>}
      </div>
      {children}
    </section>
  );
}
