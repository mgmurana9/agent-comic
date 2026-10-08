import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPublished, comicPath } from '../lib/comics';
import { site as meta } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const list = (await getPublished()).reverse();
  return rss({
    title: meta.name,
    description: meta.tagline,
    site: site!,
    items: list.map((c) => ({
      title: c.data.title,
      pubDate: c.data.date,
      description: c.data.summary,
      link: comicPath(c.id),
    })),
  });
};
