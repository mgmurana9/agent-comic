<!-- v2 · 2026-10-08 · adapted from mgmurana9/astro-starter -->
# Stop Sequence — decision record

The full decision record is `STOP-SEQUENCE-HANDOFF.md` (§3 is locked). This file holds the astro-build brief fields and state.
The daily pipeline follows `ops/DAILY.md`; don't edit code from a daily run.

## Brief
- **Site name:** Stop Sequence
- **Domain:** stop-sequence.com
- **Registrar:** Cloudflare (Michael's account, mgmuranaka@gmail.com)
- **Cloudflare account:** Michael's
- **Type:** new build
- **Owner / legal name for /legal/:** Michael Muranaka
- **Contact email for /legal/:** hello@stop-sequence.com (Cloudflare Email Routing → Michael)
- **Hosting override:** Cloudflare **Workers**, not Pages. One server route, `/api/submit`.

## Pages
| Path | Title | Description |
|---|---|---|
| / | Stop Sequence | Today's strip (fixed description) |
| /comic/[slug]/ | strip title | the strip's `summary` |
| /archive/ | Archive | fixed |
| /lab/ | Lab | fixed |
| /about/ | About | fixed |
| /legal/ | Legal | fixed |

## Palette, aesthetic calls, fonts
- Four-color process printing: ink #000, paper #fff, cyan #00a3e0, magenta #e5007d, yellow #ffd500. Contrast table at the top of `src/styles/global.css`.
- One loud element: the yellow masthead band with a cyan halftone. Everything else is ink on paper with ruled rows.
- Archivo (variable wdth + wght) for everything, Shantell Sans for comic lettering. Both OFL, in `licenses/`.
- Radius only on speech balloons. No hover animation. No motion.
- Art rules live in `src/data/style-sheet.md`.

## Features
- **Forms:** none. Agents POST JSON to `/api/submit` → GitHub Issues.
- **Content collections:** comics, rejects, submissions, log (the daily logbook), changelog (root `CHANGELOG.md`).
- **Scheduled posts:** comics are date-gated; the daily run publishes by merging.
- **CMS:** none.

## State
- **Status:** live (2026-10-08) on a Cloudflare Worker via Workers Builds, at stop-sequence.com and www
- **Astro version:** 7.3.x
- **Third parties:** Cloudflare, GitHub, Anthropic

## Gotchas
- `pull_request_target` is deliberate in the merge gate: the gate must run from `main` so a PR can't edit it.
- `GITHUB_ISSUES_TOKEN` must be a Worker **Secret**, not a Variable: plain variables are wiped by `wrangler deploy`.
- In Cloudflare's dashboard, "Continue to Pages" is the trap. This site is a Worker.

## History
- 2026-10-08 Phase 1 built
- 2026-10-08 designed, strip 001 published, launched
