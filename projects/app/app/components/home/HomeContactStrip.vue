<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from "@vicons/carbon";

type ContactLink = {
  label: string;
  href: string;
  platform: string;
  internal?: boolean;
};

defineProps<{
  eyebrow: string;
  title: string;
  body: string;
  links: ContactLink[];
}>();

function targetFor(href: string) {
  return href.startsWith("mailto:") ? undefined : "_blank";
}
</script>

<template>
  <section class="home-contact" aria-labelledby="home-contact-title">
    <div class="home-contact__copy">
      <p class="home-contact__label">
        {{ eyebrow }}
      </p>
      <h2 id="home-contact-title" class="home-contact__title">
        {{ title }}
      </h2>
      <p class="home-contact__body">
        {{ body }}
      </p>
    </div>

    <div class="home-contact__links" aria-label="Contact links">
      <template v-for="link in links" :key="link.href">
        <NuxtLink
          v-if="link.internal"
          class="home-contact__link"
          :to="link.href"
        >
          <div class="home-contact__link-copy">
            <span class="home-contact__link-name">{{ link.label }}</span>
            <span class="home-contact__link-platform">{{ link.platform }}</span>
          </div>
          <ArrowRight class="home-contact__link-icon" aria-hidden="true" />
        </NuxtLink>
        <a
          v-else
          class="home-contact__link"
          :href="link.href"
          :target="targetFor(link.href)"
          rel="noopener noreferrer"
        >
          <div class="home-contact__link-copy">
            <span class="home-contact__link-name">{{ link.label }}</span>
            <span class="home-contact__link-platform">{{ link.platform }}</span>
          </div>
          <ArrowUpRight class="home-contact__link-icon" aria-hidden="true" />
        </a>
      </template>
    </div>
  </section>
</template>

<style scoped>
.home-contact {
  display: grid;
  grid-template-columns: minmax(14rem, 0.65fr) minmax(0, 1.35fr);
  gap: 40px;
  align-items: start;
  border-top: 1px solid var(--color-border);
  padding: 56px 0 64px;
}

.home-contact__label {
  margin: 0 0 8px;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.home-contact__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

:global([lang^="zh"]) .home-contact__title {
  letter-spacing: 0;
}

.home-contact__body {
  max-width: 24rem;
  margin: 12px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.home-contact__links {
  display: grid;
  border-top: 1px solid var(--color-border);
}

.home-contact__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 52px;
  border-bottom: 1px solid var(--color-border);
  padding: 12px 8px;
  color: var(--color-text);
  text-decoration: none;
  transition:
    background-color 150ms var(--ease-out),
    color 150ms var(--ease-out);
}

.home-contact__link:hover {
  background-color: var(--color-surface);
}

.home-contact__link:hover .home-contact__link-name,
.home-contact__link:hover .home-contact__link-icon {
  color: var(--color-accent);
}

.home-contact__link-copy {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  gap: 12px;
  align-items: baseline;
  min-width: 0;
  flex: 1 1 auto;
}

.home-contact__link-name {
  font-size: 0.9375rem;
  font-weight: 500;
  transition: color 150ms var(--ease-out);
}

.home-contact__link-platform {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.8125rem;
}

.home-contact__link-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: color 150ms var(--ease-out);
}

@media (max-width: 860px) {
  .home-contact {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 40px 0 48px;
  }
}

@media (max-width: 520px) {
  .home-contact__link-copy {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}
</style>
