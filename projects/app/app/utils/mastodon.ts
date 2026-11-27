import type {
  MastodonMediaAttachment,
  MastodonStatus,
  MomentCardLink,
  MomentItem,
  MomentMedia,
} from "../const/mastodon";

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "a",
  "span",
  "strong",
  "b",
  "em",
  "i",
  "code",
  "pre",
  "blockquote",
  "ul",
  "ol",
  "li",
  "del",
  "s",
]);

const VOID_TAGS = new Set(["br"]);

const ALLOWED_SPAN_CLASSES = new Set([
  "invisible",
  "ellipsis",
  "h-card",
  "u-url",
  "mention",
  "hashtag",
]);

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
      const codePoint = Number.parseInt(hex, 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : "";
    })
    .replace(/&#(\d+);/g, (_, dec: string) => {
      const codePoint = Number.parseInt(dec, 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : "";
    });
}

function sanitizeSafeUrl(raw: string | null | undefined): string | null {
  if (!raw) {
    return null;
  }

  const trimmed = decodeHtmlEntities(raw).trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  }
  catch {
    return null;
  }
}

function extractAttr(attrs: string, name: string): string | null {
  const pattern = new RegExp(
    `(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>` + "`" + `]+))`,
    "i",
  );
  const match = attrs.match(pattern);
  if (!match) {
    return null;
  }
  return match[1] ?? match[2] ?? match[3] ?? null;
}

/**
 * Sanitizes Mastodon status HTML using a strict tag and attribute allowlist
 * without relying on DOM APIs so it works identically in browser and Node tests.
 */
export function sanitizeMastodonHtml(html: string): string {
  if (!html) {
    return "";
  }

  const strippedDangerous = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|svg|math)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|iframe|object|embed|svg|math)\b[^>]*\/?>/gi, "");

  return strippedDangerous.replace(/<\/?([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?\/?>/g, (full, rawTag: string, rawAttrs = "") => {
    const tag = rawTag.toLowerCase();
    const isClosing = full.startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    if (isClosing) {
      return VOID_TAGS.has(tag) ? "" : `</${tag}>`;
    }

    if (tag === "br") {
      return "<br>";
    }

    if (tag === "a") {
      const safeHref = sanitizeSafeUrl(extractAttr(rawAttrs, "href"));
      if (!safeHref) {
        return "<span>";
      }
      return `<a href="${escapeAttr(safeHref)}" target="_blank" rel="noopener noreferrer">`;
    }

    if (tag === "span") {
      const classAttr = extractAttr(rawAttrs, "class");
      if (classAttr) {
        const safeClasses = classAttr
          .split(/\s+/)
          .filter(token => ALLOWED_SPAN_CLASSES.has(token));
        if (safeClasses.length > 0) {
          return `<span class="${safeClasses.join(" ")}">`;
        }
      }
      return "<span>";
    }

    return `<${tag}>`;
  });
}

/**
 * Extracts clean plain-text summary from Mastodon status HTML for compact previews.
 */
export function extractMastodonSummary(html: string, maxLength = 160): string {
  if (!html) {
    return "";
  }

  const cleaned = html
    .replace(/<span\b[^>]*class\s*=\s*(?:"[^"]*\binvisible\b[^"]*"|'[^']*\binvisible\b[^']*')[^>]*>[\s\S]*?<\/span>/gi, "")
    .replace(/<span\b[^>]*class\s*=\s*(?:"[^"]*\bellipsis\b[^"]*"|'[^']*\bellipsis\b[^']*')[^>]*>([\s\S]*?)<\/span>/gi, "$1…")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>\s*<p[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "");

  const normalized = decodeHtmlEntities(cleaned).replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function normalizeMedia(attachments: MastodonMediaAttachment[] | undefined): MomentMedia[] {
  if (!Array.isArray(attachments)) {
    return [];
  }

  const items: MomentMedia[] = [];
  for (const item of attachments) {
    if (!item || typeof item.id !== "string") {
      continue;
    }

    const mediaType = item.type;
    if (
      mediaType !== "image"
      && mediaType !== "video"
      && mediaType !== "gifv"
      && mediaType !== "audio"
    ) {
      continue;
    }

    const safeUrl = sanitizeSafeUrl(item.url);
    if (!safeUrl) {
      continue;
    }

    const safePreview = sanitizeSafeUrl(item.preview_url) ?? safeUrl;
    items.push({
      id: item.id,
      type: mediaType,
      url: safeUrl,
      previewUrl: safePreview,
      description: (item.description ?? "").trim(),
    });
  }

  return items;
}

function normalizeCard(card: MastodonStatus["card"]): MomentCardLink | null {
  if (!card) {
    return null;
  }

  const safeUrl = sanitizeSafeUrl(card.url);
  const title = (card.title ?? "").trim();
  if (!safeUrl || !title) {
    return null;
  }

  return {
    url: safeUrl,
    title,
    description: (card.description ?? "").trim(),
    providerName: (card.provider_name ?? "").trim(),
    image: sanitizeSafeUrl(card.image),
  };
}

export function normalizeMastodonStatus(raw: MastodonStatus): MomentItem | null {
  if (!raw || typeof raw.id !== "string" || typeof raw.created_at !== "string") {
    return null;
  }

  if (raw.visibility && raw.visibility !== "public") {
    return null;
  }

  const safeUrl = sanitizeSafeUrl(raw.url) ?? sanitizeSafeUrl(raw.uri);
  if (!safeUrl) {
    return null;
  }

  const rawContent = raw.content ?? "";
  const contentHtml = sanitizeMastodonHtml(rawContent);
  const summary = extractMastodonSummary(rawContent);
  const media = normalizeMedia(raw.media_attachments);
  const card = normalizeCard(raw.card);

  if (!summary && media.length === 0 && !card) {
    return null;
  }

  const tags = Array.isArray(raw.tags)
    ? raw.tags
        .map(tag => (typeof tag?.name === "string" ? tag.name.trim() : ""))
        .filter(Boolean)
    : [];

  return {
    id: raw.id,
    createdAt: raw.created_at,
    url: safeUrl,
    contentHtml,
    summary,
    sensitive: Boolean(raw.sensitive),
    spoilerText: (raw.spoiler_text ?? "").trim(),
    repliesCount: Number(raw.replies_count ?? 0) || 0,
    reblogsCount: Number(raw.reblogs_count ?? 0) || 0,
    favouritesCount: Number(raw.favourites_count ?? 0) || 0,
    media,
    tags,
    card,
  };
}

export function formatMomentDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatMomentShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
