import { getBlogs } from "./utils";
import { writeFileSync } from "fs";

getBlogs().then(
  (blogs) => {
    writeFileSync("./bloglist.json", JSON.stringify(blogs, null, 2))
  }
)
