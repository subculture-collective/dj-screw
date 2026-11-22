import type { RecordingArtwork } from "./artwork";
import covers from "./covers.json";

// Front covers imported by scripts/import-covers.ts. Tapes that share a cover
// share one file. A tape missing from the manifest falls back to the
// Internet Archive file (recording page) or the generated cover (list).
const manifest: Readonly<Record<string, string>> = covers;

export function hostedCover(
  id: string,
  size: "thumb" | "large",
): RecordingArtwork | undefined {
  const hash = Object.hasOwn(manifest, id) ? manifest[id] : undefined;
  if (!hash) return undefined;
  const file = size === "thumb" ? `${hash}-96.webp` : `${hash}.webp`;
  return {
    file,
    url: `/covers/${file}`,
    source: `https://archive.org/details/${encodeURIComponent(id)}`,
  };
}
