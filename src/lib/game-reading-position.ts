import { gameChapters } from "@/data/confucius-game";
import type { GameProgress } from "@/lib/game-progress";

export type ReadingPosition = {
  chapterIndex: number;
  sceneIndex: number;
  summary: boolean;
};

const storageKey = "lunyu-game-reading-position-v1";
const scenes = gameChapters.flatMap((chapter) => chapter.scenes);

// Compare the entire ordered answer prefix exactly. A reset, a changed choice,
// or progress from another tab must not revive a stale reading position.
// Reflections and account identifiers never enter this tab-local bookmark.
function answerPrefix(progress: GameProgress): string | null {
  if (!progress || progress.version !== 1 || !progress.answers || typeof progress.answers !== "object" || Array.isArray(progress.answers)) return null;
  const prefix: [string, string][] = [];
  let foundGap = false;
  for (const scene of scenes) {
    const choice = progress.answers[scene.id];
    if (choice === undefined) { foundGap = true; continue; }
    if (foundGap || !scene.choices.some((item) => item.id === choice)) return null;
    prefix.push([scene.id, choice]);
  }
  if (Object.keys(progress.answers).length !== prefix.length) return null;
  return JSON.stringify(prefix);
}

function validPosition(value: unknown, progress: GameProgress): value is ReadingPosition {
  if (!value || typeof value !== "object") return false;
  const position = value as ReadingPosition;
  if (!Number.isInteger(position.chapterIndex) || !Number.isInteger(position.sceneIndex) || typeof position.summary !== "boolean") return false;
  const chapter = gameChapters[position.chapterIndex];
  const scene = chapter?.scenes[position.sceneIndex];
  if (!chapter || !scene) return false;
  const target = scenes.findIndex((item) => item.id === scene.id);
  const firstUnanswered = scenes.findIndex((item) => !progress.answers[item.id]);
  if (firstUnanswered !== -1 && target > firstUnanswered) return false;
  return !position.summary || (position.sceneIndex === chapter.scenes.length - 1 && chapter.scenes.every((item) => !!progress.answers[item.id]));
}

/** Restore this tab's last reading point; callers retain their normal fallback. */
export function readReadingPosition(progress: GameProgress): ReadingPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return null;
    const value = JSON.parse(raw);
    const prefix = answerPrefix(progress);
    if (!value || value.version !== 1 || prefix === null || value.answerPrefix !== prefix || !validPosition(value.position, progress)) {
      clearReadingPosition();
      return null;
    }
    const { chapterIndex, sceneIndex, summary } = value.position as ReadingPosition;
    return { chapterIndex, sceneIndex, summary };
  } catch {
    clearReadingPosition();
    return null;
  }
}

/** Call with the updated progress after a choice, and whenever reading advances. */
export function writeReadingPosition(position: ReadingPosition, progress: GameProgress): boolean {
  if (typeof window === "undefined") return false;
  try {
    const prefix = answerPrefix(progress);
    if (prefix === null || !validPosition(position, progress)) {
      clearReadingPosition();
      return false;
    }
    const { chapterIndex, sceneIndex, summary } = position;
    window.sessionStorage.setItem(storageKey, JSON.stringify({ version: 1, position: { chapterIndex, sceneIndex, summary }, answerPrefix: prefix }));
    return true;
  } catch {
    clearReadingPosition();
    return false;
  }
}

/** Clear on an explicit restart or account/cloud replacement, even if answers match. */
export function clearReadingPosition(): void {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.removeItem(storageKey); } catch { /* A blocked browser store must never block play. */ }
}
