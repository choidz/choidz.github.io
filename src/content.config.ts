import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    readingMinutes: z.number().default(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
