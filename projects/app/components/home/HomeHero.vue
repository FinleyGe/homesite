<script setup lang="ts">
type HomeCtaKind = "primary" | "secondary" | "quiet";

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
    <div class="home-hero__copy">
      <p class="home-hero__eyebrow">
        {{ eyebrow }}
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
    </div>

    <div class="home-hero__atmosphere" aria-hidden="true">
      <span class="home-hero__moon" />
      <span class="home-hero__line home-hero__line--one" />
      <span class="home-hero__line home-hero__line--two" />
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 8rem;
  gap: clamp(1rem, 3vw, 2.5rem);
  align-items: end;
  min-height: clamp(23rem, 52vh, 35rem);
  padding: clamp(2.6rem, 5vw, 5rem) 0 clamp(1.4rem, 4vw, 3rem);
  overflow: hidden;
}

.home-hero__copy {
  position: relative;
  z-index: 1;
  max-width: 55rem;
  animation: homeFloatIn 220ms ease-out both;
}

.home-hero__eyebrow {
  margin: 0 0 0.9rem;
  color: var(--color-rose);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.home-hero__title {
  margin: 0;
  max-width: 11ch;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(4rem, 9.5vw, 8.7rem);
  font-weight: 800;
  letter-spacing: -0.08em;
  line-height: 0.86;
}

.home-hero__subtitle {
  max-width: 42rem;
  margin: clamp(1.1rem, 2.3vw, 1.8rem) 0 0;
  color: var(--color-ink);
  font-size: clamp(1.25rem, 2.6vw, 2.05rem);
  font-weight: 650;
  line-height: 1.16;
}

.home-hero__mantra {
  margin: 1rem 0 0;
  color: var(--color-muted);
  font-family: var(--font-code);
  font-size: clamp(0.92rem, 1.4vw, 1.05rem);
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: clamp(1.25rem, 2.4vw, 1.8rem);
}

.home-hero__cta {
  display: inline-flex;
  min-height: 2.9rem;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--color-rose) 28%, transparent);
  border-radius: 999px;
  padding: 0.72rem 1.1rem;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;
  transition:
    transform 140ms ease,
    border-color 140ms ease,
    background-color 140ms ease,
    box-shadow 140ms ease;
}

.home-hero__cta:hover {
  transform: translateY(-2px);
}

.home-hero__cta--primary {
  background: var(--color-rose);
  box-shadow: var(--shadow-home-soft);
  color: white;
}

.home-hero__cta--secondary {
  background: color-mix(in srgb, var(--color-sky) 24%, var(--color-surface-strong));
  color: var(--color-ink);
}

.home-hero__cta--quiet {
  background: var(--color-surface);
  color: var(--color-ink);
}

.home-hero__state {
  margin: 1rem 0 0;
  color: var(--color-muted);
  font-size: 0.95rem;
}

.home-hero__atmosphere {
  position: relative;
  min-height: 18rem;
  opacity: 0.55;
}

.home-hero__moon {
  position: absolute;
  right: 0.6rem;
  bottom: 6.8rem;
  width: clamp(5.25rem, 9vw, 7rem);
  aspect-ratio: 1;
  border-radius: 999px;
  background:
    radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9), transparent 28%),
    linear-gradient(145deg, var(--color-rose-soft), color-mix(in srgb, var(--color-sky) 65%, white));
  box-shadow: var(--shadow-home-card);
  opacity: 0.78;
}

.home-hero__line {
  position: absolute;
  right: 1.2rem;
  display: block;
  width: clamp(9rem, 18vw, 15rem);
  height: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-rose) 42%, transparent);
}

.home-hero__line--one {
  bottom: 5.5rem;
}

.home-hero__line--two {
  bottom: 4.5rem;
  right: 3rem;
  width: clamp(4rem, 8vw, 6rem);
  background: color-mix(in srgb, var(--color-mint) 50%, transparent);
}

@media (max-width: 900px) {
  .home-hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-top: 3rem;
  }

  .home-hero__atmosphere {
    min-height: 6rem;
    order: -1;
  }

  .home-hero__moon {
    right: 0;
    bottom: 0.5rem;
    width: 5.8rem;
  }

  .home-hero__line {
    right: 5rem;
    bottom: 1.3rem;
  }

  .home-hero__line--two {
    right: 8rem;
    bottom: 0.2rem;
  }
}

@media (max-width: 480px) {
  .home-hero__title {
    font-size: clamp(3.4rem, 21vw, 4.8rem);
    letter-spacing: -0.07em;
  }

  .home-hero__cta {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero__copy {
    animation: none;
  }

  .home-hero__cta:hover {
    transform: none;
  }
}
</style>
