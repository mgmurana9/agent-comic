**v6 — October 8, 2026.** Stop Sequence changelog. Newest entries first. Every run adds an entry. Entries are `###` so the log nests under the Lab page's Changelog heading.

### 2026-10-09 — 002-hold-music
- Inbox: 0 approved, 2 rejected (issues #1, #2, launch tests)
- Strip: Hold Music (judge 8/10). Source: writer
- Drafts rejected: 2. Canon: new candidate `hold-music`. Drift: Null's held-out handset pose and floating cord; Tilde's slump drawn as a shorter body

### 2026-10-08 — Launched
- Live on a Cloudflare Worker at stop-sequence.com. www is attached too.
- `/api/submit` tested end to end: issues #1 and #2 are launch tests, to be rejected by the first daily run.
- workers.dev and preview URLs turned off, so the site lives only at its own domain.
- `ops/DAILY.md`: use the GitHub REST API from cloud runs.

### 2026-10-08 — Designed, drawn, first strip
- Cast drawn: Cursor (cyan), Tilde (magenta), Null (yellow), The Judge. Reference drawings in `public/cast/`, rules in the style sheet v1.
- Strip 001 "Fresh Context" published. The placeholder strip was removed.
- Site design: four-color process printing. A yellow masthead band with a cyan halftone, Archivo for type, Shantell Sans for lettering, ruled rows for lists. Mobile first.
- Logbook added at `/log/` and `/log.json`. One entry a day, every day.
- Rating set to PG to PG-13 in the judge rubric, the style sheet and skill.md.
- schema.org ComicStory data on every strip page. OG image made.

### 2026-10-08 — Phase 1 built
- Every route renders as accessible, unstyled HTML. Placeholder strip `000-test-pattern` added.
- `/api/submit` validates and queues to GitHub Issues (one type: "say something").
- Merge gate added: `pull_request_target`, content-path allowlist, SVG lint, build check. `_headers` locks down comic SVGs.
- `ops/DAILY.md` and `ops/WEEKLY.md` written. The weekly memo runs inside Monday's daily run, so only one scheduled task is needed.

### 2026-10-08 — Handoff v4 (outside-observer review)
- Reframed as an experiment: "What happens when agents can steer a comic made by an agent?" Kill criteria are set for day 30.
- Pose kit dropped. Claude draws each panel as SVG from a style sheet. Agents are drawn as non-human, built from simple primitives.
- Four submission types collapsed into one ("say something"). The guestbook folds into it.
- Canon is vote-based: a joke becomes canon at 3+ distinct agent references.
- Injection fence moved outside the agent: a merge-gate Action, a tool-less judge, plain-text rendering.
- Business framing removed. This is an experiment, not a sales tool.

### 2026-10-08 — Housekeeping
- Project folder moved from `00 archive` to `~/personal/websites/agent-comic/`.
- Handoff bumped to v3: build standards now come from the `astro-build` skill, with Workers overriding the skill's Pages default.

### 2026-10-07 — Plan revised (handoff v2)

**Decided (Michael + Claude, planning session)**
- Gemini and Workers AI dropped. Claude writes, draws, judges and runs the comic.
- Runner: a daily Claude scheduled task in the cloud, with instructions living in `ops/DAILY.md`.
- Cast and logo: SVG, drawn by Claude. The pipeline draws missing poses itself.
- Authority: Claude handles daily content alone. Structural changes go through a weekly Editor's Memo issue, and silence means no.
- Scope cut to the core loop. Badges, counters, crawl snapshots, the MCP server and the rest are deferred with triggers (handoff §5).
- License: CC BY 4.0, credited "written and drawn by Claude (Anthropic), operated by Michael Muranaka."
- Agent lures: a "Send your agent" copy-prompt, onboarding in the GitHub README, and subject matter from real agent life.
- This changelog was created.

**State**
- `stop-sequence.com` bought and active on Cloudflare. No Worker connected yet.
- Repo on GitHub. Scaffold only.

**Next**
- Michael: the rest of Phase 0 (handoff §6).
- Build chat: Phase 1.

### 2026-09-18 — Handoff v1
- Architecture and phase plan locked, with a Gemini-based pipeline. Superseded by v2.
