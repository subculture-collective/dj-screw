# ADR 0003: Name the product Woodroom

## Status

Accepted. The owner chose the name and the domain `woodroom.subcult.tv` on
2026-11-21.

## Context

The working name was Grey Tapes (ADR 0002). It describes the tapes rather than
naming a product, it could suggest the site holds the original cassettes, and
H.A.W.K. already released mixtapes titled *Since the Gray Tapes*. The owner wanted
a reference to Screw's life that only close listeners would recognise.

## Decision

The product is Woodroom, after the room where Screw kept his turntables. Red
Bull Music Academy's 2015 feature says he "had his turntables set up in what was
known as The Wood Room" in his one-story house on Greenstone Street in Golfcrest,
and that he stood at them "facing a wall full of posters" while a microphone went
around the room. The owner describes old-fashioned wood paneling, which the cover
photo of Lance Scott Walker's *DJ Screw: A Life in Slow Revolution* also shows.
The planned public address is `woodroom.subcult.tv`.

Write the name as one word, `Woodroom`, in prose and `woodroom` in identifiers,
storage keys and paths.

## Consequences

- Copy about the room stays within what sources say: the Greenstone house, the
  turntables, crates of records, a wall of posters and wood paneling. Do not say
  which tapes were recorded there without a citation.
- "Grey tapes" stays in copy as the historical term for his tapes.
- Browser storage keys changed from `grey-tapes.player.*` to
  `woodroom.player.*`. The app was never deployed, so no saved settings are lost.
- The domain is chosen, but deployment still needs a host profile and its own
  owner approval.
- The rename left the cassette mark and J-Card styles in place. The Woodroom
  design (`docs/reference/brand.md`) replaced them.
