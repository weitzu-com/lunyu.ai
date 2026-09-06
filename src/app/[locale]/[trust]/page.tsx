import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Locale, locales, t } from "@/lib/analects";
import { alternates, openGraph, twitterCard } from "@/lib/seo";
import { jsonLd, trustPageLabel } from "@/lib/site";
import {
  faqItems,
  trustJsonLd,
  trustPageDescription,
  trustPageSlugs,
  trustPageTitle,
  trustSections,
  TrustPageSlug,
} from "@/lib/trust-pages";

function normalizeTrustSlug(slug: string): TrustPageSlug | null {
  return (trustPageSlugs as string[]).includes(slug) ? (slug as TrustPageSlug) : null;
}

export function generateStaticParams() {
  return (Object.keys(locales) as Locale[]).flatMap((locale) =>
    trustPageSlugs.map((trust) => ({ locale, trust }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; trust: string }>;
}): Promise<Metadata> {
  const { locale, trust } = await params;
  const slug = normalizeTrustSlug(trust);
  if (!slug) return {};
  const title = trustPageTitle(locale, slug);
  const description = trustPageDescription(locale, slug);
  const path = `/${slug}`;
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: openGraph(locale, path, title, description),
      twitter: twitterCard(locale, path, title, description),
  };
}

export default async function TrustPage({
  params,
}: {
  params: Promise<{ locale: Locale; trust: string }>;
}) {
  const { locale, trust } = await params;
  const slug = normalizeTrustSlug(trust);
  if (!slug) notFound();

  const sections = trustSections(locale, slug);
  const faqs = slug === "faq" ? faqItems(locale) : [];

  return (
    <main id="main" className="min-h-screen bg-paper text-ink">
      <SiteHeader locale={locale} path={`/${slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(trustJsonLd(locale, slug)) }}
      />
      <article className="page-shell max-w-4xl py-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-5 font-ui text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href={`/${locale}`} className="hover:text-ink">
                lunyu.ai
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-ink">{trustPageLabel(locale, slug)}</li>
          </ol>
        </nav>
        <p className="label mb-4">
          {t(locale, "信任与透明", "Trust and transparency")}
        </p>
        <h1 className="font-serif text-[2.5rem] leading-tight sm:text-5xl">
          {trustPageLabel(locale, slug)}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">
          {trustPageDescription(locale, slug)}
        </p>

        <div className="mt-8 border-y border-rule bg-surface px-4 py-2 sm:px-6">
          {sections.map((section) => (
            <section key={section.heading} id={slug === "method" && section.heading === t(locale, "更正机制", "Corrections") ? "corrections" : undefined} className="reading-panel scroll-mt-6">
              <h2 className="label">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-ink">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
          {faqs.length > 0 && (
            <section className="reading-panel" aria-labelledby="faq-list">
              <h2 id="faq-list" className="label">
                FAQ
              </h2>
              <div className="mt-4 space-y-5">
                {faqs.map((item) => (
                  <div key={item.question} className="border-b border-rule pb-5 last:border-b-0">
                    <h3 className="font-serif text-2xl leading-snug text-ink">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-ink-soft">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <section className="mt-8 flex flex-wrap gap-2" aria-label={t(locale, "相关页面", "Related pages")}>
          {trustPageSlugs
            .filter((item) => item !== slug)
            .map((item) => (
              <Link key={item} href={`/${locale}/${item}`} className="chip">
                {trustPageLabel(locale, item)}
              </Link>
            ))}
          <Link href={`/${locale}/analects/xue-er/xue-er-001`} className="chip">
            {t(locale, "引用示例", "Citation example")}
          </Link>
        </section>
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
