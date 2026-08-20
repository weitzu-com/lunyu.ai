/**
 * Pure helpers for the 温故知新 loop. No "use client" — safe to import from
 * server components (e.g. the home page picks the daily passage during SSR)
 * and from the client `ReadingCircle` component alike.
 */

/**
 * Returns a stable sentence id for the day. Cycles through all 499 in
 * day-of-year modulo 499, so every day the visitor gets a different passage.
 * Trade-off: a visitor in Tokyo at 23:00 sees the next day's passage while
 * one in New York at 09:00 still sees today's. This is intentional —
 * 温故知新 is a daily ritual, not a synchronized timer.
 */
export function passageOfTheDayId(
  allIds: string[],
  now: Date = new Date()
): string {
  if (allIds.length === 0) return "";
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return allIds[dayOfYear % allIds.length];
}
