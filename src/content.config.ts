import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.string(),
    order: z.number().default(999999),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    readingMinutes: z.number().default(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
