# Stack

Woodroom (repository `dj-screw`) is a React/TypeScript consumer of the shared
Arkhiv Go engine. The engine runs as a pinned container image
(`deploy/archive-core.env`) with PostgreSQL 17 and imports the Internet Archive
collection `dj-screw-discography`.

- Frontend: React 19, Vite 7, Tailwind 4, `@subcult/archive-viewer` 0.4.13.
- Engine: Arkhiv core 0.4.12 (see `deploy/core-release.json`).
- Audio and covers stream from Internet Archive in the browser.

The product name and design are recorded in [brand.md](brand.md) and
[ADR 0002](../adr/0002-grey-tapes-from-lineage.md).
