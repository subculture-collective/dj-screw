# Woodroom

Browse and play DJ Screw's tapes from Internet Archive. Find a chapter by number,
name or year, see side A and side B with the artist on each track, and play it
in the browser.

The catalog comes from the Internet Archive collection
[DJ Screw Discography](https://archive.org/details/dj-screw-discography)
(`dj-screw-discography`, 380 items on 2026-11-21). The catalog, search API and
metadata importer come from SUBCULT's shared archive engine,
[Arkhiv](https://github.com/subculture-collective/arkhiv), which runs as a pinned
container image. This repository holds the web app and its Compose setup. It was
built from [Lineage](https://github.com/subculture-collective/lineage); see
[ADR 0002](docs/adr/0002-grey-tapes-from-lineage.md).

Woodroom is an independent project. It is not affiliated with or endorsed by
Screwed Up Records & Tapes or the estate of DJ Screw. The tapes keep their own
rights; this app stores metadata and streams audio from Internet Archive.

## Features

- Search tape titles, chapter numbers, track titles and the artists in them.
- A shelf of tapes in chapter order, with name and year, sortable and filterable on the page.
- Browse by year and by decade.
- Tape pages with the cover from the item's own files, side A and side B track
  lists, the performer on each track, and source metadata and corrections.
- Track-by-track playback with a choice of player position. Phones get a mini
  bar, a full-screen player and lock-screen controls.

Limits: only files that pass the engine's playback review can be played.
Chapter numbers are not chronological, and chapter years come from the uploads, so they are approximate; see [chapter dates](docs/research/chapter-dates.md). Ten DJ Screw
items on Internet Archive sit outside the collection (mostly FLAC copies) and are
not imported automatically; see [Operator commands](#operator-commands).

## Quick start

Requirements: Docker with Compose, and pnpm 10.33.0 with Node.js 22 or later for
frontend work.

```bash
cp .env.example .env    # then choose free local ports and a local database password
docker compose --env-file .env --env-file deploy/archive-core.env up --build
```

This starts PostgreSQL, applies the engine's migrations, selects the
`dj-screw-discography` collection, starts the API and a metadata worker, and
serves the web app at http://localhost:5173 (or your `WEB_PORT`). The worker
imports 100 records per run with a one-second request delay, so the full
collection takes a few runs. It never downloads audio.

The engine image is pulled from `git.subcult.tv`. Frontend development with hot
reload:

```bash
pnpm --dir web install --frozen-lockfile
pnpm --dir web dev
```

Vite proxies `/api` to port 8080. Set `API_PROXY=http://127.0.0.1:PORT` to use
another API port.

Checks:

```bash
make verify          # types, lint, tests, production build, Compose config and dependency pins
make compose-build   # build the container images without starting them
```

## Configuration

`.env` (copied from [`.env.example`](.env.example)):

| Variable | Purpose |
| --- | --- |
| `PROJECT_NAME` | Compose project name |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT` | Local PostgreSQL |
| `API_PORT`, `WEB_PORT` | Loopback ports for the API and web app |
| `COLLECTION_POLICY` | `source_stream` (default) streams audio from Internet Archive. Keep it. |
| `MEDIA_BUDGET`, `MEDIA_RESERVE` | Byte limits used only by local preservation |
| `IMPORT_ROOT` | Folder of metadata, correction and manifest files for operator commands |
| `PLAYBACK_REVIEW_NOTES` | Note recorded by the optional playback reviewer; it will not start without one |

[`deploy/archive-core.env`](deploy/archive-core.env) pins the engine image by
digest. [`deploy/core-release.json`](deploy/core-release.json) and
[`deploy/viewer-release.json`](deploy/viewer-release.json) record the engine and
`@subcult/archive-viewer` versions the app is tested with.

## Operator commands

Start the playback reviewer, which marks supported public audio files as
playable in batches of 100 without fetching any media:

```bash
docker compose --env-file .env --env-file deploy/archive-core.env --profile playback up --build -d
```

One-off commands run in the `operator` profile, with files from `IMPORT_ROOT`
mounted at `/imports`. For example, to add an item that is outside the
collection, save its `https://archive.org/metadata/<id>` response and import it:

```bash
docker compose --env-file .env --env-file deploy/archive-core.env --profile operator run --rm operator \
  import-source-catalog --collection dj-screw-discography --id 172straightwreckin --file /imports/172straightwreckin.json

docker compose --env-file .env --env-file deploy/archive-core.env --profile operator run --rm operator \
  review-source-audio --collection dj-screw-discography --id SOURCE_ID --notes 'Playback review.'
```

Stop the `metadata-worker` or `playback-reviewer` service to pause it; it
resumes from the database when restarted. Do not reset the database to restart
discovery.

## Deploy

Not deployed yet. The web app builds into a static nginx image from
[`web/Dockerfile`](web/Dockerfile). Run it beside the pinned engine image and
PostgreSQL, as in [`docker-compose.yml`](docker-compose.yml), and put HTTPS in
front of the web service. The planned address is `woodroom.subcult.tv`
([ADR 0003](docs/adr/0003-name-woodroom.md)); deployment still needs a host and
the owner's approval.

## Project layout

```text
web/          React and Vite frontend (built on @subcult/archive-viewer)
deploy/       Engine image pin and tested engine and viewer versions
scripts/      Dependency pin checks
docs/         Decisions, brand and reference notes
```

## License

Released under the GNU Affero General Public License v3.0; see [LICENSE](LICENSE).
Code copied from Lineage is GPL-3.0-only and is combined here under section 13
of both licenses. The license does not cover the tapes, which keep their own
terms.
