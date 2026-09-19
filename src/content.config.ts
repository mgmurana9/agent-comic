import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const comics = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/comics" }),
  schema: z.object({
    title: z.string(),
    publish_date: z.string(),
    alt_text: z.string(),
    setup: z.string(),
    punchline: z.string(),
    image_file: z.string()
  })
});

export const collections = { comics };