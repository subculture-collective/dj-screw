# Chapter dates: follow-up

Status: open. Recorded 2026-11-21.

## What we know

- Every tape year in Woodroom comes from the Internet Archive upload. The
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

## Releases without a chapter number (checked 2026-11-21)

The collection holds 380 items: Chapters 001 to 343 with no gaps, and 37
releases whose titles carry no chapter number. Before listing those as "no
series" (000), each was checked for being a chapter whose number is missing
from the metadata:

- Every release title was matched against all 343 chapter titles, and each
  close pair was compared by track list and running time from the Internet
  Archive files.
- Wikipedia's DJ Screw discography lists Chapters 344 to 364. None of their
  titles matches a release in the collection. MusicBrainz's series lists only
  18 chapters, so it could not settle this.

Results:

| Release | Finding | Shelf |
| --- | --- | --- |
| Next Episode (2004), `20200531_20200531_0159` | Chapter 015's 13 songs in the same order, 103.2 min each | Chapter 015 reissue |
| N 2 Deep (2004), `20200531_20200531_0144` | Chapter 019 split into fewer tracks; 101.8 vs 102.0 min, 7 of 11 titles match | Chapter 019 reissue |
| The Final Chapter (2004) | Contains all 13 songs of Chapter 071 plus 18 more tracks | No series |
| Stressed Out (2019) | Shares 7 songs with Chapter 251; 94.9 vs 73.3 min | No series |
| 3 'N the Mornin' Part One, Part Two Blue and Red | Share a few songs with Chapters 108 and 180 | No series |
| All other look-alikes (All Work No Play, June 27, Forever, Playaz Nite, 11.16.00 and others) | No shared songs with the similarly named chapter | No series |

The two reissues are mapped in `chapterReissues` in `web/src/tape.ts`; source
titles and identifiers are unchanged. The other 35 releases show as 000.

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
