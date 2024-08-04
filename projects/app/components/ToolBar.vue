<script setup lang="ts">
import Button from '~/components/common/Button.vue';
import ColorfulButton from '~/components/common/ColorfulButton.vue';
import LogoTitle from './LogoTitle.vue';
import { Sun, Moon } from '@vicons/carbon';

const colorMode = useColorMode();
const localePath = useLocalePath();
const router = useRouter();

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}

const { locale, setLocale } = useI18n();

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'zh' : 'en');
}

</script>

<template>
  <div class="flex flex-row justify-between w-full items-center">
    <LogoTitle @click="router.push(localePath('/'))" />

    <div class="flex flex-row h-min items-center content-center px-2 py-1 gap-x-4 overflow-scroll">
      <ColorfulButton color="pink" :router-link="localePath('blog')">
        {{ $t('common.blog') }}
      </ColorfulButton>

      <ColorfulButton color="blue" :router-link="localePath('post')">
        {{ $t('common.post') }}
      </ColorfulButton>

      <ColorfulButton color="gray" :router-link="localePath('playground')">
        {{ $t('common.playground') }}
      </ColorfulButton>
    </div>

    <div class="flex flex-row mx-2 gap-x-1">
      <Button circle @click="toggleTheme">
        <template #icon>
          <Sun v-if="colorMode.value == 'dark'" />
          <Moon v-else />
        </template>
      </Button>

      <Button circle @click="toggleLocale">
        {{ locale === 'en' ? '中' : 'EN' }}
      </Button>

    </div>
  </div>
</template>

<style scoped></style>
