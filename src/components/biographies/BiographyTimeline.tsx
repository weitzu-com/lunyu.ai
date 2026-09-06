import Link from "next/link";
import type { BiographySource, Citation, TimelineEvent } from "@/lib/biography-types";
import { certaintyLabels, eventAnchor } from "@/lib/biography-utils";

export function CitationList({ citations, sources }: { citations: Citation[]; sources: BiographySource[] }) {
  return (
    <ul className="people-citation-list">
      {citations.map((citation, index) => {
        const source = sources.find((item) => item.id === citation.sourceId);
        return source ? (
          <li key={`${citation.sourceId}-${index}`}>
            <a className="underline decoration-rule underline-offset-4 hover:decoration-ink" href={source.url} rel="noreferrer" target="_blank">
              {source.title} · {citation.locator}<span className="ml-1" aria-hidden="true">↗</span>
              <span className="sr-only">（在新标签页查看史料）</span>
            </a>
          </li>
        ) : null;
      })}
    </ul>
  );
}

export function BiographyTimeline({ events, sources, linkable = false }: { events: (TimelineEvent & { personLink?: { href: string; name: string } })[]; sources: BiographySource[]; linkable?: boolean }) {
  return (
    <ol className="biography-timeline">
      {events.map((event, index) => (
        <li key={`${event.title}-${index}`} id={linkable ? eventAnchor(index) : undefined} className="biography-event">
          <div className="biography-event-date">
            <p className="font-cjk text-xl leading-8">{event.dateLabel}</p>
            <span className="people-certainty" data-certainty={event.certainty}>{certaintyLabels[event.certainty]}</span>
          </div>
          <div className="biography-event-body">
            {event.personLink && <Link className="people-event-person" href={event.personLink.href} prefetch={false}>{event.personLink.name}的人物档案 ↗</Link>}
            <h3 className="font-cjk text-xl leading-8">{event.title}</h3>
            <p className="mt-3 max-w-3xl text-base leading-8 text-ink-soft">{event.description}</p>
            <details className="people-citation-disclosure">
              <summary >史料出处 · {event.citations.length}</summary>
              <div className="border-l border-rule py-2 pl-4"><CitationList citations={event.citations} sources={sources} /></div>
            </details>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ChronologyMethod() {
  return (
    <details id="chronology-method" className="people-method border-y border-rule bg-surface px-5 py-4 sm:px-6">
      <summary className="min-h-11 cursor-pointer py-2 font-cjk text-lg">这份年表如何定年？</summary>
      <div className="mt-4 grid gap-6 text-sm leading-7 text-ink-soft sm:grid-cols-2">
        <p><strong className="font-medium text-ink">纪年记载</strong>：史书明确记下鲁国等诸侯的某公某年，再换算为公元前年份。这说明文献有纪年，并不等于所有细节都已被证实。</p>
        <p><strong className="font-medium text-ink">约年／推定</strong>：由相对年龄、事件先后或传统年谱推算。孔子生年通常取前551年；据年龄差推算的弟子生年会受此基准影响。</p>
        <p><strong className="font-medium text-ink">记载／年代有争议</strong>：不同文献或研究对年份、人物归属，乃至事件是否发生存在分歧。页面注明争议所在，不将某一种流行说法写成定论。</p>
        <p><strong className="font-medium text-ink">年代不详</strong>：文献留有事迹，却无法可靠系年；统一列在年表之后。没有记载的年份留白，不补写经历。</p>
      </div>
      <p className="mt-5 border-t border-rule pt-4 text-sm leading-7 text-ink-soft">本专题区分《论语》等早期文献、《史记》的后出叙事与现代研究。简介由本站依据所列文献整理；原典篇章定位随事件提供。人物名录以《史记·仲尼弟子列传》为范围，不等同于全部历史弟子，也不与后世“七十二贤”名录混同。</p>
    </details>
  );
}
