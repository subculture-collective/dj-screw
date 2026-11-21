import { describe, expect, it } from "vitest";
import { chapterNumber, shelfChapter, tapeLabel, trackCredit, trackLength } from "./tape";
import { trackDisplayTitle } from "./track-title";

describe("tape labels", () => {
  it("reads chapter, name and year from discography titles", () => {
    expect(tapeLabel("DJ Screw - Chapter 042. Popped Up Smoked Up (1996)")).toEqual({
      series: "Chapter 042",
      chapter: 42,
      name: "Popped Up Smoked Up",
      year: "1996",
      format: "",
    });
  });

  it("keeps format notes and volumes separate from the name", () => {
    expect(tapeLabel("DJ Screw - Volume II. All Screwed Up (1995) [FLAC]")).toMatchObject({
      series: "Volume II",
      name: "All Screwed Up",
      year: "1995",
      format: "FLAC",
    });
    expect(tapeLabel("Chapter 172 - Straight Wreckin' (FLAC)", "1999")).toMatchObject({
      series: "Chapter 172",
      name: "Straight Wreckin'",
      year: "1999",
      format: "FLAC",
    });
  });

  it("keeps tape colours in the name and drops the click credit", () => {
    expect(tapeLabel("DJ Screw - 3 'N The Mornin' (Part Two) [Blue]", "1995")).toMatchObject({
      name: "3 'N The Mornin' (Part Two) [Blue]",
      format: "",
    });
    expect(
      tapeLabel("DJ Screw & The Screwed Up Click - 7717 Cullen Blvd., Vol. 1 (2012)").name,
    ).toBe("7717 Cullen Blvd., Vol. 1");
  });

  it("shows source backticks as apostrophes", () => {
    expect(tapeLabel("DJ Screw - Chapter 201. Player`s Nite Out (1996)").name).toBe(
      "Player’s Nite Out",
    );
  });

  it("leaves other titles whole", () => {
    expect(tapeLabel("Austin TX Underground Concert", "2000-01-01")).toEqual({
      series: "",
      chapter: undefined,
      name: "Austin TX Underground Concert",
      year: "2000",
      format: "",
    });
  });
});

describe("track credits", () => {
  const credit = (name: string) => {
    const file = { name };
    return trackCredit(file, trackDisplayTitle(file));
  };

  it("reads the tape side and performer from side-numbered files", () => {
    expect(
      credit("101. Luniz - I Got 5 On It (Freestyle with Kay K, Lil Keke, Hawk & DJ Screw).mp3"),
    ).toEqual({
      side: "A",
      performer: "Luniz",
      song: "I Got 5 On It (Freestyle with Kay K, Lil Keke, Hawk & DJ Screw)",
    });
    expect(credit("203. Twinz - Good Times.mp3")).toMatchObject({ side: "B", performer: "Twinz" });
    expect(credit("202. C-Bo - Ain`t No Sunshine.mp3").song).toBe("Ain’t No Sunshine");
  });

  it("takes the performer from the filename when the title omits it", () => {
    const file = { name: "101. Spice 1 - What That Mail Like.mp3", title: "What That Mail Like" };
    expect(trackCredit(file, trackDisplayTitle(file))).toEqual({
      side: "A",
      performer: "Spice 1",
      song: "What That Mail Like",
    });
  });

  it("gives no side for ordinary numbering", () => {
    expect(credit("05. Freestyle.mp3")).toEqual({ side: "", performer: "", song: "Freestyle" });
  });
});

describe("track lengths", () => {
  it("formats seconds and leaves other values alone", () => {
    expect(trackLength("504.4")).toBe("8:24");
    expect(trackLength("3725")).toBe("1:02:05");
    expect(trackLength("05:12")).toBe("05:12");
    expect(trackLength(undefined)).toBe("");
  });
});

describe("chapter series", () => {
  it("numbers chapters, maps verified reissues and gives other releases 0", () => {
    expect(shelfChapter("x", "DJ Screw - Chapter 042. Popped Up Smoked Up (1996)")).toEqual({ number: 42, reissue: false });
    expect(shelfChapter("20200531_20200531_0159", "DJ Screw - Next Episode (2004)")).toEqual({ number: 15, reissue: true });
    expect(shelfChapter("y", "DJ Screw - The Legend (2001)")).toEqual({ number: 0, reissue: false });
    expect(chapterNumber(0)).toBe("000");
    expect(chapterNumber(7)).toBe("007");
  });
});
