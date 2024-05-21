// https://nuxt.com/docs/api/configuration/nuxt-config
import mdx from '@mdx-js/rollup';
import remarkgfm from 'remark-gfm';
import remarkmath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
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
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-primevue',
  ],
  colorMode: {
    classSuffix: '',
  },
  primevue: {
    options: {
      unstyled: true,
    }
  },
  css: [
    '~/assets/styles/main.css',
    // 'primevue/resources/themes/saga-blue/theme.css',
  ],
  vite: {
    plugins: [
      mdx({
        providerImportSource: '@mdx-js/vue',
        jsxImportSource: 'vue',
        remarkPlugins: [
          remarkgfm,
          remarkmath,
          remarkFrontmatter,
          remarkMdxFrontmatter,
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
  routeRules: {
    '/': {
      prerender: true,
    },
    '/blog': { swr: true, isr: true, prerender: true },
    '/blog/**': { swr: true, isr: true, prerender: true },
  },
});
