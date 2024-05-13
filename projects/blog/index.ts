import blog1 from './blog1.mdx';
import blog1Zh from './blog1.zh.mdx';
// import blog2 from './blog2.mdx';

export type Blog = {
  title: {
    [key: string]: string;
  },
  date: string;
  link: string;
  lang: string[];
  content: {
    [key: string]: any;
  };
  description: {
    [key: string]: string;
  }
}

export default <Blog[]>[{
  title: {
    'en': 'The first blog',
    'zh': '第一篇博客'
  },
  link: 'blog1',
  date: '2024-05-13',
  lang: ['en', 'zh'],
  content: {
    'en': blog1,
    'zh': blog1Zh
  },
  description: {
    'en': 'This is the first blog',
    'zh': '这是第一篇博客'
  }
},
];
