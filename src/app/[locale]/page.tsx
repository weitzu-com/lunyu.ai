import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SentenceCard } from "@/components/SentenceCard";
import { passageOfTheDayId } from "@/lib/reading-circle";
import { ReadingHint } from "@/components/ReadingCircle";
import { books, getAllSentences, getSentences, Locale, locales, t } from "@/lib/analects";
import { contentCoverage, contentCoverageSummary } from "@/lib/content-coverage";
import { alternates, openGraph, twitterCard } from "@/lib/seo";
import { contentModifiedDate, jsonLd, organizationId, sameAs, siteName, siteUrl, websiteId } from "@/lib/site";

export function generateStaticParams() {
  return Object.keys(locales).map((locale) => ({ locale }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  return params.then(({ locale }) => {
    const title = t(
      locale,
      `《论语》二十篇 · ${contentCoverage.totalPassages} 章逐句可读`,
      `The Analects — ${contentCoverage.totalPassages} passages, book by book`
    );
    const description = t(
      locale,
      `《论语》二十篇 ${contentCoverage.totalPassages} 章已按简体原文、${contentCoverage.reviewedGuide.complete ? "审校白话导读" : `白话导读（已审校 ${contentCoverage.reviewedGuide.ratio}）`}、James Legge 公版英译、注释逐句发布。`,
      `All ${contentCoverage.totalPassages} passages of The Analects, passage by passage: simplified Chinese, ${contentCoverage.reviewedGuide.complete ? "a reviewed modern Chinese guide" : `a modern Chinese guide reviewed for ${contentCoverage.reviewedGuide.ratio} passages`}, James Legge's public-domain English translation, and notes.`
    );
    return {
      title,
      description,
      alternates: alternates(locale, ""),
      openGraph: openGraph(locale, "", `${title} · lunyu.ai`, description),
      twitter: twitterCard(locale, "", `${title} · lunyu.ai`, description),
    };
  });
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const allIds = getAllSentences().map((s) => s.id);
  const todaysId = passageOfTheDayId(allIds);
  const featured =
    getAllSentences().find((s) => s.id === todaysId) ?? getSentences()[0];

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteName,
        inLanguage: locale,
        dateModified: contentModifiedDate,
        description: contentCoverageSummary(locale),
        publisher: { "@id": organizationId },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: siteUrl,
        sameAs,
      },
    ],
  };

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeJsonLd) }} />
      <SiteHeader locale={locale} />
      <section className="page-shell grid gap-9 py-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="label mb-5">
            {t(
              locale,
              `二十篇 · ${contentCoverage.totalPassages} 章 · 中英双语`,
              `Twenty books · ${contentCoverage.totalPassages} passages · Bilingual`
            )}
          </p>
          <h1 className="max-w-3xl font-cjk text-[2.75rem] font-medium leading-[1.16] text-ink sm:text-6xl">
            {t(locale, "让世界读懂《论语》。", "Make The Analects readable for the world.")}
          </h1>
          <p className="mt-6 max-w-2xl font-cjk text-base leading-[1.8] text-ink-soft sm:text-lg">
            {t(
              locale,
              `二十篇 ${contentCoverage.totalPassages} 章已按简体原文、${contentCoverage.reviewedGuide.complete ? "审校白话导读" : `白话导读（已审校 ${contentCoverage.reviewedGuide.ratio}）`}、James Legge 公版英译、注释逐句发布。`,
              `All twenty books — ${contentCoverage.totalPassages} passages — are published with simplified Chinese, ${contentCoverage.reviewedGuide.complete ? "a reviewed modern Chinese guide" : `a modern Chinese guide reviewed for ${contentCoverage.reviewedGuide.ratio} passages`}, James Legge's public-domain English translation, and notes.`
            )}
          </p>
          <p className="mt-3 max-w-2xl font-ui text-sm leading-[1.7] text-ink-soft">
            {t(
              locale,
              `可读 · 可索引 · 可分享。逐句拼音${contentCoverage.pinyin.complete ? "已全量展示" : `当前覆盖 ${contentCoverage.pinyin.ratio}`}；章节录音当前覆盖 ${contentCoverage.audio.ratio} 章。`,
              `Readable · indexable · shareable. Passage-level pinyin ${contentCoverage.pinyin.complete ? "is fully rendered" : `currently covers ${contentCoverage.pinyin.ratio} passages`}; chapter audio currently covers ${contentCoverage.audio.ratio} chapters.`
            )}
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <Link href={`/${locale}/analects`} className="ui-button ui-button-primary font-medium">
              {t(locale, "进入二十篇", "Open the twenty books")}
            </Link>
            <Link href={`/${locale}/analects/xue-er`} className="ui-button font-medium">
              {t(locale, "从学而第一篇开始", "Start with Xue Er")}
            </Link>
          </div>
        </div>
        <div className="relative border-y border-rule bg-surface px-4 py-5 shadow-sm sm:border sm:p-6">
          <div className="absolute right-4 top-4">
            <span className="reading-dot" aria-hidden />
          </div>
          <div className="mb-4 font-ui text-sm text-ink-soft">{t(locale, "今日一句", "Passage of the day")}</div>
          <SentenceCard locale={locale} sentence={featured} compact />
          <ReadingHint currentId={featured.id} locale={locale} />
        </div>
      </section>
      <section className="border-y border-rule bg-surface">
        <div className="page-shell grid gap-6 py-8 sm:grid-cols-4 sm:py-10">
          {[
            [`${books.length} ${t(locale, "篇", "books")}`, t(locale, "学而至尧曰逐篇完整", "Xue Er to Yao Yue, all complete")],
            [`${getAllSentences().length} ${t(locale, "章", "passages")}`, t(locale, "逐句原文、白话、英译与注释", "Original, guide, English, notes per passage")],
            [t(locale, "中英双语", "Bilingual"), t(locale, "简体 + Legge 公版英译", "Simplified Chinese + Legge's public-domain English")],
            [t(locale, "审校底本", "Reviewed base"), t(locale, "白话据 1948《白话论语读本》", "Guide from the 1948 广益书局 edition")],
          ].map(([value, label]) => (
            <div key={value}>
              <div className="font-serif text-2xl text-ink sm:text-3xl">{value}</div>
              <div className="mt-2 font-ui text-sm text-ink-soft">{label}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="border-b border-rule">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              contentCoverage.reviewedGuide.ratio,
              t(locale, "白话导读已覆盖", "Modern Chinese guide covered"),
            ],
            [
              contentCoverage.englishTranslation.ratio,
              t(locale, "James Legge 英译已覆盖", "James Legge translation covered"),
            ],
            [
              contentCoverage.pinyin.ratio,
              t(
                locale,
                contentCoverage.pinyin.complete ? "逐句拼音已全量展示" : "逐句拼音已展示",
                contentCoverage.pinyin.complete
                  ? "Passage-level pinyin fully rendered"
                  : "Passage-level pinyin rendered"
              ),
            ],
            [
              contentCoverage.audio.ratio,
              t(locale, "章节音频已上线", "Chapter audio available"),
            ],
          ].map(([value, label]) => (
            <div key={label} className="border-l border-rule pl-4">
              <div className="font-ui text-sm font-medium text-ink">{value}</div>
              <div className="mt-2 font-ui text-sm leading-6 text-ink-soft">{label}</div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
