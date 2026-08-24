"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PinyinRuby } from "@/components/PinyinRuby";
import type { Locale } from "@/lib/analects";
import { listenFragment, parseListenHash, type ListenChapter } from "@/lib/listen";

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function tr(locale: Locale, zh: string, en: string) {
  return locale === "zh-Hans" ? zh : en;
}

function firstPlayableIndex(chapters: ListenChapter[]) {
  return chapters.findIndex((chapter) => chapter.audioAvailable);
}

function indexFromListenHash(chapters: ListenChapter[], hash: string) {
  const sentenceId = parseListenHash(hash);
  if (!sentenceId) return -1;
  const hashed = chapters.findIndex((chapter) => chapter.id === sentenceId);
  if (hashed >= 0 && chapters[hashed]?.audioAvailable) return hashed;
  return -1;
}

function writeListenHash(sentenceId: string) {
  const next = `#${listenFragment(sentenceId)}`;
  if (window.location.hash === next) return;
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
}

export function ListenControls({
  locale,
  bookTitle,
  chapters,
}: {
  locale: Locale;
  bookTitle: string;
  chapters: ListenChapter[];
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(() => firstPlayableIndex(chapters));
  const [hashReady, setHashReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(() =>
    index >= 0 ? (chapters[index]?.durationSeconds ?? 0) : 0
  );

  const active = index >= 0 ? chapters[index] : undefined;
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const chapterLabel = useMemo(() => {
    if (!active) return "";
    return active.title;
  }, [active]);

  const findAvailableIndex = useCallback(
    (startIndex: number, direction: 1 | -1) => {
      let cursor = startIndex;
      while (cursor >= 0 && cursor < chapters.length) {
        const chapter = chapters[cursor];
        if (chapter?.audioAvailable) return cursor;
        cursor += direction;
      }
      return -1;
    },
    [chapters]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => setDuration(audio.duration);
    const syncPause = () => setIsPlaying(false);
    const syncPlay = () => setIsPlaying(true);
    const playNextChapter = () => {
      setIsPlaying(false);
      if (!autoPlay) return;
      const nextIndex = findAvailableIndex(index + 1, 1);
      if (nextIndex < 0) return;
      setCurrentTime(0);
      setDuration(chapters[nextIndex]?.durationSeconds ?? 0);
      setIndex(nextIndex);
      const next = chapters[nextIndex];
      if (next) writeListenHash(next.id);
      window.setTimeout(() => {
        void audioRef.current?.play();
      }, 80);
    };

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("pause", syncPause);
    audio.addEventListener("play", syncPlay);
    audio.addEventListener("ended", playNextChapter);
    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("pause", syncPause);
      audio.removeEventListener("play", syncPlay);
      audio.removeEventListener("ended", playNextChapter);
    };
  }, [autoPlay, chapters, findAvailableIndex, index]);

  useLayoutEffect(() => {
    const hashed = indexFromListenHash(chapters, window.location.hash);
    if (hashed >= 0) {
      setCurrentTime(0);
      setDuration(chapters[hashed]?.durationSeconds ?? 0);
      setIndex(hashed);
    }
    setHashReady(true);
  }, [chapters]);

  useEffect(() => {
    function onHashChange() {
      const hashed = indexFromListenHash(chapters, window.location.hash);
      if (hashed < 0) return;
      setCurrentTime(0);
      setDuration(chapters[hashed]?.durationSeconds ?? 0);
      setIndex(hashed);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [chapters]);

  useEffect(() => {
    if (!hashReady || !active) return;
    const el = document.getElementById(`listen-${active.id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [active, hashReady]);

  async function play() {
    await audioRef.current?.play();
  }

  function pause() {
    audioRef.current?.pause();
  }

  function restart() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play();
  }

  function selectChapter(nextIndex: number, shouldPlay = true, direction: 1 | -1 = 1) {
    const availableIndex =
      chapters[nextIndex]?.audioAvailable ? nextIndex : findAvailableIndex(nextIndex, direction);
    if (availableIndex < 0) return;
    setCurrentTime(0);
    setDuration(chapters[availableIndex]?.durationSeconds ?? 0);
    setIndex(availableIndex);
    const selected = chapters[availableIndex];
    if (selected) writeListenHash(selected.id);
    if (shouldPlay) {
      window.setTimeout(() => {
        void audioRef.current?.play();
      }, 80);
    }
  }

  function seek(value: string) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const nextTime = (Number(value) / 100) * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  if (!active) {
    return (
      <div className="mt-8 border border-rule bg-surface p-5 text-sm text-ink-soft">
        {tr(locale, "暂无可播放章节。", "No playable chapters yet.")}
      </div>
    );
  }

  return (
    <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="border border-rule bg-surface">
        <div className="border-b border-rule p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="label">{bookTitle}</p>
              <h2 className="mt-2 font-serif text-2xl leading-tight text-ink sm:text-3xl">
                {chapterLabel}
              </h2>
            </div>
            <Link
              href={active.href}
              className="deep-read-link min-h-11 py-2"
              aria-label={tr(locale, "深读当前章节", "Study the current chapter")}
            >
              {tr(locale, "深读", "Study")}
            </Link>
          </div>

          <audio ref={audioRef} src={active.audioSrc} preload="metadata" />

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => selectChapter(index - 1, true, -1)}
              disabled={findAvailableIndex(index - 1, -1) < 0}
              className="ui-button disabled:cursor-not-allowed disabled:opacity-45"
            >
              {tr(locale, "上一章", "Previous")}
            </button>
            <button
              type="button"
              onClick={isPlaying ? pause : play}
              className="ui-button ui-button-primary min-w-28"
            >
              {isPlaying ? tr(locale, "暂停", "Pause") : tr(locale, "播放", "Play")}
            </button>
            <button type="button" onClick={restart} className="ui-button">
              {tr(locale, "重听", "Restart")}
            </button>
            <button
              type="button"
              onClick={() => selectChapter(index + 1, true, 1)}
              disabled={findAvailableIndex(index + 1, 1) < 0}
              className="ui-button disabled:cursor-not-allowed disabled:opacity-45"
            >
              {tr(locale, "下一章", "Next")}
            </button>
            <label className="ml-0 inline-flex min-h-11 items-center gap-2 border border-rule bg-paper px-3 font-ui text-sm text-ink-soft sm:ml-auto">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(event) => setAutoPlay(event.currentTarget.checked)}
                className="size-4 accent-[var(--cinnabar)]"
              />
              {tr(locale, "连续播放", "Autoplay")}
            </label>
          </div>

          <div className="mt-4 grid gap-2">
            <input
              aria-label={tr(locale, "播放进度", "Playback progress")}
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={(event) => seek(event.currentTarget.value)}
              className="listen-progress"
            />
            <div className="flex items-center justify-between font-ui text-xs text-ink-soft">
              <span>{formatClock(currentTime)}</span>
              <span>
                {index + 1}/{chapters.length}
              </span>
              <span>{formatClock(duration)}</span>
            </div>
          </div>
        </div>

        <article className="p-4 sm:p-6">
          <h3 className="ruby-heading font-serif text-[1.9rem] leading-[2.1] text-ink sm:text-[2.35rem]">
            <PinyinRuby text={active.classical} pinyin={active.pinyin} />
          </h3>
          <p className="mt-5 max-w-3xl text-base leading-[1.9] text-ink-soft">
            {active.modern}
          </p>
        </article>
      </div>

      <aside className="border border-rule bg-surface lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-auto">
        <div className="border-b border-rule p-4">
          <p className="label">{tr(locale, "章节", "Chapters")}</p>
          <p className="mt-2 font-ui text-sm text-ink-soft">
            {tr(locale, "点击任一章立即播放。", "Select any chapter to play.")}
          </p>
        </div>
        <ol className="divide-y divide-rule" id="listen-list">
          {chapters.map((chapter, chapterIndex) => {
            const selected = chapter.id === active.id;
            return (
              <li key={chapter.id} id={`listen-${chapter.id}`}>
                <button
                  type="button"
                  onClick={() => selectChapter(chapterIndex)}
                  disabled={!chapter.audioAvailable}
                  className={`grid w-full grid-cols-[2.75rem_minmax(0,1fr)] gap-3 px-4 py-3 text-left transition-colors ${
                    !chapter.audioAvailable
                      ? "cursor-not-allowed bg-surface-sunken text-ink-soft opacity-60"
                      : selected
                      ? "bg-surface-sunken text-ink"
                      : "bg-surface text-ink-soft hover:bg-surface-sunken hover:text-ink"
                  }`}
                  aria-current={selected ? "true" : undefined}
                >
                  <span className="font-ui text-sm tabular-nums">
                    {String(chapter.sentenceNumber).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block line-clamp-2 font-serif text-base leading-[1.55]">
                      {chapter.classical}
                    </span>
                    <span className="mt-1 block font-ui text-xs">
                      {chapter.audioAvailable
                        ? tr(locale, "可播放", "Playable")
                        : tr(locale, "未录音", "Unavailable")}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>
    </section>
  );
}
