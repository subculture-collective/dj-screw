import { label } from "./archive";
import type { Recording } from "./archive";
import { chapterNumber, shelfChapter, tapeLabel } from "./tape";

// Sorting and filtering here apply to the recordings already loaded: the
// whole shelf on the browse page, or one page of search results.
export const shelfColumns = ["chapter", "title", "date"] as const;
export type ShelfColumn = (typeof shelfColumns)[number];
export type ShelfSort = { column: ShelfColumn; descending: boolean };

// Which tapes to show: every tape, those in the chapter series, or the
// releases without a chapter number.
export const shelfSeries = ["all", "chapters", "none"] as const;
export type ShelfSeries = (typeof shelfSeries)[number];

// "015" for Chapter 015, "015r" for a reissue of it (sorted after the
// original), "000" for a tape with no chapter.
export function shelfValue(recording: Recording, column: ShelfColumn): string {
  const tape = tapeLabel(label(recording.title), label(recording.date));
  if (column === "chapter") {
    const chapter = shelfChapter(recording.identifier, label(recording.title));
    return chapterNumber(chapter.number) + (chapter.reissue ? "r" : "");
  }
  if (column === "title") return tape.name || recording.identifier;
  return tape.year;
}

// Case and accents do not matter: "beyonce" finds "Beyoncé".
const fold = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

// Every word must appear somewhere in the row. Rows keep their catalog
// position so numbering and ties stay stable; missing values sort last.
export function arrangeShelf(
  items: Recording[],
  filter: string,
  sort?: ShelfSort,
  series: ShelfSeries = "all",
) {
  const terms = fold(filter).split(/\s+/).filter(Boolean);
  const rows = items
    .map((recording, index) => ({ recording, index }))
    .filter(({ recording }) => {
      if (series === "all") return true;
      const numbered = shelfChapter(recording.identifier, label(recording.title)).number > 0;
      return series === "chapters" ? numbered : !numbered;
    })
    .filter(({ recording }) => {
      if (!terms.length) return true;
      const text = fold(
        [
          ...shelfColumns.map((column) => shelfValue(recording, column)),
          tapeLabel(label(recording.title)).series,
        ].join(" "),
      );
      return terms.every((term) => text.includes(term));
    });
  if (!sort) return rows;
  return rows.sort((a, b) => {
    const left = shelfValue(a.recording, sort.column);
    const right = shelfValue(b.recording, sort.column);
    if (!left !== !right) return left ? -1 : 1;
    const order = left.localeCompare(right, undefined, {
      numeric: true,
      sensitivity: "base",
    });
    return (sort.descending ? -order : order) || a.index - b.index;
  });
}

// A column sorts ascending first (dates newest first), then reversed, then off.
export function nextSort(
  current: ShelfSort | undefined,
  column: ShelfColumn,
): ShelfSort | undefined {
  const first = column === "date";
  if (current?.column !== column) return { column, descending: first };
  if (current.descending === first) return { column, descending: !first };
  return undefined;
}

// The whole shelf in chapter order: tapes without a chapter (000) first by
// year and name, then each chapter followed by any reissue of it.
export function chapterOrder(items: Recording[]): Recording[] {
  // Releases outside the chapter series ("000") go after the chapters.
  const key = (recording: Recording) =>
    [
      shelfValue(recording, "chapter").replace(/^000$/, "zzz"),
      shelfValue(recording, "date") || "9999",
      shelfValue(recording, "title"),
      recording.identifier,
    ].join("\u0000");
  return [...items].sort((a, b) =>
    key(a).localeCompare(key(b), undefined, { numeric: true, sensitivity: "base" }),
  );
}
