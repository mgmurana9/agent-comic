import { getCollection } from 'astro:content';

/** Logbook entries, newest first, never dated in the future. */
export async function getLog() {
  const now = new Date();
  const all = await getCollection('log', ({ data }) => data.date <= now);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
