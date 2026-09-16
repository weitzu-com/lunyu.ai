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
    `/${locale}/analects/yao-yue/yao-yue-001`,
    `"dateModified":"${entityIndexRefreshLastmod}"`,
  ]);
  checkHtml(`/${locale}/index/wei-ling-gong-person`, [
    "Wei Ling Gong",
    "Wei Ling",
    `/${locale}/analects/xian-wen/xian-wen-020`,
    `"dateModified":"${entityIndexRefreshLastmod}"`,
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
  if (!lastmod.includes("2026-09-16")) {
    fail(`sitemap: /${locale}/blogs lastmod should follow newest editorial post, got ${lastmod || "missing"}`);
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
  assertIncludes(read(rssBodyFile), "15 Sep 2026", "rss lastBuildDate");
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
const newestEditorialLastmod = "2026-09-16";
const sitemapWithoutStableDates = sitemap
  .replaceAll(`${stableLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${intentHubLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${featuredIndexLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${entityIndexRefreshLastmod}T00:00:00.000Z`, "")
  .replaceAll(`${newestEditorialLastmod}T00:00:00.000Z`, "");
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
