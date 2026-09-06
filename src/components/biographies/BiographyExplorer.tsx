"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BiographyProfile, BiographySource } from "@/lib/biography-types";
import { biographyPath, compareEvents } from "@/lib/biography-utils";
import { BiographyTimeline } from "@/components/biographies/BiographyTimeline";

export function BiographyDirectory({ profiles }: { profiles: BiographyProfile[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("全部人物");
  const groups = ["全部人物", "重点人物", ...new Set(profiles.filter((person) => person.role === "disciple").map((person) => person.group))];
  const matched = profiles.filter((person) => {
    const text = [person.name, person.courtesyName, ...person.aliases].join(" ").toLocaleLowerCase();
    const matchesGroup = group === "全部人物" || (group === "重点人物" ? person.featured : person.group === group);
    return matchesGroup && text.includes(query.trim().toLocaleLowerCase());
  });

  return (
    <section id="directory" aria-labelledby="directory-heading" className="scroll-mt-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="label mb-3">从人物出发</p><h2 id="directory-heading" className="font-cjk text-3xl">人物档案</h2></div>
        <p className="text-sm leading-6 text-ink-soft">孔子与《史记》列传中的 {profiles.length - 1} 位弟子</p>
      </div>
      <div className="biography-controls mt-6 grid gap-4 border-y border-rule py-5 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.45fr)]">
        <label className="grid gap-2 text-sm" htmlFor="person-search">查找姓名、字或别称
          <input id="person-search" type="search" autoComplete="off" placeholder="例如：颜回、子路、端木赐" value={query} onChange={(event) => setQuery(event.target.value)} className="biography-filter w-full" />
        </label>
        <label className="grid gap-2 text-sm" htmlFor="person-group">人物范围
          <select id="person-group" value={group} onChange={(event) => setGroup(event.target.value)} className="biography-filter w-full">
            {groups.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm leading-6 text-ink-soft" role="status" aria-live="polite">找到 {matched.length} 位人物。德行、言语、政事、文学四科依据《论语·先进》所列十哲；其余不作强行分类。</p>
      {matched.length ? <div className="biography-directory">
        {matched.map((person) => (
          <Link key={person.slug} href={biographyPath(person.slug)} className="biography-person-link group">
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="font-cjk text-2xl leading-9">{person.name}</h3><p className="mt-1 text-sm leading-6 text-ink-soft">{person.courtesyName ? `字${person.courtesyName}` : "字未详"} · {person.group}</p></div>
              <span className="pt-1 text-ink-soft" aria-hidden="true">↗</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-soft">{person.lifespan}</p>
            <p className="mt-2 text-base leading-7">{person.summary}</p>
          </Link>
        ))}
      </div> : <div className="py-10"><p className="text-ink-soft">没有找到匹配的人物。试试其他姓名，或清除筛选查看完整名录。</p><button className="ui-button mt-4" onClick={() => { setQuery(""); setGroup("全部人物"); }}>清除筛选</button></div>}
    </section>
  );
}

export function ChronologyExplorer({ profiles, sources }: { profiles: BiographyProfile[]; sources: BiographySource[] }) {
  const [person, setPerson] = useState("confucius");
  const [period, setPeriod] = useState("all");
  const [certainty, setCertainty] = useState("all");
  const datedEvents = useMemo(() => profiles.flatMap((profile) => profile.events
    .filter((event) => event.year !== null)
    .map((event) => ({ ...event, profile })))
    .sort(compareEvents), [profiles]);
  const selectedProfile = profiles.find((profile) => profile.slug === person);
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

  return (
    <section id="chronology" aria-labelledby="chronology-heading" className="scroll-mt-6 border-b border-rule py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="label mb-3">从年份出发</p><h2 id="chronology-heading" className="font-cjk text-3xl">生平年表</h2></div>
        <a href="#chronology-method" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">了解纪年依据 ↓</a>
      </div>
      <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">按公元前年份从早到晚排列。可单看一人，也可把师生的经历放在同一条时间线上；区间事件按起始年份排列。</p>
      <div className="biography-controls my-8 grid gap-4 border-y border-rule py-5 sm:grid-cols-3">
        <label htmlFor="chronology-person" className="grid gap-2 text-sm">查看人物
          <select id="chronology-person" value={person} onChange={(event) => setPerson(event.target.value)} className="biography-filter w-full">
            <option value="all">所有人物</option>
            {profiles.map((profile) => <option key={profile.slug} value={profile.slug}>{profile.name}{profile.courtesyName ? ` · ${profile.courtesyName}` : ""}</option>)}
          </select>
        </label>
        <label htmlFor="chronology-period" className="grid gap-2 text-sm">年份范围
          <select id="chronology-period" value={period} onChange={(event) => setPeriod(event.target.value)} className="biography-filter w-full">
            <option value="all">全部年份</option><option value="early">前501年及以前</option><option value="travels">前500—前485年</option><option value="late">前484—前479年</option><option value="after">前478年及以后</option>
          </select>
        </label>
        <label htmlFor="chronology-certainty" className="grid gap-2 text-sm">纪年类型
          <select id="chronology-certainty" value={certainty} onChange={(event) => setCertainty(event.target.value)} className="biography-filter w-full">
            <option value="all">全部类型</option><option value="recorded">纪年记载</option><option value="approximate">约年／推定</option><option value="disputed">记载／年代有争议</option>
          </select>
        </label>
      </div>
      <p role="status" aria-live="polite" className="mb-8 text-sm leading-7 text-ink-soft">当前显示 {events.length} 项有年份的事件。{undatedCount > 0 && `另有 ${undatedCount} 项未能可靠系年的记载，见各人物档案。`}</p>
      {events.length ? <BiographyTimeline events={events.map((event) => ({ ...event, title: person === "all" ? `${event.profile.name} · ${event.title}` : event.title }))} sources={sources} /> : <div className="border border-rule bg-surface p-6"><p className="leading-8 text-ink-soft">此筛选条件下没有可列出的纪年事件。年代未详的人物仍保留史料中的姓名与生平，不补写年份。</p><button className="ui-button mt-4" onClick={() => { setPerson("all"); setPeriod("all"); setCertainty("all"); }}>查看全部纪年事件</button></div>}
      {selectedProfile && <Link href={biographyPath(selectedProfile.slug)} className="ui-button mt-6">阅读{selectedProfile.name}的完整档案 →</Link>}
    </section>
  );
}
