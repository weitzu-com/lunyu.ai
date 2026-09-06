import type { PortraitRecord, WorksRecord } from "@/lib/biography-evidence-types";
import type { BiographySource } from "@/lib/biography-types";
import { CitationList } from "./BiographyTimeline";
import { PortraitImage } from "./PortraitImage";

export function BiographyPortrait({ portrait, name }: { portrait: PortraitRecord; name: string }) {
  const image = portrait.image;
  return (
    <section id="portrait" className="biography-portrait" aria-labelledby="portrait-heading">
      <h2 id="portrait-heading" className="sr-only">肖像与图像依据</h2>
      {image ? (
        <figure>
          <div className="biography-portrait-frame">
            <PortraitImage image={image} name={name}>
              <p className="people-evidence-label">后世画像 · 非生前写真</p>
              <h3 className="font-cjk text-xl">{image.title}</h3>
              <dl className="people-portrait-metadata">
                <div><dt>作者</dt><dd>{image.artist}</dd></div>
                <div><dt>年代</dt><dd>{image.dateLabel}</dd></div>
                <div><dt>馆藏</dt><dd>{image.collection}</dd></div>
              </dl>
              <p>{image.identityNote}</p><p>{portrait.summary}</p>
              {image.credit && <p>{image.credit}</p>}
              <div className="people-source-links">
                {image.catalogUrl && <a href={image.catalogUrl} target="_blank" rel="noreferrer">故宫馆藏条目 ↗<span className="sr-only">（新标签页）</span></a>}
                <a href={image.sourceUrl} target="_blank" rel="noreferrer">图像来源与许可记录 ↗<span className="sr-only">（新标签页）</span></a>
                <a href={image.licenseUrl} target="_blank" rel="noreferrer">{image.licenseLabel} ↗<span className="sr-only">（新标签页）</span></a>
              </div>
            </PortraitImage>
          </div>
          <figcaption className="people-portrait-caption">
            <p>后世画像 · 非生前写真</p>
            <p className="people-portrait-collection">{image.collection}</p>
            <a href={image.sourceUrl} target="_blank" rel="noreferrer">图像来源 ↗<span className="sr-only">（新标签页）</span></a>
          </figcaption>
        </figure>
      ) : (
        <div className="people-portrait-unverified"><p className="font-cjk text-xl">肖像待考</p><p>{portrait.summary}</p></div>
      )}
    </section>
  );
}

export function BiographyWorks({ record, sources }: { record: WorksRecord; sources: BiographySource[] }) {
  return (
    <section id="works" className="people-reading-section" aria-labelledby="works-heading">
      <div className="people-section-heading"><div><p className="label">文本与传承</p><h2 id="works-heading">著作与相关文献</h2></div><span>{record.works.length > 0 ? `${record.works.length} 项相关文献` : "著作核查"}</span></div>
      <p className="people-prose">{record.summary}</p>
      <details className="people-citation-disclosure"><summary>本次核查依据 · {record.citations.length}</summary><CitationList citations={record.citations} sources={sources} /></details>
      {record.works.length > 0 && (
        <ol className="people-works-list">
          {record.works.map((work) => (
            <li key={work.title} className="people-work">
              <h3>{work.title}</h3>
              <p className="people-work-attribution">{work.attributionLabel}</p>
              <p className="people-work-status"><span>传存</span>{work.statusLabel}</p>
              <details className="people-work-details">
                <summary>阅读说明与归属依据 <span aria-hidden="true">＋</span></summary>
                <div><p className="people-work-date">文献年代：{work.dateLabel}</p><p className="people-prose">{work.description}</p><CitationList citations={work.citations} sources={sources} /></div>
              </details>
            </li>
          ))}
        </ol>
      )}
      <p className="people-evidence-note">书名使用某人的名字，并不自动证明由他亲笔撰写。“未见可确认著作”限定于本次核对的资料，不等于断言此人一生未曾写作。</p>
    </section>
  );
}

export function BiographyReferences({ groups }: { groups: { title: string; description: string; sources: BiographySource[] }[] }) {
  return (
    <div className="people-reference-groups">
      {groups.filter((group) => group.sources.length > 0).map((group) => (
        <details key={group.title} className="people-reference-group">
          <summary><span>{group.title}</span><span>{group.sources.length} 项 <span aria-hidden="true">＋</span></span></summary>
          <div><p className="people-evidence-note">{group.description}</p><ol>{group.sources.map((source) => (
            <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗<span className="sr-only">（新标签页）</span></a><p>{source.note}</p></li>
          ))}</ol></div>
        </details>
      ))}
    </div>
  );
}
