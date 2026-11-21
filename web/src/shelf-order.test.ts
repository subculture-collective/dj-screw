import { describe, expect, it } from "vitest";
import { arrangeShelf, chapterOrder, nextSort } from "./shelf-order";
import type { Recording } from "./archive";

const items: Recording[] = [
  { identifier: "a", creator: "DJ Screw", title: "DJ Screw - Chapter 124. Hurricane Duck (1995)", date: "1995" },
  { identifier: "b", creator: "DJ Screw", title: "DJ Screw - Chapter 042. Popped Up Smoked Up (1996)", date: "1996-01-01T00:00:00Z" },
  { identifier: "c", creator: ["DJ Screw"], title: "DJ Screw - Chapter 201. Player`s Nite Out (1996)", date: "1996" },
  { identifier: "d", title: "", date: "" },
];
const ids = (rows: ReturnType<typeof arrangeShelf>) =>
  rows.map((row) => row.recording.identifier);

describe("arranging the loaded page of tapes", () => {
  it("keeps catalog order without a filter or sort", () => {
    expect(ids(arrangeShelf(items, "  "))).toEqual(["a", "b", "c", "d"]);
  });

  it("matches every word across columns, ignoring case and punctuation marks", () => {
    expect(ids(arrangeShelf(items, "hurricane 1995"))).toEqual(["a"]);
    expect(ids(arrangeShelf(items, "CHAPTER 042"))).toEqual(["b"]);
    expect(ids(arrangeShelf(items, "player’s"))).toEqual(["c"]);
    expect(ids(arrangeShelf(items, "duck 1996"))).toEqual([]);
    expect(ids(arrangeShelf(items, "d"))).toContain("d");
  });

  it("sorts by a column with missing values last in either direction", () => {
    // A tape without a chapter is 000, so it leads ascending and trails descending.
    expect(ids(arrangeShelf(items, "", { column: "chapter", descending: false }))).toEqual(["d", "b", "a", "c"]);
    expect(ids(arrangeShelf(items, "", { column: "chapter", descending: true }))).toEqual(["c", "a", "b", "d"]);
    expect(ids(arrangeShelf(items, "", { column: "date", descending: true }))).toEqual(["b", "c", "a", "d"]);
    expect(ids(arrangeShelf(items, "", { column: "title", descending: false }))).toEqual(["d", "a", "c", "b"]);
  });

  it("keeps each row's catalog position for numbering", () => {
    const rows = arrangeShelf(items, "", { column: "chapter", descending: false });
    expect(rows.map((row) => row.index)).toEqual([3, 1, 0, 2]);
  });

  it("cycles a column through ascending, reversed and off", () => {
    expect(nextSort(undefined, "chapter")).toEqual({ column: "chapter", descending: false });
    expect(nextSort({ column: "chapter", descending: false }, "chapter")).toEqual({ column: "chapter", descending: true });
    expect(nextSort({ column: "chapter", descending: true }, "chapter")).toBeUndefined();
    expect(nextSort(undefined, "date")).toEqual({ column: "date", descending: true });
    expect(nextSort({ column: "date", descending: true }, "date")).toEqual({ column: "date", descending: false });
    expect(nextSort({ column: "date", descending: false }, "title")).toEqual({ column: "title", descending: false });
  });
});

const shelf: Recording[] = [
  { identifier: "DJScrewChapter019N2Deep1999", title: "DJ Screw - Chapter 019. `N 2 Deep (1999)", date: "1999" },
  { identifier: "20200531_20200531_0144", title: "DJ Screw - N 2 Deep (2004)", date: "2004" },
  { identifier: "20200530_20200530_1520", title: "DJ Screw - 3 `N The Mornin`, Part One (1995)", date: "1995" },
  { identifier: "DJScrewChapter001DonDeal1997", title: "DJ Screw - Chapter 001. Don Deal (1997)", date: "1997" },
  { identifier: "DJ_Screw_-_The_Greatest_Hits_2005", title: "DJ Screw - The Greatest Hits (2005)", date: "2005" },
];

describe("the whole shelf in chapter order", () => {
  it("puts releases without a chapter first, then chapters with reissues after them", () => {
    expect(chapterOrder(shelf).map((item) => item.identifier)).toEqual([
      "20200530_20200530_1520",
      "DJ_Screw_-_The_Greatest_Hits_2005",
      "DJScrewChapter001DonDeal1997",
      "DJScrewChapter019N2Deep1999",
      "20200531_20200531_0144",
    ]);
  });

  it("filters by chapter series or no series", () => {
    expect(ids(arrangeShelf(shelf, "", undefined, "chapters"))).toEqual([
      "DJScrewChapter019N2Deep1999",
      "20200531_20200531_0144",
      "DJScrewChapter001DonDeal1997",
    ]);
    expect(ids(arrangeShelf(shelf, "", undefined, "none"))).toEqual([
      "20200530_20200530_1520",
      "DJ_Screw_-_The_Greatest_Hits_2005",
    ]);
  });

  it("finds a reissue by its chapter number", () => {
    expect(ids(arrangeShelf(shelf, "019"))).toEqual([
      "DJScrewChapter019N2Deep1999",
      "20200531_20200531_0144",
    ]);
  });
});
