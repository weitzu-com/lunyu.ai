"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useGeographyMotion } from "./GeographyMotion";
import "./geography-reading-nav.css";

type ReadingItem = { id: string; label: string };

type GeographyReadingNavProps = {
  items: ReadingItem[];
  title?: string;
};

const desktopQuery = "(min-width: 1024px)";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function scrollBehavior(motionEnabled: boolean): ScrollBehavior {
  return motionEnabled && !window.matchMedia(reducedMotionQuery).matches ? "smooth" : "instant";
}

function anchorOffset(nav: HTMLElement) {
  const top = Number.parseFloat(window.getComputedStyle(nav).top) || 0;
  return window.matchMedia(desktopQuery).matches ? top + 12 : top + nav.getBoundingClientRect().height + 16;
}

/** Anchors remain usable before hydration and when JavaScript is unavailable. */
export function GeographyReadingNav({ items, title }: GeographyReadingNavProps) {
  const { motionEnabled } = useGeographyMotion();
  const [activeId, setActiveId] = useState("");
  const activeIdRef = useRef(activeId);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const sections = items.flatMap((item) => {
      const element = document.getElementById(item.id);
      return element ? [{ id: item.id, element }] : [];
    });
    if (!sections.length) return;

    let timeout: number | undefined;
    let lastPercent = -1;

    const update = () => {
      timeout = undefined;
      const offset = anchorOffset(nav);
      // Finish layout reads before changing the progress indicator or state.
      const bounds = sections.map(({ id, element }) => ({ id, rect: element.getBoundingClientRect() }));
      const first = bounds[0];
      const last = bounds[bounds.length - 1];
      const viewportHeight = window.innerHeight;
      let currentId = first.id;
      for (const section of bounds) {
        if (section.rect.top <= offset + 24) currentId = section.id;
      }
      if (last.rect.bottom <= viewportHeight + 1 && first.rect.top <= offset) currentId = last.id;

      const availableTravel = Math.max(1, last.rect.bottom - first.rect.top - viewportHeight + offset);
      const progress = Math.min(1, Math.max(0, (offset - first.rect.top) / availableTravel));
      const percent = Math.round(progress * 100);
      if (percent !== lastPercent) {
        if (progressFillRef.current) progressFillRef.current.style.transform = `scaleX(${progress})`;
        progressRef.current?.setAttribute("aria-valuenow", String(percent));
        if (progressTextRef.current) progressTextRef.current.textContent = `${percent}%`;
        lastPercent = percent;
      }
      nav.dataset.ready = "true";
      // React only rerenders when the current section changes, never per frame.
      if (currentId !== activeIdRef.current) {
        activeIdRef.current = currentId;
        setActiveId(currentId);
      }
    };

    const scheduleUpdate = () => {
      if (timeout === undefined) timeout = window.setTimeout(update, 80);
    };

    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(scheduleUpdate, { rootMargin: "-15% 0px -65% 0px", threshold: 0 })
      : undefined;
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleUpdate) : undefined;
    for (const { element } of sections) {
      observer?.observe(element);
      resizeObserver?.observe(element);
    }
    resizeObserver?.observe(nav);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("hashchange", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    scheduleUpdate();

    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
    };
  }, [items]);

  useEffect(() => {
    const list = listRef.current;
    const link = linkRefs.current.get(activeId);
    if (!list || !link || window.matchMedia(desktopQuery).matches) return;
    const edge = 12;
    const left = link.offsetLeft;
    const right = left + link.offsetWidth;
    if (left < list.scrollLeft + edge || right > list.scrollLeft + list.clientWidth - edge) {
      list.scrollTo({
        left: Math.max(0, left - (list.clientWidth - link.offsetWidth) / 2),
        behavior: scrollBehavior(motionEnabled),
      });
    }
  }, [activeId, motionEnabled]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id?: string) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const nav = navRef.current;
    const target = id ? document.getElementById(id) : document.getElementById("main");
    if (!nav || (id && !target)) return;
    event.preventDefault();
    const top = id && target ? Math.max(0, window.scrollY + target.getBoundingClientRect().top - anchorOffset(nav)) : 0;
    const hash = id ? `#${encodeURIComponent(id)}` : "#";
    if (window.location.hash !== hash) window.history.pushState(window.history.state, "", hash);

    // Match native fragment navigation for keyboard and screen-reader users.
    if (target) {
      const focusTarget = target.querySelector<HTMLElement>("h1, h2, h3") ?? target;
      if (!focusTarget.hasAttribute("tabindex")) {
        focusTarget.setAttribute("tabindex", "-1");
        focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
      }
      focusTarget.focus({ preventScroll: true });
    }
    window.scrollTo({ top, behavior: scrollBehavior(motionEnabled) });
  }

  if (!items.length) return null;

  return (
    <nav ref={navRef} className="geography-reading-nav" aria-label={title ? `${title} · 本页目录` : "本页目录"} data-ready="false" data-motion={motionEnabled ? "on" : "off"}>
      <div className="geography-reading-nav__heading">
        <div className="geography-reading-nav__identity">
          <span className="geography-reading-nav__eyebrow">本页目录</span>
          {title && <span className="geography-reading-nav__title" title={title}>{title}</span>}
        </div>
        <span ref={progressTextRef} className="geography-reading-nav__percent" aria-hidden="true">0%</span>
        <a href="#" className="geography-reading-nav__top" aria-label="回到页面顶部" onClick={(event) => navigate(event)}>
          <span aria-hidden="true">↑</span><span className="geography-reading-nav__top-label">回到顶部</span>
        </a>
      </div>
      <div ref={progressRef} className="geography-reading-nav__progress" role="progressbar" aria-label={title ? `${title}阅读进度` : "本页阅读进度"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
        <span ref={progressFillRef} className="geography-reading-nav__progress-fill" />
      </div>
      <ul ref={listRef} className="geography-reading-nav__list">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              ref={(link) => { if (link) linkRefs.current.set(item.id, link); else linkRefs.current.delete(item.id); }}
              href={`#${encodeURIComponent(item.id)}`}
              className="geography-reading-nav__link"
              aria-current={activeId === item.id ? "location" : undefined}
              onClick={(event) => navigate(event, item.id)}
            >
              <span className="geography-reading-nav__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
