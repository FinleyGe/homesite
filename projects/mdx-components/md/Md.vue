<script setup lang="ts">
import {compile, evaluate, run} from '@mdx-js/mdx';
import { VFile } from 'vfile';
import { useMDXComponents } from '@mdx-js/vue';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import * as runtime from 'vue/jsx-runtime';

const props = defineProps<{
  file: string,
}>();

// const code =  await compile({
//   path: props.file}
//   ,{
//   remarkPlugins: [
//     remarkFrontmatter,
//     remarkMdxFrontmatter,
// ],});

// const content = await run(code, {
//   ...runtime,
//   useMDXComponents
// })
const vfile = new VFile({path: props.file})
// console.log(vfile)
const content = await evaluate(
  vfile, {
  ...runtime,
  // jsx: true,
  useMDXComponents,
  remarkPlugins: [
    remarkFrontmatter,
    remarkMdxFrontmatter,
  ],
})

const Content = content.default;
// console.log(content)

</script>
<template>
  <div>
    {{ vfile }}
    <!-- {{ code }} -->
    <!-- <MDXProvider :components="md"> -->
      <Content />
    <!-- </MDXProvider> -->
    
  </div>
</template>

<style scoped>

</style>
