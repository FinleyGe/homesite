// https://nuxt.com/docs/api/configuration/nuxt-config
import mdx from '@mdx-js/rollup';
import remarkgfm from 'remark-gfm';
import remarkmath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
// import mdx from 'vite-plugin-mdx'

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
    '@pinia-plugin-persistedstate/nuxt'
  ],
  css: [
    '~/assets/styles/main.css'
  ],
  vite: {
    plugins: [
      mdx({
        providerImportSource: '@mdx-js/vue',
        jsxImportSource: 'vue',
        remarkPlugins: [
          remarkgfm,
          remarkmath,
        ],
        rehypePlugins: [
          [rehypeHighlight],
          [rehypeKatex, { output: 'mathml' }],
        ]
      })
    ],
  },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    vueI18n: 'i18n.config.ts',
  },
  nitro: {
    prerender: {
      routes: ['/'],
    }
  },
  routeRules: {
    '/admin/**': {
      // ssr: false
    },
    '/api/**': {
      // proxy: `${process.env.API_URL}/**`
      proxy: "https://www.f1nley.xyz/api/**"
    }
  },
});
