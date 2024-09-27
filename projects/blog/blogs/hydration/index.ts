import zh from './zh.mdx'
import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  draft: false,
  title: {
    'en': 'Hydration, what is that?',
    'zh': '水合(Hydration)到底是什么'
  },
  link: 'hydration',
  date: '2024-09-27',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'en': 'What is Hydration? This article will start from the prerender problem in the homesite project, to understand the Hydration',
    'zh': '水合到底是什么？本文从在主页项目中遇到的页面与渲染问题出发，理解水合这一概念。',
  },
  tag: ["frontend"]
};
