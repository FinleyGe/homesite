<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { MDXProvider, useMDXComponents } from '@mdx-js/vue';
import md from '~/components/md';
import type { run } from '@mdx-js/mdx';
import {evaluate} from '@mdx-js/mdx'
import * as runtime from 'vue/jsx-runtime'

const props = defineProps<{
  content: string,
  time?: Date,
  lang?: string,
}>();

type MDXContent = Awaited<ReturnType<typeof run>>['default']
const Content = ref<MDXContent>()

async function update() {
  const mdx = await evaluate(props.content, { ...runtime, useMDXComponents, })
  Content.value = mdx.default
}

defineExpose({
  update
})

update()

</script>
<template>
  <div class="m-2 bg-gray-100 dark:bg-gray-700 p-4 rounded-md my-4">
    <MDXProvider :components="md">
      <Content />
    </MDXProvider>
    <span class="text-xs text-gray-500 dark:text-gray-400">
    {{ time?.toLocaleString() }}
    </span>
    <span class="text-xs text-gray-500 dark:text-gray-400">
    {{ lang }}
    </span>
  </div>
</template>
