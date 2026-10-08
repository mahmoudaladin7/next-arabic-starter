import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { getDirection, type Locale } from "@/i18n/routing";
import { layoutRtl } from "./arabic-text";

export const ogSize = { width: 1200, height: 630 };

const COLORS = {
  background: "#0d1229",
  text: "#e9ecf5",
  muted: "#9da6c2",
  lapis: "#2c42cf",
  saffron: "#f2b856",
};

// Satori reads .woff/.ttf (not .woff2). IBM Plex Sans Arabic covers Arabic and Latin.
// Cached, so image routes stay static and the files are read once per build.
async function loadFontFiles() {
  "use cache";
  cacheLife("max");
  const dir = join(process.cwd(), "src/fonts/og");
  const names = [
    "ibm-plex-sans-arabic-latin-400.woff",
    "ibm-plex-sans-arabic-latin-700.woff",
    "ibm-plex-sans-arabic-arabic-400.woff",
    "ibm-plex-sans-arabic-arabic-700.woff",
  ];
  return Promise.all(names.map(async (name) => new Uint8Array(await readFile(join(dir, name)))));
}

// The cache may hand back views into a larger buffer, so copy out exactly the font's bytes.
const toArrayBuffer = (bytes: Uint8Array) =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

async function loadFonts() {
  const [latin400, latin700, arabic400, arabic700] = (await loadFontFiles()).map(toArrayBuffer);
  return [
    { name: "Plex Latin", data: latin400, weight: 400 as const },
    { name: "Plex Latin", data: latin700, weight: 700 as const },
    { name: "Plex Arabic", data: arabic400, weight: 400 as const },
    { name: "Plex Arabic", data: arabic700, weight: 700 as const },
  ];
}

/** Text that renders correctly in either direction. */
function OgText({ text, locale, style }: { text: string; locale: Locale; style: React.CSSProperties }) {
  if (getDirection(locale) === "ltr") {
    return <div style={{ display: "flex", width: "100%", ...style }}>{text}</div>;
  }

  // Words flow from the right edge (flex-start in row-reverse) and wrap onto new lines.
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        columnGap: "0.26em",
        width: "100%",
        ...style,
      }}
    >
      {layoutRtl(text).map((run, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "row-reverse" }}>
          {run.map((piece, j) => (
            <span key={j}>{piece.text}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

export async function renderOgImage({
  locale,
  title,
  description,
  label,
}: {
  locale: Locale;
  title: string;
  description?: string;
  /** Small text above the title, e.g. "Blog". */
  label?: string;
}) {
  const rtl = getDirection(locale) === "rtl";
  const align = rtl ? "flex-end" : "flex-start";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: align,
          padding: "64px 72px",
          background: COLORS.background,
          color: COLORS.text,
          fontFamily: "Plex Latin, Plex Arabic",
        }}
      >
        {/* Brand row: logo at the start edge, like the site header. */}
        <div style={{ display: "flex", flexDirection: rtl ? "row-reverse" : "row", alignItems: "center", gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 28 28">
            <rect width="28" height="28" rx="7" fill={COLORS.lapis} />
            <path d="M6 10.5h11m-3.5-3.5 3.5 3.5-3.5 3.5" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 17.5H11m3.5-3.5L11 17.5l3.5 3.5" stroke={COLORS.saffron} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 20 }}>
          {label && <OgText text={label} locale={locale} style={{ fontSize: 28, color: COLORS.saffron, fontWeight: 700 }} />}
          <OgText
            text={title}
            locale={locale}
            style={{ fontSize: title.length > 48 ? 60 : 72, fontWeight: 700, lineHeight: 1.2 }}
          />
          {description && (
            <OgText
              text={description}
              locale={locale}
              style={{ fontSize: 30, color: COLORS.muted, lineHeight: 1.45 }}
            />
          )}
        </div>
      </div>
    ),
    { ...ogSize, fonts: await loadFonts() },
  );
}
