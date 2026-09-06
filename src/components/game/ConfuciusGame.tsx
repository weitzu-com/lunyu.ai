"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gameChapters, virtueLabels, type GameChoice } from "@/data/confucius-game";
import { emptyProgress, gameStats, getProgressSnapshot, getServerProgressSnapshot, saveProgress, subscribeProgress, type GameProgress } from "@/lib/game-progress";
import { GameLandscape } from "./GameLandscape";
import { GameIcon } from "./GameIcon";
import { CharacterDialog, CharacterGallery, CharacterPortrait } from "./CharacterGallery";
import { AccountSaveIndicator, GameAccount } from "./GameAccount";
import type { GameCharacter } from "@/lib/game-characters";
import { chapterCharacterSlugs } from "@/lib/game-cast";
import { clearReadingPosition, readReadingPosition, writeReadingPosition, type ReadingPosition } from "@/lib/game-reading-position";
import "./game.css";
import "./game-v2.css";
import "./game-experience.css";

const motionKey = "lunyu-game-motion";
function subscribeMotion(callback: () => void) { window.addEventListener("storage", callback); window.addEventListener("lunyu-motion", callback); return () => { window.removeEventListener("storage", callback); window.removeEventListener("lunyu-motion", callback); }; }
function readMotion() { try { return localStorage.getItem(motionKey) !== "off"; } catch { return true; } }
function toggleMotion() { try { localStorage.setItem(motionKey, readMotion() ? "off" : "on"); } catch { /* The system preference still applies when storage is unavailable. */ } window.dispatchEvent(new Event("lunyu-motion")); }


type View = "map" | "story" | "journal" | "people" | "ending";
const numerals = ["一", "二", "三", "四", "五", "六", "七", "八"];
const chapterNames = ["少年志学", "问礼求知", "有教无类", "出仕于鲁", "周游列国", "弦歌不绝", "归鲁传道", "薪火相传"];
export function ConfuciusGame({ characters = [] }: { characters?: GameCharacter[] } = {}) {
  const motion = useSyncExternalStore(subscribeMotion, readMotion, () => false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const progress = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getServerProgressSnapshot);
  const [view, setView] = useState<View>("map");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [notice, setNotice] = useState("");
  const [savedLocally, setSavedLocally] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  const [chapterContextOpen, setChapterContextOpen] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const chapter = gameChapters[chapterIndex];
  const scene = chapter.scenes[sceneIndex];
  const selected = scene.choices.find((choice) => choice.id === progress.answers[scene.id]);
  const completed = gameChapters.filter((item) => item.scenes.every((story) => progress.answers[story.id])).length;
  const answered = Object.keys(progress.answers).length;
  const totalScenes = gameChapters.reduce((sum, item) => sum + item.scenes.length, 0);
  const stats = gameStats(progress);
  const current = gameChapters[Math.min(completed, gameChapters.length - 1)];
  const chapterFinished = chapter.scenes.every((item) => progress.answers[item.id]);
  const noteCount = Object.values(progress.reflections).filter((note) => note.trim()).length;
  const journeyFinished = answered === totalScenes && !readReadingPosition(progress);

  useEffect(() => {
    const restore = () => { clearReadingPosition(); setView("map"); setNotice("旅程进度已更新，可以继续启程。"); };
    window.addEventListener("lunyu-cloud-loaded", restore);
    return () => window.removeEventListener("lunyu-cloud-loaded", restore);
  }, []);
  const teacher = characters.find((person) => person.slug === "confucius");
  const cast = chapterCharacterSlugs[chapterIndex].flatMap((slug) => { const person = characters.find((item) => item.slug === slug); return person ? [person] : []; });
  function openCharacter(slug: string) { setSelectedCharacter(slug); }
  function persist(next: GameProgress) { setSavedLocally(saveProgress(next)); }
  function focusHeading(nextView = view) { requestAnimationFrame(() => { (heading.current ?? document.querySelector<HTMLElement>("#journey-main h1"))?.focus({ preventScroll: true }); if (nextView === "story") document.querySelector(".game-story-content")?.scrollIntoView({ block: "start", behavior: "instant" }); else window.scrollTo({ top: 0, behavior: "instant" }); }); }
  function navigate(next: View) { setView(next); setNotice(""); setConfirmReset(false); focusHeading(next); }
  function openReadingPosition(position: ReadingPosition) {
    setChapterIndex(position.chapterIndex); setSceneIndex(position.sceneIndex); setShowSummary(position.summary);
    setChapterContextOpen(false); setShowAlternatives(false);
    writeReadingPosition(position, progress); navigate("story");
  }
  function resumeJourney() {
    const bookmark = readReadingPosition(progress);
    if (bookmark) openReadingPosition(bookmark);
    else if (answered === totalScenes) navigate("ending");
    else enterChapter(Math.min(completed, 7));
  }
  function finishJourney() { clearReadingPosition(); navigate("ending"); }
  function enterChapter(index: number) {
    if (index > completed) { setNotice(`先完成第${numerals[completed]}章，再开启这段旅程。`); return; }
    const item = gameChapters[index];
    const firstUnanswered = item.scenes.findIndex((story) => !progress.answers[story.id]);
    setChapterIndex(index);
    setSceneIndex(Math.max(0, firstUnanswered));
    setShowSummary(false);
    setChapterContextOpen(false); setShowAlternatives(false);
    const next = { ...progress, lastChapter: index };
    persist(next);
    writeReadingPosition({ chapterIndex: index, sceneIndex: Math.max(0, firstUnanswered), summary: false }, next);
    navigate("story");
  }
  function choose(choice: GameChoice) {
    if (selected) return;
    const nextScene = gameChapters.flatMap((item) => item.scenes).find((item) => !progress.answers[item.id]);
    if (nextScene?.id !== scene.id) {
      navigate("map");
      setNotice("旅程已在另一个标签页更新，请从长卷继续。");
      return;
    }
    const next = { ...progress, answers: { ...progress.answers, [scene.id]: choice.id } };
    persist(next);
    writeReadingPosition({ chapterIndex, sceneIndex, summary: false }, next);
    requestAnimationFrame(() => {
      const feedback = document.getElementById("choice-feedback");
      feedback?.focus({ preventScroll: true });
      feedback?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  function continueStory() {
    const position = { chapterIndex, sceneIndex: Math.min(sceneIndex + 1, chapter.scenes.length - 1), summary: sceneIndex + 1 === chapter.scenes.length };
    openReadingPosition(position);
  }
  function exportJournal() {
    const entries = gameChapters.filter((item) => item.scenes.some((story) => progress.answers[story.id])).map((item) => {
      const choices = item.scenes.map((story) => {
        const choice = story.choices.find((option) => option.id === progress.answers[story.id]);
        return choice ? `### ${story.title}\n我的选择：${choice.label}\n\n${choice.consequence}\n\n学思：${choice.reflection}\n\n` : "";
      }).join("");
      return `## 第${numerals[item.number - 1]}章 · ${item.title}\n${item.year} · ${item.location}\n\n${choices}> ${item.quote.text}\n> ${item.quote.source}\n\n原文：${item.quote.url}\n\n我的手记：${progress.reflections[item.id] || "尚未写下"}\n\n`;
    }).join("---\n\n");
    const blob = new Blob([`# 与孔子同行 · 我的学思手记\n\n已走过 ${completed} / 8 章，完成 ${answered} / ${totalScenes} 次抉择。\n仁 ${stats.ren} · 智 ${stats.zhi} · 勇 ${stats.yong}（游戏思考倾向，并非品德评定）\n\n${entries}`], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "与孔子同行-学思手记.md"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("学思手记已导出。");
  }

  const navItems: { view: View; label: string; icon: string }[] = [{ view: "map", label: "人生长卷", icon: "mountain" }, { view: "people", label: "孔门人物", icon: "people" }, { view: "journal", label: "学思手记", icon: "book" }];

  return (
    <div className="confucius-game" data-motion={motion ? "on" : "off"} data-view={view}>
      <a className="game-skip" href="#journey-main">跳到游戏内容</a>
      <header className="game-header">
        <div className="game-header-inner">
          <button className="game-brand" onClick={() => navigate("map")} aria-label="与孔子同行，返回人生长卷">
            <span className="game-brand-seal">行</span><span><strong>与孔子同行</strong><small>A LIFE WITH CONFUCIUS</small></span>
          </button>
          <nav className="game-nav" aria-label="游戏导航">
            {navItems.map((item) => <button key={item.view} onClick={() => { setSelectedCharacter(null); navigate(item.view); }} aria-current={(view === item.view || (item.view === "map" && (view === "story" || view === "ending"))) ? "page" : undefined}><GameIcon name={item.icon} size={17} />{item.label}{item.view === "journal" && noteCount > 0 && <span className="game-count" aria-label={`${noteCount}篇感悟`}>{noteCount}</span>}</button>)}
          </nav>
          <div className="game-header-actions"><button className="game-motion-button" onClick={toggleMotion} aria-pressed={motion} aria-label={motion ? "关闭动态效果" : "开启动画效果"} title={motion ? "关闭动态效果" : "开启动画效果"}><GameIcon name={motion ? "motion" : "pause"} size={18} /></button><GameAccount /><Link href="/zh-Hans" className="game-library">论语书房 <GameIcon name="arrow" size={16} /></Link></div>
        </div>
      </header>
      <main id="journey-main" className="game-shell">
        <div className="game-context"><span><i /> 互动叙事 · 中文体验版</span>{savedLocally ? <AccountSaveIndicator /> : <span role="status">暂存于本页，请导出手记留存</span>}</div>
        <div role="status" className={notice ? "game-notice" : "game-sr-only"}>{notice}</div>
        {(view === "people" || view === "journal") && answered > 0 && <div className="game-return-bookmark"><span><GameIcon name="book" size={18} /><span>旅程还在这里<small>选择与手记会为你保留</small></span></span><button className="game-text-button" onClick={resumeJourney}>回到旅程<GameIcon name="arrow" size={17} /></button></div>}

        <div className="game-view-transition" key={`${view}-${chapterIndex}-${sceneIndex}-${showSummary}`} >
        {view === "map" && <>
          <section className="game-hero">
            <div className="game-hero-copy">
              <p className="game-eyebrow">公元前 551—479 年 · 一生的求索</p>
              <h1 ref={heading} tabIndex={-1}>走进春秋，<br />与孔子<span>同行。</span></h1>
              <p className="game-hero-description">如果身处他的境遇，你会如何选择？<br />从少年志学到暮年传道，在一个个故事里，<br className="game-desktop-break" />读懂《论语》，也重新认识自己。</p>
              <div className="game-hero-actions"><button className="game-button game-button-primary game-start" onClick={resumeJourney}>{journeyFinished ? "回看我的一生之旅" : answered ? "继续我的旅程" : "开启我的旅程"}<GameIcon name="arrow" /></button><button className="game-text-button game-explore-people" onClick={() => navigate("people")}>先认识孔门人物<span>78 位</span></button></div>
              {answered > 0 && answered < totalScenes && <p className="game-resume-detail"><GameIcon name="check" size={15} />已留下 {answered} 次选择 · 继续上次读到的地方</p>}
              <div className="game-hero-meta"><span><GameIcon name="time" size={15} />约 25 分钟</span><span>无需注册</span><span>随时继续</span></div>
            </div>
            <div className="game-hero-art" onPointerMove={(event) => { if (!motion || event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const bounds = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--portrait-turn", `${((event.clientX - bounds.left) / bounds.width - .5) * 9}deg`); event.currentTarget.style.setProperty("--portrait-lean", `${(.5 - (event.clientY - bounds.top) / bounds.height) * 7}deg`); }} onPointerLeave={(event) => {event.currentTarget.style.setProperty("--portrait-turn", "0deg");event.currentTarget.style.setProperty("--portrait-lean", "0deg");}}>
              <GameLandscape chapter={Math.min(completed, 7)} />
              <div className="game-atmosphere" aria-hidden="true"><i /><i /><i /><i /></div>
              {teacher && <button className="game-hero-character" onClick={() => openCharacter(teacher.slug)} aria-label="认识孔子，查看3D卡通画像与原画"><span className="game-hero-character-ring" /><CharacterPortrait character={teacher} priority /><span className="game-hero-character-label"><strong>孔子</strong><small>字仲尼 · 你的同行之师</small><GameIcon name="arrow" size={18} /></span></button>}
              <div className="game-hero-companions">{["yan-hui", "zhong-you", "duanmu-ci"].flatMap((slug) => { const person = characters.find((item) => item.slug === slug); return person ? [<button key={slug} onClick={() => openCharacter(slug)} aria-label={`认识${person.name}`}><CharacterPortrait character={person} /><span>{person.courtesyName || person.name}</span></button>] : []; })}</div>
              <div className="game-art-inscription" aria-hidden="true">有朋自远方来<br />不亦乐乎</div>
              <div className="game-art-place"><span className="game-map-dot" /><span><strong>{current.location}</strong><small>{current.year} · {current.age}</small></span></div>
              <div className="game-art-caption"><span>春秋行旅图</span><span>后世画像 · 3D 卡通再创作</span></div>
            </div>
          </section>
          <section className="game-path" aria-labelledby="path-title">
            <div className="game-section-heading"><div><p className="game-eyebrow">THE JOURNEY</p><h2 id="path-title">一生八章，步履不停。</h2></div><div className="game-progress-caption"><span>已走过 <strong>{completed}</strong> / 8 章</span><div className="game-progress-track"><span style={{ width: `${completed / 8 * 100}%` }} /></div></div></div>
            <div className="game-chapter-grid">{gameChapters.map((item, index) => {
              const done = index < completed; const active = index === Math.min(completed, 7); const locked = index > completed;
              return <button key={item.id} style={{ "--card-order": index } as React.CSSProperties} className={`game-chapter ${active ? "is-current" : ""} ${done ? "is-complete" : ""} ${locked ? "is-locked" : ""}`} aria-disabled={locked} onClick={() => enterChapter(index)}>
                <span className="game-chapter-top"><span>第{numerals[index]}章</span><GameIcon name={done ? "check" : locked ? "lock" : "compass"} size={16} /></span>
                <span className="game-chapter-symbol" aria-hidden="true">{["学", "礼", "教", "仕", "行", "困", "归", "传"][index]}</span>
                <strong>{chapterNames[index]}</strong><span className="game-chapter-age">{item.age}</span>
                <span className="game-chapter-status">{done ? "已完成 · 回看" : active ? item.scenes.some((story) => progress.answers[story.id]) ? "接着读下去" : "由此启程" : "随旅程解锁"}{active && <GameIcon name="arrow" size={14} />}</span>
              </button>;
            })}</div>
          </section>
          <section className="game-principles" aria-label="如何体验"><div><GameIcon name="compass" size={26} /><div><h3>在故事里，作出选择</h3><p>16 个真实困境的改编情境，体会每次抉择的得失。</p></div></div><div><GameIcon name="people" size={26} /><div><h3>与弟子一起，向学而行</h3><p>认识孔子与 77 位弟子，让每一句经典有面孔、有来处。</p></div></div><div><GameIcon name="book" size={26} /><div><h3>回到原文，留下自己的答案</h3><p>收集经典与感悟，让两千多年前的智慧走进今天。</p></div></div></section>
        </>}

        {view === "story" && <div className="game-story-layout">
          <aside className="game-story-sidebar" data-expanded={chapterContextOpen}>
            <button className="game-text-button" onClick={() => navigate("map")}><GameIcon name="back" size={17} />返回人生长卷</button>
            <button className="game-context-toggle" aria-expanded={chapterContextOpen} aria-controls="chapter-context-details" onClick={() => setChapterContextOpen(!chapterContextOpen)}><span><span>第{numerals[chapterIndex]}章 · {chapterNames[chapterIndex]}</span><small>{chapter.age} · {chapter.location}</small></span><span>{chapterContextOpen ? "收起背景" : "背景与人物"}<GameIcon name={chapterContextOpen ? "close" : "people"} size={16} /></span></button>
            <div className="game-chapter-context-details" id="chapter-context-details">
            <p className="game-eyebrow">第{numerals[chapterIndex]}章 / 共八章</p><h2>{chapterNames[chapterIndex]}</h2>
            <div className="game-story-landscape"><GameLandscape chapter={chapterIndex} compact /></div>
            <p className="game-sidebar-place"><GameIcon name="pin" size={16} />{chapter.location}</p><p className="game-sidebar-year">{chapter.year} · {chapter.age}</p>
            <p className="game-sidebar-summary">{chapter.summary}</p>
            <div className="game-story-cast"><p className="game-eyebrow">此章人物</p><div>{cast.map((person) => <button key={person.slug} onClick={() => openCharacter(person.slug)} aria-label={`了解${person.name}`}><CharacterPortrait character={person} /><span>{person.name}</span></button>)}</div><small>后世画像再创作，非特定年龄容貌</small></div>
            <div className="game-character-tags">{chapter.characters.map((person) => <span key={person}>{person}</span>)}</div>
            <div className="game-virtues"><h3>此行所得</h3>{(["ren", "zhi", "yong"] as const).map((key) => <div key={key}><span>{virtueLabels[key]}</span><div><i style={{ width: `${stats[key] / Math.max(1, answered * 3) * 100}%` }} /></div><strong>{stats[key]}</strong></div>)}<p>记录思考倾向，不评定品德高低。</p></div>
            </div>
          </aside>
          <section className="game-story-content">
            <div className="game-reading-header"><span>第{numerals[chapterIndex]}章 · {chapterNames[chapterIndex]}</span><span>{chapter.age}</span></div>
            <nav className="game-reading-steps" aria-label="本章阅读位置">{chapter.scenes.map((item, index) => <button key={item.id} aria-current={!showSummary && sceneIndex === index ? "step" : undefined} disabled={!progress.answers[item.id] && index !== chapter.scenes.findIndex((story) => !progress.answers[story.id])} onClick={() => openReadingPosition({chapterIndex, sceneIndex: index, summary: false})}><span>{String(index + 1).padStart(2, "0")}</span><strong>第{numerals[index]}幕</strong>{progress.answers[item.id] && <GameIcon name="check" size={13} />}</button>)}<button aria-current={showSummary ? "step" : undefined} disabled={!chapterFinished} onClick={() => openReadingPosition({chapterIndex, sceneIndex: chapter.scenes.length - 1, summary: true})}><GameIcon name="book" size={15} /><strong>章末感悟</strong></button></nav>
            {!showSummary ? <>
              <div className="game-scene-top"><p className="game-eyebrow">故事 {sceneIndex + 1} / {chapter.scenes.length} · {chapter.theme}</p><span className="game-adaptation">情境改编</span></div>
              <h1 ref={heading} tabIndex={-1}>{scene.title}</h1>
              <p className="game-narrative">{scene.narrative}</p>
              <div className="game-question"><span>此刻的你</span><h2>{scene.prompt}</h2></div>
              {selected && <p className="game-selected-caption"><GameIcon name="check" size={15} />你的选择已记录</p>}
              <div className={`game-choices ${selected ? "has-selection" : ""} ${showAlternatives ? "is-expanded" : ""}`} aria-label="作出你的选择">{scene.choices.map((choice, index) => <button key={choice.id} disabled={!!selected} className={`game-choice ${selected?.id === choice.id ? "is-selected" : ""}`} onClick={() => choose(choice)}><span className="game-choice-letter">{selected?.id === choice.id ? <GameIcon name="check" size={17} /> : ["甲", "乙", "丙"][index]}</span><span><strong>{choice.label}</strong><small>{choice.description}</small></span><GameIcon name="arrow" size={17} /></button>)}</div>
              {selected && <button className="game-text-button game-compare-choices" aria-expanded={showAlternatives} onClick={() => setShowAlternatives(!showAlternatives)}>{showAlternatives ? "收起其他选项" : "回看其他选项"}<span>选择已保存</span></button>}
              {selected ? <div className="game-feedback" id="choice-feedback" tabIndex={-1} role="region" aria-label="选择的回响">
                <p className="game-eyebrow"><GameIcon name="leaf" size={16} />选择的回响</p><p>{selected.consequence}</p><div className="game-reflection"><strong>再想一层</strong><p>{selected.reflection}</p></div>
                <details className="game-choice-source"><summary>这次思考的原典依据 · {selected.source.title}</summary><p>{selected.source.note}</p><a href={selected.source.url} target="_blank" rel="noreferrer">查阅原典 ↗</a></details>
                <div className="game-feedback-bottom"><div className="game-stat-tags">{(["ren", "zhi", "yong"] as const).filter((key) => selected.stats[key] > 0).map((key) => <span key={key}>{virtueLabels[key]} +{selected.stats[key]}</span>)}</div><button className="game-button game-button-primary" onClick={continueStory}>{sceneIndex + 1 === chapter.scenes.length ? "收下此章感悟" : "走入下一幕"}<GameIcon name="arrow" size={17} /></button></div>
              </div> : <p className="game-choice-hint">没有标准答案。选择之后，看看这个决定带来了什么。</p>}
              <details className="game-source"><summary>史料与改编说明</summary><p>{chapter.historyNote}</p><p>{scene.source.note}</p><a href={scene.source.url} target="_blank" rel="noreferrer">查阅 {scene.source.title} ↗</a></details>
            </> : <div className="game-chapter-completion">
              <span className="game-completion-seal">{["学", "礼", "教", "仕", "行", "守", "归", "传"][chapterIndex]}</span><p className="game-eyebrow">第{numerals[chapterIndex]}章 · 已走过</p><h1 ref={heading} tabIndex={-1}>把这句话，带在路上。</h1>
              <blockquote>{chapter.quote.text}<cite>—— {chapter.quote.source}</cite></blockquote>
              <a className="game-source-link" href={chapter.quote.url} target="_blank" rel="noreferrer">读一读原文 <GameIcon name="arrow" size={15} /></a>
              <div className="game-note-editor"><label htmlFor="chapter-note">回到今天，你想把什么带进自己的生活？</label><textarea id="chapter-note" aria-describedby="chapter-note-status" maxLength={1000} placeholder="写一句给自己的话，也可以暂时留白……" value={progress.reflections[chapter.id] ?? ""} onChange={(event) => persist({ ...progress, reflections: { ...progress.reflections, [chapter.id]: event.target.value } })} /><div id="chapter-note-status" className="game-note-status"><span>{(progress.reflections[chapter.id] ?? "").length} / 1000</span>{savedLocally ? <AccountSaveIndicator /> : <span role="status">此设备未保存，请导出手记</span>}</div></div>
              <p className="game-note-optional">写下感悟，或留待下次补写。旅程会继续为你保存。</p>
              <button className="game-button game-button-primary" onClick={() => chapterIndex === 7 ? finishJourney() : enterChapter(chapterIndex + 1)}>{chapterIndex === 7 ? "回望这一生" : `前往第${numerals[chapterIndex + 1]}章` }<GameIcon name="arrow" /></button>
              <button className="game-text-button" onClick={() => navigate("map")}>歇一歇，回到长卷</button>
            </div>}
          </section>
        </div>}

        {view === "people" && <CharacterGallery characters={characters} />}

        {view === "journal" && <section className="game-collection game-journal"><div className="game-section-heading"><div><p className="game-eyebrow">THOUGHTS ALONG THE WAY</p><h1 ref={heading} tabIndex={-1}>我的学思手记</h1></div>{answered > 0 && <button className="game-button" onClick={exportJournal}><GameIcon name="download" size={17} />导出手记</button>}</div><p className="game-collection-intro">每一个选择，都留下了你的思考。游客手记保存在此浏览器；登录后同步到账号，也可以随时导出。</p><div className="game-journal-stats"><span><strong>{completed}</strong>章旅程</span><span><strong>{answered}</strong>次选择</span><span><strong>{noteCount}</strong>篇感悟</span></div>
          {answered === 0 ? <div className="game-empty"><GameIcon name="book" size={46} /><h2>旅程尚未开始，书页正等着你。</h2><p>走进第一个故事，这里就会记下你的选择与感悟。</p><button className="game-button game-button-primary" onClick={() => enterChapter(0)}>开始第一章<GameIcon name="arrow" size={17} /></button></div> : <div className="game-journal-entries">{gameChapters.filter((item) => item.scenes.some((story) => progress.answers[story.id])).map((item) => <article key={item.id}><p className="game-eyebrow">第{numerals[item.number - 1]}章 · {item.year}</p><h2>{item.title}</h2>{item.scenes.map((story) => { const choice = story.choices.find((option) => option.id === progress.answers[story.id]); return choice && <details key={story.id}><summary>{story.title}<span>{choice.label}</span></summary><p>{choice.consequence}</p><p>{choice.reflection}</p></details>; })}<blockquote>{item.quote.text}<cite>{item.quote.source}</cite></blockquote><label htmlFor={`note-${item.id}`}>我的感悟</label><textarea id={`note-${item.id}`} aria-describedby={`note-status-${item.id}`} maxLength={1000} placeholder="现在回看，你有了什么新的想法？" value={progress.reflections[item.id] ?? ""} onChange={(event) => persist({ ...progress, reflections: { ...progress.reflections, [item.id]: event.target.value } })} /><div id={`note-status-${item.id}`} className="game-note-status"><span>{(progress.reflections[item.id] ?? "").length} / 1000{(progress.reflections[item.id] ?? "").length >= 900 && ` · 还可写 ${1000 - (progress.reflections[item.id] ?? "").length} 字`}</span>{savedLocally ? <AccountSaveIndicator /> : <span role="status">此设备未保存，请导出手记</span>}</div></article>)}</div>}
          {answered > 0 && <div className="game-reset-area">{confirmReset ? <><p role="alert">重新启程会清除当前选择与手记；登录时也会同步清空云端进度。建议先导出留存。</p><button id="game-keep-progress" className="game-button" onClick={() => { setConfirmReset(false); requestAnimationFrame(() => document.getElementById("game-reset-trigger")?.focus()); }}>保留旅程</button><button className="game-button game-button-danger" onClick={() => { clearReadingPosition(); persist({ ...emptyProgress, answers: {}, reflections: {} }); setChapterIndex(0); setSceneIndex(0); navigate("map"); setNotice("已准备好，重新出发。"); }}>确认清除并重新启程</button></> : <button id="game-reset-trigger" className="game-text-button" onClick={() => { setConfirmReset(true); requestAnimationFrame(() => document.getElementById("game-keep-progress")?.focus()); }}><GameIcon name="reset" size={16} />重新启程</button>}</div>}
        </section>}

        {view === "ending" && <section className="game-ending"><p className="game-eyebrow">八章走过 · 求索未止</p><span className="game-completion-seal">同行</span><h1 ref={heading} tabIndex={-1}>一生的路，<br />通向今天的你。</h1><p>从少年志学到晚年传道，你已走过孔子一生的八个片段。<br />真正的学习，才刚刚回到日常。</p><div className="game-ending-stats">{(["ren", "zhi", "yong"] as const).map((key) => <div key={key}><span>{virtueLabels[key]}</span><strong>{stats[key]}</strong><small>{key === "ren" ? "体察与关怀" : key === "zhi" ? "辨析与求知" : "担当与行动"}</small></div>)}</div><p className="game-ending-note">这些数值只记录本次选择的思考倾向，不是对品德或人格的评定。</p><div className="game-ending-actions"><button className="game-button game-button-primary" onClick={() => navigate("journal")}>翻开我的手记<GameIcon name="book" size={18} /></button><button className="game-button" onClick={exportJournal}>导出旅程<GameIcon name="download" size={18} /></button><Link className="game-text-button" href="/zh-Hans/analects">带着问题，重读《论语》<GameIcon name="arrow" size={18} /></Link></div><div className="game-ending-art"><GameLandscape chapter={7} /></div></section>}
        </div>
      </main>
      {selectedCharacter && (() => { const index = characters.findIndex((person) => person.slug === selectedCharacter); const person = characters[index]; return person ? <CharacterDialog character={person} onClose={() => setSelectedCharacter(null)} onPrevious={() => setSelectedCharacter(characters[(index - 1 + characters.length) % characters.length].slug)} onNext={() => setSelectedCharacter(characters[(index + 1) % characters.length].slug)} index={index + 1} total={characters.length} previousName={characters[(index - 1 + characters.length) % characters.length].name} nextName={characters[(index + 1) % characters.length].name} /> : null; })()}
      <footer className="game-footer"><span><span className="game-footer-seal">论</span>lunyu.ai <span className="game-footer-divider">/</span>让经典，成为一段亲历。</span><span>故事据《论语》《史记》等改编 · <Link href="/zh-Hans/people/confucius">查阅孔子年表 ↗</Link></span></footer>
    </div>
  );
}
