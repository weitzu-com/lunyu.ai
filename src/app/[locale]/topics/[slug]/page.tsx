import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getBook, getSentence, type Locale, locales, t } from "@/lib/analects";
import {
  getIntentHub,
  hubCitations,
  hubModifiedDate,
  hubPublishedDate,
  intentHubs,
  intentHubPath,
  intentHubSlugs,
  localize,
  type HubCitationId,
} from "@/lib/intent-hubs";
import { alternates, localizedUrl, openGraph, twitterCard } from "@/lib/seo";
import { jsonLd, organizationId, siteName, websiteId } from "@/lib/site";

export function generateStaticParams() {
  return (Object.keys(locales) as Locale[]).flatMap((locale) =>
    intentHubSlugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const hub = getIntentHub(slug);
  if (!hub) return {};
  const path = intentHubPath(hub.slug);
  const title = localize(locale, hub.metaTitle);
  const description = localize(locale, hub.metaDescription);
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: openGraph(locale, path, `${title} · lunyu.ai`, description),
    twitter: twitterCard(locale, path, `${title} · lunyu.ai`, description),
  };
}

function CitationLinks({
  locale,
  ids,
}: {
  locale: Locale;
  ids: HubCitationId[];
}) {
  return (
    <span className="ml-1 inline-flex flex-wrap gap-1 align-super font-ui text-[0.7rem] text-cinnabar">
      {ids.map((id) => {
        const sourceNumber = Object.keys(hubCitations).indexOf(id) + 1;
        return (
          <a
            key={id}
            href={`#source-${id}`}
            aria-label={t(locale, `来源 ${sourceNumber}`, `Source ${sourceNumber}`)}
            className="underline decoration-rule underline-offset-2 hover:text-ink"
          >
            [{sourceNumber}]
          </a>
        );
      })}
    </span>
  );
}

export default async function IntentHubPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const hub = getIntentHub(slug);
  if (!hub) notFound();

  const path = intentHubPath(hub.slug);
  const url = localizedUrl(locale, path);
  const selectedPassages = hub.passages.map((selection) => {
    const sentence = getSentence(selection.sentenceId);
    if (!sentence) throw new Error(`Unknown hub passage: ${selection.sentenceId}`);
    const book = getBook(sentence.bookSlug);
    if (!book) throw new Error(`Unknown hub book: ${sentence.bookSlug}`);
    return { selection, sentence, book };
  });

  const faqId = `${url}#faq`;
  const itemListId = `${url}#passages`;
  const breadcrumbId = `${url}#breadcrumb`;
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: localize(locale, hub.title),
        description: localize(locale, hub.metaDescription),
        inLanguage: locales[locale].htmlLang,
        datePublished: hubPublishedDate,
        dateModified: hubModifiedDate,
        isAccessibleForFree: true,
        publisher: { "@id": organizationId },
        isPartOf: { "@id": websiteId },
        about: {
          "@type": "Book",
          name: "The Analects",
          alternateName: ["论语", "Lunyu", "Analects of Confucius", "Confucian Analects"],
        },
        mainEntity: { "@id": itemListId },
        hasPart: { "@id": faqId },
        breadcrumb: { "@id": breadcrumbId },
        citation: hub.sourceIds.map((id) => hubCitations[id].url),
      },
      {
        "@type": "ItemList",
        "@id": itemListId,
        name: localize(locale, hub.passagesHeading),
        numberOfItems: selectedPassages.length,
        itemListElement: selectedPassages.map(({ sentence, book }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${t(locale, book.zhTitle, book.pinyin)} ${sentence.bookNumber}.${sentence.sentenceNumber}`,
          url: localizedUrl(locale, `/analects/${sentence.bookSlug}/${sentence.id}`),
          item: {
            "@type": "Quotation",
            text: sentence.classicalChinese,
            isPartOf: { "@type": "Book", name: "The Analects", alternateName: "论语" },
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        mainEntity: hub.faqs.map((faq) => ({
          "@type": "Question",
          name: localize(locale, faq.question),
          acceptedAnswer: {
            "@type": "Answer",
            text: localize(locale, faq.answer),
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteName, item: localizedUrl(locale, "") },
          { "@type": "ListItem", position: 2, name: t(locale, "主题导读", "Topic guides"), item: localizedUrl(locale, "/analects") },
          { "@type": "ListItem", position: 3, name: localize(locale, hub.title), item: url },
        ],
      },
    ],
  };

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(pageJsonLd) }} />
      <SiteHeader locale={locale} path={path} />

      <article>
        <header className="border-b border-rule bg-surface">
          <div className="page-shell py-10 sm:py-14">
            <nav aria-label={t(locale, "面包屑", "Breadcrumb")} className="font-ui text-sm text-ink-soft">
              <ol className="flex flex-wrap items-center gap-1">
                <li><Link href={`/${locale}`} className="hover:text-ink">lunyu.ai</Link></li>
                <li aria-hidden>›</li>
                <li><Link href={`/${locale}/analects`} className="hover:text-ink">{t(locale, "《论语》", "The Analects")}</Link></li>
                <li aria-hidden>›</li>
                <li className="text-ink">{localize(locale, hub.metaTitle)}</li>
              </ol>
            </nav>

            <p className="label mt-8 text-cinnabar">{localize(locale, hub.eyebrow)}</p>
            <h1 className="mt-4 max-w-5xl font-serif text-4xl leading-tight sm:text-6xl">
              {localize(locale, hub.title)}
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-ink-soft sm:text-xl">
              {localize(locale, hub.deck)}
            </p>
            <p className="mt-4 max-w-4xl text-base leading-8 text-ink">
              {localize(locale, hub.scopeLine)}
            </p>

            <nav aria-label={t(locale, "四个检索意图导读", "Four search-intent guides")} className="mt-8 flex flex-wrap gap-2">
              {intentHubSlugs.map((itemSlug) => {
                const item = intentHubs[itemSlug];
                return (
                  <Link
                    key={itemSlug}
                    href={`/${locale}${intentHubPath(itemSlug)}`}
                    aria-current={itemSlug === hub.slug ? "page" : undefined}
                    className={`chip ${itemSlug === hub.slug ? "border-cinnabar text-cinnabar" : ""}`}
                  >
                    {localize(locale, item.metaTitle)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <div className="page-shell py-10 sm:py-14">
          <section aria-labelledby="direct-answer" className="border-l-2 border-cinnabar bg-surface p-6 sm:p-8">
            <h2 id="direct-answer" className="font-serif text-3xl">{localize(locale, hub.directHeading)}</h2>
            <div className="mt-4 max-w-4xl space-y-4 text-base leading-8 sm:text-lg">
              {hub.directAnswer.map((paragraph) => (
                <p key={paragraph.en}>
                  {localize(locale, paragraph)}
                  <CitationLinks locale={locale} ids={hub.directCitationIds} />
                </p>
              ))}
            </div>
          </section>

          <section aria-labelledby="distinctions" className="mt-14">
            <h2 id="distinctions" className="font-serif text-3xl">{localize(locale, hub.distinctionsHeading)}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {hub.distinctions.map((item) => (
                <div key={item.title.en} className="border border-rule bg-surface p-5">
                  <h3 className="font-serif text-xl">{localize(locale, item.title)}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">{localize(locale, item.body)}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <div className="space-y-12">
              {hub.sections.map((section) => (
                <section key={section.heading.en}>
                  <h2 className="font-serif text-3xl">{localize(locale, section.heading)}</h2>
                  <div className="mt-5 max-w-3xl space-y-4 text-base leading-8 text-ink-soft sm:text-lg">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.en}>
                        {localize(locale, paragraph)}
                        <CitationLinks locale={locale} ids={section.citationIds} />
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <aside className="border border-rule bg-surface p-5 lg:sticky lg:top-6">
              <div className="label">{t(locale, "本页边界", "Scope note")}</div>
              <p className="mt-3 text-sm leading-7 text-ink-soft">
                {t(
                  locale,
                  "本页解释检索问题并选择入口章句；全部二十篇 499 章仍在既有目录中，不在这里重复罗列。",
                  "This page answers a search question and selects entry passages. The existing catalogue remains the complete home for all twenty books and 499 passages."
                )}
              </p>
              <Link href={`/${locale}/analects`} className="ui-button mt-5 w-full">
                {t(locale, "进入二十篇目录", "Open the twenty-book catalogue")}
              </Link>
            </aside>
          </div>

          <section aria-labelledby="selected-passages" className="mt-16 border-t border-rule pt-12">
            <h2 id="selected-passages" className="font-serif text-3xl">{localize(locale, hub.passagesHeading)}</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">{localize(locale, hub.passagesIntro)}</p>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {selectedPassages.map(({ selection, sentence, book }) => (
                <article key={sentence.id} className="flex flex-col border border-rule bg-surface p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="label text-cinnabar">{t(locale, book.zhTitle, book.pinyin)} · {sentence.bookNumber}.{sentence.sentenceNumber}</p>
                    <Link
                      href={`/${locale}/analects/${sentence.bookSlug}/${sentence.id}`}
                      className="font-ui text-sm text-ink-soft underline decoration-rule underline-offset-4 hover:text-ink"
                    >
                      {t(locale, "完整章句与注释", "Full passage and notes")} →
                    </Link>
                  </div>
                  <blockquote className="mt-5 font-cjk text-xl leading-[1.9] text-ink">
                    {sentence.classicalChinese}
                  </blockquote>
                  <p className="mt-4 border-t border-rule pt-4 font-en text-base leading-7 text-ink-soft">
                    {sentence.english}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-ink-soft">{localize(locale, selection.note)}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 max-w-3xl border border-rule bg-surface p-5">
              <h3 className="font-serif text-xl">{localize(locale, hub.practiceHeading)}</h3>
              <p className="mt-3 text-base leading-8 text-ink-soft">{localize(locale, hub.practiceLine)}</p>
              <Link
                href={`/${locale}${hub.practicePath}`}
                className="mt-4 inline-block font-ui text-sm text-ink underline decoration-rule underline-offset-4 hover:text-cinnabar"
              >
                {localize(locale, hub.practiceLinkLabel)} →
              </Link>
            </div>
          </section>

          <section aria-labelledby="translation-layers" className="mt-16 border-t border-rule pt-12">
            <h2 id="translation-layers" className="font-serif text-3xl">{localize(locale, hub.translationHeading)}</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">{localize(locale, hub.translationIntro)}</p>
            <div className="mt-7 overflow-x-auto border border-rule bg-surface">
              <table className="w-full min-w-[42rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-rule bg-surface-sunken font-ui text-sm">
                    <th className="w-48 px-5 py-4 font-medium">{t(locale, "层次", "Layer")}</th>
                    <th className="px-5 py-4 font-medium">{t(locale, "作用与边界", "Purpose and boundary")}</th>
                  </tr>
                </thead>
                <tbody>
                  {hub.translationLayers.map((layer) => (
                    <tr key={layer.label.en} className="border-b border-rule last:border-b-0">
                      <th className="px-5 py-4 font-serif text-lg font-normal">{localize(locale, layer.label)}</th>
                      <td className="px-5 py-4 text-sm leading-7 text-ink-soft">{localize(locale, layer.body)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="hub-faq" className="mt-16 border-t border-rule pt-12">
            <h2 id="hub-faq" className="font-serif text-3xl">{localize(locale, hub.faqHeading)}</h2>
            <div className="mt-7 divide-y divide-rule border-y border-rule">
              {hub.faqs.map((faq) => (
                <details key={faq.question.en} className="group py-5" open>
                  <summary className="cursor-pointer list-none pr-8 font-serif text-xl marker:hidden">
                    {localize(locale, faq.question)}
                  </summary>
                  <p className="mt-3 max-w-4xl text-base leading-8 text-ink-soft">{localize(locale, faq.answer)}</p>
                </details>
              ))}
            </div>
          </section>

          <section aria-labelledby="sources" className="mt-16 border-t border-rule pt-12">
            <h2 id="sources" className="font-serif text-3xl">{t(locale, "来源与延伸核验", "Sources and further verification")}</h2>
            <ol className="mt-7 grid gap-4 md:grid-cols-2">
              {hub.sourceIds.map((id) => {
                const source = hubCitations[id];
                const sourceNumber = Object.keys(hubCitations).indexOf(id) + 1;
                return (
                  <li id={`source-${id}`} key={id} className="scroll-mt-6 border border-rule bg-surface p-5">
                    <a href={source.url} target="_blank" rel="noreferrer" className="font-serif text-lg underline decoration-rule underline-offset-4 hover:text-cinnabar">
                      [{sourceNumber}] {source.title}
                    </a>
                    <p className="mt-3 text-sm leading-7 text-ink-soft">{localize(locale, source.note)}</p>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-labelledby="continue" className="mt-16 border-t border-rule pt-12">
            <h2 id="continue" className="font-serif text-3xl">{t(locale, "继续阅读，不重复目录", "Continue without duplicating the catalogue")}</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {hub.relatedLinks.map((link) => (
                <Link key={link.path} href={`/${locale}${link.path}`} className="border border-rule bg-surface p-5 transition-colors duration-300 hover:border-ink">
                  <h3 className="font-serif text-xl">{localize(locale, link.title)}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">{localize(locale, link.description)}</p>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="index-links" className="mt-16 border-t border-rule pt-12">
            <h2 id="index-links" className="font-serif text-3xl">{localize(locale, hub.indexLinksHeading)}</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink-soft">{localize(locale, hub.indexLinksIntro)}</p>
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {hub.indexLinks.map((link) => (
                <Link key={link.path} href={`/${locale}${link.path}`} className="border border-rule bg-surface p-5 transition-colors duration-300 hover:border-ink">
                  <h3 className="font-serif text-xl">{localize(locale, link.title)}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-soft">{localize(locale, link.description)}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>

      <SiteFooter locale={locale} />
    </main>
  );
}
