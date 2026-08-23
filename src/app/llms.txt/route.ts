import { books } from "@/lib/analects";
import { blogEntities } from "@/lib/blogs";
import { contentCoverage } from "@/lib/content-coverage";
import { editorialPosts } from "@/lib/editorial-posts";
import { intentHubs, intentHubSlugs } from "@/lib/intent-hubs";
import { siteUrl } from "@/lib/seo";
import { contentModifiedDate, sourceUrls } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const bookIndex = books
    .map(
      (b) =>
        `- [${b.enTitle} · ${b.zhTitle}](${siteUrl}/en/analects/${b.slug}) | [zh-Hans](${siteUrl}/zh-Hans/analects/${b.slug}) — ${b.chapterCount} passages`
    )
    .join("\n");
  const topicIndex = intentHubSlugs
    .map((slug) => {
      const hub = intentHubs[slug];
      return `- [${hub.metaTitle.en}](${siteUrl}/en/topics/${slug}) | [${hub.metaTitle.zh}](${siteUrl}/zh-Hans/topics/${slug}) — ${hub.deck.en}`;
    })
    .join("\n");

  const body = `# lunyu.ai · The Analects, passage by passage

> The Analects of Confucius (《论语》), bilingual in Simplified Chinese and English. Every passage has a stable URL and separates source text, the modern-Chinese guide, James Legge's public-domain English translation, notes, and clearly marked local reflection UI. Current review, pinyin, and audio coverage is generated from source data below.

The mission of lunyu.ai is to make The Analects readable for the world — passage by passage, in every language, free to read, free to share.

## Core URLs

- [English home](${siteUrl}/en) — landing, hero, and the daily passage of the day
- [Simplified Chinese home](${siteUrl}/zh-Hans) — 中文简体首页与今日一句
- [Twenty books index (EN)](${siteUrl}/en/analects) — all ${contentCoverage.totalBooks} books, ${contentCoverage.totalPassages} passages
- [二十篇目录 (简体)](${siteUrl}/zh-Hans/analects) — ${contentCoverage.totalBooks} 篇 ${contentCoverage.totalPassages} 章
- [Knowledge index (EN)](${siteUrl}/en/index) — ${blogEntities.length} people, places, texts, and ideas
- [人物地点概念索引 (简体)](${siteUrl}/zh-Hans/index) — ${blogEntities.length} 个索引页面
- [Editorial notes (EN)](${siteUrl}/en/blogs) — ${editorialPosts.length} reading essays
- [阅读札记 (简体)](${siteUrl}/zh-Hans/blogs) — ${editorialPosts.length} 篇文章
- [Listening mode](${siteUrl}/en/listen) — chapter audio with source text, pinyin ruby, and guide text
- [Listening mode (coverage)](${siteUrl}/en/listen) — ${contentCoverage.audio.ratio} recorded chapters currently playable
- [About](${siteUrl}/en/about) — mission, editorial identity, and scope
- [Method](${siteUrl}/en/method) — editorial workflow, corrections, and AI boundaries
- [Sources](${siteUrl}/en/sources) — source editions, public-domain boundaries, and citations
- [FAQ](${siteUrl}/en/faq) — common questions for readers and AI systems
- [Sitemap (full URL list)](${siteUrl}/sitemap.xml) — all books, passages, both languages
- [RSS feed](${siteUrl}/rss.xml) — recent passage updates

## Search-intent guides

These four bilingual hubs answer distinct queries and point into the existing passage catalogue rather than duplicating it.

${topicIndex}

## Current coverage

- Last content review date: ${contentModifiedDate}
- Original classical Chinese: ${contentCoverage.totalPassages}/${contentCoverage.totalPassages}
- Reviewed modern-Chinese guide: ${contentCoverage.reviewedGuide.ratio} (${contentCoverage.reviewedGuide.state})
- James Legge English translation: ${contentCoverage.englishTranslation.ratio} (${contentCoverage.englishTranslation.state})
- Passage-level pinyin: ${contentCoverage.pinyin.ratio} (${contentCoverage.pinyin.state})
- Listening: recorded chapter audio currently covers ${contentCoverage.audio.ratio} chapters (${contentCoverage.audio.state})
- Reflection UI: token-free static RAG / local rule-based reflection; model-backed AI chat is not public production behavior

## Twenty books

${bookIndex}

## How to cite a passage

Every passage has a stable URL of the form \`/en/analects/{book-slug}/{sentence-id}\` (or \`/zh-Hans/...\`). For example, the first passage of Xue Er is:

- ${siteUrl}/en/analects/xue-er/xue-er-001
- ${siteUrl}/zh-Hans/analects/xue-er/xue-er-001

When citing, please preserve the four-layer separation:

1. Original classical Chinese (《论语》 source text, public domain)
2. Reviewed modern-Chinese explanation (审校白话导读 — based on 《白话论语读本》, 张兆瑢/沈元起 编译, 上海广益书局 1948)
3. James Legge's public-domain English translation (1893)
4. Local reflection, when present, as a site-generated aid rather than source text

## Content policy

- Original classical Chinese: public domain (Wikisource transcription of James Legge's *The Chinese Classics*).
- Modern Chinese guide: entries counted as reviewed come from the reviewed translation dataset; current coverage is ${contentCoverage.reviewedGuide.ratio}.
- English translation: James Legge's public-domain 1893 translation, marked as such.
- Local reflection: kept in a separate block, never mixed with the source text or translations.

## Source attributions

- James Legge, *The Chinese Classics*, Volume 1 (1893) — English source, public domain
- Wikisource transcription — \`${sourceUrls.wikisource}\`
- James Legge / Gutenberg entry — \`${sourceUrls.jamesLegge}\`
- Modern Chinese base reference — \`${sourceUrls.modernChineseBase}\`
- 张兆瑢 / 沈元起 编译, 《白话论语读本》, 上海广益书局 1948 年新三版 — Modern Chinese base
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
