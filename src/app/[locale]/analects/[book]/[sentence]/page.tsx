import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PinyinRuby } from "@/components/PinyinRuby";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MarkOpened } from "@/components/ReadingCircle";
import { LocalConfuciusChat } from "@/components/LocalConfuciusChat";
import { blogTitle, blogUrl, categoryLabel, getBlogsForSentence } from "@/lib/blogs";
import { getPassageContentCoverage } from "@/lib/content-coverage";
import { listenUrl } from "@/lib/listen";
import {
  getAllSentences,
  getBook,
  getNeighbourSentences,
  getSentence,
  Locale,
  locales,
  sentenceUrl,
  Sentence,
  t,
} from "@/lib/analects";
import { alternates, localizedUrl, openGraph, twitterCard } from "@/lib/seo";
import {
  contentModifiedDate,
  contentPublishedDate,
  correctionUrl,
  jsonLd,
  licenseText,
  organizationId,
  siteName,
  sourceUrls,
} from "@/lib/site";

const PLACEHOLDER_PREFIX = "白话导读正在";

/** A meaningful meta description that never falls back to the review placeholder. */
function sentenceDescription(locale: Locale, sentence: Sentence, bookZhTitle: string, bookEnTitle: string) {
  const chapterLabel =
    locale === "zh-Hans"
      ? `《${bookZhTitle}》${String(sentence.sentenceNumber).padStart(3, "0")}`
      : `${bookEnTitle} ${String(sentence.sentenceNumber).padStart(3, "0")}`;
  const gloss =
    locale === "zh-Hans"
      ? sentence.modernChinese.startsWith(PLACEHOLDER_PREFIX)
        ? sentence.classicalChinese
        : sentence.modernChinese
      : sentence.english;
  return `${chapterLabel}｜${sentence.classicalChinese} — ${gloss}`.slice(0, 300);
}

export function generateStaticParams() {
  return (Object.keys(locales) as Locale[]).flatMap((locale) =>
    getAllSentences().map((s) => ({ locale, book: s.bookSlug, sentence: s.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; book: string; sentence: string }>;
}): Promise<Metadata> {
  const { locale, book: bookSlug, sentence: sentenceId } = await params;
  const sentence = getSentence(sentenceId);
  const book = getBook(bookSlug);
  if (!sentence || !book || sentence.bookSlug !== bookSlug) return {};
  const title = `${t(locale, "论语", "The Analects")} · ${t(locale, book.zhTitle, book.enTitle)} ${sentence.bookNumber}.${sentence.sentenceNumber}`;
  const description = sentenceDescription(locale, sentence, book.zhTitle, book.enTitle);
  const path = `/analects/${bookSlug}/${sentenceId}`;
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: openGraph(locale, path, `${title} · lunyu.ai`, description),
      twitter: twitterCard(locale, path, `${title} · lunyu.ai`, description),
  };
}

export default async function SentencePage({
  params,
}: {
  params: Promise<{ locale: Locale; book: string; sentence: string }>;
}) {
  const { locale, book: bookSlug, sentence: sentenceId } = await params;
  const sentence = getSentence(sentenceId);
  const book = getBook(bookSlug);
  if (!sentence || !book || sentence.bookSlug !== bookSlug) notFound();

  const url = localizedUrl(locale, `/analects/${bookSlug}/${sentence.id}`);
  const passageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: `${t(locale, "论语", "The Analects")} ${sentence.bookNumber}.${sentence.sentenceNumber}`,
    inLanguage: locale,
    mainEntityOfPage: url,
    url,
    datePublished: contentPublishedDate,
    dateModified: contentModifiedDate,
    isAccessibleForFree: true,
    license: licenseText,
    author: { "@type": "Organization", "@id": organizationId, name: siteName },
    publisher: { "@type": "Organization", "@id": organizationId, name: siteName },
    isBasedOn: [
      {
        "@type": "CreativeWork",
        name: "The Chinese Classics, Volume 1: Confucian Analects",
        author: { "@type": "Person", name: "James Legge" },
        url: sourceUrls.wikisource,
        isAccessibleForFree: true,
      },
      {
        "@type": "CreativeWork",
        name: "James Legge public-domain English translation of The Analects",
        author: { "@type": "Person", name: "James Legge" },
        url: sourceUrls.jamesLegge,
        isAccessibleForFree: true,
      },
      {
        "@type": "CreativeWork",
        name: "白话论语读本",
        url: sourceUrls.modernChineseBase,
        isAccessibleForFree: true,
      },
    ],
    isPartOf: {
      "@type": "Book",
      name: "The Analects",
      alternateName: "论语",
      bookEdition: t(locale, book.zhTitle, book.enTitle),
    },
    keywords: sentence.themes.join(", "),
    text: `${sentence.classicalChinese}\n${locale === "zh-Hans" ? sentence.modernChinese : sentence.english}`,
    hasPart: [
      {
        "@type": "CreativeWork",
        name: t(locale, "原文", "Source text"),
        text: sentence.classicalChinese,
      },
      {
        "@type": "CreativeWork",
        name: t(locale, "审校白话导读", "Reviewed modern Chinese guide"),
        text: sentence.modernChinese,
      },
      {
        "@type": "CreativeWork",
        name: "James Legge translation",
        text: sentence.english,
      },
    ],
    correction: correctionUrl(locale),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "lunyu.ai", item: localizedUrl(locale, "") },
        { "@type": "ListItem", position: 2, name: t(locale, "论语", "The Analects"), item: localizedUrl(locale, "/analects") },
        { "@type": "ListItem", position: 3, name: t(locale, book.zhTitle, book.enTitle), item: localizedUrl(locale, `/analects/${bookSlug}`) },
        { "@type": "ListItem", position: 4, name: `${sentence.bookNumber}.${sentence.sentenceNumber}`, item: url },
      ],
    },
  };

  const { prev, next } = getNeighbourSentences(sentence.id);
  const relatedBlogs = getBlogsForSentence(sentence).slice(0, 16);
  const coverage = getPassageContentCoverage(sentence.id);
  const listenHref =
    coverage?.audio ? listenUrl(locale, sentence.bookSlug, sentence.id) : undefined;

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path={`/analects/${bookSlug}/${sentenceId}`} />
      <MarkOpened id={sentence.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(passageJsonLd) }} />
      <article className="reading-shell py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-5 font-ui text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href={`/${locale}`} className="hover:text-ink">lunyu.ai</Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href={`/${locale}/analects`} className="hover:text-ink">
                {t(locale, "论语", "The Analects")}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link
                href={`/${locale}/analects/${bookSlug}`}
                className="hover:text-ink"
              >
                {t(locale, book.zhTitle, book.enTitle)}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-ink">
              {sentence.bookNumber}.{String(sentence.sentenceNumber).padStart(2, "0")}
            </li>
          </ol>
        </nav>
        <p className="label mb-4 text-cinnabar">
          {t(locale, book.zhTitle, book.enTitle)} · {String(sentence.sentenceNumber).padStart(2, "0")}
        </p>
        <div className="sentence-ruby-control">
          <div className="mb-4 flex items-center gap-3 border-y border-rule bg-surface px-4 py-3">
            <input
              id={`pinyin-toggle-${sentence.id}`}
              type="checkbox"
              defaultChecked
              className="pinyin-toggle h-5 w-5 shrink-0 accent-cinnabar"
            />
            <label
              htmlFor={`pinyin-toggle-${sentence.id}`}
              className="cursor-pointer font-ui text-sm text-ink"
            >
              {t(locale, "显示拼音", "Show pinyin")}
            </label>
          </div>
          <h1 className="ruby-heading font-serif text-[2.25rem] leading-[var(--lh-cjk)] sm:text-5xl">
            {sentence.pinyin ? (
              <PinyinRuby text={sentence.classicalChinese} pinyin={sentence.pinyin} />
            ) : (
              sentence.classicalChinese
            )}
          </h1>
        </div>
        <div className="mt-8 border-y border-rule bg-surface px-4 py-2 sm:px-6">
        <section className="reading-panel reading-panel-accent" aria-labelledby="h-modern">
          <h2 id="h-modern" className="label">
            {t(locale, "白话导读", "Modern Chinese Guide")}
          </h2>
          <p className="mt-4 text-base leading-[1.85] text-ink sm:text-lg">
            {sentence.modernChinese}
          </p>
        </section>
        <section className="reading-panel" aria-labelledby="h-legge">
          <h2 id="h-legge" className="label">
            {t(locale, "James Legge 英译", "James Legge Translation")}
          </h2>
          <p className="mt-4 font-en text-base leading-[var(--lh-en)] text-ink sm:text-lg">{sentence.english}</p>
          <p className="mt-3 font-ui text-xs text-ink-soft">
            {t(
              locale,
              "译注：James Legge 公版英译，1893 年原版。",
              "Source: James Legge, public domain, 1893."
            )}
          </p>
        </section>
        <section className="reading-panel" aria-labelledby="h-notes">
          <h2 id="h-notes" className="label">
            {t(locale, "注释", "Notes")}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-soft">
            {sentence.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
        </div>
        {(relatedBlogs.length > 0 || listenHref) && (
          <section className="mt-6 border-y border-rule bg-surface px-4 py-5 sm:px-6" aria-labelledby="h-related-blogs">
            <h2 id="h-related-blogs" className="label">
              {relatedBlogs.length > 0
                ? t(locale, "相关人物、地点与概念", "Related people, places, and ideas")
                : t(locale, "听读", "Listen")}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {relatedBlogs.map((entity) => (
                <Link
                  key={entity.slug}
                  href={blogUrl(locale, entity)}
                  className="chip"
                >
                  {blogTitle(locale, entity)}
                  <span className="ml-2 text-xs text-ink-soft">
                    {categoryLabel(locale, entity.category)}
                  </span>
                </Link>
              ))}
              {listenHref ? (
                <Link href={listenHref} className="chip">
                  {t(locale, "听读此章", "Listen to this passage")}
                </Link>
              ) : null}
            </div>
          </section>
        )}
        <LocalConfuciusChat locale={locale} sentence={sentence} />
        <section className="mt-6 border-y border-rule bg-surface px-4 py-5 sm:px-6" aria-labelledby="h-trust-links">
          <h2 id="h-trust-links" className="label">
            {t(locale, "来源、方法与更正", "Sources, method, and corrections")}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/${locale}/sources`} className="chip">
              {t(locale, "底本与许可", "Sources")}
            </Link>
            <Link href={`/${locale}/method`} className="chip">
              {t(locale, "编辑方法", "Method")}
            </Link>
            <Link href={`/${locale}/faq`} className="chip">
              FAQ
            </Link>
            <Link href={`/${locale}/method#corrections`} className="chip">
              {t(locale, "更正机制", "Corrections")}
            </Link>
          </div>
        </section>
        <nav
          aria-label="Passage navigation"
          className="mt-8 grid grid-cols-1 gap-3 border-t border-rule pt-6 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              href={sentenceUrl(locale, prev)}
              className="group border border-rule bg-surface p-4 transition-colors duration-300 hover:border-ink"
            >
              <div className="label">← {t(locale, "上一章", "Previous passage")}</div>
              <div className="mt-1 font-serif text-lg leading-snug text-ink group-hover:text-cinnabar">
                {prev.classicalChinese.slice(0, 28)}
                {prev.classicalChinese.length > 28 ? "…" : ""}
              </div>
              <div className="font-ui text-xs text-ink-soft">
                {getBook(prev.bookSlug)
                  ? t(
                      locale,
                      getBook(prev.bookSlug)!.zhTitle,
                      getBook(prev.bookSlug)!.enTitle
                    )
                  : prev.bookSlug}{" "}
                · {prev.bookNumber}.{String(prev.sentenceNumber).padStart(2, "0")}
              </div>
            </Link>
          ) : (
            <div className="border border-rule bg-surface-sunken p-4 text-ink-soft">
              <div className="label">← {t(locale, "上一章", "Previous passage")}</div>
              <div className="mt-1 font-ui text-sm">{t(locale, "已是第一句", "This is the first passage")}</div>
            </div>
          )}
          {next ? (
            <Link
              href={sentenceUrl(locale, next)}
              className="group border border-rule bg-surface p-4 text-right transition-colors duration-300 hover:border-ink"
            >
              <div className="label">{t(locale, "下一章", "Next passage")} →</div>
              <div className="mt-1 font-serif text-lg leading-snug text-ink group-hover:text-cinnabar">
                {next.classicalChinese.slice(0, 28)}
                {next.classicalChinese.length > 28 ? "…" : ""}
              </div>
              <div className="font-ui text-xs text-ink-soft">
                {getBook(next.bookSlug)
                  ? t(
                      locale,
                      getBook(next.bookSlug)!.zhTitle,
                      getBook(next.bookSlug)!.enTitle
                    )
                  : next.bookSlug}{" "}
                · {next.bookNumber}.{String(next.sentenceNumber).padStart(2, "0")}
              </div>
            </Link>
          ) : (
            <div className="border border-rule bg-surface-sunken p-4 text-right text-ink-soft">
              <div className="label">{t(locale, "下一章", "Next passage")} →</div>
              <div className="mt-1 font-ui text-sm">{t(locale, "已是最后一句", "This is the last passage")}</div>
            </div>
          )}
        </nav>
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
