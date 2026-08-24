import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/analects";
import { blogEntities } from "@/lib/blogs";
import { contentCoverage } from "@/lib/content-coverage";
import { editorialPosts } from "@/lib/editorial-posts";
import { indexEntryModifiedDate } from "@/lib/featured-index";
import { hubModifiedDate, intentHubSlugs } from "@/lib/intent-hubs";
import { contentModifiedDate, localizedUrl, siteUrl } from "@/lib/site";
import { trustPageSlugs } from "@/lib/trust-pages";

const hubPages = ["/analects", "/blogs", "/index"] as const;

function addLocalized(
  entries: MetadataRoute.Sitemap,
  locale: Locale,
  path: string,
  lastModified = contentModifiedDate,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly"
) {
  entries.push({
    url: localizedUrl(locale, path),
    lastModified,
    changeFrequency,
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const localeList = Object.keys(locales) as Locale[];
  const editorialFrequency =
    contentCoverage.reviewedGuide.complete && contentCoverage.pinyin.complete
      ? "monthly"
      : "weekly";
  const listenFrequency = contentCoverage.audio.complete ? "monthly" : "weekly";

  for (const locale of localeList) {
    addLocalized(entries, locale, "");

    for (const path of hubPages) {
      addLocalized(entries, locale, path, contentModifiedDate, editorialFrequency);
    }

    if (contentCoverage.audio.available > 0) {
      addLocalized(entries, locale, "/listen", contentModifiedDate, listenFrequency);
    }

    for (const slug of intentHubSlugs) {
      addLocalized(entries, locale, `/topics/${slug}`, hubModifiedDate);
    }

    for (const trust of trustPageSlugs) {
      addLocalized(entries, locale, `/${trust}`);
    }

    for (const book of contentCoverage.books) {
      addLocalized(entries, locale, `/analects/${book.slug}`, contentModifiedDate, editorialFrequency);
    }

    for (const book of contentCoverage.books.filter(
      (item) => item.number !== 1 && item.audio.available > 0
    )) {
      addLocalized(entries, locale, `/listen/${book.slug}`, contentModifiedDate, listenFrequency);
    }

    for (const sentence of contentCoverage.passages) {
      const passageFrequency =
        sentence.reviewedGuide && sentence.pinyin ? "monthly" : "weekly";
      addLocalized(
        entries,
        locale,
        `/analects/${sentence.bookSlug}/${sentence.id}`,
        contentModifiedDate,
        passageFrequency
      );
    }

    for (const entity of blogEntities) {
      addLocalized(
        entries,
        locale,
        `/index/${entity.slug}`,
        indexEntryModifiedDate(entity.slug) ?? contentModifiedDate
      );
    }

    for (const post of editorialPosts) {
      addLocalized(entries, locale, `/blogs/${post.slug}`, post.dateModified);
    }
  }

  entries.push({
    url: `${siteUrl}/llms.txt`,
    lastModified: contentModifiedDate,
  });

  return entries;
}
