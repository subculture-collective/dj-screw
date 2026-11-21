# ADR 0002: Build Grey Tapes from the Lineage consumer

## Status

Accepted

## Context

Internet Archive holds about 390 items with `creator:"DJ Screw"`. The
`dj-screw-discography` collection contains 380 of them, mostly the numbered
"Chapter" tapes, each with side-numbered MP3 files (`101.` to `1nn.` for side A,
`201.` onwards for side B) and a `Front.jpg` cover. The other ten are FLAC
copies and single uploads in `hifidelity_potpourri` and `opensource_audio`
(survey of 2026-11-21).

Arkhiv's source catalog already imports any Internet Archive collection with
`collection:<id> AND NOT mediatype:collection`, reviews playable files, and
serves search, facets and playback resolution. Lineage is a frontend-only
consumer of that engine for the `etree` collection.

## Decision

Copy Lineage's frontend and Compose setup, point the engine at
`dj-screw-discography`, and change the presentation, not the engine:

- Parse tape labels (`Chapter 042`, name, year, format) from titles for display.
- Group tracks by tape side and split performer from song in file names.
- Drop views that assume concerts: venue filters and directories, the concert
  calendar and On this day (discography dates are years only), and the
  top-artists sidebar (every tape has the same creator).
- Stream from Internet Archive only (`source_stream`). No local preservation.

The working product name is Grey Tapes, after the grey cassettes Screw sold from
his house in Houston.

## Consequences

- No engine changes or duplicate catalog schema. Engine upgrades follow the
  same pin-and-receipt process as Lineage.
- The ten items outside the collection need individual operator imports, or a
  future engine option for query-based discovery.
- The calendar and On this day views still exist by URL, but they are not
  linked because the data has no month or day.
- Lineage-specific host deployment (Dozor receiver, core wrapper, backup gate)
  is not carried over. Deployment needs its own owner decision and host profile.
