// import zh from './zh.mdx'
import zh from './zh.mdx'
import type { Blog } from '../type'

export default <Blog>{
  title: {
    'en': 'The first interview for DingTalk',
    'zh': '钉钉一面'
  },
  link: 'dingtalk-interview-1',
  date: '2024-05-27',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh,
  },
  description: {
    'en': 'I had my first interview for Dingtalk on 2024-05-27, this is a summary of the interview',
    'zh': '在2024-05-27我参加了钉钉的第一次面试，这是面试总结'
  },
  tag: ['interview', 'dingtalk'],
};
