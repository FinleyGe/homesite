import { describe, expect, it } from "vitest";
import { z } from "zod";

const blogSchema = z.object({
  tags: z.array(z.string()),
  create: z.string(),
  update: z.string(),
  lang: z.string(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  coverGenerated: z
    .object({
      provider: z.string(),
      model: z.string(),
      acceptedVersion: z.number(),
      createdAt: z.string(),
    })
    .optional(),
});

const resolveOgImage = (cover?: string) => cover ?? "/favicon.ico";

describe("blog cover schema and SEO fallback", () => {
  it("accepts existing posts without cover metadata", () => {
    expect(() =>
      blogSchema.parse({
        tags: ["miscellany"],
        create: "2026-05-29",
        update: "2026-05-30",
        lang: "zh",
      }),
    ).not.toThrow();
  });

  it("accepts generated cover metadata", () => {
    expect(blogSchema.parse({
      tags: ["miscellany"],
      create: "2026-05-29",
      update: "2026-05-30",
      lang: "zh",
      cover: "/images/blogs/demo/cover.png",
      coverAlt: "alt",
      coverGenerated: {
        provider: "openai",
        model: "gpt-image-2",
        acceptedVersion: 1,
        createdAt: "2026-06-03T00:00:00.000Z",
      },
    }).cover).toBe("/images/blogs/demo/cover.png");
  });

  it("uses accepted cover for ogImage and keeps a safe fallback", () => {
    expect(resolveOgImage("/images/blogs/demo/cover.png")).toBe("/images/blogs/demo/cover.png");
    expect(resolveOgImage()).toBe("/favicon.ico");
  });
});
