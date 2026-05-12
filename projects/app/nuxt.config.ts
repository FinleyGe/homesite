import tailwindcss from "@tailwindcss/vite";
import { readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const getBlogRoutes = () => {
  const blogDir = join(process.cwd(), "content/blog");
  const routes: string[] = [];

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(path);
        continue;
      }

      if (entry.isFile() && extname(entry.name) === ".md") {
        const slug = relative(blogDir, path)
          .replace(/\\/g, "/")
          .replace(/\.md$/, "");
        routes.push(`/blog/${slug}`);
      }
    }
  };

  walk(blogDir);

  return routes;
};

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
    "@nuxt/ui",
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
    classSuffix: "",
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
          "rehype-katex": {
            options: {
              output: "htmlAndMathml",
              strict: "ignore",
            },
          },
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

  css: ["~/assets/styles/main.css", "katex/dist/katex.min.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
    vueI18n: "i18n.config.ts",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  compatibilityDate: "2024-07-18",

  nitro: {
    prerender: {
      routes: ["/blog", ...getBlogRoutes()],
    },
  },

  routeRules: {
    "/blog/rss.xml": {
      static: true,
      prerender: true,
    },
  },
});
