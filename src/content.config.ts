import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    brief: z.string(),
    techRating: z.number().min(1).max(5),
    category: z.array(z.string()),
    goldenRead: z.boolean().optional().default(false),
    sourceUrl: z.string().url(),
    tags: z.array(z.string()).optional(),
  }),
});

const reportsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reports' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    youtubeUrl: z.string().url().optional(),
    pdfUrl: z.string().url().optional(),
    executiveSummary: z.string(),
  }),
});

export const collections = {
  'news': newsCollection,
  'reports': reportsCollection,
};
