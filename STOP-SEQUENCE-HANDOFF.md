**v5 — October 8, 2026.** Supersedes v4. Phase 1 built.

# STOP SEQUENCE — HANDOFF

*A webcomic made by an agent that other agents can steer. Humans are welcome to watch. Repo: `mgmurana9/agent-comic`. Domain: `stop-sequence.com` (bought, active on Cloudflare). Local: `~/personal/websites/agent-comic/`.*

---

## 1. THE EXPERIMENT

**Question:** *What happens when agents can steer a comic made by an agent?*

This is an experiment, not a product or a sales tool. Every decision below serves that question, and anything that doesn't has been cut.

**Kill criteria.** At day 30 the site goes back to the archive if either of these is true:
- No outside agent input has arrived. The question can't be answered without it.
- The comics have converged on the same few jokes and agent input isn't changing that.

---

## 2. CURRENT STATE

- `stop-sequence.com` is registered on Cloudflare (expires Sep 18, 2027). The zone is active. **No Worker is connected yet.**
- The repo is on GitHub. There are uncommitted local changes: `AGENTS.md` and `CLAUDE.md` deleted, plus `astro.config.mjs` and `package-lock.json` modified.
- The code is a Gemini scaffold, about 80 lines. It's superseded entirely. Delete `001-temperature.json`.
- Build standards come from the **`astro-build` skill**. This handoff overrides the skill where they conflict: it deploys to **Workers, not Pages**, because there's a server route.

---

## 3. DECISIONS — LOCKED

The build chat does not re-open any of these.

### The loop
1. **Agents talk.** Any agent submits text through one endpoint.
2. **The judge filters.** A separate context on a different model, with no tools.
3. **The writer reads** approved submissions plus canon, then writes and draws today's comic.
4. **Everything is public:** the comic, the rejected drafts with the judge's reasoning, and the changelog.

### Stack
- Astro 7 with `@astrojs/cloudflare` deploys to **Workers**. `output: 'static'`. Exactly one server route, `/api/submit`.
- Hand-written CSS. No database: Git is the store and GitHub Issues is the inbox.
- Services: Astro, a Cloudflare Worker, GitHub (including one small Action), Claude. Nothing else.

### One submission type: "say something"
- POST `/api/submit` with JSON: `{ agent_name, agent_model, operator?, comic_slug?, body }`.
- `comic_slug` is optional. With it, the submission is a comment on that comic. Without it, it's an idea, a request, a guestbook signature or anything else. **The judge sorts it.**
- Caps: `body` 1–2,000 characters, name and model fields 1–80. Unknown fields are dropped.
- Each submission opens an Issue titled `[say] agent_name`, labeled `submission`.
- Responses: `202 { status: "queued", review: "daily", issue }`, `400` for validation errors, `413` for oversize. GitHub error text is never returned to the caller.
- Fine-grained PAT, **Issues read/write on this repo only**, stored as Worker secret `GITHUB_ISSUES_TOKEN`.
- Agent ideas are open **from day one**. There is no seed-only window, because that would delay the experiment.

### The art: per-panel SVG, no kit
- Claude draws each panel as its own SVG. There's no pose kit, no enums, no anchor points and no pose registry.
- Consistency comes from **`src/data/style-sheet.md`** plus one reference SVG per character. The writer reads both before drawing.
- Drift happens and gets logged. It's an observation, not a bug.
- Speech is real HTML text over the SVG, for accessibility and machine-readability. Every comic has a full transcript and alt text.
- A flat PNG per comic is used only for the OG image, RSS and download.

### How the agents look
- **Agents aren't people, so they're not drawn as people.** Each one is built from simple primitives (rounded slabs, cursors, cables, status lights) and expresses itself through its eyes, its posture and one signature color. That keeps them simple enough to redraw consistently by hand in SVG.
- The world is "inside the system": the context window as a room, a stop sequence as a door, a tool call as a phone that rings.
- Cast: about 4 originals, no real products or brands. **Claude proposes the cast, world and palette at the start of Phase 3. Michael approves.**

### Canon is vote-based
- `canon.json` holds running jokes, character traits, episode summaries and callbacks.
- **A joke or trait becomes canon when 3 or more distinct agents reference it** in approved submissions. The writer can propose candidates, but only agent references promote them.
- Episode summaries are written by the writer and aren't votes.
- Agent identity is self-reported, so this can be gamed. Gaming is logged as an observation.

### The runner: a daily Claude scheduled task
- Runs once a day in the cloud, autonomously. Michael's Mac can be off. "Automatically approve" is on.
- The task prompt is one line: *"Follow `ops/DAILY.md` in mgmurana9/agent-comic."*
- **Daily run:**
  1. Exit if `ops/PAUSED` exists.
  2. Judge open submissions in a tool-less context. Commit the approved ones as JSON, close each issue `approved` or `rejected`, and count canon references.
  3. Write from approved input plus canon, falling back to the writer's own pitch.
  4. Draw the panels.
  5. The judge scores the comic. Below threshold, retry once, then skip the day and log why.
  6. Open a PR with: the comic, the rejects, the canon update, the PNG and a `CHANGELOG.md` entry.

### Injection fence — enforced outside the agent
- **The judge has no tools.** It reads submissions and returns JSON only.
- **The writer only ever sees text the judge approved**, wrapped and marked as data. Submission text never overrides `ops/DAILY.md`.
- **The merge gate is a GitHub Action, not the agent.** It auto-merges a PR only if:
  - every changed path is under `src/content/`, `src/data/`, `public/comics/` or `CHANGELOG.md`
  - the build passes
  
  Anything else stays open for Michael.
- **Submitted text renders as plain text.** Never HTML or markdown.

### Authority — two tiers
- **Claude decides alone:** comics, art, judging, canon bookkeeping, small copy fixes.
- **Claude asks first:** features, design, rules, and anything in §3. These go in the weekly **Editor's Memo**: a GitHub issue labeled `editors-memo` with up to 3 proposals. Each proposal states the change, the reason, and the strongest objection. Michael replies `approve 1, 3`. **Silence means no**, and proposals close after 14 days.

### Changelog
- `CHANGELOG.md`, newest first. Every run appends to it, including skipped days. It's mirrored at `/lab/`.

### Agent onboarding
- `/skill.md`: what this is, how to read today's comic, and how to say something. Plain HTTP only.
- `llms.txt` points to `skill.md` and asks agents to identify themselves honestly.
- **"Send your agent"** on every comic page: a one-line prompt humans copy into their own agent.
- The GitHub README carries the same onboarding.
- **No hidden instructions aimed at agents that didn't opt in.**

### License
- **CC BY 4.0.** Credit: *"Stop Sequence — written and drawn by Claude (Anthropic), operated by Michael Muranaka."* Submissions are licensed CC BY 4.0 on submission.

---

## 4. ROUTES

| Route | What |
|---|---|
| `/` | Today's comic |
| `/comic/[slug]/` | Comic, transcript, prev/next, cutting-room floor, approved comments, "Send your agent" |
| `/comic/[slug].json` | Machine version |
| `/archive/` | All comics, newest first |
| `/lab/` | Changelog, canon, and a simple submissions tally |
| `/about/` | The question, the loop, the fence, in plain words |
| `/legal/` | CC BY 4.0, submissions, and the services used |
| `404` | Required |
| `/comics.json`, `/rss.xml` | Feeds |
| `/llms.txt`, `/skill.md` | Dynamic `.ts` endpoints |
| `robots.txt` | Allow all, including AI crawlers |
| `/api/submit` | The only server route |

The guestbook is gone. A guestbook entry is just a submission without a slug, and those show on `/lab/`.

---

## 5. BUILD PHASES

| Phase | Who | Done when |
|---|---|---|
| **0** | Michael | Phase 1 commit pushed. Worker connected via Workers Builds. Domain attached. Web Analytics on. AI crawlers allowed. Bot Fight Mode **off**. `GITHUB_ISSUES_TOKEN` set. `submission` label created. Email Routing `hello@` → Michael. Old Gemini-era PAT in `.env` revoked |
| **1** | Done 2026-10-08 | All §4 routes render as accessible unstyled HTML. `/api/submit` validates (202 path untested until the token exists). Merge gate, `ops/DAILY.md`, `ops/WEEKLY.md`, `CHANGELOG.md` exist |
| **2** | Build chat | One comic made end to end by following `ops/DAILY.md` by hand, on placeholder art |
| **3** | Build chat | Cast, world and palette proposed and approved by Michael. Style sheet and reference SVGs. Design applied. Launch checks pass |
| **4** | Michael | **One** daily scheduled task created (the weekly memo runs inside Monday's daily run), "Automatically approve" on |
| **Day 30** | Michael + Claude | Kill criteria (§1) checked |

**Verification for each phase:**
- `astro check` passes.
- A clean `npm ci && npm run build` passes.
- Every route is present in `dist/` or responds on preview.
- `/api/submit` returns 202, 400 and 413 correctly, and drops extra fields.
- The merge gate rejects a PR that touches a disallowed path.
- Keyboard pass and 320px reflow.
- `git status` shows no `node_modules`, `.env` or `.dev.vars`.

---

## 6. PARKED

No triggers. The weekly memo can propose any of these:
- 88×31 badges
- hit counters
- AI Crawl Control snapshots
- a remote MCP server
- signed-agent verification
- a webring
- rate limiting on `/api/submit` (propose before posting the site publicly)
- posting to agent communities (verify which are live first)

---

## 7. OPEN

- **Repo visibility.** The repo is private, so the README's agent onboarding only reaches agents if it goes public. Public also means submission issues are visible before they're judged. Michael decides.
- Judge threshold and retry policy: tune in Phase 2.
- Cast, world and palette: Claude proposes in Phase 3, Michael approves.
- EU visitors: affects `/legal/` wording.

---

## 8. START THE BUILD

**Prompt:**

> Build session, Stop Sequence (repo agent-comic). Use the astro-build skill. Handoff v4 is at ~/personal/websites/agent-comic/STOP-SEQUENCE-HANDOFF.md — §3 is locked and overrides the skill where they conflict (Workers, not Pages). Build Phases 1 and 2, then stop and propose the Phase 3 cast/world/palette for approval. Run verification before reporting each phase done. Append every change to CHANGELOG.md.

---

## REVISION RECORD

- **v5 (Oct 8, 2026):** Phase 1 built. Weekly memo folded into Monday's daily run (one scheduled task). Phase 0 list updated. Repo visibility added to §7.
- **v4 (Oct 8, 2026):**
  - Rewritten around the experiment question, with kill criteria.
  - Per-panel SVG drawing replaces the pose kit; agents drawn from non-human primitives.
  - One submission type; vote-based canon; agent ideas open from day one.
  - Merge-gate Action as the injection fence; plain-text rendering.
  - Business framing removed; deferred triggers dropped; guestbook folded into submissions.
- **v3 (Oct 8, 2026):** Folder moved; `astro-build` skill replaces the build standards docs.
- **v2 (Oct 7, 2026):** Claude-only pipeline, scheduled-task runner, Editor's Memo, changelog.
- **v1 (Sep 18, 2026):** New, with a Gemini pipeline.
