# Chapter dates: follow-up

Status: open. Recorded 2026-11-21.

## What we know

- Every tape year in Grey Tapes comes from the Internet Archive upload. The
  uploader wrote it into the title, for example "(1996)", and Internet Archive
  stores it as January 1 of that year. All 343 numbered chapters in the collection agree between
  title and date field, so the app shows what the uploader recorded.
- Chapter numbers are not chronological. The tapes were reissued after DJ
  Screw's death in 2000 as "Diary of the Originator: Chapter" releases, and the
  numbers were not assigned in recording order. Chapter 301 and Chapter 342 say
  1991; Chapter 1 says 1997.
- Streaming listings sometimes give the reissue year instead. Chapter 12 is 1996
  on Internet Archive and 2004 on Apple Music.
- No source found so far gives a reliable recording year for each chapter.

The app now labels years "as uploaded", notes that chapter numbers are not
chronological, and orders the shelf by chapter instead of offering a
newest-first sort.

## To do later

1. Compare the uploaded years with the
   [Diary of the Originator series on MusicBrainz](https://musicbrainz.org/series/3769adcc-f94c-4913-b626-07d69c1c602b)
   and with Discogs release pages for the chapters.
2. Record for each chapter whether the sources agree, and which date each one
   means (recording, original tape sale or reissue).
3. Where a better date is supported by a cited source, apply it with the
   engine's `edit-source-catalog` correction command, with the source in
   `--notes`. Corrections keep the uploader's original value and survive
   re-imports. Do not edit Internet Archive metadata or the parsed title.
4. If sources disagree, keep the uploaded year and record the disagreement here
   rather than picking one.
5. Once enough chapters have checked dates, decide whether the "as uploaded"
   label and the year browsing need to change, and record that in an ADR.

## Sources

- [DJ Screw on Wikipedia](https://en.wikipedia.org/wiki/DJ_Screw)
- [Tidal: DJ Screw, Time Stretched](https://tidal.com/magazine/article/dj-screw/1-75497)
- [DJ Screw on Apple Music](https://music.apple.com/fi/artist/dj-screw/80923709)
