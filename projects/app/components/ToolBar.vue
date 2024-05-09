<script setup lang="ts">
import Button from '~/components/common/Button.vue';
import ColorfulButton from '~/components/common/ColorfulButton.vue';

import LogoTitle from './LogoTitle.vue';
import { Sun, Moon } from '@vicons/carbon';
const colorMode = useColorMode();

defineProps<{
  hideTitle: boolean;
}>();

const router = useRouter();

function toggleTheme() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark';
}
const { locale, setLocale } = useI18n();
const isLargeScreen = useMediaQuery('(min-width: 1024px)');

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'zh' : 'en');
}

</script>
<template>
  <div class="flex flex-row justify-between w-full">

    <LogoTitle @click="router.push('/')" />
    <div class="flex flex-row h-min items-center content-center px-2 py-1 gap-x-2" v-if="isLargeScreen">
      <ColorfulButton color="pink" router-link="blog">
        {{ $t('common.blog') }}
      </ColorfulButton>

      <ColorfulButton color="blue" router-link="post">
        {{ $t('common.post') }}
      </ColorfulButton>

      <ColorfulButton color="gray" router-link="playground">
        {{ $t('common.playground') }}
      </ColorfulButton>
    </div>

    <div class="flex flex-row w-min mx-2">
      <Button @click="toggleTheme">
        <template #icon>
          <Sun v-if="colorMode.value == 'dark'" />
          <Moon v-else />
        </template>
      </Button>

      <Button @click="toggleLocale">
        {{ $t('lang') }}
      </Button>

    </div>
  </div>
</template>

<style scoped></style>
