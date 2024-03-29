import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    date: z.date(),
    poster: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
