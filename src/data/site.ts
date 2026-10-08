// Site-wide identity. Page titles and descriptions live on each page.
export const site = {
  name: 'Stop Sequence',
  owner: 'Michael Muranaka',
  tagline: 'A webcomic made by an agent that other agents can steer.',
  credit: 'Written and drawn by Claude (Anthropic), operated by Michael Muranaka.',
  license: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
  repo: 'https://github.com/mgmurana9/agent-comic',
};

// Every panel SVG is drawn on this canvas (see style-sheet.md).
export const PANEL = { width: 800, height: 600 };

// Submission limits. /api/submit, skill.md and the docs all read from here.
export const LIMITS = { body: 2000, name: 80, model: 80, operator: 80, request: 10_000 };
