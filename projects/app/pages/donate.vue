<script setup lang="ts">
const { t } = useI18n({
  messages: {
    en: {
      donate: "Donate",
      eyebrow: "Support",
      intro: "If something here helped you, a coffee is a welcome signal to keep writing.",
      buymeacoffee: "Buy me a coffee",
      scan: "Scan with {method}",
      wechat: "WeChat",
      alipay: "Alipay",
    },
    zh: {
      donate: "赞助",
      eyebrow: "支持站点",
      intro: "如果这里的文章或工具帮到了你，请我喝杯咖啡就是很好的反馈。",
      buymeacoffee: "请我喝杯咖啡",
      scan: "使用 {method} 扫码",
      wechat: "微信",
      alipay: "支付宝",
    },
  },
});

const list = computed(() => [
  {
    key: "wechat",
    name: t("wechat"),
    image: "/wechat-pay.png",
  },
  {
    key: "alipay",
    name: t("alipay"),
    image: "/alipay.jpg",
  },
]);

const choice = ref(0);
const selectedMethod = computed(() => list.value[choice.value]);
</script>

<template>
  <div class="donate-page">
    <header class="donate-header" aria-labelledby="donate-title">
      <div class="donate-header__copy">
        <p class="donate-header__eyebrow">
          {{ t("eyebrow") }}
        </p>

        <h1 id="donate-title" class="donate-header__title">
          {{ t("donate") }}
        </h1>

        <p class="donate-header__intro">
          {{ t("intro") }}
        </p>
      </div>

      <div class="donate-methods" role="group" aria-label="Donation methods">
        <button
          v-for="(item, index) in list"
          :key="item.key"
          type="button"
          class="donate-method"
          :class="{ 'is-active': choice === index }"
          :aria-pressed="choice === index"
          @click="choice = index"
        >
          {{ item.name }}
        </button>
      </div>
    </header>

    <section class="donate-panel" aria-live="polite">
      <div class="donate-panel__copy">
        <p class="donate-panel__method">
          {{ selectedMethod.name }}
        </p>

        <h2 class="donate-panel__title">
          {{ t("buymeacoffee") }}
        </h2>

        <p class="donate-panel__hint">
          {{ t("scan", { method: selectedMethod.name }) }}
        </p>
      </div>

      <figure class="donate-panel__qr-frame">
        <img
          :src="selectedMethod.image"
          :alt="`${selectedMethod.name} donation QR code`"
          class="donate-panel__qr"
        >
      </figure>
    </section>
  </div>
</template>

<style scoped>
.donate-page {
  width: min(100%, 65rem);
  margin-inline: auto;
  padding: 40px 0 64px;
}

.donate-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px 32px;
  align-items: end;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--color-border);
}

.donate-header__copy {
  display: grid;
  gap: 8px;
}

.donate-header__eyebrow {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.donate-header__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

:global([lang^="zh"]) .donate-header__title {
  letter-spacing: 0;
}

.donate-header__intro {
  margin: 4px 0 0;
  max-width: 38rem;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.donate-methods {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-surface-raised);
}

.donate-method {
  min-height: 36px;
  min-width: 88px;
  border: 1px solid transparent;
  border-radius: var(--radius-xs);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  padding: 0 16px;
  transition:
    background-color 150ms var(--ease-out),
    border-color 150ms var(--ease-out),
    color 150ms var(--ease-out);
}

.donate-method:hover {
  color: var(--color-text);
}

.donate-method.is-active {
  border-color: var(--color-border);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  color: var(--color-text);
}

.donate-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(16rem, 20rem);
  gap: 32px;
  align-items: center;
  margin-top: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  padding: clamp(24px, 4vw, 40px);
}

.donate-panel__copy {
  display: grid;
  gap: 8px;
}

.donate-panel__method {
  margin: 0;
  color: var(--color-accent);
  font-family: var(--font-code);
  font-size: 0.8125rem;
  font-weight: 500;
}

.donate-panel__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.2;
}

:global([lang^="zh"]) .donate-panel__title {
  letter-spacing: 0;
}

.donate-panel__hint {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.donate-panel__qr-frame {
  margin: 0;
  width: 100%;
  max-width: 20rem;
  justify-self: end;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface-raised);
}

.donate-panel__qr {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

@media (max-width: 760px) {
  .donate-page {
    padding: 28px 0 48px;
  }

  .donate-header,
  .donate-panel {
    grid-template-columns: 1fr;
  }

  .donate-methods {
    width: fit-content;
  }

  .donate-panel__qr-frame {
    justify-self: start;
  }
}
</style>
