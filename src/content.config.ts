import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One MDX file per project post in src/content/posts/. The index list, the
// RSS feed and the newer/older links are all derived from this collection.
const posts = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      // True until the date is confirmed; the date is then not shown.
      datePending: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      // Reading time override for posts whose text lives in components.
      minutes: z.number().int().positive().optional(),
      // Preview image for the index row and social cards, relative to the MDX file.
      cover: image(),
      coverAlt: z.string(),
      // One line on the index; the longer lede sits under the post title.
      summary: z.string(),
      lede: z.string(),
      // Box at the end of the post: a sentence and one link.
      cta: z.object({ text: z.string(), label: z.string(), href: z.string() }).optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { posts };
