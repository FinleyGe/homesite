import zh from './zh.mdx'
// import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  title: {
    'en': 'Bazel simple intro',
    'zh': 'Bazel 简略介绍'
  },
  link: 'bazel-simple-intro',
  date: '2023-05-05',
  lang: ['en', 'zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'zh': '为了完成 Cpp 的的课程设计，需要一个好用的构建工具。接触了 Google 的 Bazel 后，决定学习一下。',
    'en': 'To complete the course design of Cpp, a good build tool is needed. After I encountered Google\'s Bazel, I decided to learn it.'
  },
  tag: ['migration']
};
