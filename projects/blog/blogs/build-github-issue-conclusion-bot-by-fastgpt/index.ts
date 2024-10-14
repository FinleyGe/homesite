import zh from "./zh.mdx";
// import en from './en.mdx'
import type { Blog } from "../type";

export default <Blog>{
  draft: false,
  title: {
    zh: "使用 FastGPT 构建一个 Github issue 总结机器人",
    en: "Build a Github issue conclusion bot by FastGPT",
  },
  link: "build-github-issue-conclusion-bot-by-fastgpt",
  date: "2024-10-14",
  lang: ["zh"],
  content: {
    en: zh as any,
    zh: zh as any,
  },
  description: {
    zh: "这篇文章将为您介绍如何使用 FastGPT 搭建一个 Github Issue 总结机器人，并向飞书机器人发送 webhook 进行通知",
    en: "This article will introduce you how to build a Github issue conclusion bot using FastGPT and send webhooks to the Feishu bot",
  },
  tag: ["fastgpt"],
};
