<script setup lang="ts">
import { MDXProvider, useMDXComponents } from '@mdx-js/vue';
import md from 'mdx-components/md';
import type { run } from '@mdx-js/mdx';
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'vue/jsx-runtime'
import HoverComment from 'mdx-components/common/HoverComment';
import Avatar from '~/components/Avatar.vue';
import ColorfulButton from '~/components/common/ColorfulButton.vue';
import about from '~/content/about.mdx?raw'
import aboutZh from '~/content/about.zh.mdx?raw'

type MDXContent = Awaited<ReturnType<typeof run>>['default']
const Content = ref<MDXContent>();

const { locale } = useI18n();

const content = computed(() => {
  return locale.value === 'zh' ? aboutZh : about
})

async function update() {
  const mdx = await evaluate(
    content.value, { ...runtime, useMDXComponents, })
  Content.value = mdx.default
}

update()

</script>
<template>
  <div class="p-4 max-w-2xl mx-auto">
    <MDXProvider
      :components="{
        ...md,
        'HoverComment': HoverComment,
        'Avatar': Avatar,
        'Button': ColorfulButton,
      }">

      <Content />
    </MDXProvider>
  </div>
</template>
