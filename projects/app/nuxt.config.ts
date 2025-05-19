//@ts-expect-error: rollup-plugin-string is not typed
import { string } from "rollup-plugin-string";

export default defineNuxtConfig({
  experimental: {
    componentIslands: true,
  },

  devtools: { enabled: true },
  pages: true,

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@nuxtjs/color-mode",
    "@nuxtjs/fontaine",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-primevue",
    "nuxt-file-storage",
    "@nuxt/content",
  ],
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          "remark-gfm": {},
          "remark-math": {},
        },
        highlight: {
          theme: {
            default: "catppuccin-latte",
            dark: "catppuccin-macchiato",
            light: "catppuccin-latte",
          },
        },
      },
    },
  },
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },

  colorMode: {
    classSuffix: "",
  },

  primevue: {
    options: {
      unstyled: true,
    },
    components: {
      include: ["Calendar"],
    },
    directives: {
      exclude: ["*"],
    },
  },

  css: ["~/assets/styles/main.css"],

  vite: {
    plugins: [
      string({
        include: "/**/*.mdx",
      }),
    ],
  },

  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
    vueI18n: "i18n.config.ts",
  },

  fileStorage: {
    mount: process.env.UPLOAD_PATH!,
  },

  nitro: {
    experimental: { tasks: true },
    storage: {
      img: {
        driver: "fs",
        base: process.env.UPLOAD_PATH!,
      },
    },
    routeRules: {
      "/": {
        swr: true,
        prerender: true,
      },
      "blog/**": {
        swr: true,
      },
      blog: {
        swr: true,
      },
    },
  },

  compatibilityDate: "2024-07-18",
});
