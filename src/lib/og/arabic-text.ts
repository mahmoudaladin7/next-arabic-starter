/**
 * Arabic text for Open Graph images.
 *
 * `next/og` (Satori) draws text without a full bidi or shaping engine, so
 * Arabic comes out wrong in two ways: words are laid out left to right, and
 * word widths are measured before the letters are joined, which leaves
 * uneven gaps. This file works around both:
 *
 * 1. Each Arabic word is converted to its joined "presentation forms"
 *    (the glyph each letter takes at the start, middle or end of a word),
 *    so the width Satori measures matches what it draws.
 * 2. Letters are put in visual order, and the caller lays the words out
 *    right to left with `flex-direction: row-reverse`.
 *
 * Latin words and numbers inside Arabic text keep their own order.
 * This covers Arabic letters plus the common Persian and Urdu ones. It does not handle every
 * bidi edge case, but it's enough for titles and short descriptions.
 */

// [isolated, final, initial, medial]. Two entries = the letter only joins to the previous one.
const FORMS: Record<number, number[]> = {
  0x0621: [0xfe80],
  0x0622: [0xfe81, 0xfe82],
  0x0623: [0xfe83, 0xfe84],
  0x0624: [0xfe85, 0xfe86],
  0x0625: [0xfe87, 0xfe88],
  0x0626: [0xfe89, 0xfe8a, 0xfe8b, 0xfe8c],
  0x0627: [0xfe8d, 0xfe8e],
  0x0628: [0xfe8f, 0xfe90, 0xfe91, 0xfe92],
  0x0629: [0xfe93, 0xfe94],
  0x062a: [0xfe95, 0xfe96, 0xfe97, 0xfe98],
  0x062b: [0xfe99, 0xfe9a, 0xfe9b, 0xfe9c],
  0x062c: [0xfe9d, 0xfe9e, 0xfe9f, 0xfea0],
  0x062d: [0xfea1, 0xfea2, 0xfea3, 0xfea4],
  0x062e: [0xfea5, 0xfea6, 0xfea7, 0xfea8],
  0x062f: [0xfea9, 0xfeaa],
  0x0630: [0xfeab, 0xfeac],
  0x0631: [0xfead, 0xfeae],
  0x0632: [0xfeaf, 0xfeb0],
  0x0633: [0xfeb1, 0xfeb2, 0xfeb3, 0xfeb4],
  0x0634: [0xfeb5, 0xfeb6, 0xfeb7, 0xfeb8],
  0x0635: [0xfeb9, 0xfeba, 0xfebb, 0xfebc],
  0x0636: [0xfebd, 0xfebe, 0xfebf, 0xfec0],
  0x0637: [0xfec1, 0xfec2, 0xfec3, 0xfec4],
  0x0638: [0xfec5, 0xfec6, 0xfec7, 0xfec8],
  0x0639: [0xfec9, 0xfeca, 0xfecb, 0xfecc],
  0x063a: [0xfecd, 0xfece, 0xfecf, 0xfed0],
  0x0641: [0xfed1, 0xfed2, 0xfed3, 0xfed4],
  0x0642: [0xfed5, 0xfed6, 0xfed7, 0xfed8],
  0x0643: [0xfed9, 0xfeda, 0xfedb, 0xfedc],
  0x0644: [0xfedd, 0xfede, 0xfedf, 0xfee0],
  0x0645: [0xfee1, 0xfee2, 0xfee3, 0xfee4],
  0x0646: [0xfee5, 0xfee6, 0xfee7, 0xfee8],
  0x0647: [0xfee9, 0xfeea, 0xfeeb, 0xfeec],
  0x0648: [0xfeed, 0xfeee],
  0x0649: [0xfeef, 0xfef0],
  0x064a: [0xfef1, 0xfef2, 0xfef3, 0xfef4],
  // Persian and Urdu letters
  0x067e: [0xfb56, 0xfb57, 0xfb58, 0xfb59], // peh
  0x0686: [0xfb7a, 0xfb7b, 0xfb7c, 0xfb7d], // tcheh
  0x0698: [0xfb8a, 0xfb8b], // jeh
  0x06a9: [0xfb8e, 0xfb8f, 0xfb90, 0xfb91], // keheh
  0x06af: [0xfb92, 0xfb93, 0xfb94, 0xfb95], // gaf
  0x06cc: [0xfbfc, 0xfbfd, 0xfbfe, 0xfbff], // farsi yeh
  0x0679: [0xfb66, 0xfb67, 0xfb68, 0xfb69], // tteh
  0x0688: [0xfb88, 0xfb89], // ddal
  0x0691: [0xfb8c, 0xfb8d], // rreh
  0x06ba: [0xfb9e, 0xfb9f], // noon ghunna
  0x06be: [0xfbaa, 0xfbab, 0xfbac, 0xfbad], // heh doachashmee
  0x06c1: [0xfba6, 0xfba7, 0xfba8, 0xfba9], // heh goal
  0x06d2: [0xfbae, 0xfbaf], // yeh barree
};

// Lam followed by alef becomes a single ligature: [isolated, final].
const LAM_ALEF: Record<number, number[]> = {
  0x0622: [0xfef5, 0xfef6],
  0x0623: [0xfef7, 0xfef8],
  0x0625: [0xfef9, 0xfefa],
  0x0627: [0xfefb, 0xfefc],
};

const LAM = 0x0644;
const TATWEEL = 0x0640;
const MIRRORED: Record<string, string> = { "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<", "«": "»", "»": "«" };

const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const LATIN_OR_DIGIT = /[A-Za-z0-9À-ɏ]/;
// Digits plus the Arabic decimal and thousands separators (٫ ٬), kept together as one number.
const NUMERIC = /[0-9٠-٬۰-۹]/;

const isMark = (c: number) => (c >= 0x064b && c <= 0x065f) || c === 0x0670 || (c >= 0x06d6 && c <= 0x06ed);
const joinsForward = (c?: number) => c === TATWEEL || (c !== undefined && FORMS[c]?.length === 4);
const joinsBackward = (c?: number) => c === TATWEEL || (c !== undefined && (FORMS[c]?.length ?? 0) >= 2);

/** Replace each Arabic letter with its joined form. Output is still in logical order. */
export function joinLetters(text: string): string {
  const cps = Array.from(text, (ch) => ch.codePointAt(0)!);
  const out: number[] = [];
  let prevWasLamAlef = false;

  const neighbour = (i: number, step: 1 | -1) => {
    for (let j = i + step; j >= 0 && j < cps.length; j += step) if (!isMark(cps[j])) return cps[j];
    return undefined;
  };

  for (let i = 0; i < cps.length; i++) {
    const c = cps[i];
    const forms = FORMS[c];
    if (!forms) {
      out.push(c);
      if (!isMark(c)) prevWasLamAlef = false;
      continue;
    }

    const joinedToPrev = !prevWasLamAlef && joinsForward(neighbour(i, -1));

    if (c === LAM) {
      let j = i + 1;
      const marks: number[] = [];
      while (j < cps.length && isMark(cps[j])) marks.push(cps[j++]);
      const ligature = LAM_ALEF[cps[j]];
      if (ligature) {
        out.push(ligature[joinedToPrev ? 1 : 0], ...marks);
        i = j;
        prevWasLamAlef = true;
        continue;
      }
    }

    const joinedToNext = joinsForward(c) && joinsBackward(neighbour(i, 1));
    const [isolated, final = isolated, initial = isolated, medial = final] = forms;
    // Many fonts skip the isolated presentation forms of the Persian and Urdu
    // letters (U+FBxx), so those keep their base code point when they stand alone.
    const alone = isolated >= 0xfe70 ? isolated : c;
    out.push(joinedToPrev && joinedToNext ? medial : joinedToPrev ? final : joinedToNext ? initial : alone);
    prevWasLamAlef = false;
  }

  return String.fromCodePoint(...out);
}

/** Reverse a joined Arabic segment into visual order, keeping marks on their letters and numbers readable. */
function toVisualOrder(segment: string): string {
  const clusters: { base: string; marks: string }[] = [];
  for (const ch of segment) {
    const last = clusters.at(-1);
    if (isMark(ch.codePointAt(0)!) && last) last.marks += ch;
    else if (last && NUMERIC.test(ch) && NUMERIC.test(last.base.slice(-1))) last.base += ch;
    else clusters.push({ base: MIRRORED[ch] ?? ch, marks: "" });
  }
  // Without mark positioning, a diacritic sits best when it's drawn just before its letter.
  return clusters
    .reverse()
    .map((c) => c.marks + c.base)
    .join("");
}

export type TextPiece = { dir: "rtl" | "ltr"; text: string };
/** One word (or a run of Latin words), split into same-direction pieces. */
export type TextRun = TextPiece[];

/**
 * Split right-to-left text into runs ready to draw.
 * Lay the runs out with `flex-direction: row-reverse; flex-wrap: wrap`,
 * and the pieces inside each run with `flex-direction: row-reverse`.
 */
export function layoutRtl(text: string): TextRun[] {
  const runs: TextRun[] = [];

  const words = text.trim().split(/\s+/).filter(Boolean);
  const isLatin = (w?: string) => w !== undefined && !ARABIC.test(w) && LATIN_OR_DIGIT.test(w);

  for (const [i, word] of words.entries()) {
    if (!ARABIC.test(word)) {
      const prev = runs.at(-1);
      const prevIsLatin = prev?.length === 1 && prev[0].dir === "ltr";
      // Keep consecutive Latin words together so they read left to right.
      // Punctuation between two Latin words ("Next.js — React") joins them too.
      if (prevIsLatin && (isLatin(word) || isLatin(words[i + 1]))) {
        prev[0].text += ` ${word}`;
      } else {
        runs.push([{ dir: isLatin(word) ? "ltr" : "rtl", text: word }]);
      }
      continue;
    }

    // Arabic word, possibly with Latin glued to it ("Next.js،").
    const pieces: TextPiece[] = [];
    for (const match of word.matchAll(/[A-Za-z0-9À-ɏ](?:[A-Za-z0-9À-ɏ._\-/:@#+]*[A-Za-z0-9À-ɏ])?|[^A-Za-z0-9À-ɏ]+/g)) {
      const part = match[0];
      pieces.push(
        LATIN_OR_DIGIT.test(part) ? { dir: "ltr", text: part } : { dir: "rtl", text: toVisualOrder(joinLetters(part)) },
      );
    }
    runs.push(pieces);
  }

  return runs;
}
