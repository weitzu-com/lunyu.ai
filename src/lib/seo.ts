import type { Metadata } from "next";
import { Locale, locales } from "@/lib/analects";
export { localizedUrl, siteUrl } from "@/lib/site";
import { localizedUrl } from "@/lib/site";

export const ogLocale: Record<Locale, string> = {
  "zh-Hans": "zh_CN",
  en: "en_US",
};

/**
 * Self-referencing canonical + per-page hreflang alternates.
 * `path` is the locale-less path, e.g. "/analects/xue-er/xue-er-001" ("" = locale home).
 */
export function alternates(locale: Locale, path = ""): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  (Object.keys(locales) as Locale[]).forEach((l) => {
    languages[locales[l].htmlLang] = localizedUrl(l, path);
  });
  languages["x-default"] = localizedUrl("en", path);
  return {
    canonical: localizedUrl(locale, path),
    languages,
  };
}

/** Shared Open Graph fields for a page (og:image comes from the file-based opengraph-image). */
export function openGraph(
  locale: Locale,
  path: string,
  title: string,
  description: string
): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: "lunyu.ai",
    url: localizedUrl(locale, path),
    locale: ogLocale[locale],
    title,
    description,
    images: [
      {
        url: localizedUrl(locale, "/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "lunyu.ai — The Analects of Confucius",
      },
    ],
  };
}

/** Shared Twitter card fields; nested metadata is route-level, so pages must opt in. */
export function twitterCard(
  locale: Locale,
  path: string,
  title: string,
  description: string
): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: localizedUrl(locale, "/opengraph-image"),
        alt: "lunyu.ai — The Analects of Confucius",
      },
    ],
  };
}
