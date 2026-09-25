#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { discipleBiographies } from "../src/data/disciples-biographies.ts";
import { geographyPlaces } from "../src/data/geography.ts";

const root = process.cwd();
const siteUrl = "https://www.lunyu.ai";
const locales = ["zh-Hans", "en"];
const trustPages = ["about", "method", "sources", "faq"];
const stableLastmod = "2026-08-20";
const intentHubLastmod = "2026-08-24";
const featuredIndexLastmod = "2026-08-24";
const entityIndexRefreshLastmod = "2026-09-14";
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

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/gi, "/");
}

function headingLevels(html) {
  return [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
}

function assertNoHeadingSkip(route, html) {
  const levels = headingLevels(html);
  if (!levels.length || levels[0] !== 1) {
    fail(`${route}: first heading must be h1`);
    return;
  }
  let previous = 1;
  for (const level of levels.slice(1)) {
    if (level > previous + 1) fail(`${route}: heading skip h${previous} → h${level}`);
    previous = level;
  }
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
  'alt="lunyu.ai"',
]);

checkHtml("/en", [
  '<html lang="en"',
  `rel="canonical" href="${siteUrl}/en"`,
  `hrefLang="zh-Hans" href="${siteUrl}/zh-Hans"`,
  '"@type":"WebSite"',
  'alt="lunyu.ai"',
]);

const gameRoute = "/zh-Hans/game";
const gameUrl = `${siteUrl}${gameRoute}`;
for (const locale of locales) {
  const homeHtml = read(htmlPath(`/${locale}`));
  const navigation = homeHtml.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? "";
  assertIncludes(navigation, `href="${gameRoute}"`, `/${locale}: game navigation`);
  assertIncludes(navigation, locale === "zh-Hans" ? "孔子之旅" : "Journey (中文)", `/${locale}: game navigation label`);
  assertIncludes(homeHtml, 'aria-labelledby="confucius-game-heading"', `/${locale}: game introduction`);
  if (countRegex(homeHtml, /<a\b[^>]*href="\/zh-Hans\/game"/g) < 2) {
    fail(`/${locale}: home must link to the game from navigation and introduction`);
  }
  if (homeHtml.includes('href="/en/game"')) fail(`/${locale}: must not link to an unavailable English game`);
}

// The demo is Chinese-only: verify its real page without requiring a fictional translation.
if (!exists(htmlPath(gameRoute))) {
  fail(`${gameRoute}: build HTML missing`);
} else {
  const gameHtml = read(htmlPath(gameRoute));
  assertIncludes(gameHtml, '<html lang="zh-Hans"', gameRoute);
  assertIncludes(gameHtml, `rel="canonical" href="${gameUrl}"`, gameRoute);
  assertIncludes(gameHtml, `property="og:url" content="${gameUrl}"`, gameRoute);
  if (!/<title>[^<]*孔子[^<]*<\/title>/.test(gameHtml)) fail(`${gameRoute}: descriptive page title missing`);
  if (!extractMetaDescription(gameHtml)) fail(`${gameRoute}: meta description missing`);
  if (!/<h1\b[^>]*>[\s\S]*?孔子[\s\S]*?<\/h1>/.test(gameHtml)) fail(`${gameRoute}: server-rendered game heading missing`);
  if (/<meta\b[^>]*name="robots"[^>]*content="[^"]*\b(?:noindex|none)\b/i.test(gameHtml)) {
    fail(`${gameRoute}: game must be indexable`);
  }
  if (gameHtml.includes('hrefLang="en"')) fail(`${gameRoute}: must not advertise an unavailable English translation`);
  assertIncludes(gameHtml, 'hrefLang="zh-Hans"', gameRoute);
  assertIncludes(gameHtml, 'hrefLang="x-default"', gameRoute);
  if (!gameHtml.includes(`hrefLang="zh-Hans" href="${gameUrl}"`) && !gameHtml.includes(`hrefLang="x-default" href="${gameUrl}"`)) {
    fail(`${gameRoute}: hreflang pair must point at the Chinese game URL`);
  }
  const gameSchema = extractJsonLd(gameHtml, gameRoute).find((item) => hasSchemaType(item, "VideoGame"));
  if (!gameSchema || gameSchema.url !== gameUrl || gameSchema.inLanguage !== "zh-Hans" || gameSchema.isAccessibleForFree !== true) {
    fail(`${gameRoute}: VideoGame schema must describe the free Chinese game at its canonical URL`);
  }
}
const englishGameMetadata = ".next/server/app/en/game.meta";
if (exists(englishGameMetadata) && JSON.parse(read(englishGameMetadata)).status !== 404) {
  fail("/en/game: unavailable translation must return 404");
}

for (const route of ["/", "/zh-Hans", "/en", "/en/analects/xue-er", "/zh-Hans/analects/xue-er"].map((item) =>
  item === "/" ? "/en" : item
)) {
  const file = htmlPath(route);
  if (exists(file)) assertNoHeadingSkip(route, read(file));
}

for (const route of ["/en", "/zh-Hans", "/en/analects", "/zh-Hans/analects"]) {
  const file = htmlPath(route);
  if (!exists(file)) continue;
  const description = decodeHtmlEntities(extractMetaDescription(read(file)));
  if (!description) fail(`${route}: meta description missing`);
  if (description.length > 160) fail(`${route}: meta description length ${description.length} exceeds 160`);
}

{
  const lunyuHtml = exists(htmlPath("/en/topics/lunyu")) ? read(htmlPath("/en/topics/lunyu")) : "";
  const lunyuTitle = lunyuHtml.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
  if (lunyuTitle.includes("&amp;")) fail("/en/topics/lunyu: title still contains literal &amp;");
  if (lunyuTitle && !/Chinese Text and Translation/.test(lunyuTitle)) {
    fail("/en/topics/lunyu: title should use 'and' instead of an encoded ampersand");
  }
}

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
  `"dateModified":"${featuredIndexLastmod}"`,
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

const featuredIndexChecks = [
  {
    slug: "li",
    href: "/analects/yang-huo/yang-huo-011",
    glossaryZh: "礼是行为秩序与内在敬意的统一",
    glossaryEn: "Ritual propriety as the unity of social form",
    marker: "玉帛",
  },
  {
    slug: "zhongshu",
    href: "/analects/wei-ling-gong/wei-ling-gong-023",
    glossaryZh: "忠恕是推己及人与尽己之道",
    glossaryEn: "Doing one's utmost and extending oneself to others",
    marker: "Golden Rule",
  },
  {
    slug: "junzi",
    href: "/analects/wei-ling-gong/wei-ling-gong-020",
    glossaryZh: "君子是《论语》中理想人格的核心名称",
    glossaryEn: "The noble person: an ideal of virtue",
    marker: "successful person",
  },
  {
    slug: "xue",
    href: "/analects/xue-er/xue-er-001",
    glossaryZh: "学是修身、知礼、成德的长期实践",
    glossaryEn: "Learning as long-term practice of cultivation",
    marker: "review app",
  },
  {
    slug: "confucius",
    href: "/analects/shu-er/shu-er-001",
    glossaryZh: "《论语》的核心人物，言行、教学",
    glossaryEn: "The central figure of The Analects: teacher",
    marker: "signed author",
    person: true,
  },
  {
    slug: "yan-yuan",
    href: "/analects/yong-ye/yong-ye-005",
    glossaryZh: "孔门高弟，以好学、安贫、近仁著称",
    glossaryEn: "A beloved disciple known for learning, simplicity",
    marker: "perfect student",
    person: true,
  },
  {
    slug: "zi-gong",
    href: "/analects/wei-ling-gong/wei-ling-gong-023",
    glossaryZh: "孔门弟子，善言辞与外交",
    glossaryEn: "A disciple known for speech, diplomacy",
    marker: "15.23",
    person: true,
  },
];

for (const page of featuredIndexChecks) {
  checkHtml(`/en/index/${page.slug}`, [
    '"@type":"WebPage"',
    '"@type":"FAQPage"',
    '"@type":"Question"',
    page.person ? "How the person appears in the book" : "How the word is used in the book",
    "Easy confusions",
    "Featured passages",
    "View all related passages",
    "What you can do today",
    "Frequently asked questions",
    "Related entries",
    "Back to the twenty books",
    `/en${page.href}`,
    page.marker,
    `"dateModified":"${featuredIndexLastmod}"`,
  ]);
  checkHtml(`/zh-Hans/index/${page.slug}`, [
    '"@type":"FAQPage"',
    page.person ? "书中怎么出现这个人" : "书中怎么用这个字",
    "容易混淆的地方",
    "选读",
    "查看全部相关章句",
    "今天可以做的一件事",
    "常见问题",
    "相关词条",
    "回到二十篇",
    `/zh-Hans${page.href}`,
  ]);
  for (const locale of locales) {
    const route = `/${locale}/index/${page.slug}`;
    const file = htmlPath(route);
    if (!exists(file)) continue;
    const html = read(file);
    const description = extractMetaDescription(html);
    if (!description) fail(`${route}: meta description missing`);
    if (description.includes(page.glossaryZh) || description.includes(page.glossaryEn)) {
      fail(`${route}: still using the one-line glossary description`);
    }
    if (!html.includes(`"dateModified":"${featuredIndexLastmod}"`)) {
      fail(`${route}: featured index must publish ${featuredIndexLastmod}`);
    }
    if (page.slug === "zi-gong" && locale === "en") {
      if (html.includes("Si is the personal name") || html.includes("addresses him as Si")) {
        fail(`${route}: 赐 must not be romanized as Si`);
      }
      if (!html.includes("Ci is the personal name")) {
        fail(`${route}: 赐 should be romanized as Ci`);
      }
    }
  }
}

checkHtml("/en/index/yi", [
  "Relevant passages",
  "Rightness and appropriateness, the noble person's measure amid interests.",
  `"dateModified":"${stableLastmod}"`,
]);
checkHtml("/zh-Hans/index/yi", ["相关章句", "义指合宜与正当", `"dateModified":"${stableLastmod}"`]);
for (const locale of locales) {
  const route = `/${locale}/index/yi`;
  const file = htmlPath(route);
  if (!exists(file)) continue;
  const html = read(file);
  if (html.includes("Easy confusions") || html.includes("容易混淆的地方")) {
    fail(`${route}: unfeatured index must keep the old dump template`);
  }
  if (html.includes('"@type":"FAQPage"')) {
    fail(`${route}: unfeatured index must not grow FAQ JSON-LD`);
  }
  if (html.includes(`"dateModified":"${featuredIndexLastmod}"`)) {
    fail(`${route}: unfeatured index must keep the 2026-08-20 modification date`);
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
const notesBackfillPosts = [
  {
    slug: "how-to-read-the-analects",
    cover: "/images/blogs/how-to-read-the-analects/cover.jpg",
    inline1: "/images/blogs/how-to-read-the-analects/inline-1.jpg",
    inline2: "/images/blogs/how-to-read-the-analects/inline-2.jpg",
    coverEn: "Quiet study desk with open Analects and one empty sentence line — how to read the Analects",
    coverZh: "安静书案上摊开的《论语》与一行留白——如何读《论语》",
    inline1En: "Three blank layered paper strips — original, guide, and translation as strata",
    inline1Zh: "三层空白纸条叠放——原文、导读与英译的分层阅读",
    inline2En: "Three quiet stones beside an open book — three reusable questions",
    inline2Zh: "翻开书册旁三颗安静的卵石——可复用的三问",
  },
  {
    slug: "ren-junzi-and-everyday-conduct",
    cover: "/images/blogs/ren-junzi-and-everyday-conduct/cover.jpg",
    inline1: "/images/blogs/ren-junzi-and-everyday-conduct/inline-1.jpg",
    inline2: "/images/blogs/ren-junzi-and-everyday-conduct/inline-2.jpg",
    coverEn: "Two empty tea cups on wood — everyday kindness and conduct",
    coverZh: "木案上两只空茶杯——日常待人中的仁",
    inline1En: "Overlapping ink circles — ren lived in relationships",
    inline1Zh: "交叠的水墨圆圈——关系中的仁",
    inline2En: "Forked quiet path through mist — junzi and xiaoren diverge",
    inline2Zh: "雾中分岔小径——君子与小人的分岔",
  },
  {
    slug: "learning-practice-and-review",
    cover: "/images/blogs/learning-practice-and-review/cover.jpg",
    inline1: "/images/blogs/learning-practice-and-review/inline-1.jpg",
    inline2: "/images/blogs/learning-practice-and-review/inline-2.jpg",
    coverEn: "Open book with soft ink enso — learning and timely practice",
    coverZh: "翻开书册与淡墨圆圈——学而时习",
    inline1En: "Footprints on a path beside an open notebook — practice tests learning",
    inline1Zh: "翻开笔记旁小径上的足迹——行为检验所学",
    inline2En: "Soft ink loop returning to a quiet mark — revisiting one sentence",
    inline2Zh: "淡墨回环落回一处墨迹——反复回访同一句",
  },
  {
    slug: "filial-conduct-ritual-and-care",
    cover: "/images/blogs/filial-conduct-ritual-and-care/cover.jpg",
    inline1: "/images/blogs/filial-conduct-ritual-and-care/inline-1.jpg",
    inline2: "/images/blogs/filial-conduct-ritual-and-care/inline-2.jpg",
    coverEn: "Incense bowl and folded cloth on parchment — filial care and ritual",
    coverZh: "宣纸上香炉与叠好的布巾——孝与礼",
    inline1En: "Two ink hands offering care without kneeling drama — respect is not blind obedience",
    inline1Zh: "两只水墨手势的递送——敬意而非盲从",
    inline2En: "Empty bowl and folded cloth placed with care — form makes care visible",
    inline2Zh: "空碗与叠好的布巾安静摆放——形式使关怀可见",
  },
  {
    slug: "ai-boundaries-for-classic-texts",
    cover: "/images/blogs/ai-boundaries-for-classic-texts/cover.jpg",
    inline1: "/images/blogs/ai-boundaries-for-classic-texts/inline-1.jpg",
    inline2: "/images/blogs/ai-boundaries-for-classic-texts/inline-2.jpg",
    coverEn: "Open classic book beside an empty framed margin — classics and AI boundaries",
    coverZh: "翻开的经典与空白边框——经典文本与边界",
    inline1En: "Three blank paper layers over mist landscape — source, translation, and guide",
    inline1Zh: "雾中三层空白纸条——源文、译文与导读分层",
    inline2En: "Open classic page with bookmark and quiet citation space — quotable passages",
    inline2Zh: "带书签的翻开书页与引文留白——可引用的章句页",
  },
];

for (const post of notesBackfillPosts) {
  for (const src of [post.cover, post.inline1, post.inline2]) {
    if (!exists(`public${src}`)) fail(`missing Notes image public${src}`);
  }
  checkHtml(`/en/blogs/${post.slug}`, [
    `rel="canonical" href="${siteUrl}/en/blogs/${post.slug}"`,
    '"@type":"Article"',
    post.cover,
    post.inline1,
    post.inline2,
    post.coverEn,
    post.inline1En,
    post.inline2En,
    `property="og:image" content="${siteUrl}${post.cover}"`,
    `name="twitter:image" content="${siteUrl}${post.cover}"`,
  ]);
  checkHtml(`/zh-Hans/blogs/${post.slug}`, [
    `rel="canonical" href="${siteUrl}/zh-Hans/blogs/${post.slug}"`,
    '"@type":"Article"',
    '"datePublished":"2026-07-08"',
    post.cover,
    post.inline1,
    post.inline2,
    post.coverZh,
    post.inline1Zh,
    post.inline2Zh,
    `property="og:image" content="${siteUrl}${post.cover}"`,
    `name="twitter:image" content="${siteUrl}${post.cover}"`,
  ]);
}
checkHtml("/en/blogs/zai-wo-in-the-analects", [
  `rel="canonical" href="${siteUrl}/en/blogs/zai-wo-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-14"',
  '"dateModified":"2026-09-14"',
  "Who Was Zai Wo in the Analects?",
  ">Zai Wo</a>",
  ">The Analects · Yang Ho 17.21</a>",
  'href="/en/index/zai-wo"',
  'href="/en/analects/yang-huo/yang-huo-021"',
  "/images/blogs/zai-wo-in-the-analects/cover.jpg",
  "/images/blogs/zai-wo-in-the-analects/speech-and-conduct.jpg",
  "/images/blogs/zai-wo-in-the-analects/mourning-three-years.jpg",
  "Quiet study desk with open Analects and empty second seat — who was Zai Wo",
  "Ink sketch of spoken words beside a quiet practice path — speech tested by conduct",
  "Calendar cycle of one year beside a longer care span — three years’ mourning question",
  `property="og:image" content="${siteUrl}/images/blogs/zai-wo-in-the-analects/cover.jpg"`,
  `property="og:image:alt" content="Quiet study desk with open Analects and empty second seat — who was Zai Wo"`,
  `name="twitter:image" content="${siteUrl}/images/blogs/zai-wo-in-the-analects/cover.jpg"`,
  `name="twitter:image:alt" content="Quiet study desk with open Analects and empty second seat — who was Zai Wo"`,
]);
checkHtml("/zh-Hans/blogs/zai-wo-in-the-analects", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/zai-wo-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-14"',
  '"dateModified":"2026-09-14"',
  "《论语》里的宰我是谁？",
  "你搜「宰我」时，多半是想在一串弟子名里把他安顿下来",
  "先按篇章认人，不靠履历表",
  ">宰我</a>",
  ">论语 · 阳货 17.21</a>",
  'href="/zh-Hans/index/zai-wo"',
  'href="/zh-Hans/analects/yang-huo/yang-huo-021"',
  "/images/blogs/zai-wo-in-the-analects/cover.jpg",
  "/images/blogs/zai-wo-in-the-analects/speech-and-conduct.jpg",
  "/images/blogs/zai-wo-in-the-analects/mourning-three-years.jpg",
  "安静书案上摊开的《论语》与空出的第二席——宰我是谁",
  "墨色勾出的言语涟漪与静默践行之路——言语要经得起行为检验",
  "一年节令循环旁更长的照护弧线——三年之丧的追问",
  `property="og:image" content="${siteUrl}/images/blogs/zai-wo-in-the-analects/cover.jpg"`,
  `property="og:image:alt" content="安静书案上摊开的《论语》与空出的第二席——宰我是谁"`,
  `name="twitter:image" content="${siteUrl}/images/blogs/zai-wo-in-the-analects/cover.jpg"`,
  `name="twitter:image:alt" content="安静书案上摊开的《论语》与空出的第二席——宰我是谁"`,
]);
{
  const zhZaiWoFile = htmlPath("/zh-Hans/blogs/zai-wo-in-the-analects");
  if (exists(zhZaiWoFile)) {
    const zhZaiWoHtml = read(zhZaiWoFile);
    for (const stub of ["中文全文将于稍后发布", "中文解答将随全文于稍后发布"]) {
      if (zhZaiWoHtml.includes(stub)) fail(`/zh-Hans/blogs/zai-wo-in-the-analects: leftover stub ${stub}`);
    }
    if (zhZaiWoHtml.includes("Quiet study desk with open Analects and empty second seat")) {
      fail("/zh-Hans/blogs/zai-wo-in-the-analects: English cover alt leaked onto zh-Hans");
    }
  }
  const enZaiWoFile = htmlPath("/en/blogs/zai-wo-in-the-analects");
  if (exists(enZaiWoFile)) {
    const enZaiWoHtml = read(enZaiWoFile);
    if (enZaiWoHtml.includes("安静书案上摊开的《论语》与空出的第二席")) {
      fail("/en/blogs/zai-wo-in-the-analects: Chinese cover alt leaked onto en");
    }
  }
}

const junziCover = "/images/blogs/what-is-a-junzi/cover.jpg";
const junziInline1 = "/images/blogs/what-is-a-junzi/inline-1.jpg";
const junziInline2 = "/images/blogs/what-is-a-junzi/inline-2.jpg";
const junziCoverEn =
  "Empty vessel outline beside a quiet study desk — junzi as not a fixed vessel (Analects 2.12)";
const junziCoverZh = "空器轮廓与素净书案——君子「不器」（《论语》为政 2.12）";
const junziInline1En =
  "Soft paper slips with competing English glosses (gentleman, superior man, exemplary person) around an empty vessel — translation tension, not a ranking";
const junziInline1Zh =
  "淡墨纸签上互相拉扯的英译标签（gentleman / superior man / exemplary person）环绕空器——译词张力，非排行";
const junziInline2En =
  "Misty fork in a path — restrained junzi / xiaoren contrast without cartoon villainy";
const junziInline2Zh = "雾中分岔小路——克制的君子/小人对照，非卡通善恶脸谱";
const junziAnchors = [
  ["君子", "https://www.lunyu.ai/zh-Hans/index/junzi"],
  ["Junzi", "https://www.lunyu.ai/en/index/junzi"],
  ["仁、君子与日常行为", "https://www.lunyu.ai/zh-Hans/blogs/ren-junzi-and-everyday-conduct"],
  ["Ren, Junzi, and Everyday Conduct", "https://www.lunyu.ai/en/blogs/ren-junzi-and-everyday-conduct"],
  ["论语 · 为政 2.12", "https://www.lunyu.ai/zh-Hans/analects/wei-zheng/wei-zheng-012"],
  ["The Analects · Wei Chang 2.12", "https://www.lunyu.ai/en/analects/wei-zheng/wei-zheng-012"],
];
{
  const start = postSource.indexOf('slug: "what-is-a-junzi"');
  if (start === -1) {
    fail("editorial-posts: missing what-is-a-junzi");
  } else {
    const next = postSource.indexOf('slug: "', start + 1);
    const block = postSource.slice(start, next === -1 ? undefined : next);
    const markdownHrefs = [...block.matchAll(/\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g)].map(
      (match) => match[1]
    );
    const expectedHrefs = junziAnchors.map(([, href]) => href);
    if (markdownHrefs.length !== expectedHrefs.length) {
      fail(`what-is-a-junzi: expected ${expectedHrefs.length} markdown hrefs, got ${markdownHrefs.length}`);
    }
    junziAnchors.forEach(([label, href]) => {
      if (!block.includes(`[${label}](${href})`)) {
        fail(`what-is-a-junzi: missing [${label}](${href})`);
      }
    });
    markdownHrefs.forEach((href, index) => {
      if (href !== expectedHrefs[index]) {
        fail(`what-is-a-junzi: markdown href ${index + 1} should be ${expectedHrefs[index]}`);
      }
    });
  }
}
for (const src of [junziCover, junziInline1, junziInline2]) {
  if (!exists(`public${src}`)) fail(`missing Notes image public${src}`);
}
checkHtml("/en/blogs/what-is-a-junzi", [
  `rel="canonical" href="${siteUrl}/en/blogs/what-is-a-junzi"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-14"',
  '"dateModified":"2026-09-16"',
  "What Is a Junzi in the Analects?",
  "Junzi is not a status label. A short Analects definition, translation map, and passage doors you can open on this site.",
  "A short answer you can quote",
  "Why the English glosses fight each other",
  "Three doors in the text",
  "Not a vessel",
  "Unmoved when unknown",
  "Right vs profit",
  "Junzi and xiaoren (contrast only)",
  "Open the line, then the index",
  "What does junzi mean in the Analects?",
  ">Junzi</a>",
  ">Ren, Junzi, and Everyday Conduct</a>",
  ">The Analects · Wei Chang 2.12</a>",
  'href="/en/index/junzi"',
  'href="/en/blogs/ren-junzi-and-everyday-conduct"',
  'href="/en/analects/wei-zheng/wei-zheng-012"',
  junziCover,
  junziInline1,
  junziInline2,
  junziCoverEn,
  junziInline1En,
  junziInline2En,
  `property="og:image" content="${siteUrl}${junziCover}"`,
  `property="og:image:alt" content="${junziCoverEn}"`,
  `name="twitter:image" content="${siteUrl}${junziCover}"`,
  `name="twitter:image:alt" content="${junziCoverEn}"`,
]);
checkHtml("/zh-Hans/blogs/what-is-a-junzi", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/what-is-a-junzi"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-14"',
  '"dateModified":"2026-09-16"',
  "《论语》里的「君子」是什么意思？",
  "君子不是成功学标签。一句可引用的定义、常见英译误区，以及可打开的原文入口。",
  "你在搜索「君子是什么意思」时，多半想要可核对的名字",
  "一句可以引用的短答",
  "英译为什么互相拉扯",
  "文本里的三道门",
  "不器",
  "人不知而不愠",
  "义与利",
  "君子与小人（只作对照）",
  "先打开这一句，再回索引",
  "《论语》里的君子是什么意思？",
  ">君子</a>",
  ">仁、君子与日常行为</a>",
  ">论语 · 为政 2.12</a>",
  'href="/zh-Hans/index/junzi"',
  'href="/zh-Hans/blogs/ren-junzi-and-everyday-conduct"',
  'href="/zh-Hans/analects/wei-zheng/wei-zheng-012"',
  junziCover,
  junziInline1,
  junziInline2,
  junziCoverZh,
  junziInline1Zh,
  junziInline2Zh,
  `property="og:image" content="${siteUrl}${junziCover}"`,
  `property="og:image:alt" content="${junziCoverZh}"`,
  `name="twitter:image" content="${siteUrl}${junziCover}"`,
  `name="twitter:image:alt" content="${junziCoverZh}"`,
]);
{
  const zhJunziFile = htmlPath("/zh-Hans/blogs/what-is-a-junzi");
  if (exists(zhJunziFile)) {
    const zhJunziHtml = read(zhJunziFile);
    for (const stub of ["中文全文将于稍后发布", "中文解答将随全文于稍后发布"]) {
      if (zhJunziHtml.includes(stub)) fail(`/zh-Hans/blogs/what-is-a-junzi: leftover stub ${stub}`);
    }
    if (zhJunziHtml.includes(junziCoverEn)) {
      fail("/zh-Hans/blogs/what-is-a-junzi: English cover alt leaked onto zh-Hans");
    }
    if (countRegex(zhJunziHtml, />Junzi<\/a>/g) !== 0) {
      fail("/zh-Hans/blogs/what-is-a-junzi: English Junzi body link should not appear on zh-Hans");
    }
    if (countRegex(zhJunziHtml, />君子<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/what-is-a-junzi: 君子 body link should appear once");
    }
    if (countRegex(zhJunziHtml, />仁、君子与日常行为<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/what-is-a-junzi: 仁、君子与日常行为 body link should appear once");
    }
    if (countRegex(zhJunziHtml, />论语 · 为政 2\.12<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/what-is-a-junzi: 为政 2.12 body link should appear once");
    }
  }
  const enJunziFile = htmlPath("/en/blogs/what-is-a-junzi");
  if (exists(enJunziFile)) {
    const enJunziHtml = read(enJunziFile);
    if (enJunziHtml.includes(junziCoverZh)) {
      fail("/en/blogs/what-is-a-junzi: Chinese cover alt leaked onto en");
    }
    if (countRegex(enJunziHtml, />Junzi<\/a>/g) !== 1) {
      fail("/en/blogs/what-is-a-junzi: Junzi body link should appear once");
    }
    if (countRegex(enJunziHtml, />Ren, Junzi, and Everyday Conduct<\/a>/g) !== 1) {
      fail("/en/blogs/what-is-a-junzi: everyday-conduct body link should appear once");
    }
    if (countRegex(enJunziHtml, />The Analects · Wei Chang 2\.12<\/a>/g) !== 1) {
      fail("/en/blogs/what-is-a-junzi: Wei Chang 2.12 body link should appear once");
    }
  }
}

const zhongshuCover = "/images/blogs/zhongshu-reciprocity-in-the-analects/cover.jpg";
const zhongshuInline1 = "/images/blogs/zhongshu-reciprocity-in-the-analects/inline-1.jpg";
const zhongshuInline2 = "/images/blogs/zhongshu-reciprocity-in-the-analects/inline-2.jpg";
const zhongshuCoverEn =
  "Two complementary halves of one teaching — zhong and shu as a paired Analects door, not a Zen poster";
const zhongshuCoverZh = "同一教诲的两半并置——忠与恕作为《论语》成对之门，而非禅意海报";
const zhongshuInline1En =
  "A gift held back at the table’s midline — shu as “do not impose what you refuse,” not an empty bowl";
const zhongshuInline1Zh = "礼物停在桌线己侧——恕为「己所不欲勿施」，而非空碗静物";
const zhongshuInline2En =
  "Finishing an entrusted scroll versus trailing a raised seat — zhong is not blind loyalty";
const zhongshuInline2Zh = "办妥受托文书对照盲随高座——忠不等于愚忠";
const zhongshuAnchors = [
  ["忠恕", "https://www.lunyu.ai/zh-Hans/index/zhongshu"],
  ["Loyalty and reciprocity", "https://www.lunyu.ai/en/index/zhongshu"],
  ["论语 · 卫灵公 15.23", "https://www.lunyu.ai/zh-Hans/analects/wei-ling-gong/wei-ling-gong-023"],
  ["The Analects · Wei Ling Kung 15.23", "https://www.lunyu.ai/en/analects/wei-ling-gong/wei-ling-gong-023"],
  ["仲弓", "https://www.lunyu.ai/zh-Hans/index/zhong-gong"],
  ["Zhong Gong", "https://www.lunyu.ai/en/index/zhong-gong"],
  ["论语 · 里仁 4.15", "https://www.lunyu.ai/zh-Hans/analects/li-ren/li-ren-015"],
  ["The Analects · Le Jin 4.15", "https://www.lunyu.ai/en/analects/li-ren/li-ren-015"],
];
{
  const start = postSource.indexOf('slug: "zhongshu-reciprocity-in-the-analects"');
  if (start === -1) {
    fail("editorial-posts: missing zhongshu-reciprocity-in-the-analects");
  } else {
    const next = postSource.indexOf('slug: "', start + 1);
    const block = postSource.slice(start, next === -1 ? undefined : next);
    const markdownHrefs = [...block.matchAll(/\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g)].map(
      (match) => match[1]
    );
    const expectedHrefs = zhongshuAnchors.map(([, href]) => href);
    if (markdownHrefs.length !== expectedHrefs.length) {
      fail(
        `zhongshu-reciprocity-in-the-analects: expected ${expectedHrefs.length} markdown hrefs, got ${markdownHrefs.length}`
      );
    }
    zhongshuAnchors.forEach(([label, href]) => {
      if (!block.includes(`[${label}](${href})`)) {
        fail(`zhongshu-reciprocity-in-the-analects: missing [${label}](${href})`);
      }
    });
    markdownHrefs.forEach((href, index) => {
      if (href !== expectedHrefs[index]) {
        fail(
          `zhongshu-reciprocity-in-the-analects: markdown href ${index + 1} should be ${expectedHrefs[index]}`
        );
      }
    });
  }
}
for (const src of [zhongshuCover, zhongshuInline1, zhongshuInline2]) {
  if (!exists(`public${src}`)) fail(`missing Notes image public${src}`);
}
checkHtml("/en/blogs/zhongshu-reciprocity-in-the-analects", [
  `rel="canonical" href="${siteUrl}/en/blogs/zhongshu-reciprocity-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-15"',
  '"dateModified":"2026-09-16"',
  "Zhongshu in the Analects: Loyalty, Reciprocity, and What They Are Not",
  "Zhongshu is a paired Analects teaching—not blind loyalty and not a soft Golden Rule. Open the passages on this site.",
  "A short answer you can quote",
  "Split the pair",
  "Shu: a prohibition first",
  "Zhong: not “obey whoever is above you”",
  "Two passage doors",
  "Zengzi’s summary: “zhong and shu, and that is all”",
  "The lifelong word: “is it not shu?”",
  "Common collapses to refuse",
  "Open the line, then the index",
  "What is zhongshu in the Analects?",
  ">Loyalty and reciprocity</a>",
  ">The Analects · Wei Ling Kung 15.23</a>",
  ">Zhong Gong</a>",
  ">The Analects · Le Jin 4.15</a>",
  'href="/en/index/zhongshu"',
  'href="/en/analects/wei-ling-gong/wei-ling-gong-023"',
  'href="/en/index/zhong-gong"',
  'href="/en/analects/li-ren/li-ren-015"',
  zhongshuCover,
  zhongshuInline1,
  zhongshuInline2,
  zhongshuCoverEn,
  zhongshuInline1En,
  zhongshuInline2En,
  `property="og:image" content="${siteUrl}${zhongshuCover}"`,
  `property="og:image:alt" content="${zhongshuCoverEn}"`,
  `name="twitter:image" content="${siteUrl}${zhongshuCover}"`,
  `name="twitter:image:alt" content="${zhongshuCoverEn}"`,
]);
checkHtml("/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-15"',
  '"dateModified":"2026-09-16"',
  "《论语》的忠恕：不是愚忠，也不是英文 Golden Rule",
  "忠恕不是愚忠，也不等于一句「己所不欲」贴纸。拆开忠与恕，并链回可核对的原文。",
  "你在金句卡或搜索摘要里碰到「忠恕」时，多半想要一对可核对的说法",
  "一句可以引用的短答",
  "把这一对拆开",
  "恕：先是禁令",
  "三种常见的塌缩",
  "《论语》里的忠恕是什么？",
  ">忠恕</a>",
  ">论语 · 卫灵公 15.23</a>",
  ">仲弓</a>",
  ">论语 · 里仁 4.15</a>",
  'href="/zh-Hans/index/zhongshu"',
  'href="/zh-Hans/analects/wei-ling-gong/wei-ling-gong-023"',
  'href="/zh-Hans/index/zhong-gong"',
  'href="/zh-Hans/analects/li-ren/li-ren-015"',
  zhongshuCover,
  zhongshuInline1,
  zhongshuInline2,
  zhongshuCoverZh,
  zhongshuInline1Zh,
  zhongshuInline2Zh,
  `property="og:image" content="${siteUrl}${zhongshuCover}"`,
  `property="og:image:alt" content="${zhongshuCoverZh}"`,
  `name="twitter:image" content="${siteUrl}${zhongshuCover}"`,
  `name="twitter:image:alt" content="${zhongshuCoverZh}"`,
]);
{
  const zhZhongshuFile = htmlPath("/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects");
  if (exists(zhZhongshuFile)) {
    const zhZhongshuHtml = read(zhZhongshuFile);
    for (const stub of ["中文全文将于稍后发布", "中文解答将随全文于稍后发布"]) {
      if (zhZhongshuHtml.includes(stub)) {
        fail(`/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects: leftover stub ${stub}`);
      }
    }
    if (zhZhongshuHtml.includes(zhongshuCoverEn)) {
      fail("/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects: English cover alt leaked onto zh-Hans");
    }
    if (countRegex(zhZhongshuHtml, />Loyalty and reciprocity<\/a>/g) !== 0) {
      fail(
        "/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects: English Loyalty and reciprocity body link should not appear on zh-Hans"
      );
    }
    if (countRegex(zhZhongshuHtml, />忠恕<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects: 忠恕 body link should appear once");
    }
    if (countRegex(zhZhongshuHtml, />论语 · 卫灵公 15\.23<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects: 卫灵公 15.23 body link should appear once");
    }
    if (countRegex(zhZhongshuHtml, />仲弓<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects: 仲弓 body link should appear once");
    }
    if (countRegex(zhZhongshuHtml, />论语 · 里仁 4\.15<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects: 里仁 4.15 body link should appear once");
    }
  }
  const enZhongshuFile = htmlPath("/en/blogs/zhongshu-reciprocity-in-the-analects");
  if (exists(enZhongshuFile)) {
    const enZhongshuHtml = read(enZhongshuFile);
    if (enZhongshuHtml.includes(zhongshuCoverZh)) {
      fail("/en/blogs/zhongshu-reciprocity-in-the-analects: Chinese cover alt leaked onto en");
    }
    if (countRegex(enZhongshuHtml, />Loyalty and reciprocity<\/a>/g) !== 1) {
      fail("/en/blogs/zhongshu-reciprocity-in-the-analects: Loyalty and reciprocity body link should appear once");
    }
    if (countRegex(enZhongshuHtml, />The Analects · Wei Ling Kung 15\.23<\/a>/g) !== 1) {
      fail("/en/blogs/zhongshu-reciprocity-in-the-analects: Wei Ling Kung 15.23 body link should appear once");
    }
    if (countRegex(enZhongshuHtml, />Zhong Gong<\/a>/g) !== 1) {
      fail("/en/blogs/zhongshu-reciprocity-in-the-analects: Zhong Gong body link should appear once");
    }
    if (countRegex(enZhongshuHtml, />The Analects · Le Jin 4\.15<\/a>/g) !== 1) {
      fail("/en/blogs/zhongshu-reciprocity-in-the-analects: Le Jin 4.15 body link should appear once");
    }
  }
}
for (const locale of locales) {
  checkHtml(`/${locale}/index/zhongshu`, [
    `href="/${locale}/blogs/zhongshu-reciprocity-in-the-analects"`,
  ]);
}

const dukeAiCover = "/images/blogs/duke-ai-of-lu-in-the-analects/cover.jpg";
const dukeAiInline1 = "/images/blogs/duke-ai-of-lu-in-the-analects/inline-1.jpg";
const dukeAiInline2 = "/images/blogs/duke-ai-of-lu-in-the-analects/inline-2.jpg";
const dukeAiCoverEn =
  "A Lu court audience — Duke Ai’s question to Confucius about how the people will submit";
const dukeAiCoverZh = "鲁廷对问之席——哀公问孔子「何为则民服」";
const dukeAiInline1En =
  "Upright appointments set above the crooked — “raise the straight, set aside the crooked”";
const dukeAiInline1Zh = "直者举于枉者之上——「举直错诸枉」的用人意象";
const dukeAiInline2En =
  "An empty grain measure at a quiet court table — scarcity-year counsel, not spectacle";
const dukeAiInline2Zh = "空量器置于素净廷案——年饥问计，而非灾异奇观";
const dukeAiAnchors = [
  ["鲁哀公", "https://www.lunyu.ai/zh-Hans/index/duke-ai"],
  ["Duke Ai of Lu", "https://www.lunyu.ai/en/index/duke-ai"],
  ["论语 · 颜渊 12.9", "https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-009"],
  ["The Analects · Yen Yuan 12.9", "https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-009"],
  ["《论语》里的宰我是谁？", "https://www.lunyu.ai/zh-Hans/blogs/zai-wo-in-the-analects"],
  ["Who Was Zai Wo in the Analects?", "https://www.lunyu.ai/en/blogs/zai-wo-in-the-analects"],
  ["论语 · 为政 2.19", "https://www.lunyu.ai/zh-Hans/analects/wei-zheng/wei-zheng-019"],
  ["The Analects · Wei Chang 2.19", "https://www.lunyu.ai/en/analects/wei-zheng/wei-zheng-019"],
];
{
  const start = postSource.indexOf('slug: "duke-ai-of-lu-in-the-analects"');
  if (start === -1) {
    fail("editorial-posts: missing duke-ai-of-lu-in-the-analects");
  } else {
    const next = postSource.indexOf('slug: "', start + 1);
    const block = postSource.slice(start, next === -1 ? undefined : next);
    const markdownHrefs = [...block.matchAll(/\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g)].map(
      (match) => match[1]
    );
    const expectedHrefs = dukeAiAnchors.map(([, href]) => href);
    if (markdownHrefs.length !== expectedHrefs.length) {
      fail(
        `duke-ai-of-lu-in-the-analects: expected ${expectedHrefs.length} markdown hrefs, got ${markdownHrefs.length}`
      );
    }
    dukeAiAnchors.forEach(([label, href]) => {
      if (!block.includes(`[${label}](${href})`)) {
        fail(`duke-ai-of-lu-in-the-analects: missing [${label}](${href})`);
      }
    });
    markdownHrefs.forEach((href, index) => {
      if (href !== expectedHrefs[index]) {
        fail(
          `duke-ai-of-lu-in-the-analects: markdown href ${index + 1} should be ${expectedHrefs[index]}`
        );
      }
    });
  }
}
for (const src of [dukeAiCover, dukeAiInline1, dukeAiInline2]) {
  if (!exists(`public${src}`)) fail(`missing Notes image public${src}`);
}
checkHtml("/en/blogs/duke-ai-of-lu-in-the-analects", [
  `rel="canonical" href="${siteUrl}/en/blogs/duke-ai-of-lu-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-20"',
  '"dateModified":"2026-09-20"',
  "Who Was Duke Ai of Lu in the Analects?",
  "Duke Ai of Lu in the Analects: the ruler whose questions open doors—how the people submit, a year of scarcity, and the land altars.",
  "Place him by the passages, not by a royal résumé",
  "Three doors his questions open",
  "How the people submit",
  "A year of scarcity",
  "The land altars",
  "Not Duke Ding, not Duke Ling",
  "How you should cite him",
  "Read the “民服” page next",
  "Who was Duke Ai of Lu in the Analects?",
  ">Duke Ai of Lu</a>",
  ">The Analects · Yen Yuan 12.9</a>",
  ">Who Was Zai Wo in the Analects?</a>",
  ">The Analects · Wei Chang 2.19</a>",
  'href="/en/index/duke-ai"',
  'href="/en/analects/yan-yuan/yan-yuan-009"',
  'href="/en/blogs/zai-wo-in-the-analects"',
  'href="/en/analects/wei-zheng/wei-zheng-019"',
  dukeAiCover,
  dukeAiInline1,
  dukeAiInline2,
  dukeAiCoverEn,
  dukeAiInline1En,
  dukeAiInline2En,
  `property="og:image" content="${siteUrl}${dukeAiCover}"`,
  `property="og:image:alt" content="${dukeAiCoverEn}"`,
  `name="twitter:image" content="${siteUrl}${dukeAiCover}"`,
  `name="twitter:image:alt" content="${dukeAiCoverEn}"`,
]);
checkHtml("/zh-Hans/blogs/duke-ai-of-lu-in-the-analects", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/duke-ai-of-lu-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-20"',
  '"dateModified":"2026-09-20"',
  "《论语》里的鲁哀公是谁？",
  "《论语》里的鲁哀公：用提问打开的门——何为则民服、年饥用不足、问社。链回可核对的原文。",
  "你搜「鲁哀公」或 Duke Ai of Lu 时，多半是想在《论语》一串国君名里把他安顿下来",
  "先按篇章认人，不靠王侯履历",
  "他的提问打开的三扇门",
  "何为则民服",
  "年饥用不足",
  "问社",
  "不是鲁定公，也不是卫灵公",
  "你该怎样引用他",
  "接下来读「民服」那一章",
  ">鲁哀公</a>",
  ">论语 · 颜渊 12.9</a>",
  ">《论语》里的宰我是谁？</a>",
  ">论语 · 为政 2.19</a>",
  'href="/zh-Hans/index/duke-ai"',
  'href="/zh-Hans/analects/yan-yuan/yan-yuan-009"',
  'href="/zh-Hans/blogs/zai-wo-in-the-analects"',
  'href="/zh-Hans/analects/wei-zheng/wei-zheng-019"',
  dukeAiCover,
  dukeAiInline1,
  dukeAiInline2,
  dukeAiCoverZh,
  dukeAiInline1Zh,
  dukeAiInline2Zh,
  `property="og:image" content="${siteUrl}${dukeAiCover}"`,
  `property="og:image:alt" content="${dukeAiCoverZh}"`,
  `name="twitter:image" content="${siteUrl}${dukeAiCover}"`,
  `name="twitter:image:alt" content="${dukeAiCoverZh}"`,
]);
{
  const zhDukeAiFile = htmlPath("/zh-Hans/blogs/duke-ai-of-lu-in-the-analects");
  if (exists(zhDukeAiFile)) {
    const zhDukeAiHtml = read(zhDukeAiFile);
    for (const stub of ["中文全文将于稍后发布", "中文解答将随全文于稍后发布"]) {
      if (zhDukeAiHtml.includes(stub)) {
        fail(`/zh-Hans/blogs/duke-ai-of-lu-in-the-analects: leftover stub ${stub}`);
      }
    }
    if (zhDukeAiHtml.includes(dukeAiCoverEn)) {
      fail("/zh-Hans/blogs/duke-ai-of-lu-in-the-analects: English cover alt leaked onto zh-Hans");
    }
    if (countRegex(zhDukeAiHtml, />Duke Ai of Lu<\/a>/g) !== 0) {
      fail("/zh-Hans/blogs/duke-ai-of-lu-in-the-analects: English Duke Ai of Lu body link should not appear on zh-Hans");
    }
    if (countRegex(zhDukeAiHtml, />鲁哀公<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/duke-ai-of-lu-in-the-analects: 鲁哀公 body link should appear once");
    }
    if (countRegex(zhDukeAiHtml, />论语 · 颜渊 12\.9<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/duke-ai-of-lu-in-the-analects: 颜渊 12.9 body link should appear once");
    }
    if (countRegex(zhDukeAiHtml, />《论语》里的宰我是谁？<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/duke-ai-of-lu-in-the-analects: 宰我 Note body link should appear once");
    }
    if (countRegex(zhDukeAiHtml, />论语 · 为政 2\.19<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/duke-ai-of-lu-in-the-analects: 为政 2.19 body link should appear once");
    }
  }
  const enDukeAiFile = htmlPath("/en/blogs/duke-ai-of-lu-in-the-analects");
  if (exists(enDukeAiFile)) {
    const enDukeAiHtml = read(enDukeAiFile);
    if (enDukeAiHtml.includes(dukeAiCoverZh)) {
      fail("/en/blogs/duke-ai-of-lu-in-the-analects: Chinese cover alt leaked onto en");
    }
    if (countRegex(enDukeAiHtml, />Duke Ai of Lu<\/a>/g) !== 1) {
      fail("/en/blogs/duke-ai-of-lu-in-the-analects: Duke Ai of Lu body link should appear once");
    }
    if (countRegex(enDukeAiHtml, />The Analects · Yen Yuan 12\.9<\/a>/g) !== 1) {
      fail("/en/blogs/duke-ai-of-lu-in-the-analects: Yen Yuan 12.9 body link should appear once");
    }
    if (countRegex(enDukeAiHtml, />Who Was Zai Wo in the Analects\?<\/a>/g) !== 1) {
      fail("/en/blogs/duke-ai-of-lu-in-the-analects: Zai Wo Note body link should appear once");
    }
    if (countRegex(enDukeAiHtml, />The Analects · Wei Chang 2\.19<\/a>/g) !== 1) {
      fail("/en/blogs/duke-ai-of-lu-in-the-analects: Wei Chang 2.19 body link should appear once");
    }
  }
}

const yaoShunYuCover = "/images/blogs/yao-shun-yu-in-the-analects/cover.jpg";
const yaoShunYuInline1 = "/images/blogs/yao-shun-yu-in-the-analects/inline-1.jpg";
const yaoShunYuInline2 = "/images/blogs/yao-shun-yu-in-the-analects/inline-2.jpg";
const yaoShunYuCoverEn =
  "Three quiet markers under open sky — Yao, Shun, and Yu as the Analects’ measure of rule";
const yaoShunYuCoverZh = "苍穹下三处素净记号——尧、舜、禹作为《论语》里的治道标尺";
const yaoShunYuInline1En =
  "Vast sky wash above a quiet seat of rule — Yao praised as matching Heaven (Analects 8.19)";
const yaoShunYuInline1Zh = "苍穹淡墨下素净治席——泰伯 8.19 赞尧「唯天为大」的意象";
const yaoShunYuInline2En =
  "Calm desk and a guided water line — Shun’s ease and Yu’s tireless care, without spectacle";
const yaoShunYuInline2Zh = "素案与理水细线——舜之无为与禹之无间然，而非灾异奇观";
const yaoShunYuAnchors = [
  ["尧、舜、禹", "https://www.lunyu.ai/zh-Hans/index/yao-shun-yu"],
  ["Yao, Shun, and Yu", "https://www.lunyu.ai/en/index/yao-shun-yu"],
  ["论语 · 泰伯 8.21", "https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-021"],
  ["The Analects · T'ai-po 8.21", "https://www.lunyu.ai/en/analects/tai-bo/tai-bo-021"],
  ["《论语》里的鲁哀公是谁？", "https://www.lunyu.ai/zh-Hans/blogs/duke-ai-of-lu-in-the-analects"],
  ["Who Was Duke Ai of Lu in the Analects?", "https://www.lunyu.ai/en/blogs/duke-ai-of-lu-in-the-analects"],
  ["论语 · 泰伯 8.19", "https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-019"],
  ["The Analects · T'ai-po 8.19", "https://www.lunyu.ai/en/analects/tai-bo/tai-bo-019"],
];
{
  const start = postSource.indexOf('slug: "yao-shun-yu-in-the-analects"');
  if (start === -1) {
    fail("editorial-posts: missing yao-shun-yu-in-the-analects");
  } else {
    const next = postSource.indexOf('slug: "', start + 1);
    const block = postSource.slice(start, next === -1 ? undefined : next);
    const markdownHrefs = [...block.matchAll(/\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g)].map(
      (match) => match[1]
    );
    const expectedHrefs = yaoShunYuAnchors.map(([, href]) => href);
    if (markdownHrefs.length !== expectedHrefs.length) {
      fail(
        `yao-shun-yu-in-the-analects: expected ${expectedHrefs.length} markdown hrefs, got ${markdownHrefs.length}`
      );
    }
    yaoShunYuAnchors.forEach(([label, href]) => {
      if (!block.includes(`[${label}](${href})`)) {
        fail(`yao-shun-yu-in-the-analects: missing [${label}](${href})`);
      }
    });
    markdownHrefs.forEach((href, index) => {
      if (href !== expectedHrefs[index]) {
        fail(
          `yao-shun-yu-in-the-analects: markdown href ${index + 1} should be ${expectedHrefs[index]}`
        );
      }
    });
  }
}
for (const src of [yaoShunYuCover, yaoShunYuInline1, yaoShunYuInline2]) {
  if (!exists(`public${src}`)) fail(`missing Notes image public${src}`);
}
checkHtml("/en/blogs/yao-shun-yu-in-the-analects", [
  `rel="canonical" href="${siteUrl}/en/blogs/yao-shun-yu-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-21"',
  '"dateModified":"2026-09-21"',
  "Who Are Yao, Shun, and Yu in the Analects?",
  "Yao, Shun, and Yu in the Analects: sage kings used as a measure of rule—Yao matching Heaven, Shun and Yu holding the empire lightly, Yu without flaw.",
  "Place them by the passages, not by a sage-king dump",
  "How the book uses them as a measure of rule",
  "Yu without flaw",
  "Not a junzi treatise, not a multi-ruler bio",
  "How you should cite them",
  "Read the Yao praise page next",
  "Who are Yao, Shun, and Yu in the Analects?",
  ">Yao, Shun, and Yu</a>",
  ">The Analects · T&#x27;ai-po 8.21</a>",
  ">Who Was Duke Ai of Lu in the Analects?</a>",
  ">The Analects · T&#x27;ai-po 8.19</a>",
  'href="/en/index/yao-shun-yu"',
  'href="/en/analects/tai-bo/tai-bo-021"',
  'href="/en/blogs/duke-ai-of-lu-in-the-analects"',
  'href="/en/analects/tai-bo/tai-bo-019"',
  yaoShunYuCover,
  yaoShunYuInline1,
  yaoShunYuInline2,
  yaoShunYuCoverEn,
  yaoShunYuInline1En,
  yaoShunYuInline2En,
  `property="og:image" content="${siteUrl}${yaoShunYuCover}"`,
  `property="og:image:alt" content="${yaoShunYuCoverEn}"`,
  `name="twitter:image" content="${siteUrl}${yaoShunYuCover}"`,
  `name="twitter:image:alt" content="${yaoShunYuCoverEn}"`,
]);
checkHtml("/zh-Hans/blogs/yao-shun-yu-in-the-analects", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/yao-shun-yu-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-21"',
  '"dateModified":"2026-09-21"',
  "《论语》里的尧、舜、禹是谁？",
  "《论语》里的尧、舜、禹：治道标尺——尧则天、舜禹不与、禹无间然。链回可核对的原文。",
  "你搜「尧舜禹」或「yao shun yu」时，多半是想把《论语》一再指向的三个圣王名安顿下来",
  "先按篇章认人，不靠圣王履历",
  "书怎样用他们作治道标尺",
  "禹无间然",
  "不是君子通论，也不是诸公合传",
  "你该怎样引用他们",
  "接下来读赞尧那一章",
  ">尧、舜、禹</a>",
  ">论语 · 泰伯 8.21</a>",
  ">《论语》里的鲁哀公是谁？</a>",
  ">论语 · 泰伯 8.19</a>",
  'href="/zh-Hans/index/yao-shun-yu"',
  'href="/zh-Hans/analects/tai-bo/tai-bo-021"',
  'href="/zh-Hans/blogs/duke-ai-of-lu-in-the-analects"',
  'href="/zh-Hans/analects/tai-bo/tai-bo-019"',
  yaoShunYuCover,
  yaoShunYuInline1,
  yaoShunYuInline2,
  yaoShunYuCoverZh,
  yaoShunYuInline1Zh,
  yaoShunYuInline2Zh,
  `property="og:image" content="${siteUrl}${yaoShunYuCover}"`,
  `property="og:image:alt" content="${yaoShunYuCoverZh}"`,
  `name="twitter:image" content="${siteUrl}${yaoShunYuCover}"`,
  `name="twitter:image:alt" content="${yaoShunYuCoverZh}"`,
]);
{
  const zhYaoShunYuFile = htmlPath("/zh-Hans/blogs/yao-shun-yu-in-the-analects");
  if (exists(zhYaoShunYuFile)) {
    const zhYaoShunYuHtml = read(zhYaoShunYuFile);
    for (const stub of ["中文全文将于稍后发布", "中文解答将随全文于稍后发布"]) {
      if (zhYaoShunYuHtml.includes(stub)) {
        fail(`/zh-Hans/blogs/yao-shun-yu-in-the-analects: leftover stub ${stub}`);
      }
    }
    if (zhYaoShunYuHtml.includes(yaoShunYuCoverEn)) {
      fail("/zh-Hans/blogs/yao-shun-yu-in-the-analects: English cover alt leaked onto zh-Hans");
    }
    if (countRegex(zhYaoShunYuHtml, />Yao, Shun, and Yu<\/a>/g) !== 0) {
      fail("/zh-Hans/blogs/yao-shun-yu-in-the-analects: English Yao, Shun, and Yu body link should not appear on zh-Hans");
    }
    if (countRegex(zhYaoShunYuHtml, />尧、舜、禹<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/yao-shun-yu-in-the-analects: 尧、舜、禹 body link should appear once");
    }
    if (countRegex(zhYaoShunYuHtml, />论语 · 泰伯 8\.21<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/yao-shun-yu-in-the-analects: 泰伯 8.21 body link should appear once");
    }
    if (countRegex(zhYaoShunYuHtml, />《论语》里的鲁哀公是谁？<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/yao-shun-yu-in-the-analects: Duke Ai Note body link should appear once");
    }
    if (countRegex(zhYaoShunYuHtml, />论语 · 泰伯 8\.19<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/yao-shun-yu-in-the-analects: 泰伯 8.19 body link should appear once");
    }
  }
  const enYaoShunYuFile = htmlPath("/en/blogs/yao-shun-yu-in-the-analects");
  if (exists(enYaoShunYuFile)) {
    const enYaoShunYuHtml = read(enYaoShunYuFile);
    if (enYaoShunYuHtml.includes(yaoShunYuCoverZh)) {
      fail("/en/blogs/yao-shun-yu-in-the-analects: Chinese cover alt leaked onto en");
    }
    if (countRegex(enYaoShunYuHtml, />Yao, Shun, and Yu<\/a>/g) !== 1) {
      fail("/en/blogs/yao-shun-yu-in-the-analects: Yao, Shun, and Yu body link should appear once");
    }
    if (countRegex(enYaoShunYuHtml, />The Analects · T&#x27;ai-po 8\.21<\/a>/g) !== 1) {
      fail("/en/blogs/yao-shun-yu-in-the-analects: T'ai-po 8.21 body link should appear once");
    }
    if (countRegex(enYaoShunYuHtml, />Who Was Duke Ai of Lu in the Analects\?<\/a>/g) !== 1) {
      fail("/en/blogs/yao-shun-yu-in-the-analects: Duke Ai Note body link should appear once");
    }
    if (countRegex(enYaoShunYuHtml, />The Analects · T&#x27;ai-po 8\.19<\/a>/g) !== 1) {
      fail("/en/blogs/yao-shun-yu-in-the-analects: T'ai-po 8.19 body link should appear once");
    }
  }
}

const dukeLingCover = "/images/blogs/duke-ling-of-wei-in-the-analects/cover.jpg";
const dukeLingInline1 = "/images/blogs/duke-ling-of-wei-in-the-analects/inline-1.jpg";
const dukeLingInline2 = "/images/blogs/duke-ling-of-wei-in-the-analects/inline-2.jpg";
const dukeLingCoverEn =
  "A Wei court seat facing quiet officer posts — Duke Ling named where the state holds by capable men";
const dukeLingCoverZh = "卫廷空席对向素净职守——宪问点名卫灵公，国不丧于能臣分守";
const dukeLingInline1En =
  "A dim ruler’s seat beside three upright posts of office — “no Way,” yet the state does not fall";
const dukeLingInline1Zh = "昏暗君席旁三根直立职守之柱——「无道」而国不丧";
const dukeLingInline2En =
  "A closed volume beside a separate name seal — Book 15’s title words vs the person Duke Ling";
const dukeLingInline2Zh = "合上的线装册旁另置名印空白——第十五篇书名与人物卫灵公之别";
const dukeLingAnchors = [
  ["卫灵公", "https://www.lunyu.ai/zh-Hans/index/wei-ling-gong-person"],
  ["Duke Ling of Wei", "https://www.lunyu.ai/en/index/wei-ling-gong-person"],
  ["论语 · 卫灵公 15.1", "https://www.lunyu.ai/zh-Hans/analects/wei-ling-gong/wei-ling-gong-001"],
  ["The Analects · Wei Ling Kung 15.1", "https://www.lunyu.ai/en/analects/wei-ling-gong/wei-ling-gong-001"],
  ["《论语》里的鲁哀公是谁？", "https://www.lunyu.ai/zh-Hans/blogs/duke-ai-of-lu-in-the-analects"],
  ["Who Was Duke Ai of Lu in the Analects?", "https://www.lunyu.ai/en/blogs/duke-ai-of-lu-in-the-analects"],
  ["论语 · 宪问 14.20", "https://www.lunyu.ai/zh-Hans/analects/xian-wen/xian-wen-020"],
  ["The Analects · Hsien Wan 14.20", "https://www.lunyu.ai/en/analects/xian-wen/xian-wen-020"],
];
{
  const start = postSource.indexOf('slug: "duke-ling-of-wei-in-the-analects"');
  if (start === -1) {
    fail("editorial-posts: missing duke-ling-of-wei-in-the-analects");
  } else {
    const next = postSource.indexOf('slug: "', start + 1);
    const block = postSource.slice(start, next === -1 ? undefined : next);
    const markdownHrefs = [...block.matchAll(/\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g)].map(
      (match) => match[1]
    );
    const expectedHrefs = dukeLingAnchors.map(([, href]) => href);
    if (markdownHrefs.length !== expectedHrefs.length) {
      fail(
        `duke-ling-of-wei-in-the-analects: expected ${expectedHrefs.length} markdown hrefs, got ${markdownHrefs.length}`
      );
    }
    dukeLingAnchors.forEach(([label, href]) => {
      if (!block.includes(`[${label}](${href})`)) {
        fail(`duke-ling-of-wei-in-the-analects: missing [${label}](${href})`);
      }
    });
    markdownHrefs.forEach((href, index) => {
      if (href !== expectedHrefs[index]) {
        fail(
          `duke-ling-of-wei-in-the-analects: markdown href ${index + 1} should be ${expectedHrefs[index]}`
        );
      }
    });
  }
}
for (const src of [dukeLingCover, dukeLingInline1, dukeLingInline2]) {
  if (!exists(`public${src}`)) fail(`missing Notes image public${src}`);
}
checkHtml("/en/blogs/duke-ling-of-wei-in-the-analects", [
  `rel="canonical" href="${siteUrl}/en/blogs/duke-ling-of-wei-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-22"',
  '"dateModified":"2026-09-22"',
  "Who Was Duke Ling of Wei in the Analects?",
  "Duke Ling of Wei in the Analects: Confucius names an unprincipled course—yet Wei does not fall, because officers hold guest rites, the ancestral temple, and the army.",
  "you usually want one Wei ruler placed among many names in the Analects",
  "Place him by the passage, not by a royal résumé",
  "Unprincipled course—yet the state does not fall",
  "Book title vs the person",
  "Not Duke Ai, not Duke Ding",
  "How you should cite him",
  "Read Hsien Wan 14.20 next",
  "Who was Duke Ling of Wei in the Analects?",
  ">Duke Ling of Wei</a>",
  ">The Analects · Wei Ling Kung 15.1</a>",
  ">Who Was Duke Ai of Lu in the Analects?</a>",
  ">The Analects · Hsien Wan 14.20</a>",
  'href="/en/index/wei-ling-gong-person"',
  'href="/en/analects/wei-ling-gong/wei-ling-gong-001"',
  'href="/en/blogs/duke-ai-of-lu-in-the-analects"',
  'href="/en/analects/xian-wen/xian-wen-020"',
  dukeLingCover,
  dukeLingInline1,
  dukeLingInline2,
  dukeLingCoverEn,
  dukeLingInline1En,
  dukeLingInline2En,
  `property="og:image" content="${siteUrl}${dukeLingCover}"`,
  `property="og:image:alt" content="${dukeLingCoverEn}"`,
  `name="twitter:image" content="${siteUrl}${dukeLingCover}"`,
  `name="twitter:image:alt" content="${dukeLingCoverEn}"`,
]);
checkHtml("/zh-Hans/blogs/duke-ling-of-wei-in-the-analects", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/duke-ling-of-wei-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-22"',
  '"dateModified":"2026-09-22"',
  "《论语》里的卫灵公是谁？",
  "《论语》里的卫灵公：孔子点出他的无道——卫却不丧，只因宾客、宗庙、军旅各有能臣分守。链回可核对的原文。",
  "你搜「卫灵公」或 Duke Ling of Wei 时，多半是想在《论语》一串国君名里把他安顿下来",
  "先按篇章认人，不靠王侯履历",
  "「无道」却不丧",
  "书名与人物",
  "不是鲁哀公，也不是鲁定公",
  "你该怎样引用他",
  "接下来读宪问 14.20",
  ">卫灵公</a>",
  ">论语 · 卫灵公 15.1</a>",
  ">《论语》里的鲁哀公是谁？</a>",
  ">论语 · 宪问 14.20</a>",
  'href="/zh-Hans/index/wei-ling-gong-person"',
  'href="/zh-Hans/analects/wei-ling-gong/wei-ling-gong-001"',
  'href="/zh-Hans/blogs/duke-ai-of-lu-in-the-analects"',
  'href="/zh-Hans/analects/xian-wen/xian-wen-020"',
  dukeLingCover,
  dukeLingInline1,
  dukeLingInline2,
  dukeLingCoverZh,
  dukeLingInline1Zh,
  dukeLingInline2Zh,
  `property="og:image" content="${siteUrl}${dukeLingCover}"`,
  `property="og:image:alt" content="${dukeLingCoverZh}"`,
  `name="twitter:image" content="${siteUrl}${dukeLingCover}"`,
  `name="twitter:image:alt" content="${dukeLingCoverZh}"`,
]);
{
  const zhDukeLingFile = htmlPath("/zh-Hans/blogs/duke-ling-of-wei-in-the-analects");
  if (exists(zhDukeLingFile)) {
    const zhDukeLingHtml = read(zhDukeLingFile);
    for (const stub of ["中文全文将于稍后发布", "中文解答将随全文于稍后发布"]) {
      if (zhDukeLingHtml.includes(stub)) {
        fail(`/zh-Hans/blogs/duke-ling-of-wei-in-the-analects: leftover stub ${stub}`);
      }
    }
    if (zhDukeLingHtml.includes(dukeLingCoverEn)) {
      fail("/zh-Hans/blogs/duke-ling-of-wei-in-the-analects: English cover alt leaked onto zh-Hans");
    }
    if (countRegex(zhDukeLingHtml, />Duke Ling of Wei<\/a>/g) !== 0) {
      fail("/zh-Hans/blogs/duke-ling-of-wei-in-the-analects: English Duke Ling of Wei body link should not appear on zh-Hans");
    }
    if (countRegex(zhDukeLingHtml, />卫灵公<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/duke-ling-of-wei-in-the-analects: 卫灵公 body link should appear once");
    }
    if (countRegex(zhDukeLingHtml, />论语 · 卫灵公 15\.1<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/duke-ling-of-wei-in-the-analects: 卫灵公 15.1 body link should appear once");
    }
    if (countRegex(zhDukeLingHtml, />《论语》里的鲁哀公是谁？<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/duke-ling-of-wei-in-the-analects: Duke Ai Note body link should appear once");
    }
    if (countRegex(zhDukeLingHtml, />论语 · 宪问 14\.20<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/duke-ling-of-wei-in-the-analects: 宪问 14.20 body link should appear once");
    }
  }
  const enDukeLingFile = htmlPath("/en/blogs/duke-ling-of-wei-in-the-analects");
  if (exists(enDukeLingFile)) {
    const enDukeLingHtml = read(enDukeLingFile);
    if (enDukeLingHtml.includes(dukeLingCoverZh)) {
      fail("/en/blogs/duke-ling-of-wei-in-the-analects: Chinese cover alt leaked onto en");
    }
    if (countRegex(enDukeLingHtml, />Duke Ling of Wei<\/a>/g) !== 1) {
      fail("/en/blogs/duke-ling-of-wei-in-the-analects: Duke Ling of Wei body link should appear once");
    }
    if (countRegex(enDukeLingHtml, />The Analects · Wei Ling Kung 15\.1<\/a>/g) !== 1) {
      fail("/en/blogs/duke-ling-of-wei-in-the-analects: Wei Ling Kung 15.1 body link should appear once");
    }
    if (countRegex(enDukeLingHtml, />Who Was Duke Ai of Lu in the Analects\?<\/a>/g) !== 1) {
      fail("/en/blogs/duke-ling-of-wei-in-the-analects: Duke Ai Note body link should appear once");
    }
    if (countRegex(enDukeLingHtml, />The Analects · Hsien Wan 14\.20<\/a>/g) !== 1) {
      fail("/en/blogs/duke-ling-of-wei-in-the-analects: Hsien Wan 14.20 body link should appear once");
    }
  }
}

const zhongGongCover = "/images/blogs/zhong-gong-in-the-analects/cover.jpg";
const zhongGongInline1 = "/images/blogs/zhong-gong-in-the-analects/inline-1.jpg";
const zhongGongInline2 = "/images/blogs/zhong-gong-in-the-analects/inline-2.jpg";
const zhongGongCoverEn =
  "An empty south-facing seat open to misted hills — Zhong Gong, who might face south as a prince";
const zhongGongCoverZh = "空置南面之席临向雾山——仲弓，雍也可使南面";
const zhongGongInline1En =
  "Incense and a spare desk with brush and paper — reverence within, simplicity in practice";
const zhongGongInline1Zh = "一炷清香与素净书案笔纸——居敬而行简";
const zhongGongInline2En =
  "An open doorway and a ready mat — go out as if receiving a great guest";
const zhongGongInline2Zh = "门开向晓与待客之席——出门如见大宾";
const zhongGongAnchors = [
  ["仲弓", "https://www.lunyu.ai/zh-Hans/index/zhong-gong"],
  ["Zhong Gong", "https://www.lunyu.ai/en/index/zhong-gong"],
  ["论语 · 颜渊 12.2", "https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-002"],
  ["The Analects · Yen Yuan 12.2", "https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-002"],
  ["论语 · 雍也 6.1", "https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-001"],
  ["The Analects · Yung Yey 6.1", "https://www.lunyu.ai/en/analects/yong-ye/yong-ye-001"],
];
{
  const start = postSource.indexOf('slug: "zhong-gong-in-the-analects"');
  if (start === -1) {
    fail("editorial-posts: missing zhong-gong-in-the-analects");
  } else {
    const next = postSource.indexOf('slug: "', start + 1);
    const block = postSource.slice(start, next === -1 ? undefined : next);
    const markdownHrefs = [...block.matchAll(/\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g)].map(
      (match) => match[1]
    );
    const expectedHrefs = zhongGongAnchors.map(([, href]) => href);
    if (markdownHrefs.length !== expectedHrefs.length) {
      fail(
        `zhong-gong-in-the-analects: expected ${expectedHrefs.length} markdown hrefs, got ${markdownHrefs.length}`
      );
    }
    zhongGongAnchors.forEach(([label, href]) => {
      if (!block.includes(`[${label}](${href})`)) {
        fail(`zhong-gong-in-the-analects: missing [${label}](${href})`);
      }
    });
    markdownHrefs.forEach((href, index) => {
      if (href !== expectedHrefs[index]) {
        fail(
          `zhong-gong-in-the-analects: markdown href ${index + 1} should be ${expectedHrefs[index]}`
        );
      }
    });
  }
}
for (const src of [zhongGongCover, zhongGongInline1, zhongGongInline2]) {
  if (!exists(`public${src}`)) fail(`missing Notes image public${src}`);
}
checkHtml("/en/blogs/zhong-gong-in-the-analects", [
  `rel="canonical" href="${siteUrl}/en/blogs/zhong-gong-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-23"',
  '"dateModified":"2026-09-23"',
  "Who Was Zhong Gong in the Analects?",
  "Zhong Gong in the Analects: the disciple Confucius says might face south as a prince, who argues for reverence with simplicity and later asks about ren.",
  "you are usually trying to place one disciple among many names",
  "Place him by the passages, not by a résumé",
  "Facing south—and arguing for reverence with simplicity",
  "Listed under virtuous practice",
  "When he asks about ren",
  "Not zhongshu—same sound, different door",
  "How you should cite him",
  "Read Yung Yey 6.1 next",
  "Who was Zhong Gong in the Analects?",
  ">Zhong Gong</a>",
  ">The Analects · Yen Yuan 12.2</a>",
  ">The Analects · Yung Yey 6.1</a>",
  'href="/en/index/zhong-gong"',
  'href="/en/analects/yan-yuan/yan-yuan-002"',
  'href="/en/analects/yong-ye/yong-ye-001"',
  zhongGongCover,
  zhongGongInline1,
  zhongGongInline2,
  zhongGongCoverEn,
  zhongGongInline1En,
  zhongGongInline2En,
  `property="og:image" content="${siteUrl}${zhongGongCover}"`,
  `property="og:image:alt" content="${zhongGongCoverEn}"`,
  `name="twitter:image" content="${siteUrl}${zhongGongCover}"`,
  `name="twitter:image:alt" content="${zhongGongCoverEn}"`,
]);
checkHtml("/zh-Hans/blogs/zhong-gong-in-the-analects", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/zhong-gong-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-23"',
  '"dateModified":"2026-09-23"',
  "《论语》里的仲弓是谁？",
  "《论语》里的仲弓：夫子说雍也可使南面，他又追问居敬而行简，并在别处问仁。链回可核对的原文。",
  "你搜「仲弓」或 zhong gong 时，多半是想在一串弟子名里把他安顿下来",
  "先按篇章认人，不靠履历表",
  "可使南面——也争「居敬而行简」",
  "列在德行一科",
  "他问仁的那一场",
  "不是忠恕——音近，门不同",
  "你该怎样引用他",
  "接下来读雍也 6.1",
  ">仲弓</a>",
  ">论语 · 颜渊 12.2</a>",
  ">论语 · 雍也 6.1</a>",
  'href="/zh-Hans/index/zhong-gong"',
  'href="/zh-Hans/analects/yan-yuan/yan-yuan-002"',
  'href="/zh-Hans/analects/yong-ye/yong-ye-001"',
  zhongGongCover,
  zhongGongInline1,
  zhongGongInline2,
  zhongGongCoverZh,
  zhongGongInline1Zh,
  zhongGongInline2Zh,
  `property="og:image" content="${siteUrl}${zhongGongCover}"`,
  `property="og:image:alt" content="${zhongGongCoverZh}"`,
  `name="twitter:image" content="${siteUrl}${zhongGongCover}"`,
  `name="twitter:image:alt" content="${zhongGongCoverZh}"`,
]);
{
  const zhZhongGongFile = htmlPath("/zh-Hans/blogs/zhong-gong-in-the-analects");
  if (exists(zhZhongGongFile)) {
    const zhZhongGongHtml = read(zhZhongGongFile);
    for (const stub of ["中文全文将于稍后发布", "中文解答将随全文于稍后发布"]) {
      if (zhZhongGongHtml.includes(stub)) {
        fail(`/zh-Hans/blogs/zhong-gong-in-the-analects: leftover stub ${stub}`);
      }
    }
    if (!/<h1\b[^>]*>《论语》里的仲弓是谁？<\/h1>/.test(zhZhongGongHtml)) {
      fail("/zh-Hans/blogs/zhong-gong-in-the-analects: H1 missing");
    }
    if (zhZhongGongHtml.includes(zhongGongCoverEn)) {
      fail("/zh-Hans/blogs/zhong-gong-in-the-analects: English cover alt leaked onto zh-Hans");
    }
    if (countRegex(zhZhongGongHtml, />Zhong Gong<\/a>/g) !== 0) {
      fail("/zh-Hans/blogs/zhong-gong-in-the-analects: English Zhong Gong body link should not appear on zh-Hans");
    }
    if (countRegex(zhZhongGongHtml, />仲弓<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zhong-gong-in-the-analects: 仲弓 body link should appear once");
    }
    if (countRegex(zhZhongGongHtml, />论语 · 颜渊 12\.2<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zhong-gong-in-the-analects: 颜渊 12.2 body link should appear once");
    }
    if (countRegex(zhZhongGongHtml, />论语 · 雍也 6\.1<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zhong-gong-in-the-analects: 雍也 6.1 body link should appear once");
    }
  }
  const enZhongGongFile = htmlPath("/en/blogs/zhong-gong-in-the-analects");
  if (exists(enZhongGongFile)) {
    const enZhongGongHtml = read(enZhongGongFile);
    if (!/<h1\b[^>]*>Who Was Zhong Gong in the Analects\?<\/h1>/.test(enZhongGongHtml)) {
      fail("/en/blogs/zhong-gong-in-the-analects: H1 missing");
    }
    if (enZhongGongHtml.includes(zhongGongCoverZh)) {
      fail("/en/blogs/zhong-gong-in-the-analects: Chinese cover alt leaked onto en");
    }
    if (countRegex(enZhongGongHtml, />Zhong Gong<\/a>/g) !== 1) {
      fail("/en/blogs/zhong-gong-in-the-analects: Zhong Gong body link should appear once");
    }
    if (countRegex(enZhongGongHtml, />The Analects · Yen Yuan 12\.2<\/a>/g) !== 1) {
      fail("/en/blogs/zhong-gong-in-the-analects: Yen Yuan 12.2 body link should appear once");
    }
    if (countRegex(enZhongGongHtml, />The Analects · Yung Yey 6\.1<\/a>/g) !== 1) {
      fail("/en/blogs/zhong-gong-in-the-analects: Yung Yey 6.1 body link should appear once");
    }
  }
}

const ziXiaCover = "/images/blogs/zi-xia-in-the-analects/cover.jpg";
const ziXiaInline1 = "/images/blogs/zi-xia-in-the-analects/inline-1.jpg";
const ziXiaInline2 = "/images/blogs/zi-xia-in-the-analects/inline-2.jpg";
const ziXiaCoverEn =
  "Open scrolls and a quiet reading desk — Zi Xia, the literary disciple who ties learning to conduct";
const ziXiaCoverZh = "展开的简册与安静书案——子夏，以文学见称并以行止界定何谓学";
const ziXiaInline1En =
  "A spare desk with a sealed letter and a plain cup — honor the worthy, serve parents and prince, keep friends' words sincere";
const ziXiaInline1Zh = "素净书案上的信函与素杯——贤贤易色，事亲事君，交友有信";
const ziXiaInline2En =
  "Morning light on a scholar's mat and open book — be a junzi scholar, not a petty one";
const ziXiaInline2Zh = "晨光落在书席与展开的册页——女为君子儒，无为小人儒";
const ziXiaAnchors = [
  ["子夏", "https://www.lunyu.ai/zh-Hans/index/zi-xia"],
  ["Zi Xia", "https://www.lunyu.ai/en/index/zi-xia"],
  ["论语 · 雍也 6.11", "https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-011"],
  ["The Analects · Yung Yey 6.11", "https://www.lunyu.ai/en/analects/yong-ye/yong-ye-011"],
  ["论语 · 学而 1.7", "https://www.lunyu.ai/zh-Hans/analects/xue-er/xue-er-007"],
  ["The Analects · Hsio R. 1.7", "https://www.lunyu.ai/en/analects/xue-er/xue-er-007"],
];
{
  const start = postSource.indexOf('slug: "zi-xia-in-the-analects"');
  if (start === -1) {
    fail("editorial-posts: missing zi-xia-in-the-analects");
  } else {
    const next = postSource.indexOf('slug: "', start + 1);
    const block = postSource.slice(start, next === -1 ? undefined : next);
    const markdownHrefs = [...block.matchAll(/\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g)].map(
      (match) => match[1]
    );
    const expectedHrefs = ziXiaAnchors.map(([, href]) => href);
    if (markdownHrefs.length !== expectedHrefs.length) {
      fail(
        `zi-xia-in-the-analects: expected ${expectedHrefs.length} markdown hrefs, got ${markdownHrefs.length}`
      );
    }
    ziXiaAnchors.forEach(([label, href]) => {
      if (!block.includes(`[${label}](${href})`)) {
        fail(`zi-xia-in-the-analects: missing [${label}](${href})`);
      }
    });
    markdownHrefs.forEach((href, index) => {
      if (href !== expectedHrefs[index]) {
        fail(`zi-xia-in-the-analects: markdown href ${index + 1} should be ${expectedHrefs[index]}`);
      }
    });
    for (const alt of [ziXiaCoverEn, ziXiaCoverZh, ziXiaInline1En, ziXiaInline1Zh, ziXiaInline2En, ziXiaInline2Zh]) {
      if (!block.includes(alt)) fail(`zi-xia-in-the-analects: editorial alt missing ${alt}`);
    }
  }
}
for (const src of [ziXiaCover, ziXiaInline1, ziXiaInline2]) {
  if (!exists(`public${src}`)) fail(`missing Notes image public${src}`);
}
checkHtml("/en/blogs/zi-xia-in-the-analects", [
  `rel="canonical" href="${siteUrl}/en/blogs/zi-xia-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-24"',
  '"dateModified":"2026-09-24"',
  "Who Was Zi Xia in the Analects?",
  "Zi Xia in the Analects: the disciple listed under literary study, who defines learning by conduct toward the worthy, parents, prince, and friends.",
  "you usually want one disciple placed among many names",
  "Place him by the passages, not by a résumé",
  "Learning measured by how you treat people",
  "Listed under literary study—and opening the Odes",
  "Be a junzi scholar, not a petty one",
  "Not a learning-method rewrite—and not Zengzi’s door",
  "How you should cite him",
  "Read Hsio R. 1.7 next",
  "Who was Zi Xia in the Analects?",
  ">Zi Xia</a>",
  ">The Analects · Yung Yey 6.11</a>",
  ">The Analects · Hsio R. 1.7</a>",
  'href="/en/index/zi-xia"',
  'href="/en/analects/yong-ye/yong-ye-011"',
  'href="/en/analects/xue-er/xue-er-007"',
  ziXiaCover,
  ziXiaInline1,
  ziXiaInline2,
  ziXiaCoverEn,
  ziXiaInline1En,
  ziXiaInline2En,
  `property="og:image" content="${siteUrl}${ziXiaCover}"`,
  `property="og:image:alt" content="${ziXiaCoverEn}"`,
  `name="twitter:image" content="${siteUrl}${ziXiaCover}"`,
  `name="twitter:image:alt" content="${ziXiaCoverEn}"`,
]);
checkHtml("/zh-Hans/blogs/zi-xia-in-the-analects", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/zi-xia-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-24"',
  '"dateModified":"2026-09-24"',
  "《论语》里的子夏是谁？",
  "《论语》里的子夏：先进篇列在文学一科的弟子，又以事贤、事亲、事君与交友界定何谓学。链回可核对的原文。",
  "你搜「子夏」或 zi xia 时，多半是想在一串弟子名里把他安顿下来",
  "先按篇章认人，不靠履历表",
  "用怎样待人，来衡量你是否已学",
  "列在文学一科——也轻提绘事后素",
  "女为君子儒，无为小人儒",
  "不是学而时习重写——也不是曾子那扇门",
  "你该怎样引用他",
  "接下来读学而 1.7",
  ">子夏</a>",
  ">论语 · 雍也 6.11</a>",
  ">论语 · 学而 1.7</a>",
  'href="/zh-Hans/index/zi-xia"',
  'href="/zh-Hans/analects/yong-ye/yong-ye-011"',
  'href="/zh-Hans/analects/xue-er/xue-er-007"',
  ziXiaCover,
  ziXiaInline1,
  ziXiaInline2,
  ziXiaCoverZh,
  ziXiaInline1Zh,
  ziXiaInline2Zh,
  `property="og:image" content="${siteUrl}${ziXiaCover}"`,
  `property="og:image:alt" content="${ziXiaCoverZh}"`,
  `name="twitter:image" content="${siteUrl}${ziXiaCover}"`,
  `name="twitter:image:alt" content="${ziXiaCoverZh}"`,
]);
{
  const zhZiXiaFile = htmlPath("/zh-Hans/blogs/zi-xia-in-the-analects");
  if (exists(zhZiXiaFile)) {
    const zhZiXiaHtml = read(zhZiXiaFile);
    for (const stub of ["中文全文将于稍后发布", "中文解答将随全文于稍后发布"]) {
      if (zhZiXiaHtml.includes(stub)) {
        fail(`/zh-Hans/blogs/zi-xia-in-the-analects: leftover stub ${stub}`);
      }
    }
    if (!/<h1\b[^>]*>《论语》里的子夏是谁？<\/h1>/.test(zhZiXiaHtml)) {
      fail("/zh-Hans/blogs/zi-xia-in-the-analects: H1 missing");
    }
    if (zhZiXiaHtml.includes(ziXiaCoverEn)) {
      fail("/zh-Hans/blogs/zi-xia-in-the-analects: English cover alt leaked onto zh-Hans");
    }
    if (countRegex(zhZiXiaHtml, />Zi Xia<\/a>/g) !== 0) {
      fail("/zh-Hans/blogs/zi-xia-in-the-analects: English Zi Xia body link should not appear on zh-Hans");
    }
    if (countRegex(zhZiXiaHtml, />子夏<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zi-xia-in-the-analects: 子夏 body link should appear once");
    }
    if (countRegex(zhZiXiaHtml, />论语 · 雍也 6\.11<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zi-xia-in-the-analects: 雍也 6.11 body link should appear once");
    }
    if (countRegex(zhZiXiaHtml, />论语 · 学而 1\.7<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zi-xia-in-the-analects: 学而 1.7 body link should appear once");
    }
  }
  const enZiXiaFile = htmlPath("/en/blogs/zi-xia-in-the-analects");
  if (exists(enZiXiaFile)) {
    const enZiXiaHtml = read(enZiXiaFile);
    if (!/<h1\b[^>]*>Who Was Zi Xia in the Analects\?<\/h1>/.test(enZiXiaHtml)) {
      fail("/en/blogs/zi-xia-in-the-analects: H1 missing");
    }
    if (enZiXiaHtml.includes(ziXiaCoverZh)) {
      fail("/en/blogs/zi-xia-in-the-analects: Chinese cover alt leaked onto en");
    }
    if (countRegex(enZiXiaHtml, />Zi Xia<\/a>/g) !== 1) {
      fail("/en/blogs/zi-xia-in-the-analects: Zi Xia body link should appear once");
    }
    if (countRegex(enZiXiaHtml, />The Analects · Yung Yey 6\.11<\/a>/g) !== 1) {
      fail("/en/blogs/zi-xia-in-the-analects: Yung Yey 6.11 body link should appear once");
    }
    if (countRegex(enZiXiaHtml, />The Analects · Hsio R\. 1\.7<\/a>/g) !== 1) {
      fail("/en/blogs/zi-xia-in-the-analects: Hsio R. 1.7 body link should appear once");
    }
  }
}

const zengZiCover = "/images/blogs/zeng-zi-in-the-analects/cover.jpg";
const zengZiInline1 = "/images/blogs/zeng-zi-in-the-analects/inline-1.jpg";
const zengZiInline2 = "/images/blogs/zeng-zi-in-the-analects/inline-2.jpg";
const zengZiCoverEn =
  "A quiet study desk by the window with blank paper, brush, and inkstone — Zeng Zi, daily self-examination";
const zengZiCoverZh = "临窗书案、空白纸与笔砚——曾子，日三省吾身";
const zengZiInline1En =
  "Spare offering table and distant memorial tablets in soft incense mist — careful endings, lasting remembrance";
const zengZiInline1Zh = "素案、远方牌位与轻烟——慎终追远（庄重克制，非丧葬写实）";
const zengZiInline2En =
  "A scholar on a long misted mountain path with a modest scroll bundle — heavy burden and long road";
const zengZiInline2Zh = "学者负卷行于雾中山径——士不可以不弘毅，任重而道远";
const zengZiAnchors = [
  ["曾子", "https://www.lunyu.ai/zh-Hans/index/zeng-zi"],
  ["Zeng Zi", "https://www.lunyu.ai/en/index/zeng-zi"],
  ["论语 · 泰伯 8.7", "https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-007"],
  ["The Analects · T'ai-po 8.7", "https://www.lunyu.ai/en/analects/tai-bo/tai-bo-007"],
  ["论语 · 学而 1.4", "https://www.lunyu.ai/zh-Hans/analects/xue-er/xue-er-004"],
  ["The Analects · Hsio R. 1.4", "https://www.lunyu.ai/en/analects/xue-er/xue-er-004"],
];
{
  const start = postSource.indexOf('slug: "zeng-zi-in-the-analects"');
  if (start === -1) {
    fail("editorial-posts: missing zeng-zi-in-the-analects");
  } else {
    const next = postSource.indexOf('slug: "', start + 1);
    const block = postSource.slice(start, next === -1 ? undefined : next);
    const markdownHrefs = [...block.matchAll(/\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g)].map(
      (match) => match[1]
    );
    const expectedHrefs = zengZiAnchors.map(([, href]) => href);
    if (markdownHrefs.length !== expectedHrefs.length) {
      fail(
        `zeng-zi-in-the-analects: expected ${expectedHrefs.length} markdown hrefs, got ${markdownHrefs.length}`
      );
    }
    zengZiAnchors.forEach(([label, href]) => {
      if (!block.includes(`[${label}](${href})`)) {
        fail(`zeng-zi-in-the-analects: missing [${label}](${href})`);
      }
    });
    markdownHrefs.forEach((href, index) => {
      if (href !== expectedHrefs[index]) {
        fail(`zeng-zi-in-the-analects: markdown href ${index + 1} should be ${expectedHrefs[index]}`);
      }
    });
    for (const alt of [zengZiCoverEn, zengZiCoverZh, zengZiInline1En, zengZiInline1Zh, zengZiInline2En, zengZiInline2Zh]) {
      if (!block.includes(alt)) fail(`zeng-zi-in-the-analects: editorial alt missing ${alt}`);
    }
  }
}
for (const src of [zengZiCover, zengZiInline1, zengZiInline2]) {
  if (!exists(`public${src}`)) fail(`missing Notes image public${src}`);
}
checkHtml("/en/blogs/zeng-zi-in-the-analects", [
  `rel="canonical" href="${siteUrl}/en/blogs/zeng-zi-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-25"',
  '"dateModified":"2026-09-25"',
  "Who Was Zeng Zi in the Analects?",
  "Zeng Zi in the Analects: the disciple known for daily self-examination, careful funerals and distant remembrance, and for transmitting the Master’s one-thread teaching.",
  "you usually want one disciple placed among many names",
  "Place him by the passages, not by a résumé",
  "Daily three examinations—loyalty, sincerity, practice",
  "Careful funerals, distant remembrance—once, lightly",
  "Heavy burden, long road—T&#x27;ai-po 8.7",
  "Not a zhongshu rewrite—and not the filial essay",
  "How you should cite him",
  "Read Hsio R. 1.4 next",
  "Who was Zeng Zi in the Analects?",
  ">Zeng Zi</a>",
  ">The Analects · T&#x27;ai-po 8.7</a>",
  ">The Analects · Hsio R. 1.4</a>",
  'href="/en/index/zeng-zi"',
  'href="/en/analects/tai-bo/tai-bo-007"',
  'href="/en/analects/xue-er/xue-er-004"',
  zengZiCover,
  zengZiInline1,
  zengZiInline2,
  zengZiCoverEn,
  zengZiInline1En,
  zengZiInline2En,
  `property="og:image" content="${siteUrl}${zengZiCover}"`,
  `property="og:image:alt" content="${zengZiCoverEn}"`,
  `name="twitter:image" content="${siteUrl}${zengZiCover}"`,
  `name="twitter:image:alt" content="${zengZiCoverEn}"`,
]);
checkHtml("/zh-Hans/blogs/zeng-zi-in-the-analects", [
  `rel="canonical" href="${siteUrl}/zh-Hans/blogs/zeng-zi-in-the-analects"`,
  '"@type":"Article"',
  '"@type":"FAQPage"',
  '"datePublished":"2026-09-25"',
  '"dateModified":"2026-09-25"',
  "《论语》里的曾子是谁？",
  "《论语》里的曾子：以每日三省、慎终追远与传述夫子一贯之道见称的弟子。链回可核对的原文。",
  "你搜「曾子」「曾参」或 zengzi / zeng zi 时，多半是想在一串弟子名里把他安顿下来",
  "先按篇章认人，不靠履历表",
  "每日三省——为人谋忠、交友信、传习",
  "慎终追远——轻提一次",
  "任重道远——泰伯 8.7",
  "不是忠恕重写——也不是孝行通论",
  "你该怎样引用他",
  "接下来读学而 1.4",
  ">曾子</a>",
  ">论语 · 泰伯 8.7</a>",
  ">论语 · 学而 1.4</a>",
  'href="/zh-Hans/index/zeng-zi"',
  'href="/zh-Hans/analects/tai-bo/tai-bo-007"',
  'href="/zh-Hans/analects/xue-er/xue-er-004"',
  zengZiCover,
  zengZiInline1,
  zengZiInline2,
  zengZiCoverZh,
  zengZiInline1Zh,
  zengZiInline2Zh,
  `property="og:image" content="${siteUrl}${zengZiCover}"`,
  `property="og:image:alt" content="${zengZiCoverZh}"`,
  `name="twitter:image" content="${siteUrl}${zengZiCover}"`,
  `name="twitter:image:alt" content="${zengZiCoverZh}"`,
]);
{
  const zhZengZiFile = htmlPath("/zh-Hans/blogs/zeng-zi-in-the-analects");
  if (exists(zhZengZiFile)) {
    const zhZengZiHtml = read(zhZengZiFile);
    for (const stub of ["中文全文将于稍后发布", "中文解答将随全文于稍后发布"]) {
      if (zhZengZiHtml.includes(stub)) {
        fail(`/zh-Hans/blogs/zeng-zi-in-the-analects: leftover stub ${stub}`);
      }
    }
    if (!/<h1\b[^>]*>《论语》里的曾子是谁？<\/h1>/.test(zhZengZiHtml)) {
      fail("/zh-Hans/blogs/zeng-zi-in-the-analects: H1 missing");
    }
    if (zhZengZiHtml.includes(zengZiCoverEn)) {
      fail("/zh-Hans/blogs/zeng-zi-in-the-analects: English cover alt leaked onto zh-Hans");
    }
    if (zhZengZiHtml.includes(zengZiInline1En) || zhZengZiHtml.includes(zengZiInline2En)) {
      fail("/zh-Hans/blogs/zeng-zi-in-the-analects: English inline alt leaked onto zh-Hans");
    }
    if (countRegex(zhZengZiHtml, />Zeng Zi<\/a>/g) !== 0) {
      fail("/zh-Hans/blogs/zeng-zi-in-the-analects: English Zeng Zi body link should not appear on zh-Hans");
    }
    if (countRegex(zhZengZiHtml, />曾子<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zeng-zi-in-the-analects: 曾子 body link should appear once");
    }
    if (countRegex(zhZengZiHtml, />论语 · 泰伯 8\.7<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zeng-zi-in-the-analects: 泰伯 8.7 body link should appear once");
    }
    if (countRegex(zhZengZiHtml, />论语 · 学而 1\.4<\/a>/g) !== 1) {
      fail("/zh-Hans/blogs/zeng-zi-in-the-analects: 学而 1.4 body link should appear once");
    }
  }
  const enZengZiFile = htmlPath("/en/blogs/zeng-zi-in-the-analects");
  if (exists(enZengZiFile)) {
    const enZengZiHtml = read(enZengZiFile);
    if (!/<h1\b[^>]*>Who Was Zeng Zi in the Analects\?<\/h1>/.test(enZengZiHtml)) {
      fail("/en/blogs/zeng-zi-in-the-analects: H1 missing");
    }
    if (enZengZiHtml.includes(zengZiCoverZh)) {
      fail("/en/blogs/zeng-zi-in-the-analects: Chinese cover alt leaked onto en");
    }
    if (enZengZiHtml.includes(zengZiInline1Zh) || enZengZiHtml.includes(zengZiInline2Zh)) {
      fail("/en/blogs/zeng-zi-in-the-analects: Chinese inline alt leaked onto en");
    }
    if (countRegex(enZengZiHtml, />Zeng Zi<\/a>/g) !== 1) {
      fail("/en/blogs/zeng-zi-in-the-analects: Zeng Zi body link should appear once");
    }
    if (countRegex(enZengZiHtml, />The Analects · T&#x27;ai-po 8\.7<\/a>/g) !== 1) {
      fail("/en/blogs/zeng-zi-in-the-analects: T'ai-po 8.7 body link should appear once");
    }
    if (countRegex(enZengZiHtml, />The Analects · Hsio R\. 1\.4<\/a>/g) !== 1) {
      fail("/en/blogs/zeng-zi-in-the-analects: Hsio R. 1.4 body link should appear once");
    }
  }
}

for (const locale of locales) {
  checkHtml(`/${locale}/index/zai-wo`, [
    "Zaiwo",
    "Tsai Wo",
    `href="/${locale}/blogs/zai-wo-in-the-analects"`,
    `/${locale}/analects/yang-huo/yang-huo-021`,
    `/${locale}/analects/gong-ye-chang/gong-ye-chang-009`,
    `"dateModified":"${entityIndexRefreshLastmod}"`,
  ]);
  checkHtml(`/${locale}/index/duke-ai`, [
    locale === "en" ? "Duke Ai of Lu" : "鲁哀公",
    "Ai Gong",
    `href="/${locale}/blogs/duke-ai-of-lu-in-the-analects"`,
    `/${locale}/analects/wei-zheng/wei-zheng-019`,
    `"dateModified":"${entityIndexRefreshLastmod}"`,
  ]);
  checkHtml(`/${locale}/index/duke-ding`, [
    locale === "en" ? "Duke Ding of Lu" : "鲁定公",
    "Ding Gong",
    `/${locale}/analects/ba-yi/ba-yi-019`,
    `"dateModified":"${entityIndexRefreshLastmod}"`,
  ]);
  checkHtml(`/${locale}/index/yao-shun-yu`, [
    "yao shun yu",
    "yaoshun",
    `href="/${locale}/blogs/yao-shun-yu-in-the-analects"`,
    `/${locale}/analects/yao-yue/yao-yue-001`,
    `"dateModified":"${entityIndexRefreshLastmod}"`,
  ]);
  checkHtml(`/${locale}/index/wei-ling-gong-person`, [
    "Wei Ling Gong",
    "Wei Ling",
    `href="/${locale}/blogs/duke-ling-of-wei-in-the-analects"`,
    `/${locale}/analects/xian-wen/xian-wen-020`,
    `"dateModified":"${entityIndexRefreshLastmod}"`,
  ]);
  checkHtml(`/${locale}/index/zhong-gong`, [
    locale === "en" ? "Zhong Gong" : "仲弓",
    `href="/${locale}/blogs/zhong-gong-in-the-analects"`,
    `/${locale}/analects/yong-ye/yong-ye-001`,
  ]);
  checkHtml(`/${locale}/index/zi-xia`, [
    locale === "en" ? "Zi Xia" : "子夏",
    `href="/${locale}/blogs/zi-xia-in-the-analects"`,
    `/${locale}/analects/xue-er/xue-er-007`,
  ]);
  checkHtml(`/${locale}/index/zeng-zi`, [
    locale === "en" ? "Zeng Zi" : "曾子",
    `href="/${locale}/blogs/zeng-zi-in-the-analects"`,
    `/${locale}/analects/xue-er/xue-er-004`,
  ]);
}

checkHtml("/en/index", [
  "English person and place entries are in the lists below",
  'id="people"',
  'id="places"',
  'href="/zh-Hans/people"',
  'href="/zh-Hans/places"',
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
if (/^Disallow:\s*\/(?:game\/?|zh-Hans\/?|zh-Hans\/game\/?)?\s*$/im.test(robots)) {
  fail("robots: must allow crawling the Chinese game");
}
for (const crawler of aiCrawlers) {
  assertIncludes(robots, `User-Agent: ${crawler}`, "robots");
}

const sitemap = read(".next/server/app/sitemap.xml.body");
const chineseBiographyPageCount = 2 + discipleBiographies.length; // hub + Confucius + disciples
const chineseGamePageCount = 1;
const chineseGeographyPageCount = 1 + geographyPlaces.length;
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
  1 + chineseBiographyPageCount + chineseGamePageCount + chineseGeographyPageCount;
const locs = countRegex(sitemap, /<loc>/g);
if (locs !== expectedLocs) fail(`sitemap: expected ${expectedLocs} <loc>, got ${locs}`);
if (sitemap.split(`<loc>${gameUrl}</loc>`).length - 1 !== chineseGamePageCount) {
  fail("sitemap: must include the Chinese game exactly once");
}
for (const unavailableGameUrl of [`${siteUrl}/en/game`, `${siteUrl}/game`]) {
  if (sitemap.includes(`<loc>${unavailableGameUrl}</loc>`)) fail(`sitemap: must not include ${unavailableGameUrl}`);
}
assertIncludes(sitemap, `${siteUrl}/zh-Hans/index`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/index/confucius`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/how-to-read-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/en/blogs/zai-wo-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/zai-wo-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/en/blogs/what-is-a-junzi`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/what-is-a-junzi`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/en/blogs/zhongshu-reciprocity-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/en/blogs/duke-ai-of-lu-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/duke-ai-of-lu-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/en/blogs/yao-shun-yu-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/yao-shun-yu-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/en/blogs/duke-ling-of-wei-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/duke-ling-of-wei-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/en/blogs/zhong-gong-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/zhong-gong-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/en/blogs/zeng-zi-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/zeng-zi-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/en/blogs/zi-xia-in-the-analects`, "sitemap");
assertIncludes(sitemap, `${siteUrl}/zh-Hans/blogs/zi-xia-in-the-analects`, "sitemap");
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
function sitemapLastmodFor(loc) {
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = sitemap.match(new RegExp(`<loc>${escaped}</loc>\\s*<lastmod>([^<]+)</lastmod>`));
  return match?.[1] ?? "";
}
for (const locale of locales) {
  const lastmod = sitemapLastmodFor(`${siteUrl}/${locale}/blogs`);
    if (!lastmod.includes("2026-09-25")) {
      fail(`sitemap: /${locale}/blogs lastmod should follow newest editorial post, got ${lastmod || "missing"}`);
    }
    const zengZiLastmod = sitemapLastmodFor(`${siteUrl}/${locale}/blogs/zeng-zi-in-the-analects`);
    if (!zengZiLastmod.includes("2026-09-25")) {
      fail(
        `sitemap: /${locale}/blogs/zeng-zi-in-the-analects lastmod should be 2026-09-25, got ${zengZiLastmod || "missing"}`
      );
    }
    const zhongGongLastmod = sitemapLastmodFor(`${siteUrl}/${locale}/blogs/zhong-gong-in-the-analects`);
    if (!zhongGongLastmod.includes("2026-09-23")) {
      fail(
        `sitemap: /${locale}/blogs/zhong-gong-in-the-analects lastmod should be 2026-09-23, got ${zhongGongLastmod || "missing"}`
      );
    }
    const ziXiaLastmod = sitemapLastmodFor(`${siteUrl}/${locale}/blogs/zi-xia-in-the-analects`);
    if (!ziXiaLastmod.includes("2026-09-24")) {
      fail(
        `sitemap: /${locale}/blogs/zi-xia-in-the-analects lastmod should be 2026-09-24, got ${ziXiaLastmod || "missing"}`
      );
    }
  for (const slug of ["zai-wo", "duke-ai", "duke-ding", "yao-shun-yu", "wei-ling-gong-person"]) {
    const entityLastmod = sitemapLastmodFor(`${siteUrl}/${locale}/index/${slug}`);
    if (!entityLastmod.includes(entityIndexRefreshLastmod)) {
      fail(`sitemap: /${locale}/index/${slug} lastmod should be ${entityIndexRefreshLastmod}, got ${entityLastmod || "missing"}`);
    }
  }
}
const rssBodyFile = exists(".next/server/app/rss.xml.body")
  ? ".next/server/app/rss.xml.body"
  : exists(".next/server/app/rss.xml/route.body")
    ? ".next/server/app/rss.xml/route.body"
    : "";
if (!rssBodyFile) {
  fail("rss.xml: static build body missing");
} else {
  assertIncludes(read(rssBodyFile), "25 Sep 2026", "rss lastBuildDate");
}
const featuredSitemapDate = `${featuredIndexLastmod}T00:00:00.000Z`;
const unfeaturedSitemapDate = `${stableLastmod}T00:00:00.000Z`;
for (const slug of ["ren", "li", "zhongshu", "junzi", "xue", "confucius", "yan-yuan", "zi-gong"]) {
  for (const locale of locales) {
    const loc = `${siteUrl}/${locale}/index/${slug}`;
    const lastmod = sitemapLastmodFor(loc);
    if (lastmod !== featuredSitemapDate && lastmod !== featuredIndexLastmod) {
      fail(`sitemap: ${loc} should lastmod ${featuredIndexLastmod}, got ${lastmod || "missing"}`);
    }
  }
}
for (const locale of locales) {
  const loc = `${siteUrl}/${locale}/index/yi`;
  const lastmod = sitemapLastmodFor(loc);
  if (lastmod !== unfeaturedSitemapDate && lastmod !== stableLastmod) {
    fail(`sitemap: ${loc} should lastmod ${stableLastmod}, got ${lastmod || "missing"}`);
  }
}
const newestEditorialLastmod = "2026-09-25";
const ziXiaEditorialLastmod = "2026-09-24";
const previousEditorialLastmod = "2026-09-23";
const dukeLingEditorialLastmod = "2026-09-22";
const priorEditorialLastmod = "2026-09-21";
const olderEditorialLastmod = "2026-09-20";
const earliestEditorialLastmod = "2026-09-16";
const sitemapWithoutStableDates = sitemap
  .replaceAll(`${stableLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${intentHubLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${featuredIndexLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${entityIndexRefreshLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${newestEditorialLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${ziXiaEditorialLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${previousEditorialLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${dukeLingEditorialLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${priorEditorialLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${olderEditorialLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${earliestEditorialLastmod}T00:00:00.000Z`, "");
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
const gameRedirects = (routesManifest.redirects || []).filter((redirect) => redirect.source === "/game");
if (gameRedirects.length !== 1 || gameRedirects[0].destination !== gameRoute || gameRedirects[0].statusCode !== 307) {
  fail("routes-manifest: /game must redirect temporarily to the Chinese demo");
}
function assertPermanentIndexRedirect(source, hash) {
  const match = (routesManifest.redirects || []).find((redirect) => redirect.source === source);
  if (!match || match.statusCode !== 308 || !String(match.destination).startsWith("/en/index")) {
    fail(`routes-manifest: ${source} must 308 to /en/index`);
  } else if (hash && !String(match.destination).includes(hash)) {
    fail(`routes-manifest: ${source} should target ${hash}`);
  }
}
assertPermanentIndexRedirect("/en/people", "#people");
assertPermanentIndexRedirect("/en/people/:path*", "#people");
assertPermanentIndexRedirect("/en/places", "#places");
assertPermanentIndexRedirect("/en/places/:path*", "#places");

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
