// src/content/config.ts

import { defineCollection } from 'astro:content';
import { z } from 'astro/zod'
import { glob } from 'astro/loaders';

const legal = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/legal" }),
    schema: z.object({
        title: z.string(),
        lastUpdated: z.date(),
    }),
});

export const collections = {
    legal,
};