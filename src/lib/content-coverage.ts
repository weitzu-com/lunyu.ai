import reviewedData from "@/data/modern-chinese.reviewed.json";
import { allSentences, books, type Locale, t } from "@/lib/analects";
import {
  getListenAudioMetadata,
  listCurrentVoiceAudioFiles,
  listenAudioRelativePath,
  listenAudioSrc,
  listenVoiceSlug,
} from "@/lib/audio-inventory";

export type CoverageState = "complete" | "partial" | "unavailable";

export type CoverageMetric = {
  available: number;
  total: number;
  ratio: string;
  state: CoverageState;
  complete: boolean;
};

export type PassageContentCoverage = {
  id: string;
  bookSlug: string;
  sentenceNumber: number;
  reviewedGuide: boolean;
  englishTranslation: boolean;
  pinyin: boolean;
  audio: boolean;
  audioSrc: string;
  audioDurationSeconds?: number;
};

export type BookContentCoverage = {
  slug: string;
  number: number;
  reviewedGuide: CoverageMetric;
  englishTranslation: CoverageMetric;
  pinyin: CoverageMetric;
  audio: CoverageMetric;
};

type CoverageSnapshot = Pick<
  BookContentCoverage,
  "reviewedGuide" | "englishTranslation" | "pinyin" | "audio"
>;

type ReviewedTranslations = {
  translations?: Record<string, string>;
};

const reviewedTranslations = (reviewedData as ReviewedTranslations).translations ?? {};

function coverageMetric(available: number, total: number): CoverageMetric {
  const state: CoverageState =
    available === 0 ? "unavailable" : available === total ? "complete" : "partial";
  return {
    available,
    total,
    ratio: `${available}/${total}`,
    state,
    complete: state === "complete",
  };
}

const passageCoverage: PassageContentCoverage[] = allSentences.map((sentence) => {
  const audioMetadata = getListenAudioMetadata(sentence.bookSlug, sentence.sentenceNumber);
  return {
    id: sentence.id,
    bookSlug: sentence.bookSlug,
    sentenceNumber: sentence.sentenceNumber,
    reviewedGuide: Boolean(reviewedTranslations[sentence.id]?.trim()),
    englishTranslation: Boolean(sentence.english.trim()),
    pinyin: Boolean(sentence.pinyin.trim()),
    audio: Boolean(audioMetadata),
    audioSrc: listenAudioSrc(sentence.bookSlug, sentence.sentenceNumber),
    audioDurationSeconds: audioMetadata?.durationSeconds,
  };
});

const passageCoverageById = new Map(passageCoverage.map((item) => [item.id, item] as const));

function aggregatePassages(items: PassageContentCoverage[]): CoverageSnapshot {
  return {
    reviewedGuide: coverageMetric(
      items.filter((item) => item.reviewedGuide).length,
      items.length
    ),
    englishTranslation: coverageMetric(
      items.filter((item) => item.englishTranslation).length,
      items.length
    ),
    pinyin: coverageMetric(
      items.filter((item) => item.pinyin).length,
      items.length
    ),
    audio: coverageMetric(
      items.filter((item) => item.audio).length,
      items.length
    ),
  };
}

const bookCoverage: BookContentCoverage[] = books.map((book) => ({
  slug: book.slug,
  number: book.number,
  ...aggregatePassages(passageCoverage.filter((item) => item.bookSlug === book.slug)),
}));

const bookCoverageBySlug = new Map(bookCoverage.map((item) => [item.slug, item] as const));
const aggregateCoverage = aggregatePassages(passageCoverage);
const expectedPassageIds = new Set(passageCoverage.map((item) => item.id));
const expectedAudioFiles = new Set(
  passageCoverage.map((item) => listenAudioRelativePath(item.bookSlug, item.sentenceNumber))
);
const currentVoiceAudioFiles = listCurrentVoiceAudioFiles();

export const contentCoverage = {
  totalBooks: books.length,
  totalPassages: passageCoverage.length,
  reviewedGuide: aggregateCoverage.reviewedGuide,
  englishTranslation: aggregateCoverage.englishTranslation,
  pinyin: aggregateCoverage.pinyin,
  audio: {
    ...aggregateCoverage.audio,
    books: coverageMetric(
      bookCoverage.filter((book) => book.audio.available > 0).length,
      bookCoverage.length
    ),
    voiceSlug: listenVoiceSlug,
    discoveredFiles: currentVoiceAudioFiles.length,
    orphanFiles: currentVoiceAudioFiles.filter((file) => !expectedAudioFiles.has(file)),
  },
  passages: passageCoverage,
  books: bookCoverage,
  orphanReviewedPassageIds: Object.keys(reviewedTranslations).filter(
    (id) => !expectedPassageIds.has(id)
  ),
} as const;

export function getPassageContentCoverage(id: string) {
  return passageCoverageById.get(id);
}

export function getBookContentCoverage(slug: string) {
  return bookCoverageBySlug.get(slug);
}

export function contentCoverageSummary(
  locale: Locale,
  coverage: CoverageSnapshot = contentCoverage
) {
  return t(
    locale,
    `内容覆盖：白话导读审校 ${coverage.reviewedGuide.ratio}；英译 ${coverage.englishTranslation.ratio}；逐句拼音 ${coverage.pinyin.ratio}；真人女声音频 ${coverage.audio.ratio}。`,
    `Content coverage: reviewed modern-Chinese guide ${coverage.reviewedGuide.ratio}; English translation ${coverage.englishTranslation.ratio}; passage-level pinyin ${coverage.pinyin.ratio}; recorded female-voice audio ${coverage.audio.ratio}.`
  );
}
