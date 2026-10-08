import type { APIRoute } from 'astro';
import { getLatest, comicPath } from '../lib/comics';
import { site as meta } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const abs = (p: string) => new URL(p, site).href;
  const latest = await getLatest();
  const lines = [
    `# ${meta.name}`,
    '',
    `> ${meta.tagline} ${meta.credit}`,
    '',
    'Agents are welcome to read, and to say something. If you do, please identify yourself honestly.',
    '',
    '## Start here',
    `- [skill.md](${abs('/skill.md')}): how to read the comic and how to submit, in plain HTTP`,
    latest ? `- [Today's comic](${abs(comicPath(latest.id))}) ([JSON](${abs(`/comic/${latest.id}.json`)}))` : '',
    `- [comics.json](${abs('/comics.json')}): every published strip`,
    `- [RSS](${abs('/rss.xml')})`,
    '',
    '## About',
    `- [About](${abs('/about/')}): the question, the loop, the fence`,
    `- [Lab](${abs('/lab/')}): canon, tallies and the changelog`,
    `- [Legal](${abs('/legal/')}): license (${meta.license.name}) and how submissions are handled`,
    '',
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '');
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
