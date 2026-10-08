import { getTranslations } from "next-intl/server";
import { BackArrowIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <title>{t("title")}</title>
      <p className="font-display text-7xl font-bold text-lapis">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-muted">{t("body")}</p>
      <Link href="/" className="mt-8 inline-flex items-center gap-2 font-medium text-lapis">
        <BackArrowIcon width={16} height={16} />
        {t("home")}
      </Link>
    </div>
  );
}
