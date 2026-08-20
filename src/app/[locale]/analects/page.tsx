import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { books, Locale, t } from "@/lib/analects";
import { alternates, localizedUrl, openGraph, twitterCard } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = t(locale, "《论语》二十篇目录", "The Analects — Twenty Books");
  const description = t(
    locale,
    "《论语》二十篇完整目录，简体原文与 James Legge 公版英译，共 499 章，逐章可读、可听、可索引。",
    "The complete twenty books of The Analects — Simplified Chinese source text and James Legge's public-domain English translation, 499 chapters, readable and indexable."
  );
  return {
    title,
    description,
    alternates: alternates(locale, "/analects"),
    openGraph: openGraph(locale, "/analects", `${title} · lunyu.ai`, description),
      twitter: twitterCard(locale, "/analects", `${title} · lunyu.ai`, description),
  };
}

export default async function AnalectsIndex({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t(locale, "《论语》二十篇", "The Analects — Twenty Books"),
    inLanguage: locale,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "lunyu.ai", item: localizedUrl(locale, "") },
        { "@type": "ListItem", position: 2, name: t(locale, "论语", "The Analects"), item: localizedUrl(locale, "/analects") },
      ],
    },
    hasPart: books.map((book) => ({
      "@type": "Book",
      name: t(locale, book.zhTitle, book.enTitle),
      url: localizedUrl(locale, `/analects/${book.slug}`),
      position: book.number,
    })),
  };

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader locale={locale} path="/analects" />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <p className="label mb-4">
          {t(locale, "二十篇目录", "Twenty books")}
        </p>
        <h1 className="font-serif text-5xl">{t(locale, "《论语》", "The Analects")}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-ink-soft">
          {t(
            locale,
            "二十篇 499 章已按简体原文、审校白话导读、James Legge 公版英译、注释与主题逐句发布。逐章可读、可听、可索引、可分享。",
            "All 499 passages across the twenty books are published passage by passage: simplified Chinese, a reviewed modern Chinese guide, James Legge's public-domain English translation, notes, and themes — readable, hearable, indexable, shareable."
          )}
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <Link
              key={book.slug}
              href={`/${locale}/analects/${book.slug}`}
              className="border border-rule bg-surface p-5 transition duration-300 hover:-translate-y-0.5 hover:border-ink"
            >
              <div className="font-ui text-sm text-cinnabar">
                {String(book.number).padStart(2, "0")}
              </div>
              <h2 className="mt-3 font-serif text-2xl">
                {locale === "zh-Hans" ? (
                  book.zhTitle
                ) : (
                  <>
                    {book.pinyin} <span className="font-cjk text-ink-soft">（{book.zhTitle}）</span>
                  </>
                )}
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                {t(locale, book.summaryZh, book.summaryEn)}
              </p>
              <p className="label mt-4">
                {book.chapterCount} {t(locale, "章", "chapters")}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
