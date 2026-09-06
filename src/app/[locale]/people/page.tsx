import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BiographyDirectory, ChronologyExplorer } from "@/components/biographies/BiographyExplorer";
import { BiographyNavigation } from "@/components/biographies/BiographyNavigation";
import { portraitRecords } from "@/lib/biography-evidence";
import { ChronologyMethod } from "@/components/biographies/BiographyTimeline";
import { biographyModifiedDate, biographyProfiles, biographySources } from "@/lib/biographies";
import { biographyPath } from "@/lib/biography-utils";
import { breadcrumbJsonLd, jsonLd, localizedUrl, organizationId } from "@/lib/site";
import { openGraph, twitterCard } from "@/lib/seo";
import "@/components/biographies/biographies.css";

const title = "孔子与弟子：人物简介与生平年表";
const description = "按年份阅读孔子及《史记·仲尼弟子列传》具名弟子的生平，查找姓名、字、籍贯与事迹。人物档案附后世肖像、馆藏出处及著作归属核查，区分纪年、约年、异说与年代不详。";
const pageUrl = localizedUrl("zh-Hans", "/people");

export function generateStaticParams() { return [{ locale: "zh-Hans" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "zh-Hans") notFound();
  return {
    title, description,
    alternates: { canonical: pageUrl, languages: { "zh-Hans": pageUrl, "x-default": pageUrl } },
    openGraph: openGraph("zh-Hans", "/people", title, description),
    twitter: twitterCard("zh-Hans", "/people", title, description),
  };
}

export default async function PeoplePage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "zh-Hans") notFound();
  const portraits = Object.fromEntries(portraitRecords.flatMap(({ slug, image }) => image ? [[slug, { assetPath: image.assetPath, width: image.width, height: image.height }]] : []));
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage", "@id": `${pageUrl}#webpage`, url: pageUrl, name: title, description,
        inLanguage: "zh-Hans", dateModified: biographyModifiedDate, publisher: { "@id": organizationId },
        mainEntity: { "@type": "ItemList", numberOfItems: biographyProfiles.length, itemListElement: biographyProfiles.map((profile, index) => ({ "@type": "ListItem", position: index + 1, name: profile.name, url: localizedUrl("zh-Hans", `/people/${profile.slug}`) })) },
      },
      breadcrumbJsonLd("zh-Hans", [{ name: "lunyu.ai", path: "" }, { name: "人物年表", path: "/people" }]),
    ],
  };
  return (
    <>
      <a className="biography-skip sr-only focus:not-sr-only focus:block focus:p-4" href="#main">跳至正文</a>
      <SiteHeader locale="zh-Hans" path="/people" availableLocales={["zh-Hans"]} />
      <main id="main" className="page-shell people-overview">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <section className="people-intro" aria-labelledby="page-heading">
          <div>
            <p className="label">春秋末年 · 孔门人物志</p>
            <h1 id="page-heading">孔子与弟子</h1>
            <p>从一个名字，走进《论语》里的师生。查找 {biographyProfiles.length} 位人物的生平、后世画像与相关文献，也可以沿着年份阅读他们的经历。</p>
          </div>
          <aside className="people-intro-aside">
            <p>收录孔子与《史记》列传中的 {biographyProfiles.length - 1} 位弟子。有年则系年，有事无年则保留记载；推定与争议分别标明。</p>
            <div className="flex flex-col items-start">
              <Link href={biographyPath("confucius")}>从孔子的生平开始 →</Link>
              <Link href="/zh-Hans/places">走进人物活动的地方 →</Link>
            </div>
          </aside>
        </section>
        <BiographyNavigation name="孔门人物志" sections={[{ id: "directory", label: "找人物" }, { id: "chronology", label: "看年表" }, { id: "sources", label: "查出处" }]} />
        <BiographyDirectory profiles={biographyProfiles} portraits={portraits} />
        <ChronologyExplorer profiles={biographyProfiles} sources={biographySources} />
        <ChronologyMethod />
        <section id="sources" className="scroll-mt-6 py-12 sm:py-16" aria-labelledby="sources-heading">
          <p className="label mb-3">可追溯的阅读</p><h2 id="sources-heading" className="font-cjk text-3xl">参考文献与原典</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">先读原典，再看不同解释。下列资料用于名录、事件与纪年的核对；具体卷、篇、年或章句见人物档案和年表中的“史料出处”。</p>
          <ol className="mt-6 grid gap-x-8 sm:grid-cols-2">
            {biographySources.map((source) => (
              <li key={source.id} id={`source-${source.id}`} className="min-w-0 border-b border-rule py-5">
                <p className="mb-2 text-sm text-ink-soft">{source.kind === "primary" ? "原典" : source.kind === "academic" ? "学术研究" : "机构资料"}</p>
                <a className="inline-flex min-h-11 items-center gap-2 font-cjk text-lg underline decoration-rule underline-offset-4 hover:decoration-ink" href={source.url} target="_blank" rel="noreferrer">{source.title}<span aria-hidden="true">↗</span><span className="sr-only">（新标签页）</span></a>
                <p className="mt-2 text-sm leading-7 text-ink-soft">{source.note}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-7 text-ink-soft">发现异名、纪年或引文定位需要订正，可按<Link className="underline underline-offset-4" href="/zh-Hans/method#corrections">本站纠错说明</Link>提供具体人物链接与文献依据。</p>
        </section>
      </main>
      <SiteFooter locale="zh-Hans" />
    </>
  );
}
