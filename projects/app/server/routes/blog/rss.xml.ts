import rss from "rss";

const feed = new rss({
  feed_url: "https://www.f1nley.xyz/blog/rss.xml",
  site_url: "https://www.f1nley.xyz/blog",
  title: "RSS of Finley Blog",
  description: "feedId:61735729769595904+userId:61648799094321152",
  language: "zh-CN",
  pubDate: new Date(),
  copyright: "Copyright (c) 2023 - 2025 FinleyGe",
  webMaster: "finleyge@qq.com (FinleyGe)",
  managingEditor: "finleyge@qq.com (FinleyGe)",
});

let isInit = false;

export default defineEventHandler(async (event) => {
  const blogs = await queryCollection(event, "blog").all();

  if (!isInit) {
    for (const blog of blogs) {
      feed.item({
        title: blog.title,
        description: blog.description,
        url: `https://www.f1nley.xyz${blog.path}`,
        date: blog.create as string,
      });
    }
    isInit = true;
  }

  setResponseHeader(event, "Content-Type", "application/xml");
  return feed.xml({
    indent: true,
  });
});
