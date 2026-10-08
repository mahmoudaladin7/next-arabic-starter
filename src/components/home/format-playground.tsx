"use client";

import {
  NextIntlClientProvider,
  useFormatter,
  useLocale,
  useTranslations,
  type AbstractIntlMessages,
} from "next-intl";
import { useState } from "react";
import { localeMeta, routing, type Locale } from "@/i18n/routing";

// A fixed reference date keeps server and client output identical.
// 20 March 2026 is 1 Shawwal 1447 (Eid al-Fitr).
const TODAY = new Date("2026-03-20T12:00:00+03:00");
const DAY = 24 * 60 * 60 * 1000;
const PRESETS = [0, 1, 2, 3, 11, 100];

type Props = {
  /** The `Format` messages for every locale, so all columns can render at once. */
  messages: Record<Locale, AbstractIntlMessages>;
};

export function FormatPlayground({ messages }: Props) {
  const t = useTranslations("Format");
  const current = useLocale();
  const [count, setCount] = useState(3);
  const [arabicDigits, setArabicDigits] = useState(false);
  const locales = [current, ...routing.locales.filter((l) => l !== current)];

  const rows = [
    { key: "pluralForm", label: t("pluralForm") },
    { key: "posts", label: t("sentence") },
    { key: "price", label: t("price") },
    { key: "relative", label: t("relative") },
    { key: "date", label: t("date") },
    { key: "hijri", label: t("hijri") },
  ] as const;

  return (
    <div className="rounded-2xl border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-line p-4 sm:p-5">
        <div className="flex items-center gap-1" role="group" aria-label={t("count")}>
          <StepButton label={t("decrease")} onClick={() => setCount((c) => Math.max(0, c - 1))}>
            −
          </StepButton>
          <output aria-live="polite" className="w-14 text-center text-2xl font-semibold tabular-nums">
            {count}
          </output>
          <StepButton label={t("increase")} onClick={() => setCount((c) => c + 1)}>
            +
          </StepButton>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCount(n)}
              aria-pressed={count === n}
              className="min-w-10 rounded-full border border-line px-3 py-1 text-sm tabular-nums transition-colors hover:border-lapis aria-pressed:border-lapis aria-pressed:bg-lapis aria-pressed:text-on-lapis"
            >
              {n}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm sm:ms-auto">
          <input
            type="checkbox"
            checked={arabicDigits}
            onChange={(e) => setArabicDigits(e.target.checked)}
            className="size-4 accent-lapis"
          />
          {t("digits")}
          <span lang="ar" className="text-muted">
            ٠١٢٣
          </span>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm sm:text-base">
          <thead>
            <tr className="text-muted">
              <td className="w-[28%] p-4 sm:p-5" />
              {locales.map((l) => (
                <th key={l} scope="col" lang={l} dir={localeMeta[l].dir} className="p-4 text-start text-sm font-medium sm:p-5">
                  {localeMeta[l].nativeName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-line">
                <th scope="row" className="p-4 text-start align-baseline text-sm font-normal text-muted sm:p-5">
                  {row.label}
                </th>
                {locales.map((l) => (
                  <td key={l} lang={l} dir={localeMeta[l].dir} className="p-4 text-start align-baseline sm:p-5">
                    {/* Each column gets its own provider, so the same hooks format in that language.
                        `-u-nu-arab` is a standard locale extension that switches to Arabic-Indic digits. */}
                    <NextIntlClientProvider
                      // next-intl accepts any BCP 47 tag at runtime; its type only lists the route locales.
                      locale={(arabicDigits && l === "ar" ? "ar-u-nu-arab" : l) as Locale}
                      messages={{ Format: messages[l] }}
                      timeZone="Asia/Riyadh"
                    >
                      {/* Browsers ship slightly different locale data than Node, so the
                          text can differ from the server render. That's expected here. */}
                      <span suppressHydrationWarning>
                        <Cell row={row.key} count={count} />
                      </span>
                    </NextIntlClientProvider>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({ row, count }: { row: string; count: number }) {
  const t = useTranslations("Format");
  const format = useFormatter();
  const locale = useLocale();
  const date = new Date(TODAY.getTime() - count * DAY);

  switch (row) {
    case "pluralForm":
      return <code className="font-mono text-sm text-lapis">{new Intl.PluralRules(locale).select(count)}</code>;
    case "posts":
      return t("posts", { count });
    case "price":
      return format.number(count * 999, { style: "currency", currency: "SAR" });
    case "relative":
      // For whole days, `numeric: "auto"` gives natural phrases like "yesterday" / "أمس" and "أول أمس".
      // next-intl's format.relativeTime() always uses numbers, so this row calls Intl directly.
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-count, "day");
    case "date":
      return format.dateTime(date, { dateStyle: "long" });
    case "hijri":
      // Umm al-Qura is the official Saudi Hijri calendar. next-intl's types don't list it yet,
      // so this row calls Intl directly. The output is the same.
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        calendar: "islamic-umalqura",
        timeZone: "Asia/Riyadh",
      }).format(date);
    default:
      return null;
  }
}

function StepButton({ label, onClick, children }: { label: string; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-line text-lg transition-colors hover:border-lapis hover:text-lapis"
    >
      {children}
    </button>
  );
}
