# Stack

Woodroom (repository `dj-screw`) is a React/TypeScript consumer of the shared
Arkhiv Go engine. The engine runs as a pinned container image
(`deploy/archive-core.env`) with PostgreSQL 17 and imports the Internet Archive
collection `dj-screw-discography`.

- Frontend: React 19, Vite 7, Tailwind 4, `@subcult/archive-viewer` 0.4.14.
- Engine: Arkhiv core 0.4.13 (see `deploy/core-release.json`).
- Audio comes from our own copy of the originals, served by the engine with
  Range requests (ADR 0004). Covers are imported into `web/public/covers`.

The product name and design are recorded in [brand.md](brand.md) and
[ADR 0002](../adr/0002-grey-tapes-from-lineage.md).
