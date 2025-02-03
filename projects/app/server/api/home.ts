import { readFileSync } from "fs";
import { join } from "path";
export default defineEventHandler(async (event) => {
  const { loc } = getQuery<{
    loc: "zh" | "en";
  }>(event);
  const path =
    loc === "zh"
      ? join(process.cwd(), "content", "about.zh.mdx")
      : join(process.cwd(), "content", "about.mdx");
  return readFileSync(path, "utf8");
});
