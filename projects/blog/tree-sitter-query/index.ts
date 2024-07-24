import zh from './zh.mdx'
// import en from './en.mdx'
import { Blog } from '../type'

export default <Blog>{
  title: {
    'en': 'Custom Symbol for aerial.nvim with Tree-sitter Query',
    'zh': '使用 Tree-sitter Query 为 aerial.nvim 添加自定义 symbol'
  },
  link: 'tree-sitter-query-custom-symbol-for-aerial-nvim',
  date: '2024-07-24',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'zh': '在使用 aerial.nvim 的时候发现某些 symbol 没有被识别。需要自定义 symbol。本文将简要介绍如何使用 Tree-sitter 的 Query 为 aerial 提供自定义的 Symbol',
    'en': 'When using aerial.nvim, I found that some symbols were not recognized. Custom symbols are needed. This article will briefly introduce how to use Tree-sitter Query to provide custom symbols for aerial'
  }, 
  tag: ["devtools"]
};
