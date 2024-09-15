import { readFileSync } from "fs";
import { join } from "path";
export default defineEventHandler(async (event) => {
  const query = getQuery<{
    link: string;
    loc: string;
  }>(event);
  const path = join(process.cwd(), "blogs", query.link, query.loc + ".jsx");
  return readFileSync(path, "utf8");
});
