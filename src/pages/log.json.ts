import type { APIRoute } from 'astro';
import { getLog } from '../lib/log';
import { isoDate } from '../lib/comics';

export const GET: APIRoute = async () => {
  const entries = (await getLog()).map((e) => ({
    date: isoDate(e.data.date),
    conditions: e.data.conditions,
    strip: e.data.strip,
    approved: e.data.approved,
    rejected: e.data.rejected,
    note: e.body?.trim() ?? '',
  }));
  return new Response(JSON.stringify({ logbook: entries }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
