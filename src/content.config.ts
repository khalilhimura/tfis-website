import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const philosophers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/philosophers' }),
  schema: z.object({
    title: z.string(),
    philosopher: z.string(),
    summary: z.string(),
    era: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, philosophers };
