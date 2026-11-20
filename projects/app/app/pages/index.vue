<script setup lang="ts">
import { ArrowRight } from "@vicons/carbon";

type HomeCta = {
  label: string;
  href: string;
  kind: "primary" | "secondary";
  external?: boolean;
};

type HomeFact = {
  label: string;
  value: string;
};

type HomeNoteGroup = {
  title: string;
  items: string[];
};

type ContactLink = {
  label: string;
  href: string;
  platform: string;
};

const { t, locale } = useI18n();
const localePath = useLocalePath();

const {
  data: aboutContents,
  error,
  refresh,
  status,
} = await useAsyncData("home-about", () =>
  queryCollection("about").where("title", "=", "about").all(),
);

const { data: recentBlogs } = await useAsyncData("home-recent-blogs", () =>
  queryCollection("blog")
    .order("create", "DESC")
    .select("id", "title", "path", "description", "create", "update", "lang", "cover", "coverAlt")
    .limit(4)
    .all(),
);

const selectedAbout = computed(() => {
  const contents = aboutContents.value ?? [];
  return (
    contents.find((item) => item.meta.locale === locale.value)
    ?? contents.find((item) => item.meta.locale === "en")
  );
});

const homeState = computed<"ready" | "loading" | "empty" | "error">(() => {
  if (error.value) {
    return "error";
  }

  if (status.value === "pending") {
    return "loading";
  }

  if (!aboutContents.value?.length || !selectedAbout.value) {
    return "empty";
  }

  return "ready";
});

const featuredBlog = computed(() => {
  const list = recentBlogs.value ?? [];
  return list.find((item) => Boolean(item.cover)) ?? list[0] ?? null;
});

const secondaryBlogs = computed(() => {
  const list = recentBlogs.value ?? [];
  return list.filter((item) => item.id !== featuredBlog.value?.id).slice(0, 3);
});

const blogPath = computed(() => localePath("/blog"));
const nowPath = computed(() => localePath("/now"));

const heroCtas = computed<HomeCta[]>(() => [
  {
    label: t("home.primaryCta"),
    href: blogPath.value,
    kind: "primary",
  },
  {
    label: t("home.secondaryCta"),
    href: nowPath.value,
    kind: "secondary",
  },
]);

const identityFacts = computed<HomeFact[]>(() => [
  {
    label: t("home.identity.factSchoolLabel"),
    value: t("home.identity.factSchool"),
  },
  {
    label: t("home.identity.factTypeLabel"),
    value: t("home.identity.factType"),
  },
  {
    label: t("home.identity.factStackLabel"),
    value: t("home.identity.factStack"),
  },
  {
    label: t("home.identity.factModeLabel"),
    value: t("home.identity.factMode"),
  },
]);

const noteGroups = computed<HomeNoteGroup[]>(() => [
  {
    title: t("home.notes.aboutTitle"),
    items: [
      t("home.notes.aboutOne"),
      t("home.notes.aboutTwo"),
      t("home.notes.aboutThree"),
    ],
  },
  {
    title: t("home.notes.stackTitle"),
    items: [
      t("home.notes.stackOne"),
      t("home.notes.stackTwo"),
      t("home.notes.stackThree"),
    ],
  },
  {
    title: t("home.notes.interestsTitle"),
    items: [
      t("home.notes.interestsOne"),
      t("home.notes.interestsTwo"),
      t("home.notes.interestsThree"),
    ],
  },
  {
    title: t("home.notes.languagesTitle"),
    items: [
      t("home.notes.languagesOne"),
      t("home.notes.languagesTwo"),
      t("home.notes.languagesThree"),
    ],
  },
]);

const contactLinks = computed<ContactLink[]>(() => [
  {
    label: t("home.contact.github"),
    href: "https://github.com/FinleyGe",
    platform: "github.com/FinleyGe",
  },
  {
    label: t("home.contact.email"),
    href: "mailto:finleyge@qq.com",
    platform: "finleyge@qq.com",
  },
  {
    label: t("home.contact.mastodon"),
    href: "https://g0v.social/@FinleyGe@g0v.social",
    platform: "g0v.social",
  },
  {
    label: t("home.contact.zhihu"),
    href: "https://www.zhihu.com/people/ge-jun-75-34",
    platform: "zhihu.com",
  },
  {
    label: t("home.contact.bilibili"),
    href: "https://space.bilibili.com/62847286",
    platform: "space.bilibili.com",
  },
]);

const stateTitle = computed(() => {
  if (homeState.value === "error") {
    return t("home.errorTitle");
  }

  if (homeState.value === "empty") {
    return t("home.emptyTitle");
  }

  return t("home.loadingLabel");
});

const stateBody = computed(() => {
  if (homeState.value === "error") {
    return t("home.errorBody");
  }

  if (homeState.value === "empty") {
    return t("home.emptyBody");
  }

  return "";
});
</script>

<template>
  <div class="home-page">
    <div class="home-page__lead">
      <HomeHero
        :eyebrow="t('home.eyebrow')"
        :title="t('home.title')"
        :subtitle="t('home.subtitle')"
        :mantra="t('home.mantra')"
        :ctas="heroCtas"
        :state="homeState"
        :status-label="stateTitle"
      />

      <HomeIdentityCard
        :label="t('home.identity.label')"
        :current-title="t('home.identity.currentTitle')"
        :current-body="t('home.identity.currentBody')"
        avatar-src="https://avatars.githubusercontent.com/u/32237950?v=4"
        :avatar-alt="t('home.identity.avatarAlt')"
        avatar-fallback="FG"
        :facts="identityFacts"
        current-href="https://tryfastgpt.ai"
      />
    </div>

    <section
      v-if="homeState !== 'ready' && homeState !== 'loading'"
      class="home-page__state-card"
      :class="`home-page__state-card--${homeState}`"
      :role="homeState === 'error' ? 'alert' : 'status'"
    >
      <div>
        <h2>{{ stateTitle }}</h2>
        <p>{{ stateBody }}</p>
      </div>
      <div class="home-page__state-actions">
        <button v-if="homeState === 'error'" type="button" @click="refresh()">
          {{ t("home.retry") }}
        </button>
        <NuxtLink :to="blogPath">
          {{ t("home.primaryCta") }}
        </NuxtLink>
        <NuxtLink :to="nowPath">
          {{ t("home.secondaryCta") }}
        </NuxtLink>
      </div>
    </section>

    <section class="home-writing" aria-labelledby="home-direction-title">
      <div class="home-writing__header">
        <div>
          <p class="home-section-label">
            {{ t("home.direction.eyebrow") }}
          </p>
          <h2 id="home-direction-title" class="home-section-title">
            {{ t("home.direction.title") }}
          </h2>
          <p class="home-writing__intro">
            {{ t("home.direction.body") }}
          </p>
        </div>

        <NuxtLink class="home-writing__all" :to="blogPath">
          <span>{{ t("home.direction.allPosts") }}</span>
          <ArrowRight class="home-writing__icon" aria-hidden="true" />
        </NuxtLink>
      </div>

      <div v-if="featuredBlog" class="home-writing__showcase">
        <NuxtLink class="home-featured" :to="localePath(featuredBlog.path)">
          <div v-if="featuredBlog.cover" class="home-featured__media">
            <img
              :src="featuredBlog.cover"
              :alt="featuredBlog.coverAlt ?? featuredBlog.title"
              loading="eager"
              decoding="async"
            >
          </div>

          <div class="home-featured__body">
            <p class="home-featured__meta">
              <span>{{ featuredBlog.update ?? featuredBlog.create }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ t(`lang.${featuredBlog.lang}`) }}</span>
            </p>
            <h3 class="home-featured__title">
              {{ featuredBlog.title }}
            </h3>
            <p class="home-featured__desc">
              {{ featuredBlog.description }}
            </p>
            <span class="home-featured__cta">
              <span>{{ t("blog.readArticle") }}</span>
              <ArrowRight class="home-writing__icon" aria-hidden="true" />
            </span>
          </div>
        </NuxtLink>

        <ul v-if="secondaryBlogs.length" class="home-recent-list">
          <li v-for="post in secondaryBlogs" :key="post.id" class="home-recent-item">
            <NuxtLink class="home-recent-item__link" :to="localePath(post.path)">
              <span class="home-recent-item__title">{{ post.title }}</span>
              <span class="home-recent-item__date">{{ post.update ?? post.create }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <HomeNoteSection
      :eyebrow="t('home.notes.eyebrow')"
      :title="t('home.notes.title')"
      :intro="t('home.notes.intro')"
      :groups="noteGroups"
    />

    <HomeContactStrip
      id="contact"
      :eyebrow="t('home.contact.eyebrow')"
      :title="t('home.contact.title')"
      :body="t('home.contact.body')"
      :links="contactLinks"
    />
  </div>
</template>

<style scoped>
.home-page {
  width: min(100%, 65rem);
  margin-inline: auto;
  color: var(--color-text);
  overflow-wrap: anywhere;
}

.home-page__lead {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(19rem, 0.85fr);
  gap: 48px;
  align-items: center;
  padding: 56px 0 64px;
}

.home-page__state-card {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  margin: 0 0 32px;
  padding: 16px 20px;
}

.home-page__state-card--error {
  border-color: var(--color-error);
}

.home-page__state-card h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 500;
}

.home-page__state-card p {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.home-page__state-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.home-page__state-actions a,
.home-page__state-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-raised);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0 12px;
  text-decoration: none;
}

.home-section-label {
  margin: 0 0 8px;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}

.home-section-title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

:global([lang^="zh"]) .home-section-title {
  letter-spacing: 0;
}

.home-writing {
  border-top: 1px solid var(--color-border);
  padding: 56px 0;
}

.home-writing__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 32px;
  margin-bottom: 32px;
}

.home-writing__intro {
  max-width: 38rem;
  margin: 12px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.home-writing__all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  color: var(--color-accent);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms var(--ease-out);
}

.home-writing__all:hover {
  color: var(--color-accent-hover);
}

.home-writing__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.home-writing__showcase {
  display: grid;
  gap: 24px;
}

.home-featured {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 28px;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  padding: 16px;
  text-decoration: none;
  transition:
    border-color 150ms var(--ease-out),
    background-color 150ms var(--ease-out);
}

.home-featured:hover {
  border-color: var(--color-border-strong);
}

.home-featured__media {
  overflow: hidden;
  aspect-ratio: 3 / 2;
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-raised);
}

.home-featured__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-featured__body {
  display: grid;
  gap: 12px;
  padding: 8px 12px 8px 0;
}

.home-featured__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.home-featured__title {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 2.4vw, 1.75rem);
  font-weight: 500;
  line-height: 1.25;
  text-wrap: balance;
}

.home-featured__desc {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.home-featured__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  color: var(--color-accent);
  font-size: 0.875rem;
  font-weight: 500;
}

.home-recent-list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-border);
}

.home-recent-item {
  border-bottom: 1px solid var(--color-border);
}

.home-recent-item__link {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 4px;
  text-decoration: none;
  transition: color 150ms var(--ease-out);
}

.home-recent-item__title {
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.45;
  transition: color 150ms var(--ease-out);
}

.home-recent-item__link:hover .home-recent-item__title {
  color: var(--color-accent);
}

.home-recent-item__date {
  flex-shrink: 0;
  color: var(--color-text-muted);
  font-family: var(--font-code);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 900px) {
  .home-page__lead {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 36px 0 48px;
  }

  .home-featured {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .home-featured__body {
    padding: 4px;
  }
}

@media (max-width: 640px) {
  .home-writing {
    padding: 40px 0;
  }

  .home-recent-item__link {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
