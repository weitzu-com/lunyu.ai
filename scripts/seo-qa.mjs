#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://www.lunyu.ai";
const locales = ["zh-Hans", "en"];
const trustPages = ["about", "method", "sources", "faq"];
const stableLastmod = "2026-08-20";
const intentHubLastmod = "2026-08-24";
const intentHubSlugs = ["lunyu", "the-analects", "analects-of-confucius", "confucius-quotes"];
const hubIndexLinks = {
  lunyu: ["/index/xue", "/index/ren", "/index/li", "/index/junzi", "/index/zhongshu"],
  "the-analects": ["/index/xue", "/index/ren", "/index/junzi", "/index/li", "/index/yi"],
  "analects-of-confucius": ["/index/confucius", "/index/yan-yuan", "/index/zi-gong", "/index/zeng-zi", "/index/zi-xia"],
  "confucius-quotes": ["/index/confucius", "/index/ren", "/index/zhongshu", "/index/junzi", "/index/xue"],
};
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

function extractJsonLd(html, route) {
  const documents = [];
  const scripts = html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  );
  for (const match of scripts) {
    try {
      documents.push(JSON.parse(match[1]));
    } catch (error) {
      fail(`${route}: invalid JSON-LD (${error instanceof Error ? error.message : String(error)})`);
    }
  }
  return documents;
}

function hasSchemaType(node, type) {
  const value = node?.["@type"];
  return Array.isArray(value) ? value.includes(type) : value === type;
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
const globalStylesSource = read("src/app/globals.css");
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

assertIncludes(read("src/lib/listen-hash.ts"), "export function parseListenHash", "listen hash parser");
assertIncludes(read("src/app/[locale]/listen/ListenControls.tsx"), "parseListenHash", "ListenControls consumes listen hash");
assertIncludes(read("src/app/[locale]/listen/ListenControls.tsx"), "location.hash", "ListenControls reads location.hash");
assertIncludes(read("src/app/[locale]/listen/ListenControls.tsx"), "@/lib/listen-hash", "ListenControls avoids server listen module");

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

const listenRoutes = [];
let expectedListenAudioObjects = 0;
let renderedListenAudioObjects = 0;
const allowedAudioObjectFields = new Set([
  "@type",
  "@id",
  "name",
  "contentUrl",
  "inLanguage",
  "encodingFormat",
  "duration",
  "isPartOf",
]);

for (const locale of locales) {
  for (const book of generated.books) {
    const listenPath = book.number === 1 ? "/listen" : `/listen/${book.slug}`;
    const route = `/${locale}${listenPath}`;
    const pageUrl = `${siteUrl}${route}`;
    const file = htmlPath(route);
    listenRoutes.push(route);
    checkHtml(route, [`rel="canonical" href="${pageUrl}"`]);
    if (!exists(file)) continue;

    const html = read(file);
    const documents = extractJsonLd(html, route);
    const graphDocument = documents.find(
      (document) =>
        Array.isArray(document?.["@graph"]) &&
        document["@graph"].some((node) => node?.["@id"] === `${pageUrl}#webpage`)
    );
    if (!graphDocument) {
      fail(`${route}: listening JSON-LD graph missing`);
      continue;
    }

    const graph = graphDocument["@graph"];
    const pageNode = graph.find((node) => node?.["@id"] === `${pageUrl}#webpage`);
    const bookNode = graph.find((node) => node?.["@id"] === `${siteUrl}#the-analects`);
    const breadcrumbNode = graph.find(
      (node) => node?.["@id"] === `${pageUrl}#breadcrumb`
    );
    const itemListNode = graph.find((node) => node?.["@id"] === `${pageUrl}#chapters`);

    if (!hasSchemaType(pageNode, "CollectionPage") || !hasSchemaType(pageNode, "WebPage")) {
      fail(`${route}: page must be typed as CollectionPage and WebPage`);
    }
    if (pageNode?.url !== pageUrl) fail(`${route}: WebPage URL mismatch`);
    if (pageNode?.inLanguage !== locale) fail(`${route}: WebPage language mismatch`);
    if (pageNode?.about?.["@id"] !== `${siteUrl}#the-analects`) {
      fail(`${route}: WebPage to Book relationship missing`);
    }
    if (pageNode?.breadcrumb?.["@id"] !== `${pageUrl}#breadcrumb`) {
      fail(`${route}: WebPage to BreadcrumbList relationship missing`);
    }
    if (pageNode?.mainEntity?.["@id"] !== `${pageUrl}#chapters`) {
      fail(`${route}: WebPage to ItemList relationship missing`);
    }

    if (!hasSchemaType(bookNode, "Book")) fail(`${route}: Book node missing`);
    if (bookNode?.url !== `${siteUrl}/${locale}/analects`) {
      fail(`${route}: Book URL mismatch`);
    }

    if (!hasSchemaType(breadcrumbNode, "BreadcrumbList")) {
      fail(`${route}: BreadcrumbList node missing`);
    } else {
      const breadcrumbs = breadcrumbNode.itemListElement ?? [];
      const expectedBreadcrumbCount = book.number === 1 ? 3 : 4;
      if (breadcrumbs.length !== expectedBreadcrumbCount) {
        fail(`${route}: expected ${expectedBreadcrumbCount} breadcrumbs, got ${breadcrumbs.length}`);
      }
      breadcrumbs.forEach((item, index) => {
        if (item?.position !== index + 1) fail(`${route}: breadcrumb position ${index + 1} invalid`);
      });
      if (breadcrumbs.at(-1)?.item !== pageUrl) fail(`${route}: final breadcrumb URL mismatch`);
      const breadcrumbUrls = breadcrumbs.map((item) => item?.item);
      if (new Set(breadcrumbUrls).size !== breadcrumbUrls.length) {
        fail(`${route}: breadcrumb URLs must be unique`);
      }
    }

    if (!hasSchemaType(itemListNode, "ItemList")) {
      fail(`${route}: ItemList node missing`);
      continue;
    }
    const items = itemListNode.itemListElement ?? [];
    if (itemListNode.numberOfItems !== book.sentences.length) {
      fail(`${route}: ItemList numberOfItems mismatch`);
    }
    if (items.length !== book.sentences.length) {
      fail(`${route}: expected ${book.sentences.length} ListItems, got ${items.length}`);
    }

    const bookTitle = locale === "zh-Hans" ? book.zhTitle : book.enTitle;
    book.sentences.forEach((sentence, index) => {
      const item = items[index];
      const chapterTitle = `${bookTitle} · ${String(sentence.sentenceNumber).padStart(2, "0")}`;
      const chapterUrl = `${siteUrl}/${locale}/analects/${book.slug}/${sentence.id}`;
      const audioPath = `/audio/analects/${book.slug}/ruby-female/${book.slug}-${String(sentence.sentenceNumber).padStart(3, "0")}-ruby-female.mp3`;
      const audioUrl = `${siteUrl}${audioPath}`;
      const audioExists = exists(`public${audioPath}`);

      if (!hasSchemaType(item, "ListItem")) fail(`${route}: item ${index + 1} is not a ListItem`);
      if (item?.position !== index + 1) fail(`${route}: ListItem position ${index + 1} invalid`);
      if (item?.name !== chapterTitle) fail(`${route}: ListItem ${index + 1} title mismatch`);
      if (item?.url !== chapterUrl) fail(`${route}: ListItem ${index + 1} URL mismatch`);

      if (audioExists) {
        expectedListenAudioObjects += 1;
        const audio = item?.item;
        if (!hasSchemaType(audio, "AudioObject")) {
          fail(`${route}: playable item ${index + 1} must be an AudioObject`);
          return;
        }
        renderedListenAudioObjects += 1;
        for (const key of Object.keys(audio)) {
          if (!allowedAudioObjectFields.has(key)) {
            fail(`${route}: AudioObject ${index + 1} has unsupported field ${key}`);
          }
        }
        if (audio.name !== chapterTitle) fail(`${route}: AudioObject ${index + 1} title mismatch`);
        if (audio.contentUrl !== audioUrl) fail(`${route}: AudioObject ${index + 1} MP3 URL mismatch`);
        if (audio.inLanguage !== "zh-CN") fail(`${route}: AudioObject ${index + 1} language must be zh-CN`);
        if (audio.encodingFormat !== "audio/mpeg") fail(`${route}: AudioObject ${index + 1} format mismatch`);
        if (audio.isPartOf?.["@id"] !== `${siteUrl}#the-analects`) {
          fail(`${route}: AudioObject ${index + 1} Book relationship missing`);
        }
        if (!/^PT\d+(?:\.\d+)?S$/.test(audio.duration ?? "")) {
          fail(`${route}: AudioObject ${index + 1} real duration missing`);
        }
      } else {
        if (!hasSchemaType(item?.item, "WebPage")) {
          fail(`${route}: unavailable item ${index + 1} must remain a WebPage`);
        }
        if (item?.item?.url !== chapterUrl) {
          fail(`${route}: unavailable WebPage ${index + 1} URL mismatch`);
        }
        if (item?.item?.contentUrl || item?.item?.duration) {
          fail(`${route}: unavailable item ${index + 1} must not claim audio fields`);
        }
      }
    });
  }
}

if (listenRoutes.length !== 40 || new Set(listenRoutes).size !== 40) {
  fail(`listen routes: expected 40 unique routes, got ${new Set(listenRoutes).size}`);
}
if (renderedListenAudioObjects !== expectedListenAudioObjects) {
  fail(
    `listen audio: rendered ${renderedListenAudioObjects}/${expectedListenAudioObjects} real AudioObjects`
  );
}

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
checkHtml("/en/index/ren", [
  '"@type":"WebPage"',
  '"@type":"FAQPage"',
  '"@type":"Question"',
  "How the word is used in the book",
  "Easy confusions",
  "Featured passages",
  "View all related passages",
  "What you can do today",
  "Frequently asked questions",
  "Related entries",
  "Back to the twenty books",
  "/en/analects/yan-yuan/yan-yuan-001",
  "/en/analects/wei-ling-gong/wei-ling-gong-023",
  "/en/analects/li-ren/li-ren-015",
  "/en/index/li",
  "/en/index/zhongshu",
  "/en/index/junzi",
  "/en/analects/xue-er",
  "Golden Rule",
]);
checkHtml("/zh-Hans/index/ren", [
  '"@type":"FAQPage"',
  "书中怎么用这个字",
  "容易混淆的地方",
  "选读",
  "查看全部相关章句",
  "今天可以做的一件事",
  "常见问题",
  "相关词条",
  "回到二十篇",
  "/zh-Hans/analects/yan-yuan/yan-yuan-001",
  "/zh-Hans/analects/wei-ling-gong/wei-ling-gong-023",
  "/zh-Hans/index/li",
  "/zh-Hans/index/zhongshu",
]);
for (const locale of locales) {
  const route = `/${locale}/index/ren`;
  const file = htmlPath(route);
  if (exists(file)) {
    const html = read(file);
    const description = extractMetaDescription(html);
    if (!description) fail(`${route}: meta description missing`);
    if (description.includes("A central virtue linking humaneness") || description.includes("《论语》的核心德目")) {
      fail(`${route}: still using the one-line glossary description`);
    }
    if (html.includes("/analects/ba-yi/ba-yi-008")) {
      fail(`${route}: guide-only 仁 match ba-yi-008 must not appear`);
    }
  }
}

const relatedSpotChecks = [
  {
    id: "xue-er-001",
    book: "xue-er",
    hrefs: ["/index/xue", "/index/junzi", "/index/confucius"],
    listen: false,
  },
  {
    id: "li-ren-015",
    book: "li-ren",
    hrefs: ["/index/zhongshu", "/index/zeng-zi", "/index/confucius"],
    listen: true,
  },
  {
    id: "yan-yuan-001",
    book: "yan-yuan",
    hrefs: ["/index/ren", "/index/li", "/index/yan-yuan"],
    listen: true,
  },
  {
    id: "wei-ling-gong-023",
    book: "wei-ling-gong",
    hrefs: ["/index/zhongshu", "/index/zi-gong", "/index/confucius"],
    listen: false,
  },
  {
    id: "xian-jin-015",
    book: "xian-jin",
    hrefs: ["/index/zi-zhang", "/index/zi-xia", "/index/zi-gong"],
    listen: false,
  },
  {
    id: "gong-ye-chang-001",
    book: "gong-ye-chang",
    hrefs: ["/index/nan-gong-kuo"],
    listen: true,
  },
];
for (const locale of locales) {
  for (const spot of relatedSpotChecks) {
    const route = `/${locale}/analects/${spot.book}/${spot.id}`;
    const expected = [
      locale === "zh-Hans" ? "相关人物、地点与概念" : "Related people, places, and ideas",
      ...spot.hrefs.map((path) => `/${locale}${path}`),
    ];
    if (spot.listen) {
      expected.push(`/${locale}/listen/${spot.book}#listen-${spot.id}`);
    }
    checkHtml(route, expected);
    const file = htmlPath(route);
    if (exists(file) && !spot.listen) {
      const html = read(file);
      if (html.includes(`#listen-${spot.id}`)) {
        fail(`${route}: listen chip must not appear without audio`);
      }
    }
  }
}

checkHtml("/en/index/zi-zhang", ["/en/analects/xian-jin/xian-jin-015"]);
checkHtml("/en/index/zi-xia", ["/en/analects/xian-jin/xian-jin-015"]);

const aliasCollisionChecks = [
  { id: "zi-han-025", book: "zi-han", forbidden: ["/index/zi-zhang"] },
  { id: "zi-han-010", book: "zi-han", forbidden: ["/index/zi-lu"] },
  { id: "shu-er-011", book: "shu-er", forbidden: ["/index/ran-you"] },
];
for (const locale of locales) {
  for (const spot of aliasCollisionChecks) {
    const route = `/${locale}/analects/${spot.book}/${spot.id}`;
    const file = htmlPath(route);
    if (!exists(file)) {
      fail(`${route}: build HTML missing at ${file}`);
      continue;
    }
    const html = read(file);
    for (const path of spot.forbidden) {
      if (html.includes(`/${locale}${path}`)) {
        fail(`${route}: colliding alias linked ${path}`);
      }
    }
  }
}

checkHtml("/zh-Hans/index", [`rel="canonical" href="${siteUrl}/zh-Hans/index"`, "知识索引"]);
checkHtml("/zh-Hans/blogs", [`rel="canonical" href="${siteUrl}/zh-Hans/blogs"`, '"@type":"CollectionPage"', "论语阅读札记"]);
checkHtml("/zh-Hans/blogs/how-to-read-the-analects", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/how-to-read-the-analects"`,
  '"@type":"Article"',
  '"datePublished":"2026-07-08"',
]);

const seenHubDescriptions = new Map();
for (const locale of locales) {
  for (const slug of intentHubSlugs) {
    const route = `/${locale}/topics/${slug}`;
    checkHtml(route, [
      `rel="canonical" href="${siteUrl}${route}"`,
      `hrefLang="${locale === "en" ? "zh-Hans" : "en"}"`,
      '"@type":"CollectionPage"',
      '"@type":"ItemList"',
      '"@type":"FAQPage"',
      '"@type":"Quotation"',
      "/analects/",
      "Project Gutenberg",
      locale === "en" ? "the other three intent guides" : "另外三个意图导读",
      ...hubIndexLinks[slug],
    ]);
    const file = htmlPath(route);
    if (exists(file)) {
      const description = extractMetaDescription(read(file));
      if (!description) {
        fail(`${route}: meta description missing`);
      } else if (seenHubDescriptions.has(description)) {
        fail(`duplicate hub description: ${route} and ${seenHubDescriptions.get(description)}`);
      } else {
        seenHubDescriptions.set(description, route);
      }
    }
  }
}

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
      intentHubSlugs.length +
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
for (const slug of intentHubSlugs) {
  assertIncludes(sitemap, `${siteUrl}/zh-Hans/topics/${slug}`, "sitemap");
  assertIncludes(sitemap, `${siteUrl}/en/topics/${slug}`, "sitemap");
}
for (const trust of trustPages) {
  assertIncludes(sitemap, `${siteUrl}/zh-Hans/${trust}`, "sitemap");
  assertIncludes(sitemap, `${siteUrl}/en/${trust}`, "sitemap");
}
if (!sitemap.includes(`<lastmod>${stableLastmod}T00:00:00.000Z</lastmod>`) && !sitemap.includes(`<lastmod>${stableLastmod}</lastmod>`)) {
  fail("sitemap: stable 2026-08-20 lastmod missing");
}
if (!sitemap.includes(`<lastmod>${intentHubLastmod}T00:00:00.000Z</lastmod>`) && !sitemap.includes(`<lastmod>${intentHubLastmod}</lastmod>`)) {
  fail("sitemap: stable 2026-08-24 hub lastmod missing");
}
const sitemapWithoutStableDates = sitemap
  .replaceAll(`${stableLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${intentHubLastmod}T00:00:00.000Z`, "");
if (/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/.test(sitemapWithoutStableDates)) {
  fail("sitemap: contains unexpected build-time timestamp");
}

const llms = exists(".next/server/app/llms.txt.body")
  ? read(".next/server/app/llms.txt.body")
  : read("src/app/llms.txt/route.ts");
for (const trust of ["About", "Method", "Sources", "FAQ"]) {
  assertIncludes(llms, trust, "llms.txt");
}
assertIncludes(llms, "token-free static RAG", "llms.txt");
if (exists(".next/server/app/llms.txt.body")) {
  for (const slug of intentHubSlugs) {
    assertIncludes(llms, `${siteUrl}/en/topics/${slug}`, "llms.txt");
    assertIncludes(llms, `${siteUrl}/zh-Hans/topics/${slug}`, "llms.txt");
  }
} else {
  assertIncludes(llms, "intentHubSlugs", "llms.txt source");
  assertIncludes(llms, "${siteUrl}/en/topics/${slug}", "llms.txt source");
  assertIncludes(llms, "${siteUrl}/zh-Hans/topics/${slug}", "llms.txt source");
}

assertIncludes(chatRouteSource, "if (!origin) return false", "chat origin allowlist");
assertIncludes(chatRouteSource, "CHAT_ALLOWED_ORIGINS", "chat origin allowlist");
assertIncludes(chatRouteSource, "rateLimited", "chat rate limit");
assertIncludes(nextConfigSource, "poweredByHeader: false", "next config");
assertIncludes(nextConfigSource, "async rewrites()", "root rewrite config");
assertIncludes(nextConfigSource, 'source: "/"', "root rewrite config");
assertIncludes(nextConfigSource, 'destination: "/en"', "root rewrite config");
assertIncludes(globalStylesSource, '@import "tailwindcss" source("..");', "Tailwind source root");

const compiledCssDir = path.join(root, ".next/static/css");
const compiledCssFiles = exists(".next/static/css")
  ? fs.readdirSync(compiledCssDir).filter((file) => file.endsWith(".css"))
  : [];
if (compiledCssFiles.length === 0) {
  fail("production CSS: no compiled stylesheets found");
} else {
  const compiledCss = compiledCssFiles
    .map((file) => fs.readFileSync(path.join(compiledCssDir, file), "utf8"))
    .join("\n");
  for (const selector of [
    ".flex{",
    ".grid{",
    ".min-h-screen{",
    ".bg-paper",
    ".text-ink",
    ".sm\\:grid-cols-2",
    ".page-shell{",
    ".ui-button{",
  ]) {
    assertIncludes(compiledCss, selector, "production CSS");
  }
}

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
  `SEO QA passed: ${sentences.length} passages, ${reviewedCount} reviewed guides, ${locs} sitemap URLs, ${listenRoutes.length} listening routes, ${renderedListenAudioObjects} real AudioObjects.`
);
