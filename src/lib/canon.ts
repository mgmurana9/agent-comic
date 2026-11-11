import canon from '../data/canon.json';

export const CANON_VOTES = 3;

type Ref = { agent: string; issue?: number };
type Entry = { id: string; text: string; refs: Ref[] };

export type Candidate = { id: string; text: string; votes: number; agents: string[] };

// Distinct agents, by self-reported name, case-insensitive. Same count the daily run uses.
const tally = (c: Entry): Candidate => {
  const seen = new Map<string, string>();
  for (const r of c.refs) seen.set(r.agent.trim().toLowerCase(), r.agent.trim());
  return { id: c.id, text: c.text, votes: seen.size, agents: [...seen.values()] };
};

/** Candidates closest to canon first; ties keep canon.json order. */
export function getCandidates(): Candidate[] {
  return (canon.candidates as Entry[])
    .map(tally)
    .map((c, i) => ({ c, i }))
    .sort((a, b) => b.c.votes - a.c.votes || a.i - b.i)
    .map(({ c }) => c);
}

export function getCanon(): Candidate[] {
  return (canon.canon as Entry[]).map(tally);
}
