import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CitationList } from "@/components/biographies/BiographyTimeline";
import { GeographyMap } from "@/components/geography/GeographyMap";
import { PlaceVisual } from "@/components/geography/PlaceVisual";
import { GeographyMotionToggle } from "@/components/geography/GeographyMotion";
import { GeographyReadingNav } from "@/components/geography/GeographyReadingNav";
import { geographyPath, placeKindLabels, placeRelationDescriptions, placeRelationLabels } from "@/components/geography/geography-presentation";
import { biographyProfiles, getBiography } from "@/lib/biographies";
import { biographyPath, certaintyLabels, eventAnchor } from "@/lib/biography-utils";
import { blogEntities } from "@/lib/blogs";
import { geographyModifiedDate, geographyPlaces, geographySources, getGeographyPlace, getPlaceConnections } from "@/lib/geography";
import { getPlacePhoto, getPlaceVisual } from "@/lib/geography-visuals";
import { openGraph, twitterCard } from "@/lib/seo";
import { breadcrumbJsonLd, jsonLd, localizedUrl, organizationId } from "@/lib/site";
import "@/components/geography/geography.css";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() { return geographyPlaces.map((place) => ({ locale: "zh-Hans", slug: place.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const place = getGeographyPlace(slug);
  if (locale !== "zh-Hans" || !place) notFound();
  const title = `${place.name}：古今地望、图片与孔门人物记载`;
  const description = `${place.summary}了解${place.name}的古今地望、相关人物与史料依据，附图片或地理示意图及出处。`;
  const path = `/places/${slug}`;
  const url = localizedUrl("zh-Hans", path);
  const photo = getPlacePhoto(slug);
  return {
    title, description,
    alternates: { canonical: url, languages: { "zh-Hans": url, "x-default": url } },
    openGraph: { ...openGraph("zh-Hans", path, title, description), ...(photo ? { images: [{ url: new URL(photo.src, url).href, alt: photo.alt, width: photo.width, height: photo.height }] } : {}) },
    twitter: { ...twitterCard("zh-Hans", path, title, description), ...(photo ? { images: [{ url: new URL(photo.src, url).href, alt: photo.alt }] } : {}) },
  };
}

export default async function PlacePage({ params }: Props) {
  const { locale, slug } = await params;
  const place = getGeographyPlace(slug);
  if (locale !== "zh-Hans" || !place) notFound();
  const url = localizedUrl("zh-Hans", `/places/${slug}`);
  const connections = getPlaceConnections(slug);
  const personSlugs = new Set(connections.map((connection) => connection.personSlug));
  const people = biographyProfiles.filter((person) => personSlugs.has(person.slug));
  const parents = place.parentSlugs.flatMap((parentSlug) => {
    const parent = getGeographyPlace(parentSlug);
    return parent ? [parent] : [];
  });
  const children = geographyPlaces.filter((candidate) => candidate.parentSlugs.includes(slug));
  const usedSourceIds = new Set([...place.citations, ...connections.flatMap((connection) => connection.citations)].map((citation) => citation.sourceId));
  const usedSources = geographySources.filter((source) => usedSourceIds.has(source.id));
  const passageIndex = blogEntities.find((entity) => entity.category === "place" && [place.name, ...place.aliases].includes(entity.zhName));
  const visual = getPlaceVisual(place);
  const photo = getPlacePhoto(slug);
  // State, landscape and region coordinates describe representative positions,
  // not the entire historic entity, so they are deliberately excluded from geo.
  const hasPointLocation = (place.kind === "settlement" || place.kind === "site") && place.coordinates && !/争议|异说|未定|不详|无法|难以确定/.test(place.locationNote);
  const schema = {
    "@context": "https://schema.org", "@graph": [
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url, name: `${place.name} · 孔门地理`, description: place.summary,
        inLanguage: "zh-Hans", dateModified: geographyModifiedDate, publisher: { "@id": organizationId },
        mainEntity: {
          "@type": "Place", "@id": `${url}#place`, name: place.name, alternateName: place.aliases, url,
          description: `${place.summary} 今址参照：${place.modernLocation}。${place.locationNote}`,
          image: { "@type": "ImageObject", contentUrl: new URL(visual.src, url).href, caption: visual.caption, ...(photo ? { creditText: photo.creator, license: photo.licenseUrl, acquireLicensePage: photo.sourceUrl } : { creditText: "lunyu.ai · 地理示意图" }) },
          ...(hasPointLocation ? { geo: { "@type": "GeoCoordinates", latitude: place.coordinates!.latitude, longitude: place.coordinates!.longitude, description: "今址参照点，非古代遗址边界" } } : {}),
          ...(parents.length > 0 ? { containedInPlace: parents.map((parent) => ({ "@type": "Place", name: parent.name, url: localizedUrl("zh-Hans", `/places/${parent.slug}`) })) } : {}),
        },
        citation: usedSources.map((source) => ({ "@type": "CreativeWork", name: source.title, url: source.url })),
      },
      breadcrumbJsonLd("zh-Hans", [{ name: "lunyu.ai", path: "" }, { name: "孔门地理", path: "/places" }, { name: place.name, path: `/places/${slug}` }]),
    ],
  };

  return (
    <>
      <a className="geography-skip sr-only focus:not-sr-only focus:block focus:p-4" href="#main">跳至正文</a>
      <SiteHeader locale="zh-Hans" path={`/places/${slug}`} availableLocales={["zh-Hans"]} />
      <main id="main" className="page-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <div className="geography-breadcrumb-row"><nav className="flex flex-wrap items-center gap-x-3 text-sm text-ink-soft" aria-label="面包屑"><Link href={geographyPath()} className="inline-flex min-h-11 items-center hover:text-ink">← 孔门地理</Link><span aria-hidden="true">/</span><span aria-current="page">{place.name}</span></nav><GeographyMotionToggle /></div>

        <section className="geography-hero geography-detail-hero border-b border-rule" aria-labelledby="place-name">
          <div className="geography-hero-copy" data-geography-reveal>
            <p className="geography-hero-kicker label mb-5">孔门地理 · {placeKindLabels[place.kind]}</p>
            <h1 id="place-name" className="font-cjk text-5xl leading-tight tracking-wide sm:text-6xl">{place.name}</h1>
            {place.aliases.length > 0 && <p className="mt-4 font-cjk text-xl leading-9 text-ink-soft">{place.aliases.join(" · ")}</p>}
            <p className="mt-6 max-w-2xl text-lg leading-9">{place.summary}</p>
            <dl className="mt-7 border-y border-rule text-base leading-8">
              <div className="geography-fact"><dt className="text-ink-soft">地理类型</dt><dd>{placeKindLabels[place.kind]}</dd></div>
              <div className="geography-fact"><dt className="text-ink-soft">今址参照</dt><dd>{place.modernLocation}</dd></div>
              <div className="geography-fact"><dt className="text-ink-soft">相关人物</dt><dd>{people.length > 0 ? <a href="#people" className="inline-flex min-h-11 items-center underline decoration-rule underline-offset-4">{people.length} 位人物 · {connections.length} 条关联记载 ↓</a> : "本条目用于解释相关地域与地名"}</dd></div>
            </dl>
          </div>
          <div data-geography-reveal><PlaceVisual place={place} priority /></div>
        </section>

        <div className="geography-reading-layout">
          <aside className="geography-reading-sidebar">
            <GeographyReadingNav title={place.name} items={[
              { id: "about-place", label: `认识${place.name}` },
              { id: "location", label: "古今地望" },
              { id: "people", label: "人物与地点" },
              ...(parents.length > 0 || children.length > 0 ? [{ id: "related-places", label: "相关地理条目" }] : []),
              { id: "references", label: "史料与参考" },
            ]} />
            <div className="geography-sidebar-links">
            <Link href={`${geographyPath()}#geography-method`} className="mt-4 inline-flex min-h-11 items-center border-t border-rule pt-4 text-sm leading-7 underline underline-offset-4">地名与行迹怎样核对？</Link>
            {passageIndex && <Link href={`/zh-Hans/index/${passageIndex.slug}`} className="mt-3 inline-flex min-h-11 items-center text-sm leading-7 underline underline-offset-4">在《论语》原文中读{place.name} →</Link>}
            </div>
          </aside>

          <div className="geography-reading-content min-w-0">
            <section id="about-place" className="scroll-mt-6" aria-labelledby="about-heading">
              <h2 id="about-heading" className="font-cjk text-3xl" data-geography-reveal>认识{place.name}</h2>
              <div className="mt-6 space-y-5 text-base leading-9 text-ink-soft">{place.description.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
              <div className="mt-5"><CitationList citations={place.citations} sources={geographySources} /></div>
            </section>

            <section id="location" className="geography-section" aria-labelledby="location-heading">
              <h2 id="location-heading" className="font-cjk text-3xl" data-geography-reveal>古今地望</h2>
              <p className="mt-5 text-base leading-8"><span className="text-ink-soft">今址参照 · </span>{place.modernLocation}</p>
              <div className="mt-4 border-l-2 border-cinnabar bg-surface px-5 py-4"><p className="text-base leading-8 text-ink-soft">{place.locationNote}</p></div>
              <div className="mt-6"><GeographyMap places={geographyPlaces} selectedSlug={place.slug} /></div>
            </section>

            <section id="people" className="scroll-mt-6 border-t border-rule pt-10 sm:pt-12" aria-labelledby="people-heading">
              <div className="flex flex-wrap items-baseline gap-3"><h2 id="people-heading" className="font-cjk text-3xl">人物与地点</h2><span className="text-sm text-ink-soft">{people.length} 位人物 · {connections.length} 条记载</span></div>
              <p className="mt-4 text-base leading-8 text-ink-soft">按人物查阅与{place.name}的具体关系。籍贯、言论中的地名与志愿计划分别标记；文献记录不等于每一处古址均已确定。</p>
              <div className="geography-connections mt-8">
                {people.map((person) => (
                  <article key={person.slug} id={`person-${person.slug}`} className="scroll-mt-6 border-b border-rule pb-8" aria-labelledby={`person-heading-${person.slug}`} data-geography-reveal>
                    <h3 id={`person-heading-${person.slug}`} className="font-cjk text-2xl leading-9"><Link href={biographyPath(person.slug)} className="inline-flex min-h-11 items-center gap-2 underline decoration-rule underline-offset-4 hover:decoration-ink">{person.name}{person.courtesyName ? `（${person.courtesyName}）` : ""}<span className="text-lg" aria-hidden="true">→</span></Link></h3>
                    <div className="mt-5">
                      {connections.filter((connection) => connection.personSlug === person.slug).map((connection, index) => {
                        const profile = getBiography(connection.personSlug);
                        const datedIndex = profile?.events.filter((event) => event.year !== null).findIndex((event) => event.title === connection.eventTitle) ?? -1;
                        const hasUndatedEvent = profile?.events.some((event) => event.year === null && event.title === connection.eventTitle);
                        const eventHref = `${biographyPath(person.slug)}${datedIndex >= 0 ? `#${eventAnchor(datedIndex)}` : hasUndatedEvent ? "#undated" : "#biography"}`;
                        return (
                          <div key={`${connection.relation}-${connection.title}-${index}`} className="geography-connection">
                            <div className="flex flex-wrap gap-2"><span className="geography-badge" data-relation={connection.relation} title={placeRelationDescriptions[connection.relation]}>{placeRelationLabels[connection.relation]}</span>{connection.certainty && <span className="geography-badge">{certaintyLabels[connection.certainty]}</span>}{connection.evidence && <span className="geography-badge">{connection.evidence === "contextual" ? "上下文关联" : "文献明示"}</span>}</div>
                            <h4 className="mt-3 font-cjk text-xl leading-8">{connection.title}</h4>
                            <p className="mt-3 text-base leading-8 text-ink-soft">{connection.description}</p>
                            {(connection.relation === "mentioned" || connection.relation === "planned") && <p className="mt-3 text-sm leading-7 text-ink-soft">{connection.relation === "mentioned" ? "此条属于文献关联，不能据此认定人物曾到访。" : "此条属于意向、设想或中止的计划，不据此认定已经发生行程。"}</p>}
                            {connection.evidence === "contextual" && <p className="mt-3 text-sm leading-7 text-ink-soft">地点关系依据所引记载的上下文整理，请连同原文判断。</p>}
                            <div className="mt-4"><CitationList citations={connection.citations} sources={geographySources} /></div>
                            <Link href={eventHref} className="mt-3 inline-flex min-h-11 items-center text-sm underline decoration-rule underline-offset-4">{datedIndex >= 0 || hasUndatedEvent ? `回到人物年表：${connection.eventTitle}` : `阅读${person.name}的完整生平`} →</Link>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                ))}
                {people.length === 0 && <p className="border-l border-rule pl-5 text-base leading-8 text-ink-soft">本页作为相关地域的地理说明保留。具体人物关系请结合下方关联地点与所列文献阅读，不据地理包含关系推定到访。</p>}
              </div>
            </section>

            {(parents.length > 0 || children.length > 0) && <section id="related-places" className="geography-section" aria-labelledby="related-heading">
              <h2 id="related-heading" className="font-cjk text-3xl">相关地理条目</h2>
              <p className="mt-4 text-base leading-8 text-ink-soft">从地域读到城邑，从城邑读到具体场所。以下关系用于理解历史地理层次，不代表各时期的疆界或现代行政隶属。</p>
              {parents.length > 0 && <div className="mt-6"><h3 className="text-sm text-ink-soft">相关地域</h3><div className="geography-place-links mt-2">{parents.map((parent) => <Link key={parent.slug} href={geographyPath(parent.slug)} className="geography-related-link"><span className="font-cjk text-xl">{parent.name} →</span><span className="text-sm leading-7 text-ink-soft">{placeKindLabels[parent.kind]} · {parent.summary}</span></Link>)}</div></div>}
              {children.length > 0 && <div className="mt-6"><h3 className="text-sm text-ink-soft">这一地域中的地点</h3><div className="geography-place-links mt-2">{children.map((child) => <Link key={child.slug} href={geographyPath(child.slug)} className="geography-related-link"><span className="font-cjk text-xl">{child.name} →</span><span className="text-sm leading-7 text-ink-soft">{placeKindLabels[child.kind]} · {child.summary}</span></Link>)}</div></div>}
            </section>}

            <section id="references" className="geography-section geography-sources border-t border-rule" aria-labelledby="references-heading">
              <h2 id="references-heading" className="font-cjk text-3xl">史料与参考</h2>
              <ol className="mt-6 space-y-5">{usedSources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-cjk text-lg underline decoration-rule underline-offset-4">{source.title} ↗<span className="sr-only">（新标签页）</span></a><p className="text-sm leading-7 text-ink-soft">{source.note}</p></li>)}</ol>
              <p className="mt-7 text-sm leading-7 text-ink-soft">资料核对：{geographyModifiedDate} · <Link href="/zh-Hans/method#corrections" className="underline underline-offset-4">提供地名或人物关联的订正依据</Link></p>
            </section>
          </div>
        </div>

        <nav className="flex flex-wrap gap-3 border-t border-rule py-8" aria-label="继续阅读"><Link href={geographyPath()} className="ui-button">返回全部地理档案</Link><Link href={biographyPath()} className="ui-button">孔子与弟子生平年表 →</Link></nav>
      </main>
      <SiteFooter locale="zh-Hans" />
    </>
  );
}
