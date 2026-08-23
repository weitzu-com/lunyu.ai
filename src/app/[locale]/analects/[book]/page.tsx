import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SentenceCard } from "@/components/SentenceCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { books, getBook, getSentences, locales, type Locale, t } from "@/lib/analects";
import { contentCoverageSummary, getBookContentCoverage } from "@/lib/content-coverage";
import { alternates, openGraph, twitterCard } from "@/lib/seo";
import { breadcrumbJsonLd, contentModifiedDate, jsonLd, localizedUrl, organizationId, siteName } from "@/lib/site";

export function generateStaticParams() {
  return (Object.keys(locales) as Locale[]).flatMap((locale) =>
    books.map((book) => ({ locale, book: book.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; book: string }>;
}): Promise<Metadata> {
  const { locale, book: bookSlug } = await params;
  const book = getBook(bookSlug);
  if (!book) return {};
  const coverage = getBookContentCoverage(book.slug)!;
  const title = t(locale, `《论语》· ${book.zhTitle}`, `The Analects · ${book.pinyin}`);
  const description = t(
    locale,
    `${book.zhTitle} 共 ${book.chapterCount} 章，逐句可读、可索引、可分享；拼音${coverage.pinyin.complete ? "全量展示" : `覆盖 ${coverage.pinyin.ratio}`}，听读页当前有 ${coverage.audio.ratio} 章可播放。`,
    `${book.pinyin} contains ${book.chapterCount} chapters. It is readable, indexable, and shareable; pinyin ${coverage.pinyin.complete ? "is fully rendered" : `covers ${coverage.pinyin.ratio} chapters`}, and ${coverage.audio.ratio} chapters are currently playable.`
  );
  const path = `/analects/${book.slug}`;
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: openGraph(locale, path, `${title} · lunyu.ai`, description),
    twitter: twitterCard(locale, path, `${title} · lunyu.ai`, description),
  };
}

export default async function AnalectsBookPage({
  params,
}: {
  params: Promise<{ locale: Locale; book: string }>;
}) {
  const { locale, book: bookSlug } = await params;
  const book = getBook(bookSlug);
  if (!book) notFound();

  const sentences = getSentences(book.slug);
  const coverage = getBookContentCoverage(book.slug)!;
  const listenHref = book.slug === books[0].slug ? `/${locale}/listen` : `/${locale}/listen/${book.slug}`;
  const pageUrl = localizedUrl(locale, `/analects/${book.slug}`);
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t(locale, `《论语》· ${book.zhTitle}`, `The Analects · ${book.pinyin}`),
        description: t(
          locale,
          `${book.zhTitle} 共 ${book.chapterCount} 章，逐句可读、可索引、可分享。${contentCoverageSummary(locale, coverage)}`,
          `${book.pinyin} contains ${book.chapterCount} chapters and is readable, indexable, and shareable. ${contentCoverageSummary(locale, coverage)}`
        ),
        inLanguage: locale,
        dateModified: contentModifiedDate,
        publisher: { "@id": organizationId },
        isPartOf: { "@id": `${localizedUrl(locale, "")}#website` },
        hasPart: sentences.map((sentence) => ({
          "@type": "Article",
          "@id": `${localizedUrl(locale, `/analects/${book.slug}/${sentence.id}`)}#article`,
          url: localizedUrl(locale, `/analects/${book.slug}/${sentence.id}`),
          name: `${book.number}.${sentence.sentenceNumber}`,
          position: sentence.sentenceNumber,
        })),
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: localizedUrl(locale, ""),
      },
      breadcrumbJsonLd(locale, [
        { name: siteName, path: "" },
        { name: t(locale, "论语", "The Analects"), path: "/analects" },
        { name: t(locale, book.zhTitle, book.enTitle), path: `/analects/${book.slug}` },
      ]),
    ],
  };

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path={`/analects/${book.slug}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(jsonLdGraph) }} />
      <article className="page-shell py-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-5 font-ui text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href={`/${locale}`} className="hover:text-ink">
                lunyu.ai
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href={`/${locale}/analects`} className="hover:text-ink">
                {t(locale, "论语", "The Analects")}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-ink">{t(locale, book.zhTitle, book.enTitle)}</li>
          </ol>
        </nav>

        <p className="label mb-4">{t(locale, "单篇目录", "Book index")}</p>
        <h1 className="font-serif text-[2.5rem] leading-tight sm:text-5xl">
          {locale === "zh-Hans" ? book.zhTitle : `${book.pinyin}（${book.zhTitle}）`}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
          {t(locale, book.summaryZh, book.summaryEn)}
        </p>
        <p className="mt-3 max-w-3xl font-ui text-sm text-ink-soft">
          {t(
            locale,
            `本篇共 ${book.chapterCount} 章；当前音频覆盖 ${coverage.audio.ratio} 章。`,
            `This book has ${book.chapterCount} chapters; ${coverage.audio.ratio} chapters currently have audio.`
          )}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={`/${locale}/analects`} className="chip">
            {t(locale, "返回目录", "Back to index")}
          </Link>
          <Link href={listenHref} className="chip">
            {t(locale, "打开听读", "Open listening")}
          </Link>
        </div>

        <section className="mt-10 border-y border-rule bg-surface px-4 py-2 sm:px-6">
          {sentences.map((sentence) => (
            <SentenceCard key={sentence.id} locale={locale} sentence={sentence} />
          ))}
        </section>
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
