import { Locale, locales, t } from "@/lib/analects";

export const siteName = "lunyu.ai";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lunyu.ai").replace(/\/+$/, "");

export const websiteId = `${siteUrl}#website`;
export const organizationId = `${siteUrl}#organization`;

export const contentPublishedDate = "2026-07-06";
export const contentModifiedDate = "2026-08-20";

export const sourceUrls = {
  wikisource: "https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_1/Confucian_Analects",
  jamesLegge: "https://www.gutenberg.org/ebooks/3330",
  modernChineseBase:
    "https://commons.wikimedia.org/wiki/File:NCL-9910006822_%E7%99%BD%E8%A9%B1%E8%AB%96%E8%AA%9E%E8%AE%80%E6%9C%AC.pdf",
} as const;

export const sameAs: string[] = [];

export const licenseText =
  "简体原文与句子级索引依据公版底本整理；James Legge 英译为公版文本；白话导读为站内编辑工作流审校后的独立整理，不把现代启发混入原文层。";

export function localizedUrl(locale: Locale, path = "") {
  const normalized = path === "/" ? "" : path;
  if (!normalized) return `${siteUrl}/${locale}`;
  return `${siteUrl}/${locale}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function breadcrumbJsonLd(
  locale: Locale,
  items: Array<{ name: string; path: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}

const trustPageLabels = {
  about: {
    zh: "关于本站",
    en: "About",
  },
  method: {
    zh: "编辑方法",
    en: "Method",
  },
  sources: {
    zh: "底本与许可",
    en: "Sources",
  },
  faq: {
    zh: "常见问题",
    en: "FAQ",
  },
} as const;

export function trustPageLabel(locale: Locale, slug: keyof typeof trustPageLabels | string) {
  const key = (slug in trustPageLabels ? slug : "about") as keyof typeof trustPageLabels;
  const label = trustPageLabels[key];
  return t(locale, label.zh, label.en);
}

export function correctionUrl(locale: Locale) {
  return localizedUrl(locale, "/method#corrections");
}

