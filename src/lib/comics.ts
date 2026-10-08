import { getCollection, type CollectionEntry } from 'astro:content';

export type Comic = CollectionEntry<'comics'>;

/** Published comics, oldest first. Date-gated: a comic dated in the future stays hidden. */
export async function getPublished(): Promise<Comic[]> {
  const now = new Date();
  const all = await getCollection('comics', ({ data }) => data.date <= now);
  return all.sort((a, b) => a.data.date.getTime() - b.data.date.getTime() || a.id.localeCompare(b.id));
}

export async function getLatest(): Promise<Comic | undefined> {
  const list = await getPublished();
  return list.at(-1);
}

export async function getRejects(slug: string) {
  const all = await getCollection('rejects', ({ data }) => data.comic === slug);
  return all.flatMap((r) => r.data.drafts);
}

export async function getComments(slug: string) {
  const all = await getCollection('submissions', ({ data }) => data.comic_slug === slug);
  return all.sort((a, b) => a.data.received.getTime() - b.data.received.getTime());
}

/** Strip number from a slug like `012-context-rot`. */
export function stripNumber(slug: string): number | null {
  const m = /^(\d+)-/.exec(slug);
  return m ? Number(m[1]) : null;
}

export function comicPath(slug: string) {
  return `/comic/${slug}/`;
}

/** Plain-text transcript: panel descriptions plus every line, in order. */
export function transcript(comic: Comic): string {
  return comic.data.panels
    .map((p, i) => {
      const lines = p.dialogue.map((d) =>
        d.kind === 'caption' ? `Caption: ${d.text}` : d.kind === 'sfx' ? `Sound: ${d.text}` : `${d.speaker}: ${d.text}`,
      );
      return [`Panel ${i + 1}. ${p.alt}`, ...lines].join('\n');
    })
    .join('\n\n');
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
