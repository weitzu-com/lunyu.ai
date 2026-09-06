"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { BiographyProfile, BiographySource } from "@/lib/biography-types";
import { biographyPath, compareEvents } from "@/lib/biography-utils";
import { BiographyTimeline } from "@/components/biographies/BiographyTimeline";
import "@/components/biographies/biography-directory.css";

type DirectoryPortrait = { assetPath: string; width: number; height: number };
const FILTER_CHANGE_EVENT = "people-browser-filter-change";
const ALL_PEOPLE = "全部人物";

function subscribeToFilters(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("pageshow", onChange);
  window.addEventListener(FILTER_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("pageshow", onChange);
    window.removeEventListener(FILTER_CHANGE_EVENT, onChange);
  };
}

const getFilterSnapshot = () => window.location.search;
// Keep the complete directory in the static HTML and the first hydration render.
const getServerFilterSnapshot = () => "";

function usePeopleFilters() {
  return new URLSearchParams(useSyncExternalStore(subscribeToFilters, getFilterSnapshot, getServerFilterSnapshot));
}

function updateFilters(changes: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(changes)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  // Keep Next's navigation state; typing should not add a history entry per key.
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new Event(FILTER_CHANGE_EVENT));
}

function PortraitThumbnail({ portrait }: { portrait?: DirectoryPortrait }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="people-directory-portrait" aria-hidden="true">
      {portrait && !failed ? <Image src={portrait.assetPath} alt="" width={portrait.width} height={portrait.height} sizes="(max-width: 639px) 72px, 88px" loading="lazy" onError={() => setFailed(true)} /> : <span className="people-directory-portrait-fallback">图像<br />暂未加载</span>}
      <span className="people-directory-portrait-caption">后世画像</span>
    </div>
  );
}

export function BiographyDirectory({ profiles, portraits }: { profiles: BiographyProfile[]; portraits: Record<string, DirectoryPortrait> }) {
  const filters = usePeopleFilters();
  const query = filters.get("q") ?? "";
  const groups = [ALL_PEOPLE, "重点人物", ...new Set(profiles.filter((person) => person.role === "disciple").map((person) => person.group))];
  const requestedGroup = filters.get("group") ?? ALL_PEOPLE;
  const group = groups.includes(requestedGroup) ? requestedGroup : ALL_PEOPLE;
  const searchRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim().normalize("NFKC").toLocaleLowerCase();
  const matched = profiles.filter((person) => {
    const text = [person.name, person.courtesyName, ...person.aliases].join(" ").normalize("NFKC").toLocaleLowerCase();
    const matchesGroup = group === ALL_PEOPLE || (group === "重点人物" ? person.featured : person.group === group);
    return matchesGroup && text.includes(normalizedQuery);
  });
  const hasFilters = query !== "" || requestedGroup !== ALL_PEOPLE;
  function resetDirectory() {
    updateFilters({ q: null, group: null });
    searchRef.current?.focus();
  }

  return (
    <section id="directory" aria-labelledby="directory-heading" className="people-directory-section">
      <div className="people-browser-heading">
        <div><p className="label mb-3">从人物出发</p><h2 id="directory-heading" className="font-cjk text-3xl">人物档案</h2></div>
        <a href="#chronology" className="people-browser-text-link">切换到生平年表 <span aria-hidden="true">↓</span></a>
      </div>
      <p className="people-browser-intro">认识孔子与《史记》列传中的 {profiles.length - 1} 位弟子，查看他们的生平、著作与文献出处。</p>
      <div className="people-browser-controls people-directory-controls">
        <label className="people-browser-field" htmlFor="person-search"><span>姓名、字或别称</span>
          <span className="people-directory-search-wrap"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></svg><input ref={searchRef} id="person-search" type="search" autoComplete="off" placeholder="例如：颜回、子路、端木赐" value={query} onChange={(event) => updateFilters({ q: event.target.value })} aria-controls="people-directory-results" className="people-browser-input people-directory-search" /></span>
        </label>
        <label className="people-browser-field" htmlFor="person-group"><span>人物范围</span>
          <select id="person-group" value={group} onChange={(event) => updateFilters({ group: event.target.value === ALL_PEOPLE ? null : event.target.value })} aria-controls="people-directory-results" className="people-browser-input">
            {groups.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="people-browser-results-bar">
        <p role="status" aria-live="polite" aria-atomic="true"><strong>{matched.length}</strong> 位人物<span className="people-browser-result-context">{hasFilters ? ` · 共 ${profiles.length} 位` : " · 完整名录"}</span></p>
        <button type="button" className="people-browser-reset" disabled={!hasFilters} onClick={resetDirectory}>清除筛选</button>
      </div>
      <div id="people-directory-results">
        {matched.length ? <ul className="people-directory-grid">
          {matched.map((person) => (
            <li key={person.slug}>
              <Link href={biographyPath(person.slug)} prefetch={false} className="people-directory-card" aria-labelledby={`directory-${person.slug}-name`} aria-describedby={`directory-${person.slug}-identity`}>
                <PortraitThumbnail portrait={portraits[person.slug]} />
                <div className="people-directory-card-body">
                  <div className="people-directory-card-heading"><h3 id={`directory-${person.slug}-name`} className="font-cjk">{person.name}</h3><span className="people-directory-card-arrow" aria-hidden="true">→</span></div>
                  <p id={`directory-${person.slug}-identity`} className="people-directory-identity"><span>{person.courtesyName ? `字${person.courtesyName}` : "字未详"}</span><span className="people-directory-group">{person.group}</span></p>
                  <p className="people-directory-lifespan">{person.lifespan}</p>
                  <p className="people-directory-summary">{person.summary}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul> : <div className="people-browser-empty"><h3 className="font-cjk text-xl">没有找到匹配的人物</h3><p>可尝试姓名、字或别称，也可以清除筛选，重新浏览全部 {profiles.length} 位人物。</p><button type="button" className="ui-button" onClick={resetDirectory}>查看完整名录 <span aria-hidden="true">→</span></button></div>}
      </div>
      <p className="people-directory-note">所示图像均为后世画像，非生前写真。德行、言语、政事、文学四科依据《论语·先进》所列十哲，其余不作强行分类。</p>
    </section>
  );
}

export function ChronologyExplorer({ profiles, sources }: { profiles: BiographyProfile[]; sources: BiographySource[] }) {
  const filters = usePeopleFilters();
  const requestedPerson = filters.get("person") ?? "confucius";
  const person = requestedPerson === "all" || profiles.some((profile) => profile.slug === requestedPerson) ? requestedPerson : "confucius";
  const requestedPeriod = filters.get("period") ?? "all";
  const period = ["all", "early", "travels", "late", "after"].includes(requestedPeriod) ? requestedPeriod : "all";
  const requestedCertainty = filters.get("certainty") ?? "all";
  const certainty = ["all", "recorded", "approximate", "disputed"].includes(requestedCertainty) ? requestedCertainty : "all";
  const datedEvents = useMemo(() => profiles.flatMap((profile) => profile.events
    .filter((event) => event.year !== null)
    .map((event) => ({ ...event, profile })))
    .sort(compareEvents), [profiles]);
  const selectedProfile = profiles.find((profile) => profile.slug === person);
  const personRef = useRef<HTMLSelectElement>(null);
  const bounds: Record<string, [number, number]> = {
    early: [-9999, -501],
    travels: [-500, -485],
    late: [-484, -479],
    after: [-478, -1],
  };
  const events = datedEvents.filter((event) => {
    if (person !== "all" && event.profile.slug !== person) return false;
    if (certainty !== "all" && event.certainty !== certainty) return false;
    const range = bounds[period];
    return !range || (event.year! <= range[1] && (event.endYear ?? event.year!) >= range[0]);
  });
  const undatedCount = profiles.filter((profile) => person === "all" || profile.slug === person).reduce((sum, profile) => sum + profile.events.filter((event) => event.year === null).length, 0);
  const hasFilters = requestedPerson !== "confucius" || requestedPeriod !== "all" || requestedCertainty !== "all";
  function resetChronology() {
    updateFilters({ person: null, period: null, certainty: null });
    personRef.current?.focus();
  }

  return (
    <section id="chronology" aria-labelledby="chronology-heading" className="people-browser-chronology">
      <div className="people-browser-heading">
        <div><p className="label mb-3">从年份出发</p><h2 id="chronology-heading" className="font-cjk text-3xl">生平年表</h2></div>
        <a href="#chronology-method" className="people-browser-text-link">了解纪年依据 <span aria-hidden="true">↓</span></a>
      </div>
      <p className="people-browser-intro">按公元前年份从早到晚阅读，或选择“所有人物”，把师生的经历放在同一条时间线上。</p>
      <div className="people-browser-controls people-browser-chronology-controls">
        <label htmlFor="chronology-person" className="people-browser-field"><span>查看人物</span>
          <select ref={personRef} id="chronology-person" value={person} onChange={(event) => updateFilters({ person: event.target.value === "confucius" ? null : event.target.value })} aria-controls="chronology-results" className="people-browser-input">
            <option value="all">所有人物</option>
            {profiles.map((profile) => <option key={profile.slug} value={profile.slug}>{profile.name}{profile.courtesyName ? ` · ${profile.courtesyName}` : ""}</option>)}
          </select>
        </label>
        <label htmlFor="chronology-period" className="people-browser-field"><span>年份范围</span>
          <select id="chronology-period" value={period} onChange={(event) => updateFilters({ period: event.target.value === "all" ? null : event.target.value })} aria-controls="chronology-results" className="people-browser-input">
            <option value="all">全部年份</option><option value="early">前501年及以前</option><option value="travels">前500—前485年</option><option value="late">前484—前479年</option><option value="after">前478年及以后</option>
          </select>
        </label>
        <label htmlFor="chronology-certainty" className="people-browser-field"><span>纪年类型</span>
          <select id="chronology-certainty" value={certainty} onChange={(event) => updateFilters({ certainty: event.target.value === "all" ? null : event.target.value })} aria-controls="chronology-results" className="people-browser-input">
            <option value="all">全部类型</option><option value="recorded">纪年记载</option><option value="approximate">约年／推定</option><option value="disputed">记载／年代有争议</option>
          </select>
        </label>
      </div>
      <div className="people-browser-results-bar"><p role="status" aria-live="polite" aria-atomic="true"><strong>{events.length}</strong> 项纪年事件<span className="people-browser-result-context"> · {selectedProfile?.name ?? "所有人物"}</span></p><button type="button" className="people-browser-reset" disabled={!hasFilters} onClick={resetChronology}>重置年表</button></div>
      <div className="people-browser-chronology-context">
        <p>{undatedCount > 0 ? `另有 ${undatedCount} 项年代未详的记载，保留在人物档案中。` : "区间事件按起始年份排列，推定与争议分别标注。"}</p>
        {selectedProfile && <Link href={biographyPath(selectedProfile.slug)} prefetch={false} className="people-browser-text-link">阅读{selectedProfile.name}的完整档案 <span aria-hidden="true">→</span></Link>}
      </div>
      <div id="chronology-results">
        {events.length ? <BiographyTimeline events={events.map((event) => ({ ...event, personLink: person === "all" ? { href: biographyPath(event.profile.slug), name: event.profile.name } : undefined }))} sources={sources} /> : <div className="people-browser-empty"><h3 className="font-cjk text-xl">此范围内没有纪年事件</h3><p>可调整年份或纪年类型。文献中无法确定年代的事迹，仍可在人物档案中阅读。</p><button type="button" className="ui-button" onClick={() => { updateFilters({ person: "all", period: null, certainty: null }); personRef.current?.focus(); }}>查看全部纪年事件 <span aria-hidden="true">→</span></button></div>}
      </div>
    </section>
  );
}
