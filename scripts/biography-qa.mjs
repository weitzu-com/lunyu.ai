#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { confuciusBiography, confuciusSources } from "../src/data/confucius-biography.ts";
import { discipleBiographies, discipleSources } from "../src/data/disciples-biographies.ts";

const profiles = [confuciusBiography, ...discipleBiographies];
const portraitResearch = JSON.parse(fs.readFileSync("src/data/biography-portrait-research.json", "utf8"));
const portraits = portraitResearch.records;
const worksResearch = JSON.parse(fs.readFileSync("src/data/biography-works-research.json", "utf8"));
const writings = worksResearch.records;
const sources = [...confuciusSources, ...discipleSources, ...worksResearch.sources, ...portraitResearch.sources];
const ids = new Set(sources.map((source) => source.id));
assert.equal(discipleBiographies.length, 77, "The Shiji roster must contain 77 disciples");
assert.equal(new Set(profiles.map((profile) => profile.slug)).size, profiles.length, "Profile URLs must be unique");
assert.equal(new Set(discipleBiographies.map((profile) => profile.name)).size, 77, "Do not count aliases as separate disciples");
assert.equal(ids.size, sources.length, "Source IDs must be unique");

for (const source of sources) {
  assert.equal(new URL(source.url).protocol, "https:", `${source.id}: use an HTTPS source`);
  assert.ok(source.title && source.note, `${source.id}: describe the source and its limits`);
}
function checkCitations(citations, label) {
  assert.ok(citations.length, `${label}: citation required`);
  for (const citation of citations) {
    assert.ok(ids.has(citation.sourceId), `${label}: missing source ${citation.sourceId}`);
    assert.ok(citation.locator.trim(), `${label}: volume/chapter/passage locator required`);
  }
}
let dated = 0;
let undated = 0;
for (const records of [portraits, writings]) {
  assert.equal(records.length, profiles.length, "Every person requires an explicit evidence review");
  assert.equal(new Set(records.map((record) => record.slug)).size, profiles.length, "Evidence records must be unique");
  assert.ok(records.every((record) => profiles.some((profile) => profile.slug === record.slug)), "Evidence must use roster IDs");
}
const imageUrls = portraits.filter((record) => record.image).map((record) => record.image.src);
assert.equal(new Set(imageUrls).size, imageUrls.length, "Do not reuse another person's portrait");
for (const profile of profiles) {
  const portrait = portraits.find((record) => record.slug === profile.slug);
  const writing = writings.find((record) => record.slug === profile.slug);
  assert.ok(portrait.summary?.trim() && writing.summary?.trim(), `${profile.name}: explain the evidence review`);
  assert.ok(["verified", "unverified"].includes(portrait.status), `${profile.name}: explicit portrait status required`);
  assert.equal(Boolean(portrait.image), portrait.status === "verified", `${profile.name}: only verified portrayals may be displayed`);
  if (portrait.image) {
    const image = portrait.image;
    for (const field of ["title", "artist", "dateLabel", "collection", "identityNote", "licenseLabel"]) assert.ok(image[field]?.trim(), `${profile.name}: image ${field} required`);
    for (const field of ["src", "sourceUrl", "licenseUrl"]) assert.equal(new URL(image[field]).protocol, "https:", `${profile.name}: secure image attribution URLs required`);
    assert.match(image.assetPath, /^\/portraits\/[a-z0-9-]+\.jpg$/, `${profile.name}: local portrait asset required`);
    const asset = fs.readFileSync(`public${image.assetPath}`);
    assert.equal(asset.subarray(0, 3).toString("hex"), "ffd8ff", `${profile.name}: portrait must be a real JPEG`);
    assert.equal(createHash("sha256").update(asset).digest("hex"), image.sha256, `${profile.name}: portrait must match its audited source copy`);
    assert.ok(image.width > 0 && image.height > 0, `${profile.name}: reserve portrait dimensions`);
  }
  checkCitations(writing.citations, `${profile.name}/works review`);
  for (const work of writing.works) {
    for (const field of ["title", "attributionLabel", "statusLabel", "dateLabel", "description"]) assert.ok(work[field]?.trim(), `${profile.name}/${work.title}: ${field} required`);
    checkCitations(work.citations, `${profile.name}/${work.title}`);
  }
  assert.match(profile.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${profile.name}: stable readable URL`);
  for (const field of ["name", "group", "lifespan", "origin", "summary"]) assert.ok(profile[field]?.trim(), `${profile.slug}: missing ${field}`);
  assert.ok(profile.biography.length && profile.events.length, `${profile.name}: biography and recorded evidence required`);
  checkCitations(profile.citations, profile.name);
  for (const event of profile.events) {
    const label = `${profile.name}/${event.title}`;
    assert.ok(event.title && event.description && event.dateLabel, `${label}: complete event text required`);
    assert.ok(["recorded", "approximate", "disputed", "undated"].includes(event.certainty), `${label}: chronology classification required`);
    checkCitations(event.citations, label);
    if (event.year === null) {
      undated++;
      assert.ok(["undated", "disputed"].includes(event.certainty), `${label}: unplaced events must disclose uncertainty`);
      assert.equal(event.endYear, undefined, `${label}: range requires a start year`);
    } else {
      dated++;
      assert.ok(Number.isInteger(event.year) && event.year < 0, `${label}: BCE years must be negative integers`);
      assert.notEqual(event.certainty, "undated", `${label}: dated event marked undated`);
      if (event.endYear !== undefined) assert.ok(Number.isInteger(event.endYear) && event.endYear < 0 && event.endYear >= event.year, `${label}: invalid BCE range`);
    }
  }
}

if (process.argv.includes("--built")) {
  const base = ".next/server/app/zh-Hans/people";
  for (const slug of ["", ...profiles.map((profile) => profile.slug)]) {
    const file = slug ? `${base}/${slug}.html` : `${base}.html`;
    const html = fs.readFileSync(file, "utf8");
    const path = `/zh-Hans/people${slug ? `/${slug}` : ""}`;
    assert.ok(html.includes(`rel="canonical" href="https://www.lunyu.ai${path}"`), `${path}: self canonical required`);
    assert.ok(!/href="[^\"]*\/en\/people/.test(html), `${path}: must not advertise an untranslated route`);
    assert.ok(html.includes('lang="zh-Hans"'), `${path}: Chinese document language required`);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: one page heading required`);
    const schemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    assert.ok(schemas.length > 0, `${path}: structured data required`);
    if (slug) {
      const profile = profiles.find((item) => item.slug === slug);
      assert.ok(html.includes(profile.name) && html.includes(profile.summary), `${path}: biography must be present in static HTML`);
      for (const event of profile.events) assert.ok(html.includes(event.title), `${path}: every event must render`);
      assert.ok(html.includes("史料与参考"), `${path}: references must render`);
      assert.ok(html.includes('id="portrait"') && html.includes('id="works"'), `${path}: portrait and works sections must be in static HTML`);
      const portrait = portraits.find((record) => record.slug === slug);
      const writing = writings.find((record) => record.slug === slug);
      assert.ok(html.includes(portrait.image ? "后世画像 · 非生前写真" : "肖像待考"), `${path}: disclose the status of the likeness`);
      assert.ok(html.includes(writing.summary), `${path}: works assessment must render`);
      for (const work of writing.works) assert.ok(html.includes(work.title) && html.includes(work.attributionLabel), `${path}: show work attribution`);
    }
  }
  const sitemap = fs.readFileSync(".next/server/app/sitemap.xml.body", "utf8");
  for (const profile of profiles) assert.ok(sitemap.includes(`/zh-Hans/people/${profile.slug}</loc>`), `${profile.slug}: missing from sitemap`);
  assert.ok(!sitemap.includes("/en/people"), "Chinese-only pages must not create English sitemap entries");
}
console.log(`[biography][PASS] ${profiles.length} people, ${dated} dated events, ${undated} unplaced events, ${sources.length} sources; ${imageUrls.length} attributed portraits, ${writings.length} works reviews${process.argv.includes("--built") ? "; all static pages and sitemap verified" : ""}.`);
