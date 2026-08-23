import { type Book, getSentences, sentenceUrl, type Locale, t } from "@/lib/analects";
import { listenAudioFormat, listenAudioLanguage } from "@/lib/audio-inventory";
import { getPassageContentCoverage } from "@/lib/content-coverage";

export type ListenChapter = {
  id: string;
  sentenceNumber: number;
  title: string;
  bookTitle: string;
  classical: string;
  pinyin: string;
  modern: string;
  href: string;
  audioSrc: string;
  audioAvailable: boolean;
  audioLanguage: typeof listenAudioLanguage;
  audioFormat: typeof listenAudioFormat;
  durationSeconds?: number;
};

export function buildListenChapters(locale: Locale, book: Book): ListenChapter[] {
  const bookTitle = t(locale, book.zhTitle, book.enTitle);
  return getSentences(book.slug).map((sentence) => {
    const coverage = getPassageContentCoverage(sentence.id);
    return {
      id: sentence.id,
      sentenceNumber: sentence.sentenceNumber,
      title: `${bookTitle} · ${String(sentence.sentenceNumber).padStart(2, "0")}`,
      bookTitle,
      classical: sentence.classicalChinese,
      pinyin: sentence.pinyin,
      modern: locale === "zh-Hans" ? sentence.modernChinese : sentence.english,
      href: sentenceUrl(locale, sentence),
      audioSrc: coverage?.audioSrc ?? "",
      audioAvailable: coverage?.audio ?? false,
      audioLanguage: listenAudioLanguage,
      audioFormat: listenAudioFormat,
      durationSeconds: coverage?.audio ? coverage.audioDurationSeconds : undefined,
    };
  });
}
