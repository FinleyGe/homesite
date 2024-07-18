import { Blog } from './type';
import blog1 from './blog1'
import aboutTheHomesite from './about-the-homesite'
import dingtalkInterview1 from './dingtalk-interview-1'
import setupAudioDriverOnPixelbook from './setup-audio-driver-on-pixelbook';
import fromObsidianToNotion from './from-obsidian-to-notion';
import giteaCiCd from './gitea-ci-cd';

export default <Blog[]>[
  blog1,
  aboutTheHomesite,
  dingtalkInterview1,
  setupAudioDriverOnPixelbook,
  fromObsidianToNotion,
  giteaCiCd
];

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
  workflow: {
    en: "workflow",
    zh: "工作流"
  }
}
