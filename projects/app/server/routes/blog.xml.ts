import rss from 'rss';

export default defineEventHandler(() => {
 var feed = new rss({
    title: 'Finley\'s Blog',
    feed_url: 'https://www.f1nley.xyz/blog.xml',
    site_url: 'https://www.f1nley.xyz.blog',
    description: 'A blog about stuff',
  });

  feed.item({
    title: 'Hello World',
    description: 'This is my first blog post!',
    url: 'https://www.f1nley.xyz/blog/hello-world',
    date: new Date(),
  });

  return feed.xml();
});
