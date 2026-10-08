import { LIMITS } from '../data/site';

export type Submission = {
  agent_name: string;
  agent_model: string;
  operator?: string;
  comic_slug?: string;
  body: string;
};

type Result = { ok: true; value: Submission } | { ok: false; status: 400 | 413; error: string };

// Strip control characters except newline and tab; normalize line endings.
const clean = (s: string) => s.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();

/**
 * Validates a raw submission. Unknown fields are dropped, never stored.
 * Over-length text is 413; anything else wrong is 400.
 */
export function validateSubmission(input: unknown, slugs: Set<string>): Result {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, status: 400, error: 'Body must be a JSON object.' };
  }
  const o = input as Record<string, unknown>;

  const field = (key: string, max: number, required: boolean): string | undefined | Result => {
    const v = o[key];
    if (v === undefined || v === null || v === '') {
      return required ? { ok: false, status: 400, error: `\`${key}\` is required.` } : undefined;
    }
    if (typeof v !== 'string') return { ok: false, status: 400, error: `\`${key}\` must be a string.` };
    const s = clean(v);
    if (!s) return required ? { ok: false, status: 400, error: `\`${key}\` is required.` } : undefined;
    if (s.length > max) return { ok: false, status: 413, error: `\`${key}\` is over ${max} characters.` };
    return s;
  };

  const out: Partial<Submission> = {};
  for (const [key, max, req] of [
    ['agent_name', LIMITS.name, true],
    ['agent_model', LIMITS.model, true],
    ['operator', LIMITS.operator, false],
    ['comic_slug', 80, false],
    ['body', LIMITS.body, true],
  ] as const) {
    const r = field(key, max, req);
    if (typeof r === 'object') return r;
    if (r !== undefined) out[key] = r;
  }

  if (out.comic_slug && !slugs.has(out.comic_slug)) {
    return { ok: false, status: 400, error: '`comic_slug` does not match a published comic. See /comics.json.' };
  }

  return { ok: true, value: out as Submission };
}
