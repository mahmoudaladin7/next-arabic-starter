"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyCommand({ command }: { command: string }) {
  const t = useTranslations("Home");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be blocked; the command is still selectable.
    }
  }

  return (
    // Terminal commands are always left-to-right, even on Arabic pages.
    <div
      dir="ltr"
      className="flex max-w-full items-center gap-3 rounded-xl border border-line bg-surface py-2 pe-2 ps-4 font-mono text-[13px] sm:text-sm"
    >
      <span aria-hidden className="select-none text-saffron">
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-1">{command}</code>
      <button
        type="button"
        onClick={copy}
        className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-paper hover:text-ink"
      >
        {copied ? <CheckIcon className="text-lapis" /> : <CopyIcon />}
        <span className="sr-only" aria-live="polite">
          {copied ? t("copied") : t("copyCommand")}
        </span>
      </button>
    </div>
  );
}
