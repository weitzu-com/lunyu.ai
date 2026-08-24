import {
  books,
  getAllSentences,
  getBook,
  Locale,
  sentenceUrl,
  Sentence,
  t,
} from "@/lib/analects";

export type BlogCategory = "person" | "place" | "concept" | "classic";

export type BlogEntity = {
  slug: string;
  category: BlogCategory;
  zhName: string;
  enName: string;
  /** Source-text strings used to decide which passages belong on this index page. */
  aliases: string[];
  /**
   * Extra source-text patterns for passage → index chips only.
   * These must not inflate the entity's own passage dump.
   */
  relatedAliases?: string[];
  zhSummary: string;
  enSummary: string;
};

export const categoryLabels: Record<BlogCategory, { zh: string; en: string }> = {
  person: { zh: "人物", en: "People" },
  place: { zh: "地点", en: "Places" },
  concept: { zh: "概念", en: "Concepts" },
  classic: { zh: "典籍与时代", en: "Texts and eras" },
};

export const blogEntities: BlogEntity[] = [
  {
    slug: "confucius",
    category: "person",
    zhName: "孔子",
    enName: "Confucius",
    aliases: ["孔子", "夫子", "仲尼"],
    relatedAliases: ["子曰"],
    zhSummary: "《论语》的核心人物，言行、教学、政治理想与人格气象贯穿全书。",
    enSummary: "The central figure of The Analects: teacher, moral exemplar, and political thinker.",
  },
  {
    slug: "yan-yuan",
    category: "person",
    zhName: "颜渊",
    enName: "Yan Yuan",
    aliases: ["颜渊", "颜回", "回也"],
    zhSummary: "孔门高弟，以好学、安贫、近仁著称。",
    enSummary: "A beloved disciple known for learning, simplicity, and nearness to ren.",
  },
  {
    slug: "zi-lu",
    category: "person",
    zhName: "子路",
    enName: "Zi Lu",
    aliases: ["子路", "季路"],
    zhSummary: "孔门弟子，勇直好问，常在政事与行动中被孔子点拨。",
    enSummary: "A direct and courageous disciple, often taught through questions of action and government.",
  },
  {
    slug: "zi-gong",
    category: "person",
    zhName: "子贡",
    enName: "Zi Gong",
    aliases: ["子贡"],
    zhSummary: "孔门弟子，善言辞与外交，也常追问仁、君子与孔子人格。",
    enSummary: "A disciple known for speech, diplomacy, and probing questions about virtue.",
  },
  {
    slug: "zi-xia",
    category: "person",
    zhName: "子夏",
    enName: "Zi Xia",
    aliases: ["子夏"],
    zhSummary: "孔门弟子，重视文学、礼学与学习次第。",
    enSummary: "A disciple associated with learning, literary cultivation, and ritual study.",
  },
  {
    slug: "zi-zhang",
    category: "person",
    zhName: "子张",
    enName: "Zi Zhang",
    aliases: ["子张"],
    zhSummary: "孔门弟子，常问从政、求仁、行道与士人风范。",
    enSummary: "A disciple who asks about government, virtue, and the conduct of a scholar.",
  },
  {
    slug: "zeng-zi",
    category: "person",
    zhName: "曾子",
    enName: "Zeng Zi",
    aliases: ["曾子", "曾参"],
    zhSummary: "孔门弟子，以反省、孝道和传承意识著称。",
    enSummary: "A disciple known for self-examination, filial conduct, and transmission.",
  },
  {
    slug: "you-zi",
    category: "person",
    zhName: "有子",
    enName: "You Zi",
    aliases: ["有子", "有若"],
    zhSummary: "孔门弟子，在《学而》中论孝弟、务本与礼之和。",
    enSummary: "A disciple whose sayings frame filial conduct, roots, and ritual harmony.",
  },
  {
    slug: "ran-you",
    category: "person",
    zhName: "冉有",
    enName: "Ran You",
    aliases: ["冉有", "冉求"],
    zhSummary: "孔门弟子，常与政事、家臣职责和行动能力相关。",
    enSummary: "A disciple often linked with government service and practical ability.",
  },
  {
    slug: "zhong-gong",
    category: "person",
    zhName: "仲弓",
    enName: "Zhong Gong",
    aliases: ["仲弓", "冉雍"],
    zhSummary: "孔门弟子，围绕仁、政、德性受孔子称许。",
    enSummary: "A disciple praised in discussions of ren, government, and character.",
  },
  {
    slug: "zai-wo",
    category: "person",
    zhName: "宰我",
    enName: "Zai Wo",
    aliases: ["宰我", "宰予"],
    zhSummary: "孔门弟子，常因言行与礼制问题引发孔子的严厉辨析。",
    enSummary: "A disciple whose questions often provoke sharp teaching on ritual and conduct.",
  },
  {
    slug: "zi-you",
    category: "person",
    zhName: "子游",
    enName: "Zi You",
    aliases: ["子游"],
    zhSummary: "孔门弟子，涉及孝、礼乐和地方治理。",
    enSummary: "A disciple associated with filial conduct, ritual, music, and local governance.",
  },
  {
    slug: "fan-chi",
    category: "person",
    zhName: "樊迟",
    enName: "Fan Chi",
    aliases: ["樊迟", "樊须"],
    zhSummary: "孔门弟子，多问仁、知、孝与农圃等现实问题。",
    enSummary: "A disciple who asks practical questions about ren, knowledge, filial conduct, and work.",
  },
  {
    slug: "gongxi-hua",
    category: "person",
    zhName: "公西华",
    enName: "Gongxi Hua",
    aliases: ["公西华"],
    zhSummary: "孔门弟子，常见于弟子志向与礼仪事务的语境。",
    enSummary: "A disciple appearing in contexts of aspiration and ritual service.",
  },
  {
    slug: "min-zijian",
    category: "person",
    zhName: "闵子骞",
    enName: "Min Zijian",
    aliases: ["闵子骞", "闵子"],
    zhSummary: "孔门弟子，以孝德与不仕之节为后世称道。",
    enSummary: "A disciple remembered for filial virtue and principled conduct.",
  },
  {
    slug: "nan-gong-kuo",
    category: "person",
    zhName: "南宫适",
    enName: "Nan Gong Kuo",
    aliases: ["南宫适", "南宫括"],
    zhSummary: "孔门相关人物，涉及德行、尚贤与历史人物评价。",
    enSummary: "A figure linked with virtue, worthiness, and judgments of historical models.",
  },
  {
    slug: "yuan-xian",
    category: "person",
    zhName: "原宪",
    enName: "Yuan Xian",
    aliases: ["原宪"],
    zhSummary: "孔门弟子，常与贫富、志道和士人节操相连。",
    enSummary: "A disciple associated with poverty, commitment to the Way, and scholarly integrity.",
  },
  {
    slug: "ji-family",
    category: "person",
    zhName: "季氏",
    enName: "Ji Family",
    aliases: ["季氏", "季康子", "季桓子"],
    zhSummary: "鲁国权臣家族，是《论语》中讨论礼制、政权与僭越的重要对象。",
    enSummary: "A powerful Lu family central to discussions of ritual, power, and overreach.",
  },
  {
    slug: "meng-family",
    category: "person",
    zhName: "孟氏",
    enName: "Meng Family",
    aliases: ["孟懿子", "孟武伯", "孟孙"],
    zhSummary: "鲁国大夫家族，常见于孝、礼和政治问答。",
    enSummary: "A Lu aristocratic family appearing in questions on filial conduct, ritual, and politics.",
  },
  {
    slug: "duke-ai",
    category: "person",
    zhName: "鲁哀公",
    enName: "Duke Ai of Lu",
    aliases: ["哀公", "鲁哀公"],
    zhSummary: "鲁国国君，常向孔子请教政事。",
    enSummary: "A ruler of Lu who asks Confucius about government.",
  },
  {
    slug: "duke-ding",
    category: "person",
    zhName: "鲁定公",
    enName: "Duke Ding of Lu",
    aliases: ["定公", "鲁定公"],
    zhSummary: "鲁国国君，出现在君臣、礼乐与政事语境中。",
    enSummary: "A ruler of Lu appearing in contexts of rulership, ritual, and government.",
  },
  {
    slug: "duke-jing-of-qi",
    category: "person",
    zhName: "齐景公",
    enName: "Duke Jing of Qi",
    aliases: ["齐景公"],
    zhSummary: "齐国国君，向孔子问政，关联君臣父子之道。",
    enSummary: "A ruler of Qi who asks about government and proper roles.",
  },
  {
    slug: "wei-ling-gong-person",
    category: "person",
    zhName: "卫灵公",
    enName: "Duke Ling of Wei",
    aliases: ["卫灵公"],
    zhSummary: "卫国国君，关联孔子周游与政治判断。",
    enSummary: "A ruler of Wei connected with Confucius's travels and political judgment.",
  },
  {
    slug: "yang-huo",
    category: "person",
    zhName: "阳货",
    enName: "Yang Huo",
    aliases: ["阳货", "阳虎"],
    zhSummary: "鲁国权臣，体现乱世中仕与不仕、道与权力的张力。",
    enSummary: "A powerful Lu figure showing the tension between office, power, and the Way.",
  },
  {
    slug: "guan-zhong",
    category: "person",
    zhName: "管仲",
    enName: "Guan Zhong",
    aliases: ["管仲"],
    zhSummary: "春秋名相，孔子借其功业讨论仁、政与历史评价。",
    enSummary: "A famous statesman used to discuss achievement, ren, and historical judgment.",
  },
  {
    slug: "bo-yi-shu-qi",
    category: "person",
    zhName: "伯夷叔齐",
    enName: "Bo Yi and Shu Qi",
    aliases: ["伯夷", "叔齐"],
    zhSummary: "古代贤者，象征清节、让国与不怨。",
    enSummary: "Ancient worthies associated with integrity, yielding power, and freedom from resentment.",
  },
  {
    slug: "weizi-jizi-bigan",
    category: "person",
    zhName: "微子、箕子、比干",
    enName: "Weizi, Jizi, and Bigan",
    aliases: ["微子", "箕子", "比干"],
    zhSummary: "殷末三仁，体现乱世中的不同守道方式。",
    enSummary: "Three worthies of late Yin, each embodying a different response to disorder.",
  },
  {
    slug: "yao-shun-yu",
    category: "person",
    zhName: "尧、舜、禹",
    enName: "Yao, Shun, and Yu",
    aliases: ["尧", "舜", "禹"],
    zhSummary: "上古圣王，是《论语》中政治理想与德治传统的重要源头。",
    enSummary: "Ancient sage kings forming a source of political and moral ideals.",
  },
  {
    slug: "tang-wen-wu-zhougong",
    category: "person",
    zhName: "汤、文、武、周公",
    enName: "Tang, King Wen, King Wu, and the Duke of Zhou",
    aliases: ["汤", "文王", "武王", "周公"],
    zhSummary: "三代圣王与周公，是礼乐、德政和制度传承的象征。",
    enSummary: "Sage rulers and the Duke of Zhou, symbols of ritual order, virtue, and institutions.",
  },
  {
    slug: "lu",
    category: "place",
    zhName: "鲁",
    enName: "Lu",
    aliases: ["鲁"],
    zhSummary: "孔子故国，也是许多政治问答、礼乐失序与家族权力问题发生之地。",
    enSummary: "Confucius's home state and a frequent setting for political and ritual questions.",
  },
  {
    slug: "qi",
    category: "place",
    zhName: "齐",
    enName: "Qi",
    aliases: ["在齐", "齐景公", "齐人", "适齐", "闻韶"],
    zhSummary: "春秋大国，关联齐景公、闻韶与管仲等主题。",
    enSummary: "A major state tied to Duke Jing, the Shao music, and Guan Zhong.",
  },
  {
    slug: "wei",
    category: "place",
    zhName: "卫",
    enName: "Wei",
    aliases: ["卫灵公", "卫君", "卫公子", "适卫"],
    zhSummary: "孔子周游所至之国，常见于政治与出处理想的张力。",
    enSummary: "A state visited by Confucius, linked with political service and withdrawal.",
  },
  {
    slug: "song",
    category: "place",
    zhName: "宋",
    enName: "Song",
    aliases: ["宋", "宋朝"],
    zhSummary: "春秋诸侯国，关联孔子周游、礼制与历史人物。",
    enSummary: "A state connected with Confucius's travels, ritual, and historical figures.",
  },
  {
    slug: "chen-cai",
    category: "place",
    zhName: "陈、蔡",
    enName: "Chen and Cai",
    aliases: ["在陈", "陈蔡", "陈司败", "蔡"],
    zhSummary: "孔子周游困厄之地，常用于理解志道与困境。",
    enSummary: "States associated with hardship during Confucius's travels.",
  },
  {
    slug: "chu",
    category: "place",
    zhName: "楚",
    enName: "Chu",
    aliases: ["楚", "楚狂"],
    zhSummary: "南方大国，关联楚狂接舆等隐逸与政治判断。",
    enSummary: "A southern state linked with reclusion and political judgment.",
  },
  {
    slug: "wu",
    category: "place",
    zhName: "吴",
    enName: "Wu",
    aliases: ["吴", "吴孟子"],
    zhSummary: "春秋诸侯国，在婚姻、礼制和历史语境中出现。",
    enSummary: "A state appearing in contexts of marriage, ritual, and history.",
  },
  {
    slug: "kuang",
    category: "place",
    zhName: "匡",
    enName: "Kuang",
    aliases: ["匡"],
    zhSummary: "孔子遭困之地，体现道在身而不惧外难。",
    enSummary: "A place of danger for Confucius, showing confidence in the Way amid peril.",
  },
  {
    slug: "taishan",
    category: "place",
    zhName: "泰山",
    enName: "Mount Tai",
    aliases: ["泰山"],
    zhSummary: "礼制和政治象征中的名山，关涉祭祀与僭越。",
    enSummary: "A ritual and political symbol associated with sacrifice and overreach.",
  },
  {
    slug: "yi-river",
    category: "place",
    zhName: "沂水",
    enName: "Yi River",
    aliases: ["沂", "沂水"],
    zhSummary: "曾点志向中的春风沂水，体现孔门生活理想。",
    enSummary: "The river in Zeng Dian's aspiration, symbolizing a humane way of life.",
  },
  {
    slug: "ren",
    category: "concept",
    zhName: "仁",
    enName: "Ren",
    aliases: ["仁"],
    zhSummary: "《论语》的核心德目，贯通爱人、克己、忠恕与君子人格。",
    enSummary: "A central virtue linking humaneness, self-discipline, reciprocity, and noble conduct.",
  },
  {
    slug: "li",
    category: "concept",
    zhName: "礼",
    enName: "Li",
    aliases: ["礼"],
    zhSummary: "礼是行为秩序与内在敬意的统一，不只是外在仪式。",
    enSummary: "Ritual propriety as the unity of social form and inward reverence.",
  },
  {
    slug: "yi",
    category: "concept",
    zhName: "义",
    enName: "Yi",
    aliases: ["义"],
    zhSummary: "义指合宜与正当，是君子处理利害时的根本尺度。",
    enSummary: "Rightness and appropriateness, the noble person's measure amid interests.",
  },
  {
    slug: "xin",
    category: "concept",
    zhName: "信",
    enName: "Trustworthiness",
    aliases: ["信"],
    zhSummary: "信关乎言行一致、政令可信与朋友相交。",
    enSummary: "Trustworthiness in speech, government, and friendship.",
  },
  {
    slug: "xiao",
    category: "concept",
    zhName: "孝",
    enName: "Filial conduct",
    aliases: ["孝"],
    zhSummary: "孝是亲亲之情与礼的实践，也是仁的根本之一。",
    enSummary: "Filial conduct as familial care, ritual practice, and a root of ren.",
  },
  {
    slug: "junzi",
    category: "concept",
    zhName: "君子",
    enName: "Junzi",
    aliases: ["君子"],
    zhSummary: "君子是《论语》中理想人格的核心名称，重德、义、学与自省。",
    enSummary: "The noble person: an ideal of virtue, rightness, learning, and self-cultivation.",
  },
  {
    slug: "xiaoren",
    category: "concept",
    zhName: "小人",
    enName: "Small person",
    aliases: ["小人"],
    zhSummary: "小人与君子相对，代表私欲、党比和德性未立。",
    enSummary: "The contrast to the noble person: partiality, selfishness, and uncultivated conduct.",
  },
  {
    slug: "zhongshu",
    category: "concept",
    zhName: "忠恕",
    enName: "Loyalty and reciprocity",
    aliases: ["忠恕", "忠", "恕"],
    zhSummary: "忠恕是推己及人与尽己之道，贯通仁的实践。",
    enSummary: "Doing one's utmost and extending oneself to others, a practical path of ren.",
  },
  {
    slug: "zheng",
    category: "concept",
    zhName: "政",
    enName: "Government",
    aliases: ["政", "为政"],
    zhSummary: "政在《论语》中首先关乎正己、德化与用人，而不仅是制度技术。",
    enSummary: "Government as moral rectification, virtue, and selecting the worthy.",
  },
  {
    slug: "xue",
    category: "concept",
    zhName: "学",
    enName: "Learning",
    aliases: ["学", "好学"],
    zhSummary: "学是修身、知礼、成德的长期实践。",
    enSummary: "Learning as long-term practice of cultivation, ritual understanding, and virtue.",
  },
  {
    slug: "yue-music",
    category: "concept",
    zhName: "乐",
    enName: "Music",
    aliases: ["韶", "武", "礼乐", "乐正"],
    zhSummary: "乐与礼相配，体现情感、秩序和政治教化。",
    enSummary: "Music paired with ritual, shaping emotion, order, and moral education.",
  },
  {
    slug: "shi",
    category: "classic",
    zhName: "诗",
    enName: "Book of Poetry",
    aliases: ["诗", "诗三百"],
    zhSummary: "《诗》是孔门教育的重要经典，用来兴、观、群、怨。",
    enSummary: "The Book of Poetry, a key text in Confucian education.",
  },
  {
    slug: "shu",
    category: "classic",
    zhName: "书",
    enName: "Book of Documents",
    aliases: ["书"],
    zhSummary: "《书》承载古代政教语言，常用于说明孝、政与历史典范。",
    enSummary: "The Book of Documents, a source of political and historical language.",
  },
  {
    slug: "xia-shang-zhou",
    category: "classic",
    zhName: "夏、殷、周",
    enName: "Xia, Yin, and Zhou",
    aliases: ["夏礼", "夏后", "殷", "周"],
    zhSummary: "三代是礼制损益、王道传承和历史判断的时间框架。",
    enSummary: "The dynastic frame for ritual change, royal tradition, and historical judgment.",
  },
];

export function getBlogEntity(slug: string) {
  return blogEntities.find((entity) => entity.slug === slug);
}

export function blogUrl(locale: Locale, entity: BlogEntity) {
  return `/${locale}/index/${entity.slug}`;
}

export function blogTitle(locale: Locale, entity: BlogEntity) {
  return t(locale, entity.zhName, entity.enName);
}

export function blogSummary(locale: Locale, entity: BlogEntity) {
  return t(locale, entity.zhSummary, entity.enSummary);
}

export function categoryLabel(locale: Locale, category: BlogCategory) {
  const label = categoryLabels[category];
  return t(locale, label.zh, label.en);
}

function sourceText(sentence: Sentence) {
  return sentence.classicalChinese;
}

function containsAnyAlias(haystack: string, aliases: readonly string[]) {
  return aliases.some((alias) => alias.length > 0 && haystack.includes(alias));
}

/** Passages that actually use this entry's name in the Analects source text. */
export function getSentencesForBlog(entity: BlogEntity) {
  return getAllSentences().filter((sentence) => containsAnyAlias(sourceText(sentence), entity.aliases));
}

function relatedAliasesFor(entity: BlogEntity) {
  return entity.relatedAliases?.length
    ? [...entity.aliases, ...entity.relatedAliases]
    : entity.aliases;
}

/** Index chips that belong to this passage's source text, not the guide or Legge layers. */
export function getBlogsForSentence(sentence: Sentence) {
  const text = sourceText(sentence);
  return blogEntities.filter((entity) => containsAnyAlias(text, relatedAliasesFor(entity)));
}

export function getRelatedBlogs(entity: BlogEntity) {
  const sentenceIds = new Set(getSentencesForBlog(entity).map((sentence) => sentence.id));
  return blogEntities
    .filter((other) => other.slug !== entity.slug)
    .map((other) => {
      const overlap = getSentencesForBlog(other).filter((sentence) => sentenceIds.has(sentence.id)).length;
      return { entity: other, overlap };
    })
    .filter((item) => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || a.entity.zhName.localeCompare(b.entity.zhName))
    .slice(0, 12);
}

export function sentenceBookLabel(locale: Locale, sentence: Sentence) {
  const book = getBook(sentence.bookSlug);
  if (!book) return `${sentence.bookNumber}.${sentence.sentenceNumber}`;
  return `${t(locale, book.zhTitle, book.pinyin)} ${sentence.bookNumber}.${sentence.sentenceNumber}`;
}

export function sentenceHref(locale: Locale, sentence: Sentence) {
  return sentenceUrl(locale, sentence);
}

export function categoryGroups() {
  return (["person", "place", "concept", "classic"] as BlogCategory[]).map((category) => ({
    category,
    entities: blogEntities.filter((entity) => entity.category === category),
  }));
}

export function blogCountLine(locale: Locale, entity: BlogEntity) {
  const count = getSentencesForBlog(entity).length;
  return t(locale, `${count} 个相关章句`, `${count} related passages`);
}

export function allBlogPaths() {
  return books.length ? blogEntities : [];
}
