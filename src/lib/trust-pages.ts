import { contentCoverage, Locale, t } from "@/lib/analects";
import { getListenCoverage } from "@/lib/listen";
import {
  contentModifiedDate,
  correctionUrl,
  licenseText,
  localizedUrl,
  organizationId,
  sameAs,
  siteName,
  sourceUrls,
  trustPageLabel,
} from "@/lib/site";

export type TrustPageSlug = "about" | "method" | "sources" | "faq";

export const trustPageSlugs: TrustPageSlug[] = ["about", "method", "sources", "faq"];

export type TrustSection = {
  heading: string;
  body: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export function trustPageTitle(locale: Locale, slug: TrustPageSlug) {
  return trustPageLabel(locale, slug);
}

export function trustPageDescription(locale: Locale, slug: TrustPageSlug) {
  const descriptions: Record<TrustPageSlug, string> = {
    about: t(
      locale,
      "lunyu.ai 的使命、边界与编辑身份：以句子为单位发布可核验的《论语》双语内容。",
      "The mission, boundaries, and editorial identity of lunyu.ai: verifiable bilingual Analects content, passage by passage."
    ),
    method: t(
      locale,
      "lunyu.ai 的编辑方法：原文、白话导读、英译、索引与本地启发分层呈现。",
      "The lunyu.ai editorial method: source text, guide, translation, index, and local reflection kept in separate layers."
    ),
    sources: t(
      locale,
      "lunyu.ai 使用的《论语》底本、James Legge 公版英译、白话导读参考和许可边界。",
      "Source editions, James Legge public-domain translation, modern Chinese guide base, and license boundaries for lunyu.ai."
    ),
    faq: t(
      locale,
      "关于 lunyu.ai 内容来源、AI 边界、引用方式、拼音与音频状态和更正机制的常见问题。",
      "Frequently asked questions about lunyu.ai sources, AI boundaries, citation, pinyin and audio status, and corrections."
    ),
  };
  return descriptions[slug];
}

export function trustSections(locale: Locale, slug: TrustPageSlug): TrustSection[] {
  const listenCoverage = getListenCoverage();

  if (slug === "about") {
    return [
      {
        heading: t(locale, "使命", "Mission"),
        body: [
          t(
            locale,
            "lunyu.ai 以《论语》句子为最小阅读单位，提供简体原文、审校白话导读、James Legge 公版英译、注释、索引和听读入口。",
            "lunyu.ai uses each Analects passage as the smallest reading unit, presenting simplified Chinese source text, a reviewed modern Chinese guide, James Legge's public-domain English translation, notes, indexes, and listening entry points."
          ),
          t(
            locale,
            "目标不是制造新的权威定本，而是把来源、解释和现代启发分层，让读者和搜索/AI 系统都能核验。",
            "The goal is not to create a new authoritative edition, but to keep source, explanation, and modern reflection separated so readers and search/AI systems can verify them."
          ),
        ],
      },
      {
        heading: t(locale, "编辑身份", "Editorial identity"),
        body: [
          t(
            locale,
            "本站以 lunyu.ai 项目编辑工作流发布内容，不以个人学术权威背书。每次内容变更应保留来源、批次、检查和更正记录。",
            "The site publishes through the lunyu.ai editorial workflow, not through a claim of personal scholarly authority. Each content change should preserve source, batch, check, and correction records."
          ),
          t(
            locale,
            `当前覆盖：白话导读 ${contentCoverage.modernChinesePassages}/${contentCoverage.totalPassages}，英译 ${contentCoverage.englishPassages}/${contentCoverage.totalPassages}，逐句拼音 ${contentCoverage.pinyinPassages}/${contentCoverage.totalPassages}。`,
            `Current coverage: modern Chinese guide ${contentCoverage.modernChinesePassages}/${contentCoverage.totalPassages}, English translation ${contentCoverage.englishPassages}/${contentCoverage.totalPassages}, passage-level pinyin ${contentCoverage.pinyinPassages}/${contentCoverage.totalPassages}.`
          ),
        ],
      },
    ];
  }

  if (slug === "method") {
    return [
      {
        heading: t(locale, "分层原则", "Layering principle"),
        body: [
          t(
            locale,
            "每个句子页明确分开原文、白话导读、James Legge 英译、注释、相关索引与本地启发。AI 或规则生成内容不得混入原文或译文。",
            "Each passage page separates source text, modern Chinese guide, James Legge translation, notes, related indexes, and local reflection. AI or rule-generated content must never be mixed into the source text or translations."
          ),
          t(
            locale,
            `听读页已上线部分真人女声音频；当前 ${listenCoverage.availableChapters}/${listenCoverage.totalChapters} 章可播放，未录章节会被明确标注，不导向 404。逐句拼音已全量展示。`,
            `The listening page now includes partial recorded audio coverage; ${listenCoverage.availableChapters}/${listenCoverage.totalChapters} chapters are playable, unrecorded chapters are labeled instead of leading to 404s, and passage-level pinyin is fully rendered.`
          ),
        ],
      },
      {
        heading: t(locale, "更正机制", "Corrections"),
        body: [
          t(
            locale,
            "发现错字、截断、误配译文或解释偏差时，优先回到公版底本与站内数据核对；不凭记忆臆补经典文本。",
            "When a typo, truncation, translation mismatch, or interpretive error is found, the workflow returns to public-domain sources and site data; classic text is not filled from memory."
          ),
          t(
            locale,
            `更正入口：请引用具体 URL、篇章号和问题描述。当前公开更正页为 ${correctionUrl(locale)}。`,
            `Correction path: cite the exact URL, passage number, and issue. The public correction page is ${correctionUrl(locale)}.`
          ),
        ],
      },
    ];
  }

  if (slug === "sources") {
    return [
      {
        heading: t(locale, "底本", "Sources"),
        body: [
          t(
            locale,
            `简体原文依据 Wikisource 整理的 James Legge《The Chinese Classics》公版中英文本并转为简体。来源：${sourceUrls.wikisource}`,
            `The simplified Chinese source text is based on the Wikisource transcription of James Legge's public-domain Chinese-English text in The Chinese Classics and converted to simplified Chinese. Source: ${sourceUrls.wikisource}`
          ),
          t(
            locale,
            `英文使用 James Legge 公版英译。Gutenberg 入口：${sourceUrls.jamesLegge}`,
            `English uses James Legge's public-domain translation. Gutenberg entry: ${sourceUrls.jamesLegge}`
          ),
          t(
            locale,
            `白话导读参考 1948 上海广益书局《白话论语读本》，并以站内编辑工作流独立整理审校。参考文件：${sourceUrls.modernChineseBase}`,
            `The modern Chinese guide references the 1948 Guangyi Shuju edition of Baihua Lunyu Duben and is independently organized and reviewed through the site workflow. Reference file: ${sourceUrls.modernChineseBase}`
          ),
        ],
      },
      {
        heading: t(locale, "许可边界", "License boundaries"),
        body: [licenseText, t(locale, "引用本站内容时，请保留具体句子 URL，并区分原文、白话导读、英译和本地启发。", "When citing this site, preserve the exact passage URL and distinguish source text, modern Chinese guide, English translation, and local reflection.")],
      },
    ];
  }

  return [
    {
      heading: t(locale, "常见问题", "Frequently asked questions"),
      body: [
        t(
          locale,
          "下面的问题覆盖来源、AI 边界、引用方式、拼音状态和更正机制。",
          "The questions below cover sources, AI boundaries, citation, pinyin status, and corrections."
        ),
      ],
    },
  ];
}

export function faqItems(locale: Locale): FaqItem[] {
  const listenCoverage = getListenCoverage();

  return [
    {
      question: t(locale, "lunyu.ai 的《论语》原文来自哪里？", "Where does the lunyu.ai Analects source text come from?"),
      answer: t(
        locale,
        "原文依据 Wikisource 整理的 James Legge《The Chinese Classics》公版中英文本，站内转为简体并与英译逐句对应。",
        "The source text is based on the Wikisource transcription of James Legge's public-domain Chinese-English text in The Chinese Classics, converted to simplified Chinese and aligned passage by passage with the English translation."
      ),
    },
    {
      question: t(locale, "白话导读是 AI 直接生成的吗？", "Is the modern Chinese guide directly generated by AI?"),
      answer: t(
        locale,
        "白话导读以 1948《白话论语读本》传统为参考，并通过站内编辑工作流整理审校；不会把本地启发或 AI 输出伪装成原文解释。",
        "The modern Chinese guide references the 1948 Baihua Lunyu Duben tradition and is organized and reviewed through the site workflow; local reflection or AI output is not presented as source interpretation."
      ),
    },
    {
      question: t(locale, "当前 AI 问答是否调用模型？", "Does the current AI chat call a model?"),
      answer: t(
        locale,
        "不调用。当前为 token-free 静态 RAG/规则启发模式，只使用站内句子、白话导读和固定规则，并保持原文、解释、现代启发分层。",
        "No. The current mode is token-free static RAG/rule reflection, using only site passages, guides, and fixed rules while keeping source, explanation, and modern reflection separated."
      ),
    },
    {
      question: t(
        locale,
        "逐句拼音是否全量可见？",
        "Is passage-level pinyin visible sitewide?"
      ),
      answer: t(
        locale,
        "是，逐句拼音已全量展示为 499/499；页面会默认给出拼音，但原文、导读和译文仍保持分层。",
        "Yes, passage-level pinyin is fully rendered at 499/499; pages show pinyin by default, while source text, guide text, and translations remain layered."
      ),
    },
    {
      question: t(locale, "为什么有些听读章节没有音频？", "Why are some listening chapters unavailable?"),
      answer: t(
        locale,
        `当前录音覆盖 ${listenCoverage.availableChapters}/${listenCoverage.totalChapters} 章；未录章节会在列表中禁用，避免误点到 404。`,
        `Recorded audio currently covers ${listenCoverage.availableChapters}/${listenCoverage.totalChapters} chapters; unavailable rows are disabled to avoid 404s.`
      ),
    },
    {
      question: t(locale, "应该如何引用？", "How should I cite lunyu.ai?"),
      answer: t(
        locale,
        "请引用具体句子 URL，并说明引用层：原文、白话导读、James Legge 英译或本地启发。不要只引用首页。",
        "Cite the exact passage URL and state the layer cited: source text, modern Chinese guide, James Legge translation, or local reflection. Do not cite only the homepage."
      ),
    },
  ];
}

export function trustJsonLd(locale: Locale, slug: TrustPageSlug) {
  const url = localizedUrl(locale, `/${slug}`);
  const page = {
    "@type": slug === "faq" ? "FAQPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: trustPageTitle(locale, slug),
    description: trustPageDescription(locale, slug),
    inLanguage: locale,
    dateModified: contentModifiedDate,
    publisher: { "@id": organizationId },
    isPartOf: { "@id": `${localizedUrl(locale, "")}#website` },
    ...(slug === "faq"
      ? {
          mainEntity: faqItems(locale).map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      page,
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: localizedUrl(locale, ""),
        sameAs,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteName, item: localizedUrl(locale, "") },
          { "@type": "ListItem", position: 2, name: trustPageLabel(locale, slug), item: url },
        ],
      },
    ],
  };
}
