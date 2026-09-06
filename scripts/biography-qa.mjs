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

function decodeHtml(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, code) => {
    if (code[0] !== "#") return named[code.toLowerCase()] ?? entity;
    const number = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
    return number <= 0x10ffff ? String.fromCodePoint(number) : entity;
  });
}

// Inspect real SSR elements and text, never Next's serialized props or JSON-LD.
// This small reader covers the well-formed HTML emitted by React; it is not a
// browser layout/visibility check, which remains part of the interaction review.
function readStaticHtml(html) {
  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  const root = { tag: "document", attributes: {}, children: [], parent: null, position: 0 };
  const stack = [root];
  const elements = [];
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  const tokens = markup.matchAll(/<\/?[a-z][a-z\d:-]*\b(?:"[^"]*"|'[^']*'|[^'">])*\/?\s*>|[^<]+/gi);
  for (const token of tokens) {
    const value = token[0];
    const closing = value.match(/^<\/([a-z][a-z\d:-]*)/i);
    if (closing) {
      const index = stack.findLastIndex((node) => node.tag === closing[1].toLowerCase());
      if (index > 0) stack.length = index;
      continue;
    }
    const opening = value.match(/^<([a-z][a-z\d:-]*)\b/i);
    if (!opening) {
      stack.at(-1).children.push(decodeHtml(value));
      continue;
    }
    const tag = opening[1].toLowerCase();
    const attributes = {};
    const attributeText = value.slice(opening[0].length).replace(/\/?\s*>$/, "");
    for (const attribute of attributeText.matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
      attributes[attribute[1].toLowerCase()] = decodeHtml(attribute[2] ?? attribute[3] ?? attribute[4] ?? "");
    }
    const parent = stack.at(-1);
    const node = { tag, attributes, children: [], parent, position: token.index };
    parent.children.push(node);
    elements.push(node);
    if (!voidTags.has(tag) && !/\/\s*>$/.test(value)) stack.push(node);
  }
  return { root, elements };
}

const textContent = (node) => typeof node === "string" ? node : node.children.map(textContent).join("");
const normalizeText = (value) => value.normalize("NFC").replace(/\s+/g, "");
function within(node, ancestor) {
  for (let current = node; current; current = current.parent) if (current === ancestor) return true;
  return false;
}
function checkText(node, expected, label) {
  assert.ok(normalizeText(textContent(node)).includes(normalizeText(expected)), `${label}: text missing from SSR content: ${expected}`);
}
function checkRenderedCitations(citations, anchors, label) {
  for (const citation of citations) {
    const source = sources.find((item) => item.id === citation.sourceId);
    const expected = normalizeText(`${source.title} · ${citation.locator}`);
    assert.ok(anchors.some((anchor) => anchor.attributes.href === source.url && normalizeText(textContent(anchor)).includes(expected)), `${label}: linked source and passage locator missing: ${source.title} · ${citation.locator}`);
  }
}

if (process.argv.includes("--built")) {
  const base = ".next/server/app/zh-Hans/people";
  for (const slug of ["", ...profiles.map((profile) => profile.slug)]) {
    const file = slug ? `${base}/${slug}.html` : `${base}.html`;
    const html = fs.readFileSync(file, "utf8");
    const path = `/zh-Hans/people${slug ? `/${slug}` : ""}`;
    const { elements } = readStaticHtml(html);
    const main = elements.find((element) => element.tag === "main");
    assert.ok(main, `${path}: a main reading landmark is required`);
    const content = elements.filter((element) => within(element, main));
    const anchors = content.filter((element) => element.tag === "a");
    const elementIds = content.filter((element) => element.attributes.id).map((element) => element.attributes.id);
    assert.equal(new Set(elementIds).size, elementIds.length, `${path}: reading targets must have unique IDs`);
    assert.ok(html.includes(`rel="canonical" href="https://www.lunyu.ai${path}"`), `${path}: self canonical required`);
    assert.ok(!/href="[^\"]*\/en\/people/.test(html), `${path}: must not advertise an untranslated route`);
    assert.ok(html.includes('lang="zh-Hans"'), `${path}: Chinese document language required`);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: one page heading required`);
    const schemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    assert.ok(schemas.length > 0, `${path}: structured data required`);
    if (slug) {
      const profile = profiles.find((item) => item.slug === slug);
      for (const value of [profile.name, profile.summary, profile.lifespan, profile.origin, ...profile.biography, ...profile.aliases]) checkText(main, value, path);
      if (profile.courtesyName) checkText(main, profile.courtesyName, path);
      checkRenderedCitations(profile.citations, anchors, `${path}/biography`);
      for (const event of profile.events) {
        for (const field of ["title", "description", "dateLabel"]) checkText(main, event[field], `${path}/${event.title}`);
        checkRenderedCitations(event.citations, anchors, `${path}/${event.title}`);
      }
      checkText(main, "史料与参考", path);
      assert.ok(elementIds.includes("portrait") && elementIds.includes("works"), `${path}: portrait and works sections must be in static HTML`);
      const sectionNavigation = content.find((element) => element.tag === "nav" && element.attributes["aria-label"]?.includes("本页目录"));
      assert.ok(sectionNavigation, `${path}: provide a named section navigation`);
      const sectionLinks = anchors.filter((anchor) => within(anchor, sectionNavigation) && anchor.attributes.href?.startsWith("#"));
      assert.ok(sectionLinks.length > 1, `${path}: section navigation must offer reading destinations`);
      for (const anchor of sectionLinks) {
        const target = decodeURIComponent(anchor.attributes.href.slice(1));
        assert.ok(elementIds.includes(target), `${path}: section navigation points to missing #${target}`);
        assert.ok((anchor.attributes["aria-label"] || textContent(anchor)).trim(), `${path}: section link needs an accessible name`);
      }
      if (!profile.events.some((event) => event.year !== null)) {
        const datedHeadings = content.filter((element) => /^h[2-6]$/.test(element.tag) && /^(?:按年生平|生平年表)$/.test(normalizeText(textContent(element))));
        assert.equal(datedHeadings.length, 0, `${path}: a person without dates must not show an empty dated timeline`);
        assert.ok(!/(?:按年生平|生平年表)[·：:]?0/.test(normalizeText(textContent(sectionNavigation))), `${path}: do not advertise a zero-event timeline`);
        assert.ok(elementIds.includes("undated") || elementIds.includes("timeline"), `${path}: keep a destination for the surviving records`);
      }
      const portrait = portraits.find((record) => record.slug === slug);
      const writing = writings.find((record) => record.slug === slug);
      checkText(main, portrait.image ? "后世画像 · 非生前写真" : "肖像待考", path);
      checkText(main, portrait.summary, `${path}/portrait`);
      if (portrait.image) {
        for (const field of ["title", "artist", "dateLabel", "collection", "identityNote", "licenseLabel", "credit"]) {
          if (portrait.image[field]) checkText(main, portrait.image[field], `${path}/portrait`);
        }
        for (const field of ["sourceUrl", "licenseUrl", "catalogUrl"]) {
          if (portrait.image[field]) assert.ok(anchors.some((anchor) => anchor.attributes.href === portrait.image[field]), `${path}: preserve portrait ${field}`);
        }
      }
      checkText(main, writing.summary, `${path}/works`);
      checkRenderedCitations(writing.citations, anchors, `${path}/works review`);
      for (const work of writing.works) {
        for (const field of ["title", "attributionLabel", "statusLabel", "dateLabel", "description"]) checkText(main, work[field], `${path}/${work.title}`);
        checkRenderedCitations(work.citations, anchors, `${path}/${work.title}`);
      }
      const usedIds = new Set([...profile.citations, ...profile.events.flatMap((event) => event.citations), ...writing.citations, ...writing.works.flatMap((work) => work.citations)].map((citation) => citation.sourceId));
      for (const source of portraitResearch.sources) usedIds.add(source.id);
      for (const source of sources.filter((item) => usedIds.has(item.id))) {
        checkText(main, source.note, `${path}/${source.id}`);
        assert.ok(anchors.some((anchor) => anchor.attributes.href === source.url && normalizeText(textContent(anchor)).includes(normalizeText(source.title))), `${path}: preserve the reference link for ${source.title}`);
      }
    } else {
      const directory = content.find((element) => element.attributes.id === "directory");
      const chronology = content.find((element) => element.attributes.id === "chronology");
      assert.ok(directory && chronology, `${path}: directory and shared chronology must both render`);
      assert.ok(directory.position < chronology.position, `${path}: place the people directory before the long chronology`);
      const directoryLinks = anchors.filter((anchor) => within(anchor, directory));
      for (const profile of profiles) {
        const link = directoryLinks.find((anchor) => anchor.attributes.href === `/zh-Hans/people/${profile.slug}`);
        assert.ok(link, `${path}: ${profile.name} must have a real link in the unfiltered static directory`);
        checkText(link, profile.name, `${path}/directory/${profile.slug}`);
        for (let ancestor = link; ancestor && ancestor !== main; ancestor = ancestor.parent) {
          assert.ok(!Object.hasOwn(ancestor.attributes, "hidden") && ancestor.attributes["aria-hidden"] !== "true", `${path}: ${profile.name} must not be hidden from the directory`);
        }
      }
    }
  }
  const sitemap = fs.readFileSync(".next/server/app/sitemap.xml.body", "utf8");
  for (const profile of profiles) assert.ok(sitemap.includes(`/zh-Hans/people/${profile.slug}</loc>`), `${profile.slug}: missing from sitemap`);
  assert.ok(!sitemap.includes("/en/people"), "Chinese-only pages must not create English sitemap entries");
}
console.log(`[biography][PASS] ${profiles.length} people, ${dated} dated events, ${undated} unplaced events, ${sources.length} sources; ${imageUrls.length} attributed portraits, ${writings.length} works reviews${process.argv.includes("--built") ? "; static directory, section destinations, complete evidence text and sitemap verified" : ""}.`);
