declare module '*.mdx';
declare module '*/**.mdx';

import { Tags } from './index'

export type Blog = {
  draft?: boolean;
  title: {
    [key: string]: string;
  },
  date: string;
  link: string;
  lang: ['zh' | 'en'];
  content: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  tag?: Array<keyof typeof Tags>;
}
