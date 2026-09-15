import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialFigure } from "@/components/EditorialFigure";
import { EditorialParagraph } from "@/components/EditorialParagraph";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Locale, locales, t } from "@/lib/analects";
import {
  editorialImageAlt,
  editorialImageUrl,
  editorialPosts,
  getEditorialPost,
  postDek,
  postDescription,
  postTags,
  postTitle,
  type EditorialPost,
  type EditorialSection,
} from "@/lib/editorial-posts";
import { alternates, openGraph, twitterCard } from "@/lib/seo";
import {
  breadcrumbJsonLd,
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
  const description = postDescription(locale, post);
  const path = `/blogs/${post.slug}`;
  const cover =
    post.cover == null
      ? undefined
      : {
          url: editorialImageUrl(post.cover),
          alt: editorialImageAlt(locale, post.cover),
          width: post.cover.width,
          height: post.cover.height,
        };
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      ...openGraph(locale, path, `${title} · lunyu.ai`, description),
      ...(cover ? { images: [cover] } : {}),
    },
    twitter: {
      ...twitterCard(locale, path, `${title} · lunyu.ai`, description),
      ...(cover ? { images: [{ url: cover.url, alt: cover.alt }] } : {}),
    },
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
        description: postDescription(locale, post),
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        inLanguage: locale,
        ...(post.cover ? { image: [editorialImageUrl(post.cover)] } : {}),
        author: { "@type": "Organization", "@id": editorialDeskId, name: byline },
        editor: { "@type": "Organization", "@id": editorialDeskId, name: byline },
        reviewedBy: { "@type": "Organization", "@id": editorialDeskId, name: byline },
        publisher: { "@id": organizationId },
        isPartOf: { "@id": `${localizedUrl(locale, "")}#website` },
        mainEntityOfPage: pageUrl,
      },
      ...(post.faqs?.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              url: `${pageUrl}#faq`,
              inLanguage: locale,
              mainEntity: post.faqs.map((item) => ({
                "@type": "Question",
                name: t(locale, item.questionZh, item.questionEn),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: t(locale, item.answerZh, item.answerEn),
                },
              })),
            },
          ]
        : []),
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
        {post.cover ? (
          <EditorialFigure className="mt-5" image={post.cover} locale={locale} priority />
        ) : null}
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
          <EditorialSectionList locale={locale} post={post} sections={post.sections} />
          {post.faqs && post.faqs.length > 0 ? <EditorialFaqList locale={locale} post={post} /> : null}
          {post.afterFaqSections && post.afterFaqSections.length > 0 ? (
            <EditorialSectionList locale={locale} post={post} sections={post.afterFaqSections} />
          ) : null}
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

function EditorialSectionList({
  locale,
  post,
  sections,
}: {
  locale: Locale;
  post: EditorialPost;
  sections: EditorialSection[];
}) {
  return (
    <>
      {sections.map((section) => {
        const inlineImage = section.imageSlot ? post.inlineImages?.[section.imageSlot] : undefined;
        return (
          <section key={section.headingEn} className="reading-panel">
            <h2 className="label">{t(locale, section.headingZh, section.headingEn)}</h2>
            {inlineImage ? (
              <EditorialFigure className="mt-4" image={inlineImage} locale={locale} />
            ) : null}
            <div className="mt-4 space-y-4 text-base leading-8 text-ink">
              {(locale === "zh-Hans" ? section.bodyZh : section.bodyEn).map((paragraph) => (
                <EditorialParagraph key={paragraph} text={paragraph} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

function EditorialFaqList({ locale, post }: { locale: Locale; post: EditorialPost }) {
  const faqs = post.faqs ?? [];
  return (
    <section className="reading-panel" aria-labelledby="notes-faq">
      <h2 id="notes-faq" className="label">
        {t(locale, "常见问题", "FAQ")}
      </h2>
      <div className="mt-4 space-y-5">
        {faqs.map((item) => (
          <div key={item.questionEn} className="border-b border-rule pb-5 last:border-b-0">
            <h3 className="font-serif text-2xl leading-snug text-ink">
              {t(locale, item.questionZh, item.questionEn)}
            </h3>
            <EditorialParagraph
              className="mt-2 text-sm leading-7 text-ink-soft"
              text={t(locale, item.answerZh, item.answerEn)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
