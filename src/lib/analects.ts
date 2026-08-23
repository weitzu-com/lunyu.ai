import generatedData from "@/data/analects.generated.json";
import reviewedData from "@/data/modern-chinese.reviewed.json";

export type Locale = "zh-Hans" | "en";

export const locales = {
  "zh-Hans": {
    label: "简体中文",
    htmlLang: "zh-Hans",
  },
  en: {
    label: "English",
    htmlLang: "en",
  },
} as const satisfies Record<Locale, { label: string; htmlLang: string }>;

export function t(locale: Locale, zh: string, en: string) {
  return locale === "zh-Hans" ? zh : en;
}

type RawSentence = {
  id: string;
  bookSlug: string;
  bookNumber: number;
  sentenceNumber: number;
  classicalChinese: string;
  pinyin: string;
  modernChinese: string;
  english: string;
  themes: string[];
  notes: string[];
};

type RawBook = {
  slug: string;
  number: number;
  zhTitle: string;
  enTitle: string;
  chapterCount: number;
  sentences: RawSentence[];
};

type RawGeneratedData = {
  source: string;
  sourceNote: string;
  books: RawBook[];
};

type ReviewedTranslations = {
  translations: Record<string, string>;
};

export type Sentence = RawSentence & {
  modernChinese: string;
};

export type Book = RawBook & {
  pinyin: string;
  summaryZh: string;
  summaryEn: string;
  sentences: Sentence[];
};

const generated = generatedData as RawGeneratedData;
const reviewed = reviewedData as ReviewedTranslations;

function titleCaseSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function summarizeBook(book: RawBook, pinyin: string) {
  return {
    summaryZh: `《${book.zhTitle}》共 ${book.chapterCount} 章，围绕学习、德性与现实处境展开。`,
    summaryEn: `${pinyin} contains ${book.chapterCount} passages on learning, virtue, and practical conduct.`,
  };
}

function buildSentence(sentence: RawSentence): Sentence {
  return {
    ...sentence,
    modernChinese: reviewed.translations[sentence.id] ?? sentence.modernChinese,
  };
}

function buildBook(book: RawBook): Book {
  const pinyin = titleCaseSlug(book.slug);
  const sentences = book.sentences.map(buildSentence);
  const summary = summarizeBook(book, pinyin);
  return {
    ...book,
    pinyin,
    summaryZh: summary.summaryZh,
    summaryEn: summary.summaryEn,
    sentences,
  };
}

export const books: Book[] = generated.books.map(buildBook);
export const allSentences: Sentence[] = books.flatMap((book) => book.sentences);

const bookBySlug = new Map(books.map((book) => [book.slug, book] as const));
const sentenceById = new Map(allSentences.map((sentence) => [sentence.id, sentence] as const));

export function getAllSentences() {
  return allSentences;
}

export function getSentences(bookSlug?: string) {
  if (!bookSlug) return allSentences;
  return allSentences.filter((sentence) => sentence.bookSlug === bookSlug);
}

export function getBook(slug: string) {
  return bookBySlug.get(slug);
}

export function getSentence(id: string) {
  return sentenceById.get(id);
}

export function getNeighbourSentences(id: string) {
  const index = allSentences.findIndex((sentence) => sentence.id === id);
  if (index < 0) {
    return { prev: undefined, next: undefined };
  }
  return {
    prev: index > 0 ? allSentences[index - 1] : undefined,
    next: index < allSentences.length - 1 ? allSentences[index + 1] : undefined,
  };
}

export function sentenceUrl(locale: Locale, sentence: Sentence) {
  return `/${locale}/analects/${sentence.bookSlug}/${sentence.id}`;
}

export function bookUrl(locale: Locale, bookSlug: string) {
  return `/${locale}/analects/${bookSlug}`;
}
