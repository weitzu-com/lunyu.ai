import Link from "next/link";
import { Locale, t } from "@/lib/analects";
import { contentCoverage } from "@/lib/content-coverage";
import { contentModifiedDate, trustPageLabel } from "@/lib/site";

type FooterLink = {
  href: string;
  label: string;
};

const footerLinkClass = "hover:text-ink";

function FooterLinkList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="mt-3 space-y-2 leading-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={footerLinkClass}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const readingLinks: FooterLink[] = [
    {
      href: `/${locale}/analects`,
      label: t(locale, "二十篇目录", "Twenty books"),
    },
    {
      href: `/${locale}/analects/xue-er`,
      label: t(locale, "从学而开始", "Start with Xue Er"),
    },
    {
      href: `/${locale}/listen`,
      label: t(locale, "听读模式", "Listening mode"),
    },
    {
      href: `/${locale}/blogs`,
      label: t(locale, "阅读札记", "Reading notes"),
    },
  ];
  const verificationLinks: FooterLink[] = [
    {
      href: `/${locale}/index`,
      label: t(locale, "人物地点索引", "People and places index"),
    },
    {
      href: `/${locale}/sources`,
      label: trustPageLabel(locale, "sources"),
    },
    {
      href: `/${locale}/method`,
      label: trustPageLabel(locale, "method"),
    },
    {
      href: `/${locale}/about`,
      label: trustPageLabel(locale, "about"),
    },
    {
      href: `/${locale}/faq`,
      label: trustPageLabel(locale, "faq"),
    },
    {
      href: "/llms.txt",
      label: "llms.txt",
    },
  ];

  return (
    <footer className="mt-16 border-t border-rule bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-10 font-ui text-sm text-ink-soft sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.25fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-seal-solid.svg" alt="" width={28} height={28} />
              <div className="font-cjk text-base text-ink">lunyu.ai</div>
            </div>
            <p className="mt-3 leading-6 text-ink-soft">
              {t(
                locale,
                `《论语》二十篇 ${contentCoverage.totalPassages} 章，逐句可读、可索引、可分享。`,
                `All ${contentCoverage.totalPassages} passages of The Analects — readable, indexable, shareable.`
              )}
            </p>
            <p className="mt-4 border-l border-rule pl-4 leading-6">
              {t(
                locale,
                "不另立新定本；只把原文、白话导读、英译、索引与听读入口分层呈现，方便核验与引用。",
                "Not a new critical edition; source text, guide, translation, index, and listening entry points are kept separate for verification and citation."
              )}
            </p>
          </div>
          <div>
            <div className="label">{t(locale, "阅读入口", "Read")}</div>
            <FooterLinkList links={readingLinks} />
          </div>
          <div>
            <div className="label">{t(locale, "查证与复用", "Verify & reuse")}</div>
            <FooterLinkList links={verificationLinks} />
          </div>
          <div>
            <div className="label">{t(locale, "当前状态", "Current status")}</div>
            <ul className="mt-3 space-y-2 leading-6">
              <li>
                {t(
                  locale,
                  `白话导读审校：${contentCoverage.reviewedGuide.ratio}`,
                  `Reviewed modern Chinese guide: ${contentCoverage.reviewedGuide.ratio}`
                )}
              </li>
              <li>
                {t(
                  locale,
                  `英译：${contentCoverage.englishTranslation.ratio}`,
                  `English translation: ${contentCoverage.englishTranslation.ratio}`
                )}
              </li>
              <li>
                {t(
                  locale,
                  `音频：${contentCoverage.audio.books.ratio} 篇含录音，${contentCoverage.audio.ratio} 章可播放`,
                  `Audio: ${contentCoverage.audio.books.ratio} books include recordings, with ${contentCoverage.audio.ratio} playable chapters`
                )}
              </li>
              <li>
                {t(
                  locale,
                  `逐句拼音：${contentCoverage.pinyin.ratio} 已展示`,
                  `Passage pinyin: ${contentCoverage.pinyin.ratio} rendered`
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 grid gap-5 border-t border-rule pt-6 text-xs leading-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="max-w-3xl">
            <p>
              <span className="text-ink">
                {t(locale, "底本与许可：", "Sources and license:")}
              </span>
              {t(
                locale,
                "简体原文据 Wikisource 公版文本整理；英译为 James Legge 1893–1895 公版；白话导读据 1948 上海广益书局《白话论语读本》传统审校。",
                "Simplified Chinese source text is organized from public-domain Wikisource text; English uses James Legge's 1893-1895 public-domain translation; the modern Chinese guide follows the 1948 Guangyi Shuju Baihua Lunyu Duben tradition."
              )}
            </p>
            <p className="mt-2">
              {t(
                locale,
                "引用建议：保留具体句子 URL，并标明引用层是原文、白话导读、英译还是本站说明。",
                "Citation: keep the exact passage URL and identify whether you cite the source text, modern Chinese guide, English translation, or site note."
              )}
            </p>
          </div>
          <div className="sm:text-right">
            <p>
              © {year} lunyu.ai ·{" "}
              {t(
                locale,
                "公版原文与译文依底本许可",
                "Public-domain sources under their original licenses"
              )}
            </p>
            <p className="text-ink-soft">v1.0 · {contentModifiedDate}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
