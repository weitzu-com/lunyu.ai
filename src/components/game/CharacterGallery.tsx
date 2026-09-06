"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GameCharacter } from "@/lib/game-characters";
import { trapDialogFocus } from "@/lib/game-dialog";
import { GameIcon } from "./GameIcon";

export function CharacterPortrait({ character, priority = false, original = false, className = "" }: { character: GameCharacter; priority?: boolean; original?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className={`game-portrait-unavailable ${className}`}><span>{character.name}</span><small>画像暂未加载</small></div> : <Image src={original ? character.originalAsset : character.cartoonAsset} alt={`${character.name} · ${original ? "后世原画像" : "依据后世画像再创作的3D卡通形象"}`} width={640} height={640} sizes={priority ? "(max-width: 639px) 90vw, 480px" : "(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 310px"} loading={priority ? undefined : "lazy"} priority={priority} onError={() => setFailed(true)} className={`game-character-portrait ${className}`} />;
}

export function CharacterGallery({ characters, initialSlug }: { characters: GameCharacter[]; initialSlug?: string | null }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("全部");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug ?? null);
  const groups = ["全部", "老师", "德行", "言语", "政事", "文学", "其他弟子"];
  const filtered = characters.filter((person) => (group === "全部" || person.group === group) && [person.name, person.courtesyName, ...person.aliases].join(" ").includes(query.trim()));
  const selected = characters.find((person) => person.slug === selectedSlug);
  const selectedIndex = selected ? characters.indexOf(selected) : 0;
  return <section className="game-collection game-character-gallery">
    <div className="game-gallery-heading"><div><p className="game-eyebrow">THE PEOPLE BEHIND THE WORDS</p><h1 tabIndex={-1}>见字，也见人。</h1><p className="game-collection-intro">孔子与 77 位弟子，各有面貌，各有所长。<br />从一个人的故事，走近一句话的来处。</p></div><div className="game-gallery-count"><strong>{characters.length}</strong><span>位孔门人物</span><small>3D 卡通画像 · 原画可对照</small></div></div>
    <div className="game-gallery-toolbar"><div className="game-character-filters" aria-label="人物分类">{groups.map((item) => <button key={item} aria-pressed={group === item} onClick={() => setGroup(item)}>{item}</button>)}</div><label className="game-character-search"><GameIcon name="search" size={18} /><span className="game-sr-only">搜索人物姓名、字或别称</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索姓名、字或别称" /></label></div>
    <p role="status" className="game-gallery-results">{query || group !== "全部" ? `找到 ${filtered.length} 位人物` : "轻点画像，认识一位同行者"}</p>
    {filtered.length ? <div className="game-character-grid">{filtered.map((person, index) => <button className="game-character-card" key={person.slug} onClick={() => setSelectedSlug(person.slug)} style={{ "--card-order": Math.min(index, 11) } as React.CSSProperties} aria-label={`认识${person.name}${person.courtesyName ? `，字${person.courtesyName}` : ""}`}><div className="game-character-frame"><CharacterPortrait character={person} /><span className="game-character-category">{person.group}</span><span className="game-character-enter"><GameIcon name="arrow" size={20} /></span></div><div className="game-character-card-info"><h2>{person.name}</h2><span>{person.courtesyName ? `字 ${person.courtesyName}` : person.role === "teacher" ? "万世师表" : "字未详"}</span></div><p>{person.summary}</p></button>)}</div> : <div className="game-empty"><GameIcon name="search" size={35} /><h2>暂时没有找到这位人物。</h2><p>试试他的姓名、字或别称，也可以清除分类重新查看。</p><button className="game-button" onClick={() => {setQuery("");setGroup("全部");}}>查看全部人物</button></div>}
    <p className="game-character-provenance">图像依据元代《至圣先贤半身像》再创作，表现后世想象中的人物形象；非真实容貌复原。<Link href="/zh-Hans/people">查看人物年表与完整来源 ↗</Link></p>
    {selected && <CharacterDialog character={selected} onClose={() => setSelectedSlug(null)} onPrevious={() => setSelectedSlug(characters[(selectedIndex - 1 + characters.length) % characters.length].slug)} onNext={() => setSelectedSlug(characters[(selectedIndex + 1) % characters.length].slug)} index={selectedIndex + 1} total={characters.length} />}
  </section>;
}

export function CharacterDialog({ character, onClose, onPrevious, onNext, index, total }: { character: GameCharacter; onClose: () => void; onPrevious: () => void; onNext: () => void; index: number; total: number }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [original, setOriginal] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; dialog?.close(); trigger?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className="game-character-dialog" aria-labelledby="character-dialog-name" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={(event) => { trapDialogFocus(event); if(event.key === "ArrowLeft") onPrevious(); if(event.key === "ArrowRight") onNext(); }}>
    <div className="game-character-dialog-inner"><button className="game-dialog-close" onClick={onClose} aria-label="关闭人物详情" autoFocus><GameIcon name="close" /></button><div className="game-dialog-portrait"><CharacterPortrait key={`${character.slug}-${original}`} character={character} original={original} priority /><div className="game-portrait-mode" role="group" aria-label="画像展示方式"><button aria-pressed={!original} onClick={() => setOriginal(false)}>3D 卡通</button><button aria-pressed={original} onClick={() => setOriginal(true)}>原画参考</button></div></div><div className="game-dialog-biography"><p className="game-eyebrow">{character.group} · 孔门人物</p><h2 id="character-dialog-name">{character.name}</h2><p className="game-dialog-courtesy">{character.courtesyName ? `字 ${character.courtesyName}` : "字未详"}{character.aliases.length > 0 && ` · 又称${character.aliases.join("、")}`}</p><p className="game-dialog-summary">{character.summary}</p><Link className="game-button game-button-primary" href={`/zh-Hans/people/${character.slug}`}>读他的故事<GameIcon name="arrow" size={17} /></Link><div className="game-dialog-source"><span>画像与史料</span><p>依据后世画像再创作的 3D 卡通形象，并非真实容貌。</p><a href={character.originalSource} target="_blank" rel="noreferrer">查看原画像出处 ↗</a></div><div className="game-dialog-pager"><button onClick={onPrevious} aria-label="上一位人物"><GameIcon name="back" /></button><span>{String(index).padStart(2,"0")} <i>/</i> {total}</span><button onClick={onNext} aria-label="下一位人物"><GameIcon name="arrow" /></button></div><button className="game-text-button game-dialog-dismiss" onClick={onClose}>收起人物详情</button></div></div>
  </dialog>;
}
