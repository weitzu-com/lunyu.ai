import Link from "next/link";
import { getBook, Locale, Sentence, sentenceUrl, t } from "@/lib/analects";
import { PinyinRuby } from "@/components/PinyinRuby";

export function SentenceCard({
  locale,
  sentence,
  compact = false,
}: {
  locale: Locale;
  sentence: Sentence;
  compact?: boolean;
}) {
  const book = getBook(sentence.bookSlug);

  return (
    <article className="group border-b border-rule py-6 last:border-b-0 sm:py-7">
      <div className="mb-3 flex flex-wrap items-center gap-2 font-ui text-xs uppercase tracking-[0.12em] text-cinnabar">
        <span>
          {book
            ? locale === "zh-Hans"
              ? book.zhTitle
              : `${book.pinyin}（${book.zhTitle}）`
            : sentence.bookSlug}
        </span>
        <span className="text-ink-soft">·</span>
        <span>{String(sentence.sentenceNumber).padStart(2, "0")}</span>
      </div>
      <h3 className="ruby-heading font-serif text-[1.625rem] leading-[var(--lh-cjk)] text-ink sm:text-3xl">
        {!compact && sentence.pinyin ? (
          <PinyinRuby text={sentence.classicalChinese} pinyin={sentence.pinyin} />
        ) : (
          sentence.classicalChinese
        )}
      </h3>
      <p className="translation-text mt-4 font-en text-base leading-[var(--lh-en)] text-ink-soft sm:text-lg">
        {locale === "zh-Hans" ? sentence.modernChinese : sentence.english}
      </p>
      <Link
        href={sentenceUrl(locale, sentence)}
        className="deep-read-link deep-read-toggle-target mt-5 inline-block min-h-11 py-2"
      >
        {t(locale, "深读这一句", "Study this passage")}
      </Link>
    </article>
  );
}
