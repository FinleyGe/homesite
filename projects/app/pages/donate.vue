<script setup lang="ts">
const { t } = useI18n({
  messages: {
    en: {
      donate: "Donate",
      eyebrow: "Support the site",
      intro: "If something here helped you, a coffee is a lovely little signal to keep writing.",
      buymeacoffee: "Buy me a coffee",
      scan: "Scan with",
    },
    zh: {
      donate: "捐赠",
      eyebrow: "Support the site",
      intro: "如果这里的文章或工具帮到了你，请我喝杯咖啡就是很开心的反馈。",
      buymeacoffee: "请我喝杯咖啡吧～",
      scan: "扫码使用",
    },
  },
});

const list = [
  {
    name: "Wechat",
    image: "/wechat-pay.png",
    color: "green",
  },
  {
    name: "Alipay",
    image: "/alipay.jpg",
    color: "blue",
  },
];

const choice = ref(0);
const selectedMethod = computed(() => list[choice.value]);
</script>

<template>
  <div class="donate-page">
    <section class="donate-hero" aria-labelledby="donate-title">
      <div class="donate-hero__copy">
        <p class="donate-hero__eyebrow">
          {{ t("eyebrow") }}
        </p>

        <h1 id="donate-title" class="donate-hero__title">
          {{ t("donate") }}
        </h1>

        <p class="donate-hero__intro">
          {{ t("intro") }}
        </p>
      </div>

      <div class="donate-methods" aria-label="Donation methods">
        <button
          v-for="(item, index) in list"
          :key="item.name"
          type="button"
          class="donate-method"
          :class="{ 'is-active': choice === index }"
          :aria-pressed="choice === index"
          @click="choice = index"
        >
          {{ item.name }}
        </button>
      </div>
    </section>

    <section class="donate-card" aria-live="polite">
      <div class="donate-card__copy">
        <p class="donate-card__method">
          {{ selectedMethod.name }}
        </p>

        <h2 class="donate-card__title">
          {{ t("buymeacoffee") }}
        </h2>

        <p class="donate-card__hint">
          {{ t("scan") }} {{ selectedMethod.name }}
        </p>
      </div>

      <div class="donate-card__qr-shell">
        <img
          :src="selectedMethod.image"
          :alt="`${selectedMethod.name} donation QR code`"
          class="donate-card__qr"
        >
      </div>
    </section>
  </div>
</template>

<style scoped>
.donate-page {
  width: min(100% - clamp(2rem, 5vw, 4rem), 64rem);
  margin-inline: auto;
  padding-bottom: 4rem;
}

.donate-hero,
.donate-card {
  border: 1px solid rgba(23, 32, 51, 0.08);
  border-radius: 2rem;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.84),
      rgba(255, 248, 243, 0.68) 58%,
      rgba(207, 234, 242, 0.48)
    );
  box-shadow: 0 22px 60px rgba(23, 32, 51, 0.08);
  backdrop-filter: blur(18px);
}

.donate-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(1rem, 4vw, 2.5rem);
  align-items: end;
  padding: clamp(1.35rem, 4vw, 2.4rem);
}

.donate-hero__copy {
  display: grid;
  gap: 0.7rem;
}

.donate-hero__eyebrow,
.donate-card__method,
.donate-card__hint {
  color: rgba(23, 32, 51, 0.62);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
}

.donate-hero__eyebrow {
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.donate-hero__title {
  color: rgb(23, 32, 51);
  font-size: clamp(2.35rem, 6vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.065em;
  line-height: 0.95;
  text-wrap: balance;
}

.donate-hero__intro {
  max-width: 45rem;
  color: rgba(23, 32, 51, 0.76);
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
  text-wrap: pretty;
}

.donate-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.donate-method {
  min-height: 2.75rem;
  border: 1px solid rgba(196, 68, 124, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 26px rgba(23, 32, 51, 0.08);
  color: oklch(0.408 0.153 2.432);
  cursor: pointer;
  font: inherit;
  padding: 0 1rem;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.donate-method:hover,
.donate-method.is-active {
  border-color: rgba(196, 68, 124, 0.22);
  background: rgba(246, 217, 228, 0.9);
  transform: translateY(-1px);
}

.donate-card {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(16rem, 1fr);
  gap: clamp(1.25rem, 4vw, 3rem);
  align-items: center;
  margin-top: 1.25rem;
  padding: clamp(1.2rem, 4vw, 2.6rem);
}

.donate-card__copy {
  display: grid;
  gap: 0.75rem;
}

.donate-card__title {
  max-width: 12ch;
  color: rgb(23, 32, 51);
  font-size: clamp(1.8rem, 4vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.055em;
  line-height: 1;
  text-wrap: balance;
}

.donate-card__qr-shell {
  display: grid;
  place-items: center;
  min-height: clamp(18rem, 34vw, 25rem);
  border: 1px solid rgba(23, 32, 51, 0.08);
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at 50% 38%, rgba(255, 255, 255, 0.5), transparent 12rem),
    rgba(255, 255, 255, 0.56);
  overflow: hidden;
}

.donate-card__qr {
  width: min(100%, 24rem);
  max-height: min(58vh, 28rem);
  object-fit: contain;
}

:global(.dark) .donate-hero,
:global(.dark) .donate-card,
:global(.dark) .donate-card__qr-shell {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(17, 24, 39, 0.76);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}

:global(.dark) .donate-hero__title,
:global(.dark) .donate-card__title {
  color: rgba(248, 250, 252, 0.94);
}

:global(.dark) .donate-hero__intro,
:global(.dark) .donate-hero__eyebrow,
:global(.dark) .donate-card__method,
:global(.dark) .donate-card__hint {
  color: rgba(226, 232, 240, 0.68);
}

:global(.dark) .donate-method {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.7);
}

:global(.dark) .donate-method:hover,
:global(.dark) .donate-method.is-active {
  background: rgba(246, 217, 228, 0.16);
}

@media (max-width: 760px) {
  .donate-page {
    width: min(100% - 2rem, 64rem);
  }

  .donate-hero,
  .donate-card {
    grid-template-columns: 1fr;
    border-radius: 1.5rem;
  }

  .donate-methods {
    justify-content: flex-start;
  }

  .donate-method {
    flex: 1 1 calc(50% - 0.5rem);
  }

  .donate-card__qr-shell {
    min-height: 20rem;
  }

  .donate-card__qr {
    max-height: 24rem;
  }
}
</style>
