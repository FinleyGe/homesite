import { describe, expect, it } from "vitest";
import {
  extractMastodonSummary,
  formatMomentDate,
  formatMomentShortDate,
  normalizeMastodonStatus,
  sanitizeMastodonHtml,
} from "../app/utils/mastodon";

describe("sanitizeMastodonHtml", () => {
  it("strips dangerous tags, event handlers, and javascript URLs", () => {
    const dirty = `<p onclick="alert(1)">Hello<script>alert("xss")</script><iframe src="https://evil.test"></iframe><a href="javascript:alert(1)">bad</a></p>`;
    const clean = sanitizeMastodonHtml(dirty);

    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("<iframe");
    expect(clean).not.toContain("onclick");
    expect(clean).not.toContain("javascript:");
    expect(clean).toContain("<p>Hello");
  });

  it("preserves safe links with target and rel attributes and Mastodon span classes", () => {
    const input = `<p>Check <a href="https://github.com/antfu/ghfs" class="evil"><span class="invisible">https://</span><span class="ellipsis">github.com/antfu/ghfs</span></a><br /></p>`;
    const clean = sanitizeMastodonHtml(input);

    expect(clean).toContain(
      `<a href="https://github.com/antfu/ghfs" target="_blank" rel="noopener noreferrer">`,
    );
    expect(clean).toContain(`<span class="invisible">https://</span>`);
    expect(clean).toContain(`<span class="ellipsis">github.com/antfu/ghfs</span>`);
    expect(clean).toContain("<br>");
  });
});

describe("extractMastodonSummary", () => {
  it("removes invisible protocol spans, appends ellipsis, decodes entities, and truncates long text", () => {
    const input = `<p>Hello &amp; world <a href="https://example.com/long-path"><span class="invisible">https://</span><span class="ellipsis">example.com/long</span><span class="invisible">-path</span></a></p><p>Second line</p>`;
    expect(extractMastodonSummary(input, 100)).toBe("Hello & world example.com/long… Second line");
    expect(extractMastodonSummary(input, 15)).toBe("Hello & world…");
  });
});

describe("normalizeMastodonStatus", () => {
  it("normalizes a public status with media and link card", () => {
    const normalized = normalizeMastodonStatus({
      id: "12345",
      created_at: "2026-08-02T23:33:55.931Z",
      url: "https://g0v.social/@FinleyGe/12345",
      visibility: "public",
      content: "<p>Testing Mastodon sync</p>",
      replies_count: 1,
      reblogs_count: 2,
      favourites_count: 3,
      media_attachments: [
        {
          id: "m1",
          type: "image",
          url: "https://objects.g0v.social/image.png",
          preview_url: "https://objects.g0v.social/preview.png",
          description: "Sample image",
        },
      ],
      tags: [{ name: "dev", url: "https://g0v.social/tags/dev" }],
      card: {
        url: "https://github.com/antfu/ghfs",
        title: "ghfs",
        description: "GitHub issues as filesystem",
        provider_name: "GitHub",
        image: null,
      },
    });

    expect(normalized).not.toBeNull();
    expect(normalized?.id).toBe("12345");
    expect(normalized?.summary).toBe("Testing Mastodon sync");
    expect(normalized?.media).toHaveLength(1);
    expect(normalized?.media[0]?.previewUrl).toBe("https://objects.g0v.social/preview.png");
    expect(normalized?.tags).toEqual(["dev"]);
    expect(normalized?.card?.title).toBe("ghfs");
  });

  it("ignores non-public or malformed statuses", () => {
    expect(
      normalizeMastodonStatus({
        id: "1",
        created_at: "2026-08-02T00:00:00Z",
        url: "https://g0v.social/@FinleyGe/1",
        visibility: "private",
        content: "<p>Secret</p>",
      }),
    ).toBeNull();

    expect(
      normalizeMastodonStatus({
        id: "2",
        created_at: "2026-08-02T00:00:00Z",
        url: "javascript:alert(1)",
        visibility: "public",
        content: "<p>Bad URL</p>",
      }),
    ).toBeNull();
  });
});

describe("formatMomentDate and formatMomentShortDate", () => {
  it("formats ISO dates as YYYY-MM-DD and YYYY-MM-DD HH:mm", () => {
    expect(formatMomentShortDate("2026-08-02T12:00:00.000Z")).toMatch(/^2026-08-0[23]$/);
    expect(formatMomentDate("2026-08-02T12:00:00.000Z")).toMatch(/^2026-08-0[23] \d{2}:\d{2}$/);
  });
});
