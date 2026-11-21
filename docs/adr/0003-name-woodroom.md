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

The product is Woodroom, after the wood room where Screw's circle gathered. A
photo by DJ Screw, courtesy of DeMo Sherman and University of Houston Libraries
Special Collections, shows Al-D and Big DeMo in the wood room months before the
June 27th tape was recorded. It is reproduced in Lance Scott Walker's *DJ Screw:
A Life in Slow Revolution* (University of Texas Press). The planned public
address is `woodroom.subcult.tv`.

Write the name as one word, `Woodroom`, in prose and `woodroom` in identifiers,
storage keys and paths.

## Consequences

- Copy about the room stays within what the sources say. Where the room was,
  what it looked like and which tapes were made there are unconfirmed; cite
  Walker's book or another source before stating them.
- "Grey tapes" stays in copy as the historical term for his tapes.
- Browser storage keys changed from `grey-tapes.player.*` to
  `woodroom.player.*`. The app was never deployed, so no saved settings are lost.
- The domain is chosen, but deployment still needs a host profile and its own
  owner approval.
- The cassette mark and J-Card styles are unchanged here. A Woodroom design
  system replaces them in a later change.
