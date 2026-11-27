import {
  MASTODON_CONFIG,
  type MastodonStatus,
  type MomentItem,
} from "~/const/mastodon";
import { normalizeMastodonStatus } from "~/utils/mastodon";

export type MomentsFetchStatus =
  | "idle"
  | "loading"
  | "ready"
  | "fallback"
  | "offline";

type CachedMomentsPayload = {
  savedAt: number;
  items: MomentItem[];
};

function readCachedMoments(): CachedMomentsPayload | null {
  if (!import.meta.client) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(MASTODON_CONFIG.cacheKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<CachedMomentsPayload>;
    if (
      typeof parsed.savedAt !== "number"
      || !Array.isArray(parsed.items)
      || parsed.items.length === 0
    ) {
      return null;
    }

    return {
      savedAt: parsed.savedAt,
      items: parsed.items,
    };
  }
  catch {
    return null;
  }
}

function writeCachedMoments(freshItems: MomentItem[]): void {
  if (!import.meta.client || freshItems.length === 0) {
    return;
  }

  try {
    const existing = readCachedMoments()?.items ?? [];
    const freshIds = new Set(freshItems.map(item => item.id));
    const merged = [
      ...freshItems,
      ...existing.filter(item => !freshIds.has(item.id)),
    ].slice(0, MASTODON_CONFIG.defaultPageSize);

    const payload: CachedMomentsPayload = {
      savedAt: Date.now(),
      items: merged,
    };
    window.localStorage.setItem(MASTODON_CONFIG.cacheKey, JSON.stringify(payload));
  }
  catch {
    // Ignore storage quota or private-mode failures.
  }
}

async function fetchMastodonStatuses(params: {
  limit: number;
  maxId?: string;
}): Promise<MomentItem[]> {
  const url = new URL(
    `/api/v1/accounts/${MASTODON_CONFIG.accountId}/statuses`,
    MASTODON_CONFIG.instanceUrl,
  );
  url.searchParams.set("limit", String(params.limit));
  url.searchParams.set("exclude_replies", "true");
  url.searchParams.set("exclude_reblogs", "true");
  if (params.maxId) {
    url.searchParams.set("max_id", params.maxId);
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    MASTODON_CONFIG.requestTimeoutMs,
  );

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Mastodon API returned ${response.status}`);
    }

    const rawList: unknown = await response.json();
    if (!Array.isArray(rawList)) {
      throw new Error("Unexpected Mastodon API payload");
    }

    return rawList
      .map(entry => normalizeMastodonStatus(entry as MastodonStatus))
      .filter((entry): entry is MomentItem => entry !== null);
  }
  finally {
    window.clearTimeout(timeoutId);
  }
}

export function useMastodonMoments() {
  const items = ref<MomentItem[]>([]);
  const status = ref<MomentsFetchStatus>("idle");
  const loadingMore = ref(false);
  const loadMoreFailed = ref(false);
  const hasMore = ref(false);
  const isFromCache = ref(false);
  const lastSyncedAt = ref<number | null>(null);

  let activePageSize: number = MASTODON_CONFIG.defaultPageSize;

  async function fetchInitial(options?: { limit?: number; force?: boolean }) {
    if (!import.meta.client) {
      return;
    }

    const limit = options?.limit ?? MASTODON_CONFIG.defaultPageSize;
    activePageSize = limit;
    loadMoreFailed.value = false;

    const cached = readCachedMoments();
    if (cached) {
      items.value = cached.items.slice(0, Math.max(limit, cached.items.length));
      lastSyncedAt.value = cached.savedAt;
      isFromCache.value = true;
      hasMore.value = cached.items.length >= limit;

      const cacheFresh = Date.now() - cached.savedAt < MASTODON_CONFIG.cacheTtlMs;
      if (cacheFresh && !options?.force && cached.items.length >= limit) {
        status.value = "ready";
        return;
      }
    }
    else {
      status.value = "loading";
    }

    try {
      const fresh = await fetchMastodonStatuses({ limit });
      items.value = fresh;
      hasMore.value = fresh.length >= limit;
      isFromCache.value = false;
      lastSyncedAt.value = Date.now();
      status.value = "ready";

      if (fresh.length > 0 && limit >= MASTODON_CONFIG.homePreviewLimit) {
        writeCachedMoments(fresh);
      }
    }
    catch {
      if (items.value.length > 0) {
        status.value = "fallback";
        isFromCache.value = true;
      }
      else {
        status.value = "offline";
        hasMore.value = false;
      }
    }
  }

  async function loadMore() {
    if (!import.meta.client || loadingMore.value || !hasMore.value) {
      return;
    }

    const lastItem = items.value[items.value.length - 1];
    if (!lastItem) {
      return;
    }

    loadingMore.value = true;
    loadMoreFailed.value = false;

    try {
      const nextBatch = await fetchMastodonStatuses({
        limit: activePageSize,
        maxId: lastItem.id,
      });

      const existingIds = new Set(items.value.map(item => item.id));
      const uniqueNext = nextBatch.filter(item => !existingIds.has(item.id));

      items.value = [...items.value, ...uniqueNext];
      hasMore.value = nextBatch.length >= activePageSize && uniqueNext.length > 0;
    }
    catch {
      loadMoreFailed.value = true;
    }
    finally {
      loadingMore.value = false;
    }
  }

  function retry() {
    return fetchInitial({ limit: activePageSize, force: true });
  }

  return {
    items,
    status,
    loadingMore,
    loadMoreFailed,
    hasMore,
    isFromCache,
    lastSyncedAt,
    fetchInitial,
    loadMore,
    retry,
  };
}
