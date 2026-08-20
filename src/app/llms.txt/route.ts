import { books, contentCoverage } from "@/lib/analects";
import { blogEntities } from "@/lib/blogs";
import { editorialPosts } from "@/lib/editorial-posts";
import { getListenCoverage } from "@/lib/listen";
import { siteUrl } from "@/lib/seo";
import { contentModifiedDate, sourceUrls } from "@/lib/site";

export function GET() {
  const listenCoverage = getListenCoverage();
  const bookIndex = books
    .map(
      (b) =>
        `- [${b.enTitle} · ${b.zhTitle}](${siteUrl}/en/analects/${b.slug}) | [zh-Hans](${siteUrl}/zh-Hans/analects/${b.slug}) — ${b.chapterCount} passages`
    )
    .join("\n");

  const body = `# lunyu.ai · The Analects, passage by passage

> The Analects of Confucius (《论语》), bilingual in Simplified Chinese and English. Every passage has a stable URL and separates the source text, reviewed modern-Chinese guide, James Legge's public-domain English translation, notes, and clearly marked local reflection UI.

The mission of lunyu.ai is to make The Analects readable for the world — passage by passage, in every language, free to read, free to share.

## Core URLs

- [English home](${siteUrl}/en) — landing, hero, and the daily passage of the day
- [Simplified Chinese home](${siteUrl}/zh-Hans) — 中文简体首页与今日一句
- [Twenty books index (EN)](${siteUrl}/en/analects) — all 20 books, 499 passages
- [二十篇目录 (简体)](${siteUrl}/zh-Hans/analects) — 二十篇 499 章
- [Knowledge index (EN)](${siteUrl}/en/index) — ${blogEntities.length} people, places, texts, and ideas
- [人物地点概念索引 (简体)](${siteUrl}/zh-Hans/index) — ${blogEntities.length} 个索引页面
- [Editorial notes (EN)](${siteUrl}/en/blogs) — ${editorialPosts.length} reading essays
- [阅读札记 (简体)](${siteUrl}/zh-Hans/blogs) — ${editorialPosts.length} 篇文章
- [Listening mode](${siteUrl}/en/listen) — chapter audio with source text, pinyin ruby, and guide text
- [Listening mode (coverage)](${siteUrl}/en/listen) — ${listenCoverage.availableChapters}/${listenCoverage.totalChapters} recorded chapters currently playable
- [About](${siteUrl}/en/about) — mission, editorial identity, and scope
- [Method](${siteUrl}/en/method) — editorial workflow, corrections, and AI boundaries
- [Sources](${siteUrl}/en/sources) — source editions, public-domain boundaries, and citations
- [FAQ](${siteUrl}/en/faq) — common questions for readers and AI systems
- [Sitemap (full URL list)](${siteUrl}/sitemap.xml) — all books, passages, both languages
- [RSS feed](${siteUrl}/rss.xml) — recent passage updates

## Current coverage

- Last content review date: ${contentModifiedDate}
- Original classical Chinese: ${contentCoverage.totalPassages}/${contentCoverage.totalPassages}
- Reviewed modern-Chinese guide: ${contentCoverage.modernChinesePassages}/${contentCoverage.totalPassages}
- James Legge English translation: ${contentCoverage.englishPassages}/${contentCoverage.totalPassages}
- Passage-level pinyin: ${contentCoverage.pinyinPassages}/${contentCoverage.totalPassages}; rendered sitewide
- Listening: recorded chapter audio currently covers ${listenCoverage.availableChapters}/${listenCoverage.totalChapters} chapters
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
- Modern Chinese guide: reviewed by humans; reviewed edition cited in each passage's notes block.
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
