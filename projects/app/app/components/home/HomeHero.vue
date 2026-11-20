<script setup lang="ts">
type HomeCtaKind = "primary" | "secondary";

type HomeCta = {
  label: string;
  href: string;
  kind: HomeCtaKind;
  external?: boolean;
  ariaLabel?: string;
};

defineProps<{
  eyebrow: string;
  title: string;
  subtitle: string;
  mantra: string;
  ctas: HomeCta[];
  state?: "ready" | "loading" | "empty" | "error";
  statusLabel?: string;
}>();
</script>

<template>
  <section class="home-hero" aria-labelledby="home-title">
    <p class="home-hero__eyebrow">
      <span class="home-hero__rule" aria-hidden="true" />
      <span>{{ eyebrow }}</span>
    </p>

    <h1 id="home-title" class="home-hero__title">
      {{ title }}
    </h1>

    <p class="home-hero__subtitle">
      {{ subtitle }}
    </p>

    <p class="home-hero__mantra">
      {{ mantra }}
    </p>

    <div class="home-hero__actions" aria-label="Homepage actions">
      <template v-for="cta in ctas" :key="cta.label">
        <a
          v-if="cta.external"
          class="home-hero__cta"
          :class="`home-hero__cta--${cta.kind}`"
          :href="cta.href"
          :aria-label="cta.ariaLabel"
          rel="noopener noreferrer"
        >
          {{ cta.label }}
        </a>
        <NuxtLink
          v-else
          class="home-hero__cta"
          :class="`home-hero__cta--${cta.kind}`"
          :to="cta.href"
          :aria-label="cta.ariaLabel"
        >
          {{ cta.label }}
        </NuxtLink>
      </template>
    </div>

    <p v-if="state && state !== 'ready'" class="home-hero__state" role="status">
      {{ statusLabel }}
    </p>
  </section>
</template>

<style scoped>
.home-hero {
  display: grid;
  gap: 16px;
  max-width: 36rem;
  animation: fadeRise 320ms var(--ease-out) both;
}

.home-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

.home-hero__rule {
  width: 16px;
  height: 2px;
  border-radius: 1px;
  background-color: var(--color-accent);
}

.home-hero__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 6vw, 4.5rem);
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.05;
}

.home-hero__subtitle {
  margin: 4px 0 0;
  max-width: 34rem;
  color: var(--color-text-secondary);
  font-size: clamp(1.0625rem, 1.8vw, 1.25rem);
  font-weight: 400;
  line-height: 1.55;
  text-wrap: pretty;
}

.home-hero__mantra {
  margin: 0;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.875rem;
  line-height: 1.5;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.home-hero__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 0 20px;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  transition:
    background-color 150ms var(--ease-out),
    border-color 150ms var(--ease-out),
    color 150ms var(--ease-out),
    transform 120ms var(--ease-out);
}

.home-hero__cta:active {
  transform: scale(0.98);
}

.home-hero__cta--primary {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-text);
}

.home-hero__cta--primary:hover {
  background-color: var(--color-primary-hover);
}

.home-hero__cta--secondary {
  border-color: var(--color-border-strong);
  background-color: var(--color-surface);
  box-shadow: var(--highlight-top);
  color: var(--color-text);
}

.home-hero__cta--secondary:hover {
  background-color: var(--color-surface-raised);
}

.home-hero__state {
  margin: 8px 0 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

@media (max-width: 480px) {
  .home-hero__cta {
    flex: 1 1 100%;
  }
}
</style>
