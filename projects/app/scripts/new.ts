import { formatDate } from "@vueuse/core";
import inquirer from "inquirer";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const time = formatDate(new Date(), "YYYY-MM-DD");
const scriptDir = dirname(fileURLToPath(import.meta.url));

const template = `---
lang: zh
create: ${time}
tags:
---
`;

const blogDir = join(scriptDir, "../content/blog");

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
