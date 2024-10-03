import zh from "./zh.mdx";
import en from "./en.mdx";
import type { Blog } from "../type";

export default <Blog>{
  draft: true,
  title: {
    en: "Homesite Project's style problem on edge browser",
    zh: "首页项目在 Edge 浏览器上的样式问题",
  },
  link: "homesite-project-style-problem-on-edge-browser",
  date: "2024-10-03",
  lang: ["zh"],
  content: {
    en: zh,
    zh: zh,
  },
  description: {
    en: "I found some style problems of my homesite project on the Edge Browser.",
    zh: "昨天发现了在 Edge 浏览器上，我的首页的样式问题，今天研究了以下，发现十分值得注意。",
  },
  tag: ["frontend", "code"],
};
