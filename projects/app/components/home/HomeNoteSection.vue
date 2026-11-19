<script setup lang="ts">
type HomeNoteGroup = {
  title: string;
  items: string[];
};

defineProps<{
  eyebrow: string;
  title: string;
  intro: string;
  groups: HomeNoteGroup[];
}>();
</script>

<template>
  <section class="home-notes" aria-labelledby="home-notes-title">
    <div class="home-notes__heading">
      <p class="home-notes__label">
        {{ eyebrow }}
      </p>
      <h2 id="home-notes-title" class="home-notes__title">
        {{ title }}
      </h2>
      <p class="home-notes__intro">
        {{ intro }}
      </p>
    </div>

    <div class="home-notes__grid">
      <article v-for="group in groups" :key="group.title" class="home-notes__card">
        <h3 class="home-notes__card-title">
          {{ group.title }}
        </h3>
        <ul class="home-notes__list">
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
  grid-template-columns: minmax(14rem, 0.65fr) minmax(0, 1.35fr);
  gap: 40px;
  align-items: start;
  border-top: 1px solid var(--color-border);
  padding: 56px 0;
}

.home-notes__heading {
  position: sticky;
  top: 24px;
}

.home-notes__label {
  margin: 0 0 8px;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.home-notes__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

:global([lang^="zh"]) .home-notes__title {
  letter-spacing: 0;
}

.home-notes__intro {
  max-width: 22rem;
  margin: 12px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.home-notes__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.home-notes__card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  padding: 20px;
}

.home-notes__card-title {
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
}

.home-notes__list {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 14px 0 0;
  list-style: none;
}

.home-notes__list li {
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

@media (max-width: 860px) {
  .home-notes {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 40px 0;
  }

  .home-notes__heading {
    position: static;
  }
}

@media (max-width: 640px) {
  .home-notes__grid {
    grid-template-columns: 1fr;
  }
}
</style>
