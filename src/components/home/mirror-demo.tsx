import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import { BackArrowIcon, ChevronIcon, ForwardArrowIcon } from "@/components/icons";
import { getDirection, routing, type Locale } from "@/i18n/routing";

/**
 * Renders one component in every language, side by side.
 * Nothing inside <OrderCard> knows which direction it's in.
 */
export async function MirrorDemo() {
  const current = await getLocale();
  const t = await getTranslations("Home.mirror");
  // Current language first, so it sits at the start of the row.
  const locales = [current, ...routing.locales.filter((l) => l !== current)];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {locales.map((locale) => (
        <figure key={locale} className="flex flex-col gap-3">
          <figcaption className="flex items-baseline gap-2 text-sm text-muted">
            {getDirection(locale) === "rtl" ? t("rtl") : t("ltr")}
            {/* No margin here: logical margins on a dir="ltr" element follow its own direction. */}
            <code dir="ltr" className="font-mono text-xs">
              dir=&quot;{getDirection(locale)}&quot;
            </code>
          </figcaption>
          <div lang={locale} dir={getDirection(locale)}>
            <OrderCard locale={locale} />
          </div>
        </figure>
      ))}
    </div>
  );
}

async function OrderCard({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Mirror" });
  const format = await getFormatter({ locale });
  const progress = 0.6;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center gap-1.5 text-sm text-muted">
        <span>{t("home")}</span>
        <ChevronIcon width={14} height={14} />
        <span>{t("orders")}</span>
        <ChevronIcon width={14} height={14} />
        <span className="text-ink">{t("order")}</span>
      </div>

      <div className="mt-5 flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-lapis font-semibold text-on-lapis">
          {t("name").charAt(0)}
        </div>
        <div className="min-w-0 flex-1 text-start">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{t("name")}</span>
            <span className="ms-auto rounded-full bg-saffron/20 px-2 py-0.5 text-xs font-medium text-ink">
              {t("badge")}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">{t("message")}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-sm">
          <span>{t("progress")}</span>
          <span className="tabular-nums">{format.number(progress, { style: "percent" })}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
          {/* A block's width starts from the start edge, so this fills right-to-left in Arabic. */}
          <div className="h-full rounded-full bg-lapis" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm">
          <BackArrowIcon width={16} height={16} />
          {t("previous")}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm text-paper">
          {t("next")}
          <ForwardArrowIcon width={16} height={16} />
        </span>
      </div>
    </div>
  );
}
