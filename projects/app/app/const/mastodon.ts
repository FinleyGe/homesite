export const MASTODON_CONFIG = {
  instanceUrl: "https://g0v.social",
  accountId: "109642423387701238",
  handle: "@FinleyGe@g0v.social",
  profileUrl: "https://g0v.social/@FinleyGe",
  defaultPageSize: 20,
  homePreviewLimit: 3,
  requestTimeoutMs: 7000,
  cacheKey: "homesite:mastodon:moments:v1",
  cacheTtlMs: 5 * 60 * 1000,
} as const;

export type MastodonMediaAttachment = {
  id: string;
  type: "image" | "video" | "gifv" | "audio" | "unknown" | string;
  url: string;
  preview_url?: string | null;
  description?: string | null;
  meta?: {
    original?: {
      width?: number;
      height?: number;
      aspect?: number;
    };
  };
};

export type MastodonCard = {
  url: string;
  title: string;
  description?: string | null;
  provider_name?: string | null;
  image?: string | null;
};

export type MastodonTag = {
  name: string;
  url: string;
};

export type MastodonStatus = {
  id: string;
  created_at: string;
  url?: string | null;
  uri?: string | null;
  content?: string | null;
  visibility?: string | null;
  sensitive?: boolean;
  spoiler_text?: string | null;
  replies_count?: number;
  reblogs_count?: number;
  favourites_count?: number;
  media_attachments?: MastodonMediaAttachment[];
  tags?: MastodonTag[];
  card?: MastodonCard | null;
};

export type MomentMedia = {
  id: string;
  type: "image" | "video" | "gifv" | "audio";
  url: string;
  previewUrl: string;
  description: string;
};

export type MomentCardLink = {
  url: string;
  title: string;
  description: string;
  providerName: string;
  image: string | null;
};

export type MomentItem = {
  id: string;
  createdAt: string;
  url: string;
  contentHtml: string;
  summary: string;
  sensitive: boolean;
  spoilerText: string;
  repliesCount: number;
  reblogsCount: number;
  favouritesCount: number;
  media: MomentMedia[];
  tags: string[];
  card: MomentCardLink | null;
};
