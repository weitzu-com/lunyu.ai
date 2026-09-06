import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BiographyDirectory, ChronologyExplorer } from "@/components/biographies/BiographyExplorer";
import { ChronologyMethod } from "@/components/biographies/BiographyTimeline";
import { biographyModifiedDate, biographyProfiles, biographySources } from "@/lib/biographies";
import { biographyPath } from "@/lib/biography-utils";
import { breadcrumbJsonLd, jsonLd, localizedUrl, organizationId } from "@/lib/site";
import { openGraph, twitterCard } from "@/lib/seo";
import "@/components/biographies/biographies.css";

const title = "孔子与弟子：人物简介与生平年表";
const description = "按年份阅读孔子及《史记·仲尼弟子列传》具名弟子的生平，查找姓名、字、籍贯与事迹。每项记载标明史料出处，并区分纪年、约年、异说与年代不详。";
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
      <main id="main" className="page-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <section className="biography-hero border-b border-rule" aria-labelledby="page-heading">
          <div>
            <p className="label mb-5">春秋末年 · 孔门人物志</p>
            <h1 id="page-heading" className="font-cjk text-4xl leading-[1.45] tracking-wide sm:text-5xl">孔子与弟子<span className="mt-2 block text-ink-soft">生平年表</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-ink-soft sm:text-lg">从一个人的名字，走进他所处的年代。沿着求学、出仕、周游与传道的经历，认识《论语》里的师生。</p>
            <div className="mt-7 flex flex-wrap gap-3"><a className="ui-button ui-button-primary" href="#chronology">按年份阅读 ↓</a><a className="ui-button" href="#directory">查找人物 ↓</a></div>
          </div>
          <aside className="border-l-2 border-cinnabar pl-5 sm:pl-6">
            <h2 className="font-cjk text-xl">让每段生平，都有出处</h2>
            <p className="mt-4 text-base leading-8 text-ink-soft">收录孔子与《史记》列传中的 {biographyProfiles.length - 1} 位弟子。史料有年则系年，有事无年则留白；后世传说与推定不写成确证。</p>
            <dl className="mt-5 space-y-2 text-sm leading-7"><div className="flex gap-4"><dt className="text-ink-soft">主要依据</dt><dd>《论语》《史记》《左传》</dd></div><div className="flex gap-4"><dt className="text-ink-soft">资料核对</dt><dd>{biographyModifiedDate}</dd></div></dl>
            <Link className="mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4" href={biographyPath("confucius")}>先读孔子的完整生平 →</Link>
          </aside>
        </section>
        <ChronologyExplorer profiles={biographyProfiles} sources={biographySources} />
        <BiographyDirectory profiles={biographyProfiles} />
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
