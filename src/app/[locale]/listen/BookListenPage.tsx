import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Book, books, Locale, t } from "@/lib/analects";
import { alternates, openGraph, twitterCard } from "@/lib/seo";
import { buildListenChapters, getListenCoverage } from "@/lib/listen";
import { buildListenStructuredData } from "@/lib/listen-structured-data";
import { jsonLd } from "@/lib/site";
import { ListenControls } from "./ListenControls";

const zhNumerals = [
  "",
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
];

/** 学而 + 1 → 学而第一 */
export function zhOrdinalTitle(book: Book) {
  return `${book.zhTitle}第${zhNumerals[book.number] ?? book.number}`;
}

/** Book 1 stays on /listen; the other books live at /listen/<slug>. */
export function listenPath(slug: string) {
  return slug === books[0].slug ? "/listen" : `/listen/${slug}`;
}

export function listenMetadata(locale: Locale, book: Book): Metadata {
  const coverage = getListenCoverage(book.slug);
  const title = t(locale, `听读《论语·${book.zhTitle}》`, `Hear The Analects: ${book.pinyin}`);
  const description = t(
    locale,
    `播放《论语·${zhOrdinalTitle(book)}》真人女声音频，共 ${coverage.availableChapters}/${book.chapterCount} 章可播放，并同步查看原文、拼音与白话导读。`,
    `Play recorded female-voice audio for The Analects, Book ${book.number} ${book.pinyin}; ${coverage.availableChapters}/${book.chapterCount} chapters are playable, with source text, pinyin, and guide text alongside.`
  );
  const path = listenPath(book.slug);
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: openGraph(locale, path, `${title} · lunyu.ai`, description),
    twitter: twitterCard(locale, path, `${title} · lunyu.ai`, description),
  };
}

export function BookListenPage({ locale, book }: { locale: Locale; book: Book }) {
  const coverage = getListenCoverage(book.slug);
  const path = listenPath(book.slug);
  const chapters = buildListenChapters(locale, book);
  const structuredDataName = t(
    locale,
    `听读《论语·${book.zhTitle}》`,
    `Hear The Analects: ${book.pinyin}`
  );
  const structuredDataDescription = t(
    locale,
    `当前可播放 ${coverage.availableChapters}/${coverage.totalChapters} 章真人女声音频，未录章节会在列表中明确标注。`,
    `Recorded audio currently covers ${coverage.availableChapters}/${coverage.totalChapters} chapters, and unavailable chapters are clearly labeled in the list.`
  );
  const listenJsonLd = buildListenStructuredData({
    locale,
    path,
    name: structuredDataName,
    description: structuredDataDescription,
    chapters,
  });

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path={path} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(listenJsonLd) }} />
      <section className="page-shell py-10 sm:py-12">
        <p className="label mb-4">
          {t(locale, "听读模式 · 真人女声 · 注音版", "Listening mode · recorded female voice · pinyin edition")}
        </p>
        <h1 className="max-w-3xl font-serif text-[2.5rem] leading-tight sm:text-5xl">
          {t(locale, `按章节听《${zhOrdinalTitle(book)}》`, `Listen to ${book.pinyin} by chapter`)}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
          {t(
            locale,
            `当前已上线 ${coverage.availableChapters}/${coverage.totalChapters} 章真人女声音频；未录章节会在列表中标明并禁用，避免误点到 404。`,
            `Recorded audio is currently live for ${coverage.availableChapters}/${coverage.totalChapters} chapters. Unrecorded chapters are labeled and disabled to avoid dead links.`
          )}
        </p>
        <p className="mt-3 max-w-3xl font-ui text-sm text-ink-soft">
          {t(
            locale,
            `这一篇当前可播放 ${coverage.availableChapters}/${book.chapterCount} 章。`,
            `This book currently has ${coverage.availableChapters}/${book.chapterCount} playable chapters.`
          )}
        </p>
        <nav aria-label={t(locale, "选择篇章", "Choose a book")} className="mt-6 flex flex-wrap gap-2">
          {books.map((item) => {
            const selected = item.slug === book.slug;
            return (
              <Link
                key={item.slug}
                href={`/${locale}${listenPath(item.slug)}`}
                aria-current={selected ? "page" : undefined}
                className={`inline-flex min-h-9 items-center border px-3 font-ui text-sm transition-colors ${
                  selected
                    ? "border-ink bg-surface-sunken text-ink"
                    : "border-rule bg-surface text-ink-soft hover:bg-surface-sunken hover:text-ink"
                }`}
              >
                <span className="mr-1.5 tabular-nums">{String(item.number).padStart(2, "0")}</span>
                {t(locale, item.zhTitle, item.pinyin)}
              </Link>
            );
          })}
        </nav>
        <ListenControls
          locale={locale}
          bookTitle={t(locale, `论语 · ${zhOrdinalTitle(book)}`, `The Analects · ${book.pinyin}`)}
          chapters={chapters}
        />
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
