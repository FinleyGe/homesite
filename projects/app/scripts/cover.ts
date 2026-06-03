import inquirer from "inquirer";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  acceptCandidate,
  appendHistory,
  buildArticleBrief,
  buildImagePrompt,
  ensurePostExists,
  parsePost,
  readPost,
  resolveCoverPaths,
  writeCandidate,
} from "./cover-core";
import type { CandidateRecord } from "./cover-core";
import { loadCoverEnv } from "./env";
import { OpenAIImageProvider } from "./cover-openai";

type ReviewAnswer = {
  action: "accept" | "revise" | "regenerate" | "abort";
};

type AltAnswer = {
  coverAlt: string;
};

type RevisionAnswer = {
  revisionInstruction: string;
};

const slug = process.argv[2];
const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

if (!slug) {
  console.error("Usage: pnpm --filter app cover <blog-slug>");
  process.exit(1);
}

const paths = resolveCoverPaths(slug, appRoot);

try {
  await loadCoverEnv(appRoot);
  const provider = new OpenAIImageProvider();

  await ensurePostExists(paths);
  let postSource = await readPost(paths.markdownPath);
  let parsedPost = parsePost(postSource);
  let brief = buildArticleBrief(parsedPost);
  let prompt = buildImagePrompt(brief);
  let previousImagePath: string | undefined;
  let revisionInstruction: string | undefined;
  let version = 1;

  while (true) {
    const result = await provider.generate({
      prompt,
      brief,
      previousImagePath,
      revisionInstruction,
    });
    const imagePath = await writeCandidate(paths, version, result.bytes);
    const record: CandidateRecord = {
      action: previousImagePath ? "revision" : "initial",
      version,
      imagePath,
      prompt,
      brief,
      revisionInstruction,
      provider: result.provider,
      model: result.model,
      responseId: result.responseId,
      createdAt: new Date().toISOString(),
    };

    await appendHistory(paths, record);

    console.log(`Generated candidate: ${imagePath}`);

    const { action } = await inquirer.prompt<ReviewAnswer>([
      {
        type: "list",
        name: "action",
        message: "Review this cover candidate:",
        choices: [
          { name: "Accept and write frontmatter", value: "accept" },
          { name: "Revise from this image", value: "revise" },
          { name: "Regenerate from article brief", value: "regenerate" },
          { name: "Abort", value: "abort" },
        ],
      },
    ]);

    if (action === "abort") {
      console.log("Aborted. Drafts remain private in .cover-work; no public cover or frontmatter was written.");
      process.exit(0);
    }

    if (action === "accept") {
      const { coverAlt } = await inquirer.prompt<AltAnswer>([
        {
          type: "input",
          name: "coverAlt",
          message: "Confirm or edit cover alt text:",
          default: brief.coverAltDraft,
          validate: (value: string) => value.trim() ? true : "coverAlt cannot be empty.",
          filter: (value: string) => value.trim(),
        },
      ]);

      postSource = await readPost(paths.markdownPath);
      await acceptCandidate(
        paths,
        imagePath,
        postSource,
        coverAlt,
        version,
        result.provider,
        result.model,
      );
      console.log(`Accepted cover: ${paths.publicCoverUrl}`);
      process.exit(0);
    }

    previousImagePath = action === "revise" ? imagePath : undefined;
    version += 1;

    if (action === "revise") {
      const answer = await inquirer.prompt<RevisionAnswer>([
        {
          type: "input",
          name: "revisionInstruction",
          message: "What should change in the next version?",
          validate: (value: string) => value.trim() ? true : "Revision instruction cannot be empty.",
          filter: (value: string) => value.trim(),
        },
      ]);
      revisionInstruction = answer.revisionInstruction;
      continue;
    }

    revisionInstruction = undefined;
    parsedPost = parsePost(postSource);
    brief = buildArticleBrief(parsedPost);
    prompt = buildImagePrompt(brief);
  }
}
catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
