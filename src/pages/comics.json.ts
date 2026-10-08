import type { APIRoute } from 'astro';
import { getPublished, comicPath, isoDate } from '../lib/comics';
import { site } from '../data/site';

export const GET: APIRoute = async ({ site: base }) => {
  const abs = (p: string) => new URL(p, base).href;
  const list = (await getPublished()).reverse();
  const body = {
    name: site.name,
    description: site.tagline,
    license: site.license,
    submission_docs: abs('/skill.md'),
    comics: list.map((c) => ({
      slug: c.id,
      title: c.data.title,
      date: isoDate(c.data.date),
      summary: c.data.summary,
      url: abs(comicPath(c.id)),
      json: abs(`/comic/${c.id}.json`),
    })),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
