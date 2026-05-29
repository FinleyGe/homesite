---
name: article-proofreader
description: Use when proofreading Chinese or mixed Chinese-English article content, especially when the user asks to 校对, 修正错别字, 修改标点, 检查病句, 统一用语, or polish only obvious language issues while preserving the author's original meaning, facts, structure, tone, and style.
---

# Article Proofreader

## Scope

Proofread article content conservatively. Preserve the author's original meaning, factual claims, structure, narrative voice, and stylistic choices.

Only change issues that are reasonably identifiable as language errors or editorial inconsistencies:

- Typos, wrong characters, missing or repeated words.
- Incorrect, awkward, or inconsistent punctuation.
- Obvious grammar problems, malformed sentences, and improper collocations.
- Inappropriate wording that causes ambiguity, offense, or register mismatch.
- Inconsistent terms, numbers, dates, names, spacing, and Chinese-English formatting.
- Markdown formatting errors that affect readability.

Avoid rewriting for taste, strengthening arguments, adding facts, changing examples, changing paragraph order, or making broad style upgrades unless the user explicitly asks.

## Workflow

1. Identify the article's language, audience, tone, and formatting conventions.
2. Make the smallest edits needed to correct clear issues.
3. Keep technical terms, names, quoted text, code, URLs, and citations unchanged unless they contain an obvious typo.
4. When a change could alter meaning, flag it as a suggestion instead of applying it directly.
5. Preserve Markdown structure, headings, lists, tables, blockquotes, and frontmatter.
6. If the source is in a file, edit the file directly when the user requests changes; otherwise return corrected text.

## Output

For short pasted text, return:

- `校对后`: the corrected text.
- `修改说明`: concise bullets for non-trivial changes.

For long articles or file edits, return:

- Files changed with line references when available.
- A compact list of notable corrections.
- Any uncertain suggestions that were left unapplied.

When the article is already clean, say no material corrections were needed and mention any minor formatting normalization if performed.

## Decision Rules

- Prefer conservative correction over stylistic rewrite.
- Preserve original paragraph boundaries unless punctuation or sentence breaks are clearly wrong.
- Preserve specialized vocabulary and brand wording unless the article itself uses a clear inconsistent form.
- Use Chinese full-width punctuation in Chinese prose; keep English punctuation inside English phrases, code, URLs, and filenames.
- Normalize spaces between Chinese and English only when the article already follows that convention or readability clearly benefits.
- Do not invent source material, references, claims, examples, or transitions.

## Ambiguity Handling

If a sentence is hard to understand but the intended meaning is recoverable, correct it minimally.

If multiple meanings are plausible, do not silently rewrite it. Keep the original wording and provide a suggested revision with a note explaining the ambiguity.
