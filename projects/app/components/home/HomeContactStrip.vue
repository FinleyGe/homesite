<script setup lang="ts">
type ContactLink = {
  label: string;
  href: string;
  platform: string;
};

defineProps<{
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
    <div>
      <p class="home-contact__kicker">
        03 / contact
      </p>
      <h2 id="home-contact-title">
        {{ title }}
      </h2>
      <p class="home-contact__body">
        {{ body }}
      </p>
    </div>

    <div class="home-contact__links" aria-label="Contact links">
      <a
        v-for="link in links"
        :key="link.href"
        class="home-contact__link"
        :href="link.href"
        :target="targetFor(link.href)"
        rel="noopener noreferrer"
      >
        <span>{{ link.label }}</span>
        <small>{{ link.platform }}</small>
      </a>
    </div>
  </section>
</template>

<style scoped>
.home-contact {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(1.5rem, 5vw, 4rem);
  align-items: center;
  margin: clamp(2rem, 5vw, 4.5rem) 0 clamp(3rem, 7vw, 6rem);
  border: 1px solid color-mix(in srgb, var(--color-rose) 26%, transparent);
  border-radius: 2rem;
  background:
    radial-gradient(circle at 8% 0%, color-mix(in srgb, var(--color-rose-soft) 72%, transparent), transparent 15rem),
    linear-gradient(135deg, var(--color-surface-strong), color-mix(in srgb, var(--color-sky) 12%, var(--color-surface)));
  box-shadow: var(--shadow-home-soft);
  padding: clamp(1.25rem, 4vw, 2rem);
}

.home-contact__kicker {
  margin: 0 0 0.7rem;
  color: var(--color-rose);
  font-family: var(--font-code);
  font-size: 0.82rem;
  font-weight: 800;
}

.home-contact h2 {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.8vw, 4rem);
  line-height: 0.95;
}

.home-contact__body {
  max-width: 31rem;
  margin: 1rem 0 0;
  color: var(--color-muted);
  line-height: 1.7;
}

.home-contact__links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.home-contact__link {
  display: flex;
  min-height: 4.4rem;
  flex-direction: column;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--color-sky) 30%, transparent);
  border-radius: 1.2rem;
  background: color-mix(in srgb, var(--color-surface-strong) 88%, transparent);
  color: var(--color-ink);
  padding: 0.85rem 1rem;
  text-decoration: none;
  transition:
    transform 140ms ease,
    border-color 140ms ease,
    background-color 140ms ease;
}

.home-contact__link:hover {
  border-color: var(--color-rose);
  transform: translateY(-2px);
}

.home-contact__link span {
  font-weight: 850;
}

.home-contact__link small {
  margin-top: 0.32rem;
  color: var(--color-muted);
  font-family: var(--font-code);
  font-size: 0.74rem;
}

@media (max-width: 760px) {
  .home-contact {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 460px) {
  .home-contact__links {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-contact__link:hover {
    transform: none;
  }
}
</style>
