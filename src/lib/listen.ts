import fs from "node:fs";
import path from "node:path";
import { type Book, books, getSentences, sentenceUrl, type Locale, t } from "@/lib/analects";

export const listenVoiceSlug = "ruby-female";

const audioRoot = path.join(process.cwd(), "public", "audio", "analects");

function audioRelativePath(bookSlug: string, sentenceNumber: number, voiceSlug = listenVoiceSlug) {
  return `${bookSlug}/${voiceSlug}/${bookSlug}-${String(sentenceNumber).padStart(3, "0")}-${voiceSlug}.mp3`;
}

function collectAudioFiles() {
  const files = new Set<string>();
  if (!fs.existsSync(audioRoot)) return files;

  const stack = [audioRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".mp3")) {
        files.add(path.relative(audioRoot, fullPath).replaceAll(path.sep, "/"));
      }
    }
  }
  return files;
}

const audioFiles = collectAudioFiles();

export function listenAudioSrc(
  bookSlug: string,
  sentenceNumber: number,
  voiceSlug = listenVoiceSlug
) {
  return `/audio/analects/${audioRelativePath(bookSlug, sentenceNumber, voiceSlug)}`;
}

export function hasListenAudio(
  bookSlug: string,
  sentenceNumber: number,
  voiceSlug = listenVoiceSlug
) {
  return audioFiles.has(audioRelativePath(bookSlug, sentenceNumber, voiceSlug));
}

export type ListenChapter = {
  id: string;
  sentenceNumber: number;
  bookTitle: string;
  classical: string;
  pinyin: string;
  modern: string;
  href: string;
  audioSrc: string;
  audioAvailable: boolean;
};

export function buildListenChapters(locale: Locale, book: Book): ListenChapter[] {
  return getSentences(book.slug).map((sentence) => ({
    id: sentence.id,
    sentenceNumber: sentence.sentenceNumber,
    bookTitle: t(locale, book.zhTitle, book.enTitle),
    classical: sentence.classicalChinese,
    pinyin: sentence.pinyin,
    modern: locale === "zh-Hans" ? sentence.modernChinese : sentence.english,
    href: sentenceUrl(locale, sentence),
    audioSrc: listenAudioSrc(book.slug, sentence.sentenceNumber),
    audioAvailable: hasListenAudio(book.slug, sentence.sentenceNumber),
  }));
}

export function getListenCoverage(bookSlug?: string) {
  const targetBooks = bookSlug ? books.filter((book) => book.slug === bookSlug) : books;
  const bookCoverage = targetBooks.map((book) => {
    const availableChapters = getSentences(book.slug).filter((sentence) =>
      hasListenAudio(book.slug, sentence.sentenceNumber)
    ).length;
    return {
      slug: book.slug,
      availableChapters,
      totalChapters: book.chapterCount,
    };
  });

  const totalChapters = bookCoverage.reduce((sum, item) => sum + item.totalChapters, 0);
  const availableChapters = bookCoverage.reduce((sum, item) => sum + item.availableChapters, 0);
  const availableBooks = bookCoverage.filter((item) => item.availableChapters > 0).length;

  return {
    bookCoverage,
    totalBooks: bookCoverage.length,
    availableBooks,
    totalChapters,
    availableChapters,
  };
}
