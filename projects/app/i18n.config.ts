import { Head } from "#build/components";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      lang: "en",
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
      lang: "zh",
      head: {
        title: "Finley 的主页",
      },
      common: {
        blog: "博客",
        playground: "玩具盒",
        post: "琐碎",
      },
    },
  }
}));
