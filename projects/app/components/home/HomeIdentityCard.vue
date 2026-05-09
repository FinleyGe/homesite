<script setup lang="ts">
const props = defineProps<{
  label: string;
  currentTitle: string;
  currentBody: string;
  avatarSrc: string;
  avatarAlt: string;
  avatarFallback: string;
  facts: string[];
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
          width="88"
          height="88"
          loading="eager"
          decoding="async"
          @error="handleImageError"
        >
        <span v-else aria-hidden="true">
          {{ avatarFallback }}
        </span>
      </div>
      <div>
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
      rel="noopener noreferrer"
    >
      tryfastgpt.ai
    </a>

    <ul class="home-identity__facts" aria-label="Quick facts">
      <li v-for="fact in facts" :key="fact">
        {{ fact }}
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.home-identity {
  position: relative;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-sky) 38%, transparent);
  border-radius: 1.75rem;
  background:
    linear-gradient(145deg, var(--color-surface-strong), color-mix(in srgb, var(--color-canvas-warm) 84%, transparent)),
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--color-rose-soft) 64%, transparent), transparent 13rem);
  box-shadow: var(--shadow-home-card);
  padding: clamp(1.2rem, 3vw, 1.7rem);
}

.home-identity::before {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 4rem;
  height: 4rem;
  border: 1px solid color-mix(in srgb, var(--color-rose) 30%, transparent);
  border-radius: 999px;
  content: "";
  opacity: 0.55;
}

.home-identity__header {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.home-identity__avatar {
  display: grid;
  flex: 0 0 auto;
  width: 5.5rem;
  height: 5.5rem;
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-rose) 24%, white);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-rose-soft) 74%, white);
  color: var(--color-rose);
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 800;
}

.home-identity__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-identity__label {
  margin: 0 0 0.35rem;
  color: var(--color-rose);
  font-size: 0.74rem;
  font-weight: 850;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.home-identity__title {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 3vw, 2rem);
  line-height: 1.02;
}

.home-identity__body {
  position: relative;
  z-index: 1;
  margin: 1.2rem 0 0;
  color: var(--color-muted);
  font-size: 1rem;
  line-height: 1.65;
}

.home-identity__work-link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  margin-top: 0.9rem;
  color: var(--color-ink);
  font-family: var(--font-code);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration-color: var(--color-rose-soft);
  text-decoration-line: underline;
  text-decoration-thickness: 0.35em;
  text-underline-offset: -0.12em;
  transition: text-decoration-color 120ms ease;
}

.home-identity__work-link:hover {
  text-decoration-color: var(--color-rose);
}

.home-identity__facts {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 1.35rem 0 0;
  list-style: none;
}

.home-identity__facts li {
  border: 1px solid color-mix(in srgb, var(--color-sky) 30%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface-strong) 86%, transparent);
  color: var(--color-ink);
  font-size: 0.84rem;
  font-weight: 750;
  line-height: 1;
  padding: 0.52rem 0.72rem;
}

@media (max-width: 640px) {
  .home-identity__header {
    align-items: flex-start;
  }

  .home-identity__avatar {
    width: 4.75rem;
    height: 4.75rem;
  }
}
</style>
