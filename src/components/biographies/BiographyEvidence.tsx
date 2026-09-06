import type { PortraitRecord, WorksRecord } from "@/lib/biography-evidence-types";
import type { BiographySource } from "@/lib/biography-types";
import { CitationList } from "./BiographyTimeline";
import { PortraitImage } from "./PortraitImage";

export function BiographyPortrait({ portrait, name }: { portrait: PortraitRecord; name: string }) {
  const image = portrait.image;
  return (
    <section id="portrait" className="biography-portrait scroll-mt-6" aria-labelledby="portrait-heading">
      <h2 id="portrait-heading" className="label mb-4">肖像与图像依据</h2>
      {image ? (
        <figure>
          <div className="biography-portrait-frame"><PortraitImage image={image} name={name} /></div>
          <figcaption className="mt-4 text-sm leading-7 text-ink-soft">
            <p className="font-medium text-ink">后世画像 · 非生前写真</p>
            <p className="mt-2">{image.title}</p>
            <p>{image.artist} · {image.dateLabel}</p>
            <p>{image.collection}</p>
            <details className="mt-2">
              <summary className="min-h-11 cursor-pointer py-2 underline decoration-rule underline-offset-4">人物识别、来源与使用许可</summary>
              <div className="space-y-3 border-l border-rule pl-4">
                <p>{image.identityNote}</p>
                <p>{portrait.summary}</p>
                {image.credit && <p>{image.credit}</p>}
                {image.catalogUrl && <a className="block min-h-11 py-2 underline underline-offset-4" href={image.catalogUrl} target="_blank" rel="noreferrer">故宫馆藏条目 ↗</a>}
                <a className="block min-h-11 py-2 underline underline-offset-4" href={image.sourceUrl} target="_blank" rel="noreferrer">图像来源与许可记录 ↗</a>
                <a className="block min-h-11 py-2 underline underline-offset-4" href={image.licenseUrl} target="_blank" rel="noreferrer">使用许可：{image.licenseLabel} ↗</a>
              </div>
            </details>
          </figcaption>
        </figure>
      ) : (
        <div className="border-y border-rule py-7">
          <p className="font-cjk text-2xl">肖像待考</p>
          <p className="mt-4 text-sm leading-8 text-ink-soft">{portrait.summary}</p>
          <p className="mt-4 text-sm leading-8 text-ink-soft">孔门人物生活在摄影术出现之前；这里的肖像核查针对后世绘画与刻像。尚未确认身份的图像暂不配用。</p>
        </div>
      )}
    </section>
  );
}

export function BiographyWorks({ record, sources }: { record: WorksRecord; sources: BiographySource[] }) {
  return (
    <section id="works" className="scroll-mt-6 pt-12" aria-labelledby="works-heading">
      <p className="label mb-3">文本与传承</p>
      <h2 id="works-heading" className="font-cjk text-3xl">著作与相关文献</h2>
      <p className="mt-5 text-base leading-9 text-ink-soft">{record.summary}</p>
      <div className="mt-4"><CitationList citations={record.citations} sources={sources} /></div>
      {record.works.length > 0 && (
        <ol className="mt-6 divide-y divide-rule border-y border-rule">
          {record.works.map((work) => (
            <li key={work.title} className="py-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <h3 className="font-cjk text-2xl leading-9">{work.title}</h3>
                <span className="text-sm text-cinnabar">{work.attributionLabel}</span>
              </div>
              <dl className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-sm leading-7 text-ink-soft">
                <div><dt className="inline">传存：</dt><dd className="inline">{work.statusLabel}</dd></div>
                <div><dt className="inline">文献年代：</dt><dd className="inline">{work.dateLabel}</dd></div>
              </dl>
              <p className="mt-4 text-base leading-9 text-ink-soft">{work.description}</p>
              <details className="mt-3">
                <summary className="min-h-11 w-fit cursor-pointer py-2 text-sm text-ink-soft underline decoration-rule underline-offset-4">归属依据 · {work.citations.length}</summary>
                <div className="border-l border-rule py-2 pl-4"><CitationList citations={work.citations} sources={sources} /></div>
              </details>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-5 text-sm leading-8 text-ink-soft">书名使用某人的名字，并不自动证明由他亲笔撰写。“未见可确认著作”限定于本次核对的资料，不等于断言此人一生未曾写作。</p>
    </section>
  );
}
