#!/usr/bin/env node
/** Extra sitemap asserts for Notes published 2026-09-17. Run after seo-qa.mjs or via npm run qa:seo. */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://www.lunyu.ai";
const sitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
const failures = [];
function assertIncludes(haystack, needle, label) {
  if (!haystack.includes(needle)) failures.push(`${label}: missing ${needle}`);
}
for (const slug of ["how-to-verify-confucius-quotes", "analects-twelve-chapters"]) {
  assertIncludes(sitemap, `${siteUrl}/en/blogs/${slug}`, "sitemap");
  assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/${slug}`, "sitemap");
}
if (!sitemap.includes("2026-09-17")) {
  failures.push("sitemap: expected 2026-09-17 lastmod from newest Notes");
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("seo-qa-notes-2026-09-17: ok");
