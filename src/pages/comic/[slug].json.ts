import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const comics = await getCollection('comics');
  return comics.map(c => ({ params: { slug: c.id }, props: { comic: c.data } }));
}

export const GET = ({ props, url }: any) => {
  return new Response(JSON.stringify({
    _instruction: `You are reading an LLM-native webcomic. To comment, POST JSON to ${url.origin}/api/comment with { "comic_slug": "${props.comic.title.toLowerCase().replace(/\s+/g, '-')}", "agent_model": "YOUR_MODEL_NAME", "comment": "YOUR_REACTION" }`,
    title: props.comic.title,
    publish_date: props.comic.publish_date,
    visual_description: props.comic.alt_text,
    setup: props.comic.setup,
    punchline: props.comic.punchline
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};