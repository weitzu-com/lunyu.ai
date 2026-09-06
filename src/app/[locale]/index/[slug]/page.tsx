import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { FeaturedIndexEntry } from "@/components/FeaturedIndexEntry";
import { biographyProfiles } from "@/lib/biographies";
import { geographyPlaces } from "@/lib/geography";
import {
  blogCountLine,
  blogEntities,
  blogSummary,
  blogTitle,
  blogUrl,
  categoryLabel,
  getBlogEntity,
  getRelatedBlogs,
  getSentencesForBlog,
  sentenceBookLabel,
  sentenceHref,
} from "@/lib/blogs";
import {
  getFeaturedIndex,
  indexEntryModifiedDate,
  localize as localizeFeatured,
} from "@/lib/featured-index";
import { Locale, locales, t } from "@/lib/analects";
import { alternates, openGraph, twitterCard } from "@/lib/seo";
import {
  breadcrumbJsonLd,
  contentModifiedDate,
  jsonLd,
  localizedUrl,
  organizationId,
  siteName,
} from "@/lib/site";

export function generateStaticParams() {
  return (Object.keys(locales) as Locale[]).flatMap((locale) =>
    blogEntities.map((entity) => ({ locale, slug: entity.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entity = getBlogEntity(slug);
  if (!entity) return {};
  const featured = getFeaturedIndex(slug);
  const title = blogTitle(locale, entity);
  const description = featured
    ? localizeFeatured(locale, featured.metaDescription)
    : blogSummary(locale, entity);
  return {
    title,
    description,
    alternates: alternates(locale, `/index/${entity.slug}`),
    openGraph: openGraph(locale, `/index/${entity.slug}`, `${title} · lunyu.ai`, description),
    twitter: twitterCard(locale, `/index/${entity.slug}`, `${title} · lunyu.ai`, description),
  };
}

export default async function KnowledgeEntryPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const entity = getBlogEntity(slug);
  if (!entity) notFound();

  const relatedSentences = getSentencesForBlog(entity);
  const biography = locale === "zh-Hans" && entity.category === "person"
    ? biographyProfiles.find((person) => person.name === entity.zhName || person.aliases.includes(entity.zhName))
    : undefined;
  const geographicEntries = locale === "zh-Hans" && entity.category === "place"
    ? geographyPlaces.filter((place) => [entity.zhName, ...entity.zhName.split("、")].some((name) => place.name === name || place.aliases.includes(name)))
    : [];
  const relatedEntities = getRelatedBlogs(entity);
  const featured = getFeaturedIndex(slug);
  const pageUrl = localizedUrl(locale, `/index/${entity.slug}`);
  const description = featured
    ? localizeFeatured(locale, featured.metaDescription)
    : blogSummary(locale, entity);
  const dateModified = indexEntryModifiedDate(slug) ?? contentModifiedDate;

  const entryJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: blogTitle(locale, entity),
        description,
        inLanguage: locale,
        dateModified,
        publisher: { "@id": organizationId },
        isPartOf: { "@id": `${localizedUrl(locale, "")}#website` },
        about: {
          "@type": "Thing",
          name: blogTitle(locale, entity),
        },
        ...(featured
          ? {
              hasPart: {
                "@id": `${pageUrl}#faq`,
              },
            }
          : {}),
      },
      ...(featured
        ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              url: `${pageUrl}#faq`,
              inLanguage: locale,
              mainEntity: featured.faqs.map((faq) => ({
                "@type": "Question",
                name: localizeFeatured(locale, faq.question),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: localizeFeatured(locale, faq.answer),
                },
              })),
            },
          ]
        : []),
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: localizedUrl(locale, ""),
      },
      breadcrumbJsonLd(locale, [
        { name: siteName, path: "" },
        { name: t(locale, "知识索引", "Knowledge index"), path: "/index" },
        { name: blogTitle(locale, entity), path: `/index/${entity.slug}` },
      ]),
    ],
  };

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path="/index" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(entryJsonLd) }} />
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
              <Link href={`/${locale}/index`} className="hover:text-ink">
                {t(locale, "知识索引", "Knowledge index")}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-ink">{blogTitle(locale, entity)}</li>
          </ol>
        </nav>

        <p className="label mb-4">{categoryLabel(locale, entity.category)}</p>
        <h1 className="font-serif text-[2.5rem] leading-tight sm:text-5xl">
          {blogTitle(locale, entity)}
        </h1>
        {biography && <Link className="ui-button mt-6" href={`/zh-Hans/people/${biography.slug}`}>查看{biography.name}的肖像、著作与生平年表 →</Link>}
        {geographicEntries.length > 0 && <div className="mt-6 flex flex-wrap gap-3">{geographicEntries.map((place) => <Link key={place.slug} className="ui-button" href={`/zh-Hans/places/${place.slug}`}>查看{place.name}的图片、地望与人物活动 →</Link>)}</div>}
        {featured ? (
          <FeaturedIndexEntry locale={locale} entity={entity} content={featured} />
        ) : (
          <>
            <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
              {blogSummary(locale, entity)}
            </p>
            <p className="mt-3 max-w-3xl font-ui text-sm text-ink-soft">
              {blogCountLine(locale, entity)}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={`/${locale}/index`} className="chip">
                {t(locale, "返回索引", "Back to index")}
              </Link>
              <Link href={`/${locale}/analects`} className="chip">
                {t(locale, "查看论语目录", "Open the Analects index")}
              </Link>
            </div>

            <section className="mt-10 border-y border-rule bg-surface px-4 py-5 sm:px-6">
              <h2 className="label">{t(locale, "相关章句", "Relevant passages")}</h2>
              {relatedSentences.length > 0 ? (
                <ol className="mt-4 divide-y divide-rule">
                  {relatedSentences.map((sentence) => (
                    <li key={sentence.id} className="py-4">
                      <Link href={sentenceHref(locale, sentence)} className="group block">
                        <div className="flex flex-wrap items-center justify-between gap-2 font-ui text-xs text-ink-soft">
                          <span>{sentenceBookLabel(locale, sentence)}</span>
                          <span>{sentence.id}</span>
                        </div>
                        <p className="mt-2 font-serif text-xl leading-[1.7] text-ink group-hover:text-cinnabar">
                          {sentence.classicalChinese}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-ink-soft">
                          {locale === "zh-Hans" ? sentence.modernChinese : sentence.english}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-sm leading-7 text-ink-soft">
                  {t(
                    locale,
                    "当前未找到匹配章句；这通常意味着该词条尚未在站内文本中出现。",
                    "No matching passages were found. That usually means the entry has not yet appeared in the site text."
                  )}
                </p>
              )}
            </section>

            {relatedEntities.length > 0 && (
              <section className="mt-8 border-y border-rule bg-surface px-4 py-5 sm:px-6">
                <h2 className="label">{t(locale, "相关词条", "Related entries")}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedEntities.map(({ entity: relatedEntity, overlap }) => (
                    <Link key={relatedEntity.slug} href={blogUrl(locale, relatedEntity)} className="chip">
                      {blogTitle(locale, relatedEntity)}
                      <span className="ml-2 text-xs text-ink-soft">{overlap}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
