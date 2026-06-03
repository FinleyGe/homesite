import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import {
  acceptCandidate,
  appendHistory,
  buildArticleBrief,
  buildImagePrompt,
  parsePost,
  readPost,
  resolveCoverPaths,
  serializePost,
  writeCandidate,
} from "../scripts/cover-core";

const makeRoot = async () => {
  const root = join(tmpdir(), `cover-core-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(join(root, "content/blog"), { recursive: true });
  return root;
};

const postSource = `---
lang: zh
create: 2026-05-29
update: 2026-05-30
tags:
  - 同乐会
  - miscellany
---
# 塑造人生观的几句话

正文第一段。

\`\`\`ts
console.log("code should be stripped from brief");
\`\`\`
`;

describe("cover core", () => {
  it("rejects unsafe slugs before resolving paths", () => {
    expect(() => resolveCoverPaths("../secret", "/repo")).toThrow(/Unsafe blog slug/);
    expect(() => resolveCoverPaths("/absolute", "/repo")).toThrow(/Unsafe blog slug/);
    expect(resolveCoverPaths("nested/post", "/repo").markdownPath)
      .toBe(join("/repo", "content/blog/nested/post.md"));
  });

  it("parses YAML frontmatter and preserves the body when serializing cover fields", () => {
    const parsed = parsePost(postSource);
    const serialized = serializePost(parsed, {
      cover: "/images/blogs/post/cover.png",
      coverAlt: "一张安静的封面图",
      coverGenerated: {
        provider: "openai",
        model: "gpt-image-2",
        acceptedVersion: 2,
        createdAt: "2026-06-03T00:00:00.000Z",
      },
    });

    expect(serialized).toContain("cover: /images/blogs/post/cover.png");
    expect(serialized).toContain("coverAlt: 一张安静的封面图");
    expect(serialized).toContain("acceptedVersion: 2");
    expect(serialized.slice(serialized.indexOf("# 塑造人生观的几句话"))).toBe(parsed.body);
  });

  it("fails early for missing or malformed frontmatter", () => {
    expect(() => parsePost("# No frontmatter")).toThrow(/must start with YAML frontmatter/);
    expect(() => parsePost("---\nlang: [\n---\nbody")).toThrow(/Invalid YAML frontmatter/);
  });

  it("builds a prompt contract from philosophical and technical articles", () => {
    const philosophical = buildArticleBrief(parsePost(postSource));
    const technical = buildArticleBrief(parsePost(`---
lang: en
create: 2026-01-01
update: 2026-01-02
tags:
  - tech
---
# Tree-sitter Query Notes

This article explains query captures, grammar nodes, and TypeScript code search.
`));

    expect(philosophical.coverAltDraft).toContain("《塑造人生观的几句话》");
    expect(philosophical.mood).toContain("reflective");
    expect(technical.mood).toContain("precise");

    const prompt = buildImagePrompt(technical);
    expect(prompt).toContain("Avoid:");
    expect(prompt).toContain("visible text");
    expect(prompt).toContain("Tree-sitter Query Notes");
    expect(prompt).toContain("Return an image with no visible words or letters.");
  });

  it("writes drafts privately, appends history, and accepts only the final public cover", async () => {
    const root = await makeRoot();
    const paths = resolveCoverPaths("demo-post", root);
    await writeFile(paths.markdownPath, postSource);

    const candidatePath = await writeCandidate(paths, 1, Uint8Array.from([1, 2, 3]));
    await appendHistory(paths, {
      action: "initial",
      version: 1,
      imagePath: candidatePath,
      prompt: "prompt",
      brief: buildArticleBrief(parsePost(postSource)),
      provider: "openai",
      model: "gpt-image-2",
      responseId: "resp_123",
      createdAt: "2026-06-03T00:00:00.000Z",
    });

    await expect(stat(candidatePath)).resolves.toBeTruthy();
    await expect(stat(paths.historyPath)).resolves.toBeTruthy();
    await expect(stat(paths.publicCoverPath)).rejects.toMatchObject({ code: "ENOENT" });

    const accepted = await acceptCandidate(
      paths,
      candidatePath,
      await readPost(paths.markdownPath),
      "确认后的 alt",
      1,
      "openai",
      "gpt-image-2",
      new Date("2026-06-03T00:00:00.000Z"),
    );

    expect(accepted.cover).toBe("/images/blogs/demo-post/cover.png");
    expect(await readFile(paths.publicCoverPath)).toEqual(Buffer.from([1, 2, 3]));
    const updatedPost = await readFile(paths.markdownPath, "utf8");
    expect(updatedPost).toContain("coverAlt: 确认后的 alt");
    expect(updatedPost).toContain("createdAt: 2026-06-03T00:00:00.000Z");
  });

  it("does not publish or update frontmatter when accept copy fails", async () => {
    const root = await makeRoot();
    const paths = resolveCoverPaths("copy-fails", root);
    await writeFile(paths.markdownPath, postSource);

    await expect(acceptCandidate(
      paths,
      join(paths.privateDir, "missing.png"),
      await readPost(paths.markdownPath),
      "alt",
      1,
      "openai",
      "gpt-image-2",
      new Date("2026-06-03T00:00:00.000Z"),
    )).rejects.toThrow();

    await expect(stat(paths.publicCoverPath)).rejects.toMatchObject({ code: "ENOENT" });
    expect(await readFile(paths.markdownPath, "utf8")).toBe(postSource);
  });

  it("replaces an existing public cover only after a successful accept", async () => {
    const root = await makeRoot();
    const paths = resolveCoverPaths("existing-cover", root);
    await writeFile(paths.markdownPath, postSource);
    await mkdir(paths.publicDir, { recursive: true });
    await writeFile(paths.publicCoverPath, Buffer.from([9, 9, 9]));
    const candidatePath = await writeCandidate(paths, 2, Uint8Array.from([3, 2, 1]));

    await acceptCandidate(
      paths,
      candidatePath,
      await readPost(paths.markdownPath),
      "new alt",
      2,
      "openai",
      "gpt-image-2",
      new Date("2026-06-03T00:00:00.000Z"),
    );

    expect(await readFile(paths.publicCoverPath)).toEqual(Buffer.from([3, 2, 1]));
    expect(await readFile(paths.markdownPath, "utf8")).toContain("acceptedVersion: 2");
  });
});
