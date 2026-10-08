import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  // `[locale]` is a root param, so any Server Component can read it without
  // prop drilling, and pages stay statically rendered.
  // `explicitLocale` is set when you call e.g. getTranslations({ locale }),
  // which you need in Server Actions and Route Handlers.
  let locale = explicitLocale;

  if (!locale) {
    const candidate = await rootParams.locale();
    if (!hasLocale(routing.locales, candidate)) notFound();
    locale = candidate;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "Asia/Riyadh",
  };
});
