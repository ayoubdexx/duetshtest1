/**
 * Decodes committed .b64 asset companions (audio, icons) back into their
 * binary form. Runs automatically via postinstall; no-ops when there is
 * nothing to decode (e.g. when binaries are already present).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = join(ROOT, "public");

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

let decoded = 0;
for (const file of walk(PUBLIC_DIR)) {
  if (!file.endsWith(".b64")) continue;
  const target = file.slice(0, -4);
  if (existsSync(target)) continue;
  writeFileSync(target, Buffer.from(readFileSync(file, "utf8"), "base64"));
  decoded++;
}

if (decoded > 0) console.log(`[decode-assets] decoded ${decoded} binary asset(s)`);
