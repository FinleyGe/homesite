import zh from './zh.mdx'
import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  title: {
    'en': '',
    'zh': ''
  },
  link: '',
  date: '',
  lang: ['en', 'zh'],
  content: {
    'en': en,
    'zh': zh
  },
  description: {
    'en': '',
    'zh': ''
  }
};
