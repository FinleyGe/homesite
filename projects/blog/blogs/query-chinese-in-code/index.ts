import zh from './zh.mdx'
// import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  title: {
    'en': 'I18n: Query Chinese in Code',
    'zh': 'I18n: 从代码中查询中文'
  },
  link: 'i18n-query-chinese-in-code',
  date: '2024-08-26',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'en': 'This article shows how to query Chinese in code.',
    'zh': '本文展示了如何在代码中查询中文。'
  },
  tag: ['frontend']
};
