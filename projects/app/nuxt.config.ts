import { string } from 'rollup-plugin-string';

export default defineNuxtConfig({
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
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-primevue',
    'nuxt-file-storage',
  ],
  colorMode: {
    classSuffix: '',
  },
  primevue: {
    options: {
      unstyled: true,
    },
    components: {
      include: ['Calendar'],
    },
    directives: {
      exclude: ['*'],
    }
  },
  css: [
    '~/assets/styles/main.css',
    // 'primevue/resources/themes/saga-blue/theme.css',
  ],
  vite: {
    plugins: [
      string({
        include: '/**/*.mdx',
      }),
    ],
  },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    vueI18n: 'i18n.config.ts',
  },
  fileStorage: {
    mount: process.env.UPLOAD_PATH!
  },
  nitro: {
    serverAssets: [
      {
        dir: process.env.UPLOAD_PATH!,
        baseName: 'img',
      }
    ],
  },
  routeRules: {
    '/': {
      prerender: true,
    },
    'blog/**': {
      isr: true
    },
    'blog': {
      isr: true
    }
  }
});
