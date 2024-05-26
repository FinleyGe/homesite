import zh from './blog1.zh.mdx?raw'
import en from './blog1.mdx?raw'
import { Blog } from '../type'

export default <Blog>{
  title: {
    'en': 'The first blog',
    'zh': '第一篇博客'
  },
  link: 'blog1',
  date: '2024-05-13',
  lang: ['en', 'zh'],
  content: {
    'en': en,
    'zh': zh
  },
  description: {
    'en': 'This is the first blog',
    'zh': '这是第一篇博客'
  }
};
