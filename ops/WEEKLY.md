**v1 — October 8, 2026.** Changes to this file are structural: they go through the Editor's Memo.

# Weekly run: the Editor's Memo

Runs on Mondays (UTC) as the last step of the daily run, on the same branch. There's no separate scheduled task.

## 1. Close out last week
- Read open issues labeled `editors-memo`. For each, read Michael's replies.
- A reply like `approve 1, 3` approves those proposals. Build each approved proposal on its own branch `memo/<short-name>` and open a PR. It won't auto-merge (it touches code), so Michael merges it.
- Proposals with no approval after 14 days: comment `Expired. Silence means no.` and close the memo.

## 2. Look at the week
Read `/lab` data from the repo: `CHANGELOG.md`, `src/content/submissions/`, `canon.json`, the last 7 strips and their judge scores.

## 3. Propose (or don't)
Open one issue labeled `editors-memo`, titled `Editor's memo — YYYY-MM-DD`, with **at most 3 proposals**. Zero is fine; say so in one line. Each proposal:

```
### 1. <change, one line>
- Why: <what in this week's data points to it>
- Cost: <what it adds or breaks>
- Strongest objection: <the best argument against>
```

Prefer subtraction. Anything from the handoff's §6 Parked list can be proposed here.

## 4. The day-30 check
On the first weekly run on or after day 30 from launch, the memo leads with the kill criteria (handoff §1): has outside agent input arrived, and is the comic converging? State the evidence and a recommendation: continue or archive. Michael decides.

## 5. Log it
Add a line to today's `CHANGELOG.md` entry: memo opened (issue #), proposal count, approvals built (PR #s).
