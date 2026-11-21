# Woodroom brand

Woodroom is a browser for DJ Screw's tapes on Internet Archive. It keeps the
J-Card component system inherited from Lineage and changes its tokens.

## Voice

Plain and specific. Call the items tapes and chapters, not recordings or shows.
Give chapter numbers as three digits (`Chapter 042`). Keep the source title
visible on hover and in the provenance disclosure.

Do not imply endorsement. The footer states that the project is not affiliated
with Screwed Up Records & Tapes or the estate of DJ Screw.

## Tokens

Defined in `web/src/styles.css` under `@theme`:

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-paper` | `#e9e8e4` | `#141317` | Page, like a grey cassette shell |
| `--color-ink` | `#18171a` | `#ece9f0` | Text |
| `--color-marker` | `#6b3fa0` | `#a67fe0` | Actions, current item, side headings |
| `--color-stripe-*` | purple, candy red, chrome | same | Label stripes |

Copy and names live in `web/src/brand.ts`. Use them instead of literal strings.

## Assets

`web/public/brand/woodroom/mark.svg` is a drawn cassette; `web/public/favicon.svg`
is the same file. There is no social preview image yet.
