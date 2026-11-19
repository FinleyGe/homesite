<script setup lang="ts">
import { ArrowUpRight } from "@vicons/carbon";

type HomeFact = {
  label: string;
  value: string;
};

const props = defineProps<{
  label: string;
  currentTitle: string;
  currentBody: string;
  avatarSrc: string;
  avatarAlt: string;
  avatarFallback: string;
  facts: HomeFact[];
  currentHref?: string;
}>();

const imageFailed = ref(false);
const showAvatarImage = computed(() => props.avatarSrc && !imageFailed.value);

function handleImageError() {
  imageFailed.value = true;
}
</script>

<template>
  <aside class="home-identity" aria-labelledby="home-identity-title">
    <div class="home-identity__header">
      <div class="home-identity__avatar">
        <img
          v-if="showAvatarImage"
          :src="avatarSrc"
          :alt="avatarAlt"
          width="64"
          height="64"
          loading="eager"
          decoding="async"
          @error="handleImageError"
        >
        <span v-else aria-hidden="true">
          {{ avatarFallback }}
        </span>
      </div>

      <div class="home-identity__heading">
        <p class="home-identity__label">
          {{ label }}
        </p>
        <h2 id="home-identity-title" class="home-identity__title">
          {{ currentTitle }}
        </h2>
      </div>
    </div>

    <p class="home-identity__body">
      {{ currentBody }}
    </p>

    <a
      v-if="currentHref"
      class="home-identity__work-link"
      :href="currentHref"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>tryfastgpt.ai</span>
      <ArrowUpRight class="home-identity__link-icon" aria-hidden="true" />
    </a>

    <dl class="home-identity__facts" aria-label="Quick facts">
      <div v-for="fact in facts" :key="fact.label" class="home-identity__fact">
        <dt>{{ fact.label }}</dt>
        <dd>{{ fact.value }}</dd>
      </div>
    </dl>
  </aside>
</template>

<style scoped>
.home-identity {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  padding: 24px;
}

.home-identity__header {
  display: flex;
  gap: 16px;
  align-items: center;
}

.home-identity__avatar {
  display: grid;
  flex: 0 0 auto;
  width: 64px;
  height: 64px;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface-raised);
  color: var(--color-text-secondary);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
}

.home-identity__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-identity__heading {
  min-width: 0;
}

.home-identity__label {
  margin: 0 0 4px;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.33;
}

.home-identity__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 500;
  line-height: 1.2;
}

.home-identity__body {
  margin: 16px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.home-identity__work-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: var(--color-accent);
  font-family: var(--font-code);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms var(--ease-out);
}

.home-identity__work-link:hover {
  color: var(--color-accent-hover);
}

.home-identity__link-icon {
  width: 16px;
  height: 16px;
}

.home-identity__facts {
  display: grid;
  margin: 20px 0 0;
  border-top: 1px solid var(--color-border);
  padding-top: 4px;
}

.home-identity__fact {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
  border-bottom: 1px solid var(--color-border);
  padding: 10px 0;
  font-size: 0.875rem;
  line-height: 1.45;
}

.home-identity__fact:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.home-identity__fact dt {
  margin: 0;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
}

.home-identity__fact dd {
  margin: 0;
  color: var(--color-text);
  font-weight: 400;
}
</style>
