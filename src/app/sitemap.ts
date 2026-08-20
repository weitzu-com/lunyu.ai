import type { MetadataRoute } from "next";
import { books, getAllSentences, locales, type Locale } from "@/lib/analects";
import { blogEntities } from "@/lib/blogs";
import { editorialPosts } from "@/lib/editorial-posts";
import { contentModifiedDate, localizedUrl, siteUrl } from "@/lib/site";
import { trustPageSlugs } from "@/lib/trust-pages";

const hubPages = ["/analects", "/blogs", "/index", "/listen"] as const;

function addLocalized(
  entries: MetadataRoute.Sitemap,
  locale: Locale,
  path: string,
  lastModified = contentModifiedDate
) {
  entries.push({
    url: localizedUrl(locale, path),
    lastModified,
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const localeList = Object.keys(locales) as Locale[];
  const sentences = getAllSentences();

  for (const locale of localeList) {
    addLocalized(entries, locale, "");

    for (const path of hubPages) {
      addLocalized(entries, locale, path);
    }

    for (const trust of trustPageSlugs) {
      addLocalized(entries, locale, `/${trust}`);
    }

    for (const book of books) {
      addLocalized(entries, locale, `/analects/${book.slug}`);
    }

    for (const book of books.slice(1)) {
      addLocalized(entries, locale, `/listen/${book.slug}`);
    }

    for (const sentence of sentences) {
      addLocalized(entries, locale, `/analects/${sentence.bookSlug}/${sentence.id}`);
    }

    for (const entity of blogEntities) {
      addLocalized(entries, locale, `/index/${entity.slug}`);
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
