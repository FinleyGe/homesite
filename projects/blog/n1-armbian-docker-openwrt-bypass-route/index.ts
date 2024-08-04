import zh from './zh.mdx'
// import en from './en.mdx'
import { Blog } from '../type'

export default <Blog>{
  title: {
    'zh': 'n1盒子安装docker，docker中安装openwrt，openwrt配置旁路由',
    'en': 'Install docker on n1 box, install openwrt in docker, and configure bypass route in openwrt'
  },
  link: 'n1-armbian-docker-openwrt-bypass-route',
  date: '2024-02-27',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'zh': '去年买了个n1盒子，这篇文章记录了如何在n1盒子上安装docker，然后在docker中安装openwrt，最后在openwrt中配置旁路由。',
    'en': 'I bought an n1 box last year. This article records how to install docker on the n1 box, then install openwrt in docker, and finally configure the bypass route in openwrt.'
  }, tag: ['docker', 'migration'],
};
