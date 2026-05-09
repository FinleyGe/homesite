<script setup lang="ts">
type HomeNoteGroup = {
  title: string;
  items: string[];
};

defineProps<{
  title: string;
  intro: string;
  groups: HomeNoteGroup[];
}>();
</script>

<template>
  <section class="home-notes" aria-labelledby="home-notes-title">
    <div class="home-notes__heading">
      <p class="home-notes__kicker">
        02 / notes
      </p>
      <h2 id="home-notes-title">
        {{ title }}
      </h2>
      <p>
        {{ intro }}
      </p>
    </div>

    <div class="home-notes__grid">
      <article v-for="group in groups" :key="group.title" class="home-notes__card">
        <h3>{{ group.title }}</h3>
        <ul>
          <li v-for="item in group.items" :key="item">
            {{ item }}
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-notes {
  display: grid;
  grid-template-columns: minmax(12rem, 0.72fr) minmax(0, 1.28fr);
  gap: clamp(1.4rem, 4vw, 3rem);
  align-items: start;
  padding: clamp(2.5rem, 5vw, 4.5rem) 0;
}

.home-notes__heading {
  position: sticky;
  top: 1.5rem;
}

.home-notes__kicker {
  margin: 0 0 0.75rem;
  color: var(--color-rose);
  font-family: var(--font-code);
  font-size: 0.82rem;
  font-weight: 800;
}

.home-notes h2 {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(2.1rem, 5vw, 4.2rem);
  line-height: 0.95;
}

.home-notes__heading p:last-child {
  max-width: 22rem;
  margin: 1rem 0 0;
  color: var(--color-muted);
  line-height: 1.7;
}

.home-notes__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.home-notes__card {
  min-height: 12rem;
  border: 1px solid color-mix(in srgb, var(--color-sky) 26%, transparent);
  border-radius: 1.45rem;
  background: var(--color-surface);
  padding: clamp(1rem, 2.5vw, 1.35rem);
}

.home-notes__card:nth-child(2n) {
  transform: translateY(1.25rem);
}

.home-notes__card h3 {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: 1.45rem;
}

.home-notes__card ul {
  display: grid;
  gap: 0.72rem;
  padding: 0;
  margin: 1rem 0 0;
  list-style: none;
}

.home-notes__card li {
  position: relative;
  padding-left: 1.05rem;
  color: var(--color-muted);
  line-height: 1.55;
}

.home-notes__card li::before {
  position: absolute;
  top: 0.68em;
  left: 0;
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 999px;
  background: var(--color-rose);
  content: "";
}

@media (max-width: 860px) {
  .home-notes {
    grid-template-columns: 1fr;
  }

  .home-notes__heading {
    position: static;
  }
}

@media (max-width: 640px) {
  .home-notes__grid {
    grid-template-columns: 1fr;
  }

  .home-notes__card:nth-child(2n) {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-notes__card:nth-child(2n) {
    transform: none;
  }
}
</style>
