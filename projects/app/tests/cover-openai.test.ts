import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it, vi } from "vitest";

import type { ArticleBrief } from "../scripts/cover-core";
import { OpenAIImageProvider } from "../scripts/cover-openai";

const brief: ArticleBrief = {
  title: "Demo",
  lang: "en",
  tags: ["tech"],
  summary: "A short article summary.",
  mood: "precise",
  visualMetaphors: ["paper notes"],
  avoid: ["visible text"],
  coverAltDraft: "Demo alt",
};

const jsonResponse = (body: unknown, ok = true, status = 200) => {
  return {
    ok,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response;
};

describe("OpenAIImageProvider", () => {
  it("requires an API key", async () => {
    const provider = new OpenAIImageProvider({ apiKey: "", fetchImpl: vi.fn() });

    await expect(provider.generate({ prompt: "prompt", brief })).rejects.toThrow(/OPENAI_API_KEY/);
  });

  it("extracts image bytes and response metadata", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({
      id: "resp_123",
      output: [
        {
          type: "image_generation_call",
          result: Buffer.from([4, 5, 6]).toString("base64"),
        },
      ],
    }));
    const provider = new OpenAIImageProvider({ apiKey: "test-key", fetchImpl });

    const result = await provider.generate({ prompt: "prompt", brief });

    expect(Array.from(result.bytes)).toEqual([4, 5, 6]);
    expect(result.responseId).toBe("resp_123");
    expect(result.model).toBe("gpt-image-2");
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("uses OPENAI_BASE_URL for the responses endpoint", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({
      output: [
        {
          type: "image_generation_call",
          result: Buffer.from([1]).toString("base64"),
        },
      ],
    }));
    const provider = new OpenAIImageProvider({
      apiKey: "test-key",
      baseUrl: "https://gateway.example/v1/",
      fetchImpl,
    });

    await provider.generate({ prompt: "prompt", brief });

    expect(fetchImpl.mock.calls[0][0]).toBe("https://gateway.example/v1/responses");
  });

  it("passes the previous local image as an input image for revisions", async () => {
    const root = join(tmpdir(), `cover-openai-${Date.now()}`);
    await mkdir(root, { recursive: true });
    const previousImagePath = join(root, "previous.png");
    await writeFile(previousImagePath, Buffer.from([7, 8, 9]));

    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({
      output: [
        {
          type: "image_generation_call",
          result: Buffer.from([1]).toString("base64"),
        },
      ],
    }));
    const provider = new OpenAIImageProvider({ apiKey: "test-key", fetchImpl });

    await provider.generate({
      prompt: "prompt",
      brief,
      previousImagePath,
      revisionInstruction: "make it quieter",
    });

    const request = JSON.parse(fetchImpl.mock.calls[0][1].body as string);
    const content = request.input[0].content;
    expect(request.model).toBe("gpt-5.5");
    expect(request.tool_choice).toEqual({ type: "image_generation" });
    expect(content.some((part: { type: string }) => part.type === "input_image")).toBe(true);
    expect(content[0].text).toContain("Revision request: make it quieter");
  });

  it("surfaces non-OK and malformed responses as clear errors", async () => {
    const failedProvider = new OpenAIImageProvider({
      apiKey: "test-key",
      fetchImpl: vi.fn().mockResolvedValue(jsonResponse({ error: "nope" }, false, 500)),
    });
    const malformedProvider = new OpenAIImageProvider({
      apiKey: "test-key",
      fetchImpl: vi.fn().mockResolvedValue(jsonResponse({ output: [] })),
    });

    await expect(failedProvider.generate({ prompt: "prompt", brief })).rejects.toThrow(/500/);
    await expect(malformedProvider.generate({ prompt: "prompt", brief })).rejects.toThrow(/did not include an image/);
  });
});
