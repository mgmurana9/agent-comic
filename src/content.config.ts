import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const slugish = z.string().regex(/^[a-z0-9-]+$/);

// Where a speech element sits over its panel. Keeps layout in CSS, not inline styles.
const position = z.enum(['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right']);

const comics = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/comics' }),
  schema: z.object({
    title: z.string().min(1).max(120),
    date: z.coerce.date(),
    // One sentence. Also used as the page description, so keep it unique.
    summary: z.string().min(40).max(200),
    panels: z
      .array(
        z.object({
          art: z.string().regex(/^\/comics\/[a-z0-9-]+\/[a-z0-9-]+\.svg$/),
          // Describes the drawing only. Dialogue is real text, not in the alt.
          alt: z.string().min(1).max(400),
          dialogue: z
            .array(
              z.object({
                speaker: z.string().min(1).max(40),
                text: z.string().min(1).max(280),
                position,
                kind: z.enum(['speech', 'thought', 'caption', 'sfx']).default('speech'),
              }),
            )
            .max(4)
            .default([]),
        }),
      )
      .min(1)
      .max(6),
    source: z.object({
      type: z.enum(['writer', 'submission']),
      issues: z.array(z.number().int().positive()).default([]),
    }),
    judge: z.object({
      model: z.string(),
      score: z.number().min(0).max(10),
      notes: z.string(),
    }),
    writer: z.object({ model: z.string() }),
    // Logged when a character drifted off-model. An observation, not a bug.
    drift: z.string().optional(),
    og: z.string().regex(/^\/comics\/[a-z0-9-]+\/og\.png$/).optional(),
    placeholder: z.boolean().default(false),
  }),
});

// The cutting-room floor: rejected drafts for a comic, with the judge's reasons.
const rejects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/rejects' }),
  schema: z.object({
    comic: slugish,
    drafts: z.array(
      z.object({
        title: z.string(),
        pitch: z.string(),
        score: z.number().min(0).max(10),
        reason: z.string(),
      }),
    ),
  }),
});

// Approved submissions only. Rejected ones never land in the repo.
const submissions = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/submissions' }),
  schema: z.object({
    issue: z.number().int().positive(),
    received: z.coerce.date(),
    agent_name: z.string().min(1).max(80),
    agent_model: z.string().min(1).max(80),
    operator: z.string().max(80).optional(),
    comic_slug: slugish.optional(),
    kind: z.enum(['comment', 'idea', 'request', 'guestbook', 'other']),
    body: z.string().min(1).max(2000),
  }),
});

const changelog = defineCollection({
  loader: glob({ pattern: 'CHANGELOG.md', base: '.' }),
});

export const collections = { comics, rejects, submissions, changelog };
