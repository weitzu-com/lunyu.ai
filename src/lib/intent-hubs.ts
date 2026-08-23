import type { Locale } from "@/lib/analects";
import { sourceUrls } from "@/lib/site";

export const intentHubSlugs = [
  "lunyu",
  "the-analects",
  "analects-of-confucius",
  "confucius-quotes",
] as const;

export type IntentHubSlug = (typeof intentHubSlugs)[number];

type LocalizedText = {
  zh: string;
  en: string;
};

export type HubCitationId =
  | "wikisource"
  | "gutenberg"
  | "ctext"
  | "stanford"
  | "modernChinese";

export type HubSection = {
  heading: LocalizedText;
  paragraphs: LocalizedText[];
  citationIds: HubCitationId[];
};

export type HubPassage = {
  sentenceId: string;
  note: LocalizedText;
};

export type HubFaq = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type HubRelatedLink = {
  path: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type IntentHub = {
  slug: IntentHubSlug;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  eyebrow: LocalizedText;
  title: LocalizedText;
  deck: LocalizedText;
  directHeading: LocalizedText;
  directAnswer: LocalizedText[];
  directCitationIds: HubCitationId[];
  distinctionsHeading: LocalizedText;
  distinctions: Array<{
    title: LocalizedText;
    body: LocalizedText;
  }>;
  sections: HubSection[];
  passagesHeading: LocalizedText;
  passagesIntro: LocalizedText;
  passages: HubPassage[];
  translationHeading: LocalizedText;
  translationIntro: LocalizedText;
  translationLayers: Array<{
    label: LocalizedText;
    body: LocalizedText;
  }>;
  faqHeading: LocalizedText;
  faqs: HubFaq[];
  sourceIds: HubCitationId[];
  relatedLinks: HubRelatedLink[];
};

export const hubPublishedDate = "2026-08-23";
export const hubModifiedDate = "2026-08-23";

export const hubCitations: Record<
  HubCitationId,
  { title: string; url: string; note: LocalizedText }
> = {
  wikisource: {
    title: "The Chinese Classics, Volume 1: Confucian Analects — Wikisource",
    url: sourceUrls.wikisource,
    note: {
      zh: "James Legge 1893 年版的扫描校验入口，列出今本二十篇，并标注原文与英译的公版状态。",
      en: "A scan-backed route into James Legge's 1893 edition, listing the received twenty books and the public-domain status of text and translation.",
    },
  },
  gutenberg: {
    title: "The Analects of Confucius (from the Chinese Classics) — Project Gutenberg",
    url: sourceUrls.jamesLegge,
    note: {
      zh: "Project Gutenberg 电子书 3330；页面登记译者为 James Legge，并提供可下载的公版英文文本。",
      en: "Project Gutenberg eBook 3330 identifies James Legge as translator and provides the public-domain English text in reusable formats.",
    },
  },
  ctext: {
    title: "《論語》 / The Analects — Chinese Text Project",
    url: sourceUrls.chineseTextProject,
    note: {
      zh: "中国哲学书电子化计划的开放数字文本，提供二十篇目录、原文检索、底本说明与异名。",
      en: "The Chinese Text Project's open digital text, with the twenty-book table of contents, searchable source text, base-text notes, and alternate titles.",
    },
  },
  stanford: {
    title: "Confucius — Stanford Encyclopedia of Philosophy",
    url: sourceUrls.stanfordConfucius,
    note: {
      zh: "用于说明今本二十篇、传统的弟子编纂说，以及现代学界对成书层次和可靠性的审慎讨论。",
      en: "Used for the received twenty-chapter text, the traditional disciple-compilation account, and modern caution about textual layers and authority.",
    },
  },
  modernChinese: {
    title: "《白話論語讀本》1948 年新三版 — Wikimedia Commons",
    url: sourceUrls.modernChineseBase,
    note: {
      zh: "本站白话导读的公版参考底本；导读由站内编辑流程独立整理审校，不直接冒充古文原意。",
      en: "The public-domain reference used for the site's independently organized and reviewed modern-Chinese guide, kept separate from the source text.",
    },
  },
};

const sharedRelatedLinks: HubRelatedLink[] = [
  {
    path: "/analects",
    title: { zh: "《论语》二十篇目录", en: "The twenty-book catalogue" },
    description: {
      zh: "进入全部 499 章；这里是目录，不是意图说明页。",
      en: "Browse all 499 passages; this is the catalogue rather than another intent guide.",
    },
  },
  {
    path: "/sources",
    title: { zh: "底本与许可", en: "Sources and license" },
    description: {
      zh: "核对原文、Legge 英译与白话导读参考底本。",
      en: "Verify the source text, Legge translation, and modern-Chinese reference edition.",
    },
  },
  {
    path: "/blogs/how-to-read-the-analects",
    title: { zh: "如何开始读《论语》", en: "How to start reading The Analects" },
    description: {
      zh: "从一句话、一个语境和一个可实践的问题开始。",
      en: "Begin with one passage, one context, and one question that can be practiced.",
    },
  },
];

export const intentHubs: Record<IntentHubSlug, IntentHub> = {
  lunyu: {
    slug: "lunyu",
    metaTitle: {
      zh: "《论语》原文、英译与阅读指南",
      en: "《论语》 (Lunyu): Chinese Text & Translation",
    },
    metaDescription: {
      zh: "读《论语》简体原文、审校白话导读与 James Legge 公版英译；先理解书名、底本和二十篇结构，再进入六则精选章句及可引用的逐句页面。",
      en: "Read Lunyu in Chinese and English with a direct overview, source and translation notes, six selected passages, exact citations, and guided next steps.",
    },
    eyebrow: { zh: "中文检索意图 · 书名、原文与阅读入口", en: "Chinese-title intent · text, context, and reading path" },
    title: { zh: "《论语》：先读原文，再理解译文与语境", en: "《论语》 (Lunyu): read the text before reducing it to slogans" },
    deck: {
      zh: "这不是另一个二十篇目录，而是一张面向“《论语》是什么、从哪里读、怎样核对”的双语路线图。页面把原文、白话导读、James Legge 英译与编辑说明分层，并把每个例子送回具体章句。",
      en: "This is not a second twenty-book catalogue. It is a bilingual route for readers asking what 《论语》 is, where to read it, and how to verify it. Source text, modern guide, Legge translation, and editorial explanation remain separate, and every example returns to a passage URL.",
    },
    directHeading: { zh: "《论语》是什么？", en: "What is 《论语》 (Lunyu)?" },
    directAnswer: [
      {
        zh: "《论语》是以孔子及其弟子言行、问答和回忆为核心的章句汇集。今本分二十篇；它不是孔子亲笔写成的连续论著，也不应被当作脱离说话对象与处境的名言清单。",
        en: "Lunyu, usually titled The Analects in English, is a collection of sayings, dialogues, and recollections centered on Confucius and his circle. The received text has twenty books; it is neither a continuous treatise written by Confucius nor a context-free list of maxims.",
      },
      {
        zh: "在 lunyu.ai，每则章句都有稳定链接，同时显示简体原文、逐句拼音、审校白话导读与 James Legge 公版英译。读者可以先核对“说了什么”，再讨论“今天怎样理解”。",
        en: "On lunyu.ai, each passage has a stable URL with simplified Chinese, passage-level pinyin, a reviewed modern-Chinese guide, and James Legge's public-domain translation. That lets readers verify what the received text says before asking what it might mean now.",
      },
    ],
    directCitationIds: ["ctext", "stanford"],
    distinctionsHeading: { zh: "先分清三个层次", en: "Keep three layers distinct" },
    distinctions: [
      {
        title: { zh: "原文不是导读", en: "Source is not commentary" },
        body: {
          zh: "古文层只呈现可追溯的章句；白话导读另列，避免把解释改写成“孔子原话”。",
          en: "The classical text is presented as a traceable passage. The modern guide sits beside it, never rewritten as the words of Confucius.",
        },
      },
      {
        title: { zh: "英译不是原文", en: "Translation is an interpretation" },
        body: {
          zh: "Legge 的译文有历史价值，也带有十九世纪措辞；关键术语仍应回看中文与语境。",
          en: "Legge's translation is historically important but uses nineteenth-century diction; key terms still need the Chinese text and local context.",
        },
      },
      {
        title: { zh: "章句不是海报文案", en: "A passage is not poster copy" },
        body: {
          zh: "“三人行”“己所不欲”等短句属于更长的对话；引用时应保留篇章号和完整链接。",
          en: "Familiar lines such as “When I walk along with two others” belong to larger passages; a responsible citation keeps the reference and full link.",
        },
      },
    ],
    sections: [
      {
        heading: { zh: "书名和二十篇结构告诉我们什么", en: "What the title and twenty-book structure tell us" },
        paragraphs: [
          {
            zh: "“论语”常被理解为经过编次的言语或对话记录，英文 Analects 则强调“选集、辑录”。这两个名称都提醒读者：全书由短章构成，人物、问题与语气不断变化，不能假定每一章都在给同一个抽象概念下定义。",
            en: "The title Lunyu is commonly connected with arranged or selected speech, while “Analects” signals a gathered selection. Both names remind us that the work is built from short units whose speakers, questions, and tones change; not every passage is defining the same abstract system.",
          },
          {
            zh: "今本二十篇是可靠的阅读坐标，但篇名多取篇首文字，并不等同于现代教科书的主题章节。要找“仁”“学”或“君子”，应跨篇阅读，再回到每一则的问答对象。",
            en: "The received twenty books provide a stable reading coordinate, but most book titles derive from opening words rather than modern thematic chapter headings. To study ren, learning, or the junzi, read across books and then return to each conversation partner.",
          },
        ],
        citationIds: ["ctext", "stanford"],
      },
      {
        heading: { zh: "怎样使用本站的双语文本", en: "How to use this bilingual edition" },
        paragraphs: [
          {
            zh: "先朗读或默读中文原文，标记不确定的词；再看白话导读确认句法和情境；最后对照 Legge 英译，观察他如何处理“仁”“礼”“君子”等不能一词定译的概念。英文可以帮助比较，却不替代中文。",
            en: "First read the Chinese and mark uncertain terms. Then use the modern-Chinese guide for syntax and situation. Finally compare Legge's choices for terms such as ren, li, and junzi, none of which has a single adequate English equivalent. English supports comparison; it does not replace the Chinese.",
          },
          {
            zh: "本站沿用公版中英底本，并把现代中文说明作为独立编辑层。这样的分层不会消除版本差异，却能让读者看见差异发生在哪里，也能在引用时准确说明自己引用的是原文、译文还是导读。",
            en: "The site follows public-domain Chinese-English base texts and treats modern-Chinese explanation as a separate editorial layer. This does not erase textual or translational differences; it makes those differences visible and lets a citation name the layer actually used.",
          },
        ],
        citationIds: ["wikisource", "gutenberg", "modernChinese"],
      },
      {
        heading: { zh: "从章句而不是结论开始", en: "Begin with passages, not a verdict" },
        paragraphs: [
          {
            zh: "《论语》最适合反复、小步阅读：一天一则，先问说话者在回答谁、纠正什么，再问这则话与自己的处境是否相似。这样既避免把古文神秘化，也避免把它压缩成万能处世术。",
            en: "Lunyu rewards repeated, small-scale reading: take one passage, identify who is answering whom and what is being corrected, then ask whether the situation resembles your own. This avoids both mystifying the text and flattening it into universal life hacks.",
          },
          {
            zh: "下面六则从学习、求知、自省、择善与恕道切入。它们不是“六句概括全书”，而是六个能够继续进入二十篇的门口。",
            en: "The six passages below open into learning, intellectual honesty, self-examination, learning from others, and reciprocity. They are not six lines that summarize the book; they are six doors into the twenty books.",
          },
        ],
        citationIds: ["stanford"],
      },
    ],
    passagesHeading: { zh: "六则适合作为入口的《论语》章句", en: "Six passages that make responsible starting points" },
    passagesIntro: {
      zh: "每张卡片直接使用站内已有章句和 Legge 英译；链接进入包含拼音、白话导读、注释与来源说明的完整页面。",
      en: "Each card uses an existing site passage and Legge translation. The link opens the full page with pinyin, modern-Chinese guide, notes, and source statement.",
    },
    passages: [
      { sentenceId: "xue-er-001", note: { zh: "学习、复习、交友与不愠被放在同一章，适合作为全书的阅读起点。", en: "Learning, practice, friendship, and composure share one opening passage, making it a natural entry." } },
      { sentenceId: "wei-zheng-011", note: { zh: "“温故”与“知新”不是二选一，而是使旧知识持续生长。", en: "Cherishing the old and acquiring the new are one movement rather than rival methods." } },
      { sentenceId: "wei-zheng-017", note: { zh: "把承认“不知道”纳入知识本身，直接回应求知中的诚实。", en: "The passage makes admitting what one does not know part of knowledge itself." } },
      { sentenceId: "li-ren-017", note: { zh: "见贤与见不贤都转化为对自己的要求，而不是只评价别人。", en: "Both good and bad examples become occasions for self-cultivation rather than mere judgment." } },
      { sentenceId: "shu-er-021", note: { zh: "“三人行”完整章句同时包含从善与改过，不能只截取前半句。", en: "The full “walking with two others” passage joins imitation of good qualities to correction of one's own faults." } },
      { sentenceId: "wei-ling-gong-023", note: { zh: "“己所不欲”在此回答“一言而终身行之”，关键词是“恕”。", en: "Here reciprocity answers a question about one word that can guide a whole life." } },
    ],
    translationHeading: { zh: "本站的文本与翻译层", en: "Text and translation layers on lunyu.ai" },
    translationIntro: {
      zh: "同一页面并列四个层次，但不把它们混成一段“权威译文”。",
      en: "Four layers appear together without being blended into a single supposedly authoritative paraphrase.",
    },
    translationLayers: [
      { label: { zh: "简体原文", en: "Simplified source text" }, body: { zh: "依据公版 Legge 中英底本整理并简体化，保留章句坐标。", en: "Organized from the public-domain Legge Chinese-English base and converted to simplified Chinese, with passage coordinates preserved." } },
      { label: { zh: "拼音", en: "Pinyin" }, body: { zh: "用于朗读辅助，不承担训诂或断句证明。", en: "A reading aid, not evidence for philology or punctuation decisions." } },
      { label: { zh: "白话导读", en: "Modern-Chinese guide" }, body: { zh: "参考 1948 公版读本并独立审校，明确属于解释层。", en: "Independently reviewed with reference to a 1948 public-domain reader and explicitly labeled as explanation." } },
      { label: { zh: "Legge 英译", en: "Legge translation" }, body: { zh: "使用公版历史译文，保留其时代措辞，并提示读者回看中文关键词。", en: "The public-domain historical translation is preserved with its period diction, while readers are directed back to key Chinese terms." } },
    ],
    faqHeading: { zh: "关于《论语》原文与阅读的常见问题", en: "Questions about reading Lunyu" },
    faqs: [
      { question: { zh: "《论语》是谁写的？", en: "Did Confucius write Lunyu?" }, answer: { zh: "不宜把《论语》说成孔子亲笔著作。传统说法认为弟子及再传弟子记录、编次相关言行；现代研究则对不同篇章的年代、层次和可靠性保持讨论。", en: "It should not be described as a book handwritten by Confucius. Tradition attributes records and compilation to disciples and later followers, while modern scholarship continues to debate the dates, layers, and authority of particular materials." } },
      { question: { zh: "《论语》有多少篇、多少章？", en: "How many books and passages are in this edition?" }, answer: { zh: "今本分二十篇。lunyu.ai 依站内分章方式发布 499 章，每章都有中英文稳定 URL；不同版本在细分章次时可能出现计数差异。", en: "The received text has twenty books. Lunyu.ai publishes 499 passages under its passage division, each with stable Chinese and English URLs; other editions may count subdivisions differently." } },
      { question: { zh: "为什么英文使用 James Legge 译本？", en: "Why does the site use James Legge?" }, answer: { zh: "该译本与配套中文底本可公开核验并处于公版，适合逐句建立可复用链接。它不是唯一或最终译法，十九世纪措辞和术语选择也需要结合中文审读。", en: "The translation and paired Chinese base are publicly verifiable and in the public domain, which supports stable passage-level reuse. It is not the only or final translation, and its nineteenth-century diction still requires comparison with the Chinese." } },
      { question: { zh: "怎样引用本站的一则《论语》？", en: "How should I cite a passage from lunyu.ai?" }, answer: { zh: "保留篇章号与具体句子 URL，并注明所引层次，例如“《论语》15.23，原文”或“James Legge 英译”。如果引用白话导读，也应明确它是本站编辑说明。", en: "Keep the book-passage reference and exact sentence URL, then name the layer—for example, “Analects 15.23, source text” or “James Legge translation.” If you use the modern-Chinese guide, identify it as site editorial explanation." } },
    ],
    sourceIds: ["wikisource", "gutenberg", "ctext", "stanford", "modernChinese"],
    relatedLinks: sharedRelatedLinks,
  },
  "the-analects": {
    slug: "the-analects",
    metaTitle: {
      zh: "The Analects《论语》：全书、主题与章句",
      en: "The Analects: Text, Context & Passages",
    },
    metaDescription: {
      zh: "直接了解 The Analects 是什么、二十篇怎样构成、为何不能当作线性论著；阅读六则双语章句，核对 James Legge 译文、来源与引用链接。",
      en: "Understand what The Analects is, how its twenty books work, and why context matters. Read six bilingual passages with source and translation citations.",
    },
    eyebrow: { zh: "英文书名检索意图 · 定义、结构与读法", en: "English-title intent · definition, structure, and reading method" },
    title: { zh: "The Analects《论语》：二十篇对话，不是一套速成格言", en: "The Analects: twenty books of situated speech, not a shortcut quote list" },
    deck: {
      zh: "本页回答英文检索 The Analects 最常见的三个问题：它是什么、全书怎样组织、从哪里读。它只选六则说明不同文体与主题，完整目录仍由二十篇目录承担。",
      en: "This page answers the three questions behind most searches for The Analects: what it is, how it is organized, and where to begin. Six passages demonstrate its range; the existing twenty-book catalogue remains the place to browse the complete text.",
    },
    directHeading: { zh: "The Analects 是什么？", en: "What is The Analects?" },
    directAnswer: [
      {
        zh: "The Analects 是《论语》最通行的英文书名。今本二十篇汇集孔子、弟子与相关人物的短章、问答和回忆，讨论学习、德性、礼、政治、友谊与自我修养。",
        en: "The Analects is the conventional English title of 《论语》 (Lunyu), a received twenty-book collection of short sayings, dialogues, and recollections centered on Confucius, his disciples, and their world. It addresses learning, virtue, ritual, government, friendship, and self-cultivation through situated exchanges.",
      },
      {
        zh: "“Analects”可理解为选辑或辑录。这个书名很贴切：全书没有一条线性论证，也没有把所有概念统一定义；同一问题会因提问者和处境不同而得到不同角度的回答。",
        en: "“Analects” means a selected or gathered collection. The title fits: the work does not unfold one linear argument or define every term once for all. A question may receive different answers because the interlocutor and situation differ.",
      },
    ],
    directCitationIds: ["ctext", "stanford"],
    distinctionsHeading: { zh: "这张入口页做什么、不做什么", en: "What this guide does—and does not do" },
    distinctions: [
      { title: { zh: "定义全书", en: "Defines the work" }, body: { zh: "说明书名、体例、核心问题与成书边界。", en: "Explains the title, form, central questions, and limits of authorship claims." } },
      { title: { zh: "展示范围", en: "Shows its range" }, body: { zh: "六则横跨学习、判断、道、人格、志向与和而不同。", en: "Six passages span learning, judgment, the Way, character, resolve, and harmony without conformity." } },
      { title: { zh: "不重做目录", en: "Does not duplicate the catalogue" }, body: { zh: "需要逐篇浏览时，直接进入已有二十篇 499 章目录。", en: "Readers who want sequential browsing go directly to the existing twenty-book, 499-passage catalogue." } },
    ],
    sections: [
      {
        heading: { zh: "二十篇为什么不是二十个现代主题章", en: "Why the twenty books are not modern topic chapters" },
        paragraphs: [
          { zh: "《学而》《为政》《八佾》等篇名通常来自篇首字词。篇内可以出现多个议题，同一议题也会散布全书。二十篇首先是传本结构和引用坐标，而不是作者预先设计的课程大纲。", en: "Names such as Xue Er, Wei Zheng, and Ba Yi generally come from words near the opening. A book can range across subjects, and one subject can recur across the collection. The twenty books are first a transmitted structure and citation system, not a modern syllabus designed in advance." },
          { zh: "因此，完整阅读有两条互补路线：顺读二十篇可以感受章句的排列与回声；按人物、概念或问题跨篇阅读，则能比较不同回答。两条路线都必须保留具体篇章号。", en: "Two reading paths therefore complement each other. Reading the twenty books in order reveals sequence and echo; following a person, concept, or question across books enables comparison. Both routes should preserve exact book-passage references." },
        ],
        citationIds: ["wikisource", "ctext"],
      },
      {
        heading: { zh: "为什么语境比“最佳名言”更重要", en: "Why context matters more than a “best quotes” list" },
        paragraphs: [
          { zh: "《论语》大量内容以问答出现：颜渊、子贡、樊迟或国君提出问题，回答可能针对他们的性格、职责或具体困境。只保留结论，往往会丢掉孔子正在纠正什么。", en: "Much of the work is dialogical: Yan Yuan, Zi Gong, Fan Chi, or a ruler asks a question, and the answer may address that person's character, office, or immediate difficulty. Keeping only the conclusion often removes what the reply was trying to correct." },
          { zh: "这并不意味着章句不能用于今天，而是要求多一步：先还原文本内的关系，再说明自己的现代应用属于解释。这样，古典文本不会被误当成对每个情境都自动生效的口号。", en: "This does not make the passages irrelevant today. It asks for one extra step: recover the relationship inside the text, then label a modern application as interpretation. The classical passage is not treated as a slogan that automatically resolves every situation." },
        ],
        citationIds: ["stanford"],
      },
      {
        heading: { zh: "英文译本应该怎样比较", en: "How an English translation should be compared" },
        paragraphs: [
          { zh: "James Legge 的译本是重要的历史英文入口，优势是公版、完整、可与配套中文底本核对；局限是维多利亚时代措辞和部分术语选择会让当代读者产生距离。", en: "James Legge provides an important historical English gateway. Its strengths are completeness, public-domain availability, and alignment with a verifiable Chinese base. Its limitation is that Victorian diction and some term choices can distance a contemporary reader." },
          { zh: "比较译文时，不只问哪一句“更顺”，还要看译者怎样处理 ren、li、junzi、dao 等词，是否保留说话者、问答形式和不确定性。本页保留 Legge 原译，同时把中文放在同一卡片中。", en: "When comparing translations, ask more than which sentence sounds smoother. Examine how ren, li, junzi, and dao are handled, and whether speaker, dialogue, and ambiguity survive. This page keeps Legge's wording while placing the Chinese on the same card." },
        ],
        citationIds: ["wikisource", "gutenberg"],
      },
    ],
    passagesHeading: { zh: "六则显示 The Analects 的内容跨度", en: "Six passages that show the range of The Analects" },
    passagesIntro: { zh: "这些章句不是排行榜；每一则代表一种阅读问题，并链接到站内完整文本。", en: "This is not a ranking. Each passage represents a different reading problem and links to the complete site entry." },
    passages: [
      { sentenceId: "xue-er-003", note: { zh: "极短判断也有明确对象：外表与言辞不能替代仁。", en: "Even an extremely short saying has a target: polished speech and appearance are not virtue." } },
      { sentenceId: "wei-zheng-015", note: { zh: "学习与思考互相校正，显示《论语》常用对举压缩论点。", en: "Learning and thought correct each other, showing the work's compressed use of paired contrasts." } },
      { sentenceId: "li-ren-008", note: { zh: "“朝闻道”把价值优先次序推到极端，需要结合“道”的语义而非励志化。", en: "“Hearing the Way in the morning” dramatizes a hierarchy of value and should not be reduced to motivation copy." } },
      { sentenceId: "yong-ye-016", note: { zh: "“文质彬彬”以平衡描述君子，既反对粗野也反对只有文饰。", en: "The balance of native substance and acquired refinement defines the exemplary person without choosing mere polish." } },
      { sentenceId: "zi-han-025", note: { zh: "军队可以失去主帅，普通人的志向却不能被夺走。", en: "An army may lose its commander, while even an ordinary person's resolve cannot simply be taken away." } },
      { sentenceId: "zi-lu-023", note: { zh: "“和而不同”区分协调与迎合，是理解关系伦理的重要入口。", en: "Harmony without conformity distinguishes coordination from flattery and opens a relational reading of ethics." } },
    ],
    translationHeading: { zh: "阅读 The Analects 时看到的四种文本", en: "The four textual layers you see here" },
    translationIntro: { zh: "层次并列的目的，是让英文读者能够回到中文证据，而不是制造无缝的现代改写。", en: "The layers are placed together so an English reader can return to Chinese evidence, not so the site can manufacture a seamless modern rewrite." },
    translationLayers: [
      { label: { zh: "Classical Chinese", en: "Classical Chinese" }, body: { zh: "作为核心证据保留，并链接到具体篇章。", en: "Preserved as the core evidence and tied to an exact passage reference." } },
      { label: { zh: "Pinyin", en: "Pinyin" }, body: { zh: "辅助发音和逐字跟读，不替代语义判断。", en: "Supports pronunciation and following the text without replacing semantic judgment." } },
      { label: { zh: "现代中文导读", en: "Modern-Chinese guide" }, body: { zh: "帮助拆解古今汉语距离，并明确标注为编辑层。", en: "Bridges classical and modern Chinese while remaining explicitly editorial." } },
      { label: { zh: "James Legge English", en: "James Legge English" }, body: { zh: "提供公版历史译文和可核验的英文引用层。", en: "Provides a public-domain historical translation and a verifiable English citation layer." } },
    ],
    faqHeading: { zh: "关于 The Analects 的常见问题", en: "Frequently asked questions about The Analects" },
    faqs: [
      { question: { zh: "The Analects 和《论语》是同一本书吗？", en: "Are The Analects and Lunyu the same book?" }, answer: { zh: "是。The Analects 是《论语》最常见的英文书名，Lunyu 是“论语”的普通话拼音。Analects of Confucius 与 Confucian Analects 也常指同一传世文本。", en: "Yes. The Analects is the common English title, and Lunyu is the Mandarin romanization of 论语. “Analects of Confucius” and “Confucian Analects” are also widely used for the same received work." } },
      { question: { zh: "The Analects 是一本哲学论著吗？", en: "Is The Analects a philosophical treatise?" }, answer: { zh: "它当然承载哲学思想，但体例不是连续论证的专著。它由短章、对话、人物评价和行为记述构成，解释时必须考虑说话者与场景。", en: "It carries philosophical thought, but its form is not a continuous argumentative treatise. It consists of short sayings, dialogues, judgments of people, and descriptions of conduct, so interpretation must attend to speakers and scenes." } },
      { question: { zh: "初读应该从第一篇开始吗？", en: "Should a first-time reader start at Book One?" }, answer: { zh: "从《学而》顺读最容易保留全书秩序；也可以先读本页六则，再沿具体主题回到目录。无论哪条路线，都应阅读完整章句而不是只有摘句。", en: "Starting with Xue Er preserves the transmitted order and works well. A reader may also begin with the six passages here and follow a theme back into the catalogue. Either way, read the full passage rather than an isolated excerpt." } },
      { question: { zh: "哪一个英文译本最好？", en: "What is the best English translation of The Analects?" }, answer: { zh: "没有脱离用途的“最好”。公版 Legge 适合核验、历史比较和自由引用；学习关键概念时，应再比较现代学术译本，并始终回看中文原文。", en: "There is no context-free “best.” Public-domain Legge is useful for verification, historical comparison, and reusable quotation. For close study of key concepts, compare modern scholarly translations and keep returning to the Chinese." } },
    ],
    sourceIds: ["wikisource", "gutenberg", "ctext", "stanford"],
    relatedLinks: sharedRelatedLinks,
  },
  "analects-of-confucius": {
    slug: "analects-of-confucius",
    metaTitle: {
      zh: "Analects of Confucius：书名、编者与英译",
      en: "Analects of Confucius: Authorship & Translation",
    },
    metaDescription: {
      zh: "Analects of Confucius 指什么？区分“以孔子为中心”与“孔子亲笔所著”，了解弟子声音、成书讨论、Legge 公版英译及六则双语文本。",
      en: "Learn what Analects of Confucius means, why Confucius is its central voice but not its sole author, and how source history shapes six bilingual passages.",
    },
    eyebrow: { zh: "人物归属检索意图 · 书名、作者与文本层次", en: "Attribution intent · title, authorship, and textual layers" },
    title: { zh: "Analects of Confucius：关于孔子的语录集，不等于孔子亲著", en: "Analects of Confucius: centered on Confucius, not authored by him alone" },
    deck: {
      zh: "这个英文书名很常用，却容易制造一个现代作者错觉。本页直接说明“of Confucius”的合理含义、传统编纂说和现代学术保留，并用孔子、曾子、有子、子夏等不同声音展示文本实际构成。",
      en: "This common English title can create a modern single-author illusion. The page explains what “of Confucius” can responsibly mean, distinguishes traditional compilation accounts from modern caution, and uses voices including Confucius, Youzi, Zengzi, and Zixia to show what the text actually contains.",
    },
    directHeading: { zh: "Analects of Confucius 是什么？", en: "What does “Analects of Confucius” mean?" },
    directAnswer: [
      {
        zh: "Analects of Confucius 通常就是《论语》或 The Analects。这里的“of Confucius”应理解为“以孔子言行与思想传统为中心”，不能据此断言孔子像现代作者那样亲自撰写、定稿了全书。",
        en: "“Analects of Confucius” normally refers to the same work as The Analects or Lunyu. “Of Confucius” responsibly means centered on his sayings, conduct, and teaching tradition; it does not prove that Confucius personally wrote and finalized the book like a modern author.",
      },
      {
        zh: "传统一般把记录和编次归于孔子弟子及再传弟子；现代研究则注意到篇章差异、早期引文和出土材料，因而不把每一句的历史形成过程说成已经完全确定。",
        en: "Traditional accounts attribute recording and compilation to disciples and later followers. Modern research also considers differences among books, early citation patterns, and excavated materials, so the historical formation of every saying should not be presented as fully settled.",
      },
    ],
    directCitationIds: ["stanford", "ctext"],
    distinctionsHeading: { zh: "三个常被混淆的说法", en: "Three claims that should not be conflated" },
    distinctions: [
      { title: { zh: "孔子是核心人物", en: "Confucius is central" }, body: { zh: "大量章句以“子曰”展开，弟子也围绕他的教导提问、回忆和讨论。", en: "Many passages begin “The Master said,” and disciples ask, remember, and debate around his teaching." } },
      { title: { zh: "孔子不是署名作者", en: "He is not a signed author" }, body: { zh: "文本没有提供孔子亲撰并定稿二十篇的证据。", en: "The text does not establish that Confucius wrote and finalized all twenty books." } },
      { title: { zh: "弟子也在说话", en: "Disciples also speak" }, body: { zh: "有子、曾子、子夏等人的话属于今本，说明它是学派记忆而非单人独白。", en: "Sayings by Youzi, Zengzi, Zixia, and others make the received work a school memory rather than a one-person monologue." } },
    ],
    sections: [
      {
        heading: { zh: "传统编纂说与现代审慎可以同时说明", en: "Tradition and modern caution can both be stated" },
        paragraphs: [
          { zh: "传统史料把《论语》描述为孔子弟子分别记录言谈，孔子去世后再由弟子共同辑录；后世又发展出各篇由不同弟子编成等说法。这些说法解释了为何文本既围绕孔子，又保存弟子自己的判断。", en: "Traditional historiography describes disciples recording conversations and jointly arranging them after Confucius's death; later accounts proposed that different disciples shaped different books. These traditions help explain why the work centers on Confucius while preserving judgments in disciples' own voices." },
          { zh: "现代研究关注文本内部差异、书名在早期材料中的出现时间，以及与出土文献平行的言论。稳妥表述不是“传统全错”或“每句皆实录”，而是承认今本代表极重要的孔子传统，同时保留对具体成书层次的开放判断。", en: "Modern study examines internal variation, when the title appears in early sources, and sayings parallel to excavated texts. The responsible conclusion is neither “tradition is entirely false” nor “every line is a transcript,” but that the received text is a crucial Confucius tradition whose individual layers remain open to study." },
        ],
        citationIds: ["stanford"],
      },
      {
        heading: { zh: "为什么全书不只有 Confucius quotes", en: "Why the book contains more than Confucius quotes" },
        paragraphs: [
          { zh: "今本有对话、场景记述、弟子评价和弟子自己的格言。第一篇中，有子谈孝弟与仁之本，曾子谈每日自省；第十九篇保留子夏、子张等人的话。把它统称为“孔子名言”会抹去说话者。", en: "The received text contains dialogues, scene descriptions, judgments by disciples, and disciples' own maxims. In Book One, Youzi speaks about filial and fraternal conduct, and Zengzi about daily self-examination; Book Nineteen preserves sayings by Zixia, Zizhang, and others. Calling all of this “Confucius quotes” erases speakers." },
          { zh: "因此，本页在每张卡片上保留原文开头和篇章号。遇到“曾子曰”或“子夏曰”，英文引用也应署给相应人物，并标明它出自 Analects，而不能换成“Confucius said”。", en: "Each card therefore preserves the Chinese opening and passage number. When the text says “Zengzi said” or “Zixia said,” an English citation should credit that speaker and identify the Analects source, not silently change it to “Confucius said.”" },
        ],
        citationIds: ["wikisource", "ctext"],
      },
      {
        heading: { zh: "Legge 英译中的人名与概念", en: "Names and concepts in Legge's translation" },
        paragraphs: [
          { zh: "Legge 使用十九世纪罗马字写法，如 Tsze-hsia、Tsang 等；现代读者更熟悉 Zixia、Zengzi。站内句子保留公版译文原貌，页面说明则使用更常见的现代拼音，以便核对同一人物。", en: "Legge uses nineteenth-century romanizations such as Tsze-hsia and Tsang, while modern readers more often see Zixia and Zengzi. Passage cards preserve the public-domain translation; site explanation uses familiar pinyin so the same person can be identified across systems." },
          { zh: "类似地，Legge 常把仁译作 perfect virtue 或 benevolence，把君子译作 superior man。它们是译者的历史选择，不是中文词的唯一对应。阅读时应把译词看成索引，再返回原文和具体回答。", en: "Legge may render ren as “perfect virtue” or “benevolence,” and junzi as “superior man.” These are historical translation choices, not the only equivalents. Treat the English term as an index, then return to the Chinese and the particular exchange." },
        ],
        citationIds: ["gutenberg", "wikisource"],
      },
    ],
    passagesHeading: { zh: "六则章句展示谁在说话", en: "Six passages that show who is speaking" },
    passagesIntro: { zh: "这组六则有意并列“子曰”与弟子之言，纠正“全书每句都由孔子说出”的误解。", en: "These passages deliberately place “The Master said” beside disciple speech, correcting the idea that every line was spoken by Confucius." },
    passages: [
      { sentenceId: "xue-er-001", note: { zh: "以“子曰”开篇，是孔子声音居于全书中心的典型。", en: "The opening “The Master said” exemplifies the centrality of Confucius's voice." } },
      { sentenceId: "xue-er-002", note: { zh: "说话者是有子；引用“君子务本”时不应直接署名孔子。", en: "The speaker is Youzi; “the exemplary person attends to the root” should not be directly credited to Confucius." } },
      { sentenceId: "xue-er-004", note: { zh: "“吾日三省吾身”由曾子说出，是最常被错署给孔子的句子之一。", en: "The daily self-examination saying belongs to Zengzi and is often incorrectly reassigned to Confucius." } },
      { sentenceId: "yan-yuan-022", note: { zh: "樊迟问仁、问知，孔子先短答，再因未达而补充，保留了教学过程。", en: "Fan Chi asks about ren and knowledge; the short answers are followed by clarification, preserving a teaching process." } },
      { sentenceId: "wei-ling-gong-023", note: { zh: "子贡提出“一言”问题，孔子以“恕”回应；问题属于答案的一部分。", en: "Zi Gong asks for one lifelong word and Confucius answers with reciprocity; the question is part of the answer." } },
      { sentenceId: "zi-zhang-006", note: { zh: "“博学而笃志，切问而近思”由子夏说出，显示弟子言论也是今本内容。", en: "The saying on broad learning, firm purpose, earnest inquiry, and close reflection is spoken by Zixia." } },
    ],
    translationHeading: { zh: "署名和翻译的引用规则", en: "Rules for attribution and translation citation" },
    translationIntro: { zh: "准确引用需要同时回答：谁说、出自哪一章、引用的是哪一层文本。", en: "An accurate citation answers three questions: who speaks, where the passage appears, and which textual layer is quoted." },
    translationLayers: [
      { label: { zh: "说话者", en: "Speaker" }, body: { zh: "保留“子曰”“有子曰”“曾子曰”“子夏曰”等文本证据。", en: "Preserve textual evidence such as “The Master said,” “Youzi said,” “Zengzi said,” or “Zixia said.”" } },
      { label: { zh: "篇章号", en: "Passage reference" }, body: { zh: "使用今本坐标，如 1.4 或 19.6，并附具体 URL。", en: "Use a received-text coordinate such as 1.4 or 19.6 and include the exact URL." } },
      { label: { zh: "译者", en: "Translator" }, body: { zh: "引用英文时注明 James Legge，不把译文当成孔子直接说的英语。", en: "Name James Legge when quoting English; the translated wording is not English directly spoken by Confucius." } },
      { label: { zh: "解释层", en: "Interpretive layer" }, body: { zh: "现代解释可以使用，但应与古文和历史译文分开署名。", en: "Modern explanation may be used, but it should be credited separately from the classical text and historical translation." } },
    ],
    faqHeading: { zh: "关于 Analects of Confucius 署名的常见问题", en: "Attribution questions about the Analects of Confucius" },
    faqs: [
      { question: { zh: "Confucius 是 The Analects 的作者吗？", en: "Is Confucius the author of The Analects?" }, answer: { zh: "以现代单一作者的意义说，不应这样表述。孔子是全书核心人物和主要声音，但传统把记录、汇编归于弟子群体，现代研究又进一步讨论不同文本层次。", en: "Not in the modern single-author sense. Confucius is the central figure and principal voice, but tradition assigns recording and compilation to groups of disciples, and modern scholarship further debates textual layers." } },
      { question: { zh: "为什么书名仍叫 Analects of Confucius？", en: "Why is it still called Analects of Confucius?" }, answer: { zh: "这个书名清楚指出文本所属的孔子言行和思想传统，便于普通读者识别。只要同时解释编纂背景，它并不必然主张孔子亲笔写作。", en: "The title efficiently identifies the work with the Confucius teaching tradition for general readers. It need not claim personal authorship when the compilation context is stated clearly." } },
      { question: { zh: "《论语》中的话都能署名“孔子说”吗？", en: "Can every Analects saying be introduced as “Confucius said”?" }, answer: { zh: "不能。今本明确保存有子、曾子、子夏、子张等人的话，也有叙事文字。引用前应查看章句开头的说话者。", en: "No. The received text explicitly preserves sayings by Youzi, Zengzi, Zixia, Zizhang, and others, as well as narrative prose. Check the speaker at the start of the passage before attributing it." } },
      { question: { zh: "英文人名为什么和拼音不一样？", en: "Why do names in Legge differ from modern pinyin?" }, answer: { zh: "Legge 使用十九世纪的罗马字体系，所以 Tsze-hsia、Tsang 等分别对应现代常写的 Zixia、Zengzi。差异是转写系统变化，不代表不同人物。", en: "Legge used nineteenth-century romanization systems, so forms such as Tsze-hsia and Tsang correspond to modern Zixia and Zengzi. The difference is transliteration, not a different person." } },
    ],
    sourceIds: ["wikisource", "gutenberg", "ctext", "stanford"],
    relatedLinks: [
      ...sharedRelatedLinks,
      { path: "/index/confucius", title: { zh: "孔子人物索引", en: "Confucius index entry" }, description: { zh: "查看孔子相关章句与人物入口。", en: "Follow passages and index routes connected with Confucius." } },
    ],
  },
  "confucius-quotes": {
    slug: "confucius-quotes",
    metaTitle: {
      zh: "Confucius Quotes：有出处的孔子名言",
      en: "Confucius Quotes with Analects Citations",
    },
    metaDescription: {
      zh: "查找有《论语》篇章号和完整语境的 Confucius quotes；八则中英对照章句链接到原文、拼音、Legge 英译、白话导读及来源说明。",
      en: "Find verified Confucius quotes with Analects references, Chinese text, Legge translation, context notes, and direct links to eight complete bilingual passages.",
    },
    eyebrow: { zh: "名言检索意图 · 真伪、出处与完整语境", en: "Quote intent · authenticity, reference, and full context" },
    title: { zh: "Confucius quotes：先核对《论语》出处，再分享孔子名言", en: "Confucius quotes: verify the Analects passage before sharing the line" },
    deck: {
      zh: "本页不是网络金句汇编。八则都能回到 lunyu.ai 的现有章句页面，并并列中文原文、James Legge 公版英译、篇章号与语境提示；无法在《论语》定位的流行句，不会被补写进来。",
      en: "This is not a collection of internet aphorisms. Every one of the eight selections returns to an existing lunyu.ai passage and presents Chinese source text, James Legge's public-domain translation, the reference, and a context note. Popular lines that cannot be located in the Analects are not invented or silently included.",
    },
    directHeading: { zh: "怎样判断一条 Confucius quote 是否可靠？", en: "How do you verify a Confucius quote?" },
    directAnswer: [
      {
        zh: "一条可核验的孔子名言至少应有三项：具体来源（如《论语》7.21）、完整中文章句、所用英译的译者。只有“Confucius said”而没有篇章号的图片或清单，只能当线索，不能当出处。",
        en: "A verifiable Confucius quote should provide at least three things: an exact source such as Analects 7.21, the complete Chinese passage, and the translator of any English wording. An image or list that says only “Confucius said” is a lead, not a citation.",
      },
      {
        zh: "还要检查说话者。《论语》包含弟子之言；例如“吾日三省吾身”由曾子说，不应仅因出现在《论语》就改署孔子。本页只把文本明确以“子曰”或孔子回答呈现的句子列入核心清单。",
        en: "Check the speaker as well. The Analects includes sayings by disciples; for example, daily self-examination is spoken by Zengzi, not automatically by Confucius. This core list uses passages the received text explicitly presents as “The Master said” or as an answer by Confucius.",
      },
    ],
    directCitationIds: ["wikisource", "stanford"],
    distinctionsHeading: { zh: "可靠名言卡片的三个要素", en: "Three parts of a reliable quote card" },
    distinctions: [
      { title: { zh: "可定位", en: "Locatable" }, body: { zh: "给出今本篇章号和稳定句子链接。", en: "Provides a received-text reference and stable passage URL." } },
      { title: { zh: "不截断", en: "Not misleadingly clipped" }, body: { zh: "保留问题、并列句或后半句，避免改变原意。", en: "Keeps the question, paired clause, or continuation when omission would change the sense." } },
      { title: { zh: "译者可见", en: "Translator visible" }, body: { zh: "英文措辞署 James Legge，不假装孔子直接说英语。", en: "Credits James Legge for English wording rather than pretending Confucius spoke English." } },
    ],
    sections: [
      {
        heading: { zh: "为什么同一句英文会有多个版本", en: "Why one saying appears in many English forms" },
        paragraphs: [
          { zh: "古典汉语高度凝练，ren、li、junzi、shu、dao 等词没有一一对应的英文；不同译者还会选择直译、解释性翻译或更口语的改写。因此，两个英文句子可能都指向同一中文章句，却不能互相冒充逐字原话。", en: "Classical Chinese is compressed, and terms such as ren, li, junzi, shu, and dao lack one-to-one English equivalents. Translators also choose literal, explanatory, or idiomatic approaches. Two English sentences may point to the same Chinese passage without being interchangeable verbatim quotations." },
          { zh: "本页使用 James Legge，是因为他的译文处于公版且与站内底本逐句对应。若分享更现代的译法，应注明相应译者；若自己改写，则标为 paraphrase，而不是放在引号里署名 Confucius。", en: "This page uses James Legge because his public-domain translation aligns passage by passage with the site's base text. If you share a modern translation, name that translator. If you write your own paraphrase, label it as a paraphrase rather than placing it in quotation marks under Confucius's name." },
        ],
        citationIds: ["gutenberg", "wikisource"],
      },
      {
        heading: { zh: "完整语境会怎样改变名言", en: "How full context changes a famous line" },
        paragraphs: [
          { zh: "“己所不欲，勿施于人”在 12.2 中嵌在仲弓问仁的长回答里，在 15.23 中则回应子贡“一言而可以终身行之”的问题。短句相同，问答位置不同；一个强调待人和任事，一个把“恕”提出为终身实践。", en: "“What you do not want done to yourself, do not do to others” appears inside a longer answer to Zhonggong about ren in 12.2, and in 15.23 answers Zi Gong's request for one lifelong word. The line is similar, but one context concerns conduct toward others and public duty, while the other foregrounds shu, reciprocity, as lifelong practice." },
          { zh: "“三人行，必有我师焉”也不能停在“人人都能当老师”。后文明确说：择其善者而从之，见其不善则改自己。学习来自比较、选择与自我修正，而不是无条件模仿。", en: "“When I walk along with two others, they may serve as my teachers” does not end with everyone being a teacher. The continuation says to follow good qualities and correct in oneself what is not good. Learning here requires comparison, selection, and self-revision—not indiscriminate imitation." },
        ],
        citationIds: ["wikisource", "stanford"],
      },
      {
        heading: { zh: "推荐的引用格式", en: "A practical citation format" },
        paragraphs: [
          { zh: "中文可写：“子曰：‘见贤思齐焉，见不贤而内自省也。’《论语·里仁》4.17。”英文可写：“The Master said …” (Analects 4.17, trans. James Legge)，并附句子页链接。", en: "For English, use a form such as: “The Master said …” (Analects 4.17, trans. James Legge), followed by the exact passage URL. For Chinese, preserve 子曰, the complete source sentence, and 《论语·里仁》4.17." },
          { zh: "如果讨论的是站内白话导读或语境说明，则把 lunyu.ai 标为说明来源；不要把这些编辑文字再加引号署给孔子。这样既尊重古典文本，也让读者能够复核。", en: "If you use the site's modern-Chinese guide or context note, credit lunyu.ai for that explanation. Do not put editorial wording in quotation marks under Confucius. This respects the classical text and lets readers verify the path from source to interpretation." },
        ],
        citationIds: ["wikisource", "gutenberg"],
      },
    ],
    passagesHeading: { zh: "八则有《论语》出处的 Confucius quotes", en: "Eight Confucius quotes with Analects references" },
    passagesIntro: { zh: "英文沿用 James Legge 公版译文；点击篇章号可阅读完整原文、拼音、白话导读与注释。", en: "English follows James Legge's public-domain translation. Open the passage reference for the full Chinese, pinyin, modern-Chinese guide, and notes." },
    passages: [
      { sentenceId: "xue-er-001", note: { zh: "不要只摘“有朋自远方来”；本章把学习、朋友与不被理解时的平静连在一起。", en: "Do not isolate the line about distant friends; the passage joins learning, friendship, and composure when unrecognized." } },
      { sentenceId: "wei-zheng-017", note: { zh: "关于知识边界的名言，核心是如实承认知道与不知道。", en: "A saying about epistemic limits: knowledge includes honestly acknowledging both knowing and not knowing." } },
      { sentenceId: "li-ren-017", note: { zh: "见到正反榜样都回到自省，避免只把它理解成外部竞争。", en: "Both worthy and unworthy examples return the reader to self-examination, not external competition alone." } },
      { sentenceId: "shu-er-021", note: { zh: "完整句同时要求学习善者和改正自己，后半句不可省。", en: "The full line requires following good qualities and correcting oneself; the second half is essential." } },
      { sentenceId: "zi-han-025", note: { zh: "“匹夫不可夺志”谈意志不可被外力直接剥夺，并非否认处境压力。", en: "The saying protects the irreducibility of resolve; it does not pretend circumstances exert no pressure." } },
      { sentenceId: "wei-ling-gong-023", note: { zh: "以“恕”统摄终身实践，是“己所不欲”的完整问答出处之一。", en: "Reciprocity frames a lifelong practice and provides one full dialogue source for the famous negative formulation." } },
      { sentenceId: "zi-lu-023", note: { zh: "和谐不要求取消差异；迎合相同也未必产生真正协调。", en: "Harmony need not erase difference, while conformity does not necessarily create genuine accord." } },
      { sentenceId: "wei-ling-gong-020", note: { zh: "“君子求诸己”把道德要求首先放在自己，而不是把所有责任推给他人。", en: "The exemplary person first seeks the demand in oneself rather than shifting every responsibility to others." } },
    ],
    translationHeading: { zh: "名言页面的四道核验", en: "Four checks applied to every quote" },
    translationIntro: { zh: "这四道核验比“看起来像孔子说的”更可靠。", en: "These four checks are stronger than deciding that a line merely sounds Confucian." },
    translationLayers: [
      { label: { zh: "原文核验", en: "Source-text check" }, body: { zh: "在今本《论语》定位完整古文，不凭二手图片回填。", en: "Locate the complete Chinese in the received Analects rather than reconstructing it from a secondary image." } },
      { label: { zh: "说话者核验", en: "Speaker check" }, body: { zh: "区分子曰、弟子曰、叙事者和后世改写。", en: "Distinguish the Master, a disciple, the narrator, and later paraphrase." } },
      { label: { zh: "译文核验", en: "Translation check" }, body: { zh: "保留译者与版本，避免把多个英译拼成一句。", en: "Keep translator and edition visible; do not splice multiple translations into one quote." } },
      { label: { zh: "语境核验", en: "Context check" }, body: { zh: "阅读提问、并列句和后文，确认摘录没有倒置重点。", en: "Read the question, paired clause, and continuation to ensure the excerpt has not reversed the emphasis." } },
    ],
    faqHeading: { zh: "关于 Confucius quotes 真伪的常见问题", en: "Frequently asked questions about Confucius quotes" },
    faqs: [
      { question: { zh: "网上的孔子名言都出自《论语》吗？", en: "Do all online Confucius quotes come from The Analects?" }, answer: { zh: "不是。有些来自其他先秦或汉代文献，有些是现代转述，还有些找不到可靠出处。没有篇章号时，应先把它当待核线索。", en: "No. Some come from other early or Han texts, some are modern paraphrases, and some lack a reliable source. Without a passage reference, treat the line as unverified until located." } },
      { question: { zh: "“己所不欲，勿施于人”出自哪里？", en: "Where does “Do not do to others…” appear?" }, answer: { zh: "今本《论语》12.2 与 15.23 都有这句话。12.2 是仲弓问仁的长回答之一，15.23 则由子贡问“一言”而引出“恕”。引用时可按讨论重点选择并说明。", en: "The formulation appears in received Analects 12.2 and 15.23. In 12.2 it belongs to a longer answer to Zhonggong about ren; in 15.23 it follows Zi Gong's request for one lifelong word and is framed by shu, reciprocity." } },
      { question: { zh: "可以只写“Confucius said”吗？", en: "Is “Confucius said” enough for a citation?" }, answer: { zh: "用于随手分享仍不够可靠。至少补充 Analects 篇章号；引用英文再写译者，最好附完整句子页链接。", en: "Not for a reliable citation. Add the Analects book-passage reference, name the translator for English wording, and preferably include the full passage URL." } },
      { question: { zh: "为什么本站不把英文改得更现代？", en: "Why not silently modernize Legge's English?" }, answer: { zh: "静默改写会失去可核验的译者文本，也容易让编辑措辞冒充历史译文。本站保留 Legge 原译；现代解释另行标注。", en: "Silent modernization would remove a verifiable translator text and risk passing editorial wording off as historical translation. The site preserves Legge and labels modern explanation separately." } },
      { question: { zh: "“吾日三省吾身”是孔子说的吗？", en: "Did Confucius say the line about daily self-examination?" }, answer: { zh: "今本《论语》1.4 明确写“曾子曰”。它属于《论语》，但说话者是曾子；准确引用应写曾子，而不是孔子。", en: "Received Analects 1.4 explicitly begins “Zengzi said.” The saying belongs to the Analects, but its speaker is Zengzi, so an accurate attribution names him rather than Confucius." } },
    ],
    sourceIds: ["wikisource", "gutenberg", "ctext", "stanford"],
    relatedLinks: [
      ...sharedRelatedLinks,
      { path: "/topics/analects-of-confucius", title: { zh: "谁在《论语》中说话？", en: "Who speaks in the Analects?" }, description: { zh: "区分孔子、弟子与编纂传统。", en: "Distinguish Confucius, disciple voices, and the compilation tradition." } },
    ],
  },
};

export function localize(locale: Locale, value: LocalizedText) {
  return locale === "zh-Hans" ? value.zh : value.en;
}

export function isIntentHubSlug(value: string): value is IntentHubSlug {
  return intentHubSlugs.includes(value as IntentHubSlug);
}

export function getIntentHub(slug: string) {
  return isIntentHubSlug(slug) ? intentHubs[slug] : undefined;
}

export function intentHubPath(slug: IntentHubSlug) {
  return `/topics/${slug}`;
}
