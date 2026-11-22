// Import every tape's front cover into the site.
//
//   node web/scripts/import-covers.ts
//
// It picks each cover with the same rule as the recording page
// (src/artwork.ts). Many tapes share a byte-identical cover, so each distinct
// image is stored once under its Internet Archive MD5 (first 12 characters):
// public/covers/<hash>.webp at up to 1200px for the recording page and
// public/covers/<hash>-96.webp, a square crop for the list. src/covers.json maps
// each identifier to its hash. Images already on disk are not downloaded again.
// It needs cwebp and webpinfo (libwebp) on PATH.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { recordingArtwork } from "../src/artwork.ts";
import { brand } from "../src/brand.ts";

const thumb = 96;
const large = 1200;
const web = join(import.meta.dirname, "..");
const out = join(web, "public", "covers");
const headers = { "User-Agent": "woodroom-cover-import/1.0" };

async function get(url: string) {
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(url, { headers }).catch((error) => error as Error);
    if (response instanceof Response && response.ok) return response;
    if (attempt === 3)
      throw new Error(`${url}: ${response instanceof Response ? response.status : response.message}`);
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
  }
}

const search = await (
  await get(
    `https://archive.org/advancedsearch.php?q=collection%3A${encodeURIComponent(brand.collection)}&fl%5B%5D=identifier&rows=10000&output=json`,
  )
).json();
const ids: string[] = search.response.docs.map((doc: { identifier: string }) => doc.identifier).sort();
mkdirSync(out, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "woodroom-covers-"));
const manifest: Record<string, string> = {};
const missing: string[] = [];
let written = 0;
try {
  for (const id of ids) {
    const { result = [] } = await (await get(`https://archive.org/metadata/${encodeURIComponent(id)}/files`)).json();
    const artwork = recordingArtwork(id, result);
    const md5 = result.find((file: { name: string }) => file.name === artwork?.file)?.md5;
    if (!artwork || !/^[0-9a-f]{32}$/.test(md5 ?? "")) {
      missing.push(id);
      continue;
    }
    const hash = md5.slice(0, 12);
    manifest[id] = hash;
    if (existsSync(join(out, `${hash}.webp`)) && existsSync(join(out, `${hash}-${thumb}.webp`))) continue;
    const original = join(work, "original");
    const probe = join(work, "probe.webp");
    writeFileSync(original, Buffer.from(await (await get(artwork.url)).arrayBuffer()));
    // A fast low-quality encode tells us the dimensions.
    execFileSync("cwebp", ["-quiet", "-q", "1", "-m", "0", original, "-o", probe]);
    const info = execFileSync("webpinfo", [probe], { encoding: "utf8" });
    const width = Number(/Width:\s*(\d+)/.exec(info)?.[1]);
    const height = Number(/Height:\s*(\d+)/.exec(info)?.[1]);
    const scale = Math.min(1, large / Math.max(width, height));
    execFileSync("cwebp", [
      "-quiet", "-q", "85", "-m", "6",
      "-resize", String(Math.round(width * scale)), String(Math.round(height * scale)),
      original, "-o", join(out, `${hash}.webp`),
    ]);
    const side = Math.min(width, height);
    execFileSync("cwebp", [
      "-quiet", "-q", "80", "-m", "6",
      "-crop", String(Math.floor((width - side) / 2)), String(Math.floor((height - side) / 2)), String(side), String(side),
      "-resize", String(thumb), String(thumb),
      original, "-o", join(out, `${hash}-${thumb}.webp`),
    ]);
    written += 1;
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
writeFileSync(join(web, "src", "covers.json"), `${JSON.stringify(manifest, null, 1)}\n`);
console.log(
  `${ids.length} tapes, ${new Set(Object.values(manifest)).size} distinct covers, ${written} written, ${missing.length} without a cover`,
);
if (missing.length) console.log(missing.join("\n"));
