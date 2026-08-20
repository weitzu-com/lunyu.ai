import { Locale, t } from "@/lib/analects";

export type EditorialPost = {
  slug: string;
  titleZh: string;
  titleEn: string;
  dekZh: string;
  dekEn: string;
  datePublished: string;
  dateModified: string;
  tagsZh: string[];
  tagsEn: string[];
  related: string[];
  sections: Array<{
    headingZh: string;
    headingEn: string;
    bodyZh: string[];
    bodyEn: string[];
  }>;
};

export const editorialPosts: EditorialPost[] = [
  {
    slug: "how-to-read-the-analects",
    titleZh: "如何从第一句开始读《论语》",
    titleEn: "How to Start Reading The Analects",
    dekZh:
      "把《论语》当作逐句练习，而不是一次读完的名言集：先读原文，再看白话导读，最后回到自己的处境。",
    dekEn:
      "Read The Analects as a passage-by-passage practice: begin with the source text, check the guide, then return to your own situation.",
    datePublished: "2026-07-08",
    dateModified: "2026-07-08",
    tagsZh: ["读法", "入门", "学而"],
    tagsEn: ["reading", "starter", "Xue Er"],
    related: [
      "/analects/xue-er/xue-er-001",
      "/analects/xue-er",
      "/index/xue",
      "/method",
    ],
    sections: [
      {
        headingZh: "先把单位缩小到一句",
        headingEn: "Start with one passage",
        bodyZh: [
          "《论语》不是线性论著，而是章句汇集。第一步不是追求一次读懂全书，而是把注意力放在一句话的语境、语气和问题上。",
          "lunyu.ai 用每个章句的稳定 URL 作为阅读单位，是为了让引用、复习和讨论都能回到同一个文本节点。",
        ],
        bodyEn: [
          "The Analects is not a linear treatise. It is a collection of passages. The first step is not to master the whole book at once, but to attend to one saying, its tone, and its problem.",
          "lunyu.ai treats each passage as a stable URL so citation, review, and discussion can return to the same textual node.",
        ],
      },
      {
        headingZh: "分层阅读，不混合来源",
        headingEn: "Read in layers, not as a blur",
        bodyZh: [
          "先看简体原文，确认这一句说了什么；再读白话导读，获得现代汉语解释；最后对照 James Legge 英译，观察另一种表达路径。",
          "这三层各有边界。原文不是解释，解释不是原文，英文公版译文也不是现代改写。",
        ],
        bodyEn: [
          "Begin with the Chinese source text, then read the modern Chinese guide, then compare James Legge's public-domain English translation.",
          "These layers have boundaries. The source is not the explanation; the explanation is not the source; the English translation is not a modern paraphrase.",
        ],
      },
      {
        headingZh: "从可复用的问题开始",
        headingEn: "Ask reusable questions",
        bodyZh: [
          "读《学而》第一章时，不妨问三个问题：我正在学习什么，我如何复习和实践，别人不了解我时我如何反应。",
          "这样的读法会把经典从抽象赞美带回日常选择，也更容易形成可持续的阅读习惯。",
        ],
        bodyEn: [
          "For the first passage of Xue Er, ask three questions: What am I learning? How do I review and practice it? How do I respond when others do not understand me?",
          "This turns the classic from abstract admiration into everyday judgment, and makes reading sustainable.",
        ],
      },
    ],
  },
  {
    slug: "ren-junzi-and-everyday-conduct",
    titleZh: "仁、君子与日常行为",
    titleEn: "Ren, Junzi, and Everyday Conduct",
    dekZh:
      "仁不是口号，君子也不是身份标签。二者在《论语》中都要落到待人、处事、言语和自省上。",
    dekEn:
      "Ren is not a slogan, and junzi is not a status label. In The Analects, both must appear in conduct, speech, and self-examination.",
    datePublished: "2026-07-08",
    dateModified: "2026-07-08",
    tagsZh: ["仁", "君子", "修身"],
    tagsEn: ["ren", "junzi", "self-cultivation"],
    related: ["/index/ren", "/index/junzi", "/index/xiaoren", "/analects/yan-yuan"],
    sections: [
      {
        headingZh: "仁从关系里显现",
        headingEn: "Ren appears in relationships",
        bodyZh: [
          "《论语》谈仁，很少把它处理成抽象定义。仁常常出现在具体关系里：对人是否诚恳，临事是否能克己，言行是否顾及他人。",
          "因此，读仁要同时看章句里的对象、场景和行动要求。",
        ],
        bodyEn: [
          "The Analects rarely treats ren as an abstract definition. It appears in relationships: sincerity toward others, self-discipline in action, and regard for people affected by one's words.",
          "To read ren, watch the addressee, the situation, and the conduct being asked for.",
        ],
      },
      {
        headingZh: "君子是持续练习的方向",
        headingEn: "Junzi is a direction of practice",
        bodyZh: [
          "君子不是天生身份，而是一种不断修正自己的方向。它要求人在利害、荣辱、言语和朋友关系中作出更稳的选择。",
          "这也解释了为什么《论语》常把君子和小人并列：不是为了贴标签，而是为了帮助读者辨认选择的分岔口。",
        ],
        bodyEn: [
          "Junzi is not an inherited status. It is a direction of ongoing correction, visible in choices about interest, reputation, speech, and friendship.",
          "That is why The Analects often contrasts junzi and the small person: not to label people, but to reveal points of choice.",
        ],
      },
    ],
  },
  {
    slug: "learning-practice-and-review",
    titleZh: "学而时习：学习为什么要回到实践",
    titleEn: "Learning, Practice, and Review",
    dekZh:
      "《学而》开篇把学习和按时温习、实践放在一起。学习不是收藏知识，而是让知识进入行为。",
    dekEn:
      "The opening of Xue Er joins learning with timely review and practice. Learning is not collecting knowledge; it is letting knowledge enter conduct.",
    datePublished: "2026-07-08",
    dateModified: "2026-07-08",
    tagsZh: ["学习", "实践", "复习"],
    tagsEn: ["learning", "practice", "review"],
    related: ["/analects/xue-er/xue-er-001", "/index/xue", "/index/li"],
    sections: [
      {
        headingZh: "学习的检验在行为",
        headingEn: "Learning is tested in conduct",
        bodyZh: [
          "如果学习只停留在记忆和谈论，它很快会变成装饰。《论语》把学和习连在一起，是提醒读者把所学放回生活现场。",
          "习不是机械重复，而是在合适的时机重新练习、校正和确认。",
        ],
        bodyEn: [
          "If learning remains only memory and talk, it becomes decoration. The Analects links learning and practice to return knowledge to lived situations.",
          "Practice is not mechanical repetition. It is timely rehearsal, correction, and confirmation.",
        ],
      },
      {
        headingZh: "复习让人保持方向",
        headingEn: "Review keeps direction visible",
        bodyZh: [
          "经典阅读的价值常常不是第一次读到的惊奇，而是反复回到同一句时发现自己已经不同。",
          "稳定 URL、阅读记录和相关索引的意义，就在于支持这种长期回访。",
        ],
        bodyEn: [
          "The value of reading classics is often not the surprise of the first encounter, but seeing how one has changed when returning to the same passage.",
          "Stable URLs, reading history, and related indexes exist to support that long return.",
        ],
      },
    ],
  },
  {
    slug: "filial-conduct-ritual-and-care",
    titleZh: "孝与礼：亲情为什么需要形式",
    titleEn: "Filial Conduct, Ritual, and Care",
    dekZh:
      "《论语》谈孝，不只谈感情，也谈礼。形式不是感情的敌人，而是让关怀稳定呈现的方式。",
    dekEn:
      "When The Analects speaks of filial conduct, it also speaks of ritual. Form is not the enemy of care; it helps care become steady.",
    datePublished: "2026-07-08",
    dateModified: "2026-07-08",
    tagsZh: ["孝", "礼", "家庭"],
    tagsEn: ["filial conduct", "ritual", "family"],
    related: ["/index/xiao", "/index/li", "/analects/wei-zheng/wei-zheng-005"],
    sections: [
      {
        headingZh: "孝不是单纯顺从",
        headingEn: "Filial conduct is not mere obedience",
        bodyZh: [
          "《论语》中的孝，包含敬、养、礼和长期的自我约束。它不是把亲情简化为服从，而是要求人在亲近关系里仍保持敬意。",
          "这也使孝和仁相通：亲亲之情是人学习关怀他人的起点。",
        ],
        bodyEn: [
          "Filial conduct in The Analects includes reverence, support, ritual, and long-term self-restraint. It is not reducing family life to obedience.",
          "This connects filial conduct with ren: care for kin is a starting point for learning care toward others.",
        ],
      },
      {
        headingZh: "礼让关怀可被看见",
        headingEn: "Ritual makes care visible",
        bodyZh: [
          "礼给关怀一个可见的形状。它避免感情只在心里自我确认，也避免关系只剩下临时情绪。",
          "当然，礼若失去敬意就会空洞；敬意若没有形式，也容易散失。",
        ],
        bodyEn: [
          "Ritual gives care a visible shape. It prevents care from becoming merely private feeling or momentary mood.",
          "Ritual without reverence is hollow; reverence without form can easily disperse.",
        ],
      },
    ],
  },
  {
    slug: "ai-boundaries-for-classic-texts",
    titleZh: "AI 可以怎样辅助读经典",
    titleEn: "How AI Can Help Read Classics",
    dekZh:
      "经典网站可以使用 AI 辅助提问和启发，但必须把原文、译文、导读和生成性反思分开。",
    dekEn:
      "AI can support questions and reflection around classic texts, but source text, translation, editorial guide, and generated reflection must remain separate.",
    datePublished: "2026-07-08",
    dateModified: "2026-07-08",
    tagsZh: ["AI", "GEO", "编辑边界"],
    tagsEn: ["AI", "GEO", "editorial boundaries"],
    related: ["/method", "/sources", "/faq", "/analects/xue-er/xue-er-001"],
    sections: [
      {
        headingZh: "先保护文本边界",
        headingEn: "Protect textual boundaries first",
        bodyZh: [
          "在经典阅读中，最重要的不是让 AI 说得更多，而是让读者知道哪些是原文，哪些是译文，哪些是编辑导读，哪些只是启发性反思。",
          "lunyu.ai 的静态 RAG 设计就是为了降低混淆风险：回答必须回到具体章句和来源层级。",
        ],
        bodyEn: [
          "In reading classics, the first task is not to make AI say more. It is to make clear what is source text, translation, editorial guide, and reflective aid.",
          "lunyu.ai's static RAG design reduces confusion by requiring answers to return to a passage and its source layers.",
        ],
      },
      {
        headingZh: "GEO 的关键是可引用",
        headingEn: "GEO depends on citability",
        bodyZh: [
          "AI 搜索和问答系统需要稳定、结构化、可引用的页面。单个章句 URL、FAQ、底本说明和 llms.txt 都服务于这个目标。",
          "如果一个回答不能指向具体章句，它就不应该替代读者对原文的判断。",
        ],
        bodyEn: [
          "AI search and answer systems need stable, structured, citable pages. Passage URLs, FAQ, source notes, and llms.txt all serve that aim.",
          "If an answer cannot point to a concrete passage, it should not replace the reader's judgment about the source.",
        ],
      },
    ],
  },
];

export function getEditorialPost(slug: string) {
  return editorialPosts.find((post) => post.slug === slug);
}

export function postTitle(locale: Locale, post: EditorialPost) {
  return t(locale, post.titleZh, post.titleEn);
}

export function postDek(locale: Locale, post: EditorialPost) {
  return t(locale, post.dekZh, post.dekEn);
}

export function postTags(locale: Locale, post: EditorialPost) {
  return locale === "zh-Hans" ? post.tagsZh : post.tagsEn;
}
