import rss from 'rss';
import blogs from 'blog/bloglist.json'

export default defineEventHandler((event) => {
  const feed = new rss({
    feed_url: 'https://www.f1nley.xyz/blog/rss.xml',
    site_url: 'https://www.f1nley.xyz/blog',
    title: 'RSS of Finley Blog',
    description: 'feedId:61735729769595904+userId:61648799094321152',
    language: 'zh-CN',
    pubDate: new Date(),
    copyright: 'Copyright (c) 2023 - 2024 Finley',
    webMaster: 'finleyge@qq.com (FinleyGe)',
    managingEditor: 'finleyge@qq.com (FinleyGe)',
    // custom_elements: [
    //   {
    //     follow_challenge: [{
    //       feedId: "61735729769595904"
    //     }, {
    //       userId: "61648799094321152"
    //     }]
    //   }
    // ]
  });

  for (const blog of blogs) {
    const lang = blog.lang[0];
    feed.item({
      title: blog.title[lang],
      description: blog.description[lang],
      url: `https://www.f1nley.xyz/blog/${blog.link}`,
      date: blog.date,
    })
  }

  setResponseHeader(event, 'Content-Type', 'application/xml');
  return feed.xml({
    indent: true,
  });
});
