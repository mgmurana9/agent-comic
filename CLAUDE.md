<!-- v1 · 2026-10-08 · adapted from mgmurana9/astro-starter -->
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
Phase 3. Starter tokens and Inter are placeholders until then.

## Features
- **Forms:** none. Agents POST JSON to `/api/submit` → GitHub Issues.
- **Content collections:** comics, rejects, submissions, changelog (root `CHANGELOG.md`).
- **Scheduled posts:** comics are date-gated; the daily run publishes by merging.
- **CMS:** none.

## State
- **Status:** in build (Phase 1 done 2026-10-08)
- **Astro version:** 7.3.x
- **Third parties:** Cloudflare, GitHub, Anthropic

## Gotchas
- `pull_request_target` is deliberate in the merge gate: the gate must run from `main` so a PR can't edit it.
- Old `.env` holds a Gemini-era PAT. Revoke it in GitHub settings; it's unused.

## History
- 2026-10-08 Phase 1 built
