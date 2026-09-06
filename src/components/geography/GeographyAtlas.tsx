"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { GeographyKind } from "@/lib/geography-types";
import { geographyPath, placeKindLabels } from "./geography-presentation";
import { useGeographyMotion } from "./GeographyMotion";

export type AtlasPlace = {
  slug: string;
  name: string;
  kind: GeographyKind;
  modernLocation: string;
  locationNote: string;
  context: boolean;
  coordinates?: { latitude: number; longitude: number };
  point?: { x: number; y: number };
};

type AtlasProps = {
  places: AtlasPlace[];
  rivers: { id: number; path: string }[];
  initialSelectedSlug?: string;
  sourceUrl: string;
};
type Mark = { place: AtlasPlace; x: number; y: number; width: number; height: number };
const initialView = { tilt: 22, turn: -9, zoom: 1 };
const mobileContext = new Set(["wei", "chu", "wu"]);
const smallContext = new Set(["chu", "wu"]);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const projectX = (longitude: number) => 62 + ((longitude - 109) / 13) * 658;
const projectY = (latitude: number) => 365 - ((latitude - 29) / 10) * 305;

/** Place the selected label first, then keep context labels clear of its touch target. */
function arrangeLabels(places: AtlasPlace[], selectedSlug: string, boardWidth: number, zoom: number) {
  const unit = 780 / Math.max(boardWidth * zoom, 220);
  const marks: Mark[] = [];
  const visible = places.filter((place) => place.point && (
    place.slug === selectedSlug || (place.context && (
      boardWidth >= 500 || (boardWidth >= 360 ? mobileContext : smallContext).has(place.slug)
    ))
  ));
  visible.sort((a, b) => Number(b.slug === selectedSlug) - Number(a.slug === selectedSlug));
  visible.forEach((place) => {
    const { x, y } = place.point!;
    const width = Math.max(48, place.name.length * 14 + 24) * unit;
    const height = 48 * unit;
    const gap = 12 * unit;
    const offsets = [
      [0, -height / 2 - gap], [width / 2 + gap, 0], [-width / 2 - gap, 0],
      [0, height / 2 + gap], [width / 2 + gap, -height / 2 - gap],
      [-width / 2 - gap, -height / 2 - gap], [width / 2 + gap, height / 2 + gap],
      [-width / 2 - gap, height / 2 + gap], [0, -height * 1.6], [0, height * 1.6],
    ];
    const candidates = offsets.map(([dx, dy]) => ({
      x: clamp(x + dx, width / 2 + 8, 772 - width / 2),
      y: clamp(y + dy, height / 2 + 8, 442 - height / 2),
    }));
    const overlap = (candidate: { x: number; y: number }) => marks.reduce((total, mark) => {
      const horizontal = Math.max(0, (width + mark.width) / 2 + 4 * unit - Math.abs(candidate.x - mark.x));
      const vertical = Math.max(0, (height + mark.height) / 2 + 4 * unit - Math.abs(candidate.y - mark.y));
      return total + horizontal * vertical;
    }, 0);
    const candidate = candidates.find((position) => overlap(position) === 0)
      ?? candidates.reduce((best, position) => overlap(position) < overlap(best) ? position : best);
    marks.push({ place, ...candidate, width, height });
  });
  return marks;
}

function ControlIcon({ type }: { type: "left" | "right" | "reset" | "plus" | "minus" }) {
  const paths = {
    left: "M8 5 3 10l5 5M3 10h10a6 6 0 0 1 0 12",
    right: "m16 5 5 5-5 5M21 10H11a6 6 0 0 0 0 12",
    reset: "M4 9V3m0 6h6M4 9a9 9 0 1 1-1 8",
    plus: "M5 12h14M12 5v14",
    minus: "M5 12h14",
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={paths[type]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function GeographyAtlas({ places, rivers, initialSelectedSlug, sourceUrl }: AtlasProps) {
  const id = useId();
  const { motionEnabled } = useGeographyMotion();
  const [selectedSlug, setSelectedSlug] = useState(initialSelectedSlug ?? places.find((place) => place.slug === "lu")?.slug ?? places[0]?.slug ?? "");
  const [mode, setMode] = useState<"dimension" | "flat">("dimension");
  const [zoom, setZoom] = useState(1);
  const [boardWidth, setBoardWidth] = useState(780);
  const boardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef({ ...initialView });
  const dragRef = useRef<{ pointerId: number; x: number; y: number; tilt: number; turn: number } | null>(null);
  const dimensional = motionEnabled && mode === "dimension";
  const selected = places.find((place) => place.slug === selectedSlug);
  const marks = useMemo(() => arrangeLabels(places, selectedSlug, boardWidth, zoom), [places, selectedSlug, boardWidth, zoom]);
  const locatedPlaces = places.filter((place) => place.point);
  const unlocatedPlaces = places.filter((place) => !place.point);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const observer = new ResizeObserver(([entry]) => setBoardWidth(Math.round(entry.contentRect.width)));
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dimensional) return;
    dragRef.current = null;
    stageRef.current?.removeAttribute("data-dragging");
  }, [dimensional]);

  function applyView() {
    const board = boardRef.current;
    if (!board) return;
    board.style.setProperty("--atlas-tilt", `${viewRef.current.tilt}deg`);
    board.style.setProperty("--atlas-turn", `${viewRef.current.turn}deg`);
    board.style.setProperty("--atlas-zoom", String(viewRef.current.zoom));
    board.style.setProperty("--atlas-label-scale", String(1 / viewRef.current.zoom));
  }

  function rotate(direction: number) {
    viewRef.current.turn = clamp(viewRef.current.turn + direction * 8, -32, 32);
    applyView();
  }

  function changeZoom(direction: number) {
    const next = Number(clamp(viewRef.current.zoom + direction * 0.2, 0.8, 1.8).toFixed(1));
    viewRef.current.zoom = next;
    setZoom(next);
    applyView();
  }

  function resetView() {
    viewRef.current = { ...initialView };
    setZoom(1);
    applyView();
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!dimensional || event.pointerType !== "mouse" || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button, a, select, input")) return;
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, tilt: viewRef.current.tilt, turn: viewRef.current.turn };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!dimensional || !drag || drag.pointerId !== event.pointerId) return;
    viewRef.current.tilt = clamp(drag.tilt - (event.clientY - drag.y) * 0.15, 8, 38);
    viewRef.current.turn = clamp(drag.turn + (event.clientX - drag.x) * 0.15, -32, 32);
    applyView();
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.removeAttribute("data-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const boardStyle = {
    "--atlas-tilt": `${initialView.tilt}deg`,
    "--atlas-turn": `${initialView.turn}deg`,
    "--atlas-origin-x": `${clamp((selected?.point?.x ?? 390) / 7.8, 12, 88)}%`,
    "--atlas-origin-y": `${clamp((selected?.point?.y ?? 225) / 4.5, 12, 88)}%`,
  } as CSSProperties;

  return <figure className="geography-atlas" data-atlas-mode={dimensional ? "dimension" : "flat"} data-atlas-motion={motionEnabled ? "on" : "off"}>
    <div className="atlas-heading">
      <div><p className="atlas-eyebrow">地望图册</p><p className="atlas-heading-note">以现代水系，辨认古地名</p></div>
      <div className="atlas-modes" role="group" aria-label="地图显示方式">
        <button type="button" aria-pressed={dimensional} disabled={!motionEnabled} title={!motionEnabled ? "开启页面动态效果后，可使用立体视角" : "显示立体纸面"} onClick={() => setMode("dimension")}>立体</button>
        <button type="button" aria-pressed={!dimensional} onClick={() => setMode("flat")}>平面</button>
      </div>
    </div>

    <label className="atlas-select-label" htmlFor={`${id}-place`}>
      <span><span>选择地点</span><span className="atlas-select-count">{locatedPlaces.length} 处地望参照</span></span>
      <select id={`${id}-place`} value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)} aria-controls={`${id}-selection`}>
        <optgroup label="有地望参照点">{locatedPlaces.map((place) => <option key={place.slug} value={place.slug}>{place.name} · {placeKindLabels[place.kind]}</option>)}</optgroup>
        {unlocatedPlaces.length > 0 && <optgroup label="结合文字阅读 · 不作单点定位">{unlocatedPlaces.map((place) => <option key={place.slug} value={place.slug}>{place.name} · {placeKindLabels[place.kind]}</option>)}</optgroup>}
      </select>
    </label>

    <div ref={stageRef} className="atlas-stage" role="group" aria-label="地点参照图，可点选标签或使用上方地点选择器" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
      <div className="atlas-scene">
        <div ref={boardRef} className="atlas-board" style={boardStyle}>
          <svg viewBox="0 0 780 450" className="atlas-map" aria-hidden="true">
            <rect width="780" height="450" rx="3" className="atlas-paper" />
            {[110, 112, 114, 116, 118, 120, 122].map((longitude) => <g key={longitude}><line x1={projectX(longitude)} y1="52" x2={projectX(longitude)} y2="375" className="atlas-grid" /><text x={projectX(longitude)} y="404" textAnchor="middle" className="atlas-coordinate">{longitude}°E</text></g>)}
            {[30, 32, 34, 36, 38].map((latitude) => <g key={latitude}><line x1="62" y1={projectY(latitude)} x2="720" y2={projectY(latitude)} className="atlas-grid" /><text x="48" y={projectY(latitude) + 5} textAnchor="end" className="atlas-coordinate">{latitude}°N</text></g>)}
            {rivers.map((river) => <path key={river.id} d={river.path} className="atlas-river" fill="none" />)}
            <text x={projectX(119.3)} y={projectY(37.5)} className="atlas-river-name">黄河（今）</text>
            <text x={projectX(114.5)} y={projectY(30)} className="atlas-river-name">长江（今）</text>
            <path d="M728 78V35m-6 9 6-9 6 9" fill="none" className="atlas-north" />
            <text x="728" y="26" textAnchor="middle" className="atlas-coordinate">北</text>
            {marks.map(({ place, x, y }) => <g key={place.slug}>
              <line x1={place.point!.x} y1={place.point!.y} x2={x} y2={y} className="atlas-leader" />
              {place.slug === selectedSlug && <circle cx={place.point!.x} cy={place.point!.y} r="18" className="atlas-selected-ring" />}
              <circle cx={place.point!.x} cy={place.point!.y} r={place.slug === selectedSlug ? 6 : 4.5} className={place.slug === selectedSlug ? "atlas-point atlas-point-selected" : "atlas-point"} />
            </g>)}
          </svg>
          {marks.map(({ place, x, y }) => <button key={place.slug} type="button" className="atlas-place-label" style={{ left: `${x / 7.8}%`, top: `${y / 4.5}%` }} aria-pressed={place.slug === selectedSlug} aria-controls={`${id}-selection`} aria-label={`查看${place.name}的地望说明`} onClick={() => setSelectedSlug(place.slug)}>{place.name}</button>)}
        </div>
      </div>
      <p className="atlas-stage-note">今址参照 · 图板层次不表示地形高低</p>
    </div>

    <div className="atlas-toolbar">
      <div className="atlas-control-group" role="group" aria-label="地图视角">
        <button type="button" className="atlas-control" aria-label="向左旋转地图" title="向左旋转" disabled={!dimensional} onClick={() => rotate(-1)}><ControlIcon type="left" /></button>
        <button type="button" className="atlas-control" aria-label="向右旋转地图" title="向右旋转" disabled={!dimensional} onClick={() => rotate(1)}><ControlIcon type="right" /></button>
        <button type="button" className="atlas-control" aria-label="复位地图视角与缩放" title="复位视角与缩放" onClick={resetView}><ControlIcon type="reset" /></button>
      </div>
      <div className="atlas-control-group" role="group" aria-label="地图缩放">
        <button type="button" className="atlas-control" aria-label="缩小地图" title="缩小" disabled={zoom <= 0.8} onClick={() => changeZoom(-1)}><ControlIcon type="minus" /></button>
        <output className="atlas-zoom" aria-label="当前地图缩放">{Math.round(zoom * 100)}%</output>
        <button type="button" className="atlas-control" aria-label="放大地图" title="放大" disabled={zoom >= 1.8} onClick={() => changeZoom(1)}><ControlIcon type="plus" /></button>
      </div>
    </div>

    <div id={`${id}-selection`} className="atlas-selection" aria-live="polite" aria-atomic="true">
      {selected ? <div key={selected.slug} className="atlas-selection-content">
        <div className="atlas-selection-heading"><div><span className="atlas-selected-kind">{placeKindLabels[selected.kind]}</span><p className="atlas-selected-name">{selected.name}</p></div><Link className="atlas-detail-link" href={geographyPath(selected.slug)}>阅读条目 <span aria-hidden="true">↗</span></Link></div>
        <p className="atlas-modern-location">{selected.modernLocation}</p>
        {!selected.point && <p className="atlas-unlocated">{selected.coordinates ? "此处地望在当前图幅之外，请结合条目的文字说明阅读。" : "此概念不以单点坐标表示，图中不设定位点；其范围或古址存在的限制，见下方说明。"}</p>}
        {!selected.point && <p className="atlas-location-note">{selected.locationNote}</p>}
      </div> : <p className="atlas-location-note">选择地点，阅读地望与文献说明。</p>}
    </div>

    <figcaption className="atlas-caption">
      <details>
      <summary>地望说明与地图依据<span aria-hidden="true">＋</span></summary>
      {selected?.point && <p className="atlas-location-note">{selected.locationNote}</p>}
      <p>{motionEnabled ? <><span className="atlas-drag-tip">鼠标拖动空白处可转动图板；</span>点选地名，或从选择器查看全部地点。</> : "当前为静态平面图，地点选择与缩放仍可使用。"}</p>
      <p>点位采用条目注明的现代地望参照。图板层次不表示地形高低，细线只连接标签与参照点。</p>
      <p>水系参考：<a href={sourceUrl} target="_blank" rel="noreferrer">Natural Earth（公版）↗</a>；为现代概略河道，不复原春秋河道、疆界或行程。</p>
      </details>
    </figcaption>
  </figure>;
}
