import { readFile } from "node:fs/promises";
import { join } from "node:path";

const ENV_LINE_RE = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;

const parseEnvValue = (value = "") => {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\""))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const loadEnvFile = async (path: string) => {
  let source: string;

  try {
    source = await readFile(path, "utf8");
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }

    throw error;
  }

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(ENV_LINE_RE);

    if (!match) {
      continue;
    }

    const [, key, value] = match;

    if (key && process.env[key] === undefined) {
      process.env[key] = parseEnvValue(value);
    }
  }
};

export const loadCoverEnv = async (appRoot: string) => {
  await loadEnvFile(join(appRoot, ".env"));
  await loadEnvFile(join(appRoot, ".env.local"));
};
