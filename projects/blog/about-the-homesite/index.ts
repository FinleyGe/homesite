import zh from './zh.mdx'
import { Blog } from '../type'

export default <Blog>{
  title: {
    'zh': '关于主页项目的技术点',
    'en': 'About the main technical points of the homepage project',
  },
  link: 'about-the-homesite',
  date: '2024-05-27',
  lang: ['zh'],
  content: {
    'zh': zh,
    'en': zh
  },
  description: {
    'en': 'The main technical points of the homepage project are introduced in detail, including the use of Next.js, the use of MDX, the use of Tailwind and so on',
    'zh': '主要介绍了主页项目的技术点，包括使用 Next.js，使用 MDX，使用 Tailwind 等等',
  },
  tag: ['blog'],
};
