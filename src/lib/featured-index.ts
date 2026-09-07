import { books, getSentence, type Locale, t, type Sentence } from "@/lib/analects";
import { getBlogEntity, getSentencesForBlog, type BlogEntity } from "@/lib/blogs";
import { moreFeaturedIndexBySlug } from "@/lib/featured-index-entries";

export type LocalizedText = {
  zh: string;
  en: string;
};

export type FeaturedUse = {
  title: LocalizedText;
  body: LocalizedText;
  sentenceId: string;
};

export type FeaturedConfusion = {
  title: LocalizedText;
  body: LocalizedText;
};

export type FeaturedFaq = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type FeaturedIndexContent = {
  slug: string;
  subtitle: LocalizedText;
  metaDescription: LocalizedText;
  editorialNote: LocalizedText;
  usesHeading: LocalizedText;
  uses: FeaturedUse[];
  confusionsHeading: LocalizedText;
  confusions: FeaturedConfusion[];
  featuredHeading: LocalizedText;
  featuredIntro: LocalizedText;
  featuredSentenceIds: string[];
  viewAllLabel: LocalizedText;
  practiceHeading: LocalizedText;
  practice: LocalizedText;
  practiceSentenceId: string;
  faqHeading: LocalizedText;
  faqs: FeaturedFaq[];
  relatedHeading: LocalizedText;
  relatedSlugs: string[];
  booksHeading: LocalizedText;
};

export function localize(locale: Locale, text: LocalizedText) {
  return t(locale, text.zh, text.en);
}

/** Editorial date for the first featured-index release. */
export const featuredIndexModifiedDate = "2026-08-24";

/** Editorial date for the four source-grounded concept pages added later. */
export const expandedFeaturedIndexModifiedDate = "2026-08-27";

const expandedFeaturedIndexSlugs = new Set(["yi", "xin", "xiao", "zheng"]);

const featuredIndexBySlug: Record<string, FeaturedIndexContent> = {
  ren: {
    slug: "ren",
    subtitle: {
      zh: "仁不是可以佩戴的美名，而是《论语》里被追问、被改口、必须用礼与恕去练习的成人功夫。",
      en: "Ren is not a compliment you can wear. In the Analects it is asked after, answered differently, and practiced through restraint and reciprocity.",
    },
    metaDescription: {
      zh: "仁在《论语》里不是性格标签，也不是泛泛的善。此页说明它不是成功学、不是英文 Golden Rule，并链回克己复礼、爱人、忠恕等可核对的原文。",
      en: "Ren in the Analects is not a personality badge or generic goodness. This page says what it is not—success talk or the Golden Rule—and sends you to 克己复礼, 爱人, and 恕 in the source text.",
    },
    editorialNote: {
      zh: "此页是索引上的判断与选读，不是新的校勘本。原文、白话导读与英译仍分层留在各章句页。",
      en: "This page judges and selects. It is not a new critical edition. Source text, guide, and translation remain layered on each passage page.",
    },
    usesHeading: {
      zh: "书中怎么用这个字",
      en: "How the word is used in the book",
    },
    uses: [
      {
        title: { zh: "克己复礼为仁", en: "Self-restraint returning to li" },
        body: {
          zh: "颜渊问仁，孔子不给定义，而给一条功夫：克制自己，回到礼。仁在这里先是对自己的约束，不是对别人的口号。",
          en: "When Yan Yuan asks, Confucius does not define ren. He gives a discipline: restrain yourself and return to ritual form. The work begins on the self.",
        },
        sentenceId: "yan-yuan-001",
      },
      {
        title: { zh: "爱人", en: "To love others" },
        body: {
          zh: "樊迟问仁，孔子只说爱人。这是方向，不是全书的唯一定义；同书别处又把仁说成难许、罕言、不可巧言令色。",
          en: "Fan Chi is told: love others. That is a direction, not the book's only formula. Elsewhere ren is rare, hard to grant, and far from fine words.",
        },
        sentenceId: "yan-yuan-022",
      },
      {
        title: { zh: "能近取譬", en: "Taking the near as analogy" },
        body: {
          zh: "己欲立而立人，己欲达而达人。仁的方法是从近处推己，不是先发明一套普遍理论再去爱人。",
          en: "Wanting to stand, help others stand; wanting to reach, help others reach. The method is analogy from what is near, not a theory applied from above.",
        },
        sentenceId: "yong-ye-028",
      },
      {
        title: { zh: "巧言令色，鲜矣仁", en: "Fine words are rarely ren" },
        body: {
          zh: "仁在开卷就被从反面划界：会说话、会讨好，很少与仁在一起。这不是性格批评，而是警告把仁说成外貌。",
          en: "The book marks a negative boundary early: polished speech and an insinuating face are seldom ren. The warning is against wearing virtue as a manner.",
        },
        sentenceId: "xue-er-003",
      },
      {
        title: { zh: "其恕乎", en: "Is it not shu?" },
        body: {
          zh: "子贡问可以终身行之的一言，孔子答恕：己所不欲，勿施于人。仁的日常入口往往是这一禁令，而不是一句“去做你希望别人对你做的事”。",
          en: "Asked for one word to practice for life, Confucius answers shu: what you do not want done to you, do not do to others. The daily door is a restraint, not a projection of your wishes.",
        },
        sentenceId: "wei-ling-gong-023",
      },
    ],
    confusionsHeading: {
      zh: "容易混淆的地方",
      en: "Easy confusions",
    },
    confusions: [
      {
        title: { zh: "仁不是泛泛的“善”", en: "Ren is not generic goodness" },
        body: {
          zh: "《论语》可以说某事善、某人有才，却很少轻易许人以仁。善是“好”；仁是更重的要求，常与克己、礼、恕连在一起。把仁读成“做个好人”，会把书中那些不肯轻易下的判断读丢。",
          en: "The Analects can call an act good or a man able, and still withhold ren. Shan is “good.” Ren is a heavier demand, usually tied to restraint, li, and shu. Reading it as “be a nice person” erases the book's refusals.",
        },
      },
      {
        title: { zh: "恕不是英文 Golden Rule 的完整等价", en: "Shu is not the Golden Rule" },
        body: {
          zh: "“己所不欲，勿施于人”是禁止：不要把你不愿承受的加给别人。常见英文 Golden Rule 是“你想要的，也给别人”。方向相反。本站不把恕改写成后一种句式。",
          en: "“What you do not want done to yourself, do not do to others” is a prohibition. The usual Golden Rule tells you to give others what you want. The direction is not the same, and this site does not rewrite shu into that sentence.",
        },
      },
      {
        title: { zh: "君子不是“成功的人”", en: "The junzi is not a successful person" },
        body: {
          zh: "君子可以不被人知，可以穷，可以无终食之间违仁。闻达、事功、才干都不是这个名字的条件。仁在君子章里是成名之前必须守住的东西，不是成功之后的装饰。",
          en: "A junzi may go unrecognized, may be poor, and still not leave ren for the space of a meal. Fame, office, and talent are not the name's conditions. Ren is what must be kept before reputation, not a decoration after success.",
        },
      },
    ],
    featuredHeading: {
      zh: "选读",
      en: "Featured passages",
    },
    featuredIntro: {
      zh: "下面只选可以直接回答“仁在书里做什么、不是什么”的章句。其余原文中出现“仁”字的章句，收在选读之后。",
      en: "These passages are enough to answer what ren does in the book, and what it is not. Other source passages that contain the character 仁 follow under “view all.”",
    },
    featuredSentenceIds: [
      "xue-er-002",
      "xue-er-003",
      "li-ren-001",
      "li-ren-005",
      "li-ren-015",
      "yong-ye-028",
      "shu-er-029",
      "yan-yuan-001",
      "yan-yuan-022",
      "wei-ling-gong-008",
      "wei-ling-gong-023",
      "yang-huo-006",
    ],
    viewAllLabel: {
      zh: "查看全部相关章句",
      en: "View all related passages",
    },
    practiceHeading: {
      zh: "今天可以做的一件事",
      en: "What you can do today",
    },
    practice: {
      zh: "选一件今天你几乎要说出口或要做下去的事，停一停，只问：这一下，是不是我自己也不愿承受的？若是，就放下。不必把《论语》写成日课表；恕只需从一句原文回到一次具体的克制。",
      en: "Choose one thing you were about to say or do today. Pause and ask only: is this something I would not want done to me? If it is, stop. This is not a self-help plan. It returns 恕 from one source sentence to one act of restraint.",
    },
    practiceSentenceId: "wei-ling-gong-023",
    faqHeading: {
      zh: "常见问题",
      en: "Frequently asked questions",
    },
    faqs: [
      {
        question: {
          zh: "“问仁”时是谁在说话？",
          en: "Who is speaking when ren is asked about?",
        },
        answer: {
          zh: "多数是弟子问、孔子答。答案随问者而变：颜渊得到克己复礼，樊迟得到爱人，仲弓得到出门如见大宾。不要把其中一句当成全书定义。",
          en: "Usually a disciple asks and Confucius answers. The answer changes with the asker: Yan Yuan is given 克己复礼, Fan Chi is given 爱人, Zhong Gong is given the bearing of a guest and a sacrifice. No single reply is the book's definition.",
        },
      },
      {
        question: {
          zh: "英文该用哪个词：virtue、benevolence，还是 humaneness？",
          en: "Which English word: virtue, benevolence, or humaneness?",
        },
        answer: {
          zh: "James Legge 常用 virtue、perfect virtue、benevolence，它们都只覆盖一部分用法。本站标题保留 Ren，并要求回到原文，而不是选定一个现代英文等价词。",
          en: "James Legge often writes virtue, perfect virtue, or benevolence. Each covers only part of the usage. This site keeps Ren in the title and sends you back to the Chinese, rather than choosing one modern English equivalent.",
        },
      },
      {
        question: {
          zh: "“己所不欲，勿施于人”是 15.24 吗？",
          en: "Is “what you do not want done to yourself” Analects 15.24?",
        },
        answer: {
          zh: "部分通行编号把它标为卫灵公 15.24。本站此句在 wei-ling-gong-023，篇内序号是 15.23。引用请用稳定 URL，不要只写章节号。",
          en: "Some received numberings call it Wei Ling Gong 15.24. On this site the sentence is wei-ling-gong-023, numbered 15.23 within the book. Cite the stable URL; do not cite the chapter number alone.",
        },
      },
      {
        question: {
          zh: "孔子不是罕言仁吗？为什么索引里有这么多章？",
          en: "If Confucius seldom spoke of ren, why are there so many passages?",
        },
        answer: {
          zh: "《子罕》说子罕言利、命与仁。罕言的是把仁当成题目空讲；书中大量是具体问答。索引列出原文出现“仁”字的章句，不是一份孔子专题演讲目录。",
          en: "Book 9 says the Master seldom spoke of profit, of ming, and of ren. What is rare is lecturing on ren as a topic. The book is full of concrete answers. The index lists passages that contain the character, not a lecture series.",
        },
      },
      {
        question: {
          zh: "孔子承认自己仁吗？",
          en: "Did Confucius claim to be ren?",
        },
        answer: {
          zh: "不。他说“若圣与仁，则吾岂敢”。仁在书中是标准，不是孔子的自我介绍。",
          en: "No. He says that as for sagehood and ren, he would not dare claim them. In the book, ren is a standard, not Confucius's self-description.",
        },
      },
      {
        question: {
          zh: "仁就是爱吗？",
          en: "Is ren simply love?",
        },
        answer: {
          zh: "“爱人”是给樊迟的一条路，不是唯一答案。克己复礼、杀身成仁、巧言令色鲜矣仁，都无法收进一个“爱”字。",
          en: "“Love others” is one answer to Fan Chi, not the only one. Self-restraint, dying to complete ren, and the refusal of fine words cannot be packed into the single English word love.",
        },
      },
      {
        question: {
          zh: "管仲算仁吗？",
          en: "Was Guan Zhong ren?",
        },
        answer: {
          zh: "子路、子贡都曾以私德质疑管仲。孔子许其功，说“如其仁”，同时拒绝把仁收成一份洁身清单。这是历史判断，不是人格奖章。",
          en: "Zi Lu and Zi Gong doubted Guan Zhong by a private-virtue test. Confucius grants the historical work — “that was ren” — and refuses to shrink ren into a purity checklist. It is a judgment of consequence, not a badge of character.",
        },
      },
    ],
    relatedHeading: {
      zh: "相关词条",
      en: "Related entries",
    },
    relatedSlugs: ["li", "zhongshu", "junzi", "xue", "confucius", "yan-yuan", "zi-gong"],
    booksHeading: {
      zh: "回到二十篇",
      en: "Back to the twenty books",
    },
  },
  ...moreFeaturedIndexBySlug,
};

function assertFeaturedIndex(content: FeaturedIndexContent) {
  const ids = [
    ...content.uses.map((use) => use.sentenceId),
    ...content.featuredSentenceIds,
    content.practiceSentenceId,
  ];
  for (const id of ids) {
    if (!getSentence(id)) {
      throw new Error(`featured-index ${content.slug}: unknown sentenceId ${id}`);
    }
  }
  for (const slug of content.relatedSlugs) {
    if (!getBlogEntity(slug)) {
      throw new Error(`featured-index ${content.slug}: unknown related slug ${slug}`);
    }
  }
}

for (const content of Object.values(featuredIndexBySlug)) {
  assertFeaturedIndex(content);
}

export function getFeaturedIndex(slug: string) {
  return featuredIndexBySlug[slug];
}

export function indexEntryModifiedDate(slug: string) {
  if (!getFeaturedIndex(slug)) return undefined;
  return expandedFeaturedIndexSlugs.has(slug)
    ? expandedFeaturedIndexModifiedDate
    : featuredIndexModifiedDate;
}

export function featuredSentence(sentenceId: string): Sentence | undefined {
  return getSentence(sentenceId);
}

export function featuredRelatedEntities(content: FeaturedIndexContent): BlogEntity[] {
  return content.relatedSlugs
    .map((slug) => getBlogEntity(slug))
    .filter((entity): entity is BlogEntity => Boolean(entity));
}

export function featuredAndRemainingSentences(entity: BlogEntity, content: FeaturedIndexContent) {
  const featuredIds = new Set(content.featuredSentenceIds);
  const featured = content.featuredSentenceIds
    .map((id) => getSentence(id))
    .filter((sentence): sentence is Sentence => Boolean(sentence));
  const remaining = getSentencesForBlog(entity).filter((sentence) => !featuredIds.has(sentence.id));
  return { featured, remaining };
}

export function allAnalectsBooks() {
  return books;
}
