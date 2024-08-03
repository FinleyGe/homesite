<script setup lang="ts">
import { MDXProvider, useMDXComponents } from '@mdx-js/vue';
import md from 'mdx-components/md';
import common from 'mdx-components/common';

import type { run } from '@mdx-js/mdx';
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'vue/jsx-runtime'
import bloglist from 'blog';

import remarkgfm from 'remark-gfm';
import remarkmath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkHeadingId from 'remark-heading-id';
import { remarkMdxToc } from 'remark-mdx-toc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeKatex from 'rehype-katex';

const router = useRouter()
const { locale } = useI18n();

const link = ref<string>(router.currentRoute.value.params.title as string);

if (!bloglist.find((item) => item.link === link.value)) {
  router.push('/404');
}

const blog = bloglist!.find((item) => item.link === link.value)!;

let loc = locale.value;
if (!blog.content[loc]) {
  loc = blog.lang[0];
}
type MDXContent = Awaited<ReturnType<typeof run>>['default']
const Content = ref<MDXContent>();
const content = ref(blog.content[loc]);

const mdx = await evaluate(
  content.value,
  {
    ...runtime, useMDXComponents,
    remarkPlugins: [
      remarkgfm,
      remarkmath,
      remarkFrontmatter,
      remarkMdxFrontmatter,
      [remarkHeadingId, {
        defaults: true,
        uniqueDefaults: true,
      }],
      remarkMdxToc,
    ],
    rehypePlugins: [
      [rehypePrettyCode, {
        theme: {
          dark: 'catppuccin-macchiato',
          light: 'catppuccin-latte',
        },
        keepBackground: true,
      }],
      [rehypeKatex, { output: 'mathml' }],
    ]
  }
);

Content.value = mdx.default

</script>
<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center">
      <h1 class="text-3xl font-bold">{{ blog.title[loc] }}</h1>
      <p class="text-gray-500">{{ blog.date }}</p>
    </div>
    <div class="p-4">
      <TableOfContent :toc="mdx.toc as any" />
    </div>
    <MDXProvider
    :components="{
      ...md,
      ...common,
    }">
      <Content />
    </MDXProvider>
  </div>
</template>
