"use client";

import {
  MEASUREMENT_ID,
  claimPageView,
  isProductionMeasurementHost,
  measurementParams,
  pageViewPath,
  type MeasurementEvent,
} from "@/lib/measurement";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __lunyuGaInit?: boolean;
    __lunyuPageViews?: Set<string>;
  }
}

function ensureMeasurement() {
  if (window.__lunyuGaInit) return;
  window.__lunyuGaInit = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  // The default config pageview is off. A later call records one path once.
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function measurementAllowed() {
  if (typeof window === "undefined") return false;
  const hostname = window.location?.hostname ?? "";
  return isProductionMeasurementHost(hostname);
}

export function recordPageView(pathname: string) {
  if (!measurementAllowed()) return;
  const path = pageViewPath(pathname);
  const seen = (window.__lunyuPageViews ??= new Set<string>());
  if (!claimPageView(seen, path)) return;
  ensureMeasurement();
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    send_to: MEASUREMENT_ID,
  });
}

export function trackMeasurement(event: MeasurementEvent) {
  if (!measurementAllowed()) return;
  const params = measurementParams(event);
  if (!params) return;
  ensureMeasurement();
  window.gtag?.("event", event.name, params);
}
