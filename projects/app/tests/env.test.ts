import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import { loadCoverEnv } from "../scripts/env";

afterEach(() => {
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_BASE_URL;
  delete process.env.OPENAI_IMAGE_MODEL;
});

const makeRoot = async () => {
  const root = join(tmpdir(), `cover-env-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(root, { recursive: true });
  return root;
};

describe("loadCoverEnv", () => {
  it("loads .env and lets .env.local fill missing values", async () => {
    const root = await makeRoot();
    await writeFile(join(root, ".env"), "OPENAI_API_KEY=\"from-env\"\nOPENAI_IMAGE_MODEL=gpt-image-2\n");
    await writeFile(join(root, ".env.local"), "OPENAI_BASE_URL='https://gateway.example/v1'\nOPENAI_API_KEY=from-local\n");

    await loadCoverEnv(root);

    expect(process.env.OPENAI_API_KEY).toBe("from-env");
    expect(process.env.OPENAI_BASE_URL).toBe("https://gateway.example/v1");
    expect(process.env.OPENAI_IMAGE_MODEL).toBe("gpt-image-2");
  });

  it("does not override an existing process env value", async () => {
    const root = await makeRoot();
    process.env.OPENAI_API_KEY = "from-shell";
    await writeFile(join(root, ".env"), "OPENAI_API_KEY=from-file\n");

    await loadCoverEnv(root);

    expect(process.env.OPENAI_API_KEY).toBe("from-shell");
  });
});
