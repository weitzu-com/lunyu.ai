"use client";

import { useRef, useSyncExternalStore, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { placeKindLabels } from "@/components/geography/geography-presentation";
import type { GeographyPlace } from "@/lib/geography-types";
import "./geography-explorer.css";

export type GeographyExplorerEntry = {
  slug: string;
  kind: GeographyPlace["kind"];
  searchText: string;
  card: ReactNode;
};

type PlaceKind = GeographyPlace["kind"] | "all";
const filterEvent = "geography-filters-change";
const kindOptions = [
  { value: "all" as const, label: "全部类型" },
  ...Object.entries(placeKindLabels).map(([value, label]) => ({ value: value as GeographyPlace["kind"], label })),
];

// The immediate UI snapshot is independent from History API writes. Browsers
// may rate-limit replaceState; a failed URL update must never block typing.
let filterSnapshot: { pathname: string; search: string } | null = null;
let pendingFilterUrl: { pathname: string; href: string } | null = null;
let filterTimer: number | undefined;

function cancelFilterTimer() {
  if (filterTimer !== undefined) window.clearTimeout(filterTimer);
  filterTimer = undefined;
}

function flushFilters() {
  cancelFilterTimer();
  const pending = pendingFilterUrl;
  if (!pending) return;
  if (pending.pathname !== window.location.pathname) {
    pendingFilterUrl = null;
    filterSnapshot = null;
    return;
  }
  try {
    window.history.replaceState(window.history.state, "", pending.href);
    if (pendingFilterUrl === pending) pendingFilterUrl = null;
  } catch {
    // Keep the latest snapshot and retry at the next blur/navigation flush.
    // A browser restriction on History must not discard the reader's filters.
  }
}

function subscribeToFilters(onChange: () => void) {
  const onPopState = () => {
    cancelFilterTimer();
    pendingFilterUrl = null;
    filterSnapshot = null;
    onChange();
  };
  window.addEventListener("popstate", onPopState);
  window.addEventListener(filterEvent, onChange);
  window.addEventListener("pagehide", flushFilters);
  return () => {
    flushFilters();
    cancelFilterTimer();
    pendingFilterUrl = null;
    filterSnapshot = null;
    window.removeEventListener("popstate", onPopState);
    window.removeEventListener(filterEvent, onChange);
    window.removeEventListener("pagehide", flushFilters);
  };
}

const readBrowserFilters = () => filterSnapshot?.pathname === window.location.pathname ? filterSnapshot.search : window.location.search;
// All server-rendered cards remain visible, including on a direct ?q= link.
// React reads the browser URL after hydration without a dynamic router boundary.
const readServerFilters = () => "";

function writeFilters(query: string, kind: PlaceKind) {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  if (kind !== "all") url.searchParams.set("type", kind);
  else url.searchParams.delete("type");
  filterSnapshot = { pathname: url.pathname, search: url.search };
  cancelFilterTimer();
  pendingFilterUrl = url.href === window.location.href ? null : { pathname: url.pathname, href: url.href };
  if (pendingFilterUrl) filterTimer = window.setTimeout(flushFilters, 200);
  window.dispatchEvent(new Event(filterEvent));
}

function flushBeforeNavigation(event: MouseEvent<HTMLElement>) {
  if (event.target instanceof Element && event.target.closest("a[href]")) flushFilters();
}

export function GeographyExplorer({ entries }: { entries: GeographyExplorerEntry[] }) {
  const searchRef = useRef<HTMLInputElement>(null);
  const searchParams = new URLSearchParams(useSyncExternalStore(subscribeToFilters, readBrowserFilters, readServerFilters));
  const query = (searchParams.get("q") ?? "").slice(0, 120);
  const requestedKind = searchParams.get("type");
  const kind: PlaceKind = kindOptions.find((option) => option.value === requestedKind)?.value ?? "all";
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const textMatches = entries.filter((entry) => words.every((word) => entry.searchText.toLocaleLowerCase().includes(word)));
  const matched = textMatches.filter((entry) => kind === "all" || entry.kind === kind);
  const filtered = query.length > 0 || kind !== "all";
  const selectedLabel = kind === "all" ? "" : placeKindLabels[kind];

  function resetFilters() {
    writeFilters("", "all");
    searchRef.current?.focus();
  }

  function clearSearch() {
    writeFilters("", kind);
    searchRef.current?.focus();
  }

  return (
    <section id="directory" className="geography-section geography-explorer" aria-labelledby="places-heading" data-filtered={filtered} onBlurCapture={flushFilters} onClickCapture={flushBeforeNavigation} onAuxClickCapture={flushBeforeNavigation}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="label mb-3">从一个地名出发</p><h2 id="places-heading" className="font-cjk text-3xl">地理档案</h2></div>
        <a href="#geography-method" className="inline-flex min-h-11 items-center text-sm text-ink-soft underline underline-offset-4">如何区分地点与行迹？</a>
      </div>
      <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">查找古地名、今址或人物姓名。每一处地点都保留人物关联、文献出处，以及古今地望的说明。</p>
      <div className="geography-explorer-tools">
        <div className="geography-explorer-search-block">
          <label htmlFor="place-search" className="geography-explorer-label">地名、别称或相关人物</label>
          <div className="geography-explorer-search">
            <svg className="geography-explorer-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4.5 4.5" /></svg>
            <input ref={searchRef} id="place-search" type="search" autoComplete="off" maxLength={120} value={query} onChange={(event) => writeFilters(event.target.value, kind)} onKeyDown={(event) => { if (event.key === "Escape" && query) { event.preventDefault(); clearSearch(); } }} placeholder="例如：鲁国、曲阜、子路" aria-controls="place-results" aria-describedby="place-search-help" />
            {query && <button type="button" onClick={clearSearch} className="geography-explorer-clear" aria-label="清除搜索词"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>}
          </div>
          <p id="place-search-help" className="geography-explorer-help">也可以输入人物的字；多个词用空格分开。</p>
        </div>
        <fieldset className="geography-explorer-kinds">
          <legend className="geography-explorer-label">地理类型</legend>
          <div className="geography-explorer-chips">
            {kindOptions.map((option) => {
              const count = option.value === "all" ? textMatches.length : textMatches.filter((entry) => entry.kind === option.value).length;
              return <button key={option.value} type="button" className="geography-explorer-chip" aria-pressed={kind === option.value} aria-controls="place-results" onClick={() => writeFilters(query, option.value)}><span>{option.label}</span><span className="geography-explorer-chip-count" aria-label={`${count} 个条目`}>{count}</span></button>;
            })}
          </div>
        </fieldset>
      </div>
      <div className="geography-explorer-feedback">
        <p role="status" aria-live="polite" aria-atomic="true" className="geography-explorer-status"><span className="geography-explorer-status-dot" aria-hidden="true" />显示 <strong key={matched.length} className="geography-explorer-count">{matched.length}</strong> / {entries.length} 个地理条目{selectedLabel ? ` · ${selectedLabel}` : ""}{query.trim() ? <span className="geography-explorer-query"> · “{query.trim()}”</span> : null}</p>
        {filtered && <button type="button" onClick={resetFilters} className="geography-explorer-reset">清除筛选<span aria-hidden="true"> ↺</span></button>}
      </div>
      <div id="place-results">
        {matched.length > 0 ? (
          <div className="geography-directory">{matched.map((entry, index) => <div key={entry.slug} className="geography-explorer-result" data-geography-reveal style={{ "--reveal-delay": `${Math.min(index, 4) * 35}ms` } as CSSProperties}>{entry.card}</div>)}</div>
        ) : (
          <div className="geography-explorer-empty">
            <div className="geography-explorer-empty-mark" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1"><path d="m4 25 7-12 5 8 4-6 8 10M4 27h24" /><circle cx="22" cy="7" r="3" /></svg></div>
            <h3 className="font-cjk text-xl">没有找到匹配的地点</h3>
            <p className="mt-3 text-base leading-8 text-ink-soft">{kind !== "all" && textMatches.length > 0 ? `其他类型中还有 ${textMatches.length} 个匹配地点，可以保留搜索词、扩大查找范围。` : "可尝试更短的古地名、今址，或人物的字与别称。"}</p>
            <div className="geography-explorer-empty-actions">
              {kind !== "all" && textMatches.length > 0 && <button type="button" onClick={() => { writeFilters(query, "all"); searchRef.current?.focus(); }} className="ui-button ui-button-primary">搜索所有类型 · {textMatches.length}</button>}
              <button type="button" onClick={resetFilters} className="ui-button">查看全部地点</button>
            </div>
            <p className="mt-4 text-sm leading-7 text-ink-soft">部分人物尚无可靠地点，可查看<a href="#person-coverage" className="inline-flex min-h-11 items-center underline underline-offset-4">人物地理信息的收录说明 ↓</a>。</p>
          </div>
        )}
      </div>
    </section>
  );
}
