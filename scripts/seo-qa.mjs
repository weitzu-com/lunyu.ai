#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://www.lunyu.ai";
const locales = ["zh-Hans", "en"];
const trustPages = ["about", "method", "sources", "faq"];
const stableLastmod = "2026-08-20";
const aiCrawlers = [
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "OAI-SearchBot",
  "anthropic-ai",
  "ChatGPT-User",
  "Bytespider",
  "CCBot",
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function assertIncludes(haystack, needle, label) {
  if (!haystack.includes(needle)) fail(`${label}: missing ${needle}`);
}

function htmlPath(route) {
  const normalized = route.replace(/^\//, "");
  return `.next/server/app/${normalized}.html`;
}

function checkHtml(route, expectations) {
  const file = htmlPath(route);
  if (!exists(file)) {
    fail(`${route}: build HTML missing at ${file}`);
    return;
  }
  const html = read(file);
  for (const expected of expectations) assertIncludes(html, expected, route);
  if (/<title>[^<]*lunyu\.ai\s*·\s*lunyu\.ai/.test(html)) {
    fail(`${route}: duplicate title suffix`);
  }
  if (!html.includes('rel="canonical"')) fail(`${route}: canonical missing`);
  if (!html.includes('hrefLang="x-default"')) fail(`${route}: x-default hreflang missing`);
  if (!html.includes('application/ld+json')) fail(`${route}: JSON-LD missing`);
}

function extractMetaDescription(html) {
  const match = html.match(/<meta name="description" content="([^"]*)"/);
  return match ? match[1] : "";
}

function countRegex(text, regex) {
  return [...text.matchAll(regex)].length;
}

const generated = JSON.parse(read("src/data/analects.generated.json"));
const reviewed = JSON.parse(read("src/data/modern-chinese.reviewed.json"));
const packageJson = JSON.parse(read("package.json"));
const envExample = read(".env.example");
const ciWorkflow = read(".github/workflows/ci.yml");
const sentences = generated.books.flatMap((book) => book.sentences);
const reviewedCount = Object.keys(reviewed.translations || {}).length;
const indexSource = read("src/lib/blogs.ts");
const postSource = read("src/lib/editorial-posts.ts");
const chatRouteSource = read("src/app/api/chat/route.ts");
const nextConfigSource = read("next.config.ts");
const vercelConfig = JSON.parse(read("vercel.json"));
const routesManifest = JSON.parse(read(".next/routes-manifest.json"));
const indexCount = countRegex(indexSource, /slug:\s*"[^"]+"/g);
const postCount = countRegex(postSource, /slug:\s*"[^"]+"/g);
const listenBookPageCount = Math.max(generated.books.length - 1, 0);

if (generated.books.length !== 20) fail(`content: expected 20 books, got ${generated.books.length}`);
if (sentences.length !== 499) fail(`content: expected 499 passages, got ${sentences.length}`);
if (new Set(sentences.map((s) => s.id)).size !== sentences.length) fail("content: duplicate passage IDs");
if (reviewedCount !== sentences.length) fail(`content: reviewed guide ${reviewedCount}/${sentences.length}`);
if (sentences.some((s) => !s.english?.trim())) fail("content: missing English translation");
if (sentences.some((s) => !Array.isArray(s.notes) || s.notes.length === 0)) fail("content: missing notes");

assertIncludes(envExample, `NEXT_PUBLIC_SITE_URL=${siteUrl}`, ".env.example");
assertIncludes(packageJson.engines?.node ?? "", ">=24 <27", "package engines");
assertIncludes(ciWorkflow, "node-version: 24", "GitHub CI Node version");
assertIncludes(ciWorkflow, `NEXT_PUBLIC_SITE_URL: ${siteUrl}`, "GitHub CI canonical host");

checkHtml("/zh-Hans", [
  '<html lang="zh-Hans"',
  `rel="canonical" href="${siteUrl}/zh-Hans"`,
  `hrefLang="en" href="${siteUrl}/en"`,
  '"@type":"WebSite"',
  '"@type":"Organization"',
  '"sameAs"',
]);

checkHtml("/en", [
  '<html lang="en"',
  `rel="canonical" href="${siteUrl}/en"`,
  `hrefLang="zh-Hans" href="${siteUrl}/zh-Hans"`,
  '"@type":"WebSite"',
]);

checkHtml("/zh-Hans/analects/xue-er/xue-er-001", [
  `rel="canonical" href="${siteUrl}/zh-Hans/analects/xue-er/xue-er-001"`,
  `hrefLang="en" href="${siteUrl}/en/analects/xue-er/xue-er-001"`,
  '"@type":"Article"',
  '"datePublished":"2026-07-06"',
  '"dateModified":"2026-08-20"',
  '"isAccessibleForFree":true',
  '"license"',
  '"hasPart"',
  "/zh-Hans/sources",
  "/zh-Hans/method#corrections",
]);

checkHtml("/zh-Hans/listen", ['"@type":"CollectionPage"', '"@type":"ItemList"', '"@type":"AudioObject"', '"@type":"BreadcrumbList"']);
checkHtml("/en/listen", ['"@type":"CollectionPage"', '"@type":"ItemList"', '"@type":"AudioObject"', '"@type":"BreadcrumbList"']);
checkHtml("/zh-Hans/listen/wei-zheng", ['"@type":"CollectionPage"', '"@type":"ItemList"', '"@type":"AudioObject"', '"@type":"BreadcrumbList"']);

const seenSentenceDescriptions = new Map();
for (const locale of locales) {
  for (const sentence of sentences) {
    const route = `/${locale}/analects/${sentence.bookSlug}/${sentence.id}`;
    const file = htmlPath(route);
    if (!exists(file)) {
      fail(`${route}: build HTML missing at ${file}`);
      continue;
    }
    const html = read(file);
    const description = extractMetaDescription(html);
    if (!description) {
      fail(`${route}: meta description missing`);
      continue;
    }
    const previousRoute = seenSentenceDescriptions.get(description);
    if (previousRoute && previousRoute !== route) {
      fail(`duplicate description: ${route} and ${previousRoute}`);
    } else {
      seenSentenceDescriptions.set(description, route);
    }
  }
}

for (const trust of trustPages) {
  checkHtml(`/zh-Hans/${trust}`, [
    `rel="canonical" href="${siteUrl}/zh-Hans/${trust}"`,
    '"@type":"BreadcrumbList"',
  ]);
  checkHtml(`/en/${trust}`, [
    `rel="canonical" href="${siteUrl}/en/${trust}"`,
    '"@type":"BreadcrumbList"',
  ]);
}

checkHtml("/zh-Hans/faq", ['"@type":"FAQPage"', '"@type":"Question"', '"acceptedAnswer"']);
checkHtml("/en/index/confucius", ['"@type":"WebPage"', '"@type":"BreadcrumbList"', '"about"']);
checkHtml("/zh-Hans/index", [`rel="canonical" href="${siteUrl}/zh-Hans/index"`, "知识索引"]);
checkHtml("/zh-Hans/blogs", [`rel="canonical" href="${siteUrl}/zh-Hans/blogs"`, '"@type":"CollectionPage"', "论语阅读札记"]);
checkHtml("/zh-Hans/blogs/how-to-read-the-analects", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/how-to-read-the-analects"`,
  '"@type":"Article"',
  '"datePublished":"2026-07-08"',
]);

const robots = read(".next/server/app/robots.txt.body");
assertIncludes(robots, "Disallow: /api/", "robots");
assertIncludes(robots, `Sitemap: ${siteUrl}/sitemap.xml`, "robots");
for (const crawler of aiCrawlers) {
  assertIncludes(robots, `User-Agent: ${crawler}`, "robots");
}

const sitemap = read(".next/server/app/sitemap.xml.body");
const expectedLocs =
  locales.length *
    (
      1 +
      4 +
      listenBookPageCount +
      trustPages.length +
      generated.books.length +
      sentences.length +
      indexCount +
      postCount
    ) +
  1;
const locs = countRegex(sitemap, /<loc>/g);
if (locs !== expectedLocs) fail(`sitemap: expected ${expectedLocs} <loc>, got ${locs}`);
assertIncludes(sitemap, `${siteUrl}/zh-Hans/index`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/index/confucius`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/how-to-read-the-analects`, "sitemap");
for (const trust of trustPages) {
  assertIncludes(sitemap, `${siteUrl}/zh-Hans/${trust}`, "sitemap");
  assertIncludes(sitemap, `${siteUrl}/en/${trust}`, "sitemap");
}
if (!sitemap.includes(`<lastmod>${stableLastmod}T00:00:00.000Z</lastmod>`) && !sitemap.includes(`<lastmod>${stableLastmod}</lastmod>`)) {
  fail("sitemap: stable 2026-08-20 lastmod missing");
}
if (/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/.test(sitemap.replaceAll(`${stableLastmod}T00:00:00.000Z`, ""))) {
  fail("sitemap: contains unexpected build-time timestamp");
}

const llms = exists(".next/server/app/llms.txt.body")
  ? read(".next/server/app/llms.txt.body")
  : read("src/app/llms.txt/route.ts");
for (const trust of ["About", "Method", "Sources", "FAQ"]) {
  assertIncludes(llms, trust, "llms.txt");
}
assertIncludes(llms, "token-free static RAG", "llms.txt");

assertIncludes(chatRouteSource, "if (!origin) return false", "chat origin allowlist");
assertIncludes(chatRouteSource, "CHAT_ALLOWED_ORIGINS", "chat origin allowlist");
assertIncludes(chatRouteSource, "rateLimited", "chat rate limit");
assertIncludes(nextConfigSource, "poweredByHeader: false", "next config");
assertIncludes(nextConfigSource, "async rewrites()", "root rewrite config");
assertIncludes(nextConfigSource, 'source: "/"', "root rewrite config");
assertIncludes(nextConfigSource, 'destination: "/en"', "root rewrite config");

const rootRedirects = (routesManifest.redirects || []).filter((redirect) => redirect.source === "/");
if (rootRedirects.length !== 0) fail("routes-manifest: root redirect should be absent");
const apexRedirects = (routesManifest.redirects || []).filter(
    (redirect) =>
    redirect.destination === "https://www.lunyu.ai/:path*" &&
    redirect.statusCode === 308 &&
    JSON.stringify(redirect.has || []).includes('"value":"lunyu.ai"')
);
if (apexRedirects.length !== 1) fail("routes-manifest: apex host must redirect permanently to www");

const flattenedHeaders = JSON.stringify(vercelConfig.headers || []);
for (const requiredHeader of [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "X-Frame-Options",
  "Permissions-Policy",
]) {
  assertIncludes(flattenedHeaders, requiredHeader, "vercel security headers");
}
assertIncludes(flattenedHeaders, "/audio/(.*)", "vercel audio cache");
assertIncludes(flattenedHeaders, "max-age=31536000, immutable", "vercel audio cache");

if (failures.length > 0) {
  console.error(`SEO QA failed (${failures.length})`);
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log(
  `SEO QA passed: ${sentences.length} passages, ${reviewedCount} reviewed guides, ${locs} sitemap URLs.`
);
