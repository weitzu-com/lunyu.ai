#!/usr/bin/env node
/**
 * Restore seo-qa.mjs from a known-good ancestor commit, then apply the
 * 2026-09-17 Notes deltas (all-editorial-posts + sitemap asserts + lastmod).
 * CI checks out with fetch-depth: 0, so git show works.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const STOCK_REF = "89631c2294b60aee12e1fc7d208fa610690bd885";

let code = execFileSync("git", ["show", `${STOCK_REF}:scripts/seo-qa.mjs`], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 20 * 1024 * 1024,
});

const replacements = [
  [
    'const postSource = read("src/lib/editorial-posts.ts");',
    'const postSource = read("src/lib/editorial-posts.ts") + read("src/lib/all-editorial-posts.ts");',
  ],
  [
    "assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects`, \"sitemap\");\nfor (const slug of intentHubSlugs)",
    "assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects`, \"sitemap\");\nassertIncludes(sitemap, `${siteUrl}/en/blogs/how-to-verify-confucius-quotes`, \"sitemap\");\nassertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/how-to-verify-confucius-quotes`, \"sitemap\");\nassertIncludes(sitemap, `${siteUrl}/en/blogs/analects-twelve-chapters`, \"sitemap\");\nassertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/analects-twelve-chapters`, \"sitemap\");\nfor (const slug of intentHubSlugs)",
  ],
  [
    "if (!lastmod.includes(\"2026-09-16\")) {\n    fail(`sitemap: /${locale}/blogs lastmod should follow newest editorial post, got ${lastmod || \"missing\"}`);",
    "if (!lastmod.includes(\"2026-09-17\")) {\n    fail(`sitemap: /${locale}/blogs lastmod should follow newest editorial post, got ${lastmod || \"missing\"}`);",
  ],
  [
    'const newestEditorialLastmod = "2026-09-16";',
    'const newestEditorialLastmod = "2026-09-17";',
  ],
];

for (const [from, to] of replacements) {
  if (!code.includes(from)) {
    console.error("seo-qa restore: patch needle missing:\n" + from.slice(0, 120));
    process.exit(1);
  }
  code = code.replace(from, to);
}

const tmp = path.join(here, ".seo-qa.decoded.mjs");
fs.writeFileSync(tmp, code);
const result = spawnSync(process.execPath, [tmp], { stdio: "inherit", cwd: root });
try {
  fs.unlinkSync(tmp);
} catch {}
process.exit(result.status ?? 1);
