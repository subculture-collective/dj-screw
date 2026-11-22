import type { ArchiveFile } from "./archive";
import { readableEscapes } from "./recording-text";

// Display only. Source titles, filenames and identifiers stay unchanged.

export type TapeLabel = {
  // "Chapter 042", "Volume II", or "" when the title names no series entry.
  series: string;
  // Chapter number for ordering, when there is one.
  chapter?: number;
  name: string;
  year: string;
  // A source format note in the title, such as "FLAC".
  format: string;
};

const quotes = (text: string) => text.replace(/`/g, "’");

// Titles in the DJ Screw discography read
// "DJ Screw - Chapter 042. Popped Up Smoked Up (1996)" or
// "DJ Screw - Volume II. All Screwed Up (1995) [FLAC]".
export function tapeLabel(title: string, date = ""): TapeLabel {
  let rest = readableEscapes(title).replace(/\s+/g, " ").trim();
  rest = rest.replace(
    /^(?:lil\s+)?dj\s+screw(?:\s*&\s*the\s+screwed\s+up\s+click)?\s*[-–:]\s*/i,
    "",
  );
  let format = "";
  rest = rest.replace(/\s*[[(](FLAC|MP3|WAV)[\])]\s*$/i, (_, note: string) => {
    format = note.toUpperCase();
    return "";
  });
  let year = "";
  rest = rest.replace(/\s*\(((?:19|20)\d{2})\)\s*$/, (_, found: string) => {
    year = found;
    return "";
  });
  year ||= date.match(/^(?:19|20)\d{2}/)?.[0] || "";
  let series = "";
  let chapter: number | undefined;
  const numbered = rest.match(/^(?:\d+\s+)?chapter\s+(\d{1,3})\s*(?:[.:-]\s*)?(.*)$/i);
  const volume = rest.match(/^(volume|vol\.)\s+([ivxlc\d]+)\s*(?:[.:-]\s*)?(.*)$/i);
  if (numbered) {
    chapter = Number(numbered[1]);
    series = `Chapter ${numbered[1].padStart(3, "0")}`;
    rest = numbered[2];
  } else if (volume) {
    series = `Volume ${volume[2].toUpperCase()}`;
    rest = volume[3];
  }
  return { series, chapter, name: quotes(rest.trim()) || series, year, format };
}

export type TrackCredit = {
  // "A", "B" and so on for tape sides; "" when the file names no side.
  side: string;
  performer: string;
  song: string;
};

// Discography files are numbered by side: "101. Luniz - I Got 5 On It.mp3"
// is side A, track 1; "201." starts side B. Other numbering has no side.
export function trackCredit(track: ArchiveFile, display: string): TrackCredit {
  const file = readableEscapes(track.name.split("/").at(-1) || "");
  const sideNumber = file.match(/^([1-4])(\d{2})\s*[.)_-]\s+/)?.[1];
  const side = sideNumber ? String.fromCharCode(64 + Number(sideNumber)) : "";
  // The source title often drops the performer that the filename keeps:
  // title "What That Mail Like", file "101. Spice 1 - What That Mail Like.mp3".
  const stem = file
    .replace(/\.[a-z0-9]{2,4}$/i, "")
    .replace(/^\d{1,3}\s*[.)_-]\s+/, "");
  const parts =
    display.match(/^(.+?)\s+[-–]\s+(.+)$/) ||
    stem.match(/^(.+?)\s+[-–]\s+(.+)$/);
  if (!parts) return { side, performer: "", song: quotes(display) };
  const fromFile = !display.match(/\s[-–]\s/);
  return {
    side,
    performer: quotes(parts[1].trim()),
    song: quotes(fromFile ? display : parts[2].trim()),
  };
}

// Internet Archive gives MP3 lengths in seconds ("504.4"); show "8:24".
export function trackLength(length: string | undefined): string {
  if (!length || !/^\d+(?:\.\d+)?$/.test(length)) return length || "";
  const total = Math.round(Number(length));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}

// Releases that are a numbered chapter under another title. Each was matched
// by comparing its track list and running time with the chapter's on
// 2026-11-21 (docs/research/chapter-dates.md). Releases that only share some
// songs with a chapter are not listed.
export const chapterReissues: Readonly<Record<string, number>> = {
  // "Next Episode" (2004): Chapter 015's thirteen songs, same order, 103.2 min.
  "20200531_20200531_0159": 15,
  // "N 2 Deep" (2004): Chapter 019 split into fewer tracks, 101.8 vs 102.0 min.
  "20200531_20200531_0144": 19,
};

// A tape's place in the chapter series: 0 when it has no chapter number.
export type ShelfChapter = { number: number; reissue: boolean };
export function shelfChapter(identifier: string, title: string): ShelfChapter {
  const reissue = chapterReissues[identifier];
  if (reissue !== undefined) return { number: reissue, reissue: true };
  return { number: tapeLabel(title).chapter ?? 0, reissue: false };
}
export const chapterNumber = (number: number) => String(number).padStart(3, "0");
