# Deployment

Woodroom is live at https://woodroom.subcult.tv/ since 2026-11-21. The owner
authorized the public deployment, including public playback of the
collection's supported audio from Internet Archive.

## Where it runs

| Item | Value |
| --- | --- |
| Host | Almaz, Compose project `woodroom` in `/mnt/spektr/server/data/woodroom` |
| Services | `db` (PostgreSQL 17), `core` (the pin in `deploy/archive-core.env`), `web` (`woodroom-web:<main commit>`), `operator` profile for jobs |
| Networks | `core` 10.254.80.0/24 and `api` 10.254.81.0/24, both internal; `web` also joins `projects`, where Caddy reaches it as `woodroom-web` |
| Configuration | `.env` (`ARCHIVE_ENGINE_IMAGE`, `WEB_IMAGE`); secrets in `runtime/` (mode 600 except the PostgreSQL password file) |
| nginx | `nginx.conf` beside the compose file replaces the image's config: it proxies `/api` to `woodroom-core`, because another app already answers to `api` on `projects` |
| Edge | Caddy site `sites/woodroom.Caddyfile`, imported at the end of the main Caddyfile; the tunnel's `*.subcult.tv` rule already reaches Caddy |
| Monitoring | Dozor blackbox probes of `/` and `/api/version`; alert `WoodroomDown` (`alerts/woodroom.yml`) |

The core runs with `ARKHIV_PUBLIC=0`, like Lineage. Caddy allows only `GET` and
`HEAD`, `/api/version`, `/api/source-catalog/v1/*` and playback resolution with
`action=play`; every other API path returns 404.

## Deploy a new frontend

There is no automatic deploy yet. From a checkout of `main` on Kvant:

```bash
rev=$(git rev-parse HEAD)
docker build --network=host -f web/Dockerfile \
  --label org.opencontainers.image.revision=$rev \
  --label org.opencontainers.image.source=https://github.com/subculture-collective/dj-screw \
  -t woodroom-web:$rev web
docker run --rm --network none --entrypoint nginx woodroom-web:$rev -t
docker save woodroom-web:$rev | ssh almaz docker load
```

Then on Almaz, record the previous image, switch and check:

```bash
cd /mnt/spektr/server/data/woodroom
cp .env .env.before-$rev
sed -i "s/^WEB_IMAGE=.*/WEB_IMAGE=woodroom-web:$rev/" .env
docker compose -p woodroom up -d web
curl -fsS https://woodroom.subcult.tv/ | grep -c '<title>Woodroom'
```

Roll back by restoring the saved `.env` and running `up -d web` again.

## Upgrade the core

Take a backup first (`docker compose -p woodroom exec db pg_dump -U arkhiv -Fc arkhiv > backups/woodroom-$(date -u +%Y%m%dT%H%M%SZ).dump`),
set `ARCHIVE_ENGINE_IMAGE` to the new pin, run
`docker compose -p woodroom --profile operator run --rm operator migrate`, then
`docker compose -p woodroom up -d core`.

## Catalog jobs

Run engine commands through the `operator` profile, which can reach Internet
Archive:

```bash
cd /mnt/spektr/server/data/woodroom
op() { docker compose -p woodroom --profile operator run --rm -T operator "$@"; }
op discover-catalog --pages 1 --items 100 --delay 1s --timeout 10m
op review-source-audio-batch --items 100 --timeout 10m --notes "..."
```

Discovery and reviews resume from the database. The database holds only
metadata imported from Internet Archive and the playback reviews; it can be
rebuilt from the collection, but take a dump before upgrades.
