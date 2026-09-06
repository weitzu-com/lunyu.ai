#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { geographyPlaces } from "../src/data/geography.ts";
import { geographyImages, geographyImageByPlaceSlug } from "../src/data/geography-images.ts";
import { confuciusBiography } from "../src/data/confucius-biography.ts";
import { discipleBiographies } from "../src/data/disciples-biographies.ts";

const credits = JSON.parse(fs.readFileSync("public/geography/credits.json", "utf8"));
const mapHashes = new Set();
for (const place of geographyPlaces) {
  const svg = fs.readFileSync(`public/geography/maps/${place.slug}.svg`, "utf8");
  assert.ok(svg.includes(`<title id="title">${place.name}`), `${place.slug}: descriptive map title`);
  assert.ok(svg.includes('width="960" height="640"'), `${place.slug}: reserved image dimensions`);
  assert.ok(!/<script|https?:\/\//.test(svg.replace('xmlns="http://www.w3.org/2000/svg"', "")), `${place.slug}: self-contained map`);
  mapHashes.add(createHash("sha256").update(svg).digest("hex"));
  const imageKey = geographyImageByPlaceSlug[place.slug];
  if (imageKey) assert.ok(geographyImages[imageKey], `${place.slug}: valid photo mapping`);
}
assert.equal(mapHashes.size, geographyPlaces.length, "Each location needs its own map/relationship image");
for (const [key, photo] of Object.entries(geographyImages)) {
  assert.ok(photo.alt && photo.caption && photo.creator && photo.license, `${key}: full attribution`);
  for (const field of ["sourceUrl", "licenseUrl"]) assert.equal(new URL(photo[field]).protocol, "https:", `${key}: source/attribution link`);
  const metadata = await sharp(`public${photo.src}`).metadata();
  assert.equal(metadata.width, photo.width, `${key}: photo width`);
  assert.equal(metadata.height, photo.height, `${key}: photo height`);
  assert.equal(metadata.format, "webp", `${key}: local modern image format`);
  const credit = credits.images.find((entry) => entry.id === key);
  assert.ok(credit, `${key}: auditable source record`);
  assert.equal(createHash("sha256").update(fs.readFileSync(`public${photo.src}`)).digest("hex"), credit.sha256, `${key}: source copy integrity`);
  assert.ok(credit.modifications, `${key}: image conversion disclosed`);
}
assert.ok(credits, "Machine-readable photo credits required");

if (process.argv.includes("--built")) {
  const sitemap = fs.readFileSync(".next/server/app/sitemap.xml.body", "utf8");
  const index = fs.readFileSync(".next/server/app/zh-Hans/places.html", "utf8");
  for (const slug of ["", ...geographyPlaces.map((place) => place.slug)]) {
    const pathname = `/zh-Hans/places${slug ? `/${slug}` : ""}`;
    const html = fs.readFileSync(`.next/server/app${pathname}.html`, "utf8");
    assert.ok(html.includes(`rel="canonical" href="https://www.lunyu.ai${pathname}"`), `${pathname}: canonical`);
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${pathname}: exactly one heading`);
    assert.ok(html.includes('lang="zh-Hans"'), `${pathname}: document language`);
    assert.ok(!html.includes('/en/places'), `${pathname}: no nonexistent translation links`);
    assert.ok(sitemap.includes(`${pathname}</loc>`), `${pathname}: discoverable sitemap entry`);
    const schemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    assert.ok(schemas.length, `${pathname}: valid structured data`);
    if (slug) {
      const place = geographyPlaces.find((entry) => entry.slug === slug);
      assert.ok(html.includes(place.summary) && html.includes(place.modernLocation) && html.includes(place.locationNote), `${slug}: complete server-rendered geographic description`);
      for (const paragraph of place.description) assert.ok(html.includes(paragraph), `${slug}: all description paragraphs`);
      assert.ok(html.includes('id="people"'), `${slug}: people connections anchor`);
      assert.ok(index.includes(`href="${pathname}"`), `${slug}: crawlable directory link before hydration`);
      const photo = geographyImages[geographyImageByPlaceSlug[slug]];
      if (photo) assert.ok(html.includes(photo.sourceUrl.replace(/&/g, "&amp;")) && html.includes(photo.licenseUrl), `${slug}: photo attribution rendered`);
      assert.match(html, /<img [^>]*(?:geography|%2Fgeography)/, `${slug}: visible place image`);
    }
  }
  assert.ok(!sitemap.includes("/en/places"), "No untranslated geography routes in sitemap");
  for (const person of [confuciusBiography, ...discipleBiographies]) {
    const html = fs.readFileSync(`.next/server/app/zh-Hans/people/${person.slug}.html`, "utf8");
    assert.ok(html.includes('id="geography"'), `${person.slug}: geography review on every biography`);
  }
}
console.log(`[geography-pages][PASS] ${geographyPlaces.length} distinct maps, ${Object.keys(geographyImages).length} credited local photos${process.argv.includes("--built") ? "; all generated pages, biographies, canonical URLs and sitemap verified" : ""}.`);
