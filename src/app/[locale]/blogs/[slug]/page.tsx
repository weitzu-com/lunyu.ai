import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Locale, locales, t } from "@/lib/analects";
import { editorialPosts, getEditorialPost, postDek, postTags, postTitle } from "@/lib/editorial-posts";
import { alternates, openGraph, twitterCard } from "@/lib/seo";
import {
  breadcrumbJsonLd,
  contentModifiedDate,
  jsonLd,
  localizedUrl,
  organizationId,
  siteName,
  siteUrl,
} from "@/lib/site";

export function generateStaticParams() {
  return (Object.keys(locales) as Locale[]).flatMap((locale) =>
    editorialPosts.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getEditorialPost(slug);
  if (!post) return {};
  const title = postTitle(locale, post);
  const description = postDek(locale, post);
  return {
    title,
    description,
    alternates: alternates(locale, `/blogs/${post.slug}`),
    openGraph: openGraph(locale, `/blogs/${post.slug}`, `${title} · lunyu.ai`, description),
    twitter: twitterCard(locale, `/blogs/${post.slug}`, `${title} · lunyu.ai`, description),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getEditorialPost(slug);
  if (!post) notFound();
  const byline = t(locale, "lunyu.ai 编辑部", "lunyu.ai editorial desk");
  const editorialDeskId = `${siteUrl}#editorial-desk`;

  const pageUrl = localizedUrl(locale, `/blogs/${post.slug}`);
  const postJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        url: pageUrl,
        headline: postTitle(locale, post),
        description: postDek(locale, post),
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        inLanguage: locale,
        author: { "@type": "Organization", "@id": editorialDeskId, name: byline },
        editor: { "@type": "Organization", "@id": editorialDeskId, name: byline },
        reviewedBy: { "@type": "Organization", "@id": editorialDeskId, name: byline },
        publisher: { "@id": organizationId },
        isPartOf: { "@id": `${localizedUrl(locale, "")}#website` },
        mainEntityOfPage: pageUrl,
      },
      {
        "@type": "Organization",
        "@id": editorialDeskId,
        name: byline,
        url: siteUrl,
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: localizedUrl(locale, ""),
      },
      breadcrumbJsonLd(locale, [
        { name: siteName, path: "" },
        { name: t(locale, "札记", "Notes"), path: "/blogs" },
        { name: postTitle(locale, post), path: `/blogs/${post.slug}` },
      ]),
    ],
  };

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path="/blogs" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(postJsonLd) }} />
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
              <Link href={`/${locale}/blogs`} className="hover:text-ink">
                {t(locale, "札记", "Notes")}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-ink">{postTitle(locale, post)}</li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-2 font-ui text-xs text-ink-soft">
          <time dateTime={post.datePublished}>{post.datePublished}</time>
          <span aria-hidden>·</span>
          <span>{postTags(locale, post).join(" / ")}</span>
        </div>
        <p className="mt-2 font-ui text-xs text-ink-soft">
          {t(locale, `署名：${byline} · 校对：${byline}`, `Byline: ${byline} · Review: ${byline}`)}
        </p>
        <h1 className="mt-4 font-serif text-[2.5rem] leading-tight sm:text-5xl">
          {postTitle(locale, post)}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
          {postDek(locale, post)}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={`/${locale}/blogs`} className="chip">
            {t(locale, "返回札记", "Back to notes")}
          </Link>
          <Link href={`/${locale}/index`} className="chip">
            {t(locale, "打开知识索引", "Open the knowledge index")}
          </Link>
        </div>

        <section className="mt-10 border-y border-rule bg-surface px-4 py-2 sm:px-6">
          {post.sections.map((section) => (
            <section key={section.headingZh} className="reading-panel">
              <h2 className="label">{t(locale, section.headingZh, section.headingEn)}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-ink">
                {(locale === "zh-Hans" ? section.bodyZh : section.bodyEn).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </section>

        <section className="mt-8 border-y border-rule bg-surface px-4 py-5 sm:px-6">
          <h2 className="label">{t(locale, "相关章句", "Related passages")}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.related.map((relatedPath) => (
              <Link key={relatedPath} href={localizedUrl(locale, relatedPath)} className="chip">
                {relatedPath}
              </Link>
            ))}
          </div>
        </section>
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
