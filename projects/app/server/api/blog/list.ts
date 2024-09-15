import { readFileSync } from "fs";
import { join } from "path";

export default defineCachedEventHandler(async () => {
  const path = join(process.cwd(), "node_modules/blog/bloglist.json");
  const blogs = JSON.parse(readFileSync(path, "utf8"));
  return blogs;
});
