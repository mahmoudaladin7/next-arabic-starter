import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import { getDirection, routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { alternates, openGraphLocale } from "@/lib/metadata";
import "../globals.css";

// Prerender every page in every language at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Metadata");

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("title"), template: `%s | ${siteConfig.name}` },
    description: t("description"),
    alternates: alternates(locale, "/"),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      ...openGraphLocale(locale),
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1229" },
  ],
};

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const t = await getTranslations("Header");

  return (
    // `lang` and `dir` on <html> are what make the whole page right-to-left.
    // suppressHydrationWarning: next-themes sets data-theme before React loads.
    <html lang={locale} dir={getDirection(locale)} className={fontVariables} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-lapis focus:px-4 focus:py-2 focus:text-on-lapis"
            >
              {t("skipToContent")}
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
