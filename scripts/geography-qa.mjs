#!/usr/bin/env node
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { geographyPlaces, geographyConnections } from "../src/data/geography.ts";
import { confuciusBiography } from "../src/data/confucius-biography.ts";
import { discipleBiographies } from "../src/data/disciples-biographies.ts";

// Resolve the app's existing @/ imports for Node's native TypeScript loader.
// No generated fixture or duplicate copy of the production API is tested.
registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(specifier.startsWith("@/") ? new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href : specifier, context);
} });
const { geographyCoverage, geographySources, getGeographyPlace, getPlaceConnections, getPersonPlaces } = await import("../src/lib/geography.ts");
const profiles = [confuciusBiography, ...discipleBiographies];
const personIds = new Set(profiles.map((person) => person.slug));
const placeIds = new Set(geographyPlaces.map((place) => place.slug));
const sourceIds = new Set(geographySources.map((source) => source.id));
assert.equal(profiles.length, 78, "Re-review geography coverage when the roster changes");
assert.equal(placeIds.size, geographyPlaces.length, "Geographical concepts require unique URLs");
assert.equal(sourceIds.size, geographySources.length, "Citation source IDs must be unique");
assert.equal(geographyCoverage.length, profiles.length, "Every person needs an explicit review status");
assert.deepEqual(new Set(geographyCoverage.map((row) => row.personSlug)), personIds, "Coverage must match the complete person roster");

function citations(value, label) {
  assert.ok(value.length, `${label}: citation required`);
  for (const item of value) {
    assert.ok(sourceIds.has(item.sourceId), `${label}: missing source ${item.sourceId}`);
    assert.ok(item.locator.trim(), `${label}: passage locator required`);
  }
}
for (const source of geographySources) assert.equal(new URL(source.url).protocol, "https:", `${source.id}: HTTPS citation required`);
for (const place of geographyPlaces) {
  assert.match(place.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  for (const field of ["name", "summary", "modernLocation", "locationNote"]) assert.ok(place[field]?.trim(), `${place.slug}: ${field} required`);
  assert.ok(place.description.length >= 2 && place.description.every((paragraph) => paragraph.trim()), `${place.slug}: substantive descriptions required`);
  assert.ok(["state", "settlement", "landscape", "region", "site"].includes(place.kind));
  for (const parent of place.parentSlugs) assert.ok(placeIds.has(parent) && parent !== place.slug, `${place.slug}: invalid parent`);
  if (place.coordinates) {
    assert.ok(Number.isFinite(place.coordinates.latitude) && Math.abs(place.coordinates.latitude) <= 90);
    assert.ok(Number.isFinite(place.coordinates.longitude) && Math.abs(place.coordinates.longitude) <= 180);
  }
  citations(place.citations, place.slug);
  assert.ok(getPlaceConnections(place.slug).length, `${place.slug}: orphan geographical page`);
  assert.equal(getGeographyPlace(place.slug), place);
}
const connectionKeys = new Set();
for (const connection of geographyConnections) {
  const key = [connection.personSlug, connection.placeSlug, connection.relation, connection.title].join("/");
  assert.ok(!connectionKeys.has(key), `Duplicate evidence card: ${key}`);
  connectionKeys.add(key);
  assert.ok(personIds.has(connection.personSlug), `${key}: unknown person`);
  assert.ok(placeIds.has(connection.placeSlug), `${key}: unknown place`);
  assert.ok(["activity", "origin", "mentioned", "planned"].includes(connection.relation));
  assert.ok(connection.title.trim() && connection.description.trim());
  if (connection.certainty) assert.ok(["recorded", "approximate", "disputed", "undated"].includes(connection.certainty));
  assert.ok(["explicit", "contextual"].includes(connection.evidence));
  citations(connection.citations, key);
}
for (const row of geographyCoverage) {
  const actual = geographyConnections.filter((connection) => connection.personSlug === row.personSlug);
  assert.ok(row.reason.trim());
  assert.deepEqual(new Set(row.placeSlugs), new Set(actual.map((connection) => connection.placeSlug)));
  assert.deepEqual(new Set(getPersonPlaces(row.personSlug).map((place) => place.slug)), new Set(row.placeSlugs));
  assert.equal(row.status === "unlocated", actual.length === 0);
  if (row.status === "mentioned-only") assert.ok(actual.every((connection) => connection.relation === "mentioned"));
}

// Regression checks for common historical-geography errors. These assertions
// test evidence semantics, not just the shape of the implementation.
const forPersonPlace = (person, place) => geographyConnections.filter((item) => item.personSlug === person && item.placeSlug === place);
const hasRelation = (person, place, relation) => forPersonPlace(person, place).some((item) => item.relation === relation);
assert.equal(getPersonPlaces("zheng-guo").length, 0, "The disciple Zheng Guo is not evidence of a visit to Zheng state");
for (const person of ["qin-zu", "qin-ran", "qin-shang", "qin-fei", "cao-xu", "zuoren-ying", "ran-ru"]) assert.equal(getPersonPlaces(person).length, 0, `${person}: never derive places from a name`);
assert.ok(hasRelation("ran-qiu", "song", "activity"), "Ran Qiu's dated funeral mission to Song must be covered");
assert.ok(hasRelation("ran-yong", "lu", "activity"), "Zhonggong's Ji-family office must be reviewed in its explicit Lu context");
assert.ok(!hasRelation("zhong-you", "chu", "activity") && hasRelation("zhong-you", "chu", "mentioned"), "Chen Guan went to Chu; Zilu met him in Wei");
assert.ok(!hasRelation("shang-qu", "chu", "activity") && hasRelation("shang-qu", "chu", "mentioned"), "A pupil's Chu origin does not locate Shang Qu in Chu");
for (const slug of ["zengyan", "fayang"]) assert.ok(!hasRelation("gao-chai", slug, "activity") && hasRelation("gao-chai", slug, "mentioned"), "Quoted alliance precedents are not Gao Chai's travels");
for (const slug of ["yi-river", "wuyu"]) assert.ok(hasRelation("zeng-dian", slug, "planned") && !hasRelation("zeng-dian", slug, "activity"), "Zeng Dian described an aspiration, not a dated excursion");
for (const person of ["fan-xu", "confucius"]) assert.ok(hasRelation(person, "wuyu", "activity"), "Fan Chi's actual Wuyu dialogue is independent from Zeng Dian's aspiration");
assert.ok(hasRelation("bu-shang", "jufu", "activity"), "Zixia's explicitly recorded Jufu office must be covered");
assert.ok(placeIds.has("fang-yi") && placeIds.has("fangshan"), "Zang Wuzhong's Fang estate must not be silently merged with the Fang burial mountain");
for (const slug of ["fei", "wen-river"]) assert.ok(hasRelation("min-sun", slug, "planned") && !hasRelation("min-sun", slug, "activity"), "Min Sun's declined office and conditional retreat are not completed activities");
assert.ok(hasRelation("confucius", "jin", "planned") && !hasRelation("confucius", "jin", "activity"), "Confucius turned back at the river; a planned destination is not a visit");
assert.ok(hasRelation("confucius", "huan-xi-temples", "mentioned") && !hasRelation("confucius", "huan-xi-temples", "activity"), "Confucius heard of the Lu temple fire while in Chen");
assert.ok(hasRelation("zai-yu", "qi", "mentioned") && !hasRelation("zai-yu", "qi", "activity"), "The Zai Yu / Kan Zhi confusion must not become an established visit");
assert.ok(placeIds.has("wei") && placeIds.has("wei-warring-states"), "Wei 衛 and Wei 魏 must remain distinct");
assert.ok(placeIds.has("wucheng") && placeIds.has("nanwucheng"), "Do not silently collapse uncertain Wucheng identifications");
for (const slug of ["qufu", "shandong"]) assert.ok(getPlaceConnections(slug).every((item) => item.relation === "mentioned"), "Modern reference regions are not ancient administrative visits");
for (const slug of ["kuang", "pu"]) assert.ok(hasRelation("gongliang-ru", slug, "activity"), "Cross-chapter evidence for Gongliang Ru must be preserved");

const byStatus = Object.fromEntries(["documented", "mentioned-only", "unlocated"].map((status) => [status, geographyCoverage.filter((row) => row.status === status).length]));
const byRelation = Object.fromEntries(["activity", "origin", "mentioned", "planned"].map((relation) => [relation, geographyConnections.filter((row) => row.relation === relation).length]));
console.log(JSON.stringify({ peopleReviewed: profiles.length, places: geographyPlaces.length, connections: geographyConnections.length, coverage: byStatus, relations: byRelation }, null, 2));
