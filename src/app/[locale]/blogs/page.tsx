import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Locale, locales, t } from "@/lib/analects";
import { editorialPosts, postDek, postTags, postTitle } from "@/lib/editorial-posts";
import { alternates, openGraph, twitterCard } from "@/lib/seo";
import { breadcrumbJsonLd, jsonLd, localizedUrl, organizationId, siteName } from "@/lib/site";

export function generateStaticParams() {
  return Object.keys(locales).map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = t(locale, "论语阅读札记", "Analects Reading Notes");
  const description = t(
    locale,
    "lunyu.ai 的编辑札记：读法、概念、礼学、学习实践与 AI 阅读边界。",
    "Editorial notes from lunyu.ai on reading methods, concepts, ritual, practice, and AI boundaries."
  );
  return {
    title,
    description,
    alternates: alternates(locale, "/blogs"),
    openGraph: openGraph(locale, "/blogs", `${title} · lunyu.ai`, description),
    twitter: twitterCard(locale, "/blogs", `${title} · lunyu.ai`, description),
  };
}

export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const pageUrl = localizedUrl(locale, "/blogs");
  const blogsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: t(locale, "论语阅读札记", "Analects Reading Notes"),
        description: t(
          locale,
          "围绕《论语》阅读方法、核心概念与编辑边界的文章集合。",
          "A collection of essays on reading The Analects, core concepts, and editorial boundaries."
        ),
        inLanguage: locale,
        publisher: { "@id": organizationId },
        hasPart: editorialPosts.map((post) => ({
          "@type": "Article",
          headline: postTitle(locale, post),
          url: localizedUrl(locale, `/blogs/${post.slug}`),
          datePublished: post.datePublished,
          dateModified: post.dateModified,
        })),
      },
      { "@type": "Organization", "@id": organizationId, name: siteName },
      breadcrumbJsonLd(locale, [
        { name: siteName, path: "" },
        { name: t(locale, "札记", "Notes"), path: "/blogs" },
      ]),
    ],
  };

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path="/blogs" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(blogsJsonLd) }} />
      <section className="page-shell py-10 sm:py-12">
        <p className="label mb-4">
          {t(locale, "编辑札记", "Editorial notes")}
        </p>
        <h1 className="font-serif text-[2.5rem] leading-tight sm:text-5xl">
          {t(locale, "论语阅读札记", "Analects Reading Notes")}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
          {t(
            locale,
            "这里放真正的文章：解释如何阅读、如何使用索引、如何区分原文、导读、译文与 AI 启发。",
            "These are actual essays on how to read, how to use the index, and how to separate source text, guides, translations, and AI reflection."
          )}
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {editorialPosts.map((post) => (
            <article key={post.slug} className="border-y border-rule bg-surface px-4 py-5 sm:border sm:p-5">
              <div className="flex flex-wrap items-center gap-2 font-ui text-xs text-ink-soft">
                <time dateTime={post.datePublished}>{post.datePublished}</time>
                <span aria-hidden>·</span>
                <span>{postTags(locale, post).slice(0, 2).join(" / ")}</span>
              </div>
              <h2 className="mt-3 font-serif text-2xl leading-snug text-ink sm:text-3xl">
                <Link href={`/${locale}/blogs/${post.slug}`} className="hover:text-cinnabar">
                  {postTitle(locale, post)}
                </Link>
              </h2>
              <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-base">
                {postDek(locale, post)}
              </p>
              <p className="mt-2 font-ui text-xs text-ink-soft">
                {t(locale, "lunyu.ai 编辑部 · 校对", "lunyu.ai editorial desk · review")}
              </p>
              <Link href={`/${locale}/blogs/${post.slug}`} className="deep-read-link mt-4 inline-block">
                {t(locale, "阅读全文", "Read essay")}
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-10 border-y border-rule bg-surface px-4 py-5 sm:border sm:p-5">
          <h2 className="label">{t(locale, "需要查词条？", "Looking for the index?")}</h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            {t(
              locale,
              "人物、地点、概念与典籍词条已经迁移到知识索引。",
              "People, places, concepts, and text entries now live in the knowledge index."
            )}
          </p>
          <Link href={`/${locale}/index`} className="deep-read-link mt-3 inline-block">
            {t(locale, "打开知识索引", "Open knowledge index")}
          </Link>
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
