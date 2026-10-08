import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ogSize, renderOgImage } from "@/lib/og/og-image";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "next-arabic-starter";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// The share image for every page that doesn't define its own.
// Image routes are Route Handlers, where next-intl can't read the locale by
// itself yet, so it's taken from params and passed explicitly.
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return renderOgImage({
    locale,
    title: t("ogTitle"),
    description: t("description"),
  });
}
