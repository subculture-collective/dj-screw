import { describe, expect, it } from "vitest";
import { arrangeShelf, nextSort } from "./shelf-order";
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
    expect(ids(arrangeShelf(items, "", { column: "chapter", descending: false }))).toEqual(["b", "a", "c", "d"]);
    expect(ids(arrangeShelf(items, "", { column: "chapter", descending: true }))).toEqual(["c", "a", "b", "d"]);
    expect(ids(arrangeShelf(items, "", { column: "date", descending: true }))).toEqual(["b", "c", "a", "d"]);
    expect(ids(arrangeShelf(items, "", { column: "title", descending: false }))).toEqual(["d", "a", "c", "b"]);
  });

  it("keeps each row's catalog position for numbering", () => {
    const rows = arrangeShelf(items, "", { column: "chapter", descending: false });
    expect(rows.map((row) => row.index)).toEqual([1, 0, 2, 3]);
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
