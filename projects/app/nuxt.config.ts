import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  // experimental: {
  //   componentIslands: true,
  // },
  // postcss: {
  //   plugins: {
  //     autoprefixer: {},
  //   },
  // },

  devtools: { enabled: true },
  pages: true,
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/color-mode",
    "@nuxtjs/fontaine",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/content",
  ],
  colorMode: {
    preference: "system",
    fallback: "dark",
    storage: "localStorage",
  },
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          "remark-gfm": {},
          "remark-math": {},
          // "remark-mermaidjs": {},
        },
        highlight: {
          theme: {
            default: "catppuccin-latte",
            dark: "catppuccin-macchiato",
            light: "catppuccin-latte",
          },
        },
        rehypePlugins: {
          // "rehype-mermaid": {},
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
  css: ["~/assets/styles/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
    vueI18n: "i18n.config.ts",
  },

  compatibilityDate: "2024-07-18",

  routeRules: {
    "/blog/rss.xml": {
      static: true,
      prerender: true,
    },
  },
});
