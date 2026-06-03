import { copyFile, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { parseDocument, isMap } from "yaml";

export const DEFAULT_IMAGE_MODEL = "gpt-image-2";

export type CoverAction = "initial" | "revision";

export type CoverFrontmatter = {
  cover: string;
  coverAlt: string;
  coverGenerated: {
    provider: string;
    model: string;
    acceptedVersion: number;
    createdAt: string;
  };
};

export type ParsedPost = {
  frontmatter: Record<string, unknown>;
  frontmatterSource: string;
  body: string;
  lineEnding: string;
};

export type ArticleBrief = {
  title: string;
  lang: string;
  tags: string[];
  summary: string;
  mood: string;
  visualMetaphors: string[];
  avoid: string[];
  coverAltDraft: string;
};

export type CoverPaths = {
  slug: string;
  markdownPath: string;
  privateDir: string;
  publicDir: string;
  historyPath: string;
  publicCoverPath: string;
  publicCoverUrl: string;
};

export type CandidateRecord = {
  action: CoverAction;
  version: number;
  imagePath: string;
  prompt: string;
  brief: ArticleBrief;
  revisionInstruction?: string;
  provider: string;
  model: string;
  responseId?: string;
  createdAt: string;
};

export const DEFAULT_STYLE_PROFILE = [
  "Create a quiet editorial cover image for a personal blog.",
  "Use abstract metaphor, restrained composition, and tactile details.",
  "Avoid literal screenshots, UI mockups, photoreal portraits, text, logos, memes, and generic tech stock imagery.",
  "The image should feel thoughtful, human, and slightly poetic while staying specific to the article.",
].join(" ");

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?/;
const MAX_BRIEF_CHARS = 3600;

export const assertSafeSlug = (slug: string) => {
  const trimmed = slug.trim();

  if (!trimmed) {
    throw new Error("Missing blog slug.");
  }

  if (
    trimmed.startsWith("/")
    || trimmed.includes("..")
    || trimmed.split("/").some((part) => !part || part.startsWith("."))
  ) {
    throw new Error(`Unsafe blog slug: ${slug}`);
  }

  return trimmed.replace(/\.md$/, "");
};

export const resolveCoverPaths = (slugInput: string, rootDir = process.cwd()): CoverPaths => {
  const slug = assertSafeSlug(slugInput);
  const markdownPath = join(rootDir, "content/blog", `${slug}.md`);
  const privateDir = join(rootDir, ".cover-work/blogs", slug);
  const publicDir = join(rootDir, "public/images/blogs", slug);

  return {
    slug,
    markdownPath,
    privateDir,
    publicDir,
    historyPath: join(privateDir, "history.jsonl"),
    publicCoverPath: join(publicDir, "cover.png"),
    publicCoverUrl: `/images/blogs/${slug}/cover.png`,
  };
};

export const readPost = async (markdownPath: string): Promise<string> => {
  try {
    return await readFile(markdownPath, "utf8");
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Blog post not found: ${markdownPath}`);
    }

    throw error;
  }
};

export const parsePost = (source: string): ParsedPost => {
  const match = source.match(FRONTMATTER_RE);

  if (!match?.[1]) {
    throw new Error("Blog post must start with YAML frontmatter.");
  }

  const fullFrontmatter = match[0];
  const lineEnding = fullFrontmatter.includes("\r\n") ? "\r\n" : "\n";
  const frontmatterSource = match[1];
  const document = parseDocument(frontmatterSource);

  if (document.errors.length) {
    throw new Error(`Invalid YAML frontmatter: ${document.errors[0]?.message}`);
  }

  const frontmatter = document.toJSON() as Record<string, unknown> | null;

  if (!frontmatter || typeof frontmatter !== "object" || Array.isArray(frontmatter)) {
    throw new Error("Frontmatter must be a YAML object.");
  }

  return {
    frontmatter,
    frontmatterSource,
    body: source.slice(fullFrontmatter.length),
    lineEnding,
  };
};

export const serializePost = (post: ParsedPost, cover: CoverFrontmatter) => {
  const document = parseDocument(post.frontmatterSource);

  if (!isMap(document.contents)) {
    throw new Error("Frontmatter must be a YAML object.");
  }

  document.set("cover", cover.cover);
  document.set("coverAlt", cover.coverAlt);
  document.set("coverGenerated", cover.coverGenerated);

  return `---${post.lineEnding}${document.toString().trimEnd()}${post.lineEnding}---${post.lineEnding}${post.body}`;
};

export const extractTitle = (body: string) => {
  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading ?? "Untitled article";
};

const compactText = (value: string) => {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const buildArticleBrief = (post: ParsedPost): ArticleBrief => {
  const title = extractTitle(post.body);
  const lang = typeof post.frontmatter.lang === "string" ? post.frontmatter.lang : "zh";
  const tags = Array.isArray(post.frontmatter.tags)
    ? post.frontmatter.tags.filter((tag): tag is string => typeof tag === "string")
    : [];
  const text = compactText(post.body).slice(0, MAX_BRIEF_CHARS);
  const isTechnical = tags.some((tag) => /tech|code|编程|技术|linux|docker|compiler|ai/i.test(tag))
    || /代码|编程|API|Docker|Linux|TypeScript|JavaScript|grammar|query/i.test(`${title} ${text}`);
  const mood = isTechnical ? "precise, calm, exploratory" : "reflective, humane, contemplative";
  const visualMetaphors = isTechnical
    ? ["layered diagrams", "quiet workbench", "structured light", "paper notes beside a terminal"]
    : ["open notebook", "soft window light", "small symbolic objects", "balanced empty space"];
  const coverAltDraft = lang === "en"
    ? `Editorial illustration reflecting the article "${title}".`
    : `呼应《${title}》主题的安静编辑插画。`;

  return {
    title,
    lang,
    tags,
    summary: text,
    mood,
    visualMetaphors,
    avoid: ["visible text", "logos", "literal screenshots", "generic stock photo style"],
    coverAltDraft,
  };
};

export const buildImagePrompt = (brief: ArticleBrief, styleProfile = DEFAULT_STYLE_PROFILE) => {
  return [
    styleProfile,
    `Article title: ${brief.title}`,
    `Article language: ${brief.lang}`,
    `Mood: ${brief.mood}`,
    `Use visual metaphors: ${brief.visualMetaphors.join(", ")}.`,
    `Avoid: ${brief.avoid.join(", ")}.`,
    `Article summary: ${brief.summary}`,
    "Return an image with no visible words or letters.",
  ].join("\n");
};

export const ensurePostExists = async (paths: CoverPaths) => {
  await stat(paths.markdownPath);
};

export const nextCandidatePath = (paths: CoverPaths, version: number) => {
  return join(paths.privateDir, `cover-v${String(version).padStart(2, "0")}.png`);
};

export const writeCandidate = async (paths: CoverPaths, version: number, bytes: Uint8Array) => {
  await mkdir(paths.privateDir, { recursive: true });
  const imagePath = nextCandidatePath(paths, version);
  await writeFile(imagePath, bytes);
  return imagePath;
};

export const appendHistory = async (paths: CoverPaths, record: CandidateRecord) => {
  await mkdir(paths.privateDir, { recursive: true });
  const line = `${JSON.stringify(record)}\n`;
  await writeFile(paths.historyPath, line, { flag: "a" });
};

const pathExists = async (path: string) => {
  try {
    await stat(path);
    return true;
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }

    throw error;
  }
};

export const acceptCandidate = async (
  paths: CoverPaths,
  candidatePath: string,
  postSource: string,
  coverAlt: string,
  version: number,
  provider: string,
  model: string,
  now = new Date(),
) => {
  await mkdir(paths.publicDir, { recursive: true });
  const tempId = `${process.pid}-${Date.now()}`;
  const tempCoverPath = join(paths.publicDir, `.cover-${tempId}.tmp`);
  const backupCoverPath = join(paths.publicDir, `.cover-${tempId}.bak`);
  const tempMarkdownPath = join(dirname(paths.markdownPath), `.cover-${tempId}.md.tmp`);
  let backupCreated = false;
  const parsed = parsePost(postSource);
  const updated = serializePost(parsed, {
    cover: paths.publicCoverUrl,
    coverAlt,
    coverGenerated: {
      provider,
      model,
      acceptedVersion: version,
      createdAt: now.toISOString(),
    },
  });

  try {
    await writeFile(tempMarkdownPath, updated);
    await copyFile(candidatePath, tempCoverPath);

    if (await pathExists(paths.publicCoverPath)) {
      await rename(paths.publicCoverPath, backupCoverPath);
      backupCreated = true;
    }

    await rename(tempCoverPath, paths.publicCoverPath);
    await rename(tempMarkdownPath, paths.markdownPath);
    await rm(backupCoverPath, { force: true });
  }
  catch (error) {
    await Promise.all([
      rm(tempCoverPath, { force: true }),
      rm(tempMarkdownPath, { force: true }),
    ]);

    if (backupCreated) {
      await rm(paths.publicCoverPath, { force: true });
      await rename(backupCoverPath, paths.publicCoverPath);
    }

    throw error;
  }

  return {
    cover: paths.publicCoverUrl,
    coverAlt,
  };
};
