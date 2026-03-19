export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en: {
      lang: {
        en: "English",
        zh: "Chinese",
      },
      head: {
        title: "Finley's Homesite",
      },
      common: {
        blog: "Blog",
        "link-exchange": "Link Exchange",
        donate: "Donate",
        now: "Now",
        nowDescription: "What I'm doing now.",
      },
      blog: {
        list: "Blog List",
      },
      LinkExchange: "Link Exchange",
    },
    zh: {
      lang: {
        en: "英文",
        zh: "中文",
      },
      head: {
        title: "Finley 的主页",
      },
      common: {
        blog: "博客",
        "link-exchange": "友情链接",
        donate: "赞助",
        now: "此刻",
        nowDescription: "我现在正在做什么。",
      },
      blog: {
        list: "博客列表",
      },
      LinkExchange: "友链",
    },
  },
}));
