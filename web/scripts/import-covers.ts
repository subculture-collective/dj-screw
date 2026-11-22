// Import a small cover thumbnail for every tape in the collection.
//
//   node web/scripts/import-covers.ts            # only tapes without a thumbnail
//   node web/scripts/import-covers.ts --refresh  # every tape
//
// It picks each cover with the same rule as the recording page
// (src/artwork.ts), downloads it from Internet Archive and writes a 96px square
// WebP to public/covers/<identifier>.webp. It needs cwebp and webpinfo
// (libwebp) on PATH. The list falls back to the generated J-card cover when a
// thumbnail is missing.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { recordingArtwork } from "../src/artwork.ts";
import { brand } from "../src/brand.ts";

const size = 96;
const out = join(import.meta.dirname, "..", "public", "covers");
const refresh = process.argv.includes("--refresh");
const headers = { "User-Agent": "woodroom-cover-import/1.0" };

async function json(url: string) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

const search = await json(
  `https://archive.org/advancedsearch.php?q=collection%3A${encodeURIComponent(brand.collection)}&fl%5B%5D=identifier&rows=10000&output=json`,
);
const ids: string[] = search.response.docs.map((doc: { identifier: string }) => doc.identifier);
mkdirSync(out, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "woodroom-covers-"));
let written = 0;
const missing: string[] = [];
try {
  for (const id of ids) {
    const target = join(out, `${id}.webp`);
    if (!refresh && existsSync(target)) continue;
    const { result } = await json(`https://archive.org/metadata/${encodeURIComponent(id)}/files`);
    const artwork = recordingArtwork(id, result ?? []);
    if (!artwork) {
      missing.push(id);
      continue;
    }
    const response = await fetch(artwork.url, { headers });
    if (!response.ok) {
      missing.push(id);
      continue;
    }
    const original = join(work, "original");
    const full = join(work, "full.webp");
    writeFileSync(original, Buffer.from(await response.arrayBuffer()));
    // Read the dimensions, crop the centre square, then scale it down.
    execFileSync("cwebp", ["-quiet", "-q", "1", "-m", "0", original, "-o", full]);
    const info = execFileSync("webpinfo", [full], { encoding: "utf8" });
    const width = Number(/Width:\s*(\d+)/.exec(info)?.[1]);
    const height = Number(/Height:\s*(\d+)/.exec(info)?.[1]);
    const side = Math.min(width, height);
    const crop = [Math.floor((width - side) / 2), Math.floor((height - side) / 2), side, side];
    execFileSync("cwebp", [
      "-quiet", "-q", "80", "-m", "6",
      "-crop", ...crop.map(String),
      "-resize", String(size), String(size),
      original, "-o", target,
    ]);
    written += 1;
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
console.log(`${written} written, ${ids.length} tapes, ${missing.length} without a cover`);
if (missing.length) console.log(missing.join("\n"));
