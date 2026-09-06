"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { GameCharacter } from "@/lib/game-characters";
import { trapDialogFocus } from "@/lib/game-dialog";
import { GameIcon } from "./GameIcon";
import "./game-gallery-polish.css";

const groups = ["全部", "老师", "德行", "言语", "政事", "文学", "其他弟子"];
const groupDescriptions: Record<string, string> = {
  全部: "按姓名、字或别称查找，也可以从孔门四科认识他们。",
  老师: "从孔子开始，认识这段旅程中的老师。",
  德行: "《论语》四科之一，着重于品德与修养。",
  言语: "《论语》四科之一，着重于言谈与应对。",
  政事: "《论语》四科之一，着重于处理政务。",
  文学: "《论语》四科之一，着重于典籍与学问。",
  其他弟子: "未列入四科的人物，同样各有值得认识的故事。",
};
const galleryFiltersKey = "lunyu-game-character-filters";
const galleryFiltersEvent = "lunyu-game-character-filters-change";
let filtersWithoutStorage = "";
function subscribeFilters(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(galleryFiltersEvent, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(galleryFiltersEvent, callback); };
}
function readFilters() {
  try { return sessionStorage.getItem(galleryFiltersKey) ?? filtersWithoutStorage; } catch { return filtersWithoutStorage; }
}
function parseFilters(snapshot: string): { query: string; group: string } {
  try {
    const value = JSON.parse(snapshot);
    return { query: typeof value.query === "string" ? value.query.slice(0, 80) : "", group: groups.includes(value.group) ? value.group : "全部" };
  } catch { return { query: "", group: "全部" }; }
}
function saveFilters(query: string, group: string) {
  filtersWithoutStorage = JSON.stringify({ query, group });
  try { sessionStorage.setItem(galleryFiltersKey, filtersWithoutStorage); } catch { /* Keep controls usable when browser storage is unavailable. */ }
  window.dispatchEvent(new Event(galleryFiltersEvent));
}

export function CharacterPortrait({ character, priority = false, original = false, className = "" }: { character: GameCharacter; priority?: boolean; original?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className={`game-portrait-unavailable ${className}`}><span>{character.name}</span><small>画像暂未加载</small></div> : <Image src={original ? character.originalAsset : character.cartoonAsset} alt={`${character.name} · ${original ? "后世原画像" : "依据后世画像再创作的3D卡通形象"}`} width={640} height={640} sizes={priority ? "(max-width: 639px) 90vw, 480px" : "(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 310px"} loading={priority ? undefined : "lazy"} priority={priority} onError={() => setFailed(true)} className={`game-character-portrait ${className}`} />;
}

export function CharacterGallery({ characters, initialSlug }: { characters: GameCharacter[]; initialSlug?: string | null }) {
  const { query, group } = parseFilters(useSyncExternalStore(subscribeFilters, readFilters, () => ""));
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug ?? null);
  const filtered = characters.filter((person) => (group === "全部" || person.group === group) && [person.name, person.courtesyName, ...person.aliases].join(" ").includes(query.trim()));
  const selected = characters.find((person) => person.slug === selectedSlug);
  const selectedIndex = filtered.findIndex((person) => person.slug === selectedSlug);
  // A direct character link may be outside a previously saved filter.
  const dialogCharacters = selectedIndex < 0 && selected ? [selected] : filtered;
  const dialogIndex = Math.max(0, selectedIndex);
  const previous = dialogCharacters[(dialogIndex - 1 + dialogCharacters.length) % dialogCharacters.length];
  const next = dialogCharacters[(dialogIndex + 1) % dialogCharacters.length];
  const hasFilters = Boolean(query.trim()) || group !== "全部";

  return <section className="game-collection game-character-gallery">
    <div className="game-gallery-heading"><div><p className="game-eyebrow">THE PEOPLE BEHIND THE WORDS</p><h1 tabIndex={-1}>见字，也见人。</h1><p className="game-collection-intro">孔子与 77 位弟子，各有面貌，各有所长。<br />从一个人的故事，走近一句话的来处。</p></div><div className="game-gallery-count"><strong>{characters.length}</strong><span>位孔门人物</span><small>3D 卡通画像 · 原画可对照</small></div></div>
    <div className="game-gallery-toolbar">
      <div className="game-gallery-search-row">
        <div className="game-character-search"><GameIcon name="search" size={18} /><label className="game-sr-only" htmlFor="game-character-search">搜索人物姓名、字或别称</label><input ref={searchRef} id="game-character-search" type="search" value={query} maxLength={80} onChange={(event) => saveFilters(event.target.value, group)} placeholder="找一个人，如：颜回、子路" autoComplete="off" aria-describedby="game-gallery-description" />{query && <button className="game-character-search-clear" onClick={() => { saveFilters("", group); searchRef.current?.focus(); }} aria-label="清空人物搜索"><GameIcon name="close" size={17} /></button>}</div>
        <span className="game-gallery-search-hint">姓名、字、别称，都可以找到他</span>
      </div>
      <div className="game-character-filters" role="group" aria-label="人物分类">{groups.map((item) => { const count = item === "全部" ? characters.length : characters.filter((person) => person.group === item).length; return <button key={item} aria-pressed={group === item} onClick={() => saveFilters(query, item)}><span>{item}</span><span className="game-filter-count">{count}</span></button>; })}</div>
    </div>
    <div className="game-gallery-result-row"><div><p id="game-gallery-description" className="game-gallery-description">{groupDescriptions[group]}</p><p role="status" aria-live="polite" className="game-gallery-results">{hasFilters ? `${query.trim() ? `“${query.trim()}” · ` : ""}${group === "全部" ? "全部人物" : group} · 找到 ${filtered.length} 位` : `共 ${characters.length} 位人物 · 轻点画像查看故事与原画`}</p></div>{hasFilters && <button className="game-gallery-reset" onClick={() => saveFilters("", "全部")}>重置筛选<GameIcon name="close" size={14} /></button>}</div>
    {filtered.length ? <div className="game-character-grid">{filtered.map((person, index) => <button className="game-character-card" key={person.slug} onClick={() => setSelectedSlug(person.slug)} style={{ "--card-order": Math.min(index, 11) } as React.CSSProperties} aria-label={`认识${person.name}${person.courtesyName ? `，字${person.courtesyName}` : ""}`}><div className="game-character-frame"><CharacterPortrait character={person} /><span className="game-character-category">{person.group}</span><span className="game-character-enter"><GameIcon name="arrow" size={20} /></span></div><div className="game-character-card-info"><h2>{person.name}</h2><span>{person.courtesyName ? `字 ${person.courtesyName}` : person.role === "teacher" ? "万世师表" : "字未详"}</span></div><p>{person.summary}</p></button>)}</div> : <div className="game-empty"><GameIcon name="search" size={35} /><h2>暂时没有找到这位人物。</h2><p>试试他的姓名、字或别称，也可以清除分类重新查看。</p><button className="game-button" onClick={() => {saveFilters("", "全部");searchRef.current?.focus();}}>查看全部人物</button></div>}
    <p className="game-character-provenance">图像依据元代《至圣先贤半身像》再创作，表现后世想象中的人物形象；非真实容貌复原。<Link href="/zh-Hans/people" target="_blank" rel="noopener noreferrer">查看人物年表与完整来源（新标签页）↗</Link></p>
    {selected && <CharacterDialog character={selected} onClose={() => setSelectedSlug(null)} onPrevious={() => previous && setSelectedSlug(previous.slug)} onNext={() => next && setSelectedSlug(next.slug)} previousName={previous?.name} nextName={next?.name} navigationLabel={hasFilters ? `${group === "全部" ? "搜索" : group}结果` : "全部人物"} index={dialogIndex + 1} total={dialogCharacters.length} />}
  </section>;
}

export function CharacterDialog({ character, onClose, onPrevious, onNext, previousName, nextName, navigationLabel = "孔门人物", index, total }: { character: GameCharacter; onClose: () => void; onPrevious: () => void; onNext: () => void; previousName?: string; nextName?: string; navigationLabel?: string; index: number; total: number }) {
  const ref = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [original, setOriginal] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; dialog?.close(); trigger?.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [character.slug]);

  return <dialog ref={ref} className="game-character-dialog" aria-labelledby="character-dialog-name" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={(event) => { trapDialogFocus(event); if (total > 1 && event.key === "ArrowLeft") { event.preventDefault(); onPrevious(); } if (total > 1 && event.key === "ArrowRight") { event.preventDefault(); onNext(); } }}>
    <header className="game-dialog-header"><div className="game-dialog-identity"><p className="game-eyebrow">{character.group} · 孔门人物</p><h2 id="character-dialog-name">{character.name}<span>{character.courtesyName ? `字 ${character.courtesyName}` : character.role === "teacher" ? "万世师表" : "字未详"}</span></h2></div><button className="game-dialog-close" onClick={onClose} aria-label="关闭人物详情" autoFocus><GameIcon name="close" size={18} /><span>关闭</span></button></header>
    <div ref={contentRef} className="game-character-dialog-inner">
      <div className="game-dialog-introduction" aria-live="polite" aria-atomic="true"><p className="game-sr-only">{character.name}</p>{character.aliases.length > 0 && <p className="game-dialog-courtesy">又称{character.aliases.join("、")}</p>}<p className="game-dialog-summary">{character.summary}</p></div>
      <div className="game-dialog-portrait"><CharacterPortrait key={`${character.slug}-${original}`} character={character} original={original} priority /><div className="game-portrait-mode" role="group" aria-label="画像展示方式"><button aria-pressed={!original} onClick={() => setOriginal(false)}>3D 卡通</button><button aria-pressed={original} onClick={() => setOriginal(true)}>原画参考</button></div></div>
      <div className="game-dialog-biography"><Link className="game-button game-button-primary" href={`/zh-Hans/people/${character.slug}`} target="_blank" rel="noopener noreferrer">读他的故事<GameIcon name="arrow" size={17} /></Link><p className="game-dialog-link-hint">在新标签页打开，回来可继续这段旅程</p><div className="game-dialog-source"><span>画像与史料</span><p>依据后世画像再创作的 3D 卡通形象，并非真实容貌。</p><a href={character.originalSource} target="_blank" rel="noopener noreferrer">查看原画像出处 ↗</a></div></div>
    </div>
    <footer className="game-dialog-navigation">{total > 1 ? <><div className="game-dialog-pager"><button onClick={onPrevious} aria-label="上一位人物" title={previousName ? `上一位：${previousName}` : "上一位人物"}><GameIcon name="back" size={18} /><span><small>上一位</small><strong>{previousName ?? "人物"}</strong></span></button><span className="game-dialog-position"><strong>{index}</strong><i>/</i>{total}<small>{navigationLabel}</small></span><button onClick={onNext} aria-label="下一位人物" title={nextName ? `下一位：${nextName}` : "下一位人物"}><span><small>下一位</small><strong>{nextName ?? "人物"}</strong></span><GameIcon name="arrow" size={18} /></button></div></> : <p className="game-dialog-single">{navigationLabel} · 共 1 位人物</p>}</footer>
  </dialog>;
}
