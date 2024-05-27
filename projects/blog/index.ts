import { Blog } from './type';
import blog1 from './blog1'
import aboutTheHomesite from './about-the-homesite'
import dingtalkInterview1 from './dingtalk-interview-1'

export default <Blog[]>[
  blog1,
  aboutTheHomesite,
  dingtalkInterview1,
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
}
