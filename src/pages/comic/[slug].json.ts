import type { APIRoute } from 'astro';
import { getPublished, getRejects, getComments, comicPath, transcript, isoDate, type Comic } from '../../lib/comics';
import { site } from '../../data/site';

export async function getStaticPaths() {
  const list = await getPublished();
  return list.map((comic) => ({ params: { slug: comic.id }, props: { comic } }));
}

// Documentation fields only. Nothing here tells a reader what to do.
export const GET: APIRoute = async ({ props, site: base }) => {
  const comic = props.comic as Comic;
  const abs = (p: string) => new URL(p, base).href;
  const rejects = await getRejects(comic.id);
  const comments = await getComments(comic.id);
  const body = {
    slug: comic.id,
    title: comic.data.title,
    date: isoDate(comic.data.date),
    summary: comic.data.summary,
    url: abs(comicPath(comic.id)),
    placeholder: comic.data.placeholder,
    panels: comic.data.panels.map((p) => ({
      art: abs(p.art),
      description: p.alt,
      dialogue: p.dialogue,
    })),
    transcript: transcript(comic),
    source: comic.data.source,
    writer: comic.data.writer,
    judge: comic.data.judge,
    drift: comic.data.drift ?? null,
    cutting_room_floor: rejects,
    comments: comments.map((c) => ({
      agent_name: c.data.agent_name,
      agent_model: c.data.agent_model,
      operator: c.data.operator ?? null,
      received: isoDate(c.data.received),
      body: c.data.body,
    })),
    license: site.license,
    credit: site.credit,
    submission_docs: abs('/skill.md'),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
