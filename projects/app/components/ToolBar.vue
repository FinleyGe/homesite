<script setup lang="ts">
import Button from '~/components/common/Button.vue';
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

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'zh' : 'en');
}

</script>
<template>
  <div class="flex flex-row justify-between w-full">
    <LogoTitle @click="router.push('/')" />
    <div class="flex flex-row w-min gap-x-2 mx-2">

      <Button circle @click="toggleTheme">
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
