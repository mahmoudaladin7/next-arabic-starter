#!/usr/bin/env node
// Compares every messages/*.json file against messages/en.json and lists
// keys that are missing or extra. Exits with 1 if anything is off.
//
//   npm run check:i18n

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = fileURLToPath(new URL("../messages", import.meta.url));
const REFERENCE = "en.json";

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === "object" ? flatten(value, path) : [path];
  });
}

const read = (file) => JSON.parse(readFileSync(join(DIR, file), "utf8"));
const reference = new Set(flatten(read(REFERENCE)));
let failed = false;

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json") && f !== REFERENCE)) {
  const keys = new Set(flatten(read(file)));
  const missing = [...reference].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !reference.has(k));

  if (missing.length === 0 && extra.length === 0) {
    console.log(`✓ ${file}`);
    continue;
  }

  failed = true;
  console.log(`✗ ${file}`);
  for (const k of missing) console.log(`  missing: ${k}`);
  for (const k of extra) console.log(`  extra:   ${k}`);
}

process.exit(failed ? 1 : 0);
