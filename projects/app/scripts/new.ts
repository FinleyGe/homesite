import { formatDate } from "@vueuse/core";
import inquirer from "inquirer";
import { join } from "path";
import { writeFile } from "fs/promises";

const time = formatDate(new Date(), "yyyy-MM-dd");

const template = `---
lang: zh
create: ${time}
tags:
---
`;

const blogDir = join(__dirname, "../content/blog");

const res = await inquirer.prompt([
  {
    type: "input",
    name: "title",
    message: "Input the title(kebab-case):",
  },
]);

if (!res.title) {
  console.log("title is empty");
  process.exit(1);
}

await writeFile(join(blogDir, `${res.title}.md`), template);
