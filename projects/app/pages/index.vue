<script setup lang="ts">
type HomeCta = {
  label: string;
  href: string;
  kind: "primary" | "secondary" | "quiet";
  external?: boolean;
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
  {
    label: t("home.contactCta"),
    href: "#contact",
    kind: "quiet",
    external: true,
  },
]);

const identityFacts = computed(() => [
  t("home.identity.factSchool"),
  t("home.identity.factType"),
  t("home.identity.factStack"),
  t("home.identity.factMode"),
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
        class="home-page__identity"
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

    <section class="home-page__direction" aria-labelledby="home-direction-title">
      <div>
        <p class="home-page__kicker">
          01 / direction
        </p>
        <h2 id="home-direction-title">
          {{ t("home.direction.title") }}
        </h2>
      </div>
      <p>
        {{ t("home.direction.body") }}
      </p>
      <NuxtLink :to="blogPath">
        {{ t("home.primaryCta") }}
      </NuxtLink>
    </section>

    <HomeNoteSection
      :title="t('home.notes.title')"
      :intro="t('home.notes.intro')"
      :groups="noteGroups"
    />

    <HomeContactStrip
      id="contact"
      :title="t('home.contact.title')"
      :body="t('home.contact.body')"
      :links="contactLinks"
    />
  </div>
</template>

<style scoped>
.home-page {
  width: min(100%, 72rem);
  margin: 0 auto;
  padding: 0 clamp(0.25rem, 2vw, 1rem);
  color: var(--color-ink);
  overflow-wrap: anywhere;
}

.home-page__lead {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.62fr);
  gap: clamp(1.2rem, 4vw, 3rem);
  align-items: center;
}

.home-page__identity {
  margin-top: clamp(2rem, 8vw, 7rem);
}

.home-page__state-card {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  border: 1px solid color-mix(in srgb, var(--color-warning) 44%, transparent);
  border-radius: 1.4rem;
  background: color-mix(in srgb, var(--color-surface-strong) 88%, transparent);
  margin: 0 0 2rem;
  padding: 1rem;
}

.home-page__state-card--error {
  border-color: color-mix(in srgb, var(--color-error) 48%, transparent);
}

.home-page__state-card h2 {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: 1.35rem;
}

.home-page__state-card p {
  margin: 0.35rem 0 0;
  color: var(--color-muted);
}

.home-page__state-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.home-page__state-actions a,
.home-page__state-actions button,
.home-page__direction a {
  display: inline-flex;
  min-height: 2.6rem;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--color-rose) 28%, transparent);
  border-radius: 999px;
  background: var(--color-surface-strong);
  color: var(--color-ink);
  cursor: pointer;
  font-weight: 800;
  line-height: 1;
  padding: 0.62rem 0.95rem;
  text-decoration: none;
}

.home-page__direction {
  display: grid;
  grid-template-columns: minmax(13rem, 0.65fr) minmax(0, 1fr) auto;
  gap: clamp(1rem, 3vw, 2rem);
  align-items: center;
  border-block: 1px solid color-mix(in srgb, var(--color-sky) 34%, transparent);
  padding: clamp(1.2rem, 3vw, 1.8rem) 0;
}

.home-page__kicker {
  margin: 0 0 0.55rem;
  color: var(--color-rose);
  font-family: var(--font-code);
  font-size: 0.82rem;
  font-weight: 800;
}

.home-page__direction h2 {
  margin: 0;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 3.25rem);
  line-height: 0.95;
}

.home-page__direction p {
  margin: 0;
  color: var(--color-muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

.home-page__direction a {
  background: var(--color-rose);
  color: white;
}

@media (max-width: 980px) {
  .home-page__lead,
  .home-page__direction {
    grid-template-columns: 1fr;
  }

  .home-page__identity {
    margin-top: 0;
  }

  .home-page__direction a {
    width: fit-content;
  }
}

@media (max-width: 520px) {
  .home-page__state-actions,
  .home-page__state-actions a,
  .home-page__state-actions button,
  .home-page__direction a {
    width: 100%;
  }
}
</style>
