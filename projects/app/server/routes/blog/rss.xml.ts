import rss from 'rss';
import blogs from 'blog'

export default defineEventHandler(() => {
 var feed = new rss({
    feed_url: 'https://www.f1nley.xyz/blog/rss.xml',
    site_url: 'https://www.f1nley.xyz/blog',
    title: 'RSS of Finley Blog',
  });

  for(let blog of blogs) {
    const lang = blog.lang[0];
    feed.item({
      title: blog.title[lang],
      description: blog.description[lang],
      url: `https://www.f1nley.xyz/blog/${blog.link}`,
      date: blog.date,
    })
  }

  return feed.xml();
});
