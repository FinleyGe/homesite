import zh from './zh.mdx'
// import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  title: {
    'en': 'Before leaving Germany',
    'zh': '写在离开德国之前'
  },
  link: 'before-leaving-germany',
  date: '2023-09-01',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'zh': '本文写在即将离开亚琛，对我，半个也到一个月在德国“准生活”的一个回顾。',
    'en': 'This is a reflection of my short stay in Germany before leaving.'
  },
  tag: ['migration']
};
