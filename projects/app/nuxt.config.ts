// https://nuxt.com/docs/api/configuration/nuxt-config
import mdx from '@mdx-js/rollup'
// import mdx from 'vite-plugin-mdx'

export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@nuxtjs/color-mode",
    "@nuxtjs/fontaine",
    "@nuxtjs/i18n"
  ],
  css: [
    '~/assets/styles/main.css'
  ],
  vite: {
    plugins: [
      mdx({
        providerImportSource: '@mdx-js/vue',
        jsxImportSource: 'vue',
      })
    ],
  },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    vueI18n: 'i18n.config.ts',
  }
});
