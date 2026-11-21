# Woodroom brand

Woodroom is a browser for DJ Screw's tapes on Internet Archive. Its design is
**Two decks in the wood room**: the interface is DJ equipment (a black rack and
brushed-aluminium panels with a strobe-orange accent), set in front of the room
it is named after (wood paneling, posters, a gold record, a wall lamp and the
air conditioner). The owner selected this on 2026-11-21 from the Studio study
`studio/studies/2026-11-21-woodroom-directions/` in `subculture-collective/subcult-tv`:
direction W3, with the room from W1. ADR 0003 records the name and its sources.

## Voice

Plain and specific. Call the items tapes and chapters, not recordings or shows.
Give chapter numbers as three digits (`Chapter 042`). Keep the source title
visible on hover and in the provenance disclosure.

Do not imply endorsement. The footer states that the project is not affiliated
with Screwed Up Records & Tapes or the estate of DJ Screw. Do not say which tapes
were recorded in the wood room (ADR 0003).

## Layout

- **Room** (`web/src/Room.tsx`): a fixed, decorative layer behind every page,
  hidden from assistive technology and pointer events. The wall shows above the
  content (the wall band, `--wall-band`) and in the margins.
- **Parallax:** the room moves at 35% of the scroll speed. With
  `prefers-reduced-motion: reduce` it stays still. There is no per-page camera
  movement.
- **Content panel:** `main` is one brushed-aluminium panel (rubber in the dark
  scheme) with rack screws in its top corners.
- **Rack:** the masthead and the player are black rack units in both schemes.
  They redefine the colour tokens locally, so components inside them need no
  special cases.

## Tokens

Defined in `web/src/styles.css` under `@theme`. Contrast is measured against the
surface each token sits on.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-paper` | `#e2e3e4` aluminium | `#1c1c1e` rubber | Content panel |
| `--color-ink` | `#121214` (14.6:1) | `#f2f2f0` (15.2:1) | Text |
| `--color-ink-soft` | `#45474b` (7.2:1) | `#b9babd` (8.8:1) | Secondary text |
| `--color-ink-faint` | `#5a5d62` (5.1:1) | `#94969b` (5.8:1) | Hints |
| `--color-marker` | `#a82c10` (5.4:1) | `#ff5a33` (5.5:1) | Actions, current item, side headings |
| `--color-rack` | `#161618` | same | Masthead and player |
| `--color-strobe` | `#ff5a33` (5.8:1 on rack) | same | Accent on the rack |
| `--color-lock` | `#39c46a` | same | Status light only |

The strobe orange `#c2361a` reaches only 3.3:1 on aluminium; it is used as a
fill (placeholder covers), never for text there.

Type: Michroma for the wordmark and small panel labels (eyebrows), Figtree for
interface text and headings, Martian Mono for chapter numbers, lengths and
years. All are OFL fonts served from the app via Fontsource; no font is loaded
from a third party at runtime.

Copy and names live in `web/src/brand.ts`, including the room's posters
(`roomPosters`). Use them instead of literal strings.

## Room artwork

- `web/public/brand/woodroom/paneling.webp` (80 KB, a 1024-pixel tile shown at
  512 CSS pixels): Poly Haven's *Cherry Veneer* by Jenelle van Heerden
  (CC0, https://polyhaven.com/a/cherry_veneer), rotated to a vertical grain,
  toned honey-brown, with six boards of uneven width and dark grooves added.
  The owner's paneling references set the tone and groove spacing.
- The posters are original CSS designs that name artists Screw mixed and their
  records of the time: E.S.G. (*Sailin' Da South*), Fat Pat (*Ghetto Dreams*)
  and Lil' Keke (*Don't Mess Wit Texas*). They do not copy real poster artwork,
  photographs or label logos.
- The gold record, the single, the wall lamp and the air conditioner are drawn
  in CSS from details in published photos of the room. The photos themselves
  belong to their photographers and are not used.

## Assets

`web/public/brand/woodroom/mark.svg` is a pitch fader pushed to the bottom of
its slot, with a strobe dot and a lock light, drawn on a 16-pixel grid with solid
shapes so it holds up as a browser tab icon. `web/public/favicon.svg` is the
same file. There is no social preview image yet.
