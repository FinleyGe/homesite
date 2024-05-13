export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
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
        playground: "Playground",
        post: "Post",
      },
      blog: {
        list: "Blog List",
      },
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
        playground: "玩具盒",
        post: "琐碎",
      },
      blog: {
        list: "博客列表",
      }
    },
  }
}));
