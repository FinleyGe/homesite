import { Command } from 'commander';
import { parse } from '../utils'
import { readFileSync, writeFileSync, watchFile } from 'fs';
import { run } from '@mdx-js/mdx';
import * as jsx from 'vue/jsx-runtime'
import { renderToString } from 'vue/server-renderer'
import {
  start,
} from 'live-server'
import { useMDXComponents } from '@mdx-js/vue';

const program = new Command();

async function generate({ path }: { path: string }) {
  console.log('generate preview...')
  try {

    const content = readFileSync(path, 'utf-8')
    if (!content) {
      console.log('no content')
      return
    }
    const blog = await parse(content)
    const code = await run(blog, {
      ...jsx,
      useMDXComponents,
    })
    const html = await renderToString((code.default as any)())
    const head = `<!DOCTYPE html><head><meta charset="UTF-8"></head>`
    writeFileSync('preview.html', `${head}<body>${html}</body>`)
  } catch (error) {
    console.log(error)
  }
}

async function main() {
  program.name('blog-preview')
    .description('preview blog')
    .requiredOption('-p --path <path>', 'path of blog')

  program.parse();
  const options = program.opts();
  await generate({ path: options.path })
  watchFile(options.path, async () => {
    await generate({ path: options.path })
  })
}

console.log('preview, waiting for blog change...')
main()

start({
  file: 'preview.html',
  port: 8080,
  open: true,
})
