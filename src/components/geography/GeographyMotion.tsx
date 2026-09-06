"use client";

import { createContext, useContext, useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

const preferenceKey = "lunyu-geography-motion";
const listeners = new Set<() => void>();
let memoryPreference: string | null = null;
const serverSnapshot = () => false;
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getMotionEnabled() {
  if (getReducedMotion()) return false;
  try { return (memoryPreference ?? window.localStorage.getItem(preferenceKey)) !== "off"; }
  catch { return memoryPreference !== "off"; }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onStorage = (event: StorageEvent) => {
    if (event.key === preferenceKey || event.key === null) {
      memoryPreference = null;
      listener();
    }
  };
  media.addEventListener("change", listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", listener);
    window.removeEventListener("storage", onStorage);
  };
}

function setMotionEnabled(enabled: boolean) {
  memoryPreference = enabled ? "on" : "off";
  try { window.localStorage.setItem(preferenceKey, memoryPreference); } catch { /* The current visit still remembers this choice. */ }
  listeners.forEach((listener) => listener());
}

const MotionContext = createContext({ motionEnabled: false, reducedMotion: false });
export const useGeographyMotion = () => useContext(MotionContext);

/** Keeps the documents server rendered; only their optional motion is enhanced. */
export function GeographyMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const motionEnabled = useSyncExternalStore(subscribe, getMotionEnabled, serverSnapshot);
  const reducedMotion = useSyncExternalStore(subscribe, getReducedMotion, serverSnapshot);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !motionEnabled) return;
    const animations = new Set<Animation>();
    const registered = new WeakSet<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        if (!element.isConnected) return;
        if (element.dataset.geographyRevealed) return;
        element.dataset.geographyRevealed = "true";
        const delay = Math.min(180, Math.max(0, Number.parseFloat(element.style.getPropertyValue("--reveal-delay")) || 0));
        const animation = element.animate(
          [{ opacity: 0.25, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 580, delay, easing: "cubic-bezier(.2,.7,.25,1)", fill: "backwards" },
        );
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
      });
    }, { threshold: 0.04 });

    function register(node: Element) {
      const elements = node.matches("[data-geography-reveal]") ? [node] : [];
      elements.push(...node.querySelectorAll("[data-geography-reveal]"));
      elements.forEach((element) => {
        if (registered.has(element)) return;
        registered.add(element);
        observer.observe(element);
      });
    }
    register(root);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.removedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        const elements = node.matches("[data-geography-reveal]") ? [node] : [];
        elements.push(...node.querySelectorAll("[data-geography-reveal]"));
        elements.forEach((element) => { observer.unobserve(element); registered.delete(element); });
        if (active && node.contains(active)) resetTilt();
      }));
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof Element) register(node);
      }));
    });
    mutations.observe(root, { childList: true, subtree: true });

    // One delegated listener and one requested frame, only while a pointer moves.
    let active: HTMLElement | null = null;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    function resetTilt() {
      cancelAnimationFrame(frame);
      frame = 0;
      active?.style.removeProperty("--tilt-x");
      active?.style.removeProperty("--tilt-y");
      active?.removeAttribute("data-tilting");
      active = null;
    }
    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-geography-tilt]") : null;
      if (!target) { resetTilt(); return; }
      if (active !== target) { resetTilt(); active = target; }
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!active) return;
        const rect = active.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (pointerX - rect.left) / rect.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (pointerY - rect.top) / rect.height * 2 - 1));
        active.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
        active.style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`);
        active.dataset.tilting = "true";
      });
    }
    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", resetTilt);
    window.addEventListener("blur", resetTilt);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      animations.forEach((animation) => animation.cancel());
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", resetTilt);
      window.removeEventListener("blur", resetTilt);
      resetTilt();
    };
  }, [motionEnabled]);

  return <MotionContext.Provider value={{ motionEnabled, reducedMotion }}>
    <div ref={rootRef} className="geography-experience" data-geography-motion={motionEnabled ? "on" : "off"}>{children}</div>
  </MotionContext.Provider>;
}

export function GeographyMotionToggle() {
  const { motionEnabled, reducedMotion } = useGeographyMotion();
  return <button type="button" className="geography-motion-toggle" aria-label="动态效果" aria-pressed={motionEnabled} disabled={reducedMotion} title={reducedMotion ? "跟随系统设置：减少动态效果" : "切换地图、图片与阅读动画"} onClick={() => setMotionEnabled(!motionEnabled)}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" strokeWidth="1.25" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.25" /></svg>
    <span>动态效果</span><span className="geography-motion-state">{motionEnabled ? "开" : "关"}</span>
    {reducedMotion && <span className="sr-only">，跟随系统减少动态效果设置</span>}
  </button>;
}
