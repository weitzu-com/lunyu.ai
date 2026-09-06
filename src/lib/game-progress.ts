import { gameChapters, type GameStats } from "@/data/confucius-game";

export type GameProgress = {
  version: 1;
  answers: Record<string, string>;
  reflections: Record<string, string>;
  lastChapter: number;
};
export const emptyProgress: GameProgress = { version: 1, answers: {}, reflections: {}, lastChapter: 0 };
export const GAME_STORAGE_KEY = "lunyu-life-journey-v1";

export function parseGameProgress(raw: string | null): GameProgress {
  if (!raw) return emptyProgress;
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1) return emptyProgress;
    const answers: Record<string, string> = {};
    // Only accept a contiguous journey with choices that still exist in the story.
    let accepting = true;
    for (const chapter of gameChapters) {
      for (const scene of chapter.scenes) {
        const choice = value.answers?.[scene.id];
        if (accepting && scene.choices.some((item) => item.id === choice)) answers[scene.id] = choice;
        else accepting = false;
      }
    }
    const reflections: Record<string, string> = {};
    for (const chapter of gameChapters) {
      if (typeof value.reflections?.[chapter.id] === "string") reflections[chapter.id] = value.reflections[chapter.id].slice(0, 1000);
    }
    const unlocked = Math.min(gameChapters.filter((chapter) => chapter.scenes.every((scene) => answers[scene.id])).length, gameChapters.length - 1);
    const lastChapter = Number.isInteger(value.lastChapter) ? Math.max(0, Math.min(unlocked, value.lastChapter)) : 0;
    return { version: 1, answers, reflections, lastChapter };
  } catch { return emptyProgress; }
}

export function gameStats(progress: GameProgress): GameStats {
  const result: GameStats = { ren: 0, zhi: 0, yong: 0 };
  for (const chapter of gameChapters) for (const scene of chapter.scenes) {
    const choice = scene.choices.find((item) => item.id === progress.answers[scene.id]);
    if (choice) for (const key of ["ren", "zhi", "yong"] as const) result[key] += choice.stats[key];
  }
  return result;
}

let memory = emptyProgress;
let previousRaw: string | null | undefined;
const listeners = new Set<() => void>();
export function getProgressSnapshot() {
  try {
    const raw = window.localStorage.getItem(GAME_STORAGE_KEY);
    if (raw !== previousRaw) { previousRaw = raw; memory = parseGameProgress(raw); }
  } catch { /* Keep an in-memory journey when browser storage is unavailable. */ }
  return memory;
}
export function getServerProgressSnapshot() { return emptyProgress; }
export function subscribeProgress(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => { listeners.delete(listener); window.removeEventListener("storage", listener); };
}
export function saveProgress(progress: GameProgress) {
  memory = progress;
  let saved = true;
  try {
    const raw = JSON.stringify(progress);
    window.localStorage.setItem(GAME_STORAGE_KEY, raw);
    previousRaw = raw;
  } catch { saved = false; }
  listeners.forEach((listener) => listener());
  return saved;
}
