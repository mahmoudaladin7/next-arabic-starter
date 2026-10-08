"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const t = useTranslations("Header");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
    >
      {/* Both icons render on the server; CSS picks one, so there is no flash or hydration mismatch. */}
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
      <span className="sr-only">{t("toggleTheme")}</span>
    </button>
  );
}
