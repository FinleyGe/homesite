import zh from './zh.mdx'
// import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  title: {
    'en': 'Niri, A scrollable-tiling Wayland compositor.',
    'zh': 'Niri，一个可滚动平铺的 Wayland 组合器。'
  },
  link: 'niri',
  date: '2024-09-01',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'en': 'This is a blog about Niri, a scrollable-tiling Wayland compositor.',
    'zh': '这是一篇关于 Niri 的博客，一个可滚动平铺的 Wayland 组合器。'
  }
};
