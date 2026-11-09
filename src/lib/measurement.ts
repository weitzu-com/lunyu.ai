/**
 * Runtime measurement for lunyu.ai only.
 *
 * The installed `@next/third-parties` GoogleAnalytics tag calls
 * `gtag('config', id)` with the default `send_page_view: true`. That config
 * sends a pageview every time it runs. A second manual pageview, or a second
 * execution of the same config on hydration, counts the same view twice.
 * This module keeps the rules testable without loading gtag.
 *
 * Events here are reader, listen, and game actions. They are not purchases,
 * leads, or key-event stand-ins, and they carry no account or free-text fields.
 */

export const MEASUREMENT_ID = "G-7KQTRXVXF4";

/** Hosts allowed to send hits to the lunyu property. Preview and other sites stay out. */
export const PRODUCTION_MEASUREMENT_HOSTS = ["www.lunyu.ai", "lunyu.ai"] as const;

const TOKEN = /^[a-z0-9][a-z0-9-]{0,79}$/;
const PAGE_PATH = /^\/[A-Za-z0-9/_-]{0,180}$/;

export type MeasurementEvent =
  | { name: "listen_play"; passage_id: string; book_slug: string }
  | { name: "reader_reflect"; passage_id: string; prompt_kind: "preset" | "written" }
  | { name: "game_start"; mode: "new" | "resume" | "review" }
  | { name: "game_choice"; scene_id: string; choice_id: string };

export function isProductionMeasurementHost(hostname: string) {
  const host = hostname.trim().toLowerCase().replace(/\.$/, "");
  return (PRODUCTION_MEASUREMENT_HOSTS as readonly string[]).includes(host);
}

/** Browser path only. Query strings are dropped so measurement cannot carry addresses or tokens. */
export function pageViewPath(pathname: string) {
  if (!PAGE_PATH.test(pathname)) return null;
  return pathname;
}

export function claimPageView(seen: Set<string>, path: string | null) {
  if (!path || seen.has(path)) return false;
  seen.add(path);
  return true;
}

export function measurementParams(event: MeasurementEvent): Record<string, string> | null {
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(event)) {
    if (key === "name") continue;
    if (typeof value !== "string" || !TOKEN.test(value)) return null;
    params[key] = value;
  }
  return params;
}
