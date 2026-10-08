import type { routing } from "@/i18n/routing";
import type messages from "../messages/en.json";

// Makes translation keys type-safe: t("Home.typo") is a type error.
// English is the reference; `npm run check:i18n` makes sure Arabic has the same keys.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
