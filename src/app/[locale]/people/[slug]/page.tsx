import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BiographyPortrait, BiographyWorks, BiographyReferences } from "@/components/biographies/BiographyEvidence";
import { getBiographyEvidence, portraitSources, worksSources } from "@/lib/biography-evidence";
import { BiographyTimeline, CitationList, ChronologyMethod } from "@/components/biographies/BiographyTimeline";
import { biographyModifiedDate, biographyProfiles, biographySources, getBiography } from "@/lib/biographies";
import { biographyPath } from "@/lib/biography-utils";
import { breadcrumbJsonLd, jsonLd, localizedUrl, organizationId } from "@/lib/site";
import { openGraph, twitterCard } from "@/lib/seo";
import { blogEntities } from "@/lib/blogs";
import { BiographyNavigation } from "@/components/biographies/BiographyNavigation";
import { PersonGeography } from "@/components/geography/PersonGeography";
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
  const description = `${profile.summary}${profile.lifespan}。附按年生平、后世肖像出处、著作与文献归属核查。`;
  return { title, description, alternates: { canonical: url, languages: { "zh-Hans": url, "x-default": url } }, openGraph: openGraph("zh-Hans", path, title, description), twitter: twitterCard("zh-Hans", path, title, description) };
}

export default async function BiographyPage({ params }: Props) {
  const { locale, slug } = await params;
  const profile = getBiography(slug);
  if (locale !== "zh-Hans" || !profile) notFound();
  const url = localizedUrl("zh-Hans", `/people/${slug}`);
  const { portrait, writings } = getBiographyEvidence(slug);
  const evidenceSources = [...biographySources, ...worksSources, ...portraitSources];
  const dated = profile.events.filter((event) => event.year !== null);
  const undated = profile.events.filter((event) => event.year === null);
  const usedSourceIds = new Set([...profile.citations, ...profile.events.flatMap((event) => event.citations), ...writings.citations, ...writings.works.flatMap((work) => work.citations)].map((citation) => citation.sourceId));
  for (const source of portraitSources) usedSourceIds.add(source.id);
  const usedSources = evidenceSources.filter((source) => usedSourceIds.has(source.id));
  const passageIndex = blogEntities.find((entity) => entity.category === "person" && (entity.zhName === profile.name || profile.aliases.includes(entity.zhName)));
  const biographySourceIds = new Set([...profile.citations, ...profile.events.flatMap((event) => event.citations)].map((citation) => citation.sourceId));
  const writingSourceIds = new Set([...writings.citations, ...writings.works.flatMap((work) => work.citations)].map((citation) => citation.sourceId));
  const referenceGroups = [
    { title: "生平与纪年", description: "人物身份与生平事迹的参考资料；具体卷、篇与年份见各条记录。", sources: biographySources.filter((source) => biographySourceIds.has(source.id)) },
    { title: "著作与传承", description: "用于区分传统归属、后人整理与伪托；目录著录不自动等于本人亲笔。", sources: worksSources.filter((source) => writingSourceIds.has(source.id)) },
    { title: "肖像与图像", description: "用于识别后世画册所绘人物、确认图像出处与使用许可。", sources: portraitSources },
  ];
  const profileIndex = biographyProfiles.findIndex((person) => person.slug === slug);
  const previous = biographyProfiles[profileIndex - 1];
  const next = biographyProfiles[profileIndex + 1];
  const sections = [{ id: "profile-overview", label: "概览" }, { id: "biography", label: "简介" }, { id: dated.length ? "timeline" : "undated", label: dated.length ? "生平" : "记载" }, { id: "works", label: "文献" }, { id: "geography", label: "地理" }, { id: "references", label: "资料" }];
  const schema = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "ProfilePage", "@id": `${url}#webpage`, url, name: `${profile.name}人物简介与生平年表`, description: profile.summary, inLanguage: "zh-Hans", dateModified: biographyModifiedDate, publisher: { "@id": organizationId }, mainEntity: { "@type": "Person", "@id": `${url}#person`, name: profile.name, alternateName: [...new Set([profile.courtesyName, ...profile.aliases].filter(Boolean))], description: profile.summary, url, ...(portrait.image ? { image: { "@type": "ImageObject", contentUrl: new URL(portrait.image.assetPath, url).href, caption: `${portrait.image.title}，后世画像，非生前写真`, creditText: portrait.image.collection, license: portrait.image.licenseUrl, acquireLicensePage: portrait.image.sourceUrl } } : {}) }, citation: usedSources.map((source) => ({ "@type": "CreativeWork", name: source.title, url: source.url })) },
      breadcrumbJsonLd("zh-Hans", [{ name: "lunyu.ai", path: "" }, { name: "人物年表", path: "/people" }, { name: profile.name, path: `/people/${slug}` }]),
    ],
  };
  return (
    <>
      <a className="biography-skip sr-only focus:not-sr-only focus:block focus:p-4" href="#main">跳至正文</a>
      <SiteHeader locale="zh-Hans" path={`/people/${slug}`} availableLocales={["zh-Hans"]} />
      <main id="main" className="page-shell people-profile">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <nav className="people-breadcrumb" aria-label="面包屑"><Link href={`${biographyPath()}#directory`}>← 人物名录</Link><span aria-hidden="true">/</span><span>{profile.name}</span></nav>
        <BiographyNavigation name={profile.name} sections={sections} />
        <section id="profile-overview" className="people-profile-hero" aria-labelledby="profile-name">
          <div className="people-identity">
            <p className="label">孔门人物志 · {profile.group}</p>
            <h1 id="profile-name">{profile.name}</h1>
            <p className="people-courtesy">{profile.courtesyName ? `字${profile.courtesyName}` : "字未详"}</p>
            {profile.aliases.length > 0 && <p className="people-aliases">{profile.aliases.join("、")}</p>}
          </div>
          <BiographyPortrait portrait={portrait} name={profile.name} />
          <p className="people-profile-summary">{profile.summary}</p>
          <dl className="people-profile-facts">
            <div><dt>生卒</dt><dd>{profile.lifespan}</dd></div>
            <div><dt>籍贯</dt><dd>{profile.origin}</dd></div>
            <div><dt>身份</dt><dd>{profile.role === "teacher" ? "思想家、教育者，孔门之师" : "《史记·仲尼弟子列传》所列弟子"}</dd></div>
          </dl>
          <div className="people-profile-actions">
            <a className="ui-button ui-button-primary" href={dated.length ? "#timeline" : "#undated"}>{dated.length ? "阅读生平年表" : "阅读现存记载"} ↓</a>
            {passageIndex && <Link className="people-text-link" href={`/zh-Hans/index/${passageIndex.slug}`}>在《论语》中读{profile.name} ↗</Link>}
          </div>
        </section>
        <div className="people-reading-layout">
          <section id="biography" className="people-reading-section" aria-labelledby="biography-heading">
            <div className="people-section-heading"><div><p className="label">认识{profile.name}</p><h2 id="biography-heading">人物简介</h2></div></div>
            <div className="people-prose people-biography-text">{profile.biography.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            <details className="people-citation-disclosure"><summary>简介依据 · {profile.citations.length}</summary><CitationList citations={profile.citations} sources={biographySources} /></details>
          </section>
          {dated.length > 0 && <section id="timeline" className="people-reading-section" aria-labelledby="timeline-heading">
            <div className="people-section-heading"><div><p className="label">沿着年份阅读</p><h2 id="timeline-heading">生平年表</h2></div><span>{dated.length} 项纪年事件</span></div>
            <div className="people-section-context"><p>公元前 · 由早至晚。约年与异说在每条记录中标明。</p><a href="#chronology-method">纪年说明 ↓</a>{undated.length > 0 && <a href="#undated">未定年记载 · {undated.length} ↓</a>}</div>
            <BiographyTimeline events={dated} sources={biographySources} linkable />
          </section>}
          {undated.length > 0 && <section id="undated" className="people-reading-section" aria-labelledby="undated-heading">
            {!dated.length && <span id="timeline" className="people-anchor-alias" aria-hidden="true" />}
            <div className="people-section-heading"><div><p className="label">史料留下的线索</p><h2 id="undated-heading">{dated.length ? "未定年记载" : "现存记载"}</h2></div><span>{undated.length} 项文献记载</span></div>
            <p className="people-section-intro">{dated.length ? "有文献依据，但不能可靠放入某一公元前年份；以下顺序不代表事件先后。" : `现有参考文献不足以为${profile.name}建立可靠的逐年生平。这里保留可核对的记载，不以推测补全年份。`}</p>
            <BiographyTimeline events={undated} sources={biographySources} />
          </section>}
          <BiographyWorks record={writings} sources={evidenceSources} />
          <PersonGeography personSlug={slug} />
          <section id="references" className="people-reading-section" aria-labelledby="references-heading">
            <div className="people-section-heading"><div><p className="label">循出处查证</p><h2 id="references-heading">史料与参考</h2></div><span>{usedSources.length} 项引用条目</span></div>
            <p className="people-section-intro">按生平、著作与图像分组。展开可查看资料说明与原始链接。</p>
            <BiographyReferences groups={referenceGroups} />
            <p className="people-reviewed">资料核对：{biographyModifiedDate} · <Link href="/zh-Hans/method#corrections">提供订正依据 ↗</Link></p>
          </section>
          <ChronologyMethod />
        </div>
        <section className="people-continue" aria-labelledby="continue-heading">
          <div className="people-continue-heading"><h2 id="continue-heading">继续认识孔门人物</h2><Link href={`${biographyPath()}#directory`}>查看全部 {biographyProfiles.length} 位人物 →</Link></div>
          <nav className="people-adjacent" aria-label="按人物名录顺序继续阅读">
            {previous && <Link href={biographyPath(previous.slug)} prefetch={false}><span>← 名录上一位</span><strong>{previous.name}</strong><span>{previous.courtesyName ? `字${previous.courtesyName}` : previous.group}</span></Link>}
            {next && <Link href={biographyPath(next.slug)} prefetch={false}><span>名录下一位 →</span><strong>{next.name}</strong><span>{next.courtesyName ? `字${next.courtesyName}` : next.group}</span></Link>}
          </nav>
        </section>
      </main>
      <SiteFooter locale="zh-Hans" />
    </>
  );
}
