<script setup lang="ts">
import { linkList } from "../../const/links";

const { t } = useI18n({
  messages: {
    zh: {
      eyebrow: "Friends & neighbors",
      title: "友情链接",
      intro: "一些值得顺手拜访的个人站点。互联网最可爱的部分，往往藏在这些小门牌后面。",
      askForExchange: "申请友情链接",
      visit: "访问站点",
    },
    en: {
      eyebrow: "Friends & neighbors",
      title: "Link Exchange",
      intro: "A small directory of personal sites worth visiting. The best corners of the web usually live behind tiny doorplates.",
      askForExchange: "Ask for exchange",
      visit: "Visit site",
    },
  },
});

const getHost = (link: string) => {
  return new URL(link).hostname.replace(/^www\./, "");
};

function handleAskForLinkExchange() {
  window.open("mailto:finleyge@qq.com");
}
</script>
<template>
  <div class="link-exchange-page">
    <section class="link-exchange-hero" aria-labelledby="link-exchange-title">
      <div class="link-exchange-hero__copy">
        <p class="link-exchange-hero__eyebrow">
          {{ t("eyebrow") }}
        </p>

        <h1 id="link-exchange-title" class="link-exchange-hero__title">
          {{ t("title") }}
        </h1>

        <p class="link-exchange-hero__intro">
          {{ t("intro") }}
        </p>
      </div>

      <ClientOnly>
        <button
          type="button"
          class="link-exchange-hero__action"
          @click="handleAskForLinkExchange"
        >
          {{ t("askForExchange") }}
        </button>
      </ClientOnly>
    </section>

    <section class="friend-grid" aria-label="Friend links">
      <a
        v-for="link in linkList"
        :key="link.link"
        :href="link.link"
        target="_blank"
        rel="noopener noreferrer"
        class="friend-card"
      >
        <span class="friend-card__name">
          {{ link.name }}
        </span>
        <span class="friend-card__url">
          {{ getHost(link.link) }}
        </span>
        <span class="friend-card__visit">
          {{ t("visit") }}
        </span>
      </a>
    </section>
  </div>
</template>

<style scoped>
.link-exchange-page {
  width: min(100% - clamp(2rem, 5vw, 4rem), 64rem);
  margin-inline: auto;
  padding-bottom: 4rem;
}

.link-exchange-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(1rem, 4vw, 2.5rem);
  align-items: end;
  padding: clamp(1.35rem, 4vw, 2.4rem);
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

.link-exchange-hero__copy {
  display: grid;
  gap: 0.7rem;
}

.link-exchange-hero__eyebrow {
  color: rgba(23, 32, 51, 0.62);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.link-exchange-hero__title {
  max-width: 11ch;
  color: rgb(23, 32, 51);
  font-size: clamp(2.25rem, 6vw, 4.7rem);
  font-weight: 800;
  letter-spacing: -0.065em;
  line-height: 0.95;
  text-wrap: balance;
}

.link-exchange-hero__intro {
  max-width: 45rem;
  color: rgba(23, 32, 51, 0.76);
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
  text-wrap: pretty;
}

.link-exchange-hero__action {
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
    transform 180ms ease;
}

.link-exchange-hero__action:hover,
.friend-card:hover {
  transform: translateY(-2px);
}

.friend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  gap: 0.9rem;
  margin-top: 1.25rem;
}

.friend-card {
  display: grid;
  min-height: 8rem;
  align-content: space-between;
  gap: 1rem;
  padding: 1.2rem;
  border: 1px solid rgba(23, 32, 51, 0.08);
  border-radius: 1.45rem;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.78),
      rgba(255, 248, 243, 0.62)
    );
  box-shadow: 0 16px 42px rgba(23, 32, 51, 0.07);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.friend-card:hover {
  border-color: rgba(17, 153, 119, 0.18);
  box-shadow: 0 20px 54px rgba(23, 32, 51, 0.1);
}

.friend-card__name {
  color: rgb(23, 32, 51);
  font-size: 1.15rem;
  font-weight: 750;
  letter-spacing: -0.025em;
}

.friend-card__url {
  color: rgba(23, 32, 51, 0.62);
  font-size: 0.875rem;
  overflow-wrap: anywhere;
}

.friend-card__visit {
  width: fit-content;
  min-height: 2.25rem;
  border-radius: 999px;
  background: rgba(207, 234, 242, 0.72);
  color: rgb(23, 32, 51);
  font-size: 0.875rem;
  line-height: 2.25rem;
  padding: 0 0.8rem;
}

:global(.dark) .link-exchange-hero,
:global(.dark) .friend-card {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(17, 24, 39, 0.76);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}

:global(.dark) .link-exchange-hero__title,
:global(.dark) .friend-card__name,
:global(.dark) .friend-card__visit {
  color: rgba(248, 250, 252, 0.94);
}

:global(.dark) .link-exchange-hero__intro,
:global(.dark) .friend-card__url,
:global(.dark) .link-exchange-hero__eyebrow {
  color: rgba(226, 232, 240, 0.68);
}

:global(.dark) .link-exchange-hero__action {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.7);
}

:global(.dark) .friend-card__visit {
  background: rgba(31, 41, 55, 0.82);
}

@media (max-width: 720px) {
  .link-exchange-page {
    width: min(100% - 2rem, 64rem);
  }

  .link-exchange-hero {
    grid-template-columns: 1fr;
    align-items: start;
    border-radius: 1.5rem;
  }

  .link-exchange-hero__action {
    width: 100%;
  }
}
</style>
