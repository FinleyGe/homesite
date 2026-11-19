<script setup lang="ts">
import { ArrowUpRight, Email } from "@vicons/carbon";
import { linkList } from "../../const/links";

const { t } = useI18n({
  messages: {
    zh: {
      eyebrow: "友邻目录",
      title: "友情链接",
      intro: "一些值得顺手拜访的个人站点。互联网最可爱的部分，往往藏在这些小门牌后面。",
      askForExchange: "申请交换友链",
      count: "{count} 个站点",
    },
    en: {
      eyebrow: "Directory",
      title: "Link Exchange",
      intro: "A small directory of personal sites worth visiting. The best corners of the web usually live behind tiny doorplates.",
      askForExchange: "Request exchange",
      count: "{count} sites",
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
    <header class="link-exchange-header" aria-labelledby="link-exchange-title">
      <div class="link-exchange-header__copy">
        <p class="link-exchange-header__eyebrow">
          <span>{{ t("eyebrow") }}</span>
          <span aria-hidden="true">·</span>
          <span class="link-exchange-header__count">{{ t("count", { count: linkList.length }) }}</span>
        </p>

        <h1 id="link-exchange-title" class="link-exchange-header__title">
          {{ t("title") }}
        </h1>

        <p class="link-exchange-header__intro">
          {{ t("intro") }}
        </p>
      </div>

      <ClientOnly>
        <button
          type="button"
          class="link-exchange-header__action"
          @click="handleAskForLinkExchange"
        >
          <Email class="link-exchange-header__action-icon" aria-hidden="true" />
          <span>{{ t("askForExchange") }}</span>
        </button>
      </ClientOnly>
    </header>

    <section class="friend-directory" aria-label="Friend links">
      <a
        v-for="(link, index) in linkList"
        :key="link.link"
        :href="link.link"
        target="_blank"
        rel="noopener noreferrer"
        class="friend-row"
      >
        <span class="friend-row__index">
          {{ index + 1 }}
        </span>

        <span class="friend-row__body">
          <span class="friend-row__name">
            {{ link.name }}
          </span>
          <span class="friend-row__url">
            {{ getHost(link.link) }}
          </span>
        </span>

        <ArrowUpRight class="friend-row__arrow" aria-hidden="true" />
      </a>
    </section>
  </div>
</template>

<style scoped>
.link-exchange-page {
  width: min(100%, 65rem);
  margin-inline: auto;
  padding: 40px 0 64px;
}

.link-exchange-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px 32px;
  align-items: end;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--color-border);
}

.link-exchange-header__copy {
  display: grid;
  gap: 8px;
}

.link-exchange-header__eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.link-exchange-header__count {
  font-family: var(--font-code);
  font-variant-numeric: tabular-nums;
}

.link-exchange-header__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

:global([lang^="zh"]) .link-exchange-header__title {
  letter-spacing: 0;
}

.link-exchange-header__intro {
  margin: 4px 0 0;
  max-width: 38rem;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
  text-wrap: pretty;
}

.link-exchange-header__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  box-shadow: var(--highlight-top);
  color: var(--color-text);
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  padding: 0 16px;
  white-space: nowrap;
  transition:
    background-color 150ms var(--ease-out),
    border-color 150ms var(--ease-out),
    transform 120ms var(--ease-out);
}

.link-exchange-header__action:hover {
  background-color: var(--color-surface-raised);
}

.link-exchange-header__action:active {
  transform: scale(0.98);
}

.link-exchange-header__action-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
}

.friend-directory {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 28px;
}

.friend-row {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) 16px;
  gap: 12px;
  align-items: center;
  min-height: 76px;
  padding: 16px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 150ms var(--ease-out),
    background-color 150ms var(--ease-out);
}

.friend-row:hover {
  border-color: var(--color-border-strong);
  background-color: var(--color-surface-raised);
}

.friend-row:hover .friend-row__name,
.friend-row:hover .friend-row__arrow {
  color: var(--color-accent);
}

.friend-row__index {
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.friend-row__body {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.friend-row__name {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.35;
  transition: color 150ms var(--ease-out);
}

.friend-row__url {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.8125rem;
  line-height: 1.4;
}

.friend-row__arrow {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
  transition: color 150ms var(--ease-out);
}

@media (max-width: 720px) {
  .link-exchange-page {
    padding: 28px 0 48px;
  }

  .link-exchange-header {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .link-exchange-header__action {
    width: fit-content;
  }

  .friend-directory {
    grid-template-columns: 1fr;
  }
}
</style>
