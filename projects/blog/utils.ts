import { useMDXComponents } from '@mdx-js/vue';
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'vue/jsx-runtime'
import remarkgfm from 'remark-gfm';
import remarkmath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
// @ts-expect-error: no types
import remarkHeadingId from 'remark-heading-id';
import { remarkMdxToc } from 'remark-mdx-toc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeKatex from 'rehype-katex';
import { Blog } from './type';
import { readdir, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export async function parse(content: string) {
  const mdx = await evaluate(
    content,
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
        // @ts-expect-error: no types
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

  return mdx.default
}

export async function getBlogs() {
  const blogs = []
  const blogDir = "./blogs/"
  for await (const blog of readdirSync(blogDir)) {
    const blogPath = join(__dirname, blogDir, blog)
    const a = await import(blogPath)
    if (!a.default || a.default.draft) {
      continue
    }
    blogs.push(a.default)
  }

  blogs.forEach(async (blog) => {
    const content = blog?.content
    if (content) {
      blog.content.en = await parse(content.en as string)
      blog.content.zh = await parse(content.zh as string)
    }
  })

  return blogs
}

console.log(await getBlogs())
