import zh from './zh.mdx'
// import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  title: {
    'en': 'Use Gitea to build up a personal git server and CI/CD',
    'zh': '使用 Gitea 搭建私有 Git 服务器和 CI/CD'
  },
  link: 'gitea-ci-cd',
  date: '2024-07-18',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'zh': '为了编辑博客时不需要在本地进行编译，也为了方便部署，使用 Gitea 搭建私有的 Git 服务器和 CI/CD。这样就可以专注于博客内容',
    'en': 'As for editing blog without compiling locally and deploying conveniently, I use Gitea to build up a personal git server and CI/CD. In this way, I can focus on the content of the blog.',
  }
};
