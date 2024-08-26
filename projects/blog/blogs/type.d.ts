import { Tags } from '../index'

export type Blog = {
  draft?: boolean;
  title: {
    [key: string]: string;
  },
  date: string;
  link: string;
  lang: Array<'en' | 'zh'>;
  content: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  tag?: Array<keyof typeof Tags>;
}
