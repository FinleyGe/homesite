<script setup lang="ts">
import {
  ArrowUpRight,
  Chat,
  Close,
  Favorite,
  Repeat,
} from "@vicons/carbon";
import type { MomentItem, MomentMedia } from "~/const/mastodon";
import { formatMomentDate } from "~/utils/mastodon";

const props = defineProps<{
  moment: MomentItem;
}>();

const { t } = useI18n();

const showSpoilerContent = ref(!props.moment.spoilerText);
const lightboxMedia = ref<MomentMedia | null>(null);

const formattedDate = computed(() =>
  formatMomentDate(props.moment.createdAt),
);

const imageAttachments = computed(() =>
  props.moment.media.filter(item => item.type === "image"),
);

const otherAttachments = computed(() =>
  props.moment.media.filter(item => item.type !== "image"),
);

function openLightbox(media: MomentMedia) {
  lightboxMedia.value = media;
}

function closeLightbox() {
  lightboxMedia.value = null;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && lightboxMedia.value) {
    closeLightbox();
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <article class="moment-card">
    <header class="moment-card__header">
      <time class="moment-card__time" :datetime="moment.createdAt">
        {{ formattedDate }}
      </time>

      <a
        class="moment-card__source"
        :href="moment.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{{ t("moments.viewOriginal") }}</span>
        <ArrowUpRight class="moment-card__icon" aria-hidden="true" />
      </a>
    </header>

    <div v-if="moment.spoilerText" class="moment-card__spoiler">
      <p class="moment-card__spoiler-text">
        {{ moment.spoilerText }}
      </p>
      <button
        type="button"
        class="moment-card__spoiler-btn"
        :aria-expanded="showSpoilerContent"
        @click="showSpoilerContent = !showSpoilerContent"
      >
        {{ showSpoilerContent ? t("moments.hideContent") : t("moments.showContent") }}
      </button>
    </div>

    <div v-if="showSpoilerContent" class="moment-card__body">
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="moment.contentHtml"
        class="moment-card__content"
        v-html="moment.contentHtml"
      />
      <!-- eslint-enable vue/no-v-html -->

      <div
        v-if="imageAttachments.length"
        class="moment-card__gallery"
        :class="`moment-card__gallery--count-${Math.min(imageAttachments.length, 4)}`"
      >
        <button
          v-for="image in imageAttachments"
          :key="image.id"
          type="button"
          class="moment-card__image-btn"
          :aria-label="image.description || t('moments.openImage')"
          @click="openLightbox(image)"
        >
          <img
            :src="image.previewUrl"
            :alt="image.description"
            loading="lazy"
            decoding="async"
          >
        </button>
      </div>

      <div v-if="otherAttachments.length" class="moment-card__videos">
        <template v-for="media in otherAttachments" :key="media.id">
          <video
            v-if="media.type === 'video' || media.type === 'gifv'"
            class="moment-card__video"
            :src="media.url"
            :poster="media.previewUrl"
            :autoplay="media.type === 'gifv'"
            :loop="media.type === 'gifv'"
            :muted="media.type === 'gifv'"
            controls
            playsinline
          />
          <audio
            v-else-if="media.type === 'audio'"
            class="moment-card__audio"
            :src="media.url"
            controls
          />
        </template>
      </div>

      <a
        v-if="moment.card && !imageAttachments.length"
        class="moment-card__link-card"
        :href="moment.card.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          v-if="moment.card.image"
          class="moment-card__link-thumb"
          :src="moment.card.image"
          :alt="moment.card.title"
          loading="lazy"
          decoding="async"
        >
        <div class="moment-card__link-copy">
          <p v-if="moment.card.providerName" class="moment-card__link-provider">
            {{ moment.card.providerName }}
          </p>
          <p class="moment-card__link-title">
            {{ moment.card.title }}
          </p>
          <p v-if="moment.card.description" class="moment-card__link-desc">
            {{ moment.card.description }}
          </p>
        </div>
      </a>
    </div>

    <footer class="moment-card__footer">
      <div class="moment-card__stats">
        <span class="moment-card__stat" :title="t('moments.replies')">
          <Chat class="moment-card__stat-icon" aria-hidden="true" />
          <span>{{ moment.repliesCount }}</span>
        </span>
        <span class="moment-card__stat" :title="t('moments.reblogs')">
          <Repeat class="moment-card__stat-icon" aria-hidden="true" />
          <span>{{ moment.reblogsCount }}</span>
        </span>
        <span class="moment-card__stat" :title="t('moments.favourites')">
          <Favorite class="moment-card__stat-icon" aria-hidden="true" />
          <span>{{ moment.favouritesCount }}</span>
        </span>
      </div>
    </footer>

    <Teleport to="body">
      <div
        v-if="lightboxMedia"
        class="moment-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="lightboxMedia.description || t('moments.imagePreview')"
        @click.self="closeLightbox"
      >
        <button
          type="button"
          class="moment-lightbox__close"
          :aria-label="t('moments.closePreview')"
          @click="closeLightbox"
        >
          <Close class="moment-lightbox__close-icon" aria-hidden="true" />
        </button>
        <img
          class="moment-lightbox__img"
          :src="lightboxMedia.url"
          :alt="lightboxMedia.description"
        >
        <p v-if="lightboxMedia.description" class="moment-lightbox__caption">
          {{ lightboxMedia.description }}
        </p>
      </div>
    </Teleport>
  </article>
</template>

<style scoped>
.moment-card {
  display: grid;
  gap: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  padding: 24px;
  transition: border-color 150ms var(--ease-out);
}

.moment-card:hover {
  border-color: var(--color-border-strong);
}

.moment-card__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
}

.moment-card__time {
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
}

.moment-card__source {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms var(--ease-out);
}

.moment-card__source:hover {
  color: var(--color-accent);
}

.moment-card__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.moment-card__spoiler {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-raised);
  padding: 12px 16px;
}

.moment-card__spoiler-text {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.moment-card__spoiler-btn {
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-xs);
  background-color: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 4px 12px;
}

.moment-card__body {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.moment-card__content {
  color: var(--color-text);
  font-size: 0.96875rem;
  line-height: 1.75;
  overflow-wrap: anywhere;
}

.moment-card__content :deep(p) {
  margin: 0 0 12px;
}

.moment-card__content :deep(p:last-child) {
  margin-bottom: 0;
}

.moment-card__content :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-decoration-color: var(--color-accent-border);
  text-underline-offset: 3px;
  transition: color 150ms var(--ease-out);
}

.moment-card__content :deep(a:hover) {
  color: var(--color-accent-hover);
}

.moment-card__content :deep(.invisible) {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.moment-card__content :deep(.ellipsis::after) {
  content: "…";
}

.moment-card__content :deep(blockquote) {
  margin: 12px 0;
  border-left: 2px solid var(--color-border-strong);
  padding-left: 12px;
  color: var(--color-text-secondary);
}

.moment-card__content :deep(code) {
  border-radius: var(--radius-xs);
  background-color: var(--color-surface-raised);
  padding: 1px 5px;
  font-size: 0.875em;
}

.moment-card__content :deep(pre) {
  overflow-x: auto;
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-raised);
  padding: 12px;
}

.moment-card__gallery {
  display: grid;
  gap: 8px;
}

.moment-card__gallery--count-1 {
  grid-template-columns: 1fr;
}

.moment-card__gallery--count-2,
.moment-card__gallery--count-3,
.moment-card__gallery--count-4 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.moment-card__image-btn {
  display: block;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-raised);
  padding: 0;
  cursor: zoom-in;
  aspect-ratio: 16 / 10;
  transition: border-color 150ms var(--ease-out);
}

.moment-card__gallery--count-1 .moment-card__image-btn {
  max-height: 26rem;
  aspect-ratio: auto;
}

.moment-card__image-btn img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.moment-card__image-btn:hover {
  border-color: var(--color-border-strong);
}

.moment-card__videos {
  display: grid;
  gap: 8px;
}

.moment-card__video {
  width: 100%;
  max-height: 26rem;
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-raised);
}

.moment-card__audio {
  width: 100%;
}

.moment-card__link-card {
  display: flex;
  gap: 16px;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg);
  padding: 12px 16px;
  text-decoration: none;
  transition: border-color 150ms var(--ease-out);
}

.moment-card__link-card:hover {
  border-color: var(--color-border-strong);
}

.moment-card__link-thumb {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: var(--radius-xs);
  object-fit: cover;
  background-color: var(--color-surface-raised);
}

.moment-card__link-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.moment-card__link-provider {
  margin: 0;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
}

.moment-card__link-title {
  margin: 0;
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
}

.moment-card__link-desc {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.moment-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--color-border);
  padding-top: 12px;
}

.moment-card__stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.moment-card__stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.moment-card__stat-icon {
  width: 16px;
  height: 16px;
}

.moment-lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  gap: 12px;
  background-color: rgba(16, 14, 12, 0.86);
  padding: 24px;
}

.moment-lightbox__close {
  position: fixed;
  top: 20px;
  right: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  background-color: rgba(20, 18, 16, 0.72);
  color: #fff;
  cursor: pointer;
}

.moment-lightbox__close-icon {
  width: 20px;
  height: 20px;
}

.moment-lightbox__img {
  max-width: min(92vw, 72rem);
  max-height: 82vh;
  border-radius: var(--radius-sm);
  object-fit: contain;
}

.moment-lightbox__caption {
  max-width: 42rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 640px) {
  .moment-card {
    padding: 20px;
  }

  .moment-card__link-card {
    flex-direction: column;
    align-items: stretch;
  }

  .moment-card__link-thumb {
    width: 100%;
    height: 144px;
  }
}
</style>
