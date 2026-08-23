#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://www.lunyu.ai";
const locales = ["zh-Hans", "en"];
const voiceSlug = "ruby-female";
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

function metric(available, total) {
  return {
    available,
    total,
    ratio: `${available}/${total}`,
    state: available === 0 ? "unavailable" : available === total ? "complete" : "partial",
  };
}

function audioRelativePath(sentence) {
  return `${sentence.bookSlug}/${voiceSlug}/${sentence.bookSlug}-${String(sentence.sentenceNumber).padStart(3, "0")}-${voiceSlug}.mp3`;
}

function collectFiles(dir, predicate, base = dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.isFile() && predicate(fullPath)) {
        files.push(path.relative(base, fullPath).replaceAll(path.sep, "/"));
      }
    }
  }
  return files;
}

function buildBody(route) {
  const candidates = [
    `.next/server/app/${route}.body`,
    `.next/server/app/${route}/route.body`,
  ];
  const file = candidates.find(exists);
  if (!file) {
    fail(`${route}: static build body missing (${candidates.join(" or ")})`);
    return "";
  }
  return read(file);
}

function buildHtml(route) {
  const file = `.next/server/app/${route.replace(/^\//, "")}.html`;
  if (!exists(file)) {
    fail(`${route}: build HTML missing at ${file}`);
    return "";
  }
  return read(file);
}

function assertIncludes(text, expected, label) {
  if (!text.includes(expected)) fail(`${label}: missing ${expected}`);
}

function extractJsonLd(html, label) {
  const documents = [];
  for (const match of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  )) {
    try {
      documents.push(JSON.parse(match[1]));
    } catch (error) {
      fail(`${label}: invalid JSON-LD (${error instanceof Error ? error.message : String(error)})`);
    }
  }
  if (documents.length === 0) fail(`${label}: JSON-LD missing`);
  return JSON.stringify(documents);
}

const generated = JSON.parse(read("src/data/analects.generated.json"));
const reviewed = JSON.parse(read("src/data/modern-chinese.reviewed.json"));
const sentences = generated.books.flatMap((book) => book.sentences);
const sentenceIds = new Set(sentences.map((sentence) => sentence.id));
const reviewedEntries = Object.entries(reviewed.translations ?? {}).filter(
  ([, value]) => typeof value === "string" && value.trim().length > 0
);
const reviewedIds = new Set(reviewedEntries.map(([id]) => id));
const audioRoot = path.join(root, "public", "audio", "analects");
const currentVoiceAudioFiles = collectFiles(
  audioRoot,
  (file) => file.endsWith(".mp3") && file.includes(`${path.sep}${voiceSlug}${path.sep}`)
);
const audioFiles = new Set(currentVoiceAudioFiles);
const expectedAudioFiles = new Set(sentences.map(audioRelativePath));

const passageFacts = sentences.map((sentence) => ({
  id: sentence.id,
  bookSlug: sentence.bookSlug,
  sentenceNumber: sentence.sentenceNumber,
  reviewedGuide: reviewedIds.has(sentence.id),
  englishTranslation: Boolean(sentence.english?.trim()),
  pinyin: Boolean(sentence.pinyin?.trim()),
  audio: audioFiles.has(audioRelativePath(sentence)),
}));

const coverage = {
  reviewedGuide: metric(passageFacts.filter((item) => item.reviewedGuide).length, passageFacts.length),
  englishTranslation: metric(
    passageFacts.filter((item) => item.englishTranslation).length,
    passageFacts.length
  ),
  pinyin: metric(passageFacts.filter((item) => item.pinyin).length, passageFacts.length),
  audio: metric(passageFacts.filter((item) => item.audio).length, passageFacts.length),
};

const bookCoverage = generated.books.map((book) => {
  const passages = passageFacts.filter((item) => item.bookSlug === book.slug);
  return {
    slug: book.slug,
    number: book.number,
    reviewedGuide: metric(passages.filter((item) => item.reviewedGuide).length, passages.length),
    pinyin: metric(passages.filter((item) => item.pinyin).length, passages.length),
    audio: metric(passages.filter((item) => item.audio).length, passages.length),
  };
});

const orphanReviewedIds = [...reviewedIds].filter((id) => !sentenceIds.has(id));
const orphanAudioFiles = currentVoiceAudioFiles.filter((file) => !expectedAudioFiles.has(file));
if (orphanReviewedIds.length > 0) {
  fail(`source: ${orphanReviewedIds.length} reviewed IDs do not map to passages`);
}
if (orphanAudioFiles.length > 0) {
  fail(`source: ${orphanAudioFiles.length} ${voiceSlug} audio files do not map to passages`);
}
if (new Set(sentences.map((sentence) => sentence.id)).size !== sentences.length) {
  fail("source: duplicate passage IDs");
}
for (const book of generated.books) {
  if (book.chapterCount !== book.sentences.length) {
    fail(`source: ${book.slug} chapterCount ${book.chapterCount} != ${book.sentences.length}`);
  }
}

const requiredModelConsumers = [
  "src/app/[locale]/page.tsx",
  "src/lib/trust-pages.ts",
  "src/app/[locale]/listen/BookListenPage.tsx",
  "src/lib/listen.ts",
  "src/app/llms.txt/route.ts",
  "src/app/rss.xml/route.ts",
  "src/app/sitemap.ts",
];
for (const file of requiredModelConsumers) {
  assertIncludes(read(file), "@/lib/content-coverage", `${file} authoritative model import`);
}

const sourceFiles = collectFiles(
  path.join(root, "src"),
  (file) => file.endsWith(".ts") || file.endsWith(".tsx"),
  root
);
for (const file of sourceFiles) {
  const source = read(file);
  if (source.includes("getListenCoverage")) fail(`${file}: legacy getListenCoverage is forbidden`);
  if (file !== "src/lib/content-coverage.ts" && /export const contentCoverage\b/.test(source)) {
    fail(`${file}: duplicate contentCoverage authority is forbidden`);
  }
  const hardCodedRatios = source.match(/\b\d{1,3}\/499\b/g) ?? [];
  if (hardCodedRatios.length > 0) {
    fail(`${file}: hard-coded coverage ratio ${[...new Set(hardCodedRatios)].join(", ")}`);
  }
}

const globalRatios = [
  coverage.reviewedGuide.ratio,
  coverage.pinyin.ratio,
  coverage.audio.ratio,
];
const allowedGlobalRatios = new Set([
  ...globalRatios,
  coverage.englishTranslation.ratio,
  `${sentences.length}/${sentences.length}`,
]);

function checkSurface(text, label, expectedRatios = globalRatios) {
  for (const ratio of expectedRatios) assertIncludes(text, ratio, label);
  for (const match of text.matchAll(new RegExp(`\\b\\d+\/${sentences.length}\\b`, "g"))) {
    if (!allowedGlobalRatios.has(match[0])) fail(`${label}: contradictory ratio ${match[0]}`);
  }
  if (coverage.audio.state !== "complete") {
    for (const forbidden of ["真人女声音频已全部上线", "all recorded audio is live"]) {
      if (text.toLowerCase().includes(forbidden.toLowerCase())) {
        fail(`${label}: partial audio described as complete`);
      }
    }
  }
}

for (const locale of locales) {
  const homeRoute = `/${locale}`;
  const home = buildHtml(homeRoute);
  checkSurface(home, homeRoute);
  checkSurface(extractJsonLd(home, `${homeRoute} JSON-LD`), `${homeRoute} JSON-LD`);

  const faqRoute = `/${locale}/faq`;
  const faq = buildHtml(faqRoute);
  checkSurface(faq, faqRoute);
  checkSurface(extractJsonLd(faq, `${faqRoute} JSON-LD`), `${faqRoute} JSON-LD`);

  for (const book of bookCoverage) {
    const pathSuffix = book.number === 1 ? "/listen" : `/listen/${book.slug}`;
    const route = `/${locale}${pathSuffix}`;
    const html = buildHtml(route);
    const expected = [book.reviewedGuide.ratio, book.pinyin.ratio, book.audio.ratio];
    checkSurface(html, route, expected);
    checkSurface(extractJsonLd(html, `${route} JSON-LD`), `${route} JSON-LD`, expected);
  }
}

const llms = buildBody("llms.txt");
checkSurface(llms, "llms.txt");
const rss = buildBody("rss.xml");
checkSurface(rss, "rss.xml");

const sitemap = read(".next/server/app/sitemap.xml.body");
function sitemapBlock(url) {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return sitemap.match(new RegExp(`<url>[\\s\\S]*?<loc>${escapedUrl}<\\/loc>[\\s\\S]*?<\\/url>`))?.[0] ?? "";
}

const listenFrequency = coverage.audio.state === "complete" ? "monthly" : "weekly";
for (const locale of locales) {
  const listenHome = `${siteUrl}/${locale}/listen`;
  if (coverage.audio.available > 0) {
    const block = sitemapBlock(listenHome);
    if (!block) fail(`sitemap: missing ${listenHome}`);
    else assertIncludes(block, `<changefreq>${listenFrequency}</changefreq>`, `sitemap ${listenHome}`);
  }

  for (const book of bookCoverage.filter((item) => item.number !== 1)) {
    const url = `${siteUrl}/${locale}/listen/${book.slug}`;
    const present = sitemap.includes(`<loc>${url}</loc>`);
    if (present !== (book.audio.available > 0)) {
      fail(`sitemap: ${url} presence contradicts audio coverage ${book.audio.ratio}`);
    }
  }

  for (const passage of passageFacts) {
    const url = `${siteUrl}/${locale}/analects/${passage.bookSlug}/${passage.id}`;
    const block = sitemapBlock(url);
    if (!block) {
      fail(`sitemap: missing ${url}`);
      continue;
    }
    const frequency = passage.reviewedGuide && passage.pinyin ? "monthly" : "weekly";
    assertIncludes(block, `<changefreq>${frequency}</changefreq>`, `sitemap ${url}`);
  }
}

if (failures.length > 0) {
  console.error(`Content coverage QA failed (${failures.length})`);
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log(
  `Content coverage QA passed: review ${coverage.reviewedGuide.ratio}, pinyin ${coverage.pinyin.ratio}, audio ${coverage.audio.ratio}; all required surfaces agree.`
);
