import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BiographyTimeline, CitationList, ChronologyMethod } from "@/components/biographies/BiographyTimeline";
import { biographyModifiedDate, biographyProfiles, biographySources, getBiography } from "@/lib/biographies";
import { biographyPath } from "@/lib/biography-utils";
import { breadcrumbJsonLd, jsonLd, localizedUrl, organizationId } from "@/lib/site";
import { openGraph, twitterCard } from "@/lib/seo";
import { blogEntities } from "@/lib/blogs";
import "@/components/biographies/biographies.css";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return biographyProfiles.map((profile) => ({ locale: "zh-Hans", slug: profile.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const profile = getBiography(slug);
  if (locale !== "zh-Hans" || !profile) notFound();
  const title = `${profile.name}${profile.courtesyName ? `（${profile.courtesyName}）` : ""}：人物简介与生平年表`;
  const path = `/people/${slug}`;
  const url = localizedUrl("zh-Hans", path);
  const description = `${profile.summary}${profile.lifespan}。按年份整理生平事迹，附史料出处与纪年说明。`;
  return { title, description, alternates: { canonical: url, languages: { "zh-Hans": url, "x-default": url } }, openGraph: openGraph("zh-Hans", path, title, description), twitter: twitterCard("zh-Hans", path, title, description) };
}

export default async function BiographyPage({ params }: Props) {
  const { locale, slug } = await params;
  const profile = getBiography(slug);
  if (locale !== "zh-Hans" || !profile) notFound();
  const url = localizedUrl("zh-Hans", `/people/${slug}`);
  const dated = profile.events.filter((event) => event.year !== null);
  const undated = profile.events.filter((event) => event.year === null);
  const usedSourceIds = new Set([...profile.citations, ...profile.events.flatMap((event) => event.citations)].map((citation) => citation.sourceId));
  const usedSources = biographySources.filter((source) => usedSourceIds.has(source.id));
  const passageIndex = blogEntities.find((entity) => entity.category === "person" && (entity.zhName === profile.name || profile.aliases.includes(entity.zhName)));
  const schema = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "ProfilePage", "@id": `${url}#webpage`, url, name: `${profile.name}人物简介与生平年表`, description: profile.summary, inLanguage: "zh-Hans", dateModified: biographyModifiedDate, publisher: { "@id": organizationId }, mainEntity: { "@type": "Person", "@id": `${url}#person`, name: profile.name, alternateName: [...new Set([profile.courtesyName, ...profile.aliases].filter(Boolean))], description: profile.summary, url }, citation: usedSources.map((source) => ({ "@type": "CreativeWork", name: source.title, url: source.url })) },
      breadcrumbJsonLd("zh-Hans", [{ name: "lunyu.ai", path: "" }, { name: "人物年表", path: "/people" }, { name: profile.name, path: `/people/${slug}` }]),
    ],
  };
  return (
    <>
      <a className="biography-skip sr-only focus:not-sr-only focus:block focus:p-4" href="#main">跳至正文</a>
      <SiteHeader locale="zh-Hans" path={`/people/${slug}`} availableLocales={["zh-Hans"]} />
      <main id="main" className="page-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <nav className="pt-6 text-sm text-ink-soft" aria-label="面包屑"><Link href={biographyPath()} className="inline-flex min-h-11 items-center hover:text-ink">← 孔子与弟子 · 人物年表</Link></nav>
        <section className="biography-hero border-b border-rule" aria-labelledby="profile-name">
          <div><p className="label mb-5">孔门人物志 · {profile.group}</p><h1 id="profile-name" className="font-cjk text-5xl leading-tight sm:text-6xl">{profile.name}</h1><p className="mt-4 font-cjk text-xl leading-8 text-ink-soft">{profile.courtesyName ? `字${profile.courtesyName}` : "字未详"}{profile.aliases.length > 0 ? ` · ${profile.aliases.join("、")}` : ""}</p><p className="mt-6 max-w-2xl text-lg leading-9">{profile.summary}</p></div>
          <dl className="border-y border-rule text-base leading-8">
            <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-4 border-b border-rule py-4"><dt className="text-ink-soft">生卒</dt><dd>{profile.lifespan}</dd></div>
            <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-4 border-b border-rule py-4"><dt className="text-ink-soft">籍贯</dt><dd>{profile.origin}</dd></div>
            <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-4 py-4"><dt className="text-ink-soft">身份</dt><dd>{profile.role === "teacher" ? "思想家、教育者，孔门之师" : "《史记·仲尼弟子列传》所列弟子"}</dd></div>
          </dl>
        </section>
        <div className="grid items-start gap-10 py-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16 lg:py-14">
          <aside className="lg:sticky lg:top-6">
            <nav aria-label="本页目录" className="flex flex-wrap gap-x-6 gap-y-1 text-sm lg:flex-col lg:gap-1"><a href="#biography" className="inline-flex min-h-11 items-center">人物简介</a><a href="#timeline" className="inline-flex min-h-11 items-center">按年生平 · {dated.length}</a>{undated.length > 0 && <a href="#undated" className="inline-flex min-h-11 items-center">未定年记载 · {undated.length}</a>}<a href="#references" className="inline-flex min-h-11 items-center">史料与参考</a></nav>
            {passageIndex && <Link className="mt-4 inline-flex min-h-11 items-center border-t border-rule pt-4 text-sm leading-7 underline underline-offset-4" href={`/zh-Hans/index/${passageIndex.slug}`}>在《论语》中读{profile.name} →</Link>}
            <p className="mt-5 hidden text-sm leading-7 text-ink-soft lg:block">同一年可能有多项记载。虚岁、实岁与生年异说会影响年龄推算，请连同出处阅读。</p>
          </aside>
          <div className="min-w-0">
            <section id="biography" className="scroll-mt-6" aria-labelledby="biography-heading"><h2 id="biography-heading" className="font-cjk text-3xl">人物简介</h2><div className="mt-6 space-y-5 text-base leading-9 text-ink-soft">{profile.biography.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="mt-5"><CitationList citations={profile.citations} sources={biographySources} /></div></section>
            <section id="timeline" className="scroll-mt-6 pt-12" aria-labelledby="timeline-heading"><div className="mb-8 flex flex-wrap items-baseline gap-3"><h2 id="timeline-heading" className="font-cjk text-3xl">按年生平</h2><span className="text-sm text-ink-soft">公元前 · 由早至晚</span></div>{dated.length > 0 ? <BiographyTimeline events={dated} sources={biographySources} linkable /> : <p className="border-l-2 border-rule pl-5 text-base leading-8 text-ink-soft">现有参考文献不足以为{profile.name}建立可靠的逐年生平。下方保留可核对的记载，不以推测补全年份。</p>}</section>
            {undated.length > 0 && <section id="undated" className="scroll-mt-6 pt-8" aria-labelledby="undated-heading"><h2 id="undated-heading" className="font-cjk text-3xl">未定年记载</h2><p className="mb-8 mt-4 text-base leading-8 text-ink-soft">有文献依据，但不能可靠放入某一公元前年份；以下顺序不代表事件先后。</p><BiographyTimeline events={undated} sources={biographySources} /></section>}
            <section id="references" className="scroll-mt-6 border-t border-rule pt-8" aria-labelledby="references-heading"><h2 id="references-heading" className="font-cjk text-3xl">史料与参考</h2><ol className="mt-6 space-y-6">{usedSources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-cjk text-lg underline decoration-rule underline-offset-4">{source.title} ↗<span className="sr-only">（新标签页）</span></a><p className="text-sm leading-7 text-ink-soft">{source.note}</p></li>)}</ol><p className="mt-8 text-sm text-ink-soft">资料核对：{biographyModifiedDate} · <Link href="/zh-Hans/method#corrections" className="underline underline-offset-4">提供订正依据</Link></p></section>
          </div>
        </div>
        <ChronologyMethod />
        <nav className="flex flex-wrap gap-3 py-8" aria-label="继续阅读"><Link className="ui-button" href={biographyPath()}>返回人物与年表</Link><Link className="ui-button" href="/zh-Hans/analects">回到《论语》二十篇 →</Link></nav>
      </main>
      <SiteFooter locale="zh-Hans" />
    </>
  );
}
