declare module '*.mdx';
declare module '*/**.md';

export type Blog = {
  title: {
    [key: string]: string;
  },
  date: string;
  link: string;
  lang: string[];
  content: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  }
}
