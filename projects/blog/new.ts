import inquirer from "inquirer";
import { Tags } from "./index";
import * as fs from "fs";
import * as dayjs from "dayjs";

async function main() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "link",
      message: "link:",
      required: true,
    },
    {
      type: "input",
      name: "title_zh",
      message: "Title(Zh):",
      required: true,
    },
    {
      type: "input",
      name: "title_en",
      message: "Title(En):",
      required: true,
    },
    {
      type: "checkbox",
      choices: ["zh", "en"],
      name: "language",
      message: "Language:",
      default: "zh",
      required: true,
    },
    {
      type: "input",
      name: "description_zh",
      message: "Description(Zh):",
      required: true,
    },
    {
      type: "input",
      name: "description_en",
      message: "Description(En):",
      required: true,
    },
    {
      type: "checkbox",
      name: "tags",
      message: "Tags:",
      choices: Object.keys(Tags),
    },
  ]);

  const indexts = `import zh from './zh.mdx'
import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  draft: true,
  title: {
    'en': '${answers.title_en}',
    'zh': '${answers.title_zh}'
  },
  link: '${answers.link}',
  date: '${dayjs().format("YYYY-MM-DD")}',
  lang: ['${answers.language}'],
  content: {
    'en': en,
    'zh': zh
},
description: {
  'en': '${answers.description_en}',
  'zh': '${answers.description_zh}',
},
tag: ${answers.tags ? JSON.stringify(answers.tags) : "[]"}
};
`;
  // make dir
  fs.mkdirSync(`./blogs/${answers.link}`);
  fs.writeFileSync(`./blogs/${answers.link}/index.ts`, indexts);
  fs.writeFileSync(`./blogs/${answers.link}/zh.mdx`, "");
  fs.writeFileSync(`./blogs/${answers.link}/en.mdx`, "");

  console.log("New blog created!");
  console.log(`Path: ./blogs/${answers.link}/zh.mdx`);
  console.log(`Run:
bun preview -p ./blogs/${answers.link} && open ./preview.html
to preview,
`);
}

main();
