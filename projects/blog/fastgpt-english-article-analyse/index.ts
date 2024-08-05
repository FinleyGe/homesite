import zh from './zh.mdx'
// import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  title: {
    'en': 'FastGPT: Building an English Essay Correction Robot',
    'zh': 'FastGPT: 搭建一个英语作文纠错机器人'
  },
  link: 'fastgpt-english-essay-correction-robot',
  date: '2024-07-28',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'en': 'This Blog introduces how to use FastGPT to build an English essay correction robot via a workflow.',
    'zh': '本文通过搭建一个英语作文纠错机器人，介绍一下如何使用FastGPT的工作流'
  }, tag: ['fastgpt']
};
