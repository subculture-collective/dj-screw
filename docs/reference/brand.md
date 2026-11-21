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
- **Floating modules:** each section of a page (search, browse by year, the
  tape page, the footer) is its own frosted module: brushed aluminium at 50%
  opacity (rubber at 55% in the dark scheme) with a 3-pixel backdrop blur, so
  the wall stays recognisable through it.
  Text inside modules is weight 500 with a layered halo of panel colour
  (`--halo`, 92% opacity, out to 16 pixels) so it stays readable over whatever
  the glass shows. The
  shelf breaks into rack units of ten tapes. The wall shows between modules and,
  blurred, through them as it moves. Browsers without backdrop blur get opaque
  panels. A page title that sits on the wall gets a black rack plate.
- **Lower wall:** three more posters hang further down, so the gaps between
  modules have something passing behind them all the way down a long page.
- **Rack:** the masthead and the player are black rack units in both schemes.
  They redefine the colour tokens locally, so components inside them need no
  special cases.

## Tokens

Defined in `web/src/styles.css` under `@theme`. On a glass module, contrast is
measured against the text halo over the darkest (light scheme) or brightest
(dark scheme) poster behind it; hints and the accent stay above 5:1 there. The
figures below are for solid panels.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-paper` | `#e2e3e4` aluminium | `#1c1c1e` rubber | Content panel |
| `--color-ink` | `#121214` (14.6:1) | `#f2f2f0` (15.2:1) | Text |
| `--color-ink-soft` | `#45474b` (7.2:1) | `#b9babd` (8.8:1) | Secondary text |
| `--color-ink-faint` | `#4a4c50` (5.1:1) | `#94969b` (4.8:1) | Hints |
| `--color-marker` | `#8c240e` (5.2:1) | `#ff5a33` (4.6:1) | Actions, current item, side headings |
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
- The eight posters (`web/public/brand/woodroom/posters/`, WebP, 21–77 KB)
  are promo posters for records by artists Screw mixed, from designs the owner
  supplied on 2026-11-21: E.S.G. *Sailin' Da South*, Fat Pat *Ghetto Dreams*,
  Lil' Keke *Don't Mess Wit Texas*, Big Pokey *Hardest Pit in the Litter* (two),
  Botany Boyz *Thought of Many Ways*, Z-Ro *Look What You Did to Me* and UGK
  *Ridin' Dirty*. Seven were redrawn in HTML from the owner's layouts, because
  the supplied files had a speckle texture over their type, and then weathered
  (yellowing, burnt edges, creases, crumple shading, fine cracks). The Big Pokey
  photo poster is the owner's image with its Parental Advisory label covered.
  Printed facts were checked against Wikipedia and AllMusic on 2026-11-21; the
  Botany Lane detail was dropped as unconfirmed. Photo posters of E.S.G. (shown
  as a group, with a Rap-A-Lot logo) and UGK (in front of the Dallas skyline)
  were left out as inaccurate.
- The air-conditioner grille, the framed gold record and the wall lamp
  (`web/public/brand/woodroom/room/`, WebP, 3–8 KB) were drawn in HTML from
  details in published photos of the room, then weathered: grime on the
  louvers, rust at the screws, chipped paint, glare and dust on the frame
  glass. The plaque's engraving is blank lines; it names no award. The single
  on the wall is CSS. The lamp's light is a CSS layer on the paneling (outside
  the moving props layer, so it blends with the wood): a broad warm glow and
  brighter washes above and below the shade. The photos themselves belong to
  their photographers and are not used.

## Assets

`web/public/brand/woodroom/mark.svg` is a pitch fader pushed to the bottom of
its slot, with a strobe dot and a lock light, drawn on a 16-pixel grid with solid
shapes so it holds up as a browser tab icon. `web/public/favicon.svg` is the
same file. There is no social preview image yet.

The redrawn posters and props are HTML sources in `docs/reference/room-art/`
(`posters.html`, `props.html`). To change one, edit the source, screenshot the
element with a transparent background (for example Playwright's
`locator.screenshot({ omitBackground: true })`), resize it to the size in the
existing file and convert it with `cwebp -q 78 -alpha_q 90`.
