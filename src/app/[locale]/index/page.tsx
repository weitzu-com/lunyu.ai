import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Locale, locales, t } from "@/lib/analects";
import {
  blogCountLine,
  blogSummary,
  blogTitle,
  blogUrl,
  categoryGroups,
  categoryLabel,
} from "@/lib/blogs";
import { alternates, openGraph, twitterCard } from "@/lib/seo";
import { breadcrumbJsonLd, jsonLd, localizedUrl, organizationId, siteName } from "@/lib/site";

export function generateStaticParams() {
  return (Object.keys(locales) as Locale[]).map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = t(locale, "知识索引", "Knowledge index");
  const description = t(
    locale,
    "人物、地点、概念、典籍与时代索引，按可引用页面组织。",
    "An index of people, places, concepts, texts, and eras, organized as citable pages."
  );
  return {
    title,
    description,
    alternates: alternates(locale, "/index"),
    openGraph: openGraph(locale, "/index", `${title} · lunyu.ai`, description),
    twitter: twitterCard(locale, "/index", `${title} · lunyu.ai`, description),
  };
}

export default async function KnowledgeIndexPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const pageUrl = localizedUrl(locale, "/index");
  const groups = categoryGroups();

  const indexJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t(locale, "知识索引", "Knowledge index"),
        description: t(
          locale,
          "人物、地点、概念、典籍与时代索引，按可引用页面组织。",
          "An index of people, places, concepts, texts, and eras, organized as citable pages."
        ),
        inLanguage: locale,
        publisher: { "@id": organizationId },
        isPartOf: { "@id": `${localizedUrl(locale, "")}#website` },
        hasPart: groups.flatMap((group) =>
          group.entities.map((entity) => ({
            "@type": "WebPage",
            url: localizedUrl(locale, `/index/${entity.slug}`),
            name: blogTitle(locale, entity),
          }))
        ),
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: localizedUrl(locale, ""),
      },
      breadcrumbJsonLd(locale, [
        { name: siteName, path: "" },
        { name: t(locale, "知识索引", "Knowledge index"), path: "/index" },
      ]),
    ],
  };

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path="/index" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(indexJsonLd) }} />
      <section className="page-shell py-10 sm:py-12">
        <p className="label mb-4">{t(locale, "知识索引", "Knowledge index")}</p>
        <h1 className="font-serif text-[2.5rem] leading-tight sm:text-5xl">
          {t(locale, "知识索引", "Knowledge index")}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
          {t(
            locale,
            "把《论语》读到人物、地点、概念与典籍层面时，这里提供可引用的入口页；每个词条都有对应章句。",
            "When The Analects leads you to people, places, concepts, and texts, this index provides citable entry pages; each entry maps back to the passages that mention it."
          )}
        </p>

        {locale === "zh-Hans" && (
          <Link href="/zh-Hans/people" className="mt-8 block border-l-2 border-cinnabar bg-surface p-5 sm:p-6">
            <h2 className="font-cjk text-2xl">孔子与弟子 · 人物简介与生平年表 →</h2>
            <p className="mt-3 text-base leading-8 text-ink-soft">按年份阅读孔门师生的经历，查找姓名、字与籍贯；逐项附史料出处，保留年代异说与未定年记载。</p>
          </Link>
        )}
        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <section key={group.category}>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-serif text-3xl text-ink">
                  {categoryLabel(locale, group.category)}
                </h2>
                <p className="label">
                  {group.entities.length} {t(locale, "个词条", "entries")}
                </p>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.entities.map((entity) => (
                  <Link
                    key={entity.slug}
                    href={blogUrl(locale, entity)}
                    className="border border-rule bg-surface p-5 transition duration-300 hover:-translate-y-0.5 hover:border-ink"
                  >
                    <div className="font-ui text-xs text-cinnabar">
                      {blogCountLine(locale, entity)}
                    </div>
                    <h3 className="mt-3 font-serif text-2xl leading-tight text-ink">
                      {blogTitle(locale, entity)}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-ink-soft">
                      {blogSummary(locale, entity)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
