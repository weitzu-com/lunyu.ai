import type { Locale } from "@/lib/analects";
import type { ListenChapter } from "@/lib/listen";
import {
  breadcrumbJsonLd,
  contentModifiedDate,
  localizedUrl,
  organizationId,
  siteName,
  siteUrl,
  websiteId,
} from "@/lib/site";

type ListenStructuredDataInput = {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  chapters: ListenChapter[];
};

function isoDuration(seconds: number | undefined) {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return undefined;
  const rounded = Number(seconds.toFixed(3));
  return `PT${rounded}S`;
}

export function buildListenStructuredData({
  locale,
  path,
  name,
  description,
  chapters,
}: ListenStructuredDataInput) {
  const pageUrl = localizedUrl(locale, path);
  const pageId = `${pageUrl}#webpage`;
  const bookId = `${siteUrl}#the-analects`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const itemListId = `${pageUrl}#chapters`;
  const isFirstBook = path === "/listen";
  const breadcrumbItems = [
    { name: siteName, path: "" },
    { name: locale === "zh-Hans" ? "论语" : "The Analects", path: "/analects" },
    ...(isFirstBook
      ? []
      : [{ name: locale === "zh-Hans" ? "听读" : "Listen", path: "/listen" }]),
    { name, path },
  ];

  const itemListElement = chapters.map((chapter, index) => {
    const chapterUrl = new URL(chapter.href, siteUrl).toString();
    const audioUrl = new URL(chapter.audioSrc, siteUrl).toString();
    const duration = isoDuration(chapter.durationSeconds);
    const audio = {
      "@type": "AudioObject",
      "@id": `${audioUrl}#audio`,
      name: chapter.title,
      contentUrl: audioUrl,
      inLanguage: chapter.audioLanguage,
      encodingFormat: chapter.audioFormat,
      ...(duration ? { duration } : {}),
      isPartOf: { "@id": bookId },
    };

    return {
      "@type": "ListItem",
      position: index + 1,
      name: chapter.title,
      url: chapterUrl,
      item: chapter.audioAvailable
        ? audio
        : {
            "@type": "WebPage",
            "@id": `${chapterUrl}#webpage`,
            name: chapter.title,
            url: chapterUrl,
            inLanguage: locale,
          },
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["CollectionPage", "WebPage"],
        "@id": pageId,
        url: pageUrl,
        name,
        description,
        inLanguage: locale,
        dateModified: contentModifiedDate,
        publisher: { "@id": organizationId },
        isPartOf: { "@id": websiteId },
        about: { "@id": bookId },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": itemListId },
      },
      {
        "@type": "Book",
        "@id": bookId,
        name: locale === "zh-Hans" ? "《论语》" : "The Analects",
        alternateName: locale === "zh-Hans" ? "The Analects" : "论语",
        url: localizedUrl(locale, "/analects"),
      },
      {
        ...breadcrumbJsonLd(locale, breadcrumbItems),
        "@id": breadcrumbId,
      },
      {
        "@type": "ItemList",
        "@id": itemListId,
        numberOfItems: chapters.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement,
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: localizedUrl(locale, ""),
      },
    ],
  };
}
