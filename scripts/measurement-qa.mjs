#!/usr/bin/env node
import {
  claimPageView,
  isProductionMeasurementHost,
  measurementParams,
  pageViewPath,
  PRODUCTION_MEASUREMENT_HOSTS,
} from "../src/lib/measurement.ts";

let failed = 0;
function fail(message) {
  failed += 1;
  console.error(`fail: ${message}`);
}

for (const host of PRODUCTION_MEASUREMENT_HOSTS) {
  if (!isProductionMeasurementHost(host)) fail(`${host} should measure`);
  if (!isProductionMeasurementHost(host.toUpperCase())) fail(`${host} should be case-insensitive`);
}
for (const host of [
  "localhost",
  "lunyu.ai.vercel.app",
  "lunyu-ai.vercel.app",
  "preview.lunyu.ai.vercel.app",
  "www.laotzu.ai",
  "www.sun-tzu.ai",
  "evil-lunyu.ai",
  "lunyu.ai.evil.example",
  "",
]) {
  if (isProductionMeasurementHost(host)) fail(`${host || "(empty)"} must not measure`);
}

if (pageViewPath("/en") !== "/en") fail("english home path");
if (pageViewPath("/en/analects/xue-er/xue-er-001") !== "/en/analects/xue-er/xue-er-001") {
  fail("passage path");
}
for (const blocked of ["/en?q=person@example.com", "/en#listen", "https://www.lunyu.ai/en", "//www.lunyu.ai/en", "/en/../secret"]) {
  if (pageViewPath(blocked) !== null) fail(`path should be rejected: ${blocked}`);
}

const seen = new Set();
if (!claimPageView(seen, "/en")) fail("first pageview should send");
if (claimPageView(seen, "/en")) fail("same path must not send twice");
if (!claimPageView(seen, "/en/listen")) fail("a new path should send");
if (claimPageView(seen, null)) fail("null path must not send");

const listen = measurementParams({
  name: "listen_play",
  passage_id: "xue-er-001",
  book_slug: "xue-er",
});
if (!listen || listen.passage_id !== "xue-er-001" || "name" in listen) fail("listen params");

const reflect = measurementParams({
  name: "reader_reflect",
  passage_id: "wei-zheng-001",
  prompt_kind: "preset",
});
if (!reflect || reflect.prompt_kind !== "preset") fail("reader params");

const game = measurementParams({
  name: "game_choice",
  scene_id: "the-first-mistake",
  choice_id: "work-and-listen",
});
if (!game) fail("game params");

for (const event of [
  { name: "listen_play", passage_id: "user@example.com", book_slug: "xue-er" },
  { name: "reader_reflect", passage_id: "xue-er-001", prompt_kind: "what is my email address" },
  { name: "game_start", mode: "New" },
  { name: "game_choice", scene_id: "the-first-mistake", choice_id: "../admin" },
]) {
  if (measurementParams(event) !== null) fail(`unsafe event should be dropped: ${JSON.stringify(event)}`);
}

if (failed) {
  console.error(`${failed} measurement check(s) failed`);
  process.exit(1);
}
console.log("measurement qa ok");
