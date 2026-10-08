import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { GitHubIcon } from "./icons";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

export async function SiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
      <Link href="/" className="flex items-center gap-2.5 font-semibold">
        <Logo />
        <span className="hidden sm:inline">{siteConfig.name}</span>
      </Link>

      <nav aria-label={t("navLabel")} className="ms-2 flex items-center gap-1 text-sm">
        <Link href="/blog" className="rounded-full px-3 py-1.5 text-muted transition-colors hover:text-ink">
          {t("blog")}
        </Link>
      </nav>

      <div className="ms-auto flex items-center gap-1">
        <LocaleSwitcher />
        <ThemeToggle />
        <a
          href={siteConfig.repo}
          className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <GitHubIcon />
          <span className="sr-only">{t("github")}</span>
        </a>
      </div>
    </header>
  );
}

/** Two arrows meeting: one reading from the right, one from the left. */
function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <rect width="28" height="28" rx="7" className="fill-lapis" />
      <path d="M6 10.5h11m-3.5-3.5 3.5 3.5-3.5 3.5" className="stroke-on-lapis" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 17.5H11m3.5-3.5L11 17.5l3.5 3.5" className="stroke-saffron" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
