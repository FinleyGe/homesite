import zh from './zh.mdx'
// import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  title: {
    'en': 'Why Golang',
    'zh': '为什么 Golang'
  },
  link: 'why-golang',
  date: '2024-01-01',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'zh': '本文是为了 《编译原理》期末大作业而准备的。本文将讨论 Golang  的特点',
    'en': 'This is a preparation for the final project of the 《Compilation Principles》. This article will discuss the features of Golang.'
  },
  tag: ['Golang', 'backend']
};
