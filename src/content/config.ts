import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		date: z.string(),
	}),
});

export const collections = { blog };
