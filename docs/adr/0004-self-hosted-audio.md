# ADR 0004: Host the tape audio ourselves

## Status

Accepted. The owner decided on 2026-11-21 to acquire and host the audio, and
decided the same day not to keep a recovery copy.

## Context

Woodroom streamed every track from Internet Archive through the engine's
`source_stream` collection `dj-screw-discography`. AGENTS.md said never to add
local audio preservation for it. The owner wants playback to come from our own
server instead.

The collection has 380 items and 6,294 original VBR MP3 tracks, 58.2 GB in all
on 2026-11-21. There are no lossless originals. Arkhiv core 0.4.13 (arkhiv#124)
added self-hosted source audio: a `local_preserve` collection reviews each
item's tracks against the retained source snapshot (size, MD5) and a checksum
receipt (size, SHA-256), and serves them from `/api/catalog/v1/.../media` with
Range requests. Arkhiv requires local preservation to use a separate engine
collection with a byte budget, a free-space reserve and recovery evidence.

## Decision

- The engine collection is `dj-screw-discography-local` (`local_preserve`),
  importing the Internet Archive collection `dj-screw-discography`
  (`--source-collection`). The frontend uses it through `brand.collection`;
  `brand.sourceCollection` names the Internet Archive collection.
- `scripts/mirror_audio.py` downloads the original audio files to
  `<media root>/dj-screw-discography-local/<identifier>/<file>` and keeps only
  files whose size and MD5 match what Internet Archive publishes.
- There is no independent copy. Recovery is downloading the files again from
  Internet Archive with the same script. The checksum receipt the engine
  requires is written over the primary copy on Almaz; its SHA-256 in each
  review records the files' checksums at review time, not a second copy.
- The streaming collection stays in the database until the switch is verified,
  so rolling back is pointing the frontend at it again.

## Consequences

- Almaz serves the audio bandwidth that Internet Archive served before.
- If Internet Archive removes or changes an item, our copy keeps playing, but a
  lost disk means downloading everything again, and anything Internet Archive no
  longer has is gone.
- New or changed items need a mirror run and a review before they play.
  Listing exclusions, corrections and artist profiles belong to each engine
  collection and must be set on the local one.
- About 60 GB on Almaz's `/mnt/spektr` volume, inside the collection's byte
  budget.
