import zh from './zh.mdx'
import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  draft: true,
  title: {
    'en': 'Mdx hot reload preview tool',
    'zh': 'MDX 热重载预览工具'
  },
  link: 'mdx-hot-reload-preview-tool',
  date: '2024-09-28',
  lang: ['zh'],
  content: {
    'en': en,
    'zh': zh
},
description: {
  'en': 'Write a hot reload preview tool for mdx by using watch, commanderjs, and inquirer..',
  'zh': '使用 watch, commanderjs, inquirer 等工具写一个轻量化的有热重载的 mdx 预览工具',
},
tag: ["blog","frontend","code"]
};
