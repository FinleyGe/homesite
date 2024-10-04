import zh from './zh.mdx'
import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  draft: false,
  title: {
    'en': 'Use Babel to generate customized API docs',
    'zh': '使用 Babel 生成自定义的 API 文档'
  },
  link: 'use-babel-generate-customized-apidoc',
  date: '2024-10-04',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
},
description: {
  'en': 'Although FastGPT is built with Next.js, but the backend codes were modified highly. It causes that we can not use universal api generator. This article will use babel to analyisis the AST of code, extract the type difinition and then generate API docs following OpenAPI norms.',
  'zh': 'FastGPT 虽然使用 Next.js 作为脚手架，但是后端部分代码经过了高度的魔改，导致无法简单的接入 API 文档生成。本文将使用 Babel 对代码的 AST 进行分析，抽取出必要的类型定义，生产符合 OpenAPI 规范的文档。',
},
tag: ["devtools","fastgpt","frontend","code"]
};
