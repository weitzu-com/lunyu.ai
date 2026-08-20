"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Locale, t } from "@/lib/analects";

const STORAGE_KEY = "lunyu.read";

type ReadState = {
  /** ISO date string of last visit (YYYY-MM-DD) */
  lastVisit: string;
  /** IDs the user has opened (in chronological order, newest last). */
  opened: string[];
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function safeRead(): ReadState {
  if (typeof window === "undefined") {
    return { lastVisit: "", opened: [] };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastVisit: today(), opened: [] };
    const parsed = JSON.parse(raw) as ReadState;
    if (!parsed || typeof parsed !== "object") return { lastVisit: today(), opened: [] };
    return {
      lastVisit: typeof parsed.lastVisit === "string" ? parsed.lastVisit : today(),
      opened: Array.isArray(parsed.opened) ? parsed.opened.filter((x) => typeof x === "string") : [],
    };
  } catch {
    return { lastVisit: today(), opened: [] };
  }
}

function safeWrite(state: ReadState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/** Track that a sentence page was opened. */
export function markOpened(id: string) {
  if (typeof window === "undefined") return;
  const state = safeRead();
  if (!state.opened.includes(id)) {
    state.opened = [...state.opened, id].slice(-500);
  }
  state.lastVisit = today();
  safeWrite(state);
  window.dispatchEvent(new CustomEvent("lunyu:read", { detail: { id } }));
}

/** Headless component that fires once on mount to mark a sentence as opened. */
export function MarkOpened({ id }: { id: string }) {
  useEffect(() => {
    markOpened(id);
  }, [id]);
  return null;
}

/** Hint shown on the homepage when the visitor has been here before. */
export function ReadingHint({ currentId, locale }: { currentId: string; locale: Locale }) {
  const [opened, setOpened] = useState<string[]>(() => safeRead().opened);
  useEffect(() => {
    const onUpdate = () => setOpened(safeRead().opened);
    window.addEventListener("lunyu:read", onUpdate);
    return () => window.removeEventListener("lunyu:read", onUpdate);
  }, []);

  const count = opened.length;
  if (count === 0) {
    return (
      <p className="mt-3 font-ui text-xs text-ink-soft">
        {t(locale, "首次访问 — 选定此句作为今日的起读。", "First visit — start with this passage.")}
      </p>
    );
  }
  const last = opened[opened.length - 1];
  if (last === currentId) {
    return (
      <p className="mt-3 font-ui text-xs text-ink-soft">
        {t(locale, `你已读 ${count} 句`, `You have read ${count} passages`)}
      </p>
    );
  }
  return (
    <p className="mt-3 font-ui text-xs text-ink-soft">
      <Link
        href={`/${locale}/analects/${last.replace(/-(\d+)$/, "")}/${last}`}
        className="text-cinnabar hover:underline"
      >
        {t(locale, "继续昨日这一句 →", "Continue yesterday's passage →")}
      </Link>
    </p>
  );
}
