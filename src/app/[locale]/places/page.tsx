import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { GeographyMap } from "@/components/geography/GeographyMap";
import { PlaceVisual } from "@/components/geography/PlaceVisual";
import { GeographyExplorer } from "@/components/geography/GeographyExplorer";
import { GeographyMotionToggle } from "@/components/geography/GeographyMotion";
import { geographyPath, placeKindLabels, placeRelationDescriptions, placeRelationLabels } from "@/components/geography/geography-presentation";
import { biographyProfiles, getBiography } from "@/lib/biographies";
import { biographyPath } from "@/lib/biography-utils";
import { geographyConnections, geographyCoverage, geographyModifiedDate, geographyPlaces, geographySources, getPlaceConnections } from "@/lib/geography";
import { openGraph, twitterCard } from "@/lib/seo";
import { breadcrumbJsonLd, jsonLd, localizedUrl, organizationId } from "@/lib/site";
import "@/components/geography/geography.css";

const title = "孔门地理：孔子与弟子的山川、城邑与邦国";
const description = "从孔子与全部在册弟子的生平出发，查阅活动、籍贯、言论和志愿计划涉及的地理条目。每页附图片或地理示意图、古今地望、相关人物、记载出处及争议说明。";
const pageUrl = localizedUrl("zh-Hans", "/places");

export function generateStaticParams() { return [{ locale: "zh-Hans" }]; }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "zh-Hans") notFound();
  return {
    title, description,
    alternates: { canonical: pageUrl, languages: { "zh-Hans": pageUrl, "x-default": pageUrl } },
    openGraph: openGraph("zh-Hans", "/places", title, description),
    twitter: twitterCard("zh-Hans", "/places", title, description),
  };
}

export default async function PlacesPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "zh-Hans") notFound();
  const unresolved = geographyCoverage.filter((entry) => entry.status !== "documented");
  const documented = geographyCoverage.filter((entry) => entry.status === "documented");
  const usedSourceIds = new Set([...geographyPlaces.flatMap((place) => place.citations), ...geographyConnections.flatMap((connection) => connection.citations)].map((citation) => citation.sourceId));
  const usedSources = geographySources.filter((source) => usedSourceIds.has(source.id));
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage", "@id": `${pageUrl}#webpage`, url: pageUrl, name: title, description,
        inLanguage: "zh-Hans", dateModified: geographyModifiedDate, publisher: { "@id": organizationId },
        mainEntity: { "@type": "ItemList", numberOfItems: geographyPlaces.length, itemListElement: geographyPlaces.map((place, index) => ({ "@type": "ListItem", position: index + 1, name: place.name, url: localizedUrl("zh-Hans", `/places/${place.slug}`) })) },
      },
      breadcrumbJsonLd("zh-Hans", [{ name: "lunyu.ai", path: "" }, { name: "孔门地理", path: "/places" }]),
    ],
  };
  const entries = geographyPlaces.map((place) => {
    const connections = getPlaceConnections(place.slug);
    const people = [...new Set(connections.map((connection) => connection.personSlug))].flatMap((slug) => {
      const person = getBiography(slug);
      return person ? [person] : [];
    });
    const relations = [...new Set(connections.map((connection) => connection.relation))];
    return {
      slug: place.slug,
      kind: place.kind,
      searchText: [place.name, ...place.aliases, place.modernLocation, ...people.flatMap((person) => [person.name, person.courtesyName, ...person.aliases])].join(" "),
      card: (
        <Link href={geographyPath(place.slug)} prefetch={false} className="geography-card group" aria-label={`${place.name}：${placeKindLabels[place.kind]}，查看地理档案`}>
          <PlaceVisual place={place} compact />
          <div className="geography-card-body">
            <p className="mb-3 text-sm text-ink-soft">{placeKindLabels[place.kind]}{people.length > 0 ? ` · 关联 ${people.length} 位人物` : ""}</p>
            <h3 className="font-cjk text-2xl leading-9 transition-colors group-hover:text-cinnabar">{place.name}<span className="geography-card-arrow" aria-hidden="true">→</span></h3>
            {place.aliases.length > 0 && <p className="mt-2 text-sm leading-7 text-ink-soft">{place.aliases.join(" · ")}</p>}
            <p className="mt-3 text-base leading-8 text-ink-soft">{place.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">{relations.map((relation) => <span key={relation} className="geography-badge" data-relation={relation}>{placeRelationLabels[relation]}</span>)}</div>
            <p className="mt-auto pt-5 text-sm leading-7 text-ink-soft"><span className="text-ink">今址参照</span> · {place.modernLocation}</p>
          </div>
        </Link>
      ),
    };
  });

  return (
    <>
      <a className="geography-skip sr-only focus:not-sr-only focus:block focus:p-4" href="#main">跳至正文</a>
      <SiteHeader locale="zh-Hans" path="/places" availableLocales={["zh-Hans"]} />
      <main id="main" className="page-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <section className="geography-hero geography-atlas-hero border-b border-rule" aria-labelledby="page-heading">
          <div className="geography-hero-copy" data-geography-reveal>
            <p className="geography-hero-kicker label mb-5">孔子与弟子 · 地理志</p>
            <h1 id="page-heading" className="geography-hero-heading font-cjk">孔门地理<span className="block text-ink-soft">山川、城邑与邦国</span></h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-ink-soft sm:text-lg">人在哪里生活，在哪里求学，又在何处与世界相遇？从人物生平回到具体地点，连起《论语》里的名字与山川。</p>
            <p className="mt-4 text-sm leading-7 text-ink-soft">逐一核对 {biographyProfiles.length} 位在册人物，整理 {geographyPlaces.length} 个地理条目。活动、籍贯、文献提及与志愿计划，分别标明。</p>
            <div className="mt-7 flex flex-wrap gap-3"><a href="#directory" className="ui-button ui-button-primary">查找地点 ↓</a><Link href={biographyPath()} className="ui-button">从人物开始 →</Link></div>
            <div className="geography-hero-tools"><GeographyMotionToggle /><span>转动图册，点选一个地点</span></div>
          </div>
          <GeographyMap places={geographyPlaces} />
        </section>

        <GeographyExplorer entries={entries} />

        <section id="geography-method" className="geography-section border-t border-rule" aria-labelledby="method-heading">
          <p className="label mb-3">先有记载，再落地名</p>
          <h2 id="method-heading" className="font-cjk text-3xl" data-geography-reveal>地名相同，关系未必相同</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft">本专题从<Link href={biographyPath()} className="underline underline-offset-4">人物年表</Link>逐条核对地理概念。邦国、城邑、山川、地域与具体场所各自建档；同一地点保留异名，古今范围与争议分别说明。</p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">收录范围包括全部在册人物的传记，以及《论语》《史记》中与他们直接相关的具名地理记载。诸夏、夷狄等文化地域用语按古代文献语境解释，不画作固定国界，也不直接对应现代民族；“天下”“四海”等泛称与书名中的地名不据字面生成活动地点。</p>
          <dl className="mt-7 grid gap-6 sm:grid-cols-2">
            {Object.entries(placeRelationDescriptions).map(([relation, explanation]) => <div key={relation} className="border-l border-rule pl-5"><dt><span className="geography-badge" data-relation={relation}>{placeRelationLabels[relation as keyof typeof placeRelationLabels]}</span></dt><dd className="mt-3 text-base leading-8 text-ink-soft">{explanation}</dd></div>)}
          </dl>
          <div className="mt-8 border-l-2 border-cinnabar bg-surface px-5 py-5 sm:px-6"><h3 className="font-cjk text-xl">图像与地图怎样阅读</h3><p className="mt-3 text-base leading-8 text-ink-soft">照片展示今天的地貌、遗址或纪念建筑，不能直接还原春秋时的景象。缺少可靠照片时使用明确标注的地理示意图。图上的位置用于辨认大致方位，不表示古代疆界，也不连成未经史料支持的旅行路线。地望有争议或范围不明时保留说明，不强行标点。</p></div>
        </section>

        <section id="person-coverage" className="geography-section border-t border-rule" aria-labelledby="coverage-heading">
          <p className="label mb-3">全部人物，逐人核对</p><h2 id="coverage-heading" className="font-cjk text-3xl">有记载的地点，与史料的留白</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft">名录沿用本站的孔子与《史记·仲尼弟子列传》具名弟子。{documented.length} 位人物已有关联的活动、籍贯或志愿计划条目；其余人物的地理信息不足，或仅有间接提及。没有可靠地点时，不以同学关系、姓氏或后世传说补写行迹。</p>
          <details className="mt-6 border-y border-rule px-1 py-3">
            <summary className="min-h-11 cursor-pointer py-2 font-cjk text-lg">查看地理信息尚有限的人物 · {unresolved.length} 人</summary>
            <ul className="geography-coverage mt-3">{unresolved.map((entry) => {
              const person = getBiography(entry.personSlug);
              return person ? <li key={entry.personSlug} className="geography-coverage-row"><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><Link href={biographyPath(person.slug)} className="inline-flex min-h-11 items-center font-cjk text-lg underline decoration-rule underline-offset-4">{person.name}{person.courtesyName ? `（${person.courtesyName}）` : ""} →</Link><span className="text-sm text-ink-soft">{entry.status === "unlocated" ? "尚无可靠地望" : "仅有文献提及"}</span></div><p className="text-sm leading-7 text-ink-soft">{entry.reason}</p></li> : null;
            })}</ul>
          </details>
        </section>

        <section id="sources" className="geography-section geography-sources border-t border-rule" aria-labelledby="sources-heading">
          <p className="label mb-3">可追溯的阅读</p><h2 id="sources-heading" className="font-cjk text-3xl">史料与地望依据</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">古代文献用于核对人物与地点的关系，地理及机构资料用于解释今址。具体卷、篇与章句随每条记载提供；图片来源与许可在各地点页面独立标注。</p>
          <ol className="mt-6 grid gap-x-8 sm:grid-cols-2">{usedSources.map((source) => <li key={source.id} id={`source-${source.id}`} className="min-w-0 border-b border-rule py-5"><p className="text-sm text-ink-soft">{source.kind === "primary" ? "原典" : source.kind === "academic" ? "学术研究" : "机构资料"}</p><a href={source.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center font-cjk text-lg underline decoration-rule underline-offset-4">{source.title} ↗<span className="sr-only">（新标签页）</span></a><p className="mt-2 text-sm leading-7 text-ink-soft">{source.note}</p></li>)}</ol>
          <p className="mt-6 text-sm leading-7 text-ink-soft">资料核对：{geographyModifiedDate} · 发现古今地名、人物关联或引文需要订正，可<Link href="/zh-Hans/method#corrections" className="underline underline-offset-4">提供具体页面与文献依据</Link>。</p>
        </section>
      </main>
      <SiteFooter locale="zh-Hans" />
    </>
  );
}
