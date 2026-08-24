import Link from "next/link";
import { bookUrl, type Locale, type Sentence, t } from "@/lib/analects";
import {
  blogTitle,
  blogUrl,
  categoryLabel,
  sentenceBookLabel,
  sentenceHref,
  type BlogEntity,
} from "@/lib/blogs";
import {
  allAnalectsBooks,
  featuredAndRemainingSentences,
  featuredRelatedEntities,
  featuredSentence,
  localize,
  type FeaturedIndexContent,
} from "@/lib/featured-index";

function PassageLine({ locale, sentence }: { locale: Locale; sentence: Sentence }) {
  return (
    <li className="py-4">
      <Link href={sentenceHref(locale, sentence)} className="group block">
        <div className="flex flex-wrap items-center justify-between gap-2 font-ui text-xs text-ink-soft">
          <span>{sentenceBookLabel(locale, sentence)}</span>
          <span>{sentence.id}</span>
        </div>
        <p className="mt-2 font-serif text-xl leading-[1.7] text-ink group-hover:text-cinnabar">
          {sentence.classicalChinese}
        </p>
        <p className="mt-2 text-sm leading-7 text-ink-soft">
          {locale === "zh-Hans" ? sentence.modernChinese : sentence.english}
        </p>
      </Link>
    </li>
  );
}

export function FeaturedIndexEntry({
  locale,
  entity,
  content,
}: {
  locale: Locale;
  entity: BlogEntity;
  content: FeaturedIndexContent;
}) {
  const { featured, remaining } = featuredAndRemainingSentences(entity, content);
  const related = featuredRelatedEntities(content);
  const catalogue = allAnalectsBooks();
  const practiceSentence = featuredSentence(content.practiceSentenceId);

  return (
    <>
      <p className="mt-5 max-w-3xl text-base leading-8 text-ink sm:text-lg">
        {localize(locale, content.subtitle)}
      </p>
      <p className="mt-3 max-w-3xl font-ui text-sm text-ink-soft">
        {localize(locale, content.editorialNote)}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={`/${locale}/index`} className="chip">
          {t(locale, "返回索引", "Back to index")}
        </Link>
        <Link href={`/${locale}/analects`} className="chip">
          {t(locale, "查看论语目录", "Open the Analects index")}
        </Link>
      </div>

      <section id="uses" className="mt-10 border-y border-rule bg-surface px-4 py-5 sm:px-6" aria-labelledby="h-uses">
        <h2 id="h-uses" className="label">
          {localize(locale, content.usesHeading)}
        </h2>
        <ol className="mt-4 divide-y divide-rule">
          {content.uses.map((use) => {
            const sentence = featuredSentence(use.sentenceId);
            return (
              <li key={use.sentenceId} className="py-4">
                <h3 className="font-serif text-xl">{localize(locale, use.title)}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-ink-soft">{localize(locale, use.body)}</p>
                {sentence ? (
                  <Link href={sentenceHref(locale, sentence)} className="chip mt-3">
                    {sentenceBookLabel(locale, sentence)}
                    <span className="ml-2 text-xs text-ink-soft">{sentence.id}</span>
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      <section
        id="confusions"
        className="mt-8 border-y border-rule bg-surface px-4 py-5 sm:px-6"
        aria-labelledby="h-confusions"
      >
        <h2 id="h-confusions" className="label">
          {localize(locale, content.confusionsHeading)}
        </h2>
        <div className="mt-4 divide-y divide-rule">
          {content.confusions.map((item) => (
            <article key={item.title.en} className="py-4">
              <h3 className="font-serif text-xl">{localize(locale, item.title)}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-ink-soft">{localize(locale, item.body)}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="featured"
        className="mt-8 border-y border-rule bg-surface px-4 py-5 sm:px-6"
        aria-labelledby="h-featured"
      >
        <h2 id="h-featured" className="label">
          {localize(locale, content.featuredHeading)}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-soft">
          {localize(locale, content.featuredIntro)}
        </p>
        <ol className="mt-4 divide-y divide-rule">
          {featured.map((sentence) => (
            <PassageLine key={sentence.id} locale={locale} sentence={sentence} />
          ))}
        </ol>
        {remaining.length > 0 ? (
          <details className="mt-4 border-t border-rule pt-4">
            <summary className="cursor-pointer font-ui text-sm text-ink">
              {localize(locale, content.viewAllLabel)}
              <span className="ml-2 text-ink-soft">
                {t(locale, `${remaining.length} 章`, `${remaining.length} passages`)}
              </span>
            </summary>
            <ol className="mt-2 divide-y divide-rule">
              {remaining.map((sentence) => (
                <PassageLine key={sentence.id} locale={locale} sentence={sentence} />
              ))}
            </ol>
          </details>
        ) : null}
      </section>

      <section
        id="practice"
        className="mt-8 border-y border-rule bg-surface px-4 py-5 sm:px-6"
        aria-labelledby="h-practice"
      >
        <h2 id="h-practice" className="label">
          {localize(locale, content.practiceHeading)}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-ink">{localize(locale, content.practice)}</p>
        {practiceSentence ? (
          <div className="mt-4">
            <Link href={sentenceHref(locale, practiceSentence)} className="chip">
              {sentenceBookLabel(locale, practiceSentence)}
              <span className="ml-2 text-xs text-ink-soft">{practiceSentence.id}</span>
            </Link>
          </div>
        ) : null}
      </section>

      <section id="faq" className="mt-8 border-y border-rule bg-surface px-4 py-5 sm:px-6" aria-labelledby="h-index-faq">
        <h2 id="h-index-faq" className="label">
          {localize(locale, content.faqHeading)}
        </h2>
        <div className="mt-4 divide-y divide-rule">
          {content.faqs.map((faq) => (
            <details key={faq.question.en} className="group py-4">
              <summary className="cursor-pointer list-none font-serif text-xl marker:hidden">
                {localize(locale, faq.question)}
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-soft">{localize(locale, faq.answer)}</p>
            </details>
          ))}
        </div>
      </section>

      <section
        id="related"
        className="mt-8 border-y border-rule bg-surface px-4 py-5 sm:px-6"
        aria-labelledby="h-related-index"
      >
        <h2 id="h-related-index" className="label">
          {localize(locale, content.relatedHeading)}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {related.map((item) => (
            <Link key={item.slug} href={blogUrl(locale, item)} className="chip">
              {blogTitle(locale, item)}
              <span className="ml-2 text-xs text-ink-soft">{categoryLabel(locale, item.category)}</span>
            </Link>
          ))}
        </div>
        <h3 id="h-twenty-books" className="label mt-8">
          {localize(locale, content.booksHeading)}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/${locale}/analects`} className="chip">
            {t(locale, "《论语》二十篇目录", "The twenty books")}
          </Link>
          {catalogue.map((book) => (
            <Link key={book.slug} href={bookUrl(locale, book.slug)} className="chip">
              {t(locale, book.zhTitle, book.pinyin)}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
