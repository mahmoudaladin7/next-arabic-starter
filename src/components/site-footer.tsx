import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";

export async function SiteFooter() {
  const locale = await getLocale();
  const t = await getTranslations("Footer");

  return (
    <footer className="mx-auto mt-24 w-full max-w-6xl border-t border-line px-4 py-8 text-sm text-muted sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <p>
          {t.rich("builtBy", {
            author: (chunks) => (
              <a href={siteConfig.author.url} className="text-ink underline underline-offset-4">
                {chunks}
              </a>
            ),
            name: siteConfig.author.name[locale],
          })}
        </p>
        <p>
          {t.rich("license", {
            link: (chunks) => (
              <a href={`${siteConfig.repo}/blob/main/LICENSE`} className="text-ink underline underline-offset-4">
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </footer>
  );
}
