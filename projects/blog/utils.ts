// import { useMDXComponents } from '@mdx-js/vue';
import { compile } from '@mdx-js/mdx'
import remarkgfm from 'remark-gfm';
import remarkmath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
// @ts-expect-error: no types
import remarkHeadingId from 'remark-heading-id';
import { remarkMdxToc } from 'remark-mdx-toc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeKatex from 'rehype-katex';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Blog } from './type';

export async function parse(content: string) {
  const mdx = String(await compile(
    content,
    {
      outputFormat: 'function-body',
      // useMDXComponents,
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
  ));

  return mdx;
}

export async function getBlogs() {
  const blogs = [] as Blog[];
  const blogDir = "./blogs/"
  for await (const item of readdirSync(blogDir)) {
    const blogPath = join(__dirname, blogDir, item)
    if (blogPath.includes('template')) {
      continue
    }
    const blog = (await import(blogPath)).default as Blog
    if (!blog || blog.draft) {
      continue
    }
    const en = await parse(readFileSync(blog.content.en, 'utf-8'))
    const zh = await parse(readFileSync(blog.content.zh, 'utf-8'))
    writeFileSync(join(blogPath, 'en.jsx'), en.toString())
    writeFileSync(join(blogPath, 'zh.jsx'), zh.toString())
    blog.path = item
    blogs.push(blog)
  }
  return blogs
}
