import type { Blog } from './type';

// import blog1 from './blog1'
// import aboutTheHomesite from './about-the-homesite'
// import dingtalkInterview1 from './dingtalk-interview-1'
// import setupAudioDriverOnPixelbook from './setup-audio-driver-on-pixelbook';
// import fromObsidianToNotion from './from-obsidian-to-notion';
// import giteaCiCd from './gitea-ci-cd';
// import treeSitterQuery from './tree-sitter-query';
// import fastgptArticleAnalysis from './fastgpt-english-article-analyse';
// import n1Armbian from './n1-armbian-docker-openwrt-bypass-route';
// import dockerNetworkModel from './docker-network-model';

// export default <Blog[]>[
//   blog1,
//   aboutTheHomesite,
//   dingtalkInterview1,
//   setupAudioDriverOnPixelbook,
//   fromObsidianToNotion,
//   giteaCiCd,
//   treeSitterQuery,
//   fastgptArticleAnalysis,
//   n1Armbian,
//   dockerNetworkModel,
// ];

import { blogs } from './blogs';
export default blogs;

export const Tags = {
  dingtalk: {
    en: 'DingTalk',
    zh: '钉钉',
  },
  interview: {
    en: 'Interview',
    zh: '面试',
  },
  blog: {
    en: 'Blog',
    zh: '博客',
  },
  devtools: {
    en: "devtools",
    zh: "开发工具"
  },
  fastgpt: {
    en: "FastGPT",
    zh: "FastGPT"
  },
  docker: {
    en: "Docker",
    zh: "Docker"
  },
  migration: {
    en: "Migrated Blog",
    zh: "迁移博客"
  },
}
