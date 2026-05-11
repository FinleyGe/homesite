<script setup lang="ts">

const { t } = useI18n({
  messages: {
    en: {
      donate: 'Donate',
      buymeacoffee: 'Buy me a coffee, please',
    },
    zh: {
      donate: '捐赠',
      buymeacoffee: '请我喝杯咖啡吧～',
    }
  }
})

const list = [
  {
    name: 'Wechat',
    image: '/wechat-pay.png',
    color: 'green',
  },
  {
    name: 'Alipay',
    image: '/alipay.jpg',
    color: 'blue',
  },
]

const choice = ref(0)

</script>
<template>
  <div class="mx-auto max-w-5xl px-4">
    <h1 class="text-3xl font-bold text-center mt-10">{{ t('donate') }}</h1>
    <div class="flex flex-row justify-center gap-2">
      <div v-for="(item, index) in list" :key="index" class="w-20 flex justify-center">
        <CommonButton @click="choice = index">{{
          item.name }}</CommonButton>
      </div>
    </div>
    <img
      :src="list[choice].image"
      :alt="`${list[choice].name} donation QR code`"
      class="mx-auto mt-10 h-auto w-full max-w-[500px] rounded-[1.5rem] shadow-[var(--shadow-home-soft)]"
    >
    <h2 class="text-center text-xl mt-10">{{ t('buymeacoffee') }}</h2>
  </div>
</template>
