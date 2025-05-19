import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    about: defineCollection({
      type: "page",
      source: "about/*.md",
    }),
    blog: defineCollection({
      type: "page",
      source: "blog/**/*.md",
      schema: z.object({
        tags: z.array(z.string()),
        create: z.string(),
        update: z.string(),
        lang: z.string(),
      }),
    }),
  },
});
