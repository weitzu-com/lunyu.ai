import { Locale, t } from "@/lib/analects";
import { siteUrl } from "@/lib/site";

export type EditorialImage = {
  src: string;
  alt?: string;
  altEn?: string;
  altZh?: string;
  width: number;
  height: number;
};

export type EditorialInlineImageSlot =
  | "speech-and-conduct"
  | "mourning-three-years"
  | "inline-1"
  | "inline-2";

const NOTES_COVER_SIZE = { width: 1600, height: 900 };
const NOTES_INLINE_SIZE = { width: 1200, height: 900 };

function notesBlogImage(
  slug: string,
  file: "cover.jpg" | "inline-1.jpg" | "inline-2.jpg" | "cover.png" | "inline-1.png" | "inline-2.png",
  altEn: string,
  altZh: string,
  size: { width: number; height: number }
): EditorialImage {
  return {
    src: `/images/blogs/${slug}/${file}`,
    altEn,
    altZh,
    width: size.width,
    height: size.height,
  };
}

function notesCoverAndInlines(
  slug: string,
  cover: { altEn: string; altZh: string },
  inline1: { altEn: string; altZh: string },
  inline2: { altEn: string; altZh: string }
): Pick<EditorialPost, "cover" | "inlineImages"> {
  return {
    cover: notesBlogImage(slug, "cover.jpg", cover.altEn, cover.altZh, NOTES_COVER_SIZE),
    inlineImages: {
      "inline-1": notesBlogImage(slug, "inline-1.jpg", inline1.altEn, inline1.altZh, NOTES_INLINE_SIZE),
      "inline-2": notesBlogImage(slug, "inline-2.jpg", inline2.altEn, inline2.altZh, NOTES_INLINE_SIZE),
    },
  };
}

export function editorialImageAlt(locale: Locale, image: EditorialImage): string {
  return t(
    locale,
    image.altZh ?? image.alt ?? image.altEn ?? "",
    image.altEn ?? image.alt ?? image.altZh ?? ""
  );
}

export type EditorialSection = {
  headingZh: string;
  headingEn: string;
  bodyZh: string[];
  bodyEn: string[];
  imageSlot?: EditorialInlineImageSlot;
};

export type EditorialFaq = {
  questionZh: string;
  questionEn: string;
  answerZh: string;
  answerEn: string;
};

export type EditorialPost = {
  slug: string;
  titleZh: string;
  titleEn: string;
  dekZh: string;
  dekEn: string;
  descriptionZh?: string;
  descriptionEn?: string;
  datePublished: string;
  dateModified: string;
  tagsZh: string[];
  tagsEn: string[];
  related: string[];
  cover?: EditorialImage;
  inlineImages?: Partial<Record<EditorialInlineImageSlot, EditorialImage>>;
  sections: EditorialSection[];
  faqs?: EditorialFaq[];
  afterFaqSections?: EditorialSection[];
};

export type EditorialTextPart =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

const EDITORIAL_MARKDOWN_LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g;
const SITE_HOSTS = new Set(["www.lunyu.ai", "lunyu.ai"]);

export const editorialPosts: EditorialPost[] = [
  {
    slug: "li-ritual-in-the-analects",
    titleZh: "《论语》里的「礼」：可核对的形式，不是空仪式",
    titleEn: "Li (Ritual) in the Analects: Form That Can Be Checked",
    dekZh: "在《论语》里，礼（Legge 常作 propriety / the rules of propriety）是带着可核对之形的敬——不是玉帛戏台，也不是拿来顶替刑政的口号。这一篇打开五条活页：回到形式的自限（12.1）、以节托住的和（1.12）、无仁则礼何为（3.3）、立于礼（8.8）、以及「玉帛云乎哉」的拒绝（17.11）。它不是孝与礼照护篇的重写，也不是仁通论的重写，更不是音乐专论。索引已经判断礼不是什么；这里深读几扇门。",
    dekEn: "In the Analects, li (礼; Legge often: propriety, the rules of propriety) is reverence given a form that can be checked — not jade-and-silk theater, and not a slogan that replaces criminal law. This Note opens five live passages: self-limit that returns to form (12.1), harmony held by measure (1.12), form empty without ren (3.3), standing established in li (8.8), and the refusal that gems and silk are all that li means (17.11). It is not a rewrite of the filial Note or the ren Note, and it is not a music essay. The index already judges what li is not; here you deepen the doors.",
    descriptionZh: "《论语》里的礼是带着可核对之形的敬。五条活页，不是玉帛戏台，链回可核对的原文。",
    descriptionEn: "Li in the Analects is reverence given a form that can be checked — five live passages, not jade-and-silk theater.",
    datePublished: "2026-10-26",
    dateModified: "2026-10-26",
    tagsZh: ["礼", "克己复礼", "礼之用", "玉帛"],
    tagsEn: ["li", "ritual", "propriety", "礼", "克己复礼"],
    related: [
      "/analects/yan-yuan/yan-yuan-001",
      "/index/li",
      "/analects/xue-er/xue-er-012",
      "/analects/ba-yi/ba-yi-003",
      "/analects/tai-bo/tai-bo-008",
      "/analects/yang-huo/yang-huo-011",
    ],
    cover: notesBlogImage(
      "li-ritual-in-the-analects",
      "cover.png",
      "A quiet measured edge on a study mat — self-limit that returns to form",
      "席上一道安静可量的边界——克己复礼的限度",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "li-ritual-in-the-analects",
        "inline-1.png",
        "An open curve held by a small measured stop — harmony cut by form",
        "一条舒展的弧被一小处可量的停顿托住——和为贵，仍要节",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "li-ritual-in-the-analects",
        "inline-2.png",
        "Plain cloth and a small jade shape set aside — gems and silk are not all that li means",
        "素帛与一小片玉形搁在一边——玉帛不足以尽礼",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "回到形式的自限——克己复礼",
        headingEn: "Self-limit that returns to form — 克己复礼",
        bodyZh: [
          "请你从[论语 · 颜渊 12.1](https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-001)开始。原文：颜渊问仁。子曰，克己复礼为仁，一日克己复礼，天下归仁焉，为仁由己，而由人乎哉。颜渊曰，请问其目。子曰，非礼勿视，非礼勿听，非礼勿言，非礼勿动。颜渊曰，回虽不敏，请事斯语矣。",
          "活页白话导读作：颜渊请教什么是仁。孔子说：克制自己的私欲，使言行都回到礼上，就是仁。一旦做到克己复礼，天下的人都会称许你是仁人。实行仁德全靠自己，难道还靠别人吗？颜渊说：请问实行仁德的具体条目。孔子说：不合礼的不看，不合礼的不听，不合礼的不说，不合礼的不做。颜渊说：我颜回虽然不够聪敏，也要照这话去做。",
          "活页 Legge 作：Yen Yuan asked about perfect virtue. The Master said, \"To subdue one's self and return to propriety, is perfect virtue. … Look not at what is contrary to propriety; listen not to what is contrary to propriety; speak not what is contrary to propriety; make no movement which is contrary to propriety.\"",
          "你在这一门里得到可核的边：复礼被说成仁的实践，条目是四勿——视、听、言、动——每一项都以礼来量。这一篇把 12.1 当作礼作为自限之形的门，而不是仁通论的全文。问的是仁；答的实践落在礼的形状上。请勿把本节扩成《论语》里的「仁」那一篇的重写。",
        ],
        bodyEn: [
          "Start with [The Analects · Yen Yuan 12.1](https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-001). The source: 颜渊问仁。子曰，克己复礼为仁，一日克己复礼，天下归仁焉，为仁由己，而由人乎哉。颜渊曰，请问其目。子曰，非礼勿视，非礼勿听，非礼勿言，非礼勿动。颜渊曰，回虽不敏，请事斯语矣。",
          "The modern guide on that page: 颜渊请教什么是仁。孔子说：克制自己的私欲，使言行都回到礼上，就是仁。一旦做到克己复礼，天下的人都会称许你是仁人。实行仁德全靠自己，难道还靠别人吗？颜渊说：请问实行仁德的具体条目。孔子说：不合礼的不看，不合礼的不听，不合礼的不说，不合礼的不做。颜渊说：我颜回虽然不够聪敏，也要照这话去做。",
          "Legge on the same page: Yen Yuan asked about perfect virtue. The Master said, \"To subdue one's self and return to propriety, is perfect virtue. … Look not at what is contrary to propriety; listen not to what is contrary to propriety; speak not what is contrary to propriety; make no movement which is contrary to propriety.\"",
          "You are given a form with a checkable edge: return to li is named as the way of ren, and the steps are four refusals — see, hear, speak, move — each measured against li. This Note takes 12.1 as a door into li as self-limit, not as a full ren essay. Ren is asked; li is the shape of the answer’s practice. Do not expand this section into a rewrite of What Ren Means.",
        ],
      },
      {
        headingZh: "和为贵——仍要用节来切",
        headingEn: "Harmony prized — and still cut by measure",
        imageSlot: "inline-1",
        bodyZh: [
          "打开[论语 · 学而 1.12](https://www.lunyu.ai/zh-Hans/analects/xue-er/xue-er-012)。原文：有子曰，礼之用，和为贵，先王之道，斯为美，小大由之。有所不行，知和而和，不以礼节之，亦不可行也。导读作：有子说：礼的作用，以和谐为可贵。古代圣王的治道，美好之处正在这里；大小事情都由此而行。不过只知道和谐而为和谐，不用礼来节制，也是不行的。",
          "Legge 作：The philosopher Yu said, \"In practising the rules of propriety, a natural ease is to be prized. … If one, knowing how such ease should be prized, manifests it, without regulating it by the rules of propriety, this likewise is not to be done.\"",
          "你要同时握住两边：和在礼之用里被看贵——节仍然下刀。知和而和、不以礼节之，被点名为亦不可行。这是「可核对之形」的另一种调：不只是四勿，还有不肯脱离形式而飘走的和。",
        ],
        bodyEn: [
          "Open [The Analects · Hsio R. 1.12](https://www.lunyu.ai/en/analects/xue-er/xue-er-012). The source: 有子曰，礼之用，和为贵，先王之道，斯为美，小大由之。有所不行，知和而和，不以礼节之，亦不可行也。 The guide: 有子说：礼的作用，以和谐为可贵。古代圣王的治道，美好之处正在这里；大小事情都由此而行。不过只知道和谐而为和谐，不用礼来节制，也是不行的。",
          "Legge: The philosopher Yu said, \"In practising the rules of propriety, a natural ease is to be prized. … If one, knowing how such ease should be prized, manifests it, without regulating it by the rules of propriety, this likewise is not to be done.\"",
          "You hold two edges at once: 和 is prized in the use of li — and 节 still cuts. Ease without the measure of li is named as also not workable. That is the “checkable form” in a different key: not only four refusals, but a harmony that refuses to float free of form.",
        ],
      },
      {
        headingZh: "人而不仁，如礼何",
        headingEn: "Without ren, what has form to do?",
        bodyZh: [
          "在[论语 · 八佾 3.3](https://www.lunyu.ai/zh-Hans/analects/ba-yi/ba-yi-003)里，老师把礼与乐对着仁来问。原文：子曰，人而不仁，如礼何，人而不仁，如乐何。导读作：孔子说：做人如果没有仁德，讲礼又有什么用呢？做人如果没有仁德，奏乐又有什么用呢？",
          "Legge 作：The Master said, \"If a man be without the virtues proper to humanity, what has he to do with the rites of propriety? If a man be without the virtues proper to humanity, what has he to do with music?\"",
          "请你仔细看压力落在哪里。这里的礼不是被夸成行头。无仁，则形式被追问「如之何」。这一篇不会复述仁通论；它只要这个铰链：没有人之所当有的德，形式本身已在受问——所以单靠玉帛永远讲不完礼。",
        ],
        bodyEn: [
          "In [The Analects · Pa Yih 3.3](https://www.lunyu.ai/en/analects/ba-yi/ba-yi-003) the Master pairs li and music against ren. The source: 子曰，人而不仁，如礼何，人而不仁，如乐何。 The guide: 孔子说：做人如果没有仁德，讲礼又有什么用呢？做人如果没有仁德，奏乐又有什么用呢？",
          "Legge: The Master said, \"If a man be without the virtues proper to humanity, what has he to do with the rites of propriety? If a man be without the virtues proper to humanity, what has he to do with music?\"",
          "Read the pressure carefully. Li here is not praised as costume. Without ren, the form is asked what it is for. This Note will not retell the ren essay; it only needs this hinge: form without the virtue proper to humanity is already under question — which is why jade and silk alone never finish the account.",
        ],
      },
      {
        headingZh: "立于礼——不是音乐专章",
        headingEn: "Established in li — not a music chapter",
        bodyZh: [
          "[论语 · 泰伯 8.8](https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-008)把礼放在三步里。原文：子曰，兴于诗。立于礼。成于乐。导读作：孔子说：人的修养从学《诗》开始，因懂礼而立身，由音乐的陶冶而完成。",
          "Legge 作：The Master said, \"It is by the Odes that the mind is aroused. … It is by the Rules of Propriety that the character is established. … It is from Music that the finish is received.\"",
          "本篇只取中间一步：立于礼——人因礼而立。诗与乐是框，不是你的音乐专论（那扇门另有排期）。你要的是「立」：礼是把人立起来的地方，不是把这一章写成音乐会节目单。",
        ],
        bodyEn: [
          "[The Analects · T'ai-po 8.8](https://www.lunyu.ai/en/analects/tai-bo/tai-bo-008) places li in a three-step path. The source: 子曰，兴于诗。立于礼。成于乐。 The guide: 孔子说：人的修养从学《诗》开始，因懂礼而立身，由音乐的陶冶而完成。",
          "Legge: The Master said, \"It is by the Odes that the mind is aroused. … It is by the Rules of Propriety that the character is established. … It is from Music that the finish is received.\"",
          "Take only the middle step for this Note: 立于礼 — character established in the rules of propriety. Poem and music frame the line; this page is not your music essay (that door is planned elsewhere). You need the standing: li is where the person is set upright, not where the chapter becomes a concert program.",
        ],
      },
      {
        headingZh: "玉帛云乎哉",
        headingEn: "Gems and silk are not all that is meant",
        imageSlot: "inline-2",
        bodyZh: [
          "章句门收到[论语 · 阳货 17.11](https://www.lunyu.ai/zh-Hans/analects/yang-huo/yang-huo-011)。原文：子曰，礼云礼云，玉帛云乎哉，乐云乐云，钟鼓云乎哉。导读作：孔子说：礼呀礼呀，难道只是指玉帛这些礼器吗？乐呀乐呀，难道只是指钟鼓这些乐器吗？",
          "Legge 作：The Master said, \"'It is according to the rules of propriety,' they say.—'It is according to the rules of propriety,' they say. Are gems and silk all that is meant by propriety? 'It is music,' they say.—'It is music,' they say. Are bells and drums all that is meant by music?\"",
          "书在这里自己拒绝把空仪式当成礼的全部。玉帛出现——又被拒绝当作完整定义。请与 12.1、1.12 并读：可核对之形，不等于可陈列的道具。",
        ],
        bodyEn: [
          "Close the passage doors with [The Analects · Yang Ho 17.11](https://www.lunyu.ai/en/analects/yang-huo/yang-huo-011). The source: 子曰，礼云礼云，玉帛云乎哉，乐云乐云，钟鼓云乎哉。 The guide: 孔子说：礼呀礼呀，难道只是指玉帛这些礼器吗？乐呀乐呀，难道只是指钟鼓这些乐器吗？",
          "Legge: The Master said, \"'It is according to the rules of propriety,' they say.—'It is according to the rules of propriety,' they say. Are gems and silk all that is meant by propriety? 'It is music,' they say.—'It is music,' they say. Are bells and drums all that is meant by music?\"",
          "Here the book itself rejects empty ceremony as the whole of li. Jade and silk appear — and are refused as a complete definition. Pair this with 12.1 and 1.12: a form you can check is not the same as props you can display.",
        ],
      },
      {
        headingZh: "五门合起来看",
        headingEn: "What the five doors add up to",
        bodyZh: [
          "合起来，你看到的是：带着四勿、可核边的自限之礼（12.1）；和为贵却仍要节（1.12）；无仁则礼何为（3.3）；立于礼而不滑成音乐专论（8.8）；玉帛不足以尽礼之名（17.11）。这一篇深读这几扇门，不复述索引里已写明的「礼不是空仪式、也不是刑政」全文。",
          "这也不是孝与礼的日常照护篇，不是仁通论。若那些意图另行升起，请走它们自己的页面——不要并进本 slug。",
          "以下是你自己的反思，不是孔子的话：你也许遇见的「礼」正是表演——对的器、对的辞、送礼的合影。《论语》可以看重形式，却仍要问：这形式是把你送回可核的限度，还是只送到桌上的帛。这几扇门里更硬的边，是四勿、仍切开和的那一节，以及让玉帛够不到「礼」之名的那一问。",
        ],
        bodyEn: [
          "Put them together and you have: li as self-limit with four checkable refusals (12.1); harmony prized and still cut by measure (1.12); form questioned when ren is absent (3.3); standing established in li without turning into a music essay (8.8); gems and silk refused as the whole meaning (17.11). The Note deepens those doors; it does not retell the index editorial that already says li is not empty ceremony and not criminal law.",
          "This is also not the filial Note (孝与礼 in daily care) and not the ren Note (仁 as a whole). If those intents rise later, open their own pages — do not merge them into this slug.",
          "As your own reflection — not as Confucius’s words — you may meet “ritual” as performance: the right vessel, the right phrase, the photo of the gift. The Analects can prize form and still ask whether the form returns you to a limit you can check, or only to silk on the table. The harder edge in these doors is the four refusals, the measure that still cuts harmony, and the question that leaves jade and silk short of the name.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的「礼」是什么意思？",
        questionEn: "What does li mean in the Analects?",
        answerZh: "就本篇所核活页而言，礼是有章法的敬——带着可核对之形。它在 17.11 不被说成只是玉帛陈列；本篇诸门也不把它写成刑政的替代口号。请到各篇章页核对引文，并说明你用的是原文、导读还是 Legge。",
        answerEn: "On the live pages used here, li (礼) is patterned propriety — reverence with a form that can be checked. It is not defined as jade-and-silk display alone (17.11), and it is not treated as a substitute for criminal law in this Note’s doors. Check each quote on its passage page and say whether you used the source, the guide, or Legge.",
      },
      {
        questionZh: "「克己复礼」和礼有什么关系？",
        questionEn: "How does 克己复礼 relate to li?",
        answerZh: "在 12.1，复礼出现在答仁的话里，条目是以礼来量的四勿。本篇把它读作礼作为自限的可核边——不是仁的专论全文。",
        answerEn: "In 12.1, returning to li is named in the answer to a question about ren, and the steps are four refusals measured against li. This Note reads that as li’s checkable edge for self-limit — not as a full ren treatise.",
      },
      {
        questionZh: "为什么 1.12 既贵和、又要节？",
        questionEn: "Why does 1.12 both prize harmony and demand 节?",
        answerZh: "有子贵礼之用的和，又说知和而和、不以礼节之亦不可行。无节度和，被点名为行不通——形式仍在下刀。",
        answerEn: "Youzi prizes 和 in the use of li, then says knowing ease and showing it without regulating it by li is also not to be done. Harmony without measure is named as unworkable — the form still cuts.",
      },
      {
        questionZh: "3.3 是不是说礼没用？",
        questionEn: "Does 3.3 make li useless?",
        answerZh: "不是。它问的是：人而不仁，礼（与乐）如之何。无仁则形式受问；这是铰链，不是允许你丢掉一切仪节。",
        answerEn: "No. It asks what li (and music) are for if a person is without ren. Form without that virtue is under question; that is a hinge, not a license to discard every rite.",
      },
      {
        questionZh: "这篇是在写乐，还是在写孝与礼的照护？",
        questionEn: "Is this Note about music or filial care?",
        answerZh: "都不是。8.8 只用到立于礼；乐是框，不是专论。孝与礼的日常照护另有 Notes；请勿把那意图并进这里。",
        answerEn: "No. 8.8 is used only for 立于礼; music remains a frame, not the essay. Filial ritual care has its own Note; do not merge that intent here.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "FAQ 之后——接着打开「礼」索引",
        headingEn: "After FAQ — open the Li index",
        bodyZh: [
          "当你想把谈到礼的章句放在同一页、并看见索引的判断，请打开[礼](https://www.lunyu.ai/zh-Hans/index/li)。索引说明礼不是什么并选篇；这一篇跟着自限、有节的和、无仁之礼、立于礼、以及玉帛不足以尽礼走。你回到那里再读这几处；引用时请写明篇章网址，并说明用的是原文、导读还是英译。",
        ],
        bodyEn: [
          "When you want the passages that name li gathered and judged on one screen, open [Li](https://www.lunyu.ai/en/index/li). The index says what li is not and selects doors; this Note followed self-limit, measured harmony, form without ren, standing in li, and the refusal of jade-and-silk as the whole. Read the doors again there in context, and when you quote any of them, give the passage URL and say whether you used the source, the guide, or Legge.",
        ],
      },
    ],
  },
  {
    slug: "zi-gong-in-the-analects",
    titleZh: "《论语》里的子贡：会说话，却不是佞",
    titleEn: "Who Was Zi Gong in the Analects? Speech Without Slickness",
    dekZh: "在《论语》里，子贡（端木赐；Legge 作 Tsze-kung、Ts'ze）是与宰我同列于言语科的弟子。书把这份本事归为一类能力，并不把它压成佞。他最著名的一句，往往不是圆熟的答话，而是一问：他问有没有一个字可以终身奉行，老师答以恕。这一篇跟着他走四条活页章句。它不是仲弓笔记（仲弓是另一位弟子），也不是忠恕通论的重写——若你需要那扇门，至多一次软链。",
    dekEn: "In the Analects, Zi Gong (子贡; also 端木赐, Duanmu Ci; Legge: Tsze-kung, Ts'ze) is the disciple placed under speech (言语) with Zai Wo. The book groups that ability; it does not fold it into 佞 (slick, flattering talk). His best known line is not a polished answer but a question: he asks for one word that can be practiced for life, and the Master names 恕. This Note follows him through four live passages. It is not a Zhong Gong Note (仲弓 is another disciple), and it is not a rewrite of the Zhongshu essay — at most a soft chip if you need that door.",
    descriptionZh: "《论语》里的子贡会说话，却不是佞。问出恕，四条活页，链回可核对的原文。",
    descriptionEn: "Zi Gong in the Analects: speech without slickness, the question that yields shu, and four live passages linked back to the source.",
    datePublished: "2026-10-24",
    dateModified: "2026-10-24",
    tagsZh: ["子贡", "端木赐", "言语", "公冶长"],
    tagsEn: ["zi gong", "Zi Gong", "Tsze-kung", "子贡"],
    related: [
      "/analects/wei-ling-gong/wei-ling-gong-023",
      "/index/zi-gong",
      "/analects/xian-jin/xian-jin-002",
      "/analects/gong-ye-chang/gong-ye-chang-003",
      "/analects/gong-ye-chang/gong-ye-chang-011",
    ],
    cover: notesBlogImage(
      "zi-gong-in-the-analects",
      "cover.png",
      "A quiet study mat and empty cup before a low table — the moment of asking for one word",
      "席前空杯与矮案——问出终身一字的瞬间",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "zi-gong-in-the-analects",
        "inline-1.png",
        "A clean brush beside a discarded flourish on a desk — speech without slickness",
        "案上一支干净的笔与一笔弃置的花哨——会说话，却不是佞",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "zi-gong-in-the-analects",
        "inline-2.png",
        "A plain temple vessel shape on a mat — the hu-lian reading image",
        "席上素净的宗庙器形——瑚琏的阅读意象",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "他问出「恕」",
        headingEn: "He asks for one word — and is given shu",
        bodyZh: [
          "请你从[论语 · 卫灵公 15.23](https://www.lunyu.ai/zh-Hans/analects/wei-ling-gong/wei-ling-gong-023)开始。原文：子贡问曰，有一言，而可以终身行之者乎。子曰，其恕乎，己所不欲，勿施于人。活页白话导读作：子贡问道：有没有一个字可以终身奉行的呢？孔子说：那大概就是恕吧！自己不愿意的，不要施加给别人。",
          "活页 Legge 作：Tsze-kung asked, saying, \"Is there one word which may serve as a rule of practice for all one's life?\" The Master said, \"Is not reciprocity such a word? What you do not want done to yourself, do not do to others.\"",
          "你在这一门里得到两件事实：问的人是子贡；答出来的字是恕。没有他这一问，这一页不会落到「其恕乎」。（部分编号作 15.24；本站 slug 为 wei-ling-gong-023 / 15.23。）",
        ],
        bodyEn: [
          "Start with [The Analects · Wei Ling Kung 15.23](https://www.lunyu.ai/en/analects/wei-ling-gong/wei-ling-gong-023). The source: 子贡问曰，有一言，而可以终身行之者乎。子曰，其恕乎，己所不欲，勿施于人。 The modern guide on that page: 子贡问道：有没有一个字可以终身奉行的呢？孔子说：那大概就是恕吧！自己不愿意的，不要施加给别人。",
          "Legge on the same page: Tsze-kung asked, saying, \"Is there one word which may serve as a rule of practice for all one's life?\" The Master said, \"Is not reciprocity such a word? What you do not want done to yourself, do not do to others.\"",
          "You get two facts in one door: the question is Zi Gong's; the word 恕 is given in answer. Without his asking, this page does not arrive at that naming. (Some editions number this line 15.24; on this site the slug is wei-ling-gong-023 / 15.23.)",
        ],
      },
      {
        headingZh: "列在言语——不是定为佞",
        headingEn: "Placed under speech — not charged with ning",
        imageSlot: "inline-1",
        bodyZh: [
          "打开[论语 · 先进 11.2](https://www.lunyu.ai/zh-Hans/analects/xian-jin/xian-jin-002)。原文分四科：德行…言语，宰我，子贡。政事…文学… 导读作：论言辞辩才，有宰我、子贡。Legge 作：\"for their ability in speech, Tsai Wo and Tsze-kung.\"",
          "请你仔细看这份归类。先进把子贡放在言语下，是弟子才能的分组——旁边是宰我——不是裁定他的话就是佞。书里另有地方给巧言令色另起名字，并要人远远避开；这一篇不会臆造活页上并不存在的「子贡佞」对话。你要守住的分界是：会说话，却不是佞——本事归本事，佞是书留给谄媚巧言的另一类指控。",
        ],
        bodyEn: [
          "Open [The Analects · Hsien Tsin 11.2](https://www.lunyu.ai/en/analects/xian-jin/xian-jin-002). The source lists four groupings: 德行…言语，宰我，子贡。政事…文学… The guide: 论言辞辩才，有宰我、子贡. Legge: \"for their ability in speech, Tsai Wo and Tsze-kung.\"",
          "Read the placement carefully. Book 11 puts Zi Gong under speech as an ability among disciples who once followed the Master through hardship. That is a grouping of talent — Zai Wo beside him — not a verdict that his talk is 佞. Elsewhere the book has another name for slick, flattering speech and keeps it far off; this Note will not invent a 佞 dialogue about Zi Gong that the live pages do not carry. Speech without slickness is the edge you are asked to hold: skill at words, without collapsing skill into the charge the book reserves for flattery.",
        ],
      },
      {
        headingZh: "「瑚琏也」",
        headingEn: "A gemmed sacrificial vessel",
        imageSlot: "inline-2",
        bodyZh: [
          "在[论语 · 公冶长 5.3](https://www.lunyu.ai/zh-Hans/analects/gong-ye-chang/gong-ye-chang-003)里，子贡问自己怎么样。原文：子贡问曰，赐也何如。子曰，女器也。曰，何器也。曰，瑚琏也。导读作：子贡问道：我这个人怎么样？孔子说：你好比是一件器皿。子贡问：是什么器皿呢？孔子说：是宗庙里盛黍稷的瑚琏。",
          "Legge 作：Tsze-kung asked, \"What do you say of me, Ts'ze? The Master said, \"You are a utensil.\" \"What utensil?\" \"A gemmed sacrificial utensil.\"",
          "你看见书给了他一件真实、有名字的器——宗庙里的瑚琏——然后停在那里。器用之誉不是德的全部，也不是嘲讽。意象请按活页来取：一件被看重的器，不是说器就等于仁。",
        ],
        bodyEn: [
          "In [The Analects · Kung-ye Ch'ang 5.3](https://www.lunyu.ai/en/analects/gong-ye-chang/gong-ye-chang-003) Zi Gong asks what he himself is. The source: 子贡问曰，赐也何如。子曰，女器也。曰，何器也。曰，瑚琏也。 The guide: 子贡问道：我这个人怎么样？孔子说：你好比是一件器皿。子贡问：是什么器皿呢？孔子说：是宗庙里盛黍稷的瑚琏。",
          "Legge: Tsze-kung asked, \"What do you say of me, Ts'ze? The Master said, \"You are a utensil.\" \"What utensil?\" \"A gemmed sacrificial utensil.\"",
          "You watch the book grant him a real, named vessel — 瑚琏, used in the ancestral temple — and stop there. Praise of use is not the whole of virtue; it is also not a sneer. Take the image as the live page gives it: a valued vessel, not a claim that vessel equals 仁.",
        ],
      },
      {
        headingZh: "他说出恕的句子——老师说还不到",
        headingEn: "He states reciprocity — and is told he has not yet attained it",
        bodyZh: [
          "[论语 · 公冶长 5.11](https://www.lunyu.ai/zh-Hans/analects/gong-ye-chang/gong-ye-chang-011)常被记错。活页上不是佞的对答。原文：子贡曰，我不欲人之加诸我也，吾亦欲无加诸人。子曰，赐也，非尔所及也。导读作：子贡说：我不愿意别人把不合理的事强加在我身上，我也不愿意把不合理的事强加在别人身上。孔子说：赐啊，这不是你现在能做得到的。",
          "Legge 作：Tsze-kung said, \"What I do not wish men to do to me, I also wish not to do to men.\" The Master said, \"Ts'ze, you have not attained to that.\"",
          "你实际拿到的是：子贡先把恕说成一句双边的话；老师说这句话他还做不到。他是把问题推到边上的人——并听见实践仍在前面。这一门与 15.23（他问出恕）并读即可；不要据此臆造谄媚场景。",
        ],
        bodyEn: [
          "[The Analects · Kung-ye Ch'ang 5.11](https://www.lunyu.ai/en/analects/gong-ye-chang/gong-ye-chang-011) is often misremembered. On the live page it is not a 佞 dialogue. The source: 子贡曰，我不欲人之加诸我也，吾亦欲无加诸人。子曰，赐也，非尔所及也。 The guide: 子贡说：我不愿意别人把不合理的事强加在我身上，我也不愿意把不合理的事强加在别人身上。孔子说：赐啊，这不是你现在能做得到的。",
          "Legge: Tsze-kung said, \"What I do not wish men to do to me, I also wish not to do to men.\" The Master said, \"Ts'ze, you have not attained to that.\"",
          "What you actually have: Zi Gong first states reciprocity as a full two-sided sentence; the Master says that sentence is not yet within his reach. He is the disciple who pushes the question to its edge — and is told the practice is still ahead of him. That line sits beside 15.23 (where he asks and is given 恕); it does not license inventing a flattery scene.",
        ],
      },
      {
        headingZh: "四门合起来看",
        headingEn: "What the four doors add up to",
        bodyZh: [
          "合起来，你看到的是：问出终身一字、答以恕的弟子（15.23）；与宰我同列言语、却未被定为佞（11.2）；被称为瑚琏之器（5.3）；说出完整的恕句、却被告知尚未及（5.11）。这一篇深读这几扇门，不复述索引全文。",
          "若你需要忠与恕成对的那扇通论门——而不把本篇当成那篇——可一次打开[《论语》的忠恕：不是愚忠，也不是英文 Golden Rule](https://www.lunyu.ai/zh-Hans/blogs/zhongshu-reciprocity-in-the-analects)，仅作软链。子贡不是仲弓；名字请分开。",
          "以下是你自己的反思，不是孔子的话：你也许正是会说话的人——汇报、交涉、一句能落地的话。《论语》可以把这归在言语之下，却仍不肯把会说的话叫做佞。这几扇门里更硬的边，是问出恕的那一问，以及听见「你能说出的句子，还不等于你已做到」时仍不收回问题。",
        ],
        bodyEn: [
          "Put them together and you have: the disciple who asks for one lifelong word and is answered with 恕 (15.23); who is listed under speech with Zai Wo as ability, not as 佞 (11.2); who is called a 瑚琏 vessel (5.3); who states a full reciprocity sentence and hears that he has not yet attained it (5.11). The Note deepens those doors; it does not retell the index essay.",
          "If you need the broader door on loyalty and reciprocity as a pair — without treating this Note as that essay — open [Zhongshu in the Analects: Loyalty, Reciprocity, and What They Are Not](https://www.lunyu.ai/en/blogs/zhongshu-reciprocity-in-the-analects) once, as a soft chip only. Zi Gong (子贡) is not Zhong Gong (仲弓); keep the names apart.",
          "As your own reflection — not as Confucius's words — you may be good with words: briefings, negotiation, the sentence that lands. The Analects can place that under speech and still refuse to call skilled talk 佞. The harder edge in these doors is the question that yields 恕, and the willingness to hear that a sentence you can say is not yet a practice you have attained.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的子贡是谁？",
        questionEn: "Who was Zi Gong in the Analects?",
        answerZh: "他是孔子的弟子，书中称子贡、端木赐（Legge：Tsze-kung、Ts'ze）。活页显示：他问出终身一字而答以恕（15.23），与宰我同列言语（11.2），被称为瑚琏（5.3），说出恕的句子却被告知尚未及（5.11）。请到各篇章页核对，并说明你用的是原文、导读还是 Legge。",
        answerEn: "He is a disciple of Confucius, named 子贡 and 端木赐 (Duanmu Ci; Legge: Tsze-kung, Ts'ze). Live passages show him asking for one lifelong word and receiving 恕 (15.23), listed under speech with Zai Wo (11.2), called a 瑚琏 vessel (5.3), and stating reciprocity before being told he has not yet attained it (5.11). Check each line on its passage page and say whether you used the source, the guide, or Legge.",
      },
      {
        questionZh: "《论语》有没有说子贡是佞？",
        questionEn: "Did the Analects call Zi Gong ning (佞)?",
        answerZh: "本篇所核活页没有给他定「佞」的指控。先进 11.2 把他放在言语科，与宰我并列，是才能分组。书里另有地方谈巧言令色；请勿臆造活页上不存在的「子贡佞」对话。",
        answerEn: "No line fetched for this Note charges him with 佞. Book 11 places him under 言语 (speech) as ability beside Zai Wo. Slick, flattering speech has another name in the book elsewhere; do not invent a 佞 dialogue about Zi Gong that the live pages do not carry.",
      },
      {
        questionZh: "子贡在 15.23 问了什么？",
        questionEn: "What did Zi Gong ask in 15.23?",
        answerZh: "他问有没有一个字可以终身奉行。老师答以恕——Legge 作 \"Is not reciprocity such a word? What you do not want done to yourself, do not do to others.\" 本站篇章为卫灵公 15.23（wei-ling-gong-023）。",
        answerEn: "He asked whether there is one word that can be practiced for all one's life. The Master answered with 恕 — in Legge, \"Is not reciprocity such a word? What you do not want done to yourself, do not do to others.\" On this site the passage is Wei Ling Kung 15.23 (wei-ling-gong-023).",
      },
      {
        questionZh: "5.3 的「瑚琏」是什么意思？",
        questionEn: "What does 瑚琏 mean in 5.3?",
        answerZh: "子贡问自己何如，老师先说「女器也」，再点名瑚琏——导读：宗庙里盛黍稷的器；Legge：\"a gemmed sacrificial utensil.\" 引用请回到活页，并分清原文、导读与英译。",
        answerEn: "When Zi Gong asks what he is, the Master first says he is a utensil (器), then names 瑚琏 — in the guide, a temple vessel for millet; in Legge, \"a gemmed sacrificial utensil.\" Quote the live page and keep source, guide, and Legge layered.",
      },
      {
        questionZh: "5.11 发生了什么？",
        questionEn: "What happens in 5.11?",
        answerZh: "子贡说：我不欲人之加诸我，吾亦欲无加诸人。老师说：赐也，非尔所及也。这是朝向恕的志向，不是佞的场景。请与 15.23 并读，不要互相改写成另一篇。",
        answerEn: "Zi Gong states that what he does not want done to himself he also wishes not to do to others. The Master replies that Ts'ze has not attained that. It is an aspiration toward reciprocity, not a 佞 scene. Pair it with 15.23 rather than rewriting either as the other.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "FAQ 之后——接着打开子贡索引",
        headingEn: "After FAQ — open the Zi Gong index",
        bodyZh: [
          "当你想把提到他的章句放在同一页读，请打开[子贡](https://www.lunyu.ai/zh-Hans/index/zi-gong)。索引负责判断与选篇；这一篇跟着问出恕、言语科而不等于佞、瑚琏之器、以及「尚未及」的那一句走。你回到那里再读这几处；引用时请写明篇章网址，并说明用的是原文、导读还是英译。",
        ],
        bodyEn: [
          "When you want the passages that name him on one screen, open [Zi Gong](https://www.lunyu.ai/en/index/zi-gong). The index judges and selects; this Note followed the question that yields 恕, the speech grouping without 佞, the vessel image, and the not-yet-attained sentence. Read the doors again there in context, and when you quote any of them, give the passage URL and say whether you used the source, the guide, or Legge.",
        ],
      },
    ],
  },
  {
    slug: "gongxi-hua-in-the-analects",
    titleZh: "《论语》里的公西华：善于礼仪，敢于发问",
    titleEn: "Who Was Gongxi Hua in the Analects? Ritual Skill and an Honest Question",
    dekZh: "在《论语》里，公西华（又称赤、子华；Legge 作 Kung-hsi Hwa、Ch'ih、Tsze-hwa）是长于礼仪形式的弟子：可以束带立于朝，与宾客言。你会看见书承认他的这份本事，却不肯把更大的那个字给他。而他最好的时刻并不在典礼上，而在两句准确的话里：他说出弟子学不到的是什么；老师对两个学生给了相反的回答时，他坦白说「赤也惑」。这一篇跟着他走五处活页章句。它不是冉有或子路的笔记；他们只在公西华自己的那一句需要时出现。",
    dekEn: "In the Analects, Gongxi Hua (公西华; also called 赤, Ch'ih, and 子华, Tsze-hwa) is the disciple of form: a man fit to stand sashed at court and speak with guests. You watch the book grant him that skill and then withhold a larger word from him. Yet his best moments are not ceremonies. They are two exact remarks: he names what disciples cannot learn, and he says \"I am perplexed\" when the Master gives two students opposite answers. This Note follows him through five live passages. It is not a Ran You or Zi Lu Note; they appear here only where Gongxi Hua's own line needs them.",
    descriptionZh: "《论语》里的公西华善于礼仪，敢于发问。书承认本事，却不称之为仁。五处活页，链回可核对的原文。",
    descriptionEn: "Gongxi Hua in the Analects: ritual skill at court, an honest question, and five live passages linked back to the source.",
    datePublished: "2026-10-24",
    dateModified: "2026-10-24",
    tagsZh: ["公西华", "公西赤", "公冶长"],
    tagsEn: ["gongxi hua", "Gongxi Hua", "Kung-ye Ch'ang"],
    related: [
      "/analects/gong-ye-chang/gong-ye-chang-007",
      "/index/gongxi-hua",
      "/analects/xian-jin/xian-jin-025",
      "/analects/shu-er/shu-er-033",
      "/analects/xian-jin/xian-jin-021",
      "/analects/yong-ye/yong-ye-003",
    ],
    cover: notesBlogImage(
      "gongxi-hua-in-the-analects",
      "cover.png",
      "A dark robe and black cap folded on a mat beside quiet temple steps — ready to serve as a small assistant",
      "黑色礼服与黑冠叠放在庙阶旁的席上——愿为小相",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "gongxi-hua-in-the-analects",
        "inline-1.png",
        "A small oil lamp still burning low beside a well-worn study mat before dawn — effort that does not tire",
        "黎明前，旧席旁一盏小油灯仍低低亮着——为之不厌",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "gongxi-hua-in-the-analects",
        "inline-2.png",
        "A footpath splitting in two at a low stone, one way uphill and one way down — two answers for two walkers",
        "小路在一块矮石前分成两条，一条上坡、一条下坡——两人两答",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "可使与宾客言——「不知其仁也」",
        headingEn: "Fit for court — and \"I do not know whether he is perfectly virtuous\"",
        bodyZh: [
          "请你从[论语 · 公冶长 5.7](https://www.lunyu.ai/zh-Hans/analects/gong-ye-chang/gong-ye-chang-007)开始。孟武伯连问三位弟子，请你只看第三位。原文关于他的一句是：赤也何如。子曰，赤也，束带立于朝，可使与宾客言也，不知其仁也。活页白话导读作：孟武伯又问：公西赤怎么样？孔子说：公西赤嘛，让他穿戴整齐，束好衣带，站在朝廷上，可以让他去接待宾客办理交涉，至于他是不是仁，我就不知道了。",
          "活页 Legge 作：\"What do you say of Ch'ih?\" The Master replied, \"With his sash girt and standing in a court, Ch'ih might be employed to converse with the visitors and guests, but I do not know whether he is perfectly virtuous.\" 你在一句话里得到两件事：一份真实可用的能力，以及不肯把这份能力称为「仁」。书没有贬低这份本事，只是不让本事顶替那个更大的字。",
        ],
        bodyEn: [
          "Start with [The Analects · Kung-ye Ch'ang 5.7](https://www.lunyu.ai/en/analects/gong-ye-chang/gong-ye-chang-007). Meng Wu asks about three disciples; keep your eye on the third. The source line on him reads 赤也何如。子曰，赤也，束带立于朝，可使与宾客言也，不知其仁也。 The modern guide on that page says: 孟武伯又问：公西赤怎么样？孔子说：公西赤嘛，让他穿戴整齐，束好衣带，站在朝廷上，可以让他去接待宾客办理交涉，至于他是不是仁，我就不知道了。",
          "Legge on the same page: \"What do you say of Ch'ih?\" The Master replied, \"With his sash girt and standing in a court, Ch'ih might be employed to converse with the visitors and guests, but I do not know whether he is perfectly virtuous.\" You get two things in one sentence: a real, usable competence, and a refusal to call that competence 仁. The book does not mock the skill. It simply will not let skill stand in for the larger word.",
        ],
      },
      {
        headingZh: "他自己的志向：愿为宗庙小相",
        headingEn: "His own wish: a small assistant at the temple",
        bodyZh: [
          "[论语 · 先进 11.25](https://www.lunyu.ai/zh-Hans/analects/xian-jin/xian-jin-025)是四位弟子侍坐、各言其志的一章。活页上的原文与白话导读只到子路作答为止；公西华的回答只见于该页的 Legge 英译，所以这一篇这里只引 Legge。Legge 作：\"What are your wishes, Ch'ih,\" said the Master next to Kung-hsi Hwa. Ch'ih replied, \"I do not say that my ability extends to these things, but I should wish to learn them. At the services of the ancestral temple, and at the audiences of the princes with the sovereign, I should like, dressed in the dark square-made robe and the black linen cap, to act as a small assistant.\"",
          "同一章稍后，Legge 译文里孔子评他：\"Yes; who but princes have to do with ancestral temples, and with audiences but the sovereign? If Ch'ih were to be a small assistant in these services, who could be a great one?\" 请你留意：公西华先把自己说低（只说愿意学），孔子却回答，他说的那份事并不小。此章其余部分属于别的笔记。",
        ],
        bodyEn: [
          "[The Analects · Hsien Tsin 11.25](https://www.lunyu.ai/en/analects/xian-jin/xian-jin-025) is the scene where four disciples sit with the Master and say what they would do if known. On the live page, the source and modern guide stop after Zi Lu's answer; Gongxi Hua's answer appears only in the Legge translation there, so this Note quotes Legge alone for it. Legge: \"What are your wishes, Ch'ih,\" said the Master next to Kung-hsi Hwa. Ch'ih replied, \"I do not say that my ability extends to these things, but I should wish to learn them. At the services of the ancestral temple, and at the audiences of the princes with the sovereign, I should like, dressed in the dark square-made robe and the black linen cap, to act as a small assistant.\"",
          "Later in the same passage, in Legge, the Master comments on him: \"Yes; who but princes have to do with ancestral temples, and with audiences but the sovereign? If Ch'ih were to be a small assistant in these services, who could be a great one?\" Notice what you are given: Gongxi Hua lowers his own claim (\"I should wish to learn them\"), and the Master answers that the work he names is not small. The rest of the scene belongs to other Notes.",
        ],
      },
      {
        headingZh: "「正唯弟子不能学也」",
        headingEn: "\"This is just what we, the disciples, cannot imitate you in\"",
        imageSlot: "inline-1",
        bodyZh: [
          "在[论语 · 述而 7.33](https://www.lunyu.ai/zh-Hans/analects/shu-er/shu-er-033)里，孔子不敢以圣与仁自居，只说自己一直在做。这里请你看公西华的回答。原文是：子曰，若圣与仁，则吾岂敢，抑为之不厌，诲人不倦，则可谓云尔已矣。公西华曰，正唯弟子不能学也。导读作：孔子说：说到圣与仁，那我怎么敢当呢？不过是朝着这个方向去做而永不满足，教导别人而不知疲倦，可以说就是这样罢了。公西华说：这正是我们弟子学不到的地方啊。",
          "Legge 作：Kung-hsi Hwa said, \"This is just what we, the disciples, cannot imitate you in.\" 你能听出这句话为什么要紧：孔子把「不厌、不倦」说成谦退的一点，公西华却指出，听来谦退的这一点恰恰最难。",
        ],
        bodyEn: [
          "In [The Analects · Shu R. 7.33](https://www.lunyu.ai/en/analects/shu-er/shu-er-033) the Master declines the names sage and 仁 for himself and claims only that he keeps at it. The camera here is on Gongxi Hua's reply. The source: 子曰，若圣与仁，则吾岂敢，抑为之不厌，诲人不倦，则可谓云尔已矣。公西华曰，正唯弟子不能学也。 The guide: 孔子说：说到圣与仁，那我怎么敢当呢？不过是朝着这个方向去做而永不满足，教导别人而不知疲倦，可以说就是这样罢了。公西华说：这正是我们弟子学不到的地方啊。",
          "Legge: Kung-hsi Hwa said, \"This is just what we, the disciples, cannot imitate you in.\" You can hear why the line matters. The Master offers \"not tiring\" as the modest part; Gongxi Hua points out that the modest-sounding part is exactly the hard part.",
        ],
      },
      {
        headingZh: "「赤也惑，敢问」",
        headingEn: "\"I, Ch'ih, am perplexed\"",
        imageSlot: "inline-2",
        bodyZh: [
          "[论语 · 先进 11.21](https://www.lunyu.ai/zh-Hans/analects/xian-jin/xian-jin-021)让你看见公西华是那个注意到了的人。子路与冉有问了同一个问题，得到相反的回答。原文中公西华的一段是：公西华曰，由也问闻斯行诸，子曰，有父兄在，求也问闻斯行诸，子曰，闻斯行之，赤也惑，敢问。子曰，求也退，故进之，由也兼人，故退之。导读把他的话译作：我糊涂了，大胆地问一问这是为什么。",
          "Legge 译公西华问话的末句与孔子的回答作：…\"I, Ch'ih, am perplexed, and venture to ask you for an explanation.\" The Master said, \"Ch'iu is retiring and slow; therefore, I urged him forward. Yu has more than his own share of energy; therefore I kept him back.\" 没有他这一问，你手里只有两句互相矛盾的话；因为他承认了困惑，你才得到理由：回答是按人而给的。",
        ],
        bodyEn: [
          "[The Analects · Hsien Tsin 11.21](https://www.lunyu.ai/en/analects/xian-jin/xian-jin-021) shows you Gongxi Hua as the one who noticed. Zi Lu and Ran You ask the same question and get opposite answers. Gongxi Hua's part of the source: 公西华曰，由也问闻斯行诸，子曰，有父兄在，求也问闻斯行诸，子曰，闻斯行之，赤也惑，敢问。子曰，求也退，故进之，由也兼人，故退之。 The guide renders his words: 我糊涂了，大胆地问一问这是为什么。",
          "Legge, from the end of Kung-hsi Hwa's question: …\"I, Ch'ih, am perplexed, and venture to ask you for an explanation.\" The Master said, \"Ch'iu is retiring and slow; therefore, I urged him forward. Yu has more than his own share of energy; therefore I kept him back.\" Without his question, you would have two contradictory sayings. Because he admits confusion, you get the reason: the answer was fitted to the person.",
        ],
      },
      {
        headingZh: "子华使于齐",
        headingEn: "On a mission to Ch'i",
        bodyZh: [
          "[论语 · 雍也 6.3](https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-003)不在公西华索引里，但它以「子华」「赤」称他。原文开头是：子华使于齐，冉子为其母请粟。孔子后来说：赤之适齐也，乘肥马，衣轻裘，吾闻之也，君子周急，不继富。导读作：孔子说：公西赤去齐国，乘的是肥壮的马，穿的是轻暖的皮袍。我听说过，君子只周济急需的人，而不去接济富裕的人。",
          "Legge 作：\"When Ch'ih was proceeding to Ch'i, he had fat horses to his carriage, and wore light furs. I have heard that a superior man helps the distressed, but does not add to the wealth of the rich.\" 从这一门你只取两件事实：他曾出使齐国，出行时颇为充裕。关于周济的教训是孔子的话，针对的是粟该怎么给，不是对公西华的指责。",
        ],
        bodyEn: [
          "[The Analects · Yung Yey 6.3](https://www.lunyu.ai/en/analects/yong-ye/yong-ye-003) is not on the Gongxi Hua index, but it names him as 子华 and 赤. The source opens 子华使于齐，冉子为其母请粟。 and the Master later says 赤之适齐也，乘肥马，衣轻裘，吾闻之也，君子周急，不继富。 The guide: 孔子说：公西赤去齐国，乘的是肥壮的马，穿的是轻暖的皮袍。我听说过，君子只周济急需的人，而不去接济富裕的人。",
          "Legge: \"When Ch'ih was proceeding to Ch'i, he had fat horses to his carriage, and wore light furs. I have heard that a superior man helps the distressed, but does not add to the wealth of the rich.\" Take two facts from this door: he was sent on a mission to Ch'i, and he travelled well provided. The lesson about giving is the Master's, aimed at how grain was handed out, not a charge against Gongxi Hua.",
        ],
      },
      {
        headingZh: "五处合起来看",
        headingEn: "What the five doors add up to",
        bodyZh: [
          "合起来，你看到的是：一位可以立于朝、与宾客言的弟子（5.7），只愿在宗庙与会同之事上做小相（11.25），曾出使齐国（6.3），看出「不厌」正是弟子学不到的（7.33），并且敢问为何两答不同（11.21）。书承认他的礼仪才能，却不称之为仁；在实际上被看重的，是他谦逊而准确的发问。如果你想看 5.7 与 11.21 里冉有的那一面，可以打开[《论语》里的冉有是谁？](https://www.lunyu.ai/zh-Hans/blogs/ran-you-in-the-analects)——仅作软链接。",
          "以下是你自己的反思，不是孔子的话：你也许正是擅长形式的人——议程、礼数、一场会该怎么开。《论语》把这当作真实的能力，但不说它就是德的全部。公西华的另一份长处人人可学：两条指示看似冲突时，直说出来，然后发问。",
        ],
        bodyEn: [
          "Put them together and you have a disciple fit for court and guests (5.7), who wishes only to be a small assistant at temple and audience (11.25), who is sent to Ch'i (6.3), who sees that \"not tiring\" is what disciples cannot learn (7.33), and who asks why two answers differ (11.21). The book grants his ritual skill and does not call it 仁. What it praises in practice is his modest, exact question. If you want Ran You's side of 5.7 and 11.21, open [Who Was Ran You in the Analects?](https://www.lunyu.ai/en/blogs/ran-you-in-the-analects) — a soft link only.",
          "As your own reflection — not as Confucius's words — you may be the person who is good at forms: agendas, protocol, how a meeting should run. The Analects treats that as real ability and stops short of calling it the whole of virtue. Gongxi Hua's other gift is open to anyone: when two instructions seem to clash, say so plainly and ask.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的公西华是谁？",
        questionEn: "Who was Gongxi Hua in the Analects?",
        answerZh: "他是孔子的弟子，书中称公西华、赤、子华。活页章句显示：他可以立于朝、与宾客言（5.7），愿在礼仪之事上做小相（11.25），曾出使齐国（6.3）。请到各篇章页核对，并说明你用的是原文、导读还是 Legge。",
        answerEn: "He is a disciple of Confucius, named in the book as 公西华, 赤 (Ch'ih), and 子华 (Tsze-hwa). The live passages show him fit to stand at court and speak with guests (5.7), wishing to serve as a small assistant at ritual (11.25), and sent on a mission to Ch'i (6.3). Check each line on its passage page and say whether you used the source, the guide, or Legge.",
      },
      {
        questionZh: "孔子说过公西华是仁者吗？",
        questionEn: "Did Confucius call Gongxi Hua ren?",
        answerZh: "没有。在 5.7 里孔子说赤可以束带立于朝、与宾客言，接着说「不知其仁也」——Legge 作 \"but I do not know whether he is perfectly virtuous.\" 书承认这份本事，却不给出「仁」字。",
        answerEn: "No. In 5.7 the Master says Ch'ih could converse with visitors and guests at court, then adds 不知其仁也 — in Legge, \"but I do not know whether he is perfectly virtuous.\" The book grants the skill and withholds the word 仁.",
      },
      {
        questionZh: "公西华在 7.33 说了什么？",
        questionEn: "What did Gongxi Hua say in 7.33?",
        answerZh: "孔子只说自己为之不厌、诲人不倦，公西华答：「正唯弟子不能学也」——Legge 作 \"This is just what we, the disciples, cannot imitate you in.\" 他指出持久的用功才是难处。",
        answerEn: "After the Master claims only that he works without tiring and teaches without weariness, Gongxi Hua replies 正唯弟子不能学也 — in Legge, \"This is just what we, the disciples, cannot imitate you in.\" He names the steady effort as the hard part.",
      },
      {
        questionZh: "公西华在 11.21 为什么说自己困惑？",
        questionEn: "Why did Gongxi Hua say he was perplexed in 11.21?",
        answerZh: "因为子路和冉有问了同一个问题，却得到相反的回答。他说「赤也惑，敢问」，孔子解释：冉求退缩，所以鼓励他；仲由勇气过人，所以约束他。正是他这一问让理由显现出来。",
        answerEn: "Because Zi Lu and Ran You asked the same question and got opposite answers. He said 赤也惑，敢问, and the Master explained that he urged Ran You forward and held Zi Lu back. His question is what makes the reason visible.",
      },
      {
        questionZh: "公西华在 11.25 的志向是什么？",
        questionEn: "What did Gongxi Hua wish for in 11.25?",
        answerZh: "据活页上的 Legge 英译，他愿意身着礼服，在宗庙之事与诸侯会同时 \"to act as a small assistant\"。该页原文与导读在他作答之前就结束了，所以这一段请引用 Legge。",
        answerEn: "In Legge's translation on the live page, he says he would like, in ritual dress, \"to act as a small assistant\" at the ancestral temple and at audiences. On that page the source and guide stop before his answer, so quote Legge for this part.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接着打开公西华索引",
        headingEn: "Open the Gongxi Hua index next",
        bodyZh: [
          "当你想把提到他的章句放在同一页读，请打开[公西华](https://www.lunyu.ai/zh-Hans/index/gongxi-hua)。索引收束志向与礼仪事务；这一篇跟着礼仪才能与诚实的发问走，并在索引之外补了 6.3。你回到那里再读这几处；引用时请写明篇章网址，并说明用的是原文、导读还是英译。",
        ],
        bodyEn: [
          "When you want the passages that name him on one screen, open [Gongxi Hua](https://www.lunyu.ai/en/index/gongxi-hua). The index groups aspiration and ritual service; this Note followed ritual skill and the honest question, and added 6.3 from outside the index. Read the doors again there in context, and when you quote any of them, give the passage URL and say whether you used the source, the guide, or Legge.",
        ],
      },
    ],
  },
  {
    slug: "tang-wen-wu-zhou-gong-in-the-analects",
    titleZh: "《论语》里的汤、文、武、周公：斯文在人",
    titleEn: "Tang, King Wen, King Wu, and the Duke of Zhou in the Analects: A Culture Carried in People",
    dekZh: "在《论语》里，汤、文王、武王、周公（Tang, King Wen, King Wu, and the Duke of Zhou）不是一张帝王名单。你遇见的，是孔子自认承接的那一脉「文」，而书说这脉文只活在人身上。可同一部书仍按德行、而不是按权势或才能，给这些先王打分。这一篇跟着这两步走八处活页章句。它不是商周史，也不是周公传。",
    dekEn: "In the Analects, Tang, King Wen, King Wu, and the Duke of Zhou are not a king list. You meet them as the line of 文 — culture, pattern — that Confucius believes he carries, and that the book says lives on only in people. Yet the same book keeps grading these founders by virtue, not by power or gift. This Note follows that double move through eight live passages. It is not a dynastic history and not a Zhou Gong biography.",
    descriptionZh: "《论语》里的汤、文、武、周公不是帝王名单：斯文在人，书仍按德行打分。八处活页，链回可核对的原文。",
    descriptionEn: "Tang, King Wen, King Wu, and the Duke of Zhou in the Analects are not a king list: a culture carried in people, still graded by virtue.",
    datePublished: "2026-10-20",
    dateModified: "2026-10-20",
    tagsZh: ["汤文武周公", "周公", "述而"],
    tagsEn: ["tang wen wu", "Duke of Zhou", "Shu R."],
    related: [
      "/analects/shu-er/shu-er-005",
      "/index/tang-wen-wu-zhougong",
      "/analects/zi-han/zi-han-005",
      "/analects/zi-zhang/zi-zhang-022",
      "/analects/tai-bo/tai-bo-020",
      "/analects/ba-yi/ba-yi-025",
      "/analects/tai-bo/tai-bo-011",
      "/analects/yan-yuan/yan-yuan-022",
      "/analects/yao-yue/yao-yue-001",
    ],
    cover: notesBlogImage(
      "tang-wen-wu-zhou-gong-in-the-analects",
      "cover.png",
      "A lit lamp passing its flame across a dim threshold to a second lamp — a culture passed from hand to hand",
      "昏暗门槛间，一盏灯的火正传向另一盏——斯文在人，手手相传",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "tang-wen-wu-zhou-gong-in-the-analects",
        "inline-1.png",
        "Many hands of different ages each holding a small piece of the same woven pattern — the way of Wen and Wu kept among people",
        "老少不同的许多手，各执同一幅织纹的一小段——文武之道，在人",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "tang-wen-wu-zhou-gong-in-the-analects",
        "inline-2.png",
        "A finely made bronze vessel set on a balance scale against a small plain bowl, the scale tipping toward the plain bowl",
        "精美的青铜器与一只朴素小碗同置天平，天平却偏向小碗",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "不复梦见周公",
        headingEn: "No longer dreaming of the Duke of Zhou",
        bodyZh: [
          "请你从[论语 · 述而 7.5](https://www.lunyu.ai/zh-Hans/analects/shu-er/shu-er-005)开始，因为这里孔子拿周公来量自己。原文是：子曰，甚矣吾衰也，久矣，吾不复梦见周公。活页白话导读作：孔子说：我衰老得多么厉害啊！我已经很久没有再梦见周公了。",
          "活页 Legge 作：The Master said, \"Extreme is my decay. For a long time, I have not dreamed, as I was wont to do, that I saw the duke of Chau.\"（Legge 的 Chau 即周，下文 Wan 即文。）你应留意衰老拿什么来量：不是失位，不是体力，而是周公不再入梦。",
        ],
        bodyEn: [
          "Start with [The Analects · Shu R. 7.5](https://www.lunyu.ai/en/analects/shu-er/shu-er-005), because here you see Confucius measure himself by the Duke of Zhou. The source reads 子曰，甚矣吾衰也，久矣，吾不复梦见周公。 The modern guide on that page says: 孔子说：我衰老得多么厉害啊！我已经很久没有再梦见周公了。",
          "Legge on the same page: The Master said, \"Extreme is my decay. For a long time, I have not dreamed, as I was wont to do, that I saw the duke of Chau.\" (Legge's \"Chau\" is Zhou; his \"Wan,\" below, is Wen.) You should notice what the decline is measured against: not lost office or lost strength, but a figure who no longer visits him.",
        ],
      },
      {
        headingZh: "文不在兹乎",
        headingEn: "\"Was not the culture lodged here?\"",
        bodyZh: [
          "[论语 · 子罕 9.5](https://www.lunyu.ai/zh-Hans/analects/zi-han/zi-han-005)把你带进危境。原文是：子畏于匡。曰，文王既没，文不在兹乎。天之将丧斯文也，后死者不得与于斯文也，天之未丧斯文也，匡人其如予何。导读作：孔子在匡地被围困而感到危惧，他说：周文王去世以后，文化传统不都在我这里吗？上天如果要消灭这种文化，那我这后死的人就不会掌握这文化了；上天既然不消灭这种文化，匡人又能把我怎么样呢？",
          "你听得很清楚：文王已没，他所代表的「文」如今寄在一个被围的活人身上。先王在这里是可以承接的东西，不是墙上的画像。",
        ],
        bodyEn: [
          "[The Analects · Tsze Han 9.5](https://www.lunyu.ai/en/analects/zi-han/zi-han-005) puts you in danger with him. The source: 子畏于匡。曰，文王既没，文不在兹乎。天之将丧斯文也，后死者不得与于斯文也，天之未丧斯文也，匡人其如予何。 The guide: 孔子在匡地被围困而感到危惧，他说：周文王去世以后，文化传统不都在我这里吗？上天如果要消灭这种文化，那我这后死的人就不会掌握这文化了；上天既然不消灭这种文化，匡人又能把我怎么样呢？",
          "Legge renders the core line as: *After the death of King Wan, was not the cause of truth lodged here in me?* You hear the claim plainly: King Wen is dead, and the 文 he stood for now rests in a living man under siege. The founder matters here as something you can carry, not as a portrait on a wall.",
        ],
      },
      {
        headingZh: "未坠于地，在人",
        headingEn: "\"It has not fallen to the ground; it is in people\"",
        imageSlot: "inline-1",
        bodyZh: [
          "[论语 · 子张 19.22](https://www.lunyu.ai/zh-Hans/analects/zi-zhang/zi-zhang-022)让你从旁人口中听同一个答案。原文是：卫公孙朝问于子贡曰，仲尼焉学。子贡曰，文，武之道，未坠于地，在人。贤者识其大者，不贤者识其小者，莫不有文，武之道焉。夫子焉不学。而亦何常师之有。导读作：卫国的公孙朝问子贡说：仲尼的学问是从哪里学来的？子贡说：周文王、周武王之道，并没有失传坠地，还留存在人们中间。",
          "请你抓住位置：文武之道不藏在宫里，而在寻常人中间，贤者记其大，不贤者记其小。所以在子贡的说法里，孔子何处不学。",
        ],
        bodyEn: [
          "[The Analects · Tsze-chang 19.22](https://www.lunyu.ai/en/analects/zi-zhang/zi-zhang-022) gives you Zi Gong's answer to the same question from outside. The source: 卫公孙朝问于子贡曰，仲尼焉学。子贡曰，文，武之道，未坠于地，在人。贤者识其大者，不贤者识其小者，莫不有文，武之道焉。夫子焉不学。而亦何常师之有。 The guide: 卫国的公孙朝问子贡说：仲尼的学问是从哪里学来的？子贡说：周文王、周武王之道，并没有失传坠地，还留存在人们中间。",
          "Legge renders Zi Gong's reply as: *The doctrines of Wan and Wu have not yet fallen to the ground. They are to be found among men.* You should keep the location in view: the way of Wen and Wu is not stored in a palace; it is held by ordinary people, greater parts by the worthy and smaller parts by others. That is why, in Zi Gong's telling, Confucius could learn from everyone.",
        ],
      },
      {
        headingZh: "周之德，至德",
        headingEn: "Zhou's virtue called the highest",
        bodyZh: [
          "[论语 · 泰伯 8.20](https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-020)以舜开篇，但请你只看后半（尧舜禹另有笔记）。原文续作：武王曰，予有乱臣十人。……三分天下有其二，以服事殷，周之德，其可谓至德也已矣。导读作：周武王说：我有十位能治理天下的能臣。……周文王得了天下的三分之二，仍然向殷商称臣事奉。周朝的德行，可以说是最高尚的了。",
          "你看见「至德」靠的是什么：不是据有三分之二，而是据有之后仍然服事。",
        ],
        bodyEn: [
          "[The Analects · T'ai-po 8.20](https://www.lunyu.ai/en/analects/tai-bo/tai-bo-020) opens with Shun, but keep your eyes on its second half (the Yao–Shun–Yu line has its own Note). The source continues: 武王曰，予有乱臣十人。……三分天下有其二，以服事殷，周之德，其可谓至德也已矣。 The guide: 周武王说：我有十位能治理天下的能臣。……周文王得了天下的三分之二，仍然向殷商称臣事奉。周朝的德行，可以说是最高尚的了。",
          "Legge: \"King Wan possessed two of the three parts of the empire, and with those he served the dynasty of Yin. The virtue of the house of Chau may be said to have reached the highest point indeed.\" You see what earns the word 至德: not holding two thirds, but holding them and still serving.",
        ],
      },
      {
        headingZh: "书仍在给先王打分",
        headingEn: "The book still grades its founders",
        imageSlot: "inline-2",
        bodyZh: [
          "这里《论语》不奉承。[论语 · 八佾 3.25](https://www.lunyu.ai/zh-Hans/analects/ba-yi/ba-yi-025)原文是：子谓韶，尽美矣，又尽善也，谓武，尽美矣，未尽善也。导读作：孔子谈到《韶》乐，说：美到极点了，又善到极点了。谈到《武》乐，说：美到极点了，却还没有善到极点。请你只停在这句评断上：《武》乐以武王为名，仍未尽善。",
          "[论语 · 泰伯 8.11](https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-011)把同一把尺放到才能上。原文是：子曰，如有周公之才之美，使骄且吝，其余不足观也已。导读作：孔子说：一个人即使有周公那样美好的才能，如果他骄傲又吝啬，那其余方面也就不值得一看了。你会发现，周公是这句话能举出的最高才能——即便如此，单有才能仍不够。",
        ],
        bodyEn: [
          "Here the Analects refuses to flatter. In [The Analects · Pa Yih 3.25](https://www.lunyu.ai/en/analects/ba-yi/ba-yi-025), the source reads 子谓韶，尽美矣，又尽善也，谓武，尽美矣，未尽善也。 The guide: 孔子谈到《韶》乐，说：美到极点了，又善到极点了。谈到《武》乐，说：美到极点了，却还没有善到极点。 Legge: The Master said of the Shao that it was perfectly beautiful and also perfectly good. He said of the Wu that it was perfectly beautiful but not perfectly good. You should keep this to the judgment itself: the Wu music is named for King Wu, and even it falls short of 尽善.",
          "[The Analects · T'ai-po 8.11](https://www.lunyu.ai/en/analects/tai-bo/tai-bo-011) applies the same scale to gifts. The source: 子曰，如有周公之才之美，使骄且吝，其余不足观也已。 The guide: 孔子说：一个人即使有周公那样美好的才能，如果他骄傲又吝啬，那其余方面也就不值得一看了。 Legge: The Master said, \"Though a man have abilities as admirable as those of the Duke of Chau, yet if he be proud and niggardly, those other things are really not worth being looked at.\" You notice that the Duke of Zhou is the highest measure of ability the sentence can name — and still ability alone is not enough.",
        ],
      },
      {
        headingZh: "汤：举贤，担过",
        headingEn: "Tang: the worthy raised, the fault taken on",
        bodyZh: [
          "汤出场很少。在[论语 · 颜渊 12.22](https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-022)里，子夏说：汤有天下，选于众，擧伊尹，不仁者远矣——汤从众人中举用伊尹，不仁的人就远离了。",
          "[论语 · 尧曰 20.1](https://www.lunyu.ai/zh-Hans/analects/yao-yue/yao-yue-001)有一段祷辞，活页导读归于商汤：商汤说：我小子履…… 你该记住的原文是：朕躬有罪，无以万方，万方有罪，罪在朕躬。同章导读还把一句归于武王：周武王说：我虽然有至亲，都不如有仁德的人。百姓如果有过错，都归在我一人身上。你看见先王的位置被写成担过，而不是揽功。",
          "读索引时请留意一处：16.11「见不善如探汤」的「汤」是滚烫的水，不是商汤。",
        ],
        bodyEn: [
          "Tang appears briefly. In [The Analects · Yen Yuan 12.22](https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-022), Zi Xia says 汤有天下，选于众，擧伊尹，不仁者远矣 — Tang raised Yi Yin from the many, and those without ren kept away.",
          "[The Analects · Yao Yueh 20.1](https://www.lunyu.ai/en/analects/yao-yue/yao-yue-001) gives you a prayer that the live guide assigns to Tang: 商汤说：我小子履…… The source line you should hold is 朕躬有罪，无以万方，万方有罪，罪在朕躬。 Legge renders it: *If, in my person, I commit offences, they are not to be attributed to you, the people of the myriad regions. If you in the myriad regions commit offences, these offences must rest on my person.* The same passage's guide gives a parallel line to King Wu: 周武王说：我虽然有至亲，都不如有仁德的人。百姓如果有过错，都归在我一人身上。 You see the founder's role framed as bearing blame, not claiming credit.",
          "One caution as you read the index: in 16.11, 见不善如探汤, 汤 means boiling water (Legge: \"thrusting the hand into boiling water\"), not King Tang.",
        ],
      },
      {
        headingZh: "这一脉合起来说了什么",
        headingEn: "What the line adds up to",
        bodyZh: [
          "把这几扇门合起来：以不复梦见周公量己之衰（7.5），文王既没而文在兹（9.5），文武之道在人（19.22），周之至德在强而仍事殷（8.20），以及仍给武乐（3.25）与周公之才（8.11）打分的一部书。若你要更早的圣王，可开一次[《论语》里的尧、舜、禹是谁？](https://www.lunyu.ai/zh-Hans/blogs/yao-shun-yu-in-the-analects)——只作软链。",
          "作为你自己的体会——不是孔子的原话——请留意：你多轻易把「圣王」当成一串古人的名字。《论语》却一再把他们变成活人必须承接、也可能辜负的标准。",
        ],
        bodyEn: [
          "Put the doors together: a man who measures his decline by a dream of the Duke of Zhou (7.5), a culture lodged in him after King Wen (9.5), a way of Wen and Wu kept among people (19.22), Zhou's highest virtue in serving while strong (8.20), and a book that still grades King Wu's music (3.25) and the Duke of Zhou's gifts (8.11). If you want the earlier sage kings, open [Who Are Yao, Shun, and Yu in the Analects?](https://www.lunyu.ai/en/blogs/yao-shun-yu-in-the-analects) — one soft link.",
          "As your own reflection — not as Confucius's words — notice how easily you treat \"sage kings\" as a list of ancient names. The Analects keeps making them a standard that living people must carry, and can fail.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的汤、文、武、周公是谁？",
        questionEn: "Who are Tang, King Wen, King Wu, and the Duke of Zhou in the Analects?",
        answerZh: "站内索引的说明是：「三代圣王与周公，是礼乐、德政和制度传承的象征。」在章句里，你遇见他们，与其说是史书里的君王，不如说是孔子自认承接的那一脉文（7.5、9.5），以及书仍在打分的标准（3.25、8.11）。每一句请回活页核对，并说明用的是原文、导读还是英译。",
        answerEn: "The site's index describes them as \"Sage rulers and the Duke of Zhou, symbols of ritual order, virtue, and institutions.\" In the passages themselves you meet them less as rulers in a chronicle than as the line of 文 Confucius thinks he carries (7.5, 9.5) and as a standard the book still grades (3.25, 8.11). Check each line on its passage page and say whether you quote the source, the guide, or Legge.",
      },
      {
        questionZh: "7.5「吾不复梦见周公」是什么意思？",
        questionEn: "What does 吾不复梦见周公 mean in 7.5?",
        answerZh: "你读到的是孔子自己量衰老的尺。原文：甚矣吾衰也，久矣，吾不复梦见周公。活页导读：我衰老得多么厉害啊！我已经很久没有再梦见周公了。Legge 多出 as I was wont to do，你可听出这种梦从前是常有的。导读与英译都是对原句的读法，不是孔子多说的话。",
        answerEn: "You are reading Confucius's own measure of decline. The source: 甚矣吾衰也，久矣，吾不复梦见周公. The live guide: 我衰老得多么厉害啊！我已经很久没有再梦见周公了. Legge adds \"as I was wont to do,\" so you hear that such dreams were once usual. The guide and Legge are readings of the line, not extra words of Confucius.",
      },
      {
        questionZh: "9.5「文不在兹乎」指什么？",
        questionEn: "What is 文不在兹乎 in 9.5?",
        answerZh: "在匡被围时，孔子说文王既没，「文」就在这里。活页导读读作「文化传统不都在我这里吗」；Legge 把「文」译作 the cause of truth。请你守住原文的「文」字，把两种译法都当作解读。",
        answerEn: "Surrounded in Kuang, Confucius says that after King Wen died, the 文 rests \"here.\" The live guide reads it as 文化传统不都在我这里吗; Legge renders 文 as \"the cause of truth.\" You should keep the source word 文 in view and treat both renderings as interpretations.",
      },
      {
        questionZh: "《论语》对武王是一味称颂吗？",
        questionEn: "Does the Analects praise King Wu without reservation?",
        answerZh: "不是。3.25 说《武》乐「尽美矣，未尽善也」，《韶》则尽美又尽善。请把它当作对以武王为名之乐的评断；本篇不展开乐论。",
        answerEn: "No. In 3.25, the Wu music is 尽美矣，未尽善也 — perfectly beautiful but not perfectly good — while the Shao is both. Treat that as a judgment on the music named for King Wu; this Note does not open a wider music essay.",
      },
      {
        questionZh: "16.11 的「汤」是商汤吗？",
        questionEn: "Is the 汤 in 16.11 King Tang?",
        answerZh: "不是。「见不善如探汤」，活页导读解作把手伸进滚烫的水里，Legge 作 boiling water。作为君王的汤见于 12.22，以及按活页导读的归属见于 20.1。",
        answerEn: "No. In 见不善如探汤, the live guide explains it as reaching into scalding water, and Legge has \"boiling water.\" Tang the king appears in 12.22 and, by the live guide's attribution, in 20.1.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "下一步打开索引",
        headingEn: "Open the index next",
        bodyZh: [
          "想在一屏里看到归在这四个名字下的全部章句，请打开[汤、文、武、周公](https://www.lunyu.ai/zh-Hans/index/tang-wen-wu-zhougong)。索引是带引文的短列表；本篇只跟着「斯文在人」与从不停止的打分走。请你回到那里按上下文重读各门，引用任何一句时，给出章句 URL，并说明用的是原文、导读还是英译。",
        ],
        bodyEn: [
          "When you want every passage grouped under these four names on one screen, open [Tang, King Wen, King Wu, and the Duke of Zhou](https://www.lunyu.ai/en/index/tang-wen-wu-zhougong). The index is a short list with quotes; this Note only followed the culture carried in people and the grading that never stops. Read the doors again there in context, and when you quote any of them, give the passage URL and say whether you used the source, the guide, or Legge.",
        ],
      },
    ],
  },
  {
    slug: "state-of-lu-in-the-analects",
    titleZh: "《论语》里的鲁国：近于道的那一变",
    titleEn: "The State of Lu in the Analects: The Near Measure",
    dekZh: "在《论语》里，鲁（State of Lu / 鲁国）不只是地图上的故国。你看见书把鲁当作一把近尺：齐一变可至鲁，鲁一变可至道；鲁卫之政如兄弟；归鲁之后乐才得正。这一篇跟着「近于道的那一变」走七处活页章句。它不是鲁哀公、鲁定公的人物传——那两篇 Who-Notes 已经各自成文。",
    dekEn: "In the Analects, the State of Lu (鲁) is not only Confucius's home on a map. You watch the book use Lu as a near measure: closer to the Way than Ch'i by one change, kin to Wei in government, and the place the book returns to when music and order must be set right. This Note follows that measure across seven live passages. It is not a biography of Duke Ai or Duke Ding — those Who-Notes already stand alone.",
    descriptionZh: "《论语》里的鲁国是一把近尺：齐一变至于鲁，鲁一变至于道。七处活页，链回可核对的原文。",
    descriptionEn: "The State of Lu in the Analects is a near measure: one change short of the Way. Seven live doors.",
    datePublished: "2026-10-19",
    dateModified: "2026-10-19",
    tagsZh: ["鲁", "鲁国", "雍也"],
    tagsEn: ["lu", "State of Lu", "Yung Yey"],
    related: [
      "/analects/yong-ye/yong-ye-022",
      "/index/lu",
      "/analects/zi-lu/zi-lu-007",
      "/analects/zi-han/zi-han-014",
      "/analects/ba-yi/ba-yi-023",
      "/analects/gong-ye-chang/gong-ye-chang-002",
      "/analects/wei-zi/wei-zi-010",
      "/analects/xian-jin/xian-jin-013",
    ],
    cover: notesBlogImage(
      "state-of-lu-in-the-analects",
      "cover.jpg",
      "Three unmarked stepping stones in mist — a nearer measure on the path toward the Way",
      "雾里三块无字踏石——通向道的近一阶",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "state-of-lu-in-the-analects",
        "inline-1.jpg",
        "Travel packs set down beside quiet bells and a music stand — home again, pieces finding their places",
        "行囊放在静铃与琴架旁——归后，曲各得其所",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "state-of-lu-in-the-analects",
        "inline-2.jpg",
        "An old treasury gate left standing while new timber waits unused nearby",
        "旧库门仍立着，新木料闲置一旁",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "一变：齐至于鲁，鲁至于道",
        headingEn: "One change: Ch'i to Lu, Lu to the Way",
        bodyZh: [
          "请你从[论语 · 雍也 6.22](https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-022)开始，因为这里鲁被放在一把尺子上。原文是：子曰，齐一变，至于鲁，鲁一变，至于道。活页白话导读作：孔子说：齐国的政教风俗一加变革，就可以达到鲁国的样子；鲁国一加变革，就可以达到合乎先王之道的境界。",
          "活页 Legge 作：The Master said, \"Ch'i, by one change, would come to the State of Lu. Lu, by one change, would come to a State where true principles predominated.\" 你应听出层级：齐距鲁一变，鲁距道又一变。这是书自己的近尺——不是鲁廷游记。",
        ],
        bodyEn: [
          "Start with [The Analects · Yung Yey 6.22](https://www.lunyu.ai/en/analects/yong-ye/yong-ye-022), because here you hear Lu placed on a scale. The source reads 子曰，齐一变，至于鲁，鲁一变，至于道。 The modern guide on that page says: 孔子说：齐国的政教风俗一加变革，就可以达到鲁国的样子；鲁国一加变革，就可以达到合乎先王之道的境界。",
          "Legge on the same page: The Master said, \"Ch'i, by one change, would come to the State of Lu. Lu, by one change, would come to a State where true principles predominated.\" You should hear the stack: Ch'i is one change from Lu; Lu is one change from 道. That is the book's own near measure — not a travelogue of the Lu court.",
        ],
      },
      {
        headingZh: "兄弟之政：鲁与卫",
        headingEn: "Brothers in government: Lu and Wei",
        bodyZh: [
          "[论语 · 子路 13.7](https://www.lunyu.ai/zh-Hans/analects/zi-lu/zi-lu-007)请你把鲁与另一国并置来看，而不是单独抬高。原文是：子曰，鲁衞之政，兄弟也。引用时请保留活页上的「衞」。导读作：孔子说：鲁国和卫国的政事，就像兄弟一样相近。",
          "你得到的是政风上的兄弟关系，不是两国史的合并本。请你把这一门当作尺子上的第二个刻度：鲁不是孤悬的理想，它与卫并肩而立。",
        ],
        bodyEn: [
          "[The Analects · Tsze-lu 13.7](https://www.lunyu.ai/en/analects/zi-lu/zi-lu-007) pairs Lu with another state instead of ranking it alone. The source: 子曰，鲁衞之政，兄弟也。 Keep the live page's 衞 when you quote. The guide: 孔子说：鲁国和卫国的政事，就像兄弟一样相近。",
          "Legge: The Master said, \"The governments of Lu and Wei are brothers.\" You get kinship of polity, not a merged history of two courts. Hold this door as a second mark on the measure: Lu is not an isolated ideal; it stands next to Wei as brothers stand.",
        ],
      },
      {
        headingZh: "反鲁——然后乐正",
        headingEn: "Return to Lu — then the music is set right",
        imageSlot: "inline-1",
        bodyZh: [
          "[论语 · 子罕 9.14](https://www.lunyu.ai/zh-Hans/analects/zi-han/zi-han-014)请你听它怎样把鲁写成归处。原文是：子曰，吾自衞反鲁，然后乐正，雅颂各得其所。导读作：孔子说：我从卫国返回鲁国以后，才把乐曲整理端正，使《雅》《颂》各得其应有的位置。",
          "请你抓住「反鲁 → 然后乐正」。更完整的「乐」主题笔记另有计划；这里只要鲁作为归后整理落地的地方。",
        ],
        bodyEn: [
          "[The Analects · Tsze Han 9.14](https://www.lunyu.ai/en/analects/zi-han/zi-han-014) lets you hear Lu as the place of return — listen for the order of the sentence. The source: 子曰，吾自衞反鲁，然后乐正，雅颂各得其所。 The guide: 孔子说：我从卫国返回鲁国以后，才把乐曲整理端正，使《雅》《颂》各得其应有的位置。",
          "Legge: The Master said, \"I returned from Wei to Lu, and then the music was reformed, and the pieces in the Royal songs and Praise songs all found their proper places.\" You should keep the camera on return → then music right. A fuller Music (Yue) Note is planned elsewhere; here Lu is the home where reform lands.",
        ],
      },
      {
        headingZh: "语鲁大师乐",
        headingEn: "Teaching Lu's music-master",
        bodyZh: [
          "[论语 · 八佾 3.23](https://www.lunyu.ai/zh-Hans/analects/ba-yi/ba-yi-023)仍把你留在鲁的礼乐声里。原文是：子语鲁大师乐曰，乐其可知也，始作，翕如也，从之，纯如也，缴如也，绎如也，以成。导读作：孔子把演奏音乐的道理讲给鲁国的乐官太师听，说：音乐的规律是可以了解的。开始演奏时，各种乐声合起来，气势充盛；接下来，声音纯正和谐，清晰分明，连绵不断，这样一直到乐曲奏完。",
          "你看见的是教给鲁国太师的开合之法——鲁是把曲子讲清楚的作坊，不是一篇独立的乐论。",
        ],
        bodyEn: [
          "[The Analects · Pa Yih 3.23](https://www.lunyu.ai/en/analects/ba-yi/ba-yi-023) keeps you inside Lu's ritual sound. The source: 子语鲁大师乐曰，乐其可知也，始作，翕如也，从之，纯如也，缴如也，绎如也，以成。 The guide: 孔子把演奏音乐的道理讲给鲁国的乐官太师听，说：音乐的规律是可以了解的。开始演奏时，各种乐声合起来，气势充盛；接下来，声音纯正和谐，清晰分明，连绵不断，这样一直到乐曲奏完。",
          "Legge: The Master instructing the grand music-master of Lu said, \"How to play music may be known. At the commencement of the piece, all the parts should sound together. As it proceeds, they should be in harmony while severally distinct and flowing without break, and thus on to the conclusion.\" You watch instruction given to Lu's music-master — Lu as the workshop of how a piece should open and resolve, not a general essay on music theory.",
        ],
      },
      {
        headingZh: "鲁无君子者，斯焉取斯",
        headingEn: "If Lu had no junzi…",
        bodyZh: [
          "[论语 · 公冶长 5.2](https://www.lunyu.ai/zh-Hans/analects/gong-ye-chang/gong-ye-chang-002)请你用「能否长出君子」来量鲁。原文是：子谓子贱，君子哉若人。鲁无君子者，斯焉取斯。导读作：孔子谈到子贱，说：这个人真是个君子啊。如果鲁国没有君子，他又是从哪里学到这种品德的呢？",
          "你听见鲁被说成使君子显得可信的土壤——仍不是一部公爵传。",
        ],
        bodyEn: [
          "[The Analects · Kung-ye Ch'ang 5.2](https://www.lunyu.ai/en/analects/gong-ye-chang/gong-ye-chang-002) lets you measure Lu by the people it can grow. The source: 子谓子贱，君子哉若人。鲁无君子者，斯焉取斯。 The guide: 孔子谈到子贱，说：这个人真是个君子啊。如果鲁国没有君子，他又是从哪里学到这种品德的呢？",
          "Legge: The Master said of Tsze-chien, \"Of superior virtue indeed is such a man! If there were not virtuous men in Lu, how could this man have acquired this character?\" You hear Lu named as the soil that makes a junzi plausible — still not a duke résumé.",
        ],
      },
      {
        headingZh: "周公谓鲁公",
        headingEn: "Zhou Gong's charge to the duke of Lu",
        bodyZh: [
          "[论语 · 微子 18.10](https://www.lunyu.ai/zh-Hans/analects/wei-zi/wei-zi-010)请你只留短门；周公另有计划中的笔记。原文开篇是：周公谓鲁公曰，君子不施其亲，不使大臣怨乎不以，故旧无大故，则不弃也，无求备于一人。导读作：周公对儿子鲁公说：君子不怠慢自己的亲族，不让大臣抱怨没被任用，老臣旧友没有大的过失，就不要抛弃他们，不要对一个人求全责备。本篇只要对鲁公的叮嘱——亲族、大臣、故旧——不要写成周公列传。",
        ],
        bodyEn: [
          "Keep [The Analects · Wei Tsze 18.10](https://www.lunyu.ai/en/analects/wei-zi/wei-zi-010) short; a Zhou Gong Note is planned elsewhere. The source opens 周公谓鲁公曰，君子不施其亲，不使大臣怨乎不以，故旧无大故，则不弃也，无求备于一人。 The guide: 周公对儿子鲁公说：君子不怠慢自己的亲族，不让大臣抱怨没被任用，老臣旧友没有大的过失，就不要抛弃他们，不要对一个人求全责备。 Legge: The duke of Chau addressed his son, the duke of Lu, saying, \"The virtuous prince does not neglect his relations. He does not cause the great ministers to repine at his not employing them. Without some great cause, he does not dismiss from their offices the members of old families. He does not seek in one man talents for every employment.\" What you need here is the charge to Lu Gong — how a virtuous prince treats kin, ministers, and old families — not a Zhou Gong biography.",
        ],
      },
      {
        headingZh: "本地一景：长府",
        headingEn: "A local scene: the Long Treasury",
        imageSlot: "inline-2",
        bodyZh: [
          "[论语 · 先进 11.13](https://www.lunyu.ai/zh-Hans/analects/xian-jin/xian-jin-013)让你看见鲁作为礼与权落地的现场。原文是：鲁人为长府。闵子骞曰，仍旧贯，如之何，何必改作。子曰，夫人不言，言必有中。导读作：鲁国要翻修长府这座库房。闵子骞说：照老样子用下去，怎么样呢？何必一定要改建呢？孔子说：这个人平时不轻易开口，一开口就必定说到点子上。",
          "一门短门即可；不要写成闵子骞人物笔记。",
        ],
        bodyEn: [
          "[The Analects · Hsien Tsin 11.13](https://www.lunyu.ai/en/analects/xian-jin/xian-jin-013) shows you Lu as the place where a ritual-power decision lands. The source: 鲁人为长府。闵子骞曰，仍旧贯，如之何，何必改作。子曰，夫人不言，言必有中。 The guide: 鲁国要翻修长府这座库房。闵子骞说：照老样子用下去，怎么样呢？何必一定要改建呢？孔子说：这个人平时不轻易开口，一开口就必定说到点子上。",
          "Legge: Some parties in Lu were going to take down and rebuild the Long Treasury. Min Tsze-ch'ien said, \"Suppose it were to be repaired after its old style;—why must it be altered and made anew?\" One short door is enough for you; do not turn this into a Min Zijian Who-Note.",
        ],
      },
      {
        headingZh: "近尺合起来说了什么",
        headingEn: "What the near measure adds up to",
        bodyZh: [
          "把这七处合起来，你得到的是：一把尺度（6.22），兄弟之政（13.7），归后乐正的故国（9.14），教鲁太师的作坊（3.23），可长君子的土壤（5.2），对鲁公的叮嘱（18.10），以及长府现场（11.13）。没写进这篇的同样重要：本篇不重讲哀公、定公传记。若你要那两扇统治者的门，可各开一次[《论语》里的鲁哀公是谁？](https://www.lunyu.ai/zh-Hans/blogs/duke-ai-of-lu-in-the-analects)或[《论语》里的鲁定公是谁？](https://www.lunyu.ai/zh-Hans/blogs/duke-ding-of-lu-in-the-analects)——只作软链。",
          "作为你自己的体会——不是孔子的原话——请留意：你多轻易把「鲁国」当成地图标签或史章标题。《论语》更常把鲁当作一把量「距道还有多远」的近尺。",
        ],
        bodyEn: [
          "Put the doors together and you get a scale (6.22), a brother polity (13.7), a home of return where music is set right (9.14), a workshop for teaching Lu's music-master (3.23), a soil that can grow a junzi (5.2), a charge spoken to Lu Gong (18.10), and a local treasury scene (11.13). What they leave out matters too: this Note does not retell Duke Ai or Duke Ding as biographies. If you need those ruler doors, open [Who Was Duke Ai of Lu in the Analects?](https://www.lunyu.ai/en/blogs/duke-ai-of-lu-in-the-analects) or [Who Was Duke Ding of Lu in the Analects?](https://www.lunyu.ai/en/blogs/duke-ding-of-lu-in-the-analects) once each — soft links only.",
          "As your own reflection — not as Confucius's words — notice how easily you treat \"State of Lu\" as a map label or a history chapter. The Analects keeps treating Lu as a measure of how close a polity stands to 道.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的鲁国是什么？",
        questionEn: "What is the State of Lu in the Analects?",
        answerZh: "你会遇见它是孔子故国，但书也把它当作近标准。在 6.22，齐一变至于鲁，鲁一变至于道。别处鲁与卫并称，被写成乐正之归处，也被「有无君子」所检验。每一句请回活页核对，并说明用的是原文、导读还是英译。",
        answerEn: "You will meet Lu as Confucius's home state, but the book also uses it as a near standard. In 6.22, Ch'i by one change would reach Lu, and Lu by one change would reach the Way. Elsewhere Lu is paired with Wei, named as the place of return for music reform, and tested by whether it can grow junzi. Check each line on its passage page, and say whether you used the source, the guide, or Legge.",
      },
      {
        questionZh: "6.22「齐一变至于鲁」是什么意思？",
        questionEn: "What does 齐一变至于鲁 mean in 6.22?",
        answerZh: "你读到的是一把尺子，不是行程表。原文是：齐一变，至于鲁，鲁一变，至于道。活页导读：齐国的政教风俗一加变革，就可以达到鲁国的样子；鲁国一加变革，就可以达到合乎先王之道的境界。Legge 此处用 true principles 译道；本篇谈第三阶时仍用「道」这个字。",
        answerEn: "You are reading a scale, not a travel plan. The source: 齐一变，至于鲁，鲁一变，至于道. The live guide: 齐国的政教风俗一加变革，就可以达到鲁国的样子；鲁国一加变革，就可以达到合乎先王之道的境界. Legge's \"true principles\" renders 道 here; keep the Note's own word Way / 道 when you talk about the third step.",
      },
      {
        questionZh: "13.7 里鲁和卫是同一个吗？",
        questionEn: "Are Lu and Wei the same in 13.7?",
        answerZh: "不是。原文说的是政事如兄弟——鲁衞之政，兄弟也——不是两国等同。请用活页的「衞」。你应听出政风上的亲缘，不是合并编年。",
        answerEn: "No. The source says their governments are brothers — 鲁衞之政，兄弟也 — not that the states are identical. Quote the live 衞. You should hear kinship of political character, not a merged chronicle.",
      },
      {
        questionZh: "为什么说反鲁之后才乐正？",
        questionEn: "Why does Confucius say he set music right after returning to Lu?",
        answerZh: "在 9.14，你听见他把整理与归来绑在一起：吾自衞反鲁，然后乐正，雅颂各得其所。请你盯住「然后」。本篇只看鲁作为落地处；「乐」的专题可另开。",
        answerEn: "In 9.14 you hear him tie reform to return: 吾自衞反鲁，然后乐正，雅颂各得其所. Legge: \"I returned from Wei to Lu, and then the music was reformed…\" Keep then in view. This Note only watches Lu as the landing place; a separate Music Note can open the Yue thread more fully.",
      },
      {
        questionZh: "这篇是鲁国公爵传吗？",
        questionEn: "Is this Note a biography of Lu's dukes?",
        answerZh: "不是。哀公、定公已有各自的 Who-Notes。这里公爵只在章句需要时露面；题旨是书如何用鲁——不是宫廷史。你若需要统治者那扇门，软链即可。",
        answerEn: "No. Duke Ai and Duke Ding already have their own Who-Notes. Here the dukes appear only if a passage needs them for the measure; the thesis is how the book uses Lu — not a court history. Soft-link those Notes if you need the ruler doors.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来打开鲁索引",
        headingEn: "Open the Lu index next",
        bodyZh: [
          "当你想把与鲁相关的章句放在同一页读——包括本篇未作主门的卡片——请打开[鲁](https://www.lunyu.ai/zh-Hans/index/lu)。索引是带引文的地名列表；本篇只跟着「近尺」走。你回到那里再读这七处；引用时请写明篇章网址，并说明用的是原文、导读还是英译。",
        ],
        bodyEn: [
          "When you want every related Lu passage on one screen — including cards this Note did not open as main doors — open [Lu](https://www.lunyu.ai/en/index/lu). The index is a place list with quotes; this Note only followed Lu as the near measure. Read the seven doors again there in context, and when you quote any of them, give the passage URL and say whether you used the source, the guide, or Legge.",
        ],
      },
    ],
  },
  {
    slug: "what-ren-means-in-the-analects",
    titleZh: "《论语》里的「仁」是什么意思？",
    titleEn: "What Ren Means in the Analects",
    dekZh: "你要问《论语》里的「仁」是什么，最好先看孔子何时不给这个字、何时又给。他很少谈它。他可以称人忠、清、难、有才，仍说不知其仁。他自己也不敢当。惟颜回能三月不违。他却出人意料地许管仲「如其仁」——因为那功业使人免于兵车。可同时他又说：我欲仁，斯仁至矣。这一篇只跟着「少许、近起步」这条线走。克己复礼、爱人、能近取譬、其恕乎等说法，仁索引页已经收好；你读完这篇再去那里即可。",
    dekEn: "What ren means in the Analects is clearest when you watch Confucius refuse the word and when he grants it. He seldom speaks of it. He will credit loyalty, purity, restraint, and talent, and still say he does not know whether someone is ren. He will not claim it for himself. Only Hui keeps it for months. He grants it, surprisingly, for what Guan Zhong's work did for people. And yet: if you wish for ren, it is at hand. This Note follows that rare-grant thread. For how the book also defines ren through 克己复礼, loving others, and shu, open the Ren index later — those methods already live there.",
    descriptionZh: "《论语》里的「仁」少被许下。忠与清可以点名，这个字仍被按下；欲仁，则近。八处活页，链回可核对的原文。",
    descriptionEn: "What ren means in the Analects: seldom granted, withheld from loyalty and purity, and still near when you wish for it. Eight live doors.",
    datePublished: "2026-10-18",
    dateModified: "2026-10-18",
    tagsZh: ["仁", "定义", "论语"],
    tagsEn: ["ren", "definition", "Analects"],
    related: [
      "/analects/zi-han/zi-han-001",
      "/index/ren",
      "/analects/gong-ye-chang/gong-ye-chang-018",
      "/analects/xian-wen/xian-wen-002",
      "/analects/gong-ye-chang/gong-ye-chang-004",
      "/analects/shu-er/shu-er-033",
      "/analects/yong-ye/yong-ye-005",
      "/analects/xian-wen/xian-wen-017",
      "/analects/shu-er/shu-er-029",
      "/blogs/ren-junzi-and-everyday-conduct",
    ],
    cover: notesBlogImage(
      "what-ren-means-in-the-analects",
      "cover.jpg",
      "An empty judgment seat at dawn with a closed seal box — a name withheld until a whole life is measured",
      "黎明空着的判座旁放着未启的印匣——名字要等整个人生被衡量后才给",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "what-ren-means-in-the-analects",
        "inline-1.jpg",
        "Two recognition tablets left on a plain desk, a third place left blank for a heavier name",
        "素桌上两块空白的赏识牌，第三处留空给更重的名字",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "what-ren-means-in-the-analects",
        "inline-2.jpg",
        "Dawn light on a quiet assembly road where banners rest furled — force unused, people gathered",
        "黎明静路上旗幡收卷——不用兵车，人已来聚",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "他很少谈——两层读法不要并成一句",
        headingEn: "He seldom spoke of it — and the layers disagree",
        bodyZh: [
          "请你从[论语 · 子罕 9.1](https://www.lunyu.ai/zh-Hans/analects/zi-han/zi-han-001)开始。原文是：子罕言，利，与命，与仁。活页 Legge 作：The subjects of which the Master seldom spoke were—profitableness, and also the appointments of Heaven, and perfect virtue. Legge 常把仁译成 perfect virtue / virtue；本篇仍用「仁」这个字。",
          "活页白话导读却是：孔子很少谈及利益，只赞许天命和仁德。导读把「与」读成赞许命与仁，Legge 则把利、命、仁三者都读成少言的对象。你不要把两层并成一句定论，也不要另造注家来裁定。本篇只要 9.1 提醒你：这个字在书里被慎重对待，而导读与 Legge 可以分道。",
        ],
        bodyEn: [
          "Start with [The Analects · Tsze Han 9.1](https://www.lunyu.ai/en/analects/zi-han/zi-han-001). The source reads 子罕言，利，与命，与仁。 Legge on the same page: \"The subjects of which the Master seldom spoke were—profitableness, and also the appointments of Heaven, and perfect virtue.\" Legge renders 仁 as \"perfect virtue\" here (and as \"virtue\" elsewhere); you should keep the Note's own word ren.",
          "The live modern guide reads: 孔子很少谈及利益，只赞许天命和仁德。 That reading takes 与 as praise for 命 and 仁, while Legge takes all three as subjects seldom spoken of. You should not merge the two. Quote each layer by name; do not invent a commentator to decide which is right. What this Note needs from 9.1 is the book's own caution around the word — and the reminder that guide and Legge can part ways.",
        ],
      },
      {
        headingZh: "忠了、清了——仍不是仁",
        headingEn: "Loyal and clean — still not ren",
        imageSlot: "inline-1",
        bodyZh: [
          "在[论语 · 公冶长 5.18](https://www.lunyu.ai/zh-Hans/analects/gong-ye-chang/gong-ye-chang-018)里，你看见子张问令尹子文三仕三已、必以旧政吿新令尹，其人何如。原文第一段收在：子曰，忠矣。曰，仁矣乎。曰，未知，焉得仁。导读作：算得上忠了。……不知道，这怎么能算是仁呢？",
          "子张又问陈文子弃马而去、辗转他邦。原文是：子曰，淸矣。曰，仁矣乎。曰，未知，焉得仁。引用全文时请保留活页上的「吿」「淸」。你看见的是：忠与清可以被点名，仁仍两次被按下。",
        ],
        bodyEn: [
          "In [The Analects · Kung-ye Ch'ang 5.18](https://www.lunyu.ai/en/analects/gong-ye-chang/gong-ye-chang-018), you watch Zi Zhang ask about Ziwen, who took and left the office of ling-yin without joy or anger and handed his work to the next minister. The source closes the first exchange: 子曰，忠矣。曰，仁矣乎。曰，未知，焉得仁。 Legge: The Master replied. \"He was loyal.\" \"Was he perfectly virtuous?\" \"I do not know. How can he be pronounced perfectly virtuous?\"",
          "Zi Zhang then asks about Chen Wenzi, who abandoned forty horses and left state after state rather than serve beside another like the killer Cui. The source: 子曰，淸矣。曰，仁矣乎。曰，未知，焉得仁。 Keep the live page's 淸 and 吿 when you quote the full source. Legge: \"He was pure.\" Then the same refusal: \"I do not know. How can he be pronounced perfectly virtuous?\" You watch single virtues named — loyalty, purity — and ren withheld twice.",
        ],
      },
      {
        headingZh: "克伐怨欲不行——只是「难」，不是仁",
        headingEn: "Restraint that is \"difficult,\" not ren",
        bodyZh: [
          "[论语 · 宪问 14.2](https://www.lunyu.ai/zh-Hans/analects/xian-wen/xian-wen-002)试了另一种候选定义，请你对照原文。原文是：克，伐，怨，欲，不行焉，可以为仁矣。子曰，可以为难矣，仁则吾不知也。导读作：有人说：好胜、自夸、怨恨、贪欲，这几样都不表现出来，可以算是仁了吧。孔子说：这可以算是难能可贵了，至于是不是仁，我就不知道了。",
          "你应听出对照：压住四种毛病算难；老师仍不把它改称为仁。不要把「难」与「仁」在转述里并成同一个词。",
        ],
        bodyEn: [
          "[The Analects · Hsien Wan 14.2](https://www.lunyu.ai/en/analects/xian-wen/xian-wen-002) tests another candidate definition. The source: 克，伐，怨，欲，不行焉，可以为仁矣。子曰，可以为难矣，仁则吾不知也。 The guide: 有人说：好胜、自夸、怨恨、贪欲，这几样都不表现出来，可以算是仁了吧。孔子说：这可以算是难能可贵了，至于是不是仁，我就不知道了。",
          "Legge: \"When the love of superiority, boasting, resentments, and covetousness are repressed, this may be deemed perfect virtue.\" The Master said, \"This may be regarded as the achievement of what is difficult. But I do not know that it is to be deemed perfect virtue.\" You should hear the split: repression of four vices is hard; the teacher still will not call it ren.",
        ],
      },
      {
        headingZh: "「不知其仁」",
        headingEn: "\"I do not know whether he is ren\"",
        bodyZh: [
          "才具也结不了案。在[论语 · 公冶长 5.4](https://www.lunyu.ai/zh-Hans/analects/gong-ye-chang/gong-ye-chang-004)里，你读到有人说雍也仁而不佞。原文是：或曰，雍也仁，而不佞。子曰，焉用佞……不知其仁，焉用佞。导读作：冉雍是不是仁我不知道，但何必要有口才呢？老师推开对口才的称赞，把仁留下——不知其仁。（5.7 对几位弟子的「不知其仁」长串，已是冉有笔记的门；这里不必再作主门。）",
        ],
        bodyEn: [
          "Talent does not finish the case either. In [The Analects · Kung-ye Ch'ang 5.4](https://www.lunyu.ai/en/analects/gong-ye-chang/gong-ye-chang-004), someone praises Zhong Gong (Yung) as ren but not glib. The source: 或曰，雍也仁，而不佞。子曰，焉用佞……不知其仁，焉用佞。 Legge: \"Yung is truly virtuous, but he is not ready with his tongue.\" Then: \"I know not whether he be truly virtuous, but why should he show readiness of the tongue?\" The teacher deflects the praise of eloquence and leaves ren open — 不知其仁. (A longer \"不知其仁\" series for several disciples sits in 5.7; that door already belongs to the Ran You Note, so you do not need it as a main door here.)",
        ],
      },
      {
        headingZh: "他自己也不敢当",
        headingEn: "He will not claim it for himself",
        bodyZh: [
          "[论语 · 述而 7.33](https://www.lunyu.ai/zh-Hans/analects/shu-er/shu-er-033)把拒绝转向自己，请你听他怎么说。原文是：子曰，若圣与仁，则吾岂敢，抑为之不厌，诲人不倦，则可谓云尔已矣。公西华曰，正唯弟子不能学也。导读作：说到圣与仁，那我怎么敢当呢？不过是朝着这个方向去做而永不满足，教导别人而不知疲倦，可以说就是这样罢了。",
          "你听见的是方向与工夫，不是自称。不要把后文「我欲仁」读成他给自己挂上的称号。",
        ],
        bodyEn: [
          "[The Analects · Shu R. 7.33](https://www.lunyu.ai/en/analects/shu-er/shu-er-033) turns the refusal inward. The source: 子曰，若圣与仁，则吾岂敢，抑为之不厌，诲人不倦，则可谓云尔已矣。公西华曰，正唯弟子不能学也。 The guide: 孔子说：说到圣与仁，那我怎么敢当呢？不过是朝着这个方向去做而永不满足，教导别人而不知疲倦，可以说就是这样罢了。",
          "Legge: \"The sage and the man of perfect virtue;—how dare I rank myself with them? It may simply be said of me, that I strive to become such without satiety, and teach others without weariness.\" You hear practice without self-grant: he points to the direction of effort, not to a title he will wear.",
        ],
      },
      {
        headingZh: "回也：三月不违仁",
        headingEn: "Hui: three months without leaving ren",
        bodyZh: [
          "[论语 · 雍也 6.5](https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-005)是少有的正面尺度；颜渊已有人物笔记，这里只留短门。原文是：子曰，回也，其心三月不违仁，其余，则日月至焉而已矣。导读作：颜回啊，他的心可以长久地不违背仁德；其余的学生，则只是短暂地偶尔达到仁的境界罢了。你要抓住的对照是：三月与日月——仁是心里的持续，不是一天的徽章。",
        ],
        bodyEn: [
          "[The Analects · Yung Yey 6.5](https://www.lunyu.ai/en/analects/yong-ye/yong-ye-005) is the rare positive measure, kept short because Yan Yuan already has his own Note. The source: 子曰，回也，其心三月不违仁，其余，则日月至焉而已矣。 Legge: \"Such was Hui that for three months there would be nothing in his mind contrary to perfect virtue. The others may attain to this on some days or in some months, but nothing more.\" What you need here is the contrast: months for Hui, days or months for others — ren as duration of a mind, not a one-day badge.",
        ],
      },
      {
        headingZh: "许了：管仲——因功业所及",
        headingEn: "Granted: Guan Zhong — for what the work did",
        imageSlot: "inline-2",
        bodyZh: [
          "[论语 · 宪问 14.17](https://www.lunyu.ai/zh-Hans/analects/xian-wen/xian-wen-017)是出人意料的一许——只写两三句；管仲另有计划中的笔记。子路以不死为未仁。原文答：子曰，桓公九合诸侯，不以兵车，管仲之力也。如其仁。如其仁。导读作：桓公多次会合诸侯，不靠武力，都是管仲的功劳。这就是他的仁德，这就是他的仁德。活页 Legge 面板目前只印到子路之问，许仁本身请你用原文或导读。你看见仁被许在「使人免于兵车的功」上，而不是一张私德核对表。",
        ],
        bodyEn: [
          "[The Analects · Hsien Wan 14.17](https://www.lunyu.ai/en/analects/xian-wen/xian-wen-017) is the surprising grant — keep it to a few sentences; Guan Zhong will have his own Note. Zi Lu says Guan Zhong failed to die with his lord and asks 未仁乎. The source reply: 子曰，桓公九合诸侯，不以兵车，管仲之力也。如其仁。如其仁。 The guide: 桓公多次会合诸侯，不靠武力，都是管仲的功劳。这就是他的仁德，这就是他的仁德。 The live Legge panel currently prints only Zi Lu's question, so prefer the source or guide for the grant itself. You see ren named for what his force did for the people without war chariots — not for a private virtue checklist.",
        ],
      },
      {
        headingZh: "近在起步：「我欲仁」",
        headingEn: "Near to begin: \"I wish for ren\"",
        bodyZh: [
          "[论语 · 述而 7.29](https://www.lunyu.ai/zh-Hans/analects/shu-er/shu-er-029)从另一头合上。原文是：子曰，仁远乎哉，我欲仁，斯仁至矣。导读作：孔子说：仁离我们很远吗？只要我自己想要仁，仁就来到了。少许是对整个人生的判断；近，是你今天可以转过去。把这两面并读，是本篇的读法——请标成你自己的体会，不要写成孔子在一处说过的原句。",
        ],
        bodyEn: [
          "[The Analects · Shu R. 7.29](https://www.lunyu.ai/en/analects/shu-er/shu-er-029) closes the door from the other side. The source: 子曰，仁远乎哉，我欲仁，斯仁至矣。 The guide: 孔子说：仁离我们很远吗？只要我自己想要仁，仁就来到了。 Legge: \"Is virtue a thing remote? I wish to be virtuous, and lo! virtue is at hand.\" Rare to grant as a verdict on a whole life; near when you turn toward it today. That pairing is the thesis of this Note — label the pairing as your reading of these doors together, not as a sentence Confucius spoke in one place.",
        ],
      },
      {
        headingZh: "少许与近起步，合起来说了什么",
        headingEn: "What rare grant and near turn add up to",
        bodyZh: [
          "把这八处合起来，你得到的是：慎言其字（9.1），忠与清仍不称仁（5.18），难仍不知是仁（14.2），才具留下不知（5.4），自己也不敢当（7.33），回能三月（6.5），管仲因功业而被许（14.17），以及欲仁则至（7.29）。没写进这篇的同样重要：索引上的五条方法门（12.1、12.22、6.28、1.3、15.23）和三条易混，本篇不重讲。若你要「仁在关系里、君子是方向」那一角，旧札[仁、君子与日常行为](https://www.lunyu.ai/zh-Hans/blogs/ren-junzi-and-everyday-conduct)可作一门软链；本篇只看许与不许。",
          "作为你自己的体会——不是孔子的原话——请留意：你多轻易用一个优点（忠、清、能克己、有才）就说某人「是个好人」。《论语》把「仁」说得更慢。",
        ],
        bodyEn: [
          "Put the doors together and you get a word spoken of with caution (9.1), loyalty and purity refused as ren (5.18), hard restraint still not renamed ren (14.2), talent left open (5.4), self-claim refused (7.33), months of constancy praised in Hui (6.5), one public grant for Guan Zhong's work (14.17), and a turn anyone can begin (7.29). What they leave out matters too: this Note does not retell the index's five method-passages (12.1, 12.22, 6.28, 1.3, 15.23) or re-argue its three confusions. Those already live on the Ren index. If you want the relationships-and-practice angle, the older Note [Ren, Junzi, and Everyday Conduct](https://www.lunyu.ai/en/blogs/ren-junzi-and-everyday-conduct) is one soft door; this one only watched when the word is withheld or given.",
          "As your own reflection — not as Confucius's words — notice how easily you praise one trait (\"loyal,\" \"clean,\" \"self-controlled,\" \"talented\") and call someone a good person. The Analects is slower to name ren.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的「仁」是什么意思？",
        questionEn: "What does ren mean in the Analects?",
        answerZh: "你找不到一句口号就定案。仁索引页从克己复礼、爱人、能近取譬、恕等处回答。本篇另看一条线：孔子可以称单德而仍不称仁，自己也不敢当，称回能三月，许管仲的功业，又说欲仁则至。每一句请回活页核对，并说明用的是原文、导读还是英译。",
        answerEn: "You will not find one slogan that settles it. On the Ren index the book answers through discipline, loving others, analogy, and shu. This Note watches another pattern: Confucius grants single virtues and still withholds ren, will not claim it for himself, praises Hui's months, grants it for Guan Zhong's public work, and says that if you wish for ren it is near. Check each line on its passage page, and say whether you used the source, the guide, or Legge.",
      },
      {
        questionZh: "5.18 为什么说「未知，焉得仁」？",
        questionEn: "Why does Confucius say 未知，焉得仁 in 5.18?",
        answerZh: "你读到的是两次拒绝。子文被称「忠」，陈文子被称「淸」；问是否仁，老师说不知道怎么能算是仁。请用活页原文的「未知，焉得仁」，不要改写成「他们还不够好」这类更顺口的话。",
        answerEn: "You are reading two refusals. Ziwen is called 忠 (loyal) and Chen Wenzi 淸 (pure); asked whether that is ren, the teacher says he does not know how they can be pronounced ren. Legge renders the refusals with \"perfectly virtuous.\" Quote the live source for 未知，焉得仁 rather than smoothing it into \"they were not good enough.\"",
      },
      {
        questionZh: "14.2 克伐怨欲不行，算不算已经仁了？",
        questionEn: "Is repressing pride and greed already ren in 14.2?",
        answerZh: "不算。你听见有人提出定义，老师答「可以为难矣，仁则吾不知也」。请把「难」与「仁」分搁，除非某章自己把它们连在一起；也不要把导读里的白话再压成一句「就是仁」。",
        answerEn: "No. You hear a proposed definition — 克，伐，怨，欲，不行焉 — and the teacher answers that this may be deemed difficult, 仁则吾不知也. Legge: \"the achievement of what is difficult,\" not yet \"perfect virtue.\" Keep hard self-control and ren on separate shelves unless a passage joins them.",
      },
      {
        questionZh: "孔子有没有自称仁？",
        questionEn: "Did Confucius claim ren for himself?",
        answerZh: "在 7.33 你看见他拒绝了。原文是「若圣与仁，则吾岂敢」；他只说为之不厌、诲人不倦。你也不要把 7.29「我欲仁，斯仁至矣」读成他给自己加的封号——那一句说的是转过去就近，不是给自己的判决。",
        answerEn: "In 7.33 he refuses. The source: 若圣与仁，则吾岂敢; he will only say he works without satiety and teaches without weariness. Legge: \"how dare I rank myself with them?\" You should not treat \"I wish for ren\" in 7.29 as a self-title either — that line is about the nearness of the turn, not a verdict he pins on his own name.",
      },
      {
        questionZh: "仁又少许、又「至矣」，怎么同时成立？",
        questionEn: "How can ren be rare to grant and still \"at hand\"?",
        answerZh: "你是把两扇门并排放。不许的那些场景，把仁当作对照民生的整个人生判断；7.29 把转向仁当作此刻可起步的事。活页导读写：只要我自己想要仁，仁就来到了。请不要并成一句教义口号；分层、留网址。",
        answerEn: "You are holding two doors side by side. The withholding scenes treat ren as a judgment of a whole life measured against people's good; 7.29 treats the turn toward it as something you can begin now. The live guide for 7.29 says: 只要我自己想要仁，仁就来到了. Do not collapse the two into one sentence spoken as doctrine; keep the layers and the URLs.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来打开仁索引",
        headingEn: "Open the Ren index next",
        bodyZh: [
          "当你想把这个字的主要用法放在同一页读——包括本篇只点名、未展开的方法门——请打开[仁](https://www.lunyu.ai/zh-Hans/index/ren)。索引已收「书里怎么用」和易混；本篇只跟着许与不许走。你回到那里再读这八处；引用时请写明篇章网址，并说明用的是原文、导读还是英译。",
        ],
        bodyEn: [
          "When you want every major use of the word on one screen — including the method-passages this Note only named — open [Ren](https://www.lunyu.ai/en/index/ren). The index already covers how the word is used and the easy confusions; this Note only followed when Confucius withholds the name and when he grants it. Read the eight doors again there in context, and when you quote any of them, give the passage URL and say whether you used the source, the guide, or Legge.",
        ],
      },
    ],
  },
  {
    slug: "ran-you-in-the-analects",
    titleZh: "《论语》里的冉有是谁？",
    titleEn: "Who Was Ran You in the Analects?",
    dekZh: "你搜「冉有」，多半读到政事与办事能力。冉有即冉求，也称「求」；Legge 作 Zan Yu、Yen Ch'iu、Ch'iu。这一篇只盯一条线：书里称他能做宰、有艺，又在停线处抓住他——力不足、不能，退则进之，聚敛则受责。你跟着八处活页看能力怎样碰到他自己划下的界限。",
    dekEn: "Ran You (冉有; personal name 冉求 / Ran Qiu; Legge writes Zan Yu, Yen Ch'iu, or Ch'iu) is the disciple the Analects keeps calling capable — and keeps catching at a stop-line. You will hear him claim insufficient force, answer \"I cannot\" at the T'ai mountain, then see his art for office praised and, elsewhere, enrichment rebuked. This Note follows that ability-plus-limit thread across eight live passages, not a Ji Family résumé.",
    descriptionZh: "《论语》里的冉有：能力与停线。6.10 先画的界，3.6 一句不能，聚敛时的重责。八处活页，链回可核对的原文。",
    descriptionEn: "Ran You in the Analects: ability and a stop-line—6.10's drawn limit, 3.6's I cannot, and the rebuke when ability enlarges the wrong wealth.",
    datePublished: "2026-10-17",
    dateModified: "2026-10-17",
    tagsZh: ["冉有", "冉求", "雍也"],
    tagsEn: ["ran you", "Ran You", "Yung Yey"],
    related: [
      "/analects/yong-ye/yong-ye-010",
      "/index/ran-you",
      "/analects/ba-yi/ba-yi-006",
      "/analects/gong-ye-chang/gong-ye-chang-007",
      "/analects/yong-ye/yong-ye-006",
      "/analects/xian-jin/xian-jin-016",
      "/analects/xian-jin/xian-jin-021",
      "/analects/zi-lu/zi-lu-009",
      "/analects/ji-shi/ji-shi-001",
    ],
    cover: notesBlogImage(
      "ran-you-in-the-analects",
      "cover.jpg",
      "A chalk line drawn across a dirt path at dusk — ability paused at a self-set limit",
      "黄昏土路上画着一道粉笔线——能力停在自己划下的界限前",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "ran-you-in-the-analects",
        "inline-1.jpg",
        "Steward's tally sticks and grain measures on a plain desk beside an unused remonstrance tablet",
        "素桌上的账筹与量谷器，旁放一块未用的谏板",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "ran-you-in-the-analects",
        "inline-2.jpg",
        "A road into a crowded settlement with three quiet milestones suggesting people, wealth, then teaching",
        "通向人口密集聚落的路，三块安静的里程碑暗示庶、富、教",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "能力被点名，也有一道他自己划的线",
        headingEn: "Ability named, and a line he draws",
        bodyZh: [
          "本站英文索引作 Ran You，说明常与政事和实务能力相关；中文索引作冉有。叙述多写「冉有」，孔子直呼时常写「求」；人物页（此处只读、不链）在路径 ran-qiu 下补「字子有」。公开称呼请用冉有，冉求作为私名点一次即可。索引是章句清单，不是这篇的论点；你要看的是能力与停线在他自己的话和老师的纠正里怎样并置。",
        ],
        bodyEn: [
          "The site's English index lists him as Ran You and notes government service and practical ability. Chinese passages often call him 冉有 in narrative and 求 when Confucius names him; the people page (read only here) adds 字子有 under the slug ran-qiu. Prefer Ran You as the public name; treat 冉求 / Ran Qiu as the personal name once. What this Note watches is not every card on the index in order, but where ability meets the line he draws — in his own speech and in the teacher's corrections.",
        ],
      },
      {
        headingZh: "雍也 6.10——力不足，还是先画了界？",
        headingEn: "Yung Yey 6.10: force insufficient, or a limit drawn",
        bodyZh: [
          "请你从[论语 · 雍也 6.10](https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-010)开始，因为这里你能听见冉求自己说出停线。原文是：冉求曰，非不说子之道，力不足也。子曰，力不足者，中道而废，今女画。导读作：冉求说：不是我不喜欢老师的学说，是我能力不够啊。孔子说：能力不够的人，是走到半路才停下来，如今你却是自己先划下界限不肯前进。",
          "你听到的对照很清楚：他称力不足；老师说真正力不足会走到半路才废，如今却是你先画界。把「画」读成自己划下的界限，已是活页导读的说法；你若再引申，请标明是自己的体会，不要写成经文。",
        ],
        bodyEn: [
          "Start with [The Analects · Yung Yey 6.10](https://www.lunyu.ai/en/analects/yong-ye/yong-ye-010), because here you hear Ran Qiu name his own stop. The source reads 冉求曰，非不说子之道，力不足也。子曰，力不足者，中道而废，今女画。 The modern guide on that page says: 冉求说：不是我不喜欢老师的学说，是我能力不够啊。孔子说：能力不够的人，是走到半路才停下来，如今你却是自己先划下界限不肯前进。",
          "Legge on the same page: Yen Ch'iu said, \"It is not that I do not delight in your doctrines, but my strength is insufficient.\" The Master said, \"Those whose strength is insufficient give over in the middle of the way but now you limit yourself.\" You should hear the split: he claims insufficient force; the teacher calls it a line drawn first. That reading of 画 as a self-set limit is already in the guide; keep your own further reflection labeled as yours.",
        ],
      },
      {
        headingZh: "八佾 3.6——泰山之祭，一句「不能」",
        headingEn: "Pa Yih 3.6: \"I cannot\" at the T'ai mountain",
        imageSlot: "inline-1",
        bodyZh: [
          "[论语 · 八佾 3.6](https://www.lunyu.ai/zh-Hans/analects/ba-yi/ba-yi-006)把他放进一场劝不住的季氏祭祀。原文是：季氏旅于泰山。子谓冉有曰，女弗能救与。对曰，不能。子曰，呜呼，曾谓泰山，不如林放乎。导读作：季氏要去祭祀泰山。孔子对冉有说：你不能劝阻他吗？冉有回答说：不能。孔子说：唉！难道说泰山之神还不如林放懂礼，会接受这种不合礼的祭祀吗？",
          "请把镜头留在这句短答「不能」上。季氏旅泰山是场景框，不是一篇季氏家史；你引用这一门时，引冉有的「不能」和老师的叹息即可，季氏政治另有计划中的笔记。",
        ],
        bodyEn: [
          "[The Analects · Pa Yih 3.6](https://www.lunyu.ai/en/analects/ba-yi/ba-yi-006) puts him inside a Ji ritual he cannot stop. The source: 季氏旅于泰山。子谓冉有曰，女弗能救与。对曰，不能。子曰，呜呼，曾谓泰山，不如林放乎。 The guide: 季氏要去祭祀泰山。孔子对冉有说：你不能劝阻他吗？冉有回答说：不能。孔子说：唉！难道说泰山之神还不如林放懂礼，会接受这种不合礼的祭祀吗？",
          "Legge: The Master said to Zan Yu, \"Can you not save him from this?\" He answered, \"I cannot.\" Keep the camera on that short answer. The Ji sacrifice is the scene frame, not a history essay about the family; when you cite this door, quote Ran You's 不能 / \"I cannot\" and the teacher's reply, and leave the broader Ji politics for its own Note.",
        ],
      },
      {
        headingZh: "公冶长 5.7 与雍也 6.6——可仕，仁则不知",
        headingEn: "Kung-ye Ch'ang 5.7 and Yung Yey 6.6: fit for office, ren left open",
        bodyZh: [
          "能力也从旁人的评语里被点名。[论语 · 公冶长 5.7](https://www.lunyu.ai/zh-Hans/analects/gong-ye-chang/gong-ye-chang-007)里，孟武伯连问几位弟子，落到冉求的一句是：求也，千室之邑，百乘之家，可使为之宰也，不知其仁也。导读作：冉求嘛，一个千户人家的大邑、拥有百辆兵车的大夫封地，可以让他去做总管，至于他是不是仁，我就不知道了。你得到的是可做宰，而不是仁的定论。",
          "[论语 · 雍也 6.6](https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-006)里，季康子问冉求可否从政，原文收在：求也艺，于从政乎何有。导读作：冉求多才多艺，治理政事有什么困难呢？你把 5.7 与 6.6 当作关于才具的判断即可，不要扩写成另一篇论仁或论为政的专文，也不要借「不知其仁」另开一篇。",
        ],
        bodyEn: [
          "Ability is named from outside as well. In [The Analects · Kung-ye Ch'ang 5.7](https://www.lunyu.ai/en/analects/gong-ye-chang/gong-ye-chang-007), after Mang Wu asks about several disciples, the Ran Qiu line is 求也，千室之邑，百乘之家，可使为之宰也，不知其仁也。 Legge: \"In a city of a thousand families, or a clan of a hundred chariots, Ch'iu might be employed as governor, but I do not know whether he is perfectly virtuous.\" You get office-fit without a ren verdict.",
          "In [The Analects · Yung Yey 6.6](https://www.lunyu.ai/en/analects/yong-ye/yong-ye-006), Chi K'ang asks whether Ch'iu may serve in government. The source closes 求也艺，于从政乎何有。 The guide: 冉求多才多艺，治理政事有什么困难呢？ Legge's panel on the live page ends the Ch'iu reply at \"Ch'iu is a man of various ability.\" Prefer the source or guide when you need the full 于从政乎何有. Hold 5.7 and 6.6 as judgments about capacity, not as a ren treatise — and do not rewrite them into a separate governing essay.",
        ],
      },
      {
        headingZh: "先进 11.16——能力用在不该加的富上",
        headingEn: "Hsien Tsin 11.16: when ability enlarges the wrong wealth",
        bodyZh: [
          "[论语 · 先进 11.16](https://www.lunyu.ai/zh-Hans/analects/xian-jin/xian-jin-016)是重责。原文是：季氏富于周公，而求也为之聚敛而附益之。子曰，非吾徒也，小子，鸣鼓而攻之可也。导读作：季氏比周公还要富有，可冉求还替他搜刮聚敛，再增加他的财富。孔子说：冉求不是我的学生了，你们可以大张旗鼓地去声讨他。",
          "你应把它读成老师点名「能力用错了地方」，而不是季氏赋税全史。一门短门够了；家史留给活页和日后的季氏专篇。",
        ],
        bodyEn: [
          "[The Analects · Hsien Tsin 11.16](https://www.lunyu.ai/en/analects/xian-jin/xian-jin-016) is the hard rebuke. The source: 季氏富于周公，而求也为之聚敛而附益之。子曰，非吾徒也，小子，鸣鼓而攻之可也。 The guide: 季氏比周公还要富有，可冉求还替他搜刮聚敛，再增加他的财富。孔子说：冉求不是我的学生了，你们可以大张旗鼓地去声讨他。",
          "Legge: \"He is no disciple of mine. My little children, beat the drum and assail him.\" You should read this as the teacher naming misuse of ability, not as a full chronicle of Ji taxation. One short door is enough; leave the family's wealth history aside.",
        ],
      },
      {
        headingZh: "先进 11.21——退，故进之",
        headingEn: "Hsien Tsin 11.21: retreat that needs a push",
        bodyZh: [
          "[论语 · 先进 11.21](https://www.lunyu.ai/zh-Hans/analects/xian-jin/xian-jin-021)与子路同场；你要把镜头留在冉有。两人都问「闻斯行诸」。对冉有，答的是「闻斯行之」；收束的解释是：求也退，故进之，由也兼人，故退之。导读作：冉求平时做事退缩，所以我鼓励他进取；仲由勇气过人，所以我加以约束。",
          "你可以点一句：同一章里子路得到相反的约束，然后停下——子路另有人物笔记。你要抓住的，是因「退」而「进之」的那一线。",
        ],
        bodyEn: [
          "[The Analects · Hsien Tsin 11.21](https://www.lunyu.ai/en/analects/xian-jin/xian-jin-021) shares a scene with Zi Lu; keep your focus on Ran You. Both ask whether to act at once on what they hear. To Ran You the answer is 闻斯行之; the closing explanation is 求也退，故进之，由也兼人，故退之。 The guide: 冉求平时做事退缩，所以我鼓励他进取；仲由勇气过人，所以我加以约束。",
          "Legge: \"Ch'iu is retiring and slow; therefore, I urged him forward. Yu has more than his own share of energy; therefore I kept him back.\" You may note that Zi Lu receives the opposite correction in the same passage, then stop — Zi Lu has his own Who-Note. The line that belongs here is the push given because Ran You retreats.",
        ],
      },
      {
        headingZh: "子路 13.9——驾车听到的庶、富、教",
        headingEn: "Tsze-lu 13.9: population, wealth, then teaching",
        imageSlot: "inline-2",
        bodyZh: [
          "[论语 · 子路 13.9](https://www.lunyu.ai/zh-Hans/analects/zi-lu/zi-lu-009)里你看见他在驾车，不是在争一场战争。原文是：子适衞，冉有仆。子曰，庶矣哉。冉有曰，既庶矣，又何加焉。曰，富之。曰，既富矣，又何加焉。曰，教之。请保留活页上的「衞」字。导读作：孔子到卫国去，冉有替他驾车。孔子说：这里人口真多啊！冉有说：人口已经很多了，还要再做什么呢？孔子说：使他们富裕起来。冉有说：已经富裕了，还要再做什么呢？孔子说：教育他们。",
          "你听见冉有连问两步「又何加焉」；庶→富→教是老师的答法，引用时请把问与答、原文与导读分开归属。",
        ],
        bodyEn: [
          "[The Analects · Tsze-lu 13.9](https://www.lunyu.ai/en/analects/zi-lu/zi-lu-009) shows him driving, not arguing for a war. The source: 子适衞，冉有仆。子曰，庶矣哉。冉有曰，既庶矣，又何加焉。曰，富之。曰，既富矣，又何加焉。曰，教之。 Keep 衞 as the live page prints it. The guide: 孔子到卫国去，冉有替他驾车。孔子说：这里人口真多啊！冉有说：人口已经很多了，还要再做什么呢？孔子说：使他们富裕起来。冉有说：已经富裕了，还要再做什么呢？孔子说：教育他们。",
          "Legge: Yu said, \"Since they are thus numerous, what more shall be done for them?\" \"Enrich them,\" was the reply. \"And when they have been enriched, what more shall be done?\" The Master said, \"Teach them.\" You hear Ran You ask the next step twice; the ladder 庶→富→教 is the teacher's answer, so label the layers when you cite them.",
        ],
      },
      {
        headingZh: "季氏 16.1——颛臾，一门短门",
        headingEn: "Ke She 16.1: one short Zhuanyu door",
        bodyZh: [
          "[论语 · 季氏 16.1](https://www.lunyu.ai/zh-Hans/analects/ji-shi/ji-shi-001)起首是冉有与季路去报告将伐颛臾：季氏将伐颛臾。冉有季路见于孔子曰，季氏将有事于颛臾。导读作：季氏准备攻打颛臾。冉有、季路去见孔子，说：季氏将要对颛臾用兵了。你把这一门当作关于他职位与报告的短门即可，不要写成整场战事小说；长章后文请你回活页自读。",
        ],
        bodyEn: [
          "[The Analects · Ke She 16.1](https://www.lunyu.ai/en/analects/ji-shi/ji-shi-001) opens with Ran You and Ji-lu reporting a planned attack: 季氏将伐颛臾。冉有季路见于孔子曰，季氏将有事于颛臾。 The guide: 季氏准备攻打颛臾。冉有、季路去见孔子，说：季氏将要对颛臾用兵了。 Legge begins: Zan Yu and Chi-lu had an interview with Confucius, and said, \"Our chief, Chi, is going to commence operations against Chwan-yu.\" Use this as one short door about his position in the report, not as a novel of the campaign. The rest of the long chapter belongs on the passage page.",
        ],
      },
      {
        headingZh: "能力加停线，合起来说了什么",
        headingEn: "What ability-plus-limit adds up to",
        bodyZh: [
          "把这八处合起来，你得到的是可仕的才具（宰、艺），一句自称力不足而被判为先画界，一句「不能」，因退而进之的纠正，聚敛时的重责，驾车时听见的庶富教，以及一门颛臾报告。没写进这八门的同样重要：不是田赋编年，不是战记，也不是子路人物笔记。你引用上面任何一句，请写明篇章网址，并说明用的是原文、白话导读还是英译。",
        ],
        bodyEn: [
          "Put the doors together and you get capability named for office (宰, 艺), a self-described lack of force that the teacher calls a drawn line, a plain \"I cannot,\" a push against retreat, a hard rebuke when ability enlarges the wrong wealth, a quiet governing ladder heard while driving, and one Zhuanyu report. What they leave out matters too: these eight doors are not a field-tax chronicle, not a battle narrative, and not Zi Lu's Who-Note. When you quote any line above, give the passage URL and say whether you used the source, the guide, or Legge.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的冉有是谁？",
        questionEn: "Who was Ran You in the Analects?",
        answerZh: "你在书里遇见的冉有，也称冉求、求，常与政事和办事能力相连；Legge 作 Zan Yu、Yen Ch'iu、Ch'iu。他自己开口处有 6.10 称力不足、3.6 答「不能」；别处老师称他有艺可从政，因退而进之，也因聚敛而责「非吾徒也」。每一句你都可以回活页核对。",
        answerEn: "You meet him as Ran You (冉有), also 冉求 / Ran Qiu, a disciple tied to practical ability and government service. Legge prints Zan Yu, Yen Ch'iu, and Ch'iu. In his own voice he claims insufficient strength in 6.10 and answers \"I cannot\" in 3.6; elsewhere the teacher names his art for office, pushes his retreat, and rebukes enrichment done for the Chi family. You can check each line on its passage page.",
      },
      {
        questionZh: "6.10「今女画」是什么意思？",
        questionEn: "What does 今女画 mean in 6.10?",
        answerZh: "你读到的是老师回答冉求「力不足也」。活页导读把「画」读成先划下界限：真正力不足会走到半路才废，如今却是你自己先画界不肯前进。引用时请用活页原文或导读，不要换成更顺口却去掉「中道而废」对照的转述，也不要扩写成一篇励志短文。",
        answerEn: "You are reading the teacher's reply to Ran Qiu's \"my strength is insufficient.\" The live guide takes 画 as drawing a limit first: those who truly lack force stop mid-way, but you have already marked a boundary and will not go on. Legge renders the close as \"now you limit yourself.\" Quote the live source or guide rather than a smoother paraphrase that drops the contrast with 中道而废.",
      },
      {
        questionZh: "孔子为什么在 11.16 重责他？",
        questionEn: "Why does Confucius rebuke him in 11.16?",
        answerZh: "你在活页上看到的指控是：季氏已富于周公，求还为之聚敛而附益之。老师说「非吾徒也」，并让弟子鸣鼓而攻之。请把它按「这一幕里能力用错了地方」来读，不要扩成季氏家的赋税专史，也不要写成与本章无关的商战教训。",
        answerEn: "You find the charge on the page: the Chi family is already richer than the duke of Zhou, and Ch'iu still gathers and adds to that wealth. The teacher says 非吾徒也 and tells the disciples they may beat the drum and assail him. Hold it as a rebuke of how ability is used in that scene; do not expand it into a separate tax history of the Ji house.",
      },
      {
        questionZh: "冉有、冉求、「求」、Zan Yu 是同一个人吗？",
        questionEn: "Are Ran You, Ran Qiu, 求, and Zan Yu the same person?",
        answerZh: "在本站是同一个人。英文索引作 Ran You；原文叙述多写冉有，孔子直呼时常写求；人物页路径是 ran-qiu，并补「字子有」。Legge 印 Zan Yu、Yen Ch'iu、Ch'iu。你不该把这些写法拆成几位不同的弟子，也不要另造本站没有的别名。",
        answerEn: "Yes, on this site they are one figure. The English index uses Ran You; passages often say 冉有 in narration and 求 when Confucius addresses him; the people page sits under ran-qiu and adds 字子有. Legge writes Zan Yu, Yen Ch'iu, and Ch'iu. You should not split these labels into different disciples.",
      },
      {
        questionZh: "13.9 的庶→富→教是什么？",
        questionEn: "What is the 庶→富→教 sequence in 13.9?",
        answerZh: "你在冉有为孔子驾车时听见它。孔子说卫地「庶矣哉」之后，冉有问「又何加焉」，听到「富之」；再问，听到「教之」。连问是他的；阶梯是老师的。请回子路 13.9 活页核对，并让原文、导读、英译各归一层。",
        answerEn: "You hear it while Ran You is driving in Wei. After Confucius notes how numerous the people are, Ran You asks what to add next and hears 富之; he asks again and hears 教之. The questions are his; the ladder is the teacher's. Cite the live Tsze-lu page and keep source, guide, and Legge in separate layers.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来打开冉有索引",
        headingEn: "Open the Ran You index next",
        bodyZh: [
          "当你想把提到他的章句放在同一页读，请打开[冉有](https://www.lunyu.ai/zh-Hans/index/ran-you)。索引收束政事与能力；这一篇只跟着停线走。你回到那里再读这八处；引用时请写明篇章网址，并说明用的是原文、导读还是英译。",
        ],
        bodyEn: [
          "When you want every passage that names him on one screen, open [Ran You](https://www.lunyu.ai/en/index/ran-you). The index groups government service and practical ability; this Note only followed where ability meets the line he draws. Read the eight doors again there in context, and when you quote any of them, give the passage URL and say whether you used the source, the guide, or Legge.",
        ],
      },
    ],
  },
  {
    slug: "yan-yuan-in-the-analects",
    titleZh: "《论语》里的颜渊是谁？",
    titleEn: "Who Was Yan Yuan in the Analects?",
    dekZh: "你搜「颜渊」，多半读到的是孔子怎样称许他、怎样哭他。颜渊即颜回，书中也称「回」；Legge 英译作 Yen Yuan、Yen Hui。这一篇换个方向：只听他自己开口的几处——颜渊 12.1 的一句应承，子罕 9.10 的一声长叹，公冶长 5.25 的一个志愿，先进 11.22 在匡地的一句回答，卫灵公 15.10 的一次问政。然后你再把这些话放到为政 2.9、雍也 6.2、先进 11.10 里别人对他的描述旁边。",
    dekEn: "Yan Yuan (颜渊, also 颜回 or Hui; Legge writes Yen Yuan and Yen Hui) is a disciple Confucius praises again and again, yet you rarely hear him talk. This Note gathers the few lines the Analects gives in his own voice: a vow in 12.1, a sigh in 9.10, a wish in 5.25, one sentence at Kuang in 11.22, and a question on governing in 15.10. Then you set them beside how others describe him in 2.9, 6.2 and 11.10.",
    descriptionZh: "《论语》里的颜渊：五处亲口的话、一个索引条目。12.1 应承，9.10 长叹，5.25 言志，11.22 在匡地答话，15.10 问为邦。链回可核对的原文。",
    descriptionEn: "Yan Yuan in the Analects: five lines in his own voice—12.1's vow, 9.10's sigh, 5.25's wish, 11.22 at Kuang, and 15.10 on governing.",
    datePublished: "2026-10-16",
    dateModified: "2026-10-16",
    tagsZh: ["颜渊", "颜回", "先进"],
    tagsEn: ["yan yuan", "Yan Yuan", "Hsien Tsin"],
    related: [
      "/analects/yan-yuan/yan-yuan-001",
      "/index/yan-yuan",
      "/analects/zi-han/zi-han-010",
      "/analects/gong-ye-chang/gong-ye-chang-025",
      "/analects/xian-jin/xian-jin-022",
      "/analects/wei-ling-gong/wei-ling-gong-010",
      "/analects/wei-zheng/wei-zheng-009",
      "/analects/yong-ye/yong-ye-002",
      "/analects/xian-jin/xian-jin-010",
    ],
    cover: notesBlogImage(
      "yan-yuan-in-the-analects",
      "cover.jpg",
      "A narrow lane at dawn with a bamboo food basket and a gourd resting on a worn step",
      "黎明的窄巷里，一只竹食篮与一个瓢放在磨旧的石阶上",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "yan-yuan-in-the-analects",
        "inline-1.jpg",
        "A stone path climbing into morning mist, its high point always a little further ahead",
        "石径向晨雾中攀升，高处总在前面再远一点",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "yan-yuan-in-the-analects",
        "inline-2.jpg",
        "A plain undyed cloth folded in a bare room, an ornate carriage left outside in shadow",
        "素净的空室里叠着一块无纹的布，华饰的车停在门外阴影中",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "他自己开口的五处",
        headingEn: "Five lines in his own voice",
        bodyZh: [
          "书里提到他的章句，多半是在说他：孔子看他、评他、哭他。真正让你听见他说话的只有少数几章。叙述者介绍他时写「颜渊」，他自称时写「回」，这个分别你要记住，因为 12.1 与 11.22 里的「回」本身就是他话的一部分。本站人物页补充他字子渊，卒年有争议，你不要替它补一个确定年份。",
        ],
        bodyEn: [
          "Most passages that name him are about him: Confucius watching, judging, mourning. Only a handful let you hear what he says. In the Chinese text he is 颜渊 when the narrator introduces him and 回 when he names himself; Legge follows with Yen Yuan and Hui. Keep that split in mind, because in 12.1 and 11.22 the self-name 回 is part of what he is saying. The site's people page adds that his courtesy name was 子渊; it gives no firm death year, so you should not supply one.",
        ],
      },
      {
        headingZh: "颜渊 12.1——先问条目，再应承",
        headingEn: "Yen Yuan 12.1: asking for the items, then a vow",
        bodyZh: [
          "请你从[论语 · 颜渊 12.1](https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-001)开始，因为这里你能听见他开口两次。原文是：颜渊问仁。子曰，克己复礼为仁，一日克己复礼，天下归仁焉，为仁由己，而由人乎哉。颜渊曰，请问其目。子曰，非礼勿视，非礼勿听，非礼勿言，非礼勿动。颜渊曰，回虽不敏，请事斯语矣。",
          "你只听他那两句。一是「请问其目」，导读作「请问实行仁德的具体条目」；二是「回虽不敏，请事斯语矣」，导读作「我颜回虽然不够聪敏，也要照这话去做」。你会注意到他没有争辩，也没有追问理由，只要条目，然后应承去做。这是你的读后体会，不是原文，引用时请标明是自己的启发。「克己复礼为仁」是孔子的话，不要算到颜渊名下。",
        ],
        bodyEn: [
          "Start with [The Analects · Yen Yuan 12.1](https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-001), because here you hear him speak twice. The source reads 颜渊问仁。子曰，克己复礼为仁，一日克己复礼，天下归仁焉，为仁由己，而由人乎哉。颜渊曰，请问其目。子曰，非礼勿视，非礼勿听，非礼勿言，非礼勿动。颜渊曰，回虽不敏，请事斯语矣。",
          "Listen to his two lines only. First, 请问其目: Legge gives \"I beg to ask the steps of that process.\" Second, 回虽不敏，请事斯语矣, which Legge renders \"Though I am deficient in intelligence and vigour, I will make it my business to practise this lesson.\" The page's modern guide puts it as 我颜回虽然不够聪敏，也要照这话去做。 You will notice he does not debate the answer or ask for a reason; he asks for the concrete items and then commits to them. That reading is your reflection, not the text, so label it as yours when you cite it.",
        ],
      },
      {
        headingZh: "子罕 9.10——叹一个总在前面的道",
        headingEn: "Tsze Han 9.10: a sigh about a teaching that keeps moving",
        imageSlot: "inline-1",
        bodyZh: [
          "[论语 · 子罕 9.10](https://www.lunyu.ai/zh-Hans/analects/zi-han/zi-han-010)给你他最长的一段话。原文是：颜渊喟然叹曰，仰之弥高，钻之弥坚，瞻之在前，忽焉在后。夫子循循然善诱人，博我以文，约我以礼。欲罢不能，既竭吾才，如有所立卓尔，虽欲从之，末由也已。导读开头说：老师的学问道德，越仰望越觉得高，越钻研越觉得深；看着好像在前面，忽然又到了后面。",
          "你听到的是一个在用力的人，不是一个已经到达的人：想停停不下，才力用尽，那东西仍立在前面。「博我以文，约我以礼」则是他亲口说出的老师的教法。",
        ],
        bodyEn: [
          "[The Analects · Tsze Han 9.10](https://www.lunyu.ai/en/analects/zi-han/zi-han-010) gives you the longest speech he has. The source: 颜渊喟然叹曰，仰之弥高，钻之弥坚，瞻之在前，忽焉在后。夫子循循然善诱人，博我以文，约我以礼。欲罢不能，既竭吾才，如有所立卓尔，虽欲从之，末由也已。 Legge opens: \"I looked up to them, and they seemed to become more high; I tried to penetrate them, and they seemed to become more firm; I looked at them before me, and suddenly they seemed to be behind.\" He ends: \"though I wish to follow and lay hold of it, I really find no way to do so.\"",
          "You hear a student describing effort, not arrival: he cannot stop, he has used up his ability, and the thing still stands ahead. Notice also that 博我以文，约我以礼 names method, learning and ritual restraint, in his own words.",
        ],
      },
      {
        headingZh: "公冶长 5.25——用两个「不」说出的志愿",
        headingEn: "Kung-ye Ch'ang 5.25: a wish stated as two refusals",
        bodyZh: [
          "在[论语 · 公冶长 5.25](https://www.lunyu.ai/zh-Hans/analects/gong-ye-chang/gong-ye-chang-025)里，孔子让两位弟子各言其志。子路先答；这里你只需要颜渊那一句：颜渊曰，愿无伐善，无施劳。导读作：我愿意不夸耀自己的长处，不表白自己的功劳。你会看到，他的志愿是用两件「不做」的事说出来的。请把镜头留在他身上，子路另有人物笔记。",
        ],
        bodyEn: [
          "In [The Analects · Kung-ye Ch'ang 5.25](https://www.lunyu.ai/en/analects/gong-ye-chang/gong-ye-chang-025), Confucius asks two disciples for their wishes. Zi Lu speaks first; you only need Yan Yuan's line here: 颜渊曰，愿无伐善，无施劳。 Legge: \"I should like not to boast of my excellence, nor to make a display of my meritorious deeds.\" The guide: 我愿意不夸耀自己的长处，不表白自己的功劳。 You may see that his wish is phrased as two things he will not do. Keep the camera on him; Zi Lu has his own Note.",
        ],
      },
      {
        headingZh: "先进 11.22 与卫灵公 15.10——匡地一句，问政一问",
        headingEn: "Hsien Tsin 11.22 and Wei Ling Kung 15.10: one sentence at Kuang, one question on the state",
        bodyZh: [
          "[论语 · 先进 11.22](https://www.lunyu.ai/zh-Hans/analects/xian-jin/xian-jin-022)很短：子畏于匡，颜渊后，子曰，吾以女为死矣。曰，子在，回何敢死。导读作：先生您还活着，我怎么敢轻易去死呢？你听见他用一句关于为老师活着的话回应惊惧；活页没写的动机，你不要替它补。",
          "[论语 · 卫灵公 15.10](https://www.lunyu.ai/zh-Hans/analects/wei-ling-gong/wei-ling-gong-010)起首是「颜渊问为邦」。属于他的只有这一问；夏时、殷辂、周冕、韶舞，都是孔子的回答。你引用时请把问与答分开归属。",
        ],
        bodyEn: [
          "[The Analects · Hsien Tsin 11.22](https://www.lunyu.ai/en/analects/xian-jin/xian-jin-022) is short: 子畏于匡，颜渊后，子曰，吾以女为死矣。曰，子在，回何敢死。 Legge: \"I thought you had died.\" Hui replied, \"While you were alive, how should I presume to die?\" You hear him answer fear with a sentence about staying alive for his teacher; you should not add a motive the page does not print.",
          "[The Analects · Wei Ling Kung 15.10](https://www.lunyu.ai/en/analects/wei-ling-gong/wei-ling-gong-010) opens 颜渊问为邦。 Legge: \"Yen Yuan asked how the government of a country should be administered.\" Only the question is his; the calendar, carriage, cap, music and songs in the reply are Confucius'. Read the full Legge answer on the live passage page.",
        ],
      },
      {
        headingZh: "别人怎样描述他——为政 2.9 与雍也 6.2",
        headingEn: "How others describe him: Wei Chang 2.9 and Yung Yey 6.2",
        bodyZh: [
          "把这五处放到两条关于他的评语旁边。[论语 · 为政 2.9](https://www.lunyu.ai/zh-Hans/analects/wei-zheng/wei-zheng-009)里孔子说：吾与回言终日，不违，如愚。退而省其私，亦足以发，回也不愚。作为你自己的体会，可以和 12.1 对照：他亲口说话时，也是先问条目，而不是反驳。",
          "[论语 · 雍也 6.2](https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-002)里，哀公问弟子孰为好学，孔子答：有颜回者好学，不迁怒，不贰过，不幸短命死矣，今也则亡，未闻好学者也。你会看到，这些话出自老师之口，而且是在他死后，不是颜渊自述。",
        ],
        bodyEn: [
          "Set those five lines beside two judgments spoken about him. In [The Analects · Wei Chang 2.9](https://www.lunyu.ai/en/analects/wei-zheng/wei-zheng-009), Confucius says 吾与回言终日，不违，如愚……回也不愚。 Legge: \"he has not made any objection to anything I said;—as if he were stupid.\" As your own reflection, you might connect this with 12.1: in his own voice, too, he asks for steps rather than objecting.",
          "In [The Analects · Yung Yey 6.2](https://www.lunyu.ai/en/analects/yong-ye/yong-ye-002), Duke Ai asks who loved learning, and Confucius answers 有颜回者好学，不迁怒，不贰过，不幸短命死矣，今也则亡，未闻好学者也。 Legge: \"There was Yen Hui; he loved to learn. He did not transfer his anger; he did not repeat a fault.\" You will see that these words come from his teacher, after his death, not from Yan Yuan.",
        ],
      },
      {
        headingZh: "先进 11.10——违背师命的厚葬",
        headingEn: "Hsien Tsin 11.10: a funeral against the teacher's word",
        imageSlot: "inline-2",
        bodyZh: [
          "[论语 · 先进 11.10](https://www.lunyu.ai/zh-Hans/analects/xian-jin/xian-jin-010)原文是：颜渊死，门人欲厚葬之。子曰，不可。门人厚葬之。子曰，回也，视予犹父也，予不得视犹子也，非我也，夫二三子也。导读后半作：颜回把我当父亲一样看待，我却不能把他当儿子一样对待。这不是我的意思啊，是那几个学生要这样做的。你应把这读成孔子对门人的责备，而不是颜渊留下的话。",
        ],
        bodyEn: [
          "[The Analects · Hsien Tsin 11.10](https://www.lunyu.ai/en/analects/xian-jin/xian-jin-010) reads 颜渊死，门人欲厚葬之。子曰，不可。门人厚葬之。子曰，回也，视予犹父也，予不得视犹子也，非我也，夫二三子也。 Legge: \"The disciples did bury him in great style.\" Then: The Master said, \"Hui behaved towards me as his father. I have not been able to treat him as my son.\" You should read this as Confucius' complaint about the disciples, not as words Yan Yuan left behind.",
        ],
      },
      {
        headingZh: "他自己的话合起来说了什么，又没说什么",
        headingEn: "What his own words add up to, and what they leave out",
        bodyZh: [
          "把五处合起来，你得到的是一句应承、一声长叹、一个志愿、一句危难中的回答、一次问政。没有一句是夸自己的。没说的同样重要：这五处里没有他自己的教学、官职，也没有他谈贫穷的话。雍也 6.9 的「一箪食，一瓢飮」是孔子说他的话，你不要当成他的自述来引。",
        ],
        bodyEn: [
          "Put his five lines together and you get a vow, a sigh, a wish, one reply under danger, and one question on governing. None of them praises himself. What they leave out matters as much: in these five lines there is no account of his own teaching, no office, no saying of his on poverty. The famous basket and gourd of 6.9 are Confucius' words about him, so you should not quote them as his.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的颜渊是谁？",
        questionEn: "Who was Yan Yuan in the Analects?",
        answerZh: "你在书里遇见的颜渊，也称颜回、回，是孔子屡次称许、早逝后深恸的弟子；Legge 作 Yen Yuan、Yen Hui，本站人物页记他字子渊。他亲口说话的地方不多：12.1 问仁后应承去做，9.10 喟然长叹老师之道，5.25 言志，11.22 在匡地答话，15.10 问为邦。每一句你都可以回活页核对。",
        answerEn: "You meet him as 颜渊, also 颜回 or Hui, a disciple whom Confucius praises and mourns. Legge writes Yen Yuan and Yen Hui. The site's people page gives his courtesy name as 子渊. In his own voice he asks about ren and vows to practise it, sighs about his teacher's way, states a wish, answers at Kuang, and asks about governing. You can check each line on its passage page.",
      },
      {
        questionZh: "颜渊在 12.1 里自己说了什么？",
        questionEn: "What does Yan Yuan himself say in 12.1?",
        answerZh: "你能听到他两句话。一是「请问其目」，在孔子说出「克己复礼为仁」之后追问具体条目；二是在听完非礼勿视、勿听、勿言、勿动之后，说「回虽不敏，请事斯语矣」。导读译作「我颜回虽然不够聪敏，也要照这话去做」。仁的界定属于孔子，你引用时不要把它记成颜渊的话。",
        answerEn: "You hear two lines from him. He asks for the items of the practice, 请问其目, and after the four 非礼勿 answers (look, listen, speak, move) he says 回虽不敏，请事斯语矣. Legge renders it \"Though I am deficient in intelligence and vigour, I will make it my business to practise this lesson.\" The definition of ren in that passage belongs to Confucius, so you should not quote it as Yan Yuan's.",
      },
      {
        questionZh: "9.10「仰之弥高」说的是什么？",
        questionEn: "What is the \"looked up to them\" sigh in 9.10?",
        answerZh: "你读到的是颜渊描述老师之道：越仰望越高，越钻研越坚，看着在前，忽然又在后。他说老师循循善诱，用文献丰富他，用礼约束他；他想停停不下，才力用尽，仍找不到追上去的路。引用时请用活页原文或导读，不要换成更顺口却走样的转述，也不要把它扩写成一篇论学习方法的专文。",
        answerEn: "You are reading Yan Yuan describing his teacher's way: the higher he looks, the higher it seems; it appears ahead and then behind. He credits Confucius with leading step by step, enlarging him with learning and restraining him with ritual. He ends saying he has used all his ability and still finds no way to follow. Quote the live source or Legge rather than a smoothed paraphrase.",
      },
      {
        questionZh: "「不迁怒，不贰过」是颜渊说的吗？",
        questionEn: "Is 不迁怒，不贰过 something Yan Yuan said?",
        answerZh: "不是。你在雍也 6.2 里找到它：哀公问弟子谁好学，孔子回答说有颜回者好学，不迁怒，不贰过，同一句里还说他不幸短命死矣。这是老师回忆中的颜回，不是他的自述。你引用时请归到孔子名下，并写明篇章，不要把评语放进颜渊口中，也不要借它另写一篇修身鸡汤。",
        answerEn: "No. You find it in 6.2, where Confucius answers Duke Ai's question about who loved learning. The phrase describes Yan Hui as his teacher remembered him: he did not transfer his anger and did not repeat a fault. The same answer says he died young. When you cite it, attribute it to Confucius and name the passage, not to Yan Yuan.",
      },
      {
        questionZh: "颜渊、颜回、「回」是同一个人吗？",
        questionEn: "Are Yan Yuan, Yan Hui, and 回 the same person?",
        answerZh: "在本站是同一个人。英文索引作 Yan Yuan；Legge 印 Yen Yuan、Yen Hui、Hui。原文叙述多写颜渊，6.2 写颜回，他自称或孔子直呼时写回。人物页路径是 yan-hui，并补「字子渊」。你不该把这些写法拆成几位不同的弟子，也不要另造本站页面上没有的别名或尊号。",
        answerEn: "Yes, on this site they are one figure. The English index uses Yan Yuan; Legge prints Yen Yuan, Yen Hui, and Hui. The Chinese text says 颜渊 in narration, 颜回 in 6.2, and 回 when he or Confucius names him directly. The people page sits under the slug yan-hui and adds 字子渊. You should not split these into different people.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来打开颜渊索引",
        headingEn: "Read the Yan Yuan index next",
        bodyZh: [
          "当你想把所有提到他的章句放在同一页读，请打开[颜渊](https://www.lunyu.ai/zh-Hans/index/yan-yuan)。索引按他怎样被问、被看、被哭来分组；这一篇只听了他自己的几句。你回到那里，在上下文里把这几句再读一遍；引用任何一句时，请写明篇章网址，并说明用的是原文、白话导读还是英译。",
        ],
        bodyEn: [
          "When you want every passage that names him on one page, open [Yan Yuan](https://www.lunyu.ai/en/index/yan-yuan). The index groups how he is asked, seen and mourned; this Note only listened to his own lines. Read them again there in context, and when you quote any of them, give the passage URL and say whether you used the source, the guide, or Legge.",
        ],
      },
    ],
  },
  {
    slug: "fan-chi-in-the-analects",
    titleZh: "《论语》里的樊迟是谁？",
    titleEn: "Who Was Fan Chi in the Analects?",
    dekZh: "你搜「樊迟」，多半想先知道他是谁。本站人物索引为他列出六章，描述是：孔门弟子，多问仁、知、孝与农圃等现实问题。简短答案是：他一边驾车一边追问孝是什么意思，一再问知与仁，问怎样崇德修慝辨惑，请求学稼却被拒绝，又听闻仁是居处恭、执事敬、与人忠。下面每一句，你都可以回活页核对。",
    dekEn: "Fan Chi (樊迟) is the disciple who keeps asking. The site's people index groups six passages around him and calls him \"a disciple who asks practical questions about ren, knowledge, filial conduct, and work.\" He clarifies filial piety while driving, presses wisdom and ren more than once, asks how to repair the heart, requests farming lessons Confucius refuses, and hears how ren travels even among distant tribes. You can check every line below on its passage page.",
    descriptionZh: "《论语》里的樊迟：六问、一个索引条目。驾车追问孝，一再问知与仁，问怎样崇德修慝辨惑，并听见可随身携带的仁。链回可核对的原文。",
    descriptionEn: "Fan Chi in the Analects: six questions, one index entry—2.5 on filial piety, 6.20 and 12.22 on wisdom and ren, and 13.19 on conduct you can carry.",
    datePublished: "2026-10-15",
    dateModified: "2026-10-15",
    tagsZh: ["樊迟", "樊须", "为政"],
    tagsEn: ["fan chi", "Fan Chi", "Wei Chang"],
    related: [
      "/analects/wei-zheng/wei-zheng-005",
      "/index/fan-chi",
      "/analects/yong-ye/yong-ye-020",
      "/analects/yan-yuan/yan-yuan-021",
      "/analects/yan-yuan/yan-yuan-022",
      "/analects/zi-lu/zi-lu-004",
      "/analects/zi-lu/zi-lu-019",
    ],
    cover: notesBlogImage(
      "fan-chi-in-the-analects",
      "cover.jpg",
      "An empty carriage seat on an open road at dawn — a question waiting beside the reins",
      "黎明空路上的空车座——缰绳旁还停着一问",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "fan-chi-in-the-analects",
        "inline-1.jpg",
        "Two quiet doorways side by side — duties toward people, and the work of knowing people",
        "两扇并立的静门——对百姓的本分，与知人这一门",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "fan-chi-in-the-analects",
        "inline-2.jpg",
        "A tilled field left behind while a clear civic path stays open ahead",
        "身后是犁过的田，前头仍开着一条礼义的路",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "六问、一个索引条目",
        headingEn: "Six questions on one index",
        bodyZh: [
          "索引顺序列出为政 2.5、雍也 6.20、颜渊 12.21、颜渊 12.22、子路 13.4、子路 13.19。卡片上的「Wei Zheng」「Yong Ye」一类标签只是地图，不是引用锚；你打开章页时，应使用活页短标题：为政、雍也、颜渊、子路。英文页 Legge 多印 Fan Ch'ih，13.4 又印 Fan Hsu 对应「樊须」。原文多数场面写樊迟，只有他出去之后，孔子才称樊须。人物页写在 fan-xu 路径下，说「樊须字子迟，通称樊迟」，并转述《史记》记樊须少孔子三十六岁。你应把年龄差当作出处转述，不要写成确定生年，也不要在《论语》与这一句之外另造履历。",
        ],
        bodyEn: [
          "The index lists six doors: Wei Zheng 2.5, Yong Ye 6.20, Yan Yuan 12.21 and 12.22, Zi Lu 13.4 and 13.19. Card labels are maps, not citation anchors—cite the live short titles Wei Chang, Yung Yey, Yen Yuan, and Tsze-lu. Legge prints Fan Ch'ih, and in 13.4 also Fan Hsu for 樊须; Chinese lines use 樊迟 in most scenes and 樊须 once after he leaves. The people page under fan-xu says 樊须字子迟，通称樊迟, and attributes to the Shiji that Fan Xu was thirty-six years younger than Confucius. Treat that age line as attribution, not a firm birth year.",
        ],
      },
      {
        headingZh: "为政 2.5——驾车时追问「无违」",
        headingEn: "Wei Chang 2.5: clarifying filial piety from the driver's seat",
        bodyZh: [
          "请你先打开[论语 · 为政 2.5](https://www.lunyu.ai/zh-Hans/analects/wei-zheng/wei-zheng-005)，因为索引把它排在第一，也因为你在这里遇见的是正在驾车的樊迟。原文是：孟懿子问孝，子曰，无违。樊迟御，子吿之曰，孟孙问孝于我，我对曰，无违。樊迟曰，何谓也，子曰，生事之以礼，死葬之以礼，祭之以礼。同页白话导读说：孟懿子问什么是孝。孔子说：不要违背礼。后来樊迟为孔子驾车，孔子告诉他说：孟孙问我孝，我回答说不要违背礼。樊迟问这是什么意思。孔子说：父母活着时，要按礼侍奉；父母去世后，要按礼安葬，按礼祭祀。",
          "同页 Legge 1893 年英译写道：Mang I asked what filial piety was. The Master said, \"It is not being disobedient.\" Soon after, as Fan Ch'ih was driving him, the Master told him, saying, \"Mang-sun asked me what filial piety was, and I answered him,—'not being disobedient.'\" Fan Ch'ih said, \"What did you mean?\" The Master replied, \"That parents, when alive, be served according to propriety; that, when dead, they should be buried according to propriety; and that they should be sacrificed to according to propriety.\" 请你留意先后：先是给孟懿子的短答，接着是樊迟驾车，然后才是他追问后的澄清。你对孔子为何要向驾车者复述那句答语的体会，应写成自己的启发并标明，不要写进原文。活页作「吿」，你引用时也保留这个字形。",
        ],
        bodyEn: [
          "Open [The Analects · Wei Chang 2.5](https://www.lunyu.ai/en/analects/wei-zheng/wei-zheng-005) first, because the index puts it first and because you meet Fan Chi mid-scene. The source line is 孟懿子问孝，子曰，无违。樊迟御，子吿之曰，孟孙问孝于我，我对曰，无违。樊迟曰，何谓也，子曰，生事之以礼，死葬之以礼，祭之以礼。 The modern Chinese guide on that page says: 孟懿子问什么是孝。孔子说：不要违背礼。后来樊迟为孔子驾车，孔子告诉他说：孟孙问我孝，我回答说不要违背礼。樊迟问这是什么意思。孔子说：父母活着时，要按礼侍奉；父母去世后，要按礼安葬，按礼祭祀。",
          "Legge's 1893 English on the same page reads: Soon after, as Fan Ch'ih was driving him, the Master told him, saying, \"Mang-sun asked me what filial piety was, and I answered him,—'not being disobedient.'\" Fan Ch'ih said, \"What did you mean?\" The Master replied, \"That parents, when alive, be served according to propriety; that, when dead, they should be buried according to propriety; and that they should be sacrificed to according to propriety.\" Notice the order: a short answer to Mang I, then Fan Chi driving, then the clarification he asks for. Your reflection on that retelling belongs in your own layer, marked as yours. Keep 吿 as the live page prints it.",
        ],
      },
      {
        headingZh: "雍也 6.20——一问知、一问仁",
        headingEn: "Yung Yey 6.20: wisdom and ren in one exchange",
        imageSlot: "inline-1",
        bodyZh: [
          "[论语 · 雍也 6.20](https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-020)把两问收在同一段短对话里。原文是：樊迟问知。子曰，务民之义，敬鬼神而远之，可谓知矣。问仁。曰，仁者先难而后获，可谓仁矣。导读说：樊迟问怎样才算聪明智慧。孔子说：专心去做对百姓合宜有益的事，敬奉鬼神而又远离它，这就可以算是聪明智慧了。樊迟又问怎样才算仁。孔子说：有仁德的人，凡事先付出艰苦的努力，然后才收获成果，这就可以算是仁了。Legge 写道：Fan Ch'ih asked what constituted wisdom. The Master said, \"To give one's self earnestly to the duties due to men, and, while respecting spiritual beings, to keep aloof from them, may be called wisdom.\" He asked about perfect virtue. The Master said, \"The man of virtue makes the difficulty to be overcome his first business, and success only a subsequent consideration;—this may be called perfect virtue.\" 你应把知与仁读成同一页上的两答，不要改写成现代效率口号。引用时请说明用的是原文、导读还是 Legge。",
        ],
        bodyEn: [
          "[The Analects · Yung Yey 6.20](https://www.lunyu.ai/en/analects/yong-ye/yong-ye-020) keeps two questions in one short exchange. The source is 樊迟问知。子曰，务民之义，敬鬼神而远之，可谓知矣。问仁。曰，仁者先难而后获，可谓仁矣。 The guide says: 樊迟问怎样才算聪明智慧。孔子说：专心去做对百姓合宜有益的事，敬奉鬼神而又远离它，这就可以算是聪明智慧了。樊迟又问怎样才算仁。孔子说：有仁德的人，凡事先付出艰苦的努力，然后才收获成果，这就可以算是仁了。 Legge writes: Fan Ch'ih asked what constituted wisdom. The Master said, \"To give one's self earnestly to the duties due to men, and, while respecting spiritual beings, to keep aloof from them, may be called wisdom.\" He asked about perfect virtue. The Master said, \"The man of virtue makes the difficulty to be overcome his first business, and success only a subsequent consideration;—this may be called perfect virtue.\" Hold the two answers on one page; when you cite them, say whether you used the source, the guide, or Legge.",
        ],
      },
      {
        headingZh: "颜渊 12.21–12.22——修慝辨惑，再到爱人、知人",
        headingEn: "Yen Yuan 12.21–12.22: moral repair, then loving and knowing people",
        bodyZh: [
          "在舞雩之下，[论语 · 颜渊 12.21](https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-021)让你听见三个动词收在一问里。原文起首是：樊迟从游于舞雩之下。曰，敢问崇德，修慝，辨惑。子曰，善哉问。先事后得，非崇德与，攻其恶，无攻人之恶，非修慝与，一朝之忿，忘其身以及其亲，非惑与。导读开头发说：樊迟陪着孔子在舞雩台下游览。他说：请问怎样提高道德、消除内心的邪恶、辨别迷惑？孔子说：问得好啊！你可把这一章当作较轻的一门，关于自我修治，再转入下一章更密的一问。",
          "[论语 · 颜渊 12.22](https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-022)起首是：樊迟问仁。子曰，爱人。问知。子曰，知人。樊迟未达。子曰，擧直错诸枉，能使枉者直。导读开头发说：樊迟请教什么是仁。孔子说：爱人。又问什么是智。孔子说：了解人。樊迟没有领会。Legge 开头说：Fan Ch'ih asked about benevolence. The Master said, \"It is to love all men.\" He asked about knowledge. The Master said, \"It is to know all men.\" 樊迟尚未领会，孔子遂补「擧直错诸枉，能使枉者直」，樊迟退而见子夏（Legge 作 Tsze-hsia）。活页作「擧」，你引用时也保留。引「爱人」「知人」时，请停在樊迟的场面里，不要把本篇写成另一篇论仁专文。",
        ],
        bodyEn: [
          "Under the rain altars, [The Analects · Yen Yuan 12.21](https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-021) gives you three verbs in one ask. The source opens 樊迟从游于舞雩之下。曰，敢问崇德，修慝，辨惑。子曰，善哉问。先事后得，非崇德与，攻其恶，无攻人之恶，非修慝与，一朝之忿，忘其身以及其亲，非惑与。 The guide's opening says: 樊迟陪着孔子在舞雩台下游览。他说：请问怎样提高道德、消除内心的邪恶、辨别迷惑？孔子说：问得好啊！ Read that as a lighter door about repair of the self, then move to the denser Yen Yuan scene.",
          "[The Analects · Yen Yuan 12.22](https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-022) begins 樊迟问仁。子曰，爱人。问知。子曰，知人。樊迟未达。子曰，擧直错诸枉，能使枉者直。 The guide's opening says: 樊迟请教什么是仁。孔子说：爱人。又问什么是智。孔子说：了解人。樊迟没有领会。 Legge's opening reads: Fan Ch'ih asked about benevolence. The Master said, \"It is to love all men.\" He asked about knowledge. The Master said, \"It is to know all men.\" Fan Chi does not yet understand, so Confucius adds 擧直错诸枉，能使枉者直, and Fan Chi takes the line to Zi Xia (子夏; Legge Tsze-hsia). Keep 擧 as the live page prints it. Stay inside Fan Chi's scenes when you quote 爱人 and 知人; do not turn this Note into a separate ren essay.",
        ],
      },
      {
        headingZh: "子路 13.4——请学稼（六门之一，不是主脊）",
        headingEn: "Tsze-lu 13.4: the request to learn farming",
        imageSlot: "inline-2",
        bodyZh: [
          "[论语 · 子路 13.4](https://www.lunyu.ai/zh-Hans/analects/zi-lu/zi-lu-004)是六门之一，不是本篇标题的主脊。原文起首是：樊迟请学稼。子曰，吾不如老农。请学为圃。曰，吾不如老圃。樊迟出。子曰，小人哉，樊须也。导读说：樊迟请求学种庄稼。孔子说：我不如老农。樊迟又请求学种菜。孔子说：我不如老菜农。樊迟出去后，孔子说：樊须真是个器量狭小的人啊！Legge 开头说：Fan Ch'ih requested to be taught husbandry. The Master said, \"I am not so good for that as an old husbandman.\" He requested also to be taught gardening, and was answered, \"I am not so good for that as an old gardener.\" Fan Ch'ih having gone out, the Master said, \"A small man, indeed, is Fan Hsu!\" 樊迟出去后，孔子转向礼、义、信，说百姓会襁负其子而来。你不要把这一页改写成农事专论，也不要把那句批评扩成一份完整人物鉴定书。",
        ],
        bodyEn: [
          "[The Analects · Tsze-lu 13.4](https://www.lunyu.ai/en/analects/zi-lu/zi-lu-004) is one door among the six, not the title spine of this Note. The source opens 樊迟请学稼。子曰，吾不如老农。请学为圃。曰，吾不如老圃。樊迟出。子曰，小人哉，樊须也。 The guide says: 樊迟请求学种庄稼。孔子说：我不如老农。樊迟又请求学种菜。孔子说：我不如老菜农。樊迟出去后，孔子说：樊须真是个器量狭小的人啊！ Legge's opening reads: Fan Ch'ih requested to be taught husbandry. The Master said, \"I am not so good for that as an old husbandman.\" He requested also to be taught gardening, and was answered, \"I am not so good for that as an old gardener.\" Fan Ch'ih having gone out, the Master said, \"A small man, indeed, is Fan Hsu!\" After Fan Chi leaves, Confucius turns to ritual, righteousness, and good faith as what draws people. You should not rewrite this page as a farming essay.",
        ],
      },
      {
        headingZh: "子路 13.19——可随身携带的仁",
        headingEn: "Tsze-lu 13.19: ren you can carry anywhere",
        bodyZh: [
          "[论语 · 子路 13.19](https://www.lunyu.ai/zh-Hans/analects/zi-lu/zi-lu-019)在本篇里是六门中较轻的一门，却仍见同一发问习惯。原文是：樊迟问仁。子曰，居处恭，执事敬，与人忠，虽之夷狄，不可弃也。导读说：樊迟问怎样才是仁。孔子说：平日居家态度恭敬，办理事务严肃认真，待人忠诚。即使到了没有教化的偏远地方，这些也是不能丢弃的。Legge 写道：Fan Ch'ih asked about perfect virtue. The Master said, \"It is, in retirement, to be sedately grave; in the management of business, to be reverently attentive; in intercourse with others, to be strictly sincere. Though a man go among rude, uncultivated tribes, these qualities may not be neglected.\" 你应把它读成可随身携带的实践，而不是活页之外另造的旅行忠告。",
        ],
        bodyEn: [
          "[The Analects · Tsze-lu 13.19](https://www.lunyu.ai/en/analects/zi-lu/zi-lu-019) is the lightest of the six for this Note, yet it still shows the same habit of asking. The source is 樊迟问仁。子曰，居处恭，执事敬，与人忠，虽之夷狄，不可弃也。 The guide says: 樊迟问怎样才是仁。孔子说：平日居家态度恭敬，办理事务严肃认真，待人忠诚。即使到了没有教化的偏远地方，这些也是不能丢弃的。 Legge writes: Fan Ch'ih asked about perfect virtue. The Master said, \"It is, in retirement, to be sedately grave; in the management of business, to be reverently attentive; in intercourse with others, to be strictly sincere. Though a man go among rude, uncultivated tribes, these qualities may not be neglected.\" Hold it as practice you can carry.",
        ],
      },
      {
        headingZh: "六章合起来说了什么，又没说什么",
        headingEn: "What the six add up to, and what they leave out",
        bodyZh: [
          "合读六章，你看到的是一个不肯放过短答的学生：他在驾车时追问「无违」，把知与仁成对来问，问怎样崇德与辨惑，追问爱人、知人直到子夏来解，请求学稼却听到拒绝，最后又听见仁被说成恭、敬、忠，走到哪里都不能丢。官职、确定生年、战事叙事，这六章都没有写，你就应留空，不要借别处补齐。子路另有人物笔记，仁也另有札记；这一篇只写发问的那个人。引用上面任何一句时，请你标明篇章网址，并说明用的是原文、白话导读还是 Legge。每一页都把这几层和本地启发框分开放，你的引用也应分开。",
        ],
        bodyEn: [
          "Read together, the pages show you a student who will not leave a short answer alone: he clarifies 无违 while holding the reins, pairs wisdom with ren, asks how to repair the heart, presses 爱人 and 知人 until Zi Xia helps, requests farming skill and hears a refusal, and hears ren named as conduct that travels with you. Offices, a firm birth year, and a battle narrative are not what these six print, so you should leave them out. Zi Lu has his own Who Note; this page stays with the asker. When you quote any line above, name the passage URL and say whether you used the source, the modern Chinese guide, or Legge.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的樊迟是谁？",
        questionEn: "Who was Fan Chi in the Analects?",
        answerZh: "你在本站见到的樊迟（亦称樊须；Legge 作 Fan Ch'ih、Fan Hsu），出现在人物索引归并的六章里。为政 2.5 里他驾车追问孝；雍也 6.20、颜渊 12.22、子路 13.19 里他问知与仁；颜渊 12.21 里他在舞雩下问崇德修慝辨惑；子路 13.4 里他请学稼。你在这里能核对到的记载，就是这些。",
        answerEn: "You meet Fan Chi (樊迟; also 樊须; Legge Fan Ch'ih and Fan Hsu) as the disciple the index groups under six related passages. He clarifies filial piety while driving in Wei Chang 2.5, asks about wisdom and ren in Yung Yey 6.20 and again in Yen Yuan 12.22 and Tsze-lu 13.19, asks how to exalt virtue under the rain altars in 12.21, and requests farming lessons in Tsze-lu 13.4. That is the record you can verify here.",
      },
      {
        questionZh: "他为什么一再问仁、问知？",
        questionEn: "Why does Fan Chi keep asking about ren and knowledge?",
        answerZh: "你在活页上就能看见这个习惯。6.20 先问知再问仁；12.22 先问仁再问知，却仍未达；13.19 又问仁。问题始终贴着实践：对百姓的本分、爱人、知人、以及可随身携带的立身。你不要把它们压成一句口号，也不要替原文补一份它没有写的心理分析。",
        answerEn: "You see the habit on the pages themselves. In 6.20 he asks 知 then 仁; in 12.22 he asks 仁 then 知 and still does not yet understand; in 13.19 he asks 仁 once more. The questions stay practical: duties to people, loving people, knowing people, and conduct you can carry. You should not collapse them into one slogan, and you should not invent a psychology the passages do not print.",
      },
      {
        questionZh: "12.22 里的「爱人」「知人」是什么意思？",
        questionEn: "What does 爱人 and 知人 mean in 12.22?",
        answerZh: "你可以照导读开头发来读：仁是爱人，智是了解人。Legge 译作 to love all men 与 to know all men。樊迟尚未领会，孔子遂补「擧直错诸枉，能使枉者直」，樊迟又拿去问子夏。请你把场面留在这一章里，不要把它扩写成另一篇论仁专文，也不要脱离樊迟的问答去另写概念史。",
        answerEn: "You can rely on the guide's opening: ren is to love people, and knowledge is to understand people. Legge renders them \"to love all men\" and \"to know all men.\" Fan Chi has not yet grasped the answers, so Confucius adds the line about employing the upright and setting aside the crooked, and Fan Chi takes that line to Zi Xia. Keep the scene inside this passage; do not turn it into a separate ren treatise.",
      },
      {
        questionZh: "13.4 里孔子为什么不肯教他学稼？",
        questionEn: "Why did Confucius refuse to teach him farming in 13.4?",
        answerZh: "你在活页上找到的是拒绝，不是现代职业讲座。樊迟请学稼、学圃；孔子说自己不如老农、老圃；等他出去，孔子称他樊须、说「小人哉」，再转向礼、义、信。你可以留意这个先后，也可以把自己的体会标成启发，但不应把农事写成樊迟是谁的主脊。",
        answerEn: "You will find the refusal on the page, not a modern career lecture. Fan Chi asks to learn husbandry and gardening; Confucius says he is not as good as an old husbandman or an old gardener; after Fan Chi goes out, Confucius calls him Fan Hsu and a small man, then turns to ritual, righteousness, and good faith. You may notice that sequence and think about it, but you should not make agriculture the spine of who Fan Chi is.",
      },
      {
        questionZh: "樊迟、Fan Ch'ih、樊须是同一个人吗？",
        questionEn: "Are Fan Chi, Fan Ch'ih, 樊迟, and 樊须 the same person?",
        answerZh: "你看到的是同一个索引条目。英文索引作 Fan Chi；Legge 多数场面印 Fan Ch'ih，13.4 印 Fan Hsu 对应樊须。原文多数写樊迟，13.4 在他出去后写樊须。人物页补「字子迟」，路径作 fan-xu。这些写法都指向同一个发问者，你不该把它们拆成几位不同的弟子。",
        answerEn: "You are looking at one index entry. The site's English index uses Fan Chi; Legge prints Fan Ch'ih in most scenes and Fan Hsu in 13.4 for 樊须. The Chinese passages mostly say 樊迟, and 13.4 uses 樊须 when Confucius speaks after he has left. The people page adds 字子迟 under the slug fan-xu. These are labels for one asker, so you should not split them into separate disciples.",
      },
      {
        questionZh: "为政 2.5 驾车那一幕发生了什么？",
        questionEn: "What happens in the driving scene in Wei Chang 2.5?",
        answerZh: "你听见孟懿子问孝，得到「无违」。后来樊迟驾车，孔子复述那句答语，樊迟追问什么意思。澄清是：生事之以礼，死葬之以礼，祭之以礼。你的下一步是打开为政活页，而不是用更顺的摘要删掉驾车框架，或替孔子补一个原章没有写的动机。",
        answerEn: "You hear Mang I ask about filial piety and receive 无违. Later Fan Chi is driving, Confucius retells that answer, and Fan Chi asks what it means. The clarification is ritual service in life, burial, and sacrifice. Your next step is the live Wei Chang page, not a smoother paraphrase that drops the driving frame or invents a motive for the retelling.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来打开樊迟索引",
        headingEn: "Open the Fan Chi index next",
        bodyZh: [
          "当你想把六章放在同一屏上读，请打开[樊迟](https://www.lunyu.ai/zh-Hans/index/fan-chi)，按索引列出的顺序读下去，从为政 2.5 开始。你问问自己：离开页面前，你会先追问哪一问？然后停住，让原文、导读与英译各守一层，而不是让你的摘要替它们说话。",
        ],
        bodyEn: [
          "When you want all six passages on one screen, open [Fan Chi](https://www.lunyu.ai/en/index/fan-chi) and read them in the order the index lists them, beginning with Wei Chang 2.5. Ask yourself which question you would have pressed first before you leave the page. Then stop, and let the source, the guide, and Legge each speak in its own layer rather than through your summary.",
        ],
      },
    ],
  },
  {
    slug: "nan-gong-kuo-in-the-analects",
    titleZh: "《论语》里的南宫适是谁？",
    titleEn: "Who Was Nan Gong Kuo in the Analects?",
    dekZh: "你搜「南宫适」，多半想先知道他是谁。本站人物索引为他列出三章，其中两章称他南容。简短答案是：他在宪问 14.6 问孔子，善射的羿、能陆地行舟的奡都没能善终，亲自耕种的禹和稷却得到了天下；孔子当面没有回答，等他出去才说，这个人真是君子，真崇尚德行。下面每一句，你都可以回活页核对。",
    dekEn: "Nan Gong Kuo (南宫适) is a figure the site's people index ties to three passages; two of them call him Nan Rong (南容). If you searched his name, in short: he asks Confucius why a great archer and a man who moved a boat over land both died unnatural deaths while two farmers came to possess the kingdom. The Master says nothing, then praises him once he has left. You can check every line below on its passage page.",
    descriptionZh: "《论语》里的南宫适：三章、两个名字、一个索引条目。宪问 14.6 问而未答，先进 11.5 反复诵读白圭，公冶长 5.1 记下治世与乱世中的立身。链回可核对的原文。",
    descriptionEn: "Nan Gong Kuo in the Analects: three passages, two names, one index entry—14.6's unanswered question, 11.5's white-jade lines, and 5.1.",
    datePublished: "2026-10-14",
    dateModified: "2026-10-14",
    tagsZh: ["南宫适", "南容", "宪问"],
    tagsEn: ["nan gong kuo", "Nan Gong Kuo", "Hsien Wan"],
    related: [
      "/analects/xian-wen/xian-wen-006",
      "/index/nan-gong-kuo",
      "/analects/xian-jin/xian-jin-005",
      "/analects/gong-ye-chang/gong-ye-chang-001",
    ],
    cover: notesBlogImage(
      "nan-gong-kuo-in-the-analects",
      "cover.jpg",
      "A bow and a boat left on dry land beside a freshly tilled field — the comparison in Nan Gong Kuo's question",
      "搁在旱地上的弓与船，旁边是新耕的田——南宫适那一问里的对照",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "nan-gong-kuo-in-the-analects",
        "inline-1.jpg",
        "A plain white jade tablet with three faint echoes of itself — lines recited again and again",
        "一块素白玉圭与三道淡淡回影——一再诵读的诗句",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "nan-gong-kuo-in-the-analects",
        "inline-2.jpg",
        "One footbridge in calm light and in a storm, the same small figure unharmed in both — conduct under good and bad government",
        "同一座小桥，晴时与风雨时，同一个小小身影都安然无恙——治世与乱世中的立身",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "三章、两个名字、一个索引条目",
        headingEn: "Three passages, two names, one index entry",
        bodyZh: [
          "本站人物索引把这三章归在同一个条目「南宫适」之下，描述是：孔门相关人物，涉及德行、尚贤与历史人物评价。这一归并对你很要紧，因为原文本身用了两个名字：公冶长 5.1 与先进 11.5 写作南容，Legge 印作 Nan Yung；宪问 14.6 写作南宫适，Legge 印作 Nan-kung Kwo。14.6 活页的拼音把「适」注作 kuò，与英文索引里的 Kuo 对得上。",
          "中文索引还会把你引向第三种写法的人物页：南宫括。那一页的简介说，《史记》以南宫括、字子容立传，把《论语》中南容、南宫适的相关言行合载；同页也说明，不进一步把他与南宫敬叔的身份关系写作已证事实，生卒年也标为不详。你引用时，就停在它停下的地方。",
        ],
        bodyEn: [
          "The people index files all three passages under one heading, Nan Gong Kuo, and describes him as \"a figure linked with virtue, worthiness, and judgments of historical models.\" That grouping matters to you, because the Chinese text itself uses two names. Kung-ye Ch'ang 5.1 and Hsien Tsin 11.5 say 南容, which Legge prints as Nan Yung; Hsien Wan 14.6 says 南宫适, which Legge prints as Nan-kung Kwo. The pinyin on the 14.6 page reads 适 as kuò, matching the Kuo in the index name.",
          "The Chinese index also points you to a profile filed under a third form, 南宫括. Its summary says the Shiji gives him a biography as 南宫括, courtesy name 子容, and records the Nan Rong and Nan Gong Kuo material together. The same profile declines to treat his link to 南宫敬叔 as an established fact and lists his birth and death years as unknown. You should stop where it stops.",
        ],
      },
      {
        headingZh: "宪问 14.6——孔子没有回答的那一问",
        headingEn: "Hsien Wan 14.6: the question Confucius did not answer",
        bodyZh: [
          "三章里只有这一章是他开口说话，你应该先读它。请打开[论语 · 宪问 14.6](https://www.lunyu.ai/zh-Hans/analects/xian-wen/xian-wen-006)。原文是：南宫适问于孔子曰，羿善射，奡荡舟，俱不得其死然，禹稷躬稼，而有天下。夫子不答。南宫适出。子曰，君子哉若人，尙德哉若人。同页白话导读说：南宫适问孔子说：羿善于射箭，奡能陆地行舟，都没能得到善终；禹和稷亲自耕种庄稼，却得到了天下。孔子没有回答。南宫适出去后，孔子说：这个人真是君子啊！这个人真崇尚德行啊！",
          "同页 Legge 1893 年英译写道：Nan-kung Kwo, submitting an inquiry to Confucius, said, \"I was skillful at archery, and Ao could move a boat along upon the land, but neither of them died a natural death. Yu and Chi personally wrought at the toils of husbandry, and they became possessors of the kingdom.\" The Master made no reply; but when Nan-kung Kwo went out, he said, \"A superior man indeed is this! An esteemer of virtue indeed is this!\" 句首的 I 是 Legge 对羿的拼写，你不要把它读成发问者在自夸。",
          "请你留意页面给出的先后：先是拿射艺、陆地行舟的本事与亲身耕作相比，接着是发问者在场时的沉默，最后是他出去之后的称赞。原文没有交代孔子为什么不答。你对这份沉默的体会，应写成自己的启发并标明，不要写进经文里。",
        ],
        bodyEn: [
          "Of the three, this is the only passage where he speaks, so it is the one you should read first. Open [The Analects · Hsien Wan 14.6](https://www.lunyu.ai/en/analects/xian-wen/xian-wen-006). The source line is 南宫适问于孔子曰，羿善射，奡荡舟，俱不得其死然，禹稷躬稼，而有天下。夫子不答。南宫适出。子曰，君子哉若人，尙德哉若人。 The modern Chinese guide on that page says: 南宫适问孔子说：羿善于射箭，奡能陆地行舟，都没能得到善终；禹和稷亲自耕种庄稼，却得到了天下。孔子没有回答。南宫适出去后，孔子说：这个人真是君子啊！这个人真崇尚德行啊！",
          "Legge's 1893 English on the same page reads: Nan-kung Kwo, submitting an inquiry to Confucius, said, \"I was skillful at archery, and Ao could move a boat along upon the land, but neither of them died a natural death. Yu and Chi personally wrought at the toils of husbandry, and they became possessors of the kingdom.\" The Master made no reply; but when Nan-kung Kwo went out, he said, \"A superior man indeed is this! An esteemer of virtue indeed is this!\" In that sentence \"I\" is Legge's spelling of the archer 羿, so you should not read it as the speaker boasting.",
          "Notice the order the page gives you: a comparison of archery and boat-moving prowess against labor in the fields, silence while the questioner is in the room, and praise only after he goes out. The text does not say why Confucius stayed silent. Whatever you make of that silence belongs in your own reflection, marked as yours, not in the passage.",
        ],
      },
      {
        headingZh: "先进 11.5——反复诵读白圭",
        headingEn: "Hsien Tsin 11.5: repeating the white-jade lines",
        imageSlot: "inline-1",
        bodyZh: [
          "[论语 · 先进 11.5](https://www.lunyu.ai/zh-Hans/analects/xian-jin/xian-jin-005)只有一句：南容三复白圭，孔子以其兄之子妻之。导读说：南容反复诵读《诗经》中关于白圭的诗句，孔子便把自己哥哥的女儿嫁给了他。Legge 写道：Nan Yung was frequently repeating the lines about a white scepter stone. Confucius gave him the daughter of his elder brother to wife. 导读告诉你诗句出自《诗经》、讲的是白圭，但活页没有印出那段诗。你不要把一段诗文贴进来，当成这一章的内容。页上给你的，是一个习惯——反复诵读——以及随后的一桩婚事。",
        ],
        bodyEn: [
          "[The Analects · Hsien Tsin 11.5](https://www.lunyu.ai/en/analects/xian-jin/xian-jin-005) is a single sentence: 南容三复白圭，孔子以其兄之子妻之。 The guide says: 南容反复诵读《诗经》中关于白圭的诗句，孔子便把自己哥哥的女儿嫁给了他。 Legge writes: Nan Yung was frequently repeating the lines about a white scepter stone. Confucius gave him the daughter of his elder brother to wife. The guide tells you the lines come from the Shijing and concern a white jade tablet, but the page does not print the poem. You should not paste a stanza in and present it as part of this passage. What the page does give you is a habit, repetition, and the family decision that followed it.",
        ],
      },
      {
        headingZh: "公冶长 5.1——有道不废，无道免于刑戮",
        headingEn: "Kung-ye Ch'ang 5.1: kept in office, kept from punishment",
        imageSlot: "inline-2",
        bodyZh: [
          "[论语 · 公冶长 5.1](https://www.lunyu.ai/zh-Hans/analects/gong-ye-chang/gong-ye-chang-001)把两桩婚事写在同一章。原文是：子谓公冶长，可妻也，虽在缧绁之中，非其罪也。以其子妻之。子谓南容，邦有道，不废，邦无道，免于刑戮。以其兄之子妻之。关于他的那一半，导读说：孔子谈到南容，说：国家政治清明时，他不会被废弃不用；国家政治黑暗时，他也能免于刑罚杀戮。于是把自己哥哥的女儿嫁给了他。Legge 译这一半为：Of Nan Yung he said that if the country were well governed he would not be out of office, and if it were ill-governed, he would escape punishment and disgrace. He gave him the daughter of his own elder brother to wife. 前一半写的是公冶长，那是另一个人，娶的是孔子自己的女儿；你应把两桩婚事分开读。",
        ],
        bodyEn: [
          "[The Analects · Kung-ye Ch'ang 5.1](https://www.lunyu.ai/en/analects/gong-ye-chang/gong-ye-chang-001) puts two marriages in one passage. The source is 子谓公冶长，可妻也，虽在缧绁之中，非其罪也。以其子妻之。子谓南容，邦有道，不废，邦无道，免于刑戮。以其兄之子妻之。 For his half, the guide says: 孔子谈到南容，说：国家政治清明时，他不会被废弃不用；国家政治黑暗时，他也能免于刑罚杀戮。于是把自己哥哥的女儿嫁给了他。 Legge's second clause reads: \"Of Nan Yung he said that if the country were well governed he would not be out of office, and if it were ill-governed, he would escape punishment and disgrace. He gave him the daughter of his own elder brother to wife.\" The first half is about Kung-ye Ch'ang, a different man, who received Confucius's own daughter. You should keep the two marriages apart.",
        ],
      },
      {
        headingZh: "三章合起来说了什么，又没说什么",
        headingEn: "What the three passages add up to, and what they leave out",
        bodyZh: [
          "合读三章，你看到的是一个人被这样评价：看他怎样衡量历史人物，看他反复诵读的一段诗句，看他在治世与乱世里如何自处。5.1 与 11.5 都以同一件事收束：孔子把哥哥的女儿嫁给了他。这是活页上写着的，你可以直说。他担任过什么职务、那一问发生在哪一年，这三章都没有写，你就应留空，而不是借别处的说法补齐。",
          "禹在本站另有尧舜禹札记，子路、仲弓也各有自己的人物笔记；这一篇只写发问的那个人。引用上面任何一句时，请你标明篇章网址，并说明用的是原文、白话导读还是 Legge 英译。每一页都把这几层和本地启发框分开放，你的引用也应分开。",
        ],
        bodyEn: [
          "Read together, the pages show you a man judged by how he weighs historical examples, by a line he kept reciting, and by how he would fare under good and bad government. Both 5.1 and 11.5 end in the same family decision: Confucius married his elder brother's daughter to him. That repetition is on the pages, so you may state it plainly. Offices held and the date of the archer question are not in these passages, so you should leave them out rather than borrow them.",
          "Yu has his own place in the site's Yao–Shun–Yu Note, and Zi Lu and Zhong Gong have their own Who Notes; this page stays with the man who asked. When you quote any line above, name the passage URL and say whether you used the source, the modern Chinese guide, or Legge. Each page keeps those layers and its local reflection box apart, and your citation should too.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的南宫适是谁？",
        questionEn: "Who was Nan Gong Kuo in the Analects?",
        answerZh: "你在本站见到的南宫适，出现在三章里，人物索引把它们归为同一个条目。宪问 14.6 里，他拿善射的羿、陆地行舟的奡与亲自耕种的禹、稷相比发问，孔子当面不答，等他出去后称他是君子、是崇尚德行的人。公冶长 5.1 与先进 11.5 称他南容，孔子把哥哥的女儿嫁给了他。你在这里能核对到的记载，就是这些。",
        answerEn: "You meet Nan Gong Kuo (南宫适) in three passages that the site's index groups under one name. In Hsien Wan 14.6 he asks about the archer 羿, the boat-mover 奡, and the farmers 禹 and 稷; after he leaves, Confucius calls him a superior man who esteems virtue. In 5.1 and 11.5 he appears as 南容, and Confucius gives him his elder brother's daughter in marriage. That is the record you can verify here.",
      },
      {
        questionZh: "南容和南宫适是同一个人吗？",
        questionEn: "Is Nan Rong (南容) the same person as Nan Gong Kuo?",
        answerZh: "本站把二者当作一人，你可以看到依据在哪里。南宫适索引把两章「南容」与一章「南宫适」并列；中文人物页以南宫括、字子容为名，说《史记》把南容、南宫适的言行合载为一传。同一页对其他身份关联保持保留。所以你引用时，应说这是本站索引与《史记》的归并，而不是《论语》原文自己写明的事实。",
        answerEn: "The site treats them as one, and you can see how. Its Nan Gong Kuo index lists the two 南容 passages beside the 南宫适 passage, and its Chinese profile, filed under 南宫括 with the courtesy name 子容, says the Shiji records both names in one biography. That profile stops short of further identifications, so you should cite the grouping as the site's and the Shiji's, not as something the Analects states.",
      },
      {
        questionZh: "14.6 里孔子为什么不回答？",
        questionEn: "Why did Confucius not answer him in 14.6?",
        answerZh: "你在活页上找不到理由。原文只写「夫子不答」，导读写「孔子没有回答」，Legge 写 The Master made no reply。称赞是在发问者出去之后才说的。你可以留意这个先后，也可以把自己的体会写下来并标成启发，但不应替孔子补一个动机、一层隐义，或一段原章并没有印出的事后解释。",
        answerEn: "You will not find a reason on the page. The source says only 夫子不答, the guide says 孔子没有回答, and Legge says the Master made no reply. The praise comes once the questioner has gone out. You may notice that sequence and think about it, but you should not supply a motive, a hidden lesson, or a later explanation that the passage itself does not print.",
      },
      {
        questionZh: "「南容三复白圭」是什么意思？",
        questionEn: "What does 南容三复白圭 mean?",
        answerZh: "你可以照导读来读：南容反复诵读《诗经》中关于白圭的诗句，孔子便把自己哥哥的女儿嫁给了他。Legge 把白圭译作 a white scepter stone。活页没有引出那段诗的原文，所以如果你另外引用诗句，应注明出自别的来源，并把它放在章句之外，不要写成先进 11.5 本身的文字。",
        answerEn: "You can rely on the guide: Nan Rong repeatedly recited the Shijing lines about a white jade tablet, 白圭, and Confucius then gave him his elder brother's daughter in marriage. Legge renders the object as \"a white scepter stone.\" The page does not quote the poem itself, so if you bring in its words, label them as coming from another source and keep them outside the passage.",
      },
      {
        questionZh: "「邦有道，不废，邦无道，免于刑戮」说他什么？",
        questionEn: "What does 邦有道，不废，邦无道，免于刑戮 say about him?",
        answerZh: "你读到的是孔子对南容的判断：国家政治清明时，他不会被废弃不用；国家政治黑暗时，他也能免于刑罚杀戮。这是导读的说法，Legge 则译作 punishment and disgrace。你应把它当作公冶长 5.1 记下的一句评价，看他在两种世道里如何立身，而不是扩写成一份他担任过哪些官职的履历。",
        answerEn: "You are reading Confucius's judgment that in a well-governed state Nan Rong would not be cast aside, and in a badly governed one he would escape punishment and execution. Those are the guide's terms; Legge has \"punishment and disgrace.\" Treat it as a judgment of his conduct under two kinds of government, recorded in 5.1, not as a list of offices he held.",
      },
      {
        questionZh: "他的名字在英文里怎么拼？",
        questionEn: "How do you spell his name in English?",
        answerZh: "你会遇到好几种写法。本站英文索引作 Nan Gong Kuo；Legge 在 14.6 印作 Nan-kung Kwo，在 5.1 与 11.5 印作 Nan Yung。活页拼音把南容注作 nán róng，把「适」注作 kuò；中文人物页另用南宫括，网址写作 nangong-kuo。这些写法都指向同一个索引条目，你不该把它们拆成几位不同的弟子，也不要自己再造一种新拼法。",
        answerEn: "You will meet several forms. The site's index uses Nan Gong Kuo. Legge prints Nan-kung Kwo in 14.6 and Nan Yung in 5.1 and 11.5. The page pinyin gives nán róng for 南容 and kuò for 适, and the Chinese profile adds 南宫括, under the slug nangong-kuo. These are labels for one index entry, so you should not split them into separate disciples.",
      },
      {
        questionZh: "他问题里的羿、奡、禹、稷是谁？",
        questionEn: "Who are 羿, 奡, 禹 and 稷 in his question?",
        answerZh: "你只取活页给出的部分：导读说羿善于射箭，奡能陆地行舟，两人都没能得到善终；禹和稷亲自耕种庄稼，却得到了天下。Legge 把他们拼作 I、Ao、Yu、Chi。想多读禹，你可以去本站的尧舜禹札记；在这一篇里，四人只是南宫适那一问中的四个例子，不另写他们的生平。",
        answerEn: "You get only what the page gives. In the guide, 羿 was skilled at archery and 奡 could move a boat over land, and neither died a natural death, while 禹 and 稷 farmed with their own hands and came to hold the realm. Legge spells them I, Ao, Yu and Chi. For Yu you may turn to the Yao–Shun–Yu Note; here the four stay examples inside his question.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来打开南宫适索引",
        headingEn: "Open the Nan Gong Kuo index next",
        bodyZh: [
          "当你想把三章放在同一屏上读，请打开[南宫适](https://www.lunyu.ai/zh-Hans/index/nan-gong-kuo)，按索引列出的顺序读下去，宪问 14.6 正好排在最后。你问问自己：在孔子的沉默之前，你会更看重善射的羿，还是亲自耕种的禹和稷？然后停住，让原文、导读与英译各守一层，而不是让你的摘要替它们说话。",
        ],
        bodyEn: [
          "When you want all three passages on one screen, open [Nan Gong Kuo](https://www.lunyu.ai/en/index/nan-gong-kuo) and read them in the order the index lists them, which leaves 14.6 for last. Ask yourself which example you would have weighed more heavily, the archer or the farmers, before the Master's silence. Then stop, and let the source, the guide, and Legge each speak in its own layer rather than through your summary.",
        ],
      },
    ],
  },
  {
    slug: "governing-by-virtue-in-the-analects",
    titleZh: "《论语》里的为政以德：孔子说的「政」是什么",
    titleEn: "Governing by Virtue in the Analects: What Confucius Meant by 政",
    dekZh: "你搜「为政以德」、governing by virtue，或想弄清《论语》里「政」是什么意思时，多半想在一串国君名字里先抓住一个观念。在本站，你遇见它，首先是为政 2.1：为政以德，譬如北辰，居其所，而众星共之。你可以从这幅北辰图读起，不必先找一份书外的宫廷履历。",
    dekEn: "When you search “governing by virtue,” 为政以德, or what 政 means in the Analects, you usually want one idea placed among many rulers’ names. On this site you meet it first as Wei Chang 2.1: government by virtue is like the north polar star that keeps its place while the stars turn toward it. You can start with that image and skip any court biography the pages do not give.",
    descriptionZh: "《论语》里的为政以德：为政 2.1 以北辰说德治，颜渊 12.17 说政者正也，并对照政令与刑罚。链回可核对的原文。",
    descriptionEn: "Governing by virtue in the Analects: Wei Chang 2.1 likens government by virtue to the pole star, and 政 means to rectify.",
    datePublished: "2026-10-08",
    dateModified: "2026-10-08",
    tagsZh: ["为政以德", "政", "为政"],
    tagsEn: ["governing by virtue", "Government", "Wei Chang"],
    related: [
      "/analects/wei-zheng/wei-zheng-001",
      "/index/zheng",
      "/analects/wei-zheng/wei-zheng-003",
      "/analects/yan-yuan/yan-yuan-017",
    ],
    cover: notesBlogImage(
      "governing-by-virtue-in-the-analects",
      "cover.jpg",
      "Quiet court under a pole-star night sky — virtue at the center, no claimed likeness",
      "静夜宫廷与北辰——德居中心，无伪肖像",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "governing-by-virtue-in-the-analects",
        "inline-1.jpg",
        "A ruler setting an example in stillness — governing by presence, not force",
        "主位以身作则的静场——以德临政，非以力",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "governing-by-virtue-in-the-analects",
        "inline-2.jpg",
        "Stars turning around a still center — order without coercion",
        "众星环绕不动的中心——不靠强制的秩序",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认「政」，不靠某一位国君的传记",
        headingEn: "Place 政 by the passages, not by a ruler’s résumé",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，主题索引把它标为[政](https://www.lunyu.ai/zh-Hans/index/zheng)——政在《论语》中首先关乎正己、德化与用人，而不仅是制度技术。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与本地启发分开放，拒绝发明活页上没有的句子。把索引当门牌，而不是替你读完的终稿。检索里的「孔子论政」、为政无方、北辰，只是你可能用来抵达的写法，不是另立一套学说。索引上相关章句很多，这篇札记只守住几扇门。",
        ],
        bodyEn: [
          "If you want a compact entry before you open each chapter page, the theme index labels it as [Government](https://www.lunyu.ai/en/index/zheng)—government as moral rectification, virtue, and selecting the worthy. That line is enough for you to start: follow the linked scenes, keep source, guide, and reflection in separate layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished essay that replaces reading. Search forms such as “Confucius on government,” 为政无方, and 北辰 are ways you may arrive; they are not extra doctrines. Many other doors sit on the index—this Note keeps a few.",
        ],
      },
      {
        headingZh: "先听为政以德——北辰在政策清单之前",
        headingEn: "Lead with 为政以德—hear the pole star before a policy list",
        imageSlot: "inline-1",
        bodyZh: [
          "为政 2.1 的原文是：子曰，为政以德，譬如北辰，居其所，而众星共之。同一活页的白话导读说：孔子说：用德行来治理政事，就像北极星安居在自己的位置上，众星都会围绕着它运行。同页 Legge 1893 年英译写道：The Master said, \"He who exercises government by means of his virtue may be compared to the north polar star, which keeps its place and all the stars turn towards it.\" 你可以把这扇门读成以在场与德行形成秩序，而不是一句现代管理口号。引用时，请把原文、导读与英译分层标明。页上的本地启发框与这三层分开；你不该把启发写回原文。",
        ],
        bodyEn: [
          "In Wei Chang 2.1 the source line is 子曰，为政以德，譬如北辰，居其所，而众星共之。 The modern Chinese guide on that live page says: 孔子说：用德行来治理政事，就像北极星安居在自己的位置上，众星都会围绕着它运行。 Legge’s 1893 English on the same page reads: The Master said, \"He who exercises government by means of his virtue may be compared to the north polar star, which keeps its place and all the stars turn towards it.\" You can take that as a door about presence and order without coercion, not as a modern management slogan. When you cite it, keep source Chinese, the guide, and Legge’s English as separate layers. The page’s local reflection box stays apart from those layers; you should not paste a reflection back into the source line.",
        ],
      },
      {
        headingZh: "一扇对照门——政令刑罚并不等于德",
        headingEn: "One contrast door—laws and punishments are not the same as 德",
        bodyZh: [
          "别处你可以打开一次[论语 · 为政 2.3](https://www.lunyu.ai/zh-Hans/analects/wei-zheng/wei-zheng-003)。原文是：子曰，道之以政，齐之以刑，民免而无耻。道之以德，齐之以礼，有耻且格。该页导读说：孔子说：用政令引导百姓，用刑罚整齐百姓，百姓只会求免于处罚，却不会有羞耻心。用德行引导百姓，用礼来整齐百姓，百姓就会有羞耻心，并且归向正道。同页 Legge 先写：The Master said, \"If the people be led by laws, and uniformity sought to be given them by punishments, they will try to avoid the punishment, but have no sense of shame.\" 接着写： \"If they be led by virtue, and uniformity sought to be given them by the rules of propriety, they will have the sense of shame, and moreover will become good.\" 你只把这读成与「为政以德」并立的对照，不要把它当成第二扇主门，也不要据此发明一整套法学体系。",
        ],
        bodyEn: [
          "Elsewhere you may open [The Analects · Wei Chang 2.3](https://www.lunyu.ai/en/analects/wei-zheng/wei-zheng-003) once. The source says 子曰，道之以政，齐之以刑，民免而无耻。道之以德，齐之以礼，有耻且格。 The guide on that page says: 孔子说：用政令引导百姓，用刑罚整齐百姓，百姓只会求免于处罚，却不会有羞耻心。用德行引导百姓，用礼来整齐百姓，百姓就会有羞耻心，并且归向正道。 Legge writes: The Master said, \"If the people be led by laws, and uniformity sought to be given them by punishments, they will try to avoid the punishment, but have no sense of shame.\" Then: \"If they be led by virtue, and uniformity sought to be given them by the rules of propriety, they will have the sense of shame, and moreover will become good.\" Hold that only as a contrast beside 为政以德—not as a second main door, and not as a license to invent a full legal theory.",
        ],
      },
      {
        headingZh: "政者正也——先正己，再谈改称谓",
        headingEn: "政者正也—rectify yourself before you rename the office",
        imageSlot: "inline-2",
        bodyZh: [
          "当你需要一句更短的定义，也可以打开一次[论语 · 颜渊 12.17](https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-017)。原文是：季康子问政于孔子。孔子对曰，政者正也，子帅以正，孰敢不正。导读说：季康子向孔子请教怎样治理政事。孔子回答说：政的意思就是端正。您自己带头端正，谁还敢不端正呢？同页 Legge 写道：Chi K'ang asked Confucius about government. Confucius replied, \"To govern means to rectify. If you lead on the people with correctness, who will dare not to be correct?\" 同一索引上，你还可以轻提颜渊 12.7（足食、足兵、民信）与子路 13.1（先之，劳之）——你不该在这里把它们写成完整复述。子路 13.3 / 正名只作边界：这篇札记不是正名专论。",
        ],
        bodyEn: [
          "You can also open [The Analects · Yen Yuan 12.17](https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-017) once when you need the short definition. The source is 季康子问政于孔子。孔子对曰，政者正也，子帅以正，孰敢不正。 The guide says: 季康子向孔子请教怎样治理政事。孔子回答说：政的意思就是端正。您自己带头端正，谁还敢不端正呢？ Legge replies: Chi K'ang asked Confucius about government. Confucius replied, \"To govern means to rectify. If you lead on the people with correctness, who will dare not to be correct?\" Elsewhere on the same index you may lightly notice Yen Yuan 12.7 (food, arms, and trust) and Tsze-lu 13.1 (go before the people with your example)—you should not turn those notices into full retellings here. Name Tsze-lu 13.3 / 正名 only as a boundary: this Note is not a rectifying-names essay.",
        ],
      },
      {
        headingZh: "不是国君专稿，不是子路传，也不是正名重写",
        headingEn: "Not Duke Notes, not Zi Lu’s biography, not a 正名 rewrite",
        bodyZh: [
          "别处你可能已有鲁哀公、齐景公、鲁定公、卫灵公或子路的人物笔记。那些页面各自拥有人物与问答；你不该在这里重写它们。这篇概念札记拥有的是「政 / 为政以德」这一观念，以及你上面打开的政索引之门。你不该把国君名字并成一篇宫廷小说，也不该把本页当成那些专稿的替身。需要时，请把每个名字扣回各自的活页。",
        ],
        bodyEn: [
          "Elsewhere you may already have Who Notes for Duke Ai, Duke Jing, Duke Ding, Duke Ling, or Zi Lu. Those pages own the persons and their exchanges; you should not retell them here. This Concept Note owns the idea of 政 / governing by virtue across the zheng index doors you opened above. You should not merge ruler names into a single court novel, and you should not treat this page as a substitute for those Who Notes. Keep each name on its own live page when you need it.",
        ],
      },
      {
        headingZh: "你该怎样引用「政」",
        headingEn: "How you should cite 政",
        bodyZh: [
          "当你引用「为政以德」或「政者正也」，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。原文、导读与启发（source, guide, and reflection）必须分开：你可以用页上的本地启发框讨一个今天的行动，但不得把启发当成新的《论语》句子。你可以轻提检索意图，但不要发明展示次数、政策手册，或你所引那一句里没有印出的宫廷故事。你的诚实落在篇章页上，而不在更顺口却无出处的改写里。",
        ],
        bodyEn: [
          "When you quote 为政以德 or 政者正也, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. Source, guide, and reflection stay separate: you may use the local reflection box for one practical action, but you must not treat that reflection as a new Analects line. You can mention search interest lightly, but you should never invent impression counts, policy manuals, or court stories that the sentence you cite does not print. Your honesty is the passage page, not a smoother paraphrase that invents a saying.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的「政」是什么？",
        questionEn: "What does 政 mean in the Analects?",
        answerZh: "你在《论语》里遇见的「政」，常常被试成正己与德化，而不只是官职技术。为政 2.1 把为政以德放在北辰之旁；颜渊 12.17 说政者正也。你最好的短答，仍是把读者送回本站活页篇章地址，而不是一句漂浮的口号。你的诚实落在可核验的章句上，而不是更顺口的改写。",
        answerEn: "You meet 政 as governing—often tested as moral rectification and virtue, not only as office technique. Wei Chang 2.1 places government by virtue beside the pole star; Yen Yuan 12.17 says to govern is to rectify. Your best short answer still sends you to a live chapter URL on this site, not to a floating slogan.",
      },
      {
        questionZh: "「为政以德」是什么意思？",
        questionEn: "What does 为政以德 mean?",
        answerZh: "你听到：用德行来治理政事，就像北极星安居其位，众星环绕。为政 2.1 活页把原文、导读与 Legge 英译放在一起。你要把这读成以在场与德行形成不靠强制的秩序，而不是贴到每场会议的现代领导品牌。你下一步应打开那章活页，而不是停在口号上。",
        answerEn: "You hear that government by means of virtue is like the north polar star that keeps its place while the stars turn toward it. The live Wei Chang 2.1 page carries source, guide, and Legge together. Hold that as presence and order without coercion—not as a modern leadership brand you paste onto every meeting.",
      },
      {
        questionZh: "用政令刑罚治理，等于以德为政吗？",
        questionEn: "Is governing by laws the same as governing by virtue?",
        answerZh: "你应拒绝简单的「是」。为政 2.3 对照两路：以政令与刑罚引导，人会求免、却无羞耻；以德与礼引导，人有耻且归向正道。你的细读应守住这组对照，而不要把两者都塌成一句含糊的「政策」。你可以把 2.3 当作侧门，主门仍是为政以德。",
        answerEn: "You should refuse a simple yes. Wei Chang 2.3 contrasts leading by laws and punishments—where people avoid the penalty but lack shame—with leading by virtue and propriety, where shame appears and people turn toward the good. Your careful reading keeps that contrast instead of collapsing both into one vague “policy” word.",
      },
      {
        questionZh: "为什么有人搜「为政以德」或 governing by virtue？",
        questionEn: "Why do people search “governing by virtue” or 为政以德?",
        answerZh: "你往往想先弄清一件事：孔子说的「政」指什么、该开哪一扇篇章门、北辰怎样入题。搜到这些词之后，请打开为政 2.1 活页，而不要依赖会捏造章号的摘要。你把原文、白话导读与启发分层来读，阅读才站得住脚。",
        answerEn: "You often want one clear idea: what Confucius meant by 政, which chapter door to open, and how 北辰 fits. Search those phrases, then open the live 2.1 page rather than a summary that invents chapter numbers. Your reading stays honest when source, vernacular guide, and reflection stay in separate layers.",
      },
      {
        questionZh: "足食、足兵、民信呢？",
        questionEn: "What about food, arms, and the people’s trust?",
        answerZh: "你可以在「政」索引上轻提颜渊 12.7：粮食充足、军备充足、百姓信任。那扇门是真的，但不是这篇札记的主门。你应回到为政 2.1，去读为政以德的主图。你若需要展开那三件，请打开该章活页，而不是在这里写成第二篇专论。",
        answerEn: "You may lightly notice Yen Yuan 12.7 on the Government index: sufficiency of food, of military equipment, and the people’s confidence. That door is real, but it is not the primary door of this Note. You should return to Wei Chang 2.1 for the main image of governing by virtue.",
      },
      {
        questionZh: "这篇札记不是什么？",
        questionEn: "What is not this essay?",
        answerZh: "你在这里找不到鲁哀公、齐景公、鲁定公或卫灵公的人物专稿，也找不到子路传记，更找不到用子路 13.3 搭成的正名专论。这些名字出现，只为免得你把门认错。你的下一步是 2.1 或「政」索引，而不是重复本站其他札记的又一则总论。",
        answerEn: "You will not find here a Duke Ai, Duke Jing, Duke Ding, or Duke Ling Who Note, a Zi Lu biography, or a 正名 essay built on Tsze-lu 13.3. Those names appear only so you do not confuse the doors. Your next step is the 2.1 page or the Government index, not another overview that repeats other Notes on this site.",
      },
      {
        questionZh: "怎样避免 AI 编造「孔子论政」语录？",
        questionEn: "How do you keep AI from inventing Confucius quotes on government?",
        answerZh: "若你用模型当阅读助手，应粘贴活页原文再追问，而不是索要宫廷冒险，或索要页面上没有的句子。你应一律拒绝新捏造出来的《论语》文句。你的核验路径始终是本站已经发布的篇章活页，见 lunyu.ai。原文、导读与启发仍然分开，即使工具想把它们揉成一段你可能误当成经文的流畅文字。",
        answerEn: "If you use a model as a reading aid, you should paste the live passage and ask questions, not for a court adventure or a saying the page does not show. Always refuse any newly minted Analects line. Your verification path is the published chapter URL on this site, lunyu.ai. Source, guide, and reflection stay separate even when a tool offers to blend them into one fluent paragraph you might mistake for the text.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读为政 2.1",
        headingEn: "Read Wei Chang 2.1 next",
        bodyZh: [
          "当你准备打开最清楚的那扇「为政以德」之门，请打开[论语 · 为政 2.1](https://www.lunyu.ai/zh-Hans/analects/wei-zheng/wei-zheng-001)，把原文、白话导读与英译并排对照。你问问自己：你是否只把「政」听成技术——然后停住，回到文本，而不是回到一篇国君摘要。启发留在它自己的框里；你不该让它改写为政以德。",
        ],
        bodyEn: [
          "When you are ready for the clearest door on governing by virtue, open [The Analects · Wei Chang 2.1](https://www.lunyu.ai/en/analects/wei-zheng/wei-zheng-001) and read source, guide, and Legge side by side. Ask yourself whether you have been hearing 政 only as technique—then stop, and return to the live text rather than to a summary of rulers. Keep reflection in its own box; you should not let it rewrite 为政以德.",
        ],
      },
    ],
  },
  {
    slug: "zi-lu-in-the-analects",
    titleZh: "《论语》里的子路是谁？",
    titleEn: "Who Was Zi Lu in the Analects?",
    dekZh: "你搜「子路」、zi lu 或 zilu 时，多半想在《论语》一串弟子名里先把这个人认出来。在本站，你遇见他，首先是先进 11.11 里的季路：他问侍奉鬼神，又问死，听到的是未能事人、焉能事鬼，以及未知生、焉知死。你可以从这一章读起，不必先找一份书外的生平。",
    dekEn: "When you search \"zi lu\" or zilu, you usually want one disciple placed among many names in the Analects. On this site you meet him as Chi Lu in Hsien Tsin 11.11: he asks about serving spirits and about death, and you hear that the living come before spirits, and life before death. You can start with that scene and skip any life story the pages do not give.",
    descriptionZh: "《论语》里的子路：季路问鬼神与死，听到未能事人、焉能事鬼，以及未知生、焉知死；并轻及听到了就先去实行。链回可核对的原文。",
    descriptionEn:
      "Zi Lu in the Analects: the disciple who asks about spirits and death—the living come before spirits, life before death—with a light door on practice before the next lesson.",
    datePublished: "2026-10-04",
    dateModified: "2026-10-04",
    tagsZh: ["子路", "季路", "先进"],
    tagsEn: ["zi lu", "Zi Lu", "Hsien Tsin"],
    related: [
      "/analects/xian-jin/xian-jin-011",
      "/index/zi-lu",
      "/blogs/bo-yi-shu-qi-in-the-analects",
    ],
    cover: notesBlogImage(
      "zi-lu-in-the-analects",
      "cover.jpg",
      "A direct disciple pausing before a question — courage, with no claimed historical portrait",
      "勇直弟子在发问前稍停——不冒充历史肖像",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "zi-lu-in-the-analects",
        "inline-1.jpg",
        "An abstract question about spirits and death — life still unlearned, no fake inscription",
        "抽象一问：鬼神与死——生尚未明，无伪刻铭文",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "zi-lu-in-the-analects",
        "inline-2.jpg",
        "Hearing held until practice catches up — action before another lesson",
        "听闻停在实行之前——先做，再听下一条",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认子路，不靠仲由的书外履历",
        headingEn: "Place Zi Lu by the passages, not by a life of Zhong You",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，人物索引把他标为[子路](https://www.lunyu.ai/zh-Hans/index/zi-lu)——孔门弟子，勇直好问，常在政事与行动中被孔子点拨。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与本地启发分开放，拒绝发明活页上没有的句子。把索引当门牌，而不是替你读完的终稿。同一人在原文里又称仲由、季路；检索里的 Zhong You、zilu 不是另一个学生。英译 Legge 在活页上印作 Tsze-lu、Chi Lu、Yu 或 Chung Yu。索引上相关章句很多，这篇笔记只守住两扇门。",
        ],
        bodyEn: [
          "If you want a compact entry before you open each chapter page, the people index labels him as [Zi Lu](https://www.lunyu.ai/en/index/zi-lu)—a direct and courageous disciple, often taught through questions of action and government. That line is enough for you to start: follow the linked scenes, keep source, guide, and reflection in separate layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished essay that replaces reading. On the English pages Legge prints Tsze-lu, Chi Lu, Yu, and Chung Yu for this same person; zilu and Zhong You are search forms, not extra disciples. Chinese lines on that index also print 子路, 仲由, and 季路. The index card for this chapter says Xian Jin 11.11; the live short title you should cite is Hsien Tsin 11.11. Many other doors sit on the index—this Note keeps two.",
        ],
      },
      {
        headingZh: "问鬼神——先听未能事人，焉能事鬼",
        headingEn: "Ask about spirits—hear 未能事人，焉能事鬼 before death",
        imageSlot: "inline-1",
        bodyZh: [
          "先进 11.11 的原文是：季路问事鬼神。子曰，未能事人，焉能事鬼。敢问死。曰，未知生，焉知死。同一活页的白话导读说：季路问怎样侍奉鬼神。孔子说：连活人都还不能侍奉好，怎么谈得上侍奉鬼神？季路又说：我大胆地问一问死是怎么回事。孔子说：连生的道理都还不明白，又怎么能明白死呢？同页 Legge 1893 年英译写道：Chi Lu asked about serving the spirits of the dead. The Master said, \"While you are not able to serve men, how can you serve their spirits?\" Chi Lu added, \"I venture to ask about death?\" He was answered, \"While you do not know life, how can you know about death?\" 你可以把这扇门读成先面对活人与此生，而不是子路如何死去的故事。引用时，请把原文、导读与英译分层标明。页上的本地启发框与这三层分开；你不该把启发写回原文。",
        ],
        bodyEn: [
          "In Hsien Tsin 11.11 the source line is 季路问事鬼神。子曰，未能事人，焉能事鬼。敢问死。曰，未知生，焉知死。 The modern Chinese guide on that live page says: 季路问怎样侍奉鬼神。孔子说：连活人都还不能侍奉好，怎么谈得上侍奉鬼神？季路又说：我大胆地问一问死是怎么回事。孔子说：连生的道理都还不明白，又怎么能明白死呢？ Legge’s 1893 English on the same page reads: Chi Lu asked about serving the spirits of the dead. The Master said, \"While you are not able to serve men, how can you serve their spirits?\" Chi Lu added, \"I venture to ask about death?\" He was answered, \"While you do not know life, how can you know about death?\" You can take that as a door about the living task in front of you, not as a story of how Zi Lu died. When you cite it, keep source Chinese, the guide, and Legge’s English as separate layers. The page’s local reflection box stays apart from those layers; you should not paste a reflection back into the source line.",
        ],
      },
      {
        headingZh: "一扇轻门——听到了，就先去实行",
        headingEn: "One lighter door—hear a line, then carry it out",
        imageSlot: "inline-2",
        bodyZh: [
          "别处你可以轻开一次[论语 · 公冶长 5.13](https://www.lunyu.ai/zh-Hans/analects/gong-ye-chang/gong-ye-chang-013)。原文是：子路有闻，未之能行，唯恐有闻。该页导读说：子路听到一个道理，还没能付诸实行，就唯恐又听到新的道理。同页 Legge 写道：When Tsze-lu heard anything, if he had not yet succeeded in carrying it into practice, he was only afraid lest he should hear something else. 你只把这读成先实行、再听下一条的轻门，不要把它当成这篇的主门，也不要写成政事手册。你看一眼就回来——这篇笔记停在子路是谁，以及未知生焉知死怎么读。",
        ],
        bodyEn: [
          "Elsewhere you may lightly open [The Analects · Kung-ye Ch'ang 5.13](https://www.lunyu.ai/en/analects/gong-ye-chang/gong-ye-chang-013). The source says 子路有闻，未之能行，唯恐有闻。 The guide on that page says: 子路听到一个道理，还没能付诸实行，就唯恐又听到新的道理。 Legge writes: \"When Tsze-lu heard anything, if he had not yet succeeded in carrying it into practice, he was only afraid lest he should hear something else.\" The index card labels this door Gong Ye Chang 5.13; the live short title is Kung-ye Ch'ang 5.13. Hold it only as a side door about action before the next lesson—not as the primary door of this page, and not as a government manual. You can glance once, then return; this Note stays with who Zi Lu is and how you read 未知生，焉知死.",
        ],
      },
      {
        headingZh: "不是冉有，不是其他弟子专稿，也不是正名专论",
        headingEn: "Not Ran You, not the other disciple Notes, not a 正名 essay",
        bodyZh: [
          "索引里你还会看见冉有与季路同在先进 11.2 的政事一类；仲弓、子夏、曾子也各有自己的人物笔记。鲁定公那篇札记的主语是定公，即使章名里出现「子路」，你也不该在这里重写它。同一索引列有子路 13.3，活页确实把一个政事之问转向正名——你应把那一串留在原页，不要让它变成这篇的主题。你不该把这些名字并成一篇弟子合传，也不该把本页写成尧舜禹札记。需要时，请把每个名字扣回各自的活页。",
        ],
        bodyEn: [
          "Elsewhere you may see Ran You named beside 季路 on the Zi Lu index under Xian Jin 11.2, or you may already have Who Notes for Zhong Gong, Zi Xia, and Zeng Zi. The live Duke Ding of Lu Note is about that duke, even where its chapter title says Tsze-lu; you should not retell it here. The same index lists Zi Lu 13.3, and the live chapter page does turn a government question toward 正名—you should leave that chain alone so it does not become the subject. You should not merge these names into a single résumé of disciples, and you should not treat this page as a Yao–Shun–Yu note or a rewrite of those Who Notes. Keep each name on its own live page when you need it.",
        ],
      },
      {
        headingZh: "你该怎样引用他",
        headingEn: "How you should cite him",
        bodyZh: [
          "当你引用季路的提问或孔子的答语，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。原文、导读与启发（source, guide, and reflection）必须分开：你可以用页上的本地启发框讨一个今天的行动，但不得把启发当成新的《论语》句子。你可以轻提检索意图，但不要发明展示次数、死亡年份，或你所引那一句里没有印出的卫国故事。你的诚实落在篇章页上，而不在更顺口却无出处的改写里。",
        ],
        bodyEn: [
          "When you quote Chi Lu’s questions or the Master’s answers, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. Source, guide, and reflection stay separate: you may use the local reflection box for one practical action, but you must not treat that reflection as a new Analects line. You can mention search interest lightly, but you should never invent impression counts, death dates, or Wei stories that the sentence you cite does not print. Your honesty is the passage page, not a smoother paraphrase that invents a saying.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的子路是谁？",
        questionEn: "Who was Zi Lu in the Analects?",
        answerZh: "你在《论语》里遇见的子路，又作仲由、季路；检索里还有 zi lu、zilu 与 Zhong You。人物索引称他是勇直好问的孔门弟子，常在政事与行动里被点拨。先进 11.11 里他以季路发问，听到未能事人焉能事鬼，以及未知生焉知死。活页英译称 Chi Lu，别处亦作 Tsze-lu。你最好的答案是这扇门加上索引，而不是书外编出来的仲由传。",
        answerEn: "You meet Zi Lu (子路; also 仲由 and 季路; search forms zilu and Zhong You) as the direct, courageous disciple on the people index, often taught through action and government. In Hsien Tsin 11.11 the English page calls him Chi Lu: serving the living comes before spirits, and life before death. Your best answer is that door plus the index—not a life of Zhong You invented outside the text.",
      },
      {
        questionZh: "为什么有人搜「子路」、zi lu 或 zilu？",
        questionEn: "Why do people search \"zi lu,\" zilu, or 子路?",
        answerZh: "你往往想先弄清身份：哪一位弟子、哪一次发问、哪一扇篇章的门。搜到这些词，或 Legge 的 Tsze-lu、Chi Lu 之后，请打开先进 11.11 活页，而不要依赖会捏造章号或跳过「未能事人焉能事鬼」的摘要。你把原文、白话导读与启发分层来读，阅读才站得住脚。你不必在读到原句之前先要一句更顺口的口号。",
        answerEn: "You often want a clear identity: which disciple, which question, which chapter door. Search those phrases, or Legge’s Tsze-lu and Chi Lu, then open the live 11.11 page rather than a summary that invents chapter numbers or skips 未能事人焉能事鬼. Your reading stays honest when source, vernacular guide, and reflection stay in separate layers. You do not need a smoother slogan before you have read the line.",
      },
      {
        questionZh: "「未能事人，焉能事鬼」在 11.11 说什么？",
        questionEn: "What does 未能事人，焉能事鬼 mean in 11.11?",
        answerZh: "你听到季路问怎样侍奉鬼神，孔子却不从鬼神说起，因为活人还没有侍奉好。同一场问答接着问死：生的道理尚未明白，就不能明白死，原文作未知生，焉知死。你要把这读成眼前该做的事，而不是禁止哀伤，也不是子路之死的叙事。你的下一步是先进那章活页，而不是贴到每场丧礼上的句子。",
        answerEn: "You hear Chi Lu ask about serving spirits, and the Master refuse to begin there while living people are not yet served. The same exchange then turns to death, and the source line is 未知生，焉知死. Hold that as the task in front of you, not as a death narrative. Your next step is the live Hsien Tsin page, not a slogan you paste onto every funeral.",
      },
      {
        questionZh: "季路、仲由、Chi Lu、Tsze-lu 是同一个人吗？",
        questionEn: "Are Chi Lu, Tsze-lu, 季路, and 仲由 the same person?",
        answerZh: "你看到的是同一位弟子。11.11 原文称他季路，同页英译印作 Chi Lu。索引所引其他章句又作子路、仲由，英译则有 Tsze-lu、Yu、Chung Yu。Zhong You 与 zilu 只是你可能用来检索的写法，不是该拆出去的第二个学生。你不该发明英译页上没有印出的 Legge 拼法。",
        answerEn: "You are looking at one disciple. The 11.11 source names him 季路, and Legge on that page prints Chi Lu. Other lines fetched with the index print Tsze-lu, Yu, or Chung Yu, and the Chinese prints 子路 and 仲由. Zhong You and zilu are ways you may search that same name, not a second student you should split off. You should not invent a Legge spelling the English page does not print.",
      },
      {
        questionZh: "公冶长 5.13「子路有闻，未之能行」呢？",
        questionEn: "What about 子路有闻，未之能行 in 5.13?",
        answerZh: "你可以轻开公冶长 5.13 一次：子路听到道理，还没实行，就担心又听到新的。你只把它读成行动先于下一条道理。它不是政事手册，也不是这篇的主门。你应回到先进 11.11，去读他是谁。导读的原句留在活页上，你不要用更短的替身换掉它。",
        answerEn: "You may open Kung-ye Ch'ang 5.13 once: Tsze-lu hears something and, until he has carried it into practice, fears hearing something else. Read that only as action before the next theory. It is not a manual of government, and it is not the primary door of this Note. You should return to Hsien Tsin 11.11 for the main reading of who he is. Keep the guide’s wording on the live page rather than a shortened substitute.",
      },
      {
        questionZh: "这篇笔记不是什么？",
        questionEn: "What is not this essay?",
        answerZh: "你在这里找不到冉有专稿，也找不到仲弓、子夏或曾子的人物笔记重写，更找不到鲁定公概览、尧舜禹札记，或用子路 13.3 搭成的正名专论。这些名字出现，只为免得你把门认错。你的下一步是 11.11 或子路索引，而不是重复本站其他札记的又一则总论。你应让每个题目留在它自己的网址上。",
        answerEn: "You will not find here a Ran You Note, a Zhong Gong, Zi Xia, or Zeng Zi Who Note, a Duke Ding of Lu overview, a Yao–Shun–Yu page, or a 正名 essay built on Zi Lu 13.3. Those names appear only so you do not confuse the doors. Your next step is the 11.11 page or the Zi Lu index, not another overview that repeats other Notes on this site.",
      },
      {
        questionZh: "怎样避免 AI 编造子路语录？",
        questionEn: "How do you keep AI from inventing Zi Lu quotes?",
        answerZh: "若你用模型当阅读助手，应粘贴活页原文再追问，而不是索要卫国冒险，或索要页面上没有的句子。你应一律拒绝新捏造出来的《论语》文句。你的核验路径始终是本站已经发布的篇章活页，见 lunyu.ai。原文、导读与启发仍然分开，即使工具想把它们揉成一段你可能误当成经文的流畅文字。",
        answerEn: "If you use a model as a reading aid, you should paste the live passage and ask questions, not for a Wei adventure or a saying the page does not show. Always refuse any newly minted Analects line. Your verification path is the published chapter URL on this site, lunyu.ai. Source, guide, and reflection stay separate even when a tool offers to blend them into one fluent paragraph you might mistake for the text.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读先进 11.11",
        headingEn: "Read Hsien Tsin 11.11 next",
        bodyZh: [
          "当你准备打开最清楚的那扇「问鬼神、问死」之门，请打开[论语 · 先进 11.11](https://www.lunyu.ai/zh-Hans/analects/xian-jin/xian-jin-011)，把原文、白话导读与英译并排对照。你问问自己：活人当中，还有谁是你仍该去侍奉的——然后停住，回到文本，而不是回到一篇子路摘要。启发留在它自己的框里；你不该让它改写未知生，焉知死。",
        ],
        bodyEn: [
          "When you are ready for the clearest door on Zi Lu’s question about spirits and death, open [The Analects · Hsien Tsin 11.11](https://www.lunyu.ai/en/analects/xian-jin/xian-jin-011) and read source, guide, and Legge side by side. Ask yourself whom you still owe service among the living—then stop, and return to the live text rather than to a summary of the disciple. Keep reflection in its own box; you should not let it rewrite 未知生，焉知死.",
        ],
      },
    ],
  },
  {
    slug: "bo-yi-shu-qi-in-the-analects",
    titleZh: "《论语》里的伯夷、叔齐是谁？",
    titleEn: "Who Were Bo Yi and Shu Qi in the Analects?",
    dekZh:
      "你搜「伯夷叔齐」或 bo yi and shu qi 时，多半想在《论语》一串人名里把这一对安顿下来。在本站，你遇见他们，是因为孔子在述而 7.14 称他们为古之贤人——求仁而得仁，又何怨；也轻及季氏 16.12，把饿于首阳、民到于今称之的兄弟，与齐景公千驷无称并读。你不必先读英雄传；你可以直接打开这些场景，看清节与不怨如何成为答语。",
    dekEn:
      "When you search \"bo yi and shu qi,\" you usually want one pair of ancient worthies placed in the Analects. On this site you meet them in Shu Er 7.14 as brothers Confucius calls ancient worthies—they sought ren and got ren, so what resentment remains?—and, lightly, as the hungry pair still praised beside unused horses in Ke She 16.12. You can read those scenes first and notice how integrity without grievance becomes the answer.",
    descriptionZh: "《论语》里的伯夷、叔齐：古之贤人，求仁而得仁，又何怨；并轻及称颂长过千驷。链回可核对的原文。",
    descriptionEn:
      "Bo Yi and Shu Qi in the Analects: the ancient worthies who sought ren and got ren, so what resentment remains, with a light door on praise that outlasts horses.",
    datePublished: "2026-10-02",
    dateModified: "2026-10-02",
    tagsZh: ["伯夷叔齐", "伯夷", "述而"],
    tagsEn: ["bo yi and shu qi", "Bo Yi and Shu Qi", "Shu Er"],
    related: [
      "/analects/shu-er/shu-er-014",
      "/index/bo-yi-shu-qi",
      "/blogs/duke-ding-of-lu-in-the-analects",
    ],
    cover: notesBlogImage(
      "bo-yi-shu-qi-in-the-analects",
      "cover.jpg",
      "Two quiet figures at a yielding threshold — integrity without launching a fight",
      "两影止于让国之门——清节在前，不启争战",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "bo-yi-shu-qi-in-the-analects",
        "inline-1.jpg",
        "A quiet balance of seeking ren and finding ren — no leftover grievance",
        "求仁与得仁安于一处——无余怨可挂",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "bo-yi-shu-qi-in-the-analects",
        "inline-2.jpg",
        "Empty praise beside unused wealth — hunger remembered longer than horses",
        "空名与未用的富厚并置——饥饿的称颂长过千驷",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认人，不靠英雄履历",
        headingEn: "Place them by the passages, not by a hero résumé",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，人物索引把他们标为[伯夷叔齐](https://www.lunyu.ai/zh-Hans/index/bo-yi-shu-qi)——古代贤者，象征清节、让国与不怨。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与英译分开放，拒绝发明活页上没有的句子。把索引当门牌，而不是替你读完的终稿。英译 Legge 或作 Po-i、Shu-ch'i；本站同一对写作伯夷叔齐／Bo Yi and Shu Qi。为便于定向，你可在叙述中点到公冶长 5.22、述而 7.14、季氏 16.12、微子 18.8——本稿真正下链的门更少。",
        ],
        bodyEn: [
          "If you want a compact entry before you open each chapter page, the people index labels them as [Bo Yi and Shu Qi](https://www.lunyu.ai/en/index/bo-yi-shu-qi)—ancient worthies associated with integrity, yielding power, and freedom from resentment. That line is enough for you to start: follow the linked scenes, keep source text, guide, and English translation in their layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished essay that replaces reading. In Legge you may also see “Po-i” and “Shu-ch'i”; on this site the same pair is Bo Yi and Shu Qi. For orientation you may name Gong Ye Chang 5.22, Shu Er 7.14, Ji Shi 16.12, and Wei Zi 18.8 in prose—this Note’s live doors stay fewer.",
        ],
      },
      {
        headingZh: "问伯夷叔齐——听闻求仁而得仁，又何怨",
        headingEn: "Ask about Bo Yi and Shu Qi—hear 求仁而得仁 without resentment",
        imageSlot: "inline-1",
        bodyZh: [
          "述而 7.14 里，冉有问：老师会帮助卫国的国君吗。子贡说他去问，入而问：伯夷、叔齐是什么样的人。孔子说：古之贤人也。子贡又问：怨乎。孔子说：求仁而得仁，又何怨（白话导读：求仁德而得到了仁德，又有什么可怨恨的呢；Legge 英译层作 sought to act virtuously… what was there for them to repine about）。子贡出来说：夫子不为也——老师不会帮助卫君了。你可以把这扇门读成「清节不留余怨」，以及「借古贤之名，安静回答一桩政治问」——而不是教人逢官就辞的口号，也不是文本外编造的现代职场金句。引用时，请把原文与英译按同一活页所见分层标明。",
        ],
        bodyEn: [
          "In Shu Er 7.14 Ran You wonders whether the Master supports the ruler of Wei. Zi Gong says he will ask, goes in, and asks what sort of men Bo Yi and Shu Qi were. The Master answers: ancient worthies. Zi Gong asks whether they had any repinings because of their course. The Master replies that they sought to act virtuously and they did so—what was there for them to repine about? (On the same live page, the Chinese source and modern guide give 求仁而得仁，又何怨—they sought ren and obtained ren, so what resentment?) Zi Gong goes out and concludes that the Master is not for the Wei ruler. You can take that as a door about integrity without leftover grievance—and about how naming worthies can quietly answer a political question—not as a slogan for quitting every office, and not as a career tip invented outside the text. When you cite it later, keep Chinese and English layers visible on that live page.",
        ],
      },
      {
        headingZh: "一扇轻门——称颂长过千驷",
        headingEn: "One lighter door—praise that outlasts horses",
        imageSlot: "inline-2",
        bodyZh: [
          "别处你可轻开一次[论语 · 季氏 16.12](https://www.lunyu.ai/zh-Hans/analects/ji-shi/ji-shi-012)：齐景公有马千驷，死之日，民无德而称焉；伯夷叔齐饿于首阳之下，民到于今称之。你只把这读成「称颂对未用的富厚」的轻门，而不要在这里写成齐景公专稿（那篇停在颜渊 12.11 的君君臣臣），也不要把它当成这篇的主钱门。你可看一眼再回来——这篇笔记停在「伯夷叔齐是谁、述而 7.14 求仁而得仁怎么读」。",
        ],
        bodyEn: [
          "Elsewhere you may lightly open [The Analects · Ke She 16.12](https://www.lunyu.ai/en/analects/ji-shi/ji-shi-012): Duke Jing of Qi had a thousand teams of four horses, yet on the day of his death the people did not praise him for a single virtue—set beside Bo Yi and Shu Qi, who starved at the foot of Shau-yang mountain and whom people still praise. Hold that only as a light side door about praise versus unused display—not as a Duke Jing of Qi Note (that Note stays with 君君、臣臣 in Yen Yuan 12.11), and not as the money door of this page. You can glance once, then return; this Note stays with who Bo Yi and Shu Qi are and how you read 求仁而得仁 in Shu Er 7.14.",
        ],
      },
      {
        headingZh: "不是齐景公的名分篇，不是尧舜禹，也不是卫灵公的无道",
        headingEn: "Not Duke Jing’s roles page, not Yao–Shun–Yu, not Wei Ling’s 无道",
        bodyZh: [
          "书中别处你还会遇见齐景公问政与名分、尧舜禹的圣王线，或卫灵公与无道——不同的门，不同的问法。这篇笔记只停在伯夷、叔齐这一对；它不是诸公合传，也不重述那些场景。你不该把他们并成一篇「贤者与国君合传」，也不该把本页当成 12.11、尧舜禹总论或卫灵公无道笔记的重写。需要时，请把每个名字扣回各自的活页章句。",
        ],
        bodyEn: [
          "Elsewhere in the book you may meet Duke Jing of Qi on roles, Yao–Shun–Yu on sage kings, or Duke Ling of Wei on disorder—different doors, different questions. This Note stays with Bo Yi and Shu Qi as one pair; it is not a multi-ruler biography and it does not retell those separate scenes. You should not merge them into one “worthies and dukes” résumé, and you should not treat this page as a rewrite of 12.11, a Yao–Shun–Yu overview, or a Wei Ling 无道 Note. Keep each name tied to its own live passages when you need them.",
        ],
      },
      {
        headingZh: "你该怎样引用他们",
        headingEn: "How you should cite them",
        bodyZh: [
          "当你引用孔子对伯夷叔齐的答语，或子贡关于卫君的判断，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。你可以轻提检索意图，但不要发明 brief 没有给出的展示次数或历史年份。你的诚实落在篇章页上，而不在更顺口却无出处的改写里。",
        ],
        bodyEn: [
          "When you quote the Master’s answer on Bo Yi and Shu Qi, or Zi Gong’s conclusion about the Wei ruler, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. You can mention search interest lightly if needed, but you should never invent impression counts or history dates the brief did not give. Your honesty is the passage page, not a smoother paraphrase that invents a saying.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的伯夷、叔齐是谁？",
        questionEn: "Who were Bo Yi and Shu Qi in the Analects?",
        answerZh:
          "你在《论语》里遇见的伯夷、叔齐（亦称 Bo Yi and Shu Qi；Legge 作 Po-i、Shu-ch'i），是多章点名的古之贤人——尤以述而 7.14 论求仁与不怨为主门，并轻及季氏 16.12 称颂长过富厚。你最好的答案是这些活页门与人物索引；16.12 只作轻门——不是文本外编造的双雄传。",
        answerEn:
          "You meet Bo Yi and Shu Qi (伯夷、叔齐; Legge “Po-i” and “Shu-ch'i”) as ancient worthies named across published scenes—above all Shu Er 7.14 on seeking ren and freedom from resentment, with light doors such as Ji Shi 16.12 on praise that outlasts wealth. Your best answer is those live doors plus the people index—not a modern twin biography invented outside the text.",
      },
      {
        questionZh: "为什么有人搜「伯夷叔齐」或 bo yi and shu qi？",
        questionEn: "Why do people search \"bo yi and shu qi\" or boyi and shuqi?",
        answerZh:
          "你往往想先弄清身份：哪一对、哪句著名答语、哪扇篇章的门。搜到这些词（或 Legge 的 Po-i / Shu-ch'i）后，请打开述而 7.14 活页，而不要依赖会捏造章号或软化「求仁而得仁」的摘要。你把原文、白话导读与英译分层来读，阅读才站得住脚。",
        answerEn:
          "You often want a clear identity: which pair, which famous answer, which chapter door. Search those phrases (or Legge’s Po-i / Shu-ch'i), then open the live 7.14 page rather than a summary that invents chapter numbers or softens 求仁而得仁. Your reading stays honest when you keep source, vernacular guide, and English translation in separate layers.",
      },
      {
        questionZh: "「求仁而得仁／又何怨」在 7.14 说什么？",
        questionEn: "What does 求仁而得仁 / “no resentment” mean in 7.14?",
        answerZh:
          "你听到子贡问伯夷叔齐是否有怨，孔子答：求仁而得仁，又何怨（导读：求仁德而得到了仁德；英译层作 sought to act virtuously… what to repine）。你要把这读成清节不留余怨的教诲，而不是逢难就退的许可证。你的下一步是述而那章活页，而不是贴到每次离职上的口号。",
        answerEn:
          "You hear Zi Gong ask whether Bo Yi and Shu Qi had repinings, and the Master answer that they sought ren (Legge: sought to act virtuously) and obtained it—so what was there to resent? Hold that as a teaching about integrity that does not leave a grievance hanging, not as a license to quit every hard post. Your next step is the live Shu Er page, not a slogan pasted onto every career exit.",
      },
      {
        questionZh: "述而 7.14 怎样间接回答「为卫君乎」？",
        questionEn: "How does Shu Er 7.14 answer the Wei-ruler question?",
        answerZh:
          "你看见冉有问老师是否帮助卫君；子贡借问伯夷叔齐试探；听闻「古之贤人」与「求仁而得仁」后，子贡断定夫子不为也。你要把这场问答读成「借古贤之名安静作答」，而不是卫廷编年，更不是卫灵公无道专稿的重写。你不该发明活页没有写出的额外动机。",
        answerEn:
          "You see Ran You wonder whether the Master supports the ruler of Wei; Zi Gong probes by asking about Bo Yi and Shu Qi; after “ancient worthies” and “sought ren and got ren,” Zi Gong concludes the Master is not for that ruler. Read it as a quiet political answer through naming worthies—not as a Wei-court chronicle or a Duke Ling 无道 rewrite. You should not invent motives the live page does not show.",
      },
      {
        questionZh: "季氏 16.12 与齐景公的千驷呢？",
        questionEn: "What about Ke She 16.12 and Duke Jing’s horses?",
        answerZh:
          "你可以轻开一次 16.12：景公千驷，死而无称；伯夷叔齐饿于首阳，民到于今称之。你只把这读成称颂对富厚的轻对比——这篇不是齐景公专稿，16.12 也不是你的主钱门。读完请回到述而 7.14，那才是这一对求仁而不怨的主读法。",
        answerEn:
          "You may lightly open 16.12 once: Jing’s thousand teams left no praise; Bo Yi and Shu Qi starved yet are still praised. Hold that only as a praise-versus-display contrast—this Note is not a Duke Jing of Qi rewrite, and 16.12 is not your money door. You should return to Shu Er 7.14 for the main reading of the pair.",
      },
      {
        questionZh: "这篇笔记不是什么？",
        questionEn: "What is not this essay?",
        answerZh:
          "你在这里找不到齐景公 12.11 名分专稿，也找不到尧舜禹圣王总论，更找不到卫灵公无道笔记的第二篇，或用来取代诸公札记的合传。那些主题只在兄弟场景轻轻碰到时出现。你的下一步是篇章页或人物索引，而不是重复本站其他札记的又一则总论。",
        answerEn:
          "You will not find here a Duke Jing 12.11 roles Note, a Yao–Shun–Yu sage-king overview, a Wei Ling 无道 rewrite, or a multi-ruler résumé meant to replace those pages. Those themes appear only where the brothers’ scenes touch them lightly. Your next step is a passage page or the entity index, not another overview that repeats other Notes on this site.",
      },
      {
        questionZh: "怎样避免 AI 编造伯夷叔齐语录？",
        questionEn: "How do you keep AI from inventing Bo Yi and Shu Qi quotes?",
        answerZh:
          "若你用模型当阅读助手，应粘贴活页原文再追问，而不是在没有出处时问「孔子关于首阳一定还说过什么」。你应一律拒绝新捏造出来的《论语》句子。你的核验路径始终是本站已经发布的篇章活页网址，见 lunyu.ai。",
        answerEn:
          "If you use a model as a reading aid, you should paste the live passage text and ask for questions, not for “what Confucius must have added about Shau-yang” without a source. Always refuse any newly minted Analects line. Your verification path is always the published chapter URL on this site, lunyu.ai.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读述而 7.14",
        headingEn: "Read Shu Er 7.14 next",
        bodyZh: [
          "当你准备打开最清楚的那扇「古之贤人／求仁而得仁／又何怨」之门，请打开[论语 · 述而 7.14](https://www.lunyu.ai/zh-Hans/analects/shu-er/shu-er-014)，把原文、白话导读与英译并排对照。你问问自己：求其所当求之后，还有哪一桩怨你仍该放下——然后停住，回到文本，而不是回到一篇伯夷叔齐摘要。",
        ],
        bodyEn: [
          "When you are ready for the clearest door on Bo Yi and Shu Qi—ancient worthies who sought ren and got ren, without leftover resentment—open [The Analects · Shu R. 7.14](https://www.lunyu.ai/en/analects/shu-er/shu-er-014) and read source, guide, and Legge side by side. Ask yourself which grievance you still owe to drop—then stop, and return to the live text rather than to a summary of the brothers.",
        ],
      },
    ],
  },
  {
    slug: "duke-ding-of-lu-in-the-analects",
    titleZh: "《论语》里的鲁定公是谁？",
    titleEn: "Who Was Duke Ding of Lu in the Analects?",
    dekZh:
      "你搜「鲁定公」或 Duke Ding of Lu 时，多半想在《论语》一串国君名里把他安顿下来。在本站，你遇见他，是因为他在子路 13.15 问：是否有一言可以兴邦或丧邦；也轻及八佾 3.19 问君使臣、臣事君当如何。你不必先读王侯传；你可以直接打开这两场问答，看慎言与礼·忠如何成为答语。",
    dekEn:
      "When you search \"duke ding of lu,\" you usually want one Lu ruler placed among many names in the Analects. On this site you meet him as the duke who asks whether a single sentence can prosper or ruin a state in Tsze-lu 13.15—and, lightly, how prince and minister should treat each other in Pa Yih 3.19. You do not need a Wikipedia résumé first; you can read those scenes and notice how careful speech and 礼·忠 become the answer.",
    descriptionZh: "《论语》里的鲁定公：问一言能否兴邦或丧邦，并轻及君使臣以礼、臣事君以忠。链回可核对的原文。",
    descriptionEn:
      "Duke Ding of Lu in the Analects: the Lu ruler who asks whether one sentence can prosper or ruin a state, and how prince and minister should treat each other.",
    datePublished: "2026-10-01",
    dateModified: "2026-10-01",
    tagsZh: ["鲁定公", "定公", "子路"],
    tagsEn: ["duke ding of lu", "Duke Ding of Lu", "Tsze-lu"],
    related: [
      "/analects/zi-lu/zi-lu-015",
      "/index/duke-ding",
      "/blogs/duke-jing-of-qi-in-the-analects",
      "/blogs/duke-ling-of-wei-in-the-analects",
      "/blogs/duke-ai-of-lu-in-the-analects",
    ],
    cover: notesBlogImage(
      "duke-ding-of-lu-in-the-analects",
      "cover.jpg",
      "A Lu court audience — Duke Ding asking whether one sentence can prosper or ruin a state",
      "鲁廷对问之席——定公问「一言而可以兴邦／丧邦」",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "duke-ding-of-lu-in-the-analects",
        "inline-1.jpg",
        "One quiet spoken line held in balance — near to prospering a state, near to ruining it",
        "一句话安顿在天平两端——近于兴邦，也近于丧邦",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "duke-ding-of-lu-in-the-analects",
        "inline-2.jpg",
        "Two quiet places facing each other — propriety toward ministers, faithfulness toward the prince",
        "两席相对——君以礼使臣，臣以忠事君",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认人，不靠王侯履历",
        headingEn: "Place him by the passages, not by a royal résumé",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，人物索引把他标为[鲁定公](https://www.lunyu.ai/zh-Hans/index/duke-ding)——《论语》中直接发问两章的鲁国国君：君使臣、臣事君当如何，以及是否有一言可以兴邦或丧邦。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与英译分开放，拒绝发明活页上没有的句子。把索引当门牌，而不是替你读完的终稿。英译 Legge 或作 Duke Ting；本站同一人写作鲁定公／Duke Ding of Lu。",
        ],
        bodyEn: [
          "If you want a compact entry before you open each chapter page, the people index labels him as [Duke Ding of Lu](https://www.lunyu.ai/en/index/duke-ding)—the Lu ruler named in two Analects passages, asking about employing ministers and about one sentence that can prosper or ruin a state. That line is enough for you to start: follow the linked scenes, keep source text, guide, and English translation in their layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished essay that replaces reading. In Legge you may also see “Duke Ting”; on this site the same person is Duke Ding of Lu.",
        ],
      },
      {
        headingZh: "问一言——听闻近于兴邦，也近于丧邦",
        headingEn: "Ask about one sentence—hear near-prosperity and near-ruin",
        imageSlot: "inline-1",
        bodyZh: [
          "子路 13.15 里，鲁定公问：一言而可以兴邦，有诸。孔子对曰：言不可以若是其几也；然人之言曰，为君难，为臣不易。如知为君之难也，不几乎一言而兴邦乎。定公又问：一言而丧邦，有诸。孔子仍拒绝说得太绝对，再引人之言：予无乐乎为君，唯其言而莫予违也。如其善而莫之违，不亦善乎；如不善而莫之违，不几乎一言而丧邦乎。你可以把这扇门读成「权位之下，言语的分量」，而不是禁人口舌的口号，也不是文本外编造的现代领导金句。引用时，请把原文与英译按同一活页所见分层标明。",
        ],
        bodyEn: [
          "In Tsze-lu 13.15 Duke Ding of Lu asks whether there is a single sentence that can make a country prosperous. Confucius answers that such an effect cannot be expected from one sentence—yet there is a saying: to be a prince is difficult; to be a minister is not easy. If a ruler knows the difficulty of being a prince, may there not be expected from this one sentence the prosperity of his country? The duke then asks whether a single sentence can ruin a country. Confucius again refuses absolute wording, then cites the saying: “I have no pleasure in being a prince, but only in that no one can offer any opposition to what I say.” If the words are good and none oppose them, that is also good; if they are not good and none oppose them, may there not be expected from this one sentence the ruin of his country? You can take that as a door about the weight of speech under power—not as a slogan for silencing dissent, and not as a modern leadership tweet invented outside the text. When you cite it later, keep the Chinese source visible beside the English layer on the same live page.",
        ],
      },
      {
        headingZh: "一扇轻门——君以礼，臣以忠",
        headingEn: "One lighter door—礼 for the prince, 忠 for the minister",
        imageSlot: "inline-2",
        bodyZh: [
          "别处你可轻开一次[论语 · 八佾 3.19](https://www.lunyu.ai/zh-Hans/analects/ba-yi/ba-yi-019)：定公问君使臣、臣事君如之何。孔子对曰：君使臣以礼，臣事君以忠。你只把这读成君臣相待尺度的轻门，而不要在这里写成忠恕专稿，也不要把它当成这篇的主钱门。你可看一眼再回来——这篇笔记停在「定公是谁、一言兴邦／丧邦怎么读」。",
        ],
        bodyEn: [
          "Elsewhere you may lightly open [The Analects · Pa Yih 3.19](https://www.lunyu.ai/en/analects/ba-yi/ba-yi-019): Duke Ding asks how a prince should employ his ministers, and how ministers should serve their prince. Confucius replies that a prince should employ his minister according to the rules of propriety (礼), and ministers should serve their prince with faithfulness (忠). Hold that only as a light side door about mutual measure—not as a rewrite of the site’s zhongshu Note, and not as the money door of this page. You can glance once, then return; this Note stays with who Ding is and how you read the 一言兴邦／丧邦 exchange.",
        ],
      },
      {
        headingZh: "不是鲁哀公，不是卫灵公，也不是齐景公",
        headingEn: "Not Duke Ai, not Duke Ling, not Duke Jing",
        bodyZh: [
          "书中别处你还会遇见鲁哀公、卫灵公或齐景公——不同的国君，不同的问法。这篇笔记只停在鲁定公；它不是诸公合传，也不重述他们各自的场景。你不该把他们并成一篇「《论语》诸公合传」，也不该把本页当成曾子簇、君子或忠恕通论的重写。需要时，请把每个名字扣回各自的活页章句。",
        ],
        bodyEn: [
          "Elsewhere in the book you may meet Duke Ai of Lu, Duke Ling of Wei, or Duke Jing of Qi—different rulers, different questions. This Note stays with Duke Ding of Lu alone; it is not a multi-duke biography and it does not retell their separate scenes. You should not merge them into one “dukes of the Analects” résumé, and you should not treat this page as a Zeng Zi, junzi, or zhongshu rewrite. Keep each name tied to its own live passages when you need them.",
        ],
      },
      {
        headingZh: "你该怎样引用他",
        headingEn: "How you should cite him",
        bodyZh: [
          "当你引用定公的提问或孔子的答语，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。你可以轻提检索意图，但不要发明 brief 没有给出的展示次数或历史年份。你的诚实落在篇章页上，而不在更顺口却无出处的改写里。",
        ],
        bodyEn: [
          "When you quote Duke Ding’s questions or Confucius’s answers, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. You can mention search interest lightly if needed, but you should never invent impression counts or history dates the brief did not give. Your honesty is the passage page, not a smoother paraphrase that invents a saying.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的鲁定公是谁？",
        questionEn: "Who was Duke Ding of Lu in the Analects?",
        answerZh:
          "你在《论语》里遇见的鲁定公（亦称定公、Duke Ding of Lu；Legge 作 Duke Ting），是直接发问两章的鲁国国君：八佾 3.19 论君以礼、臣以忠，子路 13.15 问一言能否兴邦或丧邦。你最好的答案是这两扇门与人物索引；3.19 只作轻门——不是文本外编造的王侯履历。",
        answerEn:
          "You meet Duke Ding (鲁定公; also Ding Gong; Legge “Duke Ting”) as the Lu ruler named in two published scenes: Pa Yih 3.19 on 礼 and 忠 between prince and minister, and Tsze-lu 13.15 on whether one sentence can prosper or ruin a state. Your best answer is those two doors plus the people index—not a modern royal biography invented outside the text.",
      },
      {
        questionZh: "为什么有人搜「鲁定公」或 duke ding of lu？",
        questionEn: "Why do people search \"duke ding of lu\"?",
        answerZh:
          "你往往想先弄清身份：哪一位公、哪次问答、哪扇篇章的门。搜到这个词（或 Legge 的 Duke Ting）后，请打开子路 13.15 活页，而不要依赖会捏造章号或软化「一言丧邦」的摘要。你把原文、白话导读与英译分层来读，阅读才站得住脚。",
        answerEn:
          "You often want a clear identity: which duke, which famous question, which chapter door. Search that phrase (or Legge’s “Duke Ting”), then open the live 13.15 page rather than a summary that invents chapter numbers or softens 一言丧邦. Your reading stays honest when you keep source, vernacular guide, and English translation in separate layers.",
      },
      {
        questionZh: "「一言兴邦／一言丧邦」在这里说什么？",
        questionEn: "What does 一言兴邦 / 一言丧邦 mean here?",
        answerZh:
          "你听到定公问是否有一言可使国家兴盛或衰亡，孔子拒绝说得太绝对，却指向近于兴邦与近于丧邦：知为君之难，以及不善之言无人敢违。你要把这读成权位之下言语分量的教诲，而不是禁人口舌的许可。你的下一步是子路那章活页，而不是贴到每场争执上的口号。",
        answerEn:
          "You hear Duke Ding ask whether one sentence can prosper or ruin a state, and Confucius refuse absolute wording while pointing to near-effects: knowing how hard it is to be a prince, and unchecked speech when no one dares oppose what is not good. Hold that as a teaching about the weight of words under power, not as a slogan for silencing dissent. Your next step is the live Tsze-lu page, not a tweet-sized paraphrase pasted onto every dispute.",
      },
      {
        questionZh: "八佾 3.19「君使臣以礼、臣事君以忠」呢？",
        questionEn: "What about 君使臣以礼、臣事君以忠 in 3.19?",
        answerZh:
          "你看见定公问君臣当如何相待，孔子以礼使臣、以忠事君作答。你只轻读为君臣相待尺度的轻门，而不要写成忠恕专稿，也不要把它当成这篇的主钱门。你不该发明活页没有写出的额外职分，读完请回到子路 13.15。",
        answerEn:
          "You see Ding ask how prince and minister should treat each other, and Confucius answer with propriety toward ministers and faithfulness toward the prince. Read that lightly as a side door about mutual measure—not as a full zhongshu Note. You should not invent extra duties the live page does not show.",
      },
      {
        questionZh: "怎样避免把他和其他公混在一起？",
        questionEn: "How do you keep from mixing him with other dukes?",
        answerZh:
          "你在别处还可能遇见鲁哀公、卫灵公或齐景公——这里只点名消歧，不开新传。当章句只写「公」时，请到人物索引核对是哪一位。你的习惯应是：一个名字，一组可链的活页篇章，而不是合并成一篇宫廷编年。",
        answerEn:
          "You may also meet Duke Ai of Lu, Duke Ling of Wei, or Duke Jing of Qi elsewhere—light names only here, not new biographies. When a passage says “the duke,” check the people index for which ruler it is. Your habit should be one name, one set of linked chapters, not a merged court chronicle.",
      },
      {
        questionZh: "这篇笔记不是什么？",
        questionEn: "What is not this essay?",
        answerZh:
          "你在这里找不到诸公合传，也找不到君子／忠恕／仁的通论重写，更找不到用来取代哀公、景公、灵公笔记的第二篇概览。那些主题只在定公的提问碰到时轻轻出现。你的下一步是篇章页或人物索引，而不是重复本站其他札记的又一则总论。",
        answerEn:
          "You will not find here a multi-duke biography, a rewrite of junzi / zhongshu / ren, or a second Duke Ai / Jing / Ling overview meant to replace those Notes. Those themes appear only where Duke Ding’s questions touch them. Your next step is a passage page or the entity index, not another overview that repeats other Notes on this site.",
      },
      {
        questionZh: "怎样避免 AI 编造鲁定公语录？",
        questionEn: "How do you keep AI from inventing Duke Ding quotes?",
        answerZh:
          "若你用模型当阅读助手，应粘贴活页原文再追问，而不是在没有出处时问「孔子在鲁一定还说过什么」。你应一律拒绝新捏造出来的《论语》句子。你的核验路径始终是本站已经发布的篇章活页网址，见 lunyu.ai。",
        answerEn:
          "If you use a model as a reading aid, you should paste the live passage text and ask for questions, not for “what Confucius must have added in Lu” without a source. Always refuse any newly minted Analects line. Your verification path is always the published chapter URL on this site, lunyu.ai.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读子路 13.15",
        headingEn: "Read Tsze-lu 13.15 next",
        bodyZh: [
          "当你准备打开最清楚的那扇「一言兴邦／丧邦」之门，请打开[论语 · 子路 13.15](https://www.lunyu.ai/zh-Hans/analects/zi-lu/zi-lu-015)，把原文、白话导读与英译并排对照。你问问自己：在权位之下，还有哪些话你仍该掂量——然后停住，回到文本，而不是回到一篇定公摘要。",
        ],
        bodyEn: [
          "When you are ready for the clearest door on Duke Ding’s question about one sentence that can prosper or ruin a state, open [The Analects · Tsze-lu 13.15](https://www.lunyu.ai/en/analects/zi-lu/zi-lu-015) and read source, guide, and Legge side by side. Ask yourself which words you still owe to weigh carefully under power—then stop, and return to the live text rather than to a summary of the duke.",
        ],
      },
    ],
  },
  {
    slug: "duke-jing-of-qi-in-the-analects",
    titleZh: "《论语》里的齐景公是谁？",
    titleEn: "Who Was Duke Jing of Qi in the Analects?",
    dekZh:
      "你搜「齐景公」或 Duke Jing of Qi 时，多半想在《论语》一串国君名里把他安顿下来。在本站，你遇见他，是因为他在颜渊 12.11 问政，听闻君君、臣臣、父父、子子——名分各安其位。你不必先读王侯传；你可以直接打开那场问答，看名分如何成为答语。",
    dekEn:
      "When you search \"duke jing of qi,\" you usually want one Qi ruler placed among many names in the Analects. On this site you meet him as the duke who asks about government in Yen Yuan 12.11 and hears 君君、臣臣、父父、子子—roles held in place. You do not need a Wikipedia résumé first; you can read that scene and notice how proper names for roles become the answer.",
    descriptionZh: "《论语》里的齐景公：问政，听闻君君、臣臣、父父、子子——名分各安其位。链回可核对的原文。",
    descriptionEn:
      "Duke Jing of Qi in the Analects: the Qi ruler who asks about government and hears that roles must hold—prince, minister, father, and son.",
    datePublished: "2026-09-30",
    dateModified: "2026-09-30",
    tagsZh: ["齐景公", "景公", "颜渊"],
    tagsEn: ["duke jing of qi", "Duke Jing of Qi", "Yen Yuan"],
    related: [
      "/analects/yan-yuan/yan-yuan-011",
      "/index/duke-jing-of-qi",
      "/blogs/duke-ling-of-wei-in-the-analects",
      "/blogs/duke-ai-of-lu-in-the-analects",
      "/blogs/duke-ding-of-lu-in-the-analects",
    ],
    cover: notesBlogImage(
      "duke-jing-of-qi-in-the-analects",
      "cover.jpg",
      "A Qi court audience — Duke Jing asking Confucius about government",
      "齐廷对问之席——景公问孔子「问政」",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "duke-jing-of-qi-in-the-analects",
        "inline-1.jpg",
        "Four quiet name-places in order — prince, minister, father, son held each in place",
        "四席名分安位——君臣父子各安其位的阅读意象",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "duke-jing-of-qi-in-the-analects",
        "inline-2.jpg",
        "A quiet court table with empty cups in place — roles settled, no spectacle",
        "素净廷案空杯各安其位——名分安顿，不作奇观",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认人，不靠王侯履历",
        headingEn: "Place him by the passages, not by a royal résumé",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，人物索引把他标为[齐景公](https://www.lunyu.ai/zh-Hans/index/duke-jing-of-qi)——问政、并触及名分各安其位的齐国国君。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与英译分开放，拒绝发明活页上没有的句子。把索引当门牌，而不是替你读完的终稿。英译 Legge 或作 Duke Ching of Ch'i；本站同一人写作齐景公／Duke Jing of Qi。",
        ],
        bodyEn: [
          "If you want a compact entry before you open each chapter page, the people index labels him as [Duke Jing of Qi](https://www.lunyu.ai/en/index/duke-jing-of-qi)—a ruler of Qi who asks about government and proper roles. That line is enough for you to start: follow the linked scenes, keep source text, guide, and English translation in their layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished essay that replaces reading. In Legge you may also see “Duke Ching of Ch'i”; on this site the same person is Duke Jing of Qi.",
        ],
      },
      {
        headingZh: "问政——听闻名分各安其位",
        headingEn: "Ask about government—hear roles held in place",
        imageSlot: "inline-1",
        bodyZh: [
          "颜渊 12.11 里，齐景公问政于孔子。孔子对曰：君君，臣臣，父父，子子。公曰善哉；信如君不君、臣不臣、父不父、子不子，虽有粟，吾得而食诸。你可以把这扇门读成「名分是否安位」，而不是逼人服从的口号，也不是文本外编造的现代编制表。引用时，请把原文与英译按同一活页所见分层标明。",
        ],
        bodyEn: [
          "In Yen Yuan 12.11 Duke Jing of Qi asks Confucius about government. Confucius answers: there is government when the prince is prince, the minister minister, the father father, and the son son—君君、臣臣、父父、子子. The duke says “Good!” and adds that if those names fail, even with grain he could not enjoy it. You can take that as a door about roles held in place—not as a slogan for forcing obedience, and not as a modern org chart invented outside the text. When you cite it later, keep the Chinese source visible beside the English layer on the same live page.",
        ],
      },
      {
        headingZh: "两扇轻门——千驷，与「吾老矣」",
        headingEn: "Two lighter doors—horses, and “I am old”",
        imageSlot: "inline-2",
        bodyZh: [
          "别处你可轻开一次[论语 · 季氏 16.12](https://www.lunyu.ai/zh-Hans/analects/ji-shi/ji-shi-012)：齐景公有马千驷，死之日民无德而称焉；伯夷、叔齐饿于首阳之下，民到于今称之。你只把这读成景公一侧「德与显」的对照，而不要在这里写成伯夷叔齐专稿。",
          "另一扇轻门是[论语 · 微子 18.3](https://www.lunyu.ai/zh-Hans/analects/wei-zi/wei-zi-003)：齐以介于季、孟之间待孔子，又曰吾老矣，不能用也，孔子行。你可看一眼再回来——这篇笔记停在「景公是谁、问政怎么读」，而不是齐廷去留编年。",
        ],
        bodyEn: [
          "Elsewhere you may lightly open [The Analects · Ke She 16.12](https://www.lunyu.ai/en/analects/ji-shi/ji-shi-012): Duke Jing had a thousand teams of horses, yet on the day of his death the people did not praise him for a single virtue—set beside Bo Yi and Shu Qi, who starved yet are still praised. Hold that only as a virtue-versus-display contrast about Jing; you are not reading a Bo Yi–Shu Qi Note here.",
          "Another light door is [The Analects · Wei Tsze 18.3](https://www.lunyu.ai/en/analects/wei-zi/wei-zi-003): how Qi would rank Confucius between the Chi and Mang houses, then “I am old; I cannot use his doctrines,” and Confucius leaves. You can glance once, then return—this Note stays with who Jing is and how you read the 问政 answer, not with a full Qi-court exit chronicle.",
        ],
      },
      {
        headingZh: "不是鲁哀公，不是卫灵公，也不是鲁定公",
        headingEn: "Not Duke Ai, not Duke Ling, not Duke Ding",
        bodyZh: [
          "书中别处你还会遇见鲁哀公、卫灵公或鲁定公——不同的国君，不同的问法。这篇笔记只停在齐景公；它不是诸公合传，也不重述他们各自的场景。你不该把他们并成一篇「《论语》诸公合传」，也不该把本页当成曾子簇、君子或忠恕通论的重写。需要时，请把每个名字扣回各自的活页章句。",
        ],
        bodyEn: [
          "Elsewhere in the book you may meet Duke Ai of Lu, Duke Ling of Wei, or Duke Ding of Lu—different rulers, different questions. This Note stays with Duke Jing of Qi alone; it is not a multi-duke biography and it does not retell their separate scenes. You should not merge them into one “dukes of the Analects” résumé, and you should not treat this page as a Zeng Zi, junzi, or zhongshu rewrite. Keep each name tied to its own live passages when you need them.",
        ],
      },
      {
        headingZh: "你该怎样引用他",
        headingEn: "How you should cite him",
        bodyZh: [
          "当你引用景公的提问或孔子的答语，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。你可以轻提检索意图，但不要发明 brief 没有给出的展示次数或历史年份。你的诚实落在篇章页上，而不在更顺口却无出处的改写里。",
        ],
        bodyEn: [
          "When you quote Duke Jing’s question or Confucius’s answer, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. You can mention search interest lightly if needed, but you should never invent impression counts or history dates the brief did not give. Your honesty is the passage page, not a smoother paraphrase that invents a saying.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的齐景公是谁？",
        questionEn: "Who was Duke Jing of Qi in the Analects?",
        answerZh:
          "你在《论语》里遇见的齐景公（亦称景公、Duke Jing of Qi；Legge 作 Duke Ching of Ch'i），是问政并听闻君臣父子各安其位的齐国国君。你最好的答案是颜渊 12.11 与人物索引；16.12、18.3 只作轻门——不是编造的履历。",
        answerEn:
          "You meet Duke Jing (齐景公; also Jing Gong; Legge “Duke Ching of Ch'i”) as the Qi ruler who asks about government and hears that roles must hold—prince, minister, father, son. Your best answer is Yen Yuan 12.11 plus the people index, with 16.12 and 18.3 only as light side doors—not a modern royal biography invented outside the text.",
      },
      {
        questionZh: "为什么有人搜「齐景公」或 duke jing of qi？",
        questionEn: "Why do people search \"duke jing of qi\"?",
        answerZh:
          "你往往想先弄清身份：哪一位公、哪次答语、哪扇篇章的门。搜到这个词（或 Legge 的 Duke Ching of Ch'i）后，请打开颜渊 12.11 活页，而不要依赖会捏造章号或软化「君君臣臣」的摘要。你把原文、白话与英译分层来读，阅读才站得住。",
        answerEn:
          "You often want a clear identity: which duke, which famous answer, which chapter door. Search that phrase (or Legge’s “Duke Ching of Ch'i”), then open the live 12.11 page rather than a summary that invents chapter numbers or softens 君君臣臣. Your reading stays honest when you keep source, vernacular guide, and English translation in separate layers.",
      },
      {
        questionZh: "「君君、臣臣、父父、子子」在这里说什么？",
        questionEn: "What does 君君、臣臣、父父、子子 mean here?",
        answerZh:
          "你听到孔子以名分各安其位回答问政：君要像君，臣要像臣，父要像父，子要像子。你要把这读成名与行相称的教诲，而不是胁迫的许可。你的下一步是颜渊那章活页，对照原文与白话导读，而不是贴到每场职场争执上的口号。",
        answerEn:
          "You hear Confucius answer a question about government by naming roles held in place: the prince as prince, the minister as minister, the father as father, the son as son. Hold that as a teaching about names that fit conduct, not as permission to coerce. Your next step is the live Yen Yuan page, not a slogan you paste onto every workplace dispute.",
      },
      {
        questionZh: "季氏 16.12 的千驷呢？",
        questionEn: "What about the thousand teams of horses in 16.12?",
        answerZh:
          "你看见景公的富与伯夷叔齐并置：马多，死之日民无德可称；饿于首阳，民到于今称之。你只轻读为景公一侧的德与显对照，而不要写成伯夷专稿。你不该发明活页没有写出的额外褒贬。",
        answerEn:
          "You see Jing’s wealth set beside Bo Yi and Shu Qi: many horses, yet no virtue the people praise at his death; hunger, yet praise that lasts. Read that lightly as a contrast about Jing—not as a full Bo Yi Note. You should not invent extra blame or praise lines the live page does not show.",
      },
      {
        questionZh: "微子 18.3「吾老矣」呢？",
        questionEn: "What about “I am old” in 18.3?",
        answerZh:
          "你听见齐以介于季、孟之间待孔子，又以年老为由不能用其道，孔子于是离开。你只用它作景公一侧的轻门，再回到问政答语。你的习惯应是：一页一意图——人物笔记在此，去齐之景在彼。",
        answerEn:
          "You hear Qi rank Confucius between the Chi and Mang houses, then refuse to use his doctrines because the duke is old; Confucius leaves. Use that only as a light door on Jing’s court, then return here for the 问政 answer. Your habit should be one intent per page: person Note here, exit scene there.",
      },
      {
        questionZh: "怎样避免把他和其他公混在一起？",
        questionEn: "How do you keep from mixing him with other dukes?",
        answerZh:
          "你在别处还可能遇见鲁哀公、卫灵公或鲁定公——这里只点名消歧，不开新传。当章句只写「公」时，请到人物索引核对是哪一位。你的习惯应是：一个名字，一组可链篇章，而不是合并的宫廷编年。",
        answerEn:
          "You may also meet Duke Ai of Lu, Duke Ling of Wei, or Duke Ding of Lu elsewhere—light names only here, not new biographies. When a passage says “the duke,” check the people index for which ruler it is. Your habit should be one name, one set of linked chapters, not a merged court chronicle.",
      },
      {
        questionZh: "怎样避免 AI 编造齐景公语录？",
        questionEn: "How do you keep AI from inventing Duke Jing quotes?",
        answerZh:
          "若你用模型当阅读助手，应粘贴活页原文再追问，而不是在没有出处时问「孔子在齐一定还说过什么」。你应一律拒绝新捏造的《论语》句子。你的核验路径始终是本站已发布的篇章地址，lunyu.ai。",
        answerEn:
          "If you use a model as a reading aid, you should paste the live passage text and ask for questions, not for “what Confucius must have added in Qi” without a source. Always refuse any newly minted Analects line. Your verification path is always the published chapter URL on this site, lunyu.ai.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读颜渊 12.11",
        headingEn: "Read Yen Yuan 12.11 next",
        bodyZh: [
          "当你准备打开最清楚的那扇「问政与名分安位」之门，请打开[论语 · 颜渊 12.11](https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-011)，把原文、白话导读与英译并排对照。你问问自己：还有哪些名分你仍该安住——然后停住，回到文本，而不是回到一篇景公摘要。",
        ],
        bodyEn: [
          "When you are ready for the clearest door on Duke Jing’s question about government and the answer of roles held in place, open [The Analects · Yen Yuan 12.11](https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-011) and read source, guide, and Legge side by side. Ask yourself which names you still owe to hold—then stop, and return to the live text rather than to a summary of the duke.",
        ],
      },
    ],
  },
  {
    slug: "zeng-zi-in-the-analects",
    titleZh: "《论语》里的曾子是谁？",
    titleEn: "Who Was Zeng Zi in the Analects?",
    dekZh: "你搜「曾子」「曾参」或 zengzi / zeng zi 时，多半是想在一串弟子名里把他安顿下来。在本站，你遇见他，是曾子（曾参；Legge 作 Tsang）——以每日三省、慎终追远与传述夫子一贯之道见称的弟子。你不必先读弟子传；你可以直接打开他出现的篇章，看他怎样把所闻说给人听。",
    dekEn: "When you search \"zengzi,\" \"zeng zi,\" or 曾子, you usually want one disciple placed among many names. On this site you meet him as Zeng Zi (曾子 / Zeng Shen / Tsang)—the student known for daily self-examination, careful funerals and distant remembrance, and for transmitting the Master's one-thread teaching. You do not need a Wikipedia résumé first; you can read the passages where he speaks and notice how he restates what he received.",
    descriptionZh: "《论语》里的曾子：以每日三省、慎终追远与传述夫子一贯之道见称的弟子。链回可核对的原文。",
    descriptionEn:
      "Zeng Zi in the Analects: the disciple known for daily self-examination, careful funerals and distant remembrance, and for transmitting the Master’s one-thread teaching.",
    datePublished: "2026-09-25",
    dateModified: "2026-09-25",
    tagsZh: ["曾子", "曾参", "学而"],
    tagsEn: ["zeng zi", "Zeng Zi", "Hsio R"],
    related: [
      "/analects/xue-er/xue-er-004",
      "/index/zeng-zi",
      "/analects/tai-bo/tai-bo-007",
      "/blogs/zhongshu-reciprocity-in-the-analects",
      "/blogs/zeng-zi-sayings-in-the-analects",
    ],
    cover: notesBlogImage(
      "zeng-zi-in-the-analects",
      "cover.jpg",
      "A quiet study desk by the window with blank paper, brush, and inkstone — Zeng Zi, daily self-examination",
      "临窗书案、空白纸与笔砚——曾子，日三省吾身",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "zeng-zi-in-the-analects",
        "inline-1.jpg",
        "Spare offering table and distant memorial tablets in soft incense mist — careful endings, lasting remembrance",
        "素案、远方牌位与轻烟——慎终追远（庄重克制，非丧葬写实）",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "zeng-zi-in-the-analects",
        "inline-2.jpg",
        "A scholar on a long misted mountain path with a modest scroll bundle — heavy burden and long road",
        "学者负卷行于雾中山径——士不可以不弘毅，任重而道远",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认人，不靠履历表",
        headingEn: "Place him by the passages, not by a résumé",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，人物索引把他标为[曾子](https://www.lunyu.ai/zh-Hans/index/zeng-zi)——以自省、孝行与传述见称的弟子。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与英译分开放，拒绝发明活页上没有的句子。把索引当门牌，而不是替你读完的终稿。",
        ],
        bodyEn: [
          "If you want a compact entry before you open each chapter page, the people index labels him simply as [Zeng Zi](https://www.lunyu.ai/en/index/zeng-zi)—a disciple known for self-examination, filial conduct, and transmission. That line is enough for you to start: follow the linked scenes, keep source text, guide, and English translation in their layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished essay that replaces reading.",
        ],
      },
      {
        headingZh: "每日三省——为人谋忠、交友信、传习",
        headingEn: "Daily three examinations—loyalty, sincerity, practice",
        bodyZh: [
          "学而 1.4 里，你听见曾子自己点出检索常引的「吾日三省吾身」。活页白话导读写：曾子说：我每天多次反省自己：替别人办事有没有不尽心？和朋友交往有没有不诚信？老师传授的道理有没有认真温习实践？Legge 英译则分三点：为人谋是否不忠，交友是否不信，对师传是否未习。你可以把这份清单读成自省的门，而不是一句口号，好把同页原文换掉。当你问自己「省了没有」，先核这三处关系，再核对自己的书单。",
        ],
        bodyEn: [
          "In Hsio R. 1.4 you hear Tsang himself name the habit that searchers often quote as 吾日三省吾身. Legge’s public-domain English on the live page says: The philosopher Tsang said, \"I daily examine myself on three points:—whether, in transacting business for others, I may have been not faithful;—whether, in intercourse with friends, I may have been not sincere;—whether I may have not mastered and practised the instructions of my teacher.\" The live Chinese guide puts it as daily self-checks on whether you have been wholehearted for others, trustworthy with friends, and serious about reviewing and practising what your teacher transmitted. You can take that list as a door about how you examine yourself—not as a slogan that lets you skip the Chinese source on the same page. When you ask whether you have “examined,” check these three relations before you check a reading list alone.",
        ],
      },
      {
        headingZh: "慎终追远——轻提一次",
        headingEn: "Careful funerals, distant remembrance—once, lightly",
        imageSlot: "inline-1",
        bodyZh: [
          "别处，学而 1.9 里，你也听见曾子说：谨慎办理父母的丧事，追念祭祀远代祖先，民风自然会归向厚道。你可以把「慎终追远」握住为与这位弟子相关的孝行与礼制一线，而不是把本站另篇「孝行、礼仪与照料」专文整篇搬进来。当你把他和这句话并读时，不妨问：你自己的追念，在日日忠信拆开时要付什么代价。",
        ],
        bodyEn: [
          "Elsewhere, in Hsio R. 1.9, you also hear Zeng Zi say that careful funerals for parents and distant remembrance of ancestors naturally thicken a people’s manners toward kindness. The live guide renders that mood as 慎终追远—handle the end of life with care, and keep far generations in ritual memory. You may hold that as one more line of filial conduct tied to this disciple—not as a rewrite of this site’s separate essay on filial ritual and care. When you set him next to that saying, ask what your own remembrance costs when daily loyalty and sincerity fall apart.",
        ],
      },
      {
        headingZh: "任重道远——泰伯 8.7",
        headingEn: "Heavy burden, long road—T'ai-po 8.7",
        imageSlot: "inline-2",
        bodyZh: [
          "若你想给同一位弟子再开一扇活页门，可打开一次[论语 · 泰伯 8.7](https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-007)。那里曾子曰：士不可以不弘毅，任重而道远。活页导读写：读书人不可以不心胸宽广、意志坚毅，因为他担子沉重而路途遥远。把实现仁德作为自己的责任，这担子不是很沉重吗？直到死了才停止，这路途不是很遥远吗？你该把这读成对「担子扛多远」的校正，而不是商战口号，也不是把另一篇概念专文整篇搬进来。把人物场景与成语母题分开：一边是房间里发言的曾子，一边是你别处还会遇见的「任重道远」。",
        ],
        bodyEn: [
          "If you want a second live door on the same disciple, open [The Analects · T'ai-po 8.7](https://www.lunyu.ai/en/analects/tai-bo/tai-bo-007) once. There Tsang says the officer may not be without breadth of mind and vigorous endurance; his burden is heavy and his course is long. Legge continues that to take Perfect virtue as one’s own burden is heavy, and only death ends the road—so the course is long. The live Chinese guide names 士不可以不弘毅 and 任重道远: the scholar-officer needs a wide chest and firm will because the task of ren is heavy and stops only at death. You should read that as a check on how far you carry responsibility—not as a CEO slogan or a rewrite of another concept Note. Keep the person scene and the motif apart: one names Zeng Zi in the room; the other is a proverb you meet again elsewhere.",
        ],
      },
      {
        headingZh: "不是忠恕重写——也不是孝行通论",
        headingEn: "Not a zhongshu rewrite—and not the filial essay",
        bodyZh: [
          "检索时你也可能撞上本站「忠恕／reciprocity」专文，或「孝行、礼仪与照料」通论。那些词簇可以在「曾子」或忠恕旁出现，却不是本篇的任务。你应知道：里仁 4.15 里，曾子接过夫子一贯之教，复述为「夫子之道，忠恕而已矣」——Legge 作 loyalty and reciprocity——而概念专文已跨章拆读该词。你应把曾子是谁、以及学而 1.4 三省怎么读，留作主意图。你不要把他并进忠恕专文，也不要并进孝礼长论；此处只轻提慎终追远与忠恕，免得门与门撞在一起。",
        ],
        bodyEn: [
          "Search may also surface the site’s Note on zhongshu / reciprocity, or the essay on filial conduct, ritual, and care. Those clusters can sit near “曾子” or near 忠恕 in Latin letters, but they are not this Note’s job. You should know that in Li Ren 4.15 Zeng Zi receives the Master’s one-thread teaching and restates it as 夫子之道，忠恕而已矣—Legge’s loyalty and reciprocity—yet the concept Note already unpacks that word across chapters. Keep Zeng Zi’s identity and Hsio R. 1.4 as the main intent: who he is, and how you read the three daily examinations. Do not merge him into a reciprocity essay or into a full filial-ritual treatise here; mention 慎终追远 and 忠恕 only to keep the doors from colliding.",
        ],
      },
      {
        headingZh: "你该怎样引用他",
        headingEn: "How you should cite him",
        bodyZh: [
          "当你引用曾子，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。你可以轻提「zengzi」「zeng zi」「曾子」「曾参」或 Tsang 一类检索意图，但不要发明活页没有给出的展示次数或传记年份。你的诚实落在篇章页上，而不在更顺口却无出处的改写里。",
        ],
        bodyEn: [
          "When you quote Zeng Zi, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. You can mention search interest for “zengzi,” “zeng zi,” 曾子, 曾参, or Tsang lightly if needed, but you should never invent impression counts or biography dates the live pages do not give. Your honesty is the passage page, not a smoother paraphrase that invents a saying.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的曾子是谁？",
        questionEn: "Who was Zeng Zi in the Analects?",
        answerZh: "你在《论语》里遇见的曾子（曾参；Legge 亦作 Tsang），是每日三省、慎终追远、传述夫子忠恕、并说出士弘毅任重道远的弟子。你最好的答案是这些场景与人物索引，而不是文本外编造的履历。你先把人扣回活页章句来读。",
        answerEn: "You meet Zeng Zi (曾子; Zeng Shen; Tsang in Legge) as the disciple of daily self-examination, careful funerals and distant remembrance, transmission of the Master’s one-thread as zhongshu, and the officer’s heavy burden and long road. Your best answer is those scenes and the people index, not a modern résumé invented outside the text.",
      },
      {
        questionZh: "为什么有人搜「曾子」、曾参或 zengzi / zeng zi？",
        questionEn: "Why do people search \"zengzi,\" \"zeng zi,\" or 曾子?",
        answerZh: "你往往想先弄清身份：是哪位弟子、哪句三省吾身、曾参与 Tsang 怎样对应。搜到这些写法之后，请打开活页章句，而不要依赖一篇会捏造章号或软化原话的摘要。你把原文、白话导读与英译分层来读，阅读才站得住。",
        answerEn: "You often want a clear identity: which disciple, which self-examination line, which spelling of Zeng Shen or Tsang. Search those forms, then open the live passages rather than a summary that invents chapter numbers or softens the wording. Your reading stays honest when you keep source, vernacular guide, and English in separate layers.",
      },
      {
        questionZh: "「吾日三省吾身」三点指什么？",
        questionEn: "What is 吾日三省吾身 / the three points?",
        answerZh: "你听见曾子每日自省：为人谋是否不尽心，交友是否不诚信，师传是否未认真温习实践。你把它握住为如今仍可做的行止检点，而不是贴到每份效率清单上的口号。你的下一步是学而那一章活页，而不是多造出第四点的改写。",
        answerEn: "You hear Tsang examine himself daily on faithfulness in business for others, sincerity with friends, and whether he has mastered and practised his teacher’s instructions. Hold that as a conduct check you can still run, not as a slogan on every productivity list. Your next step is the live Hsio R. page, not a paraphrase that invents a fourth point.",
      },
      {
        questionZh: "「慎终追远」呢？",
        questionEn: "What about 慎终追远?",
        answerZh: "你听见曾子把谨慎办丧与追念远祖，和民风归厚连在一起。请把这当作与这位弟子相关的孝行礼制轻场景，而不是本站孝行专文的整篇重写。你可以在此记一次，再回到活页章句，而不必展开每一项丧祭细则。",
        answerEn: "You hear Zeng Zi link careful funerals and distant ancestral remembrance with a people’s turn toward thick manners. Treat that as one light scene of filial and ritual care tied to this disciple—not as a full rewrite of the site’s filial conduct essay. You may recall the line once here, then return to the live chapter rather than expanding every funeral rite.",
      },
      {
        questionZh: "泰伯 8.7 的「任重道远」是什么？",
        questionEn: "What is 任重道远 in T'ai-po 8.7?",
        answerZh: "你听见曾子说士须弘毅，因为以仁为己任，担子重，死而后已，路途远。请贴着原文与导读，把它读成书生的长路，而不是商战口号。你是在听这位弟子的一句，而不是重写后世借用这四字的每一条谚语。",
        answerEn: "You hear Tsang say the officer needs breadth and vigorous endurance because the burden of ren is heavy and the road ends only at death. Read that as a scholar’s long path beside the Chinese source—not as a business-war motto. You are hearing one saying from this disciple, not rewriting every later proverb that borrowed the four characters.",
      },
      {
        questionZh: "这和忠恕那篇是一回事吗？",
        questionEn: "Is this the same as the zhongshu Note?",
        answerZh: "你想到曾子在里仁 4.15 复述「夫子之道，忠恕而已矣」时，可能落到忠恕／reciprocity 专文——那是本站别处已覆盖的另一意图。请把曾子留在学而 1.4 发言、泰伯 8.7 说任重道远的人。你的习惯应是一页一意图：这边是弟子人物笔记，那边是概念专文，不要并稿。",
        answerEn: "You may land on reciprocity / 忠恕 essays when you think about Zeng Zi restating 夫子之道，忠恕而已矣 in Li Ren 4.15—that is a different intent already covered elsewhere. Keep Zeng Zi as the person who speaks in Hsio R. 1.4 and T'ai-po 8.7. Your habit should be one intent per page: disciple Note here, concept essay there.",
      },
      {
        questionZh: "怎样避免 AI 编造曾子语录？",
        questionEn: "How do you keep AI from inventing Zeng Zi quotes?",
        answerZh: "若你用模型当阅读助手，应粘贴活页原文再追问，而不是在没有出处时问「曾子一定还说过什么」。你应一律拒绝新捏造的《论语》句子。你的核验路径始终是本站已发布的篇章地址，lunyu.ai，而不是任何摘要改写。",
        answerEn: "If you use a model as a reading aid, you should paste the live passage text and ask for questions, not for “what Zeng Zi must have added” without a source. Always refuse any newly minted Analects line. Your verification path is always the published chapter URL on this site, lunyu.ai.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读学而 1.4",
        headingEn: "Read Hsio R. 1.4 next",
        bodyZh: [
          "当你准备读曾子每日三省最清楚的一扇门，请打开[论语 · 学而 1.4](https://www.lunyu.ai/zh-Hans/analects/xue-er/xue-er-004)，把原文、白话导读与英译并排对照。你问问自己：为人谋忠、交友信、传习实践——这三点里，哪一点还叫得出你自己的一天——然后停住，回到活页文本，而不是回到一篇曾子摘要。",
        ],
        bodyEn: [
          "When you are ready for the clearest door on Zeng Zi’s daily self-examination, open [The Analects · Hsio R. 1.4](https://www.lunyu.ai/en/analects/xue-er/xue-er-004) and read source, guide, and Legge side by side. Ask yourself which of the three points—loyalty for others, sincerity with friends, practised teaching—still name your own day—then stop, and return to the live text rather than to a summary of the disciple.",
        ],
      },
    ],
  },
  {
    slug: "zeng-zi-sayings-in-the-analects",
    titleZh: "《论语》里曾子的经典语录及含义",
    titleEn: "Zeng Zi’s Famous Sayings in the Analects",
    dekZh: "你若已听过「曾子」，或听过「吾日三省吾身」「任重道远」「忠恕」中的一句，多半想要一份带含义的语录清单，而不是再读一遍「他是谁」。本篇梳理几扇他发言的活页门：三省、任重道远、一贯之教轻复述为忠恕，以及慎终追远的轻提。你把原文、导读与 Legge 分层；下一步优先打开学而 1.4，看最清楚的每日检视。",
    dekEn: "When you already know the name Zeng Zi—or one famous line such as 吾日三省吾身, 任重道远, or 忠恕—you usually want a sayings list with meanings, not another “who was he?” essay. This Note catalogs a few live Analects doors where he speaks: three examinations, heavy burden and long road, a light 忠恕 restatement, and a soft filial mention. Keep source, guide, and Legge apart; open Hsio R. 1.4 next for the clearest daily check.",
    descriptionZh: "《论语》里曾子的经典语录：三省、任重道远、忠恕轻提与慎终追远。链回可核对的原文。",
    descriptionEn: "Zeng Zi’s famous sayings in the Analects: three examinations, a heavy burden and long road, a light 忠恕 restatement, and 慎终追远.",
    datePublished: "2026-09-27",
    dateModified: "2026-09-27",
    tagsZh: ["曾子", "语录", "学而"],
    tagsEn: ["zeng zi", "sayings", "Hsio R"],
    related: [
      "/analects/xue-er/xue-er-004",
      "/index/zeng-zi",
      "/analects/tai-bo/tai-bo-007",
      "/blogs/zeng-zi-in-the-analects",
    ],
    cover: notesBlogImage(
      "zeng-zi-sayings-in-the-analects",
      "cover.jpg",
      "A quiet desk with three blank slips as unmarked checkpoints — Zeng Zi’s sayings catalog",
      "书案上三枚空白纸条作检点——曾子语录目录",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "zeng-zi-sayings-in-the-analects",
        "inline-1.jpg",
        "Three folded notes on a spare desk — loyalty, sincerity, and practiced teaching",
        "素案上三折便笺——忠、信、传习",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "zeng-zi-sayings-in-the-analects",
        "inline-2.jpg",
        "A scholar on a long misted mountain path with a modest scroll bundle — heavy burden and long road",
        "学者负卷行于雾中山径——士不可以不弘毅，任重而道远",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "为何是语录目录，而不是另一篇人物传",
        headingEn: "Why a sayings catalog, not another biography",
        bodyZh: [
          "你已有人物篇：[《论语》里的曾子是谁？](https://www.lunyu.ai/zh-Hans/blogs/zeng-zi-in-the-analects) 把他安顿在场景里，却不假装是履历表。人物索引则标为[曾子](https://www.lunyu.ai/zh-Hans/index/zeng-zi)。本页独占目录——哪句话落在哪一章、活页上短义是什么。你不应把清单读成第二篇传记，也不应发明本站未发布的章号。姐妹篇或可在别处慢读一句；此处只摘要到够你选门为止。",
        ],
        bodyEn: [
          "You already have a person Note: [Who Was Zeng Zi in the Analects?](https://www.lunyu.ai/en/blogs/zeng-zi-in-the-analects) places the disciple among scenes without pretending to be a résumé. The people index labels him [Zeng Zi](https://www.lunyu.ai/en/index/zeng-zi). This page owns the catalog—which saying lives where, and what each short meaning is on the live page. You should not treat the list as a second biography, and you should not invent chapter numbers the site does not publish. Soft siblings may deep-dive one line elsewhere; here you only summarize enough to choose a door.",
        ],
      },
      {
        headingZh: "吾日三省吾身——学而 1.4",
        headingEn: "吾日三省吾身 — Hsio R. 1.4",
        imageSlot: "inline-1",
        bodyZh: [
          "你在学而 1.4 遇见检索最常引的曾子句。原文含「吾日三省吾身」与三问：为人谋而不忠乎、与朋友交而不信乎、传不习乎。活页导读重述每日检视：替人办事是否尽心、交友是否诚信、师传是否认真温习实践。Legge 则写 Tsang 自省：为人谋是否不忠，交友是否不信，对师传是否未习。守住封闭三点，勿造第四点。另篇或可把此句读得更慢；本目录只把它安顿好，好让你知道深度归哪一扇门。",
        ],
        bodyEn: [
          "You meet the most searched Zeng Zi line in Hsio R. 1.4. Source Chinese includes 吾日三省吾身 and the three questions: 为人谋而不忠乎, 与朋友交而不信乎, 传不习乎. The live guide restates daily checks on wholeheartedness for others, trustworthiness with friends, and serious review and practice of the teacher’s transmission. Legge says Tsang examines himself on whether he may have been not faithful in business for others, not sincere with friends, or may have not mastered and practised his teacher’s instructions. Hold the closed triad; invent no fourth point. A separate Note may walk the saying more slowly; this catalog only places it so you know which door owns the depth.",
        ],
      },
      {
        headingZh: "士不可以不弘毅／任重道远——泰伯 8.7",
        headingEn: "士不可以不弘毅 / 任重道远 — T'ai-po 8.7",
        imageSlot: "inline-2",
        bodyZh: [
          "若你想给同一位弟子再开第二句活页语录，可在正文打开一次[论语 · 泰伯 8.7](https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-007)——不是第二扇结尾钱页。那里曾子曰：士不可以不弘毅，任重而道远。Legge 续写：以 Perfect virtue 为己任则担子重，死而后已则路途远。活页导读写：读书人须心胸宽广、意志坚毅，因以仁为任，担子重，死而后已，路途远。你应把它读成对「担子扛多远」的校正，而不是商战口号，也不是把另一篇概念专文整篇搬进来。",
        ],
        bodyEn: [
          "If you want a second live saying from the same disciple, open [The Analects · T'ai-po 8.7](https://www.lunyu.ai/en/analects/tai-bo/tai-bo-007) once in the body—not as a second ending CTA. There Tsang says the officer may not be without breadth of mind and vigorous endurance; his burden is heavy and his course is long. Legge continues that taking Perfect virtue as one’s burden is heavy, and only death ends the road. The live Chinese guide names 士不可以不弘毅 and 任重道远: the scholar-officer needs a wide chest and firm will because the task of ren is heavy and stops only at death. You should read that as a check on how far you carry responsibility—not as a CEO slogan or a rewrite of another concept Note.",
        ],
      },
      {
        headingZh: "忠恕之复述——里仁 4.15（轻提）",
        headingEn: "忠恕 restated — Li Ren 4.15 (mention-light)",
        bodyZh: [
          "你也可能在里仁 4.15 听见曾子：夫子告参，吾道一以贯之；曾子曰「唯」；稍后对门人复述为「夫子之道，忠恕而已矣」。Legge 在活页上写的是 “to be true to the principles of our nature and the benevolent exercise of them to others”。更短的 “loyalty and reciprocity”，以及任何把忠恕收短的中文说法，都是常见编辑短注，不是 Legge。此处只作目录式轻提复述场景，不作概念专文。另篇已跨章拆读忠恕之义；本页不重写，也不把里仁 4.15 做成钱页 CTA。你把「复述之人」与「拥有该词的概念页」分开。",
        ],
        bodyEn: [
          "You may also hear Zeng Zi in Li Ren 4.15: the Master tells Shan that his doctrine is an all-pervading unity; Tsang answers “Yes,” and later restates to other disciples the line 夫子之道，忠恕而已矣. Legge’s wording on the live page is “to be true to the principles of our nature and the benevolent exercise of them to others.” “loyalty and reciprocity,” like any short Chinese gloss of 忠恕, is an editorial gloss, not Legge. Treat that here as a catalog mention of a restatement scene, not as a concept essay. A separate Note already unpacks what 忠恕 means across chapters; this page does not rewrite it and does not make Li Ren 4.15 a money CTA. You keep the person who restates apart from the concept page that owns the word.",
        ],
      },
      {
        headingZh: "慎终追远——学而 1.9（仅提及）",
        headingEn: "慎终追远 — Hsio R. 1.9 (mention-only)",
        bodyZh: [
          "别处，学而 1.9 里，你也听见曾子把谨慎办丧与追念远祖，和民风归厚连在一起——活页导读气氛下的「慎终追远」。此处宜像人物篇一样仅提及：一扇孝行轻门，不作第二钱页，也不作丧祭通论。你可以记一次，好让目录诚实，然后默认不链该章 URL，除非日后编辑真有一次必要。",
        ],
        bodyEn: [
          "Elsewhere, in Hsio R. 1.9, you also hear Zeng Zi link careful funerals for parents and distant remembrance of ancestors with a people’s turn toward thick manners—慎终追远 in the live guide’s mood. Prefer mention-only here, as the biography Note does: one soft filial door, not a second money CTA and not a full funeral-ritual treatise. You may recall the line once so the catalog feels honest, then leave the chapter URL unlinked unless a later edit truly needs it once.",
        ],
      },
      {
        headingZh: "你该怎样引用曾子语录",
        headingEn: "How you should cite a Zeng Zi saying",
        bodyZh: [
          "当你引用他，应标明活页篇章地址，并说明用的是原文、白话导读还是 Legge 英译。你可以轻提 zengzi、zeng zi、曾子、曾参或 Tsang 一类检索写法，但不要发明活页没有给出的展示次数或传记年份。你的诚实落在篇章页上——而不是更顺口、却编造句子或把多层并成一句“更新版”的改写。",
        ],
        bodyEn: [
          "When you quote him, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. You can mention search forms such as “zengzi,” “zeng zi,” 曾子, 曾参, or Tsang lightly if needed, but you should never invent impression counts or biography dates the live pages do not give. Your honesty is the passage page—not a smoother paraphrase that invents a saying or merges layers into one “updated” sentence.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里曾子最常被引的语录有哪些？",
        questionEn: "What are Zeng Zi’s most cited sayings in the Analects?",
        answerZh: "你通常会遇见学而 1.4 的「吾日三省吾身」、泰伯 8.7 的「士不可以不弘毅／任重道远」、里仁 4.15 里一贯之教轻复述为忠恕，以及有时学而 1.9 的「慎终追远」。请把它握住为短活页目录，而不是百科倾销。你下一步应选篇章门，而不是依赖会多造句子的摘要。",
        answerEn: "You usually meet 吾日三省吾身 in Hsio R. 1.4, 士不可以不弘毅 / 任重道远 in T'ai-po 8.7, the light restatement of the one-thread as 忠恕 in Li Ren 4.15, and sometimes 慎终追远 in Hsio R. 1.9. Hold them as a short live catalog, not as a Wikipedia dump. Your next reading choice should be a chapter door, not a summary that invents extra lines.",
      },
      {
        questionZh: "活页上「吾日三省吾身」是什么意思？",
        questionEn: "What does 吾日三省吾身 mean on the live page?",
        answerZh: "你听见三点每日检视：为人谋是否尽心，交友是否诚信，所受之教是否已温习实践。请把原文、导读与 Legge 分层标注；切勿自造第四点。若你想把这一句读得更慢，姐妹篇拥有那段深度——本目录只安顿门牌，好让你选对下一扇门。",
        answerEn: "You hear three daily checks: faithfulness when acting for others, sincerity with friends, and whether teaching received has been mastered and practised. Keep source, guide, and Legge labeled; invent no fourth point. If you want a slower walk through that one saying, a sibling Note owns the depth—this catalog only places the door.",
      },
      {
        questionZh: "泰伯 8.7 的「任重道远」是什么？",
        questionEn: "What is 任重道远 in T'ai-po 8.7?",
        answerZh: "你听见曾子说士须弘毅，因为以仁为己任，担子重，死而后已，路途远。请贴着原文与导读，把它读成书生的长路，而不是商战口号。你是在听这位弟子的一句，而不是重写后世借用这四字的每一条谚语。",
        answerEn: "You hear Tsang say the officer needs breadth and vigorous endurance because the burden of ren is heavy and the road ends only at death. Read it beside the Chinese source as a scholar’s long path—not as a business-war motto. You are hearing one saying from this disciple, not rewriting every later proverb that borrowed the four characters.",
      },
      {
        questionZh: "忠恕是曾子自己发明的吗？",
        questionEn: "Did Zeng Zi teach 忠恕 as his own invention?",
        answerZh: "你不应这么说。里仁 4.15 里，他接过夫子一贯之教，复述为忠恕。Legge 写的是 “to be true to the principles of our nature and the benevolent exercise of them to others”；“loyalty and reciprocity” 以及任何把忠恕收短的中文说法，都是常见编辑短注，不是 Legge。在本目录里，请把它当传述用语来读，而不是声称他发明了该概念本身。概念拆读应留在专文；你在此处只轻提场景，也不把它做成该章的钱页 CTA。",
        answerEn: "You should not. In Li Ren 4.15 he receives the Master’s one-thread and restates it as 忠恕. Legge writes “to be true to the principles of our nature and the benevolent exercise of them to others”; “loyalty and reciprocity,” like any short Chinese gloss of 忠恕, is an editorial gloss, not Legge. Treat that as transmission language on this catalog, not as a claim that he invented the concept. Concept unpacking stays on its own Note; you keep mention-light here without a money CTA to that scene.",
      },
      {
        questionZh: "这和「曾子是谁」那篇是一回事吗？",
        questionEn: "Is this the same as the Who Was Zeng Zi Note?",
        answerZh: "你用那篇弄清他在弟子中是谁；你用本篇做带短义与活页门的语录清单。姐妹篇或可慢读一句、或另谈传述角色。请你守住一页一意图，你的阅读地图才干净，近义页才不互相吞噬彼此的检索问法。",
        answerEn: "You use that Note for who he is among disciples; you use this Note for a sayings list with short meanings and live doors. Soft siblings may deep-dive one line or discuss transmission elsewhere. One intent per URL keeps your map clean and stops near pages from cannibalizing each other.",
      },
      {
        questionZh: "引用曾子句时，原文／导读／Legge 该怎么标？",
        questionEn: "How should you cite a Zeng Zi line (source / guide / Legge)?",
        answerZh: "你应写出已发布的篇章地址，并标明用了哪一层——原文、白话导读，或 Legge 英译。切勿把多层并成一句无出处的新句，也切勿无活页门就新造《论语》句子。你的核验路径始终是 lunyu.ai 上的活页，而不是更顺口的目录改写。",
        answerEn: "You should name the published chapter URL and label which layer you used—source Chinese, the modern guide, or Legge’s English. Never merge layers into one invented sentence, and never mint a new Analects line without a live door. Your verification path is always the published page on lunyu.ai, not a smoother paraphrase that flatters the catalog.",
      },
      {
        questionZh: "接下来该去哪读？",
        questionEn: "Where should you read next?",
        answerZh: "你应在本 FAQ 之后打开学而 1.4，在这些语录里看最清楚的每日自省门。先问三点里哪一点还叫得出你自己的一天，再关页。然后请停在已发布的篇章活页上，而不是停在任何取代阅读的目录摘要改写里。",
        answerEn: "You should open Hsio R. 1.4 after this FAQ for the clearest daily self-check among these sayings. Ask which of the three points still names your own day before you close the tab. Then stop on the published chapter rather than on any catalog summary that replaces reading with a smoother list.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读学而 1.4",
        headingEn: "Read Hsio R. 1.4 next",
        bodyZh: [
          "当你准备在这些语录里打开最清楚的一扇门，请打开[论语 · 学而 1.4](https://www.lunyu.ai/zh-Hans/analects/xue-er/xue-er-004)，把三省与原文、导读、Legge 并排对照来读。你问问自己：为人谋忠、交友信、传习——哪一点还叫得出你自己的一天——然后回到活页文本，而不是回到更长的清单。",
        ],
        bodyEn: [
          "When you are ready for the clearest door among these sayings, open [The Analects · Hsio R. 1.4](https://www.lunyu.ai/en/analects/xue-er/xue-er-004) and read the three examinations with source, guide, and Legge side by side. Ask which point—loyalty for others, sincerity with friends, practised teaching—still names your own day—then return to the live text rather than to a longer catalog list.",
        ],
      },
    ],
  },
  {
    slug: "three-self-examinations-in-the-analects",
    titleZh: "「吾日三省吾身」的具体背景与含义",
    titleEn: "What Does 「吾日三省吾身」 Mean in the Analects?",
    dekZh: "你搜「吾日三省吾身」、three self-examinations，或多半是想弄清这句本身——不是再读一遍曾子履历。在本站，这句话落在学而 1.4：曾子（Legge 作 Tsang）点出每日三点检视——为人谋是否尽心、交友是否诚信、师传是否温习实践。你可把四字握住为行止之门；原文、白话导读与 Legge 分层来读；活页没给的“身世背景”，你一律不编。",
    dekEn: "When you search 吾日三省吾身, “three self-examinations,” or “I daily examine myself on three points,” you usually want the saying itself—not a full Zeng Zi résumé. On this site the line lives in Hsio R. 1.4: Zeng Zi (Tsang) names three daily checks on loyalty for others, sincerity with friends, and practised teaching. Hold the phrase as a conduct door; keep source, guide, and Legge apart; refuse invented “background” the live page never gives.",
    descriptionZh: "「吾日三省吾身」落在学而 1.4：为人谋是否尽心、交友是否诚信、师传是否温习实践。链回可核对的原文。",
    descriptionEn: "What 吾日三省吾身 means in the Analects: three daily checks in Hsio R. 1.4 on loyalty, sincerity, and practised teaching.",
    datePublished: "2026-09-27",
    dateModified: "2026-09-27",
    tagsZh: ["吾日三省吾身", "曾子", "学而"],
    tagsEn: ["three self-examinations", "Zeng Zi", "Hsio R"],
    related: [
      "/analects/xue-er/xue-er-004",
      "/index/zeng-zi",
      "/blogs/zeng-zi-in-the-analects",
    ],
    cover: notesBlogImage(
      "three-self-examinations-in-the-analects",
      "cover.jpg",
      "A quiet morning study desk with one open blank notebook in soft light — daily three self-examinations",
      "晨光中的书案与一本翻开的空白本——吾日三省吾身",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "three-self-examinations-in-the-analects",
        "inline-1.jpg",
        "Three calm empty cups in a row on a spare desk — loyalty, sincerity, and practiced teaching",
        "素案上并排三只空杯——为人谋之忠、交友之信、传习之省",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "three-self-examinations-in-the-analects",
        "inline-2.jpg",
        "Three blank reading stacks under lamps of cool, neutral, and warm light — source, guide, and English kept apart",
        "三叠书页与冷暖不同的灯——原文、导读与英译分层并读",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "你搜到的四字——与活页之门",
        headingEn: "The phrase you searched—and the live door",
        bodyZh: [
          "你落到这里，往往因为这四个字比任何章名传得更远。活页之门却是固定的：本站学而 1.4。若你想在打开句子之前先把人安顿在弟子群里，可先看[《论语》里的曾子是谁？](https://www.lunyu.ai/zh-Hans/blogs/zeng-zi-in-the-analects)；人物索引则把他标为[曾子](https://www.lunyu.ai/zh-Hans/index/zeng-zi)。那些是地图，不是第二扇钱页。本篇的工作，是把「吾日三省吾身」读透到三点清楚为止——任重道远、一贯忠恕、慎终追远等姐妹意图，留给各自拥有它们的页面。",
        ],
        bodyEn: [
          "You land here because the four characters travel farther than any one chapter label. Still, the live door is fixed: Hsio R. 1.4 on this site. If you want the person placed among other disciples before you open the saying, [Who Was Zeng Zi in the Analects?](https://www.lunyu.ai/en/blogs/zeng-zi-in-the-analects) sketches him lightly; the people index tags him simply as [Zeng Zi](https://www.lunyu.ai/en/index/zeng-zi). Those doors are maps, not money CTAs. Your work on this Note is to stay with 吾日三省吾身 until the three points are clear—and to leave sibling sayings (heavy burden, one-thread restatement, careful funerals) for other pages that own them.",
        ],
      },
      {
        headingZh: "三点，按原文次序",
        headingEn: "The three points, in order",
        imageSlot: "inline-1",
        bodyZh: [
          "你应按源文次序守住这三点，不要自造第四点。第一：为人谋而不忠乎——替别人办事，有没有不尽心。第二：与朋友交而不信乎——和朋友交往，有没有不诚信。第三：传不习乎——老师传授的道理，有没有认真温习实践。当你问「省了没有」，先核这三处关系，再核对自己的书单。活页导读与 Legge 都守同一组三扇门；它们不添效率指标、职场 KPI，也不添第四句道德口号。你的诚实，在于这组三点是封闭的。",
        ],
        bodyEn: [
          "You should keep the triad in the order the source gives, and invent no fourth check. First: 为人谋而不忠乎—whether, in business done for others, you may have been not faithful. Second: 与朋友交而不信乎—whether, with friends, you may have been not sincere. Third: 传不习乎—whether you may have not mastered and practised what your teacher transmitted. When you ask “did I examine myself?” you ask these three relations before you ask whether your reading list grew. The live guide and Legge both hold the same three doors; they do not add a productivity metric, a career KPI, or a fourth moral slogan. Your honesty is the closed set of three.",
        ],
      },
      {
        headingZh: "原文 · 导读 · Legge——三层如何不同",
        headingEn: "Source · guide · Legge—how the layers differ",
        imageSlot: "inline-2",
        bodyZh: [
          "你切勿把三层并成一句更顺口的“现代改写”。活页原文含「吾日三省吾身」「为人谋而不忠乎」「与朋友交而不信乎」「传不习乎」。白话导读写：曾子说：我每天多次反省自己：替别人办事有没有不尽心？和朋友交往有没有不诚信？老师传授的道理有没有认真温习实践？Legge 英译则说：The philosopher Tsang said, \"I daily examine myself on three points:—whether, in transacting business for others, I may have been not faithful;—whether, in intercourse with friends, I may have been not sincere;—whether I may have not mastered and practised the instructions of my teacher.\" 你可按层取用：原文对字句，导读对今义，Legge 对固定英门。你不要假装一层“更新”了另一层，写成页上从未印出的句子。",
        ],
        bodyEn: [
          "You should never merge the three layers into one smoother “modern paraphrase.” On the live page, the source Chinese includes 吾日三省吾身, 为人谋而不忠乎, 与朋友交而不信乎, and 传不习乎. The modern Chinese guide says: Zeng Zi said he examines himself daily on several points—whether, when handling affairs for others, he has been less than wholehearted; whether, with friends, he has been less than trustworthy; whether he has seriously reviewed and practised what his teacher transmitted. Legge’s public-domain English says: The philosopher Tsang said, \"I daily examine myself on three points:—whether, in transacting business for others, I may have been not faithful;—whether, in intercourse with friends, I may have been not sincere;—whether I may have not mastered and practised the instructions of my teacher.\" You can use each layer for what it is: source for wording, guide for contemporary sense, Legge for a fixed English door. You should not pretend one layer “updates” another into a sentence the page never printed.",
        ],
      },
      {
        headingZh: "活页真正给出的“背景”",
        headingEn: "What “background” the live text actually gives",
        bodyZh: [
          "你或许想要生卒年、师承表，或经外起源神话，来填「吾日三省吾身」的“背景”。活页学而 1.4 并不给出这些。它给出的是说话人与场景：曾子（Tsang）自报每日习惯。宁可沉默，也不要假完整。你不应编造年份、伪造碑刻故事，或声称此句始于《论语》从未叙述的仪轨。若另篇梳理更多曾子语录，或谈后学道统叙事，那是另一意图——此处可软提姐妹篇，却不要把本页写成它们的目录。你的“背景”停在活页停处。",
        ],
        bodyEn: [
          "You may want a birth year, a teacher list, or an extracanonical origin myth for 吾日三省吾身. The live Hsio R. 1.4 page does not give those. What it does give is speaker and scene: Zeng Zi (Tsang) reports his own daily habit. Prefer silence over false completeness. You should not invent dates, forge a stele story, or claim the saying began in a ceremony the Analects never narrates. If another Note catalogs more Zeng Zi lines, or places him in later transmission stories, that is a different intent—mention those siblings softly here without turning this page into their catalog. Your “background” stops where the live text stops.",
        ],
      },
      {
        headingZh: "你今天仍可怎么做这三点检视",
        headingEn: "How you can still run the three checks today",
        bodyZh: [
          "你可把三点读成行止笔记，而不是效率鸡汤。一天结束时，问问自己：替别人办事有没有尽心；对朋友有没有诚信；自称学过的，有没有真正去温习实践。你不需要第四句口号、商战比喻，或一张取代原文的清单。任一点答“没有”时，你回到那处关系本身——而不是回到一篇恭维你的摘要。这句话仍有用，正因为它点名三扇你如今还能走进的具体门，而不必先买一套方法。",
        ],
        bodyEn: [
          "You can treat the triad as a conduct reading note, not as hustle copy. At the end of a day, ask whether you kept faith when you handled something for someone else; whether you stayed sincere with a friend; whether you practised what you claimed to have learned. You do not need a fourth slogan, a sales war metaphor, or a checklist that replaces the Chinese source. When the answer is no on any point, you return to the relation itself—not to a summary that flatters you. The saying stays useful because it names three concrete doors you can still walk through without buying a method.",
        ],
      },
      {
        headingZh: "不是语录总目，不是人物篇，不是忠恕专文",
        headingEn: "Not the sayings catalog, not the bio, not zhongshu",
        bodyZh: [
          "你应把本 URL 留在学而 1.4。语录总目可以把「吾日三省吾身」与别句并列；人物篇可以勾勒弟子是谁；另有概念专文在别处拆读忠恕。那些工作都不属于这里。软性拆分就够：本页独占三省深读。你不需要再链泰伯、里仁或另一篇博客作第二钱页。宁可一页一意图——姐妹篇已拥有的词簇，此处沉默。",
        ],
        bodyEn: [
          "You should keep this URL on Hsio R. 1.4 alone. A sayings catalog may list 吾日三省吾身 beside other lines; the Who Was Note may sketch the disciple; a separate concept Note unpacks 忠恕 elsewhere. None of those jobs belong here. Soft disambiguation is enough: this page owns the deep dive on the three examinations. You do not need a second money CTA to T'ai-po, Li Ren, or another blog. Prefer one intent per URL—and silence where a sibling already owns the cluster.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "「吾日三省吾身」在《论语》里是什么意思？",
        questionEn: "What does 吾日三省吾身 mean in the Analects?",
        answerZh: "你听见曾子说，他每日自省三点：为人谋是否尽心，交友是否诚信，师传是否已温习实践。请把四字握住为学而 1.4 上的这组三点，而不是脱离篇章的口号。你的下一步是分层对照的活页，而不是多造第四点、或编造文本没有的身世的改写。",
        answerEn: "You hear Zeng Zi say he examines himself daily on three points: faithfulness when acting for others, sincerity with friends, and whether he has mastered and practised his teacher’s transmission. Hold the phrase as that triad on Hsio R. 1.4, not as a floating slogan detached from the chapter. Your next step is the live page with layers kept apart, not a paraphrase that invents a fourth point or a biography the text never prints.",
      },
      {
        questionZh: "曾子点出的三点分别是什么？",
        questionEn: "What are the three points Zeng Zi names?",
        answerZh: "你按次序遇见：为人谋而不忠乎（替人办事／尽心），与朋友交而不信乎（交友／诚信），传不习乎（师传是否已习）。请严格守住源文次序下的封闭三点。你应拒绝任何“升级清单”——职场指标、人设目标，或活页从未点名的第四句道德口号。",
        answerEn: "You meet them in order: 为人谋而不忠乎 (business for others / faithfulness), 与朋友交而不信乎 (friends / sincerity), and 传不习乎 (teacher’s instructions mastered and practised). Keep the closed set of three exactly as the source orders them. You should refuse any “updated” checklist that adds career metrics, branding goals, or a fourth moral slogan the live page never names.",
      },
      {
        questionZh: "所谓“背景”是不是曾子传记？",
        questionEn: "Is “background” a historical biography of Zeng Zi?",
        answerZh: "你在活页上得到的是说话人与自报——不是生卒年、伪碑故事，或此句的经外起源神话。宁可沉默，也不要发明《论语》没给的年份。若你需要在弟子群里安顿此人，请打开人物篇或索引；本页只守句子的三扇门。",
        answerEn: "You get speaker and self-report on the live page—not a birth year, a forged stele story, or an extracanonical origin myth for the saying. Prefer silence over inventing dates the Analects do not give. If you need the person sketch among disciples, open the Who Was Note or the index; this page stays with the saying’s three doors alone.",
      },
      {
        questionZh: "原文、白话导读与 Legge 在这句上有何不同？",
        questionEn: "How do source Chinese, the modern guide, and Legge differ on this line?",
        answerZh: "你应把它们标成不同层来读。原文守古典字句，含「吾日三省吾身」与三问；白话导读用当代汉语重述三点检视；Legge 则固定英译三点：faithful、sincere、mastered and practised。切勿并成一句无出处的新句。你引用时说明用了哪一层，诚实才立得住。",
        answerEn: "You should keep them labeled as separate layers. Source holds the classical wording including 吾日三省吾身 and the three questions; the guide restates the checks in contemporary Chinese; Legge fixes an English triad of faithful, sincere, and mastered-and-practised. Never merge them into one invented sentence. Your honesty is citing which layer you used when you quote.",
      },
      {
        questionZh: "这和「曾子是谁」那篇是一回事吗？",
        questionEn: "Is this the same as the Who Was Zeng Zi Note?",
        answerZh: "你用那篇弄清他在弟子中是谁；你用本篇深读「吾日三省吾身」本身。姐妹篇或可梳理其他语录、或谈传述角色——却不抢本 URL 的工作，也不做第二钱页。一页一意图，你的阅读地图才干净，近义门才不互相吞噬。",
        answerEn: "You use that Note for who he is among disciples; you use this Note for the deep dive on 吾日三省吾身 alone. Soft sibling pages may catalog other sayings or discuss transmission elsewhere—without taking this URL’s job or becoming a second money CTA. One intent per page keeps your reading map clean and stops cannibalizing near doors.",
      },
      {
        questionZh: "可以再加第四点每日反省吗？",
        questionEn: "Can you add a fourth daily examination?",
        answerZh: "你不应加。活页只点三点就停；封闭集合正是此句的力道所在。第四句口号——效率 hustle、人设品牌、或“赢下今天”——都落在章句之外。请把三点当行止笔记来做；然后回到篇章本身，而不是把清单垫到恭维自己为止。",
        answerEn: "You should not. The live text names three points and stops; that closed set is the point of the saying. A fourth slogan—productivity hustle, branding, or “winning the day”—sits outside the passage. Run the three checks as conduct notes; then return to the chapter rather than padding the list until it flatters you.",
      },
      {
        questionZh: "接下来该去哪读全章？",
        questionEn: "Where should you read the full passage next?",
        answerZh: "你应在本 FAQ 之后打开学而 1.4 活页，把原文、白话导读与 Legge 并排对照来读。先问三点里哪一点还叫得出你自己的一天，再关页。然后请停在已发布的篇章上，而不是停在任何更顺口、却编造背景的摘要改写里。",
        answerEn: "You should open the live Hsio R. 1.4 door after this FAQ, with source Chinese, the modern guide, and Legge side by side on one page. Ask which of the three points still names your own day before you close the tab. Then stop on the published chapter instead of on any smoother summary that invents background.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读学而 1.4",
        headingEn: "Read Hsio R. 1.4 next",
        bodyZh: [
          "当你准备读这句话真正落脚的地方，请打开[论语 · 学而 1.4](https://www.lunyu.ai/zh-Hans/analects/xue-er/xue-er-004)，按次序读三点。你问问自己：为人谋忠、交友信、传习实践——这三点里，哪一点还叫得出你自己的一天——然后回到活页文本，而不是回到一篇编造背景的改写。",
        ],
        bodyEn: [
          "When you are ready for the saying where it lives, open [The Analects · Hsio R. 1.4](https://www.lunyu.ai/en/analects/xue-er/xue-er-004) and read the three points in order. Ask yourself whether loyalty for others, sincerity with friends, and practised teaching still name your own day—then return to the live text rather than to a paraphrase that invents background the page never gives.",
        ],
      },
    ],
  },
  {
    slug: "zeng-zi-in-confucian-transmission",
    titleZh: "曾子在儒家道统中的历史地位",
    titleEn: "Zeng Zi’s Place in Confucian Transmission",
    dekZh: "你问曾子在儒家传述——或后学所称「道统」——中的位置时，多半需要先落回《论语》场景，再清楚标出后学传统的边界。在本站，你看见他在里仁 4.15 承接夫子一贯之教并复述为忠恕；其他篇章只轻显传教姿态。你把后世谱系叙事标为后学主张，宁可沉默也不假完整，并拒绝为宋明图表编造《论语》没有的句子。",
    dekEn: "When you ask where Zeng Zi sits in Confucian transmission—or in later talk of 道统—you usually need Analects scenes first, then a clearly labeled later-tradition caveat. On this site you meet him receiving the Master’s one-thread in Li Ren 4.15 and restating it as 忠恕, with other doors showing a teaching posture only lightly. You keep later lineage stories marked as later claims, prefer silence over false completeness, and refuse invented Analects quotes that prop Song–Ming charts.",
    descriptionZh: "曾子在儒家传述中的位置：里仁 4.15 承接一贯并复述为忠恕；后学道统说法须标明为后学传统。",
    descriptionEn: "Zeng Zi’s place in Confucian transmission: he receives the one-thread in Le Jin 4.15 and restates it as 忠恕. Later 道统 claims stay labeled as later tradition.",
    datePublished: "2026-09-27",
    dateModified: "2026-09-27",
    tagsZh: ["曾子", "道统", "里仁"],
    tagsEn: ["zeng zi", "transmission", "Le Jin"],
    related: [
      "/analects/li-ren/li-ren-015",
      "/index/zeng-zi",
      "/analects/tai-bo/tai-bo-007",
      "/blogs/zeng-zi-in-the-analects",
    ],
    cover: notesBlogImage(
      "zeng-zi-in-confucian-transmission",
      "cover.jpg",
      "Two quiet study desks across a courtyard — receiving and restating a teaching",
      "庭院两端两张安静书案——受教与转述",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "zeng-zi-in-confucian-transmission",
        "inline-1.jpg",
        "A teacher leaving a courtyard gate while a student stays with questioners — receiving the one-thread teaching",
        "师出门外、弟子留答问者——一以贯之的受教一刻",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "zeng-zi-in-confucian-transmission",
        "inline-2.jpg",
        "A misted memorial corridor with unlabeled tablets fading into fog — later tradition, not proof",
        "雾中牌位廊道、无字碑影——后学道统记忆，非证物",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "传述角色，不是履历表",
        headingEn: "Transmission vs résumé",
        bodyZh: [
          "你应先把问题放对，再谈履历。[《论语》里的曾子是谁？](https://www.lunyu.ai/zh-Hans/blogs/zeng-zi-in-the-analects) 已在活页场景里勾勒弟子；人物索引标为[曾子](https://www.lunyu.ai/zh-Hans/index/zeng-zi)。本篇问的是他如何以传述者出现——谁承接、谁复述、后学记忆如何把他记成一环——而不是倾倒百科年表。证据薄时，你拒绝假完整。姐妹篇或可梳理语录、或慢读「吾日三省吾身」；此处守住传述角色。",
        ],
        bodyEn: [
          "You should place the question before the résumé. [Who Was Zeng Zi in the Analects?](https://www.lunyu.ai/en/blogs/zeng-zi-in-the-analects) already sketches the disciple among live scenes; the people index tags him [Zeng Zi](https://www.lunyu.ai/en/index/zeng-zi). This Note asks how he appears as a transmitter—who receives, who restates, who later memory names as a link—not how to dump a Wikipedia timeline. You refuse false completeness when the Analects evidence is thin. Soft siblings may catalog sayings or walk 吾日三省吾身 more slowly elsewhere; here you stay with transmission role.",
        ],
      },
      {
        headingZh: "《论语》里：承接一贯（里仁 4.15）",
        headingEn: "In the Analects: receiving the one-thread (Li Ren 4.15)",
        imageSlot: "inline-1",
        bodyZh: [
          "你在里仁 4.15 听见最清楚的传述场景。夫子曰：参乎，吾道一以贯之。曾子曰：「唯。」夫子出，门人问；曾子复述：夫子之道，忠恕而已矣。活页白话导读同写这一承接—复述弧线。Legge 把复述写成 “to be true to the principles of our nature and the benevolent exercise of them to others”。常见短注 “loyalty and reciprocity”，以及任何把忠恕收短的中文说法，都是编辑用语，不是 Legge。此处的忠恕只作复述标签：另篇已跨章拆读该概念，本页不重写那篇专文，也不链过去。你的工作是看清谁承接、谁复述——而不是把场景写成 reciprocal 通论。",
        ],
        bodyEn: [
          "You hear the clearest transmission scene in Li Ren 4.15. The Master says: Shan, my doctrine is that of an all-pervading unity—参乎，吾道一以贯之. Tsang answers “Yes.” After the Master leaves, other disciples ask; Zeng Zi restates the line 夫子之道，忠恕而已矣. The live Chinese guide narrates the same receive-and-restate arc. Legge renders that restatement as “to be true to the principles of our nature and the benevolent exercise of them to others.” “loyalty and reciprocity,” like any short Chinese gloss of 忠恕, is an editorial gloss, not Legge. Treat 忠恕 here as a restatement label only: a separate Note already unpacks the concept across chapters, and this page does not rewrite that essay or link it. Your job is to see who receives and who restates—not to turn the scene into a reciprocity treatise.",
        ],
      },
      {
        headingZh: "其他显出传教姿态的活页门（轻）",
        headingEn: "Other Analects doors that show a transmitting posture (light)",
        bodyZh: [
          "若你想再开一扇显「担子」而非完整谱系证明的活页，可在正文打开一次[论语 · 泰伯 8.7](https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-007)。那里曾子说士须弘毅，以仁为任则担重，死而后已则路远。你可把它握住为长久责任的传教姿态，而不是《论语》已印出宋明道统图的证据。此处不要重建语录总目；目录与三省深读归其他篇。宁可轻提，不要注水。",
        ],
        bodyEn: [
          "If you want one more live door that shows burden rather than a full lineage proof, open [The Analects · T'ai-po 8.7](https://www.lunyu.ai/en/analects/tai-bo/tai-bo-007) once in the body. There Tsang says the officer needs breadth of mind and vigorous endurance; the burden of ren is heavy and the course long—ending only at death. You may hold that as a teaching posture of long responsibility, not as Analects proof of a Song–Ming 道统 chart. Do not rebuild a sayings catalog here; other Notes own the list and the three-examinations deep dive. Prefer light mention over padding.",
        ],
      },
      {
        headingZh: "后学传统：道统说法（须标明）",
        headingEn: "Later tradition: 道统 claims (clearly labeled)",
        imageSlot: "inline-2",
        bodyZh: [
          "后世儒者有时把曾子写进称为「道统」的谱系故事——道之传承。你应把这类说法标为后学传统，而不是《论语》自己印出的句子。传统声称他是承接并往下传的一环；谨慎动词很重要：后学说、传统主张、后世图表安置。你切勿为那些图表编造《论语》引文，也切勿假装里仁 4.15 已含完整宋明图谱。若承接—复述之外的证据变薄，就明说并停住。宁可沉默，也不要一篇假思想史。",
        ],
        bodyEn: [
          "Later Confucians sometimes name Zeng Zi inside lineage stories called 道统—a transmission of the Way. You should label that talk as later tradition, not as a sentence the Analects itself prints. Tradition claims he stands as a link who received and passed teaching; cautious verbs matter: later readers say, tradition claims, later charts place. You must not invent Analects quotes to prop those charts, and you must not pretend Li Ren 4.15 already contains a full Song–Ming diagram. If the evidence beyond the receive-and-restate scene is thin, say so and stop. Prefer silence over a fake intellectual history.",
        ],
      },
      {
        headingZh: "本页不会做什么",
        headingEn: "What this page will not do",
        bodyZh: [
          "你不应重写忠恕／reciprocity 专文，不应编造传记年份，也不应用 GSC 数字自夸。你不应把本 URL 并进语录总目或人物篇。软性拆分就够：此处是传述角色；概念拆读在别处；人物勾勒在人物篇；「吾日三省吾身」深度在姐妹篇。一页一意图，门与门才不撞。",
        ],
        bodyEn: [
          "You should not rewrite the zhongshu / reciprocity Note, invent biography dates, or brag with GSC numbers. You should not merge this URL into a sayings catalog or into Who Was. Soft disambiguation is enough: transmission role here; concept unpacking elsewhere; person sketch on the bio; 吾日三省吾身 depth on its own sibling. One intent per page keeps doors from colliding.",
        ],
      },
      {
        headingZh: "你该怎样引用「传述／道统」说法",
        headingEn: "How you should cite transmission claims",
        bodyZh: [
          "当你引《论语》证据，应写出活页篇章地址，并说明用了原文、导读还是 Legge。当你引后世道统说法，应标明后学传统，拒绝把它打扮成经文已证。你切勿为了让谱系图看起来完整，就新造一句《论语》。你的诚实是已发布活页加上清楚标签——而不是抹掉缺口的顺口履历。",
        ],
        bodyEn: [
          "When you cite Analects evidence, you name the live chapter URL and which layer you used—source, guide, or Legge. When you cite later 道统 talk, you label it later tradition and refuse to dress it as canonical proof. You never mint a new Analects line to make a lineage chart look complete. Your honesty is the published page plus a clear label—not a smoother résumé that erases the gap.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "曾子在儒家传述／道统中是什么位置？",
        questionEn: "What is Zeng Zi’s place in Confucian transmission?",
        answerZh: "你在《论语》里遇见他，是在里仁 4.15 承接夫子一贯并复述为忠恕的弟子；其他篇章只轻显长久责任。后学传统或把他写入道统故事；请把那一层清楚标为后学。你的地图应从活页场景起，而不是从伪造的谱系证明图起。",
        answerEn: "You meet him in the Analects as a disciple who receives the Master’s one-thread and restates it as 忠恕 in Li Ren 4.15, with other doors showing long responsibility only lightly. Later tradition may name him in 道统 stories; keep that label clearly later. Your map should start from live scenes, not from a forged lineage chart that invents Analects proof.",
      },
      {
        questionZh: "里仁 4.15／Le Jin 4.15 发生了什么？",
        questionEn: "What happens in Li Ren 4.15 / 里仁 4.15?",
        answerZh: "你听见夫子告参：吾道一以贯之；曾子曰「唯」；随后对门人复述夫子之道，忠恕而已矣。Legge 写的是 “to be true to the principles of our nature and the benevolent exercise of them to others”；“loyalty and reciprocity” 以及任何把忠恕收短的中文说法，都是常见短注，不是 Legge。请你把原文、白话导读与 Legge 分层标注来读。本页焦点是承接—复述这一角色本身，而不是去跨章拆读 reciprocal 那一篇概念专文。",
        answerEn: "You hear the Master tell Shan that his doctrine is an all-pervading unity; Tsang answers “Yes,” then restates to others the line 夫子之道，忠恕而已矣. Legge writes “to be true to the principles of our nature and the benevolent exercise of them to others”; “loyalty and reciprocity,” like any short Chinese gloss of 忠恕, is a common short gloss, not Legge. Hold source, guide, and Legge apart as labeled layers. Your focus on this page is the receive-and-restate role, not a full concept essay that unpacks reciprocity across chapters.",
      },
      {
        questionZh: "忠恕是曾子自己的教导吗？",
        questionEn: "Is 忠恕 Zeng Zi’s own teaching?",
        answerZh: "你不应把它当成他本人的发明。他只是复述所闻而已。Legge 的句子是 “to be true to the principles of our nature and the benevolent exercise of them to others”；“loyalty and reciprocity” 以及任何把忠恕收短的中文说法，只是该复述场景的编辑短注，不是 Legge。概念拆读应留在专文的别处。你在此处只轻提一句，好让本页守住传述角色，而不是把 reciprocal 整篇重写成第二篇长论。",
        answerEn: "You should not treat it as his invention. He restates what he received. Legge’s sentence is “to be true to the principles of our nature and the benevolent exercise of them to others”; “loyalty and reciprocity,” like any short Chinese gloss of 忠恕, is only an editorial short gloss for that restatement scene, not Legge. Concept unpacking stays on its own Note elsewhere. You keep mention-light here so this page stays about transmission role, not about rewriting reciprocity as a second essay.",
      },
      {
        questionZh: "《论语》能证明完整的宋明道统图吗？",
        questionEn: "Does the Analects prove the full Song–Ming 道统 chart?",
        answerZh: "你应明确说不能。里仁 4.15 只显示承接—复述；它并不印出后世谱系图。当后学把曾子写入道统故事时，请用谨慎动词把那些主张标为后学传统。宁可沉默，也不要编造《论语》句子——或伪称碑证——去补别人的图表。",
        answerEn: "You should say no, flatly. Li Ren 4.15 shows only receive-and-restate; it does not print a later lineage diagram. When later readers place Zeng Zi in 道统 stories, label those claims as later tradition with cautious verbs. Prefer silence over inventing Analects quotes—or forging a stele—to complete someone else’s chart.",
      },
      {
        questionZh: "这和忠恕／reciprocity 那篇有何不同？",
        questionEn: "How is this different from the Zhongshu / reciprocity Note?",
        answerZh: "你用那篇弄清忠恕跨章含义；你用本篇看曾子作为传述者——谁承接、谁复述、后学如何把他记成一环。姐妹篇另覆盖人物勾勒与语录目录。请你守住一页一意图，近义页才不互相吞噬彼此的检索问法。",
        answerEn: "You use that Note for what 忠恕 means across chapters; you use this Note for Zeng Zi as transmitter—who receives, restates, and is later remembered as a link. Soft siblings cover the person sketch and the sayings catalog elsewhere. One intent per URL stops near pages from cannibalizing each other’s questions.",
      },
      {
        questionZh: "后学传统与《论语》证据该怎么分别标注？",
        questionEn: "How should you label later tradition vs Analects evidence?",
        answerZh: "你引《论语》主张时写出篇章活页地址；引道统说法时标明后学传统，并用「传统主张」一类谨慎动词。切勿把宋明叙事打扮成活页已经说过的话。证据在 4.15 之外变薄时，你的标注习惯才能挡住那种假完整。",
        answerEn: "You name the live chapter URL for Analects claims and mark 道统 talk as later tradition with cautious verbs such as “tradition claims.” Never dress a Song–Ming narrative as if the live page already said it. Your citation habit protects you from false completeness when the evidence beyond 4.15 is thin.",
      },
      {
        questionZh: "接下来该去哪读？",
        questionEn: "Where should you read next?",
        answerZh: "你应在本 FAQ 之后打开里仁 4.15，直接读那一承接—复述场景，把原文、白话导读与 Legge 并排对照来读。先问你在承接什么、又只在复述什么。然后请停在已发布的篇章上，而不是停在任何编造证明的顺口传述履历里。",
        answerEn: "You should open Li Ren 4.15 after this FAQ for the receive-and-restate scene itself, with source, guide, and Legge side by side on one page. Ask what you are receiving and what you are only restating. Then stop on the published chapter rather than on any smoother transmission résumé that invents proof.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读里仁 4.15",
        headingEn: "Read Le Jin 4.15 next",
        bodyZh: [
          "当你准备读曾子作为传述者最清楚的《论语》门，请打开[论语 · 里仁 4.15](https://www.lunyu.ai/zh-Hans/analects/li-ren/li-ren-015)，看他如何承接一贯并复述为忠恕。你问问自己：你在承接什么，又只在复述什么——然后回到活页，而不是回到一张声称比页上更多的后学图表。",
        ],
        bodyEn: [
          "When you are ready for the clearest Analects door on Zeng Zi as transmitter, open [The Analects · Le Jin 4.15](https://www.lunyu.ai/en/analects/li-ren/li-ren-015) and watch him receive the one-thread and restate it as 忠恕. Ask what you are receiving and what you are only restating—then return to the live text rather than to a later chart that claims more than the page prints.",
        ],
      },
    ],
  },
  {
    slug: "zi-xia-in-the-analects",
    titleZh: "《论语》里的子夏是谁？",
    titleEn: "Who Was Zi Xia in the Analects?",
    dekZh: "你搜「子夏」或 zi xia 时，多半是想在一串弟子名里把他安顿下来。在本站，你遇见他，是子夏（卜商）——先进篇列在文学一科的弟子，又以事贤、事亲、事君与交友界定何谓学。你不必先读弟子传；你可以直接打开他出现的篇章，看夫子怎样回答他。",
    dekEn: "When you search \"zi xia\" or \"zixia,\" you usually want one disciple placed among many names. On this site you meet him as Zi Xia (子夏 / Bu Shang / Tsze-hsia)—the student listed under literary study, who defines learning by conduct toward the worthy, parents, prince, and friends. You do not need a Wikipedia résumé first; you can read the passages where he speaks and notice how the Master answers him.",
    descriptionZh: "《论语》里的子夏：先进篇列在文学一科的弟子，又以事贤、事亲、事君与交友界定何谓学。链回可核对的原文。",
    descriptionEn:
      "Zi Xia in the Analects: the disciple listed under literary study, who defines learning by conduct toward the worthy, parents, prince, and friends.",
    datePublished: "2026-09-24",
    dateModified: "2026-09-24",
    tagsZh: ["子夏", "卜商", "学而"],
    tagsEn: ["zi xia", "Zi Xia", "Hsio R"],
    related: [
      "/analects/xue-er/xue-er-007",
      "/index/zi-xia",
      "/analects/yong-ye/yong-ye-011",
      "/blogs/learning-practice-and-review",
    ],
    cover: notesBlogImage(
      "zi-xia-in-the-analects",
      "cover.jpg",
      "Open scrolls and a quiet reading desk — Zi Xia, the literary disciple who ties learning to conduct",
      "展开的简册与安静书案——子夏，以文学见称并以行止界定何谓学",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "zi-xia-in-the-analects",
        "inline-1.jpg",
        "A spare desk with a sealed letter and a plain cup — honor the worthy, serve parents and prince, keep friends' words sincere",
        "素净书案上的信函与素杯——贤贤易色，事亲事君，交友有信",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "zi-xia-in-the-analects",
        "inline-2.jpg",
        "Morning light on a scholar's mat and open book — be a junzi scholar, not a petty one",
        "晨光落在书席与展开的册页——女为君子儒，无为小人儒",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认人，不靠履历表",
        headingEn: "Place him by the passages, not by a résumé",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，人物索引把他标为[子夏](https://www.lunyu.ai/zh-Hans/index/zi-xia)——孔门弟子，重视文学、礼学与学习次第。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与英译分开放，拒绝发明活页上没有的句子。把索引当门牌，而不是替你读完的终稿。",
        ],
        bodyEn: [
          "If you want a compact entry before you open each chapter page, the people index labels him simply as [Zi Xia](https://www.lunyu.ai/en/index/zi-xia)—a disciple remembered for literary study, ritual order, and the sequence of learning. That line is enough for you to start: follow the linked scenes, keep source text, guide, and English translation in their layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished essay that replaces reading.",
        ],
      },
      {
        headingZh: "用怎样待人，来衡量你是否已学",
        headingEn: "Learning measured by how you treat people",
        imageSlot: "inline-1",
        bodyZh: [
          "学而 1.7 里，你听见子夏自己界定何谓已学。原文是：贤贤易色，事父母，能竭其力，事君，能致其身，与朋友交，言而有信，虽曰未学，吾必谓之学矣。活页白话导读写：尊重贤德而不只看重容貌；侍奉父母能竭尽自己的力量；侍奉君主能献出自己的身心；和朋友交往说话守信用——这样的人，即使说没有学过，我也一定说他已经学过了。你可以把这份清单读成「贤贤易色」与忠信践履的门，而不是一句口号，好把同页原文换掉。当你问自己「学了没有」，先核对这些关系，再核对自己的书单。",
        ],
        bodyEn: [
          "In Hsio R. 1.7 you hear Tsze-hsia himself define what counts as having learned. Legge’s public-domain English on the live page says: if a man withdraws his mind from the love of beauty, and applies it as sincerely to the love of the virtuous; if, in serving his parents, he can exert his utmost strength; if, in serving his prince, he can devote his life; if, in his intercourse with his friends, his words are sincere—although men say that he has not learned, I will certainly say that he has. You can take that list as a door about 贤贤易色 and loyal practice—not as a slogan that lets you skip the Chinese source on the same page. When you ask whether you have “learned,” check these relations before you check a reading list alone.",
        ],
      },
      {
        headingZh: "列在文学一科——也轻提绘事后素",
        headingEn: "Listed under literary study—and opening the Odes",
        bodyZh: [
          "别处，先进 11.2 里，你看见子夏与子游同列文学，旁边另有德行、言语、政事诸科。你可以把这当作传统记住的长项地图，而不是一张成绩单，好把后面更难的场面一笔勾销。轻轻提一句：八佾 3.8 里，他也与夫子由「绘事后素」打开诗礼的对谈——先有素地，后施文采——你不必在这篇人物笔记里重写整部《诗》。当你把他和那些名字并读时，不妨问：你自己的「文学」标签，在待贤与事亲拆开时要付什么代价。",
        ],
        bodyEn: [
          "Elsewhere, in Hsien Tsin 11.2, you see Zi Xia named with Zi You under literary acquirements, beside other pairs for virtuous practice, speech, and administration. You may hold that as a map of strengths the tradition remembered—not as a grade sheet that cancels harder scenes. Lightly, in Ba Yi 3.8, you also meet him opening the Odes with Confucius through the 绘事后素 exchange—illustration after the plain ground—without needing a separate essay that rewrites every poem line here. When you set him next to those names, ask what your own “literary” label costs when conduct toward the worthy and the household falls apart.",
        ],
      },
      {
        headingZh: "女为君子儒，无为小人儒",
        headingEn: "Be a junzi scholar, not a petty one",
        imageSlot: "inline-2",
        bodyZh: [
          "若你想给同一位弟子再开一扇活页门，可打开一次[论语 · 雍也 6.11](https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-011)。那里子曰：女为君子儒，无为小人儒。活页导读写：你要做君子式的儒者，不要做小人式的儒者。你该把这读成对「怎么学」的校正，而不是把本站另篇「君子是什么」的专文整篇搬进来。把人物场景与概念专文分开：一边是房间里被点名的子夏，一边是跨章拆读的「君子」一词。",
        ],
        bodyEn: [
          "If you want a second live door on the same disciple, open [The Analects · Yung Yey 6.11](https://www.lunyu.ai/en/analects/yong-ye/yong-ye-011) once. There the Master says to Tsze-hsia: do you be a scholar after the style of the superior man, and not after that of the mean man. The live Chinese guide puts it as 女为君子儒，无为小人儒. You should read that as a check on how you study—not as a rewrite of this site’s separate Note on what a junzi is. Keep the person scene and the concept essay apart: one names Zi Xia in the room; the other unpacks the junzi word across many chapters.",
        ],
      },
      {
        headingZh: "不是学而时习重写——也不是曾子那扇门",
        headingEn: "Not a learning-method rewrite—and not Zengzi’s door",
        bodyZh: [
          "检索时你也可能撞上「学而时习」方法笔记，或曾子／忠恕专文。那些词簇可以在「学习」或别的弟子名字旁出现，却不是本篇的任务。你应把子夏是谁、以及学而 1.7 怎样算「已学」，留作主意图。你不要把他并进方法文，也不要并进另一位弟子的忠恕拆读。",
        ],
        bodyEn: [
          "Search may also surface notes on practice-and-review or on Zengzi / zhongshu. Those clusters can sit near “learning” or near other disciples in Latin letters, but they are not this Note’s job. You should keep Zi Xia’s identity and Hsio R. 1.7 as the main intent: who he is, and how he counts someone as already learned. Do not merge him into a method essay or into another disciple’s reciprocity teaching.",
        ],
      },
      {
        headingZh: "你该怎样引用他",
        headingEn: "How you should cite him",
        bodyZh: [
          "当你引用子夏，或夫子对子夏说话，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。你可以轻提「zi xia」一类检索意图，但不要发明活页没有给出的展示次数或传记年份。你的诚实落在篇章页上，而不在更顺口却无出处的改写里。",
        ],
        bodyEn: [
          "When you quote Zi Xia or Confucius addressing him, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. You can mention search interest for “zi xia” lightly if needed, but you should never invent impression counts or biography dates the live pages do not give. Your honesty is the passage page, not a smoother paraphrase that invents a saying.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的子夏是谁？",
        questionEn: "Who was Zi Xia in the Analects?",
        answerZh: "你在《论语》里遇见的子夏（卜商；Legge 亦作 Tsze-hsia），是先进篇列在文学、又以事贤事亲事君交友界定何谓学、并被告诫要做君子儒的弟子。你最好的答案是这些场景与人物索引，而不是文本外编造的履历。你先把人扣回活页章句。",
        answerEn: "You meet Zi Xia (子夏; Bu Shang; Tsze-hsia in Legge) as the disciple listed under literary study, who defines learning by honor for the virtuous, filial strength, devoted service, and sincere friendship, and who is told to be a junzi scholar. Your best answer is those scenes and the people index, not a modern résumé invented outside the text.",
      },
      {
        questionZh: "为什么有人搜「子夏」或 zi xia？",
        questionEn: "Why do people search \"zi xia\" or \"zixia\"?",
        answerZh: "你往往想先弄清身份：是哪位弟子、哪次文学分科、哪句「虽曰未学，吾必谓之学矣」。搜到这些写法之后，请打开活页章句，而不要依赖一篇会捏造章号或软化原话的摘要。你把原文、白话导读与英译分层来读，阅读才站得住。",
        answerEn: "You often want a clear identity: which disciple, which literary placement, which line that says someone has already learned. Search those spellings, then open the live passages rather than a summary that invents chapter numbers or softens the wording. Your reading stays honest when you keep source, vernacular guide, and English in separate layers.",
      },
      {
        questionZh: "「贤贤易色」在他这句话里指什么？",
        questionEn: "What does 贤贤易色 mean in his saying?",
        answerZh: "你听见子夏说：把心思从好色转向尊贤，再以竭力事亲、致身事君、交友有信来衡量。你把它握住为对「已学」的行止检验，而不是现代恋爱技巧。你的下一步是学而那一章活页，而不是贴到每份鸡汤清单上的口号。",
        answerEn: "You hear Tsze-hsia urge sincere honor for the virtuous over love of beauty, then serving parents, prince, and friends with strength and sincerity. Hold that as a conduct test of learning, not as a modern dating tip. Your next step is the live Hsio R. page, not a slogan on every self-help list.",
      },
      {
        questionZh: "为什么先进 11.2 把他放在文学一科？",
        questionEn: "Why is he linked with literary study in 先进 11.2?",
        answerZh: "你看见他与子游同列文学，旁边另有德行、言语、政事诸科。请把这当作传统记住的长项地图，而不是一张可勾销难章的成绩单。你也可轻记八佾 3.8「绘事后素」的诗礼对谈，却不必把本篇写成整部《诗》的疏解。",
        answerEn: "You see him named with Zi You under literary acquirements beside other disciple pairs. Treat that as a remembered strength map, not a score that cancels harder scenes. You may also recall the light Odes exchange of 绘事后素 in Ba Yi 3.8 without turning this Note into a full Book of Songs commentary.",
      },
      {
        questionZh: "雍也 6.11 的「君子儒」是什么？",
        questionEn: "What is 君子儒 in Yung Yey 6.11?",
        answerZh: "你听见夫子要子夏做君子式的儒者，不要做小人式的儒者。请贴着原文与导读，把它读成对学者姿态的校正。你不是在重写本站「君子」定义专文——你是在听针对这位弟子的一句嘱咐，并回到活页核对措辞。",
        answerEn: "You hear the Master tell Tsze-hsia to be a scholar after the superior man’s style, not the mean man’s. Read that as a check on scholarly posture beside the Chinese source. You are not rewriting the site’s junzi definition Note—you are hearing one instruction aimed at this disciple.",
      },
      {
        questionZh: "这和「学而时习」那篇是一回事吗？",
        questionEn: "Is this the same as the learning-practice Note?",
        answerZh: "你想到《论语》里的「学」时，可能落到学而时习方法笔记——那是本站别处已覆盖的另一意图。请把子夏留在学而 1.7 发言、雍也 6.11 被嘱咐的人。你的习惯应是一页一意图：这边是弟子人物笔记，那边是方法文，不要并稿。",
        answerEn: "You may land on practice-and-review essays when you think about “learning” in the Analects—that is a different intent already covered elsewhere. Keep Zi Xia as the person who speaks in Hsio R. 1.7 and is addressed in Yung Yey 6.11. Your habit should be one intent per page: disciple Note here, method essay there.",
      },
      {
        questionZh: "怎样避免 AI 编造子夏语录？",
        questionEn: "How do you keep AI from inventing Zi Xia quotes?",
        answerZh: "若你用模型当阅读助手，应粘贴活页原文再追问，而不是在没有出处时问「子夏一定还说过什么」。你应一律拒绝新捏造的《论语》句子。你的核验路径始终是本站已发布的篇章地址，lunyu.ai，而不是任何摘要改写。",
        answerEn: "If you use a model as a reading aid, you should paste the live passage text and ask for questions, not for “what Zi Xia must have added” without a source. Always refuse any newly minted Analects line. Your verification path is always the published chapter URL on this site, lunyu.ai.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读学而 1.7",
        headingEn: "Read Hsio R. 1.7 next",
        bodyZh: [
          "当你准备读子夏怎样把「已学」扣回尊贤、事亲、事君与交友最清楚的一扇门，请打开[论语 · 学而 1.7](https://www.lunyu.ai/zh-Hans/analects/xue-er/xue-er-007)，把原文、白话导读与英译并排对照。你问问自己：在你自己的「学」里，这些关系还叫得出名字吗——然后停住，回到活页文本，而不是回到一篇子夏摘要。",
        ],
        bodyEn: [
          "When you are ready for the clearest door on how Zi Xia counts someone as already learned, open [The Analects · Hsio R. 1.7](https://www.lunyu.ai/en/analects/xue-er/xue-er-007) and read source, guide, and Legge side by side. Ask yourself which relations—worthy, parents, prince, friends—still name your own “learning”—then stop, and return to the live text rather than to a summary of the disciple.",
        ],
      },
    ],
  },
  {
    slug: "zhong-gong-in-the-analects",
    titleZh: "《论语》里的仲弓是谁？",
    titleEn: "Who Was Zhong Gong in the Analects?",
    dekZh: "你搜「仲弓」或 zhong gong 时，多半是想在一串弟子名里把他安顿下来。在本站，你遇见他，是冉雍（仲弓）——夫子说雍也可使南面，他又追问居敬而行简，并在别处问仁。你不必先读弟子传；你可以直接打开他出现的篇章，看夫子怎样回答他。",
    dekEn: "When you search \"zhong gong,\" you are usually trying to place one disciple among many names. On this site you meet him as Ran Yong (仲弓 / Chung-kung)—the student Confucius says might face south as a prince, who asks about simplicity in rule and later about ren. You do not need a Wikipedia résumé first; you can read the passages where he speaks and notice how the Master answers him.",
    descriptionZh: "《论语》里的仲弓：夫子说雍也可使南面，他又追问居敬而行简，并在别处问仁。链回可核对的原文。",
    descriptionEn:
      "Zhong Gong in the Analects: the disciple Confucius says might face south as a prince, who argues for reverence with simplicity and later asks about ren.",
    datePublished: "2026-09-23",
    dateModified: "2026-09-23",
    tagsZh: ["仲弓", "冉雍", "雍也"],
    tagsEn: ["zhong gong", "Zhong Gong", "Yung Yey"],
    related: [
      "/analects/yong-ye/yong-ye-001",
      "/index/zhong-gong",
      "/analects/yan-yuan/yan-yuan-002",
      "/blogs/zhongshu-reciprocity-in-the-analects",
    ],
    cover: notesBlogImage(
      "zhong-gong-in-the-analects",
      "cover.jpg",
      "An empty south-facing seat open to misted hills — Zhong Gong, who might face south as a prince",
      "空置南面之席临向雾山——仲弓，雍也可使南面",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "zhong-gong-in-the-analects",
        "inline-1.jpg",
        "Incense and a spare desk with brush and paper — reverence within, simplicity in practice",
        "一炷清香与素净书案笔纸——居敬而行简",
        { width: 1200, height: 1200 }
      ),
      "inline-2": notesBlogImage(
        "zhong-gong-in-the-analects",
        "inline-2.jpg",
        "An open doorway and a ready mat — go out as if receiving a great guest",
        "门开向晓与待客之席——出门如见大宾",
        { width: 1200, height: 1200 }
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认人，不靠履历表",
        headingEn: "Place him by the passages, not by a résumé",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，人物索引把他标为[仲弓](https://www.lunyu.ai/zh-Hans/index/zhong-gong)——孔门弟子，围绕仁、政、德性受孔子称许。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与英译分开放，拒绝发明活页上没有的句子。把索引当门牌，而不是替你读完的终稿。",
        ],
        bodyEn: [
          "If you want a compact entry before you open each chapter page, the people index labels him simply as [Zhong Gong](https://www.lunyu.ai/en/index/zhong-gong)—a disciple praised in discussions of ren, government, and character. That line is enough for you to start: follow the linked scenes, keep source text, guide, and English translation in their layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished essay that replaces reading.",
        ],
      },
      {
        headingZh: "可使南面——也争「居敬而行简」",
        headingEn: "Facing south—and arguing for reverence with simplicity",
        imageSlot: "inline-1",
        bodyZh: [
          "雍也 6.1 里，夫子先称许：子曰，雍也可使南面。活页白话导读写：冉雍这个人，可以让他去做诸侯，面向南治理百姓。接着仲弓问子桑伯子；子曰，可也，简。仲弓把你该握住的分际说清楚：居敬而行简，以临其民，不亦可乎，居简而行简，无乃大简乎。子曰，雍之言然。你可以把这场读成「内里敬慎、行事简约」的门，而不是文本外编造的现代减负口号。",
        ],
        bodyEn: [
          "In Yung Yey 6.1 the Master opens with praise. Legge’s public-domain English on the live page says: there is Yung—he might occupy the place of a prince. Then Chung-kung asks about Tsze-sang Po-tsze; the Master says he may pass—he does not mind small matters. Chung-kung presses the distinction you should keep: if a man cherishes in himself a reverential feeling of the necessity of attention to business, though he may be easy in small matters in his government of the people, that may be allowed—but if he cherishes that easy feeling and also carries it out in practice, is not such an easy mode of procedure excessive? The Master answers that Yung’s words are right. You can take that exchange as a door about 居敬而行简—reverence held inside, brevity held in action—not as a modern management slogan invented outside the text.",
        ],
      },
      {
        headingZh: "列在德行一科",
        headingEn: "Listed under virtuous practice",
        bodyZh: [
          "别处，先进 11.2 里，你看见仲弓与颜渊、闵子骞、冉伯牛同列德行，旁边另有言语、政事、文学诸科。你可以把这当作传统记住的长项地图，而不是一张成绩单，好把后面更难的场面一笔勾销。当你把他和那些名字并读时，不妨问：你自己的「德行标签」，在敬与简拆开时要付什么代价。",
        ],
        bodyEn: [
          "Elsewhere, in Hsien Tsin 11.2, you see Zhong Gong named with Yen Yuan, Min Tsze-ch’ien, and Zan Po-niu under virtuous principles and practice, beside other pairs for speech, administration, and literary acquirements. You may hold that as a map of strengths the tradition remembered—not as a grade sheet that cancels harder scenes. When you set him next to those names, ask what your own “virtue label” costs when reverence and simplicity fall apart.",
        ],
      },
      {
        headingZh: "他问仁的那一场",
        headingEn: "When he asks about ren",
        imageSlot: "inline-2",
        bodyZh: [
          "若你想给同一位弟子再开一扇活页门，可打开一次[论语 · 颜渊 12.2](https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-002)。那里仲弓问仁。夫子说：出门如见大宾，使民如承大祭，己所不欲，勿施于人，在邦无怨，在家无怨。仲弓答：雍虽不敏，请事斯语矣。活页导读写：出门办事要像接待贵宾一样恭敬，役使百姓要像承办重大祭祀一样慎重；自己不愿意要的，不要强加给别人。你该把这读成可操练的行止，而不是一张贴纸，好把同页原文换掉。",
        ],
        bodyEn: [
          "If you want a second live door on the same disciple, open [The Analects · Yen Yuan 12.2](https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-002) once. There Chung-kung asks about perfect virtue. Legge on the live page gives the Master’s reply: when you go abroad, behave to every one as if you were receiving a great guest; employ the people as if you were assisting at a great sacrifice; not to do to others as you would not wish done to yourself; have no murmuring against you in the country, and none in the family. Chung-kung answers that though deficient in intelligence and vigour, he will make it his business to practise this lesson. You should read that as conduct you can rehearse, not as a sticker that replaces the Chinese source on the same page.",
        ],
      },
      {
        headingZh: "不是忠恕——音近，门不同",
        headingEn: "Not zhongshu—same sound, different door",
        bodyZh: [
          "检索时你也可能撞上忠恕／zhongshu——本站已另有笔记专讲这对方法词。拉丁字母里它和「zhong gong」音近，却不是这位弟子。你应把人物索引与忠恕专文分开：一边是房间里的冉雍，一边是忠与恕的拆读。你不要把它们并成一篇履历。",
        ],
        bodyEn: [
          "Search may also surface 忠恕 / zhongshu—loyalty-and-reciprocity as a paired teaching already covered in its own Note on this site. That cluster sounds near “zhong gong” in Latin letters, but it is not this disciple. You should keep the person index and the zhongshu essay apart: one names Ran Yong in the room; the other unpacks a method-word pair. Do not merge them into one résumé.",
        ],
      },
      {
        headingZh: "你该怎样引用他",
        headingEn: "How you should cite him",
        bodyZh: [
          "当你引用孔子论仲弓，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。你可以轻提检索意图，但不要发明活页没有给出的展示次数或传记年份。你的诚实落在篇章页上，而不在更顺口却无出处的改写里。",
        ],
        bodyEn: [
          "When you quote Confucius on Zhong Gong, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. You can mention search interest lightly if needed, but you should never invent impression counts or biography dates the live pages do not give. Your honesty is the passage page, not a smoother paraphrase that invents a saying.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的仲弓是谁？",
        questionEn: "Who was Zhong Gong in the Analects?",
        answerZh: "你在《论语》里遇见的仲弓（冉雍；Legge 亦作 Chung-kung），是夫子说可使南面、又争居敬而行简、并在别处问仁的弟子。你最好的答案是这些场景与人物索引，而不是文本外编造的现代履历。你先把人扣回活页章句，再谈别的。",
        answerEn: "You meet Zhong Gong (仲弓; also Ran Yong / Chung-kung in Legge) as the disciple Confucius says might occupy a prince’s place, who argues for reverence with simplicity, and who later asks about ren. Your best answer is those scenes and the people index, not a modern résumé invented outside the text.",
      },
      {
        questionZh: "为什么有人搜「仲弓」或 zhong gong？",
        questionEn: "Why do people search \"zhong gong\" or \"zhonggong\"?",
        answerZh: "你往往想先弄清身份：是哪位弟子、哪次「南面」称许、哪场问仁。搜到这些写法之后，请打开活页章句，而不要依赖一篇会捏造章号或软化夫子原话的摘要。你把原文、白话导读与英译分层来读，阅读才站得住。",
        answerEn: "You often want a clear identity: which disciple, which “face south” praise, which ren dialogue. Search those spellings, then open the live passages rather than a summary that invents chapter numbers or softens the Master’s words. Your reading stays honest when you keep source, vernacular guide, and English in separate layers.",
      },
      {
        questionZh: "「雍也可使南面」在这里指什么？",
        questionEn: "What does 雍也可使南面 mean here?",
        answerZh: "你听见夫子点名雍可使南面——活页导读写他可以去做诸侯、面向南治理百姓。你把它握住为夫子所见的器局，而不是你替他编造的官衔。你的下一步是雍也那一章活页，而不是贴到每场领导力演讲上的口号。",
        answerEn: "You hear Confucius name Yung as someone who might face south—Legge’s layer says he might occupy the place of a prince. Hold that as capacity the Master saw, not as a job title you invent for him. Your next step is the live Yung Yey page, not a slogan you paste onto every leadership talk.",
      },
      {
        questionZh: "他那场对话里的「居敬而行简」是什么？",
        questionEn: "What is 居敬而行简 in his exchange?",
        answerZh: "你听见仲弓把内里的敬慎，与「心里随便又行事简约」拆开；夫子肯定他的说法。你把它读成对忘掉敬的「简」的校正。你不该把对话压扁成一句「砍流程」，却丢掉活页仍保留的敬那一半。请回到雍也原文核对措辞。",
        answerEn: "You hear Chung-kung split reverence held inside from careless ease that also drives practice; the Master affirms his wording. Read that as a check on “simple” that forgot respect. You should not flatten the dialogue into “cut red tape” without the reverence half the live Yung Yey page keeps visible beside Legge.",
      },
      {
        questionZh: "他问仁的那章怎样扣回来？",
        questionEn: "How does his ren question fit?",
        answerZh: "你又在颜渊篇遇见他问仁；答复走的是见大宾、承大祭、己所不欲勿施于人，以及邦家无怨。请把这份清单贴着原文来练。你不是在读第二篇弟子传——你是在听同一位学生追问可实行的规矩，并说请事斯语。",
        answerEn: "You meet him again asking about perfect virtue; the reply walks guest-rite gravity, careful use of the people, and not doing to others as you would not wish done to yourself. Practise that list beside the Chinese source. You are not reading a second disciple biography—you are hearing the same student press for a workable rule.",
      },
      {
        questionZh: "他和忠恕是一回事吗？",
        questionEn: "Is he the same as zhongshu?",
        answerZh: "你用相近拉丁字母检索时，可能落到忠恕专文——那是本站别处已覆盖的另一词簇。请把仲弓留在雍也与颜渊里被点名的人。你的习惯应是一页一意图：这边是弟子人物笔记，那边是忠恕拆读，不要并稿。",
        answerEn: "You may land on 忠恕 notes when you type similar Latin letters—that is a different concept cluster already covered elsewhere on this site. Keep Zhong Gong as the person named in Yung Yey and Yen Yuan. Your habit should be one intent per page: disciple Note here, reciprocity essay there.",
      },
      {
        questionZh: "怎样避免 AI 编造仲弓语录？",
        questionEn: "How do you keep AI from inventing Zhong Gong quotes?",
        answerZh: "若你用模型当阅读助手，应粘贴活页原文再追问，而不是在没有出处时问「孔子一定还对冉雍说过什么」。你应一律拒绝新捏造的《论语》句子。你的核验路径始终是本站已发布的篇章地址，lunyu.ai，而不是摘要改写。",
        answerEn: "If you use a model as a reading aid, you should paste the live passage text and ask for questions, not for “what Confucius must have added about Ran Yong” without a source. Always refuse any newly minted Analects line. Your verification path is always the published chapter URL on this site, lunyu.ai.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读雍也 6.1",
        headingEn: "Read Yung Yey 6.1 next",
        bodyZh: [
          "当你准备读仲弓「可使南面」与「居敬而行简」最清楚的一扇门，请打开[论语 · 雍也 6.1](https://www.lunyu.ai/zh-Hans/analects/yong-ye/yong-ye-001)，把原文、白话导读与英译并排对照。你问问自己：在你自己的简省里，敬还托在哪里——然后停住，回到活页文本，而不是回到一篇仲弓摘要。",
        ],
        bodyEn: [
          "When you are ready for the clearest door on Zhong Gong’s south-facing praise and the dialogue on reverence with simplicity, open [The Analects · Yung Yey 6.1](https://www.lunyu.ai/en/analects/yong-ye/yong-ye-001) and read source, guide, and Legge side by side. Ask yourself where ease in your own practice still rests on reverence—then stop, and return to the live text rather than to a summary of the disciple.",
        ],
      },
    ],
  },
  {
    slug: "duke-ling-of-wei-in-the-analects",
    titleZh: "《论语》里的卫灵公是谁？",
    titleEn: "Who Was Duke Ling of Wei in the Analects?",
    dekZh:
      "你搜「卫灵公」或 Duke Ling of Wei 时，多半是想在《论语》一串国君名里把他安顿下来。在本站，你遇见他，是因为孔子点出他的无道——卫却不丧，只因宾客、宗庙、军旅各有能臣分守。你不必先读王侯传；你可以直接读宪问 14.20，看职守如何托国。",
    dekEn:
      'When you search "duke ling of wei," you usually want one Wei ruler placed among many names in the Analects. On this site you meet him where Confucius names his unprincipled course (无道)—yet Wei does not fall, because officers hold guest rites, the ancestral temple, and the army. You do not need a Wikipedia résumé first; you can read Hsien Wan 14.20 and notice how capable posts keep a state standing.',
    descriptionZh: "《论语》里的卫灵公：孔子点出他的无道——卫却不丧，只因宾客、宗庙、军旅各有能臣分守。链回可核对的原文。",
    descriptionEn:
      "Duke Ling of Wei in the Analects: Confucius names an unprincipled course—yet Wei does not fall, because officers hold guest rites, the ancestral temple, and the army.",
    datePublished: "2026-09-22",
    dateModified: "2026-09-22",
    tagsZh: ["卫灵公", "宪问", "无道"],
    tagsEn: ["duke ling of wei", "Duke Ling of Wei", "Hsien Wan"],
    related: [
      "/analects/xian-wen/xian-wen-020",
      "/index/wei-ling-gong-person",
      "/analects/wei-ling-gong/wei-ling-gong-001",
      "/blogs/duke-ai-of-lu-in-the-analects",
      "/blogs/duke-ding-of-lu-in-the-analects",
    ],
    cover: notesBlogImage(
      "duke-ling-of-wei-in-the-analects",
      "cover.jpg",
      "A Wei court seat facing quiet officer posts — Duke Ling named where the state holds by capable men",
      "卫廷空席对向素净职守——宪问点名卫灵公，国不丧于能臣分守",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "duke-ling-of-wei-in-the-analects",
        "inline-1.jpg",
        "A dim ruler’s seat beside three upright posts of office — “no Way,” yet the state does not fall",
        "昏暗君席旁三根直立职守之柱——「无道」而国不丧",
        { width: 1280, height: 720 }
      ),
      "inline-2": notesBlogImage(
        "duke-ling-of-wei-in-the-analects",
        "inline-2.jpg",
        "A closed volume beside a separate name seal — Book 15’s title words vs the person Duke Ling",
        "合上的线装册旁另置名印空白——第十五篇书名与人物卫灵公之别",
        { width: 1280, height: 720 }
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认人，不靠王侯履历",
        headingEn: "Place him by the passage, not by a royal résumé",
        bodyZh: [
          "若你想在打开篇章之前先有一个入口，人物索引把他标为[卫灵公](https://www.lunyu.ai/zh-Hans/index/wei-ling-gong-person)——《论语》中因无道被点名、却因能臣分守而不丧的卫国国君。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与英译分开放，拒绝发明活页上没有的句子。把索引当门牌，而不是替你读完的终稿。",
        ],
        bodyEn: [
          "If you want a compact entry before you open the chapter page, the people index labels him as [Duke Ling of Wei](https://www.lunyu.ai/en/index/wei-ling-gong-person)—the Wei ruler named in the Analects for an unprincipled course that still does not topple the state. That line is enough for you to start: follow the linked scene, keep source text, guide, and English translation in their layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished essay that replaces reading.",
        ],
      },
      {
        headingZh: "「无道」却不丧",
        headingEn: "Unprincipled course—yet the state does not fall",
        imageSlot: "inline-1",
        bodyZh: [
          "宪问 14.20 里，子言卫灵公之无道。康子问：夫如是，奚而不丧。孔子答：仲叔圉治宾客，祝𬶍治宗庙，王孙贾治军旅——夫如是，奚其丧。活页导读写：孔子谈到卫灵公的昏庸无道；有仲叔圉负责宾客，祝鮀负责宗庙，王孙贾统率军队，故不丧。你可以把这扇门读成「职守是否有人」，而不是替昏君辩解，也不是文本外编造的现代编制表。引用时，请把原文与导读里的祝𬶍／祝鮀按活页所见分层标明，不要另造第三种写法。",
        ],
        bodyEn: [
          "In Hsien Wan 14.20 the Master speaks of Duke Ling’s unprincipled course. Ji Kangzi asks: if he is like that, why has he not lost the state? Confucius answers by naming three officers: Zhongshu Yu (仲叔圉) manages guests and strangers; the litanist Tuo (祝𬶍 on the live source; the guide writes 祝鮀) manages the ancestral temple; Wangsun Jia (王孙贾) manages the army. With posts filled like that, Confucius asks, how could the state fall? You can take that as a door about roles that hold a polity—not as praise of a bad ruler, and not as a modern org-chart invented outside the text.",
          "Legge’s public-domain English matches the same frame: the unprincipled course of duke Ling of Wei; Chung-shu Yu over guests; the litanist T’o over the temple; Wang-sun Chia over the army. When you cite the scene later, keep the Chinese source visible beside the English layer on the same live page. Your honesty is the published wording, not a smoother paraphrase that invents a saying.",
        ],
      },
      {
        headingZh: "书名与人物",
        headingEn: "Book title vs the person",
        imageSlot: "inline-2",
        bodyZh: [
          "别处你还会打开第十五篇，传统书名以「卫灵公」起首——那是篇首字，不是人物传。若你只要一次轻消歧，可看一眼[论语 · 卫灵公 15.1](https://www.lunyu.ai/zh-Hans/analects/wei-ling-gong/wei-ling-gong-001)，再回到这里读宪问里的人。你不是在读第二篇履历；你是在把书名用字与人物索引分开，免得搜到一锅粥。",
        ],
        bodyEn: [
          "Elsewhere you may open Book 15, whose traditional title begins with Wei Ling Kung—the opening words of that book, not a biography of the duke. If you only need that light disambiguation, glance once at [The Analects · Wei Ling Kung 15.1](https://www.lunyu.ai/en/analects/wei-ling-gong/wei-ling-gong-001), then return here for the person named in 14.20. You are not reading a second résumé; you are keeping book-title words and the person index from collapsing into one search blob.",
        ],
      },
      {
        headingZh: "不是鲁哀公，也不是鲁定公",
        headingEn: "Not Duke Ai, not Duke Ding",
        bodyZh: [
          "书中别处你还会遇见鲁哀公或鲁定公——不同的国君，不同的问法。这篇笔记只停在卫灵公。若你只要一次鲁侧轻门，可打开一次[《论语》里的鲁哀公是谁？](https://www.lunyu.ai/zh-Hans/blogs/duke-ai-of-lu-in-the-analects)，再回到这里。你不该把他们并成一篇「《论语》诸公合传」；需要时，请把每个名字扣回各自的活页章句。",
        ],
        bodyEn: [
          "Elsewhere in the book you may meet Duke Ai of Lu or Duke Ding of Lu—different rulers, different questions. This Note stays with Duke Ling of Wei alone; it is not a multi-duke biography and it does not retell their separate scenes. If you only need a light Lu-side door, open [Who Was Duke Ai of Lu in the Analects?](https://www.lunyu.ai/en/blogs/duke-ai-of-lu-in-the-analects) once—then come back. You should not merge them into one “dukes of the Analects” résumé; keep each name tied to its own live passages when you need them.",
        ],
      },
      {
        headingZh: "你该怎样引用他",
        headingEn: "How you should cite him",
        bodyZh: [
          "当你引用孔子论卫灵公，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。你可以轻提检索意图，但不要发明 brief 没有给出的展示次数或历史年份。你的诚实落在篇章页上，而不在更顺口却无出处的王侯履历改写里。",
        ],
        bodyEn: [
          "When you quote Confucius on Duke Ling, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. You can mention search interest lightly if needed, but you should never invent impression counts or history dates the brief did not give. Your honesty is the passage page, not a résumé that invents court years outside the published text.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的卫灵公是谁？",
        questionEn: "Who was Duke Ling of Wei in the Analects?",
        answerZh:
          "你在《论语》里遇见的卫灵公（亦称 Duke Ling of Wei、Wei Ling Gong），是孔子点出无道、却因宾客／宗庙／军旅有能臣而不丧的卫国国君。你最好的答案是宪问那场与人物索引，而不是文本外编造的现代王侯履历。",
        answerEn:
          "You meet Duke Ling (卫灵公; also Wei Ling Gong) as the Wei ruler Confucius names for an unprincipled course—yet the state does not fall while Zhongshu Yu, the temple officer, and Wangsun Jia hold their posts. Your best answer is that 宪问 scene and the people index, not a modern royal biography invented outside the text.",
      },
      {
        questionZh: "为什么有人搜「卫灵公」或 duke ling of wei？",
        questionEn: 'Why do people search "duke ling of wei"?',
        answerZh:
          "你往往想先弄清身份：是哪一位公、哪次著名判断、哪扇篇章的门。搜到这个词之后，请打开宪问 14.20 活页，而不要依赖一篇会捏造章号或软化「无道」的摘要。你把原文、白话导读与英译分层来读，阅读才站得住。",
        answerEn:
          "You often want a clear identity: which duke, which famous judgment, which chapter door. Search that phrase, then open the live 14.20 page rather than a summary that invents chapter numbers or softens “无道.” Your reading stays honest when you keep source, vernacular guide, and English translation in separate layers.",
      },
      {
        questionZh: "「无道」却「不丧」在说什么？",
        questionEn: "What does “无道” yet “不丧” mean here?",
        answerZh:
          "你听到孔子点名无道之君，又说明国何以不丧：宾客、宗庙、军旅仍有能者分守。你要把这读成职守是否落实的教诲，而不是替恶德找借口。你的下一步是宪问那章活页，而不是贴到每个「上司昏庸」故事上的口号。",
        answerEn:
          "You hear Confucius name a ruler without the Way, then explain why the state still stands: guests, ancestral temple, and army remain in capable hands. Hold that as a teaching about filled offices, not as praise of vice. Your next step is the live Hsien Wan page, not a slogan you paste onto every weak-boss story.",
      },
      {
        questionZh: "14.20 里的三位官员是谁？",
        questionEn: "Who are the three officers in 14.20?",
        answerZh:
          "你遇见治宾客的仲叔圉、治宗庙的祝官（原文祝𬶍，导读作祝鮀）、治军旅的王孙贾——与活页导读及 Legge 层所指同一三人。你按职守来读即可。你不该发明活页没有写出的第四人或第三种拼写。",
        answerEn:
          "You meet Zhongshu Yu over guest rites, the litanist (祝𬶍 / guide 祝鮀) over the ancestral temple, and Wangsun Jia over the army—the same three names the live guide and Legge layers point to. Read them as posts that hold the state. You should not invent a fourth officer or a third spelling the published pages do not use.",
      },
      {
        questionZh: "第十五篇是在写同一个人吗？",
        questionEn: "Is Book 15 about the same person?",
        answerZh:
          "你看到的「卫灵公」也可能是书名——篇首字，不是卫灵公传。只用 15.1 把书名与人物分开，再回到 14.20 读无道与三职。你的习惯应是：一个意图一页——这里是人物笔记，那里是书名之门。",
        answerEn:
          "You may see “Wei Ling Kung” as a book title—opening words, not a bio of Duke Ling. Use 15.1 only to keep title and person apart, then return to 14.20 for the judgment about 无道 and the three posts. Your habit should be one intent per page: person Note here, book door there.",
      },
      {
        questionZh: "怎样避免把他和其他公混在一起？",
        questionEn: "How do you keep from mixing him with other dukes?",
        answerZh:
          "你在别处还可能遇见鲁哀公或鲁定公——这里只点名消歧，不开新传。当章句只写「公」时，请到人物索引核对是哪一位。你的习惯应是：一个名字，一组可链篇章，而不是合并的宫廷编年。",
        answerEn:
          "You may also meet Duke Ai of Lu or Duke Ding of Lu elsewhere—light names only here, not new biographies. When a passage says “the duke,” check the people index for which ruler it is. Your habit should be one name, one set of linked chapters, not a merged court chronicle.",
      },
      {
        questionZh: "怎样避免 AI 编造卫灵公语录？",
        questionEn: "How do you keep AI from inventing Duke Ling quotes?",
        answerZh:
          "若你用模型当阅读助手，应粘贴活页原文再追问，而不是在没有出处时问「孔子一定还对卫说过什么」。你应一律拒绝新捏造的《论语》句子。你的核验路径始终是本站已发布的篇章地址，lunyu.ai。",
        answerEn:
          "If you use a model as a reading aid, you should paste the live passage text and ask for questions, not for “what Confucius must have added about Wei” without a source. Always refuse any newly minted Analects line. Your verification path is always the published chapter URL on this site, lunyu.ai.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读宪问 14.20",
        headingEn: "Read Hsien Wan 14.20 next",
        bodyZh: [
          "当你准备打开最清楚的那扇「无道与能臣分守」之门，请打开[论语 · 宪问 14.20](https://www.lunyu.ai/zh-Hans/analects/xian-wen/xian-wen-020)，把原文、白话导读与英译并排对照。你问问自己：当主位不稳时，你托付的是哪些职守——然后停住，回到文本，而不是回到一篇卫灵公摘要。",
        ],
        bodyEn: [
          "When you are ready for the clearest door on Duke Ling’s unprincipled course and the officers who held Wei, open [The Analects · Hsien Wan 14.20](https://www.lunyu.ai/en/analects/xian-wen/xian-wen-020) and read source, guide, and Legge side by side. Ask yourself which posts you trust to hold a house when the head falters—then stop, and return to the live text rather than to a summary of the duke.",
        ],
      },
    ],
  },
  {
    slug: "yao-shun-yu-in-the-analects",
    titleZh: "《论语》里的尧、舜、禹是谁？",
    titleEn: "Who Are Yao, Shun, and Yu in the Analects?",
    dekZh:
      "你搜「尧舜禹」或「yao shun yu」时，多半是想把《论语》一再指向的三个圣王名安顿下来。在本站，你遇见尧、舜、禹，是把他们当作治道的标尺——尧则天、舜禹不与、禹无间然——而不是先读通史圣王传。你可从书打开的门读起，再回活页核对措辞。",
    dekEn:
      "When you search “yao shun yu,” “yao shun,” or “yaoshun,” you usually want to place three sage-king names the Analects keeps pointing to. On this site you meet Yao, Shun, and Yu as a measure of rule—Yao matching Heaven, Shun holding the empire as if it were nothing, Yu without flaw—not as a Wikipedia résumé of prehistoric kings. You can start from the doors the book opens, then verify every wording on the live chapter pages.",
    descriptionZh: "《论语》里的尧、舜、禹：治道标尺——尧则天、舜禹不与、禹无间然。链回可核对的原文。",
    descriptionEn:
      "Yao, Shun, and Yu in the Analects: sage kings used as a measure of rule—Yao matching Heaven, Shun and Yu holding the empire lightly, Yu without flaw.",
    datePublished: "2026-09-21",
    dateModified: "2026-09-21",
    tagsZh: ["尧舜禹", "尧", "泰伯"],
    tagsEn: ["yao shun yu", "yaoshun", "T'ai-po"],
    related: [
      "/analects/tai-bo/tai-bo-019",
      "/index/yao-shun-yu",
      "/analects/tai-bo/tai-bo-021",
      "/blogs/duke-ai-of-lu-in-the-analects",
    ],
    cover: notesBlogImage(
      "yao-shun-yu-in-the-analects",
      "cover.jpg",
      "Three quiet markers under open sky — Yao, Shun, and Yu as the Analects’ measure of rule",
      "苍穹下三处素净记号——尧、舜、禹作为《论语》里的治道标尺",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "yao-shun-yu-in-the-analects",
        "inline-1.jpg",
        "Vast sky wash above a quiet seat of rule — Yao praised as matching Heaven (Analects 8.19)",
        "苍穹淡墨下素净治席——泰伯 8.19 赞尧「唯天为大」的意象",
        NOTES_INLINE_SIZE
      ),
      "inline-2": notesBlogImage(
        "yao-shun-yu-in-the-analects",
        "inline-2.jpg",
        "Calm desk and a guided water line — Shun’s ease and Yu’s tireless care, without spectacle",
        "素案与理水细线——舜之无为与禹之无间然，而非灾异奇观",
        NOTES_INLINE_SIZE
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认人，不靠圣王履历",
        headingEn: "Place them by the passages, not by a sage-king dump",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，人物索引把他们标为[尧、舜、禹](https://www.lunyu.ai/zh-Hans/index/yao-shun-yu)——《论语》用作治道标尺的上古圣王。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与英译分开放，拒绝发明活页上没有的句子。你要把索引当成门的地图，而不是一篇可以代替阅读的完成传记。",
        ],
        bodyEn: [
          "If you want a compact entry before you open each chapter, the people index labels them as [Yao, Shun, and Yu](https://www.lunyu.ai/en/index/yao-shun-yu)—the ancient sage kings the Analects uses as a measure of rule. That line is enough for you to start: follow the linked scenes, keep source text, modern guide, and Legge’s English in their layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished biography that replaces reading.",
        ],
      },
      {
        headingZh: "书怎样用他们作治道标尺",
        headingEn: "How the book uses them as a measure of rule",
        imageSlot: "inline-1",
        bodyZh: [
          "在《泰伯》里，夫子赞尧之为君：唯天为大，唯尧则之；荡荡乎，民无能名焉，而其成功与文章巍巍焕然。你该把这读成治道的天花板——则天——而不是给某位史前国君写戏服传记。你以后引用时，请把同一活页上的原文与英译对照着看。",
          "邻近处，舜禹又以「有天下也不与」的巍巍姿态出现。书中别处还可以举舜为无为而治——恭己正南面而已；也可以称禹「吾无间然矣」：菲饮食、恶衣服、卑宫室，却尽力于沟恤。你读到的是轻松与尽心成对的标尺，而不是文本外编造的治水奇观传。",
        ],
        bodyEn: [
          "In T’ai-po the Master praises Yao as sovereign: only Heaven is grand, and only Yao corresponded to it; the people could find no name for that vastness, yet the works and elegant regulations stand majestic. You should hear that as a ceiling for rule—matching Heaven—not as a costume drama about a named prehistoric court. When you cite it later, keep the Chinese source visible beside the English layer on the same live page.",
          "Nearby, Shun and Yu appear as those who held the empire as if it were nothing to them. Elsewhere the book can instance Shun as governing without exertion—gravely occupying the royal seat—and can praise Yu as without flaw: coarse food, poor garments, a low house, yet strength poured into ditches and water-channels. You are reading a paired measure of ease and tireless care, not a flood-spectacle biography invented outside the text.",
        ],
      },
      {
        headingZh: "禹无间然",
        headingEn: "Yu without flaw",
        imageSlot: "inline-2",
        bodyZh: [
          "在活页[论语 · 泰伯 8.21](https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-021)上，你可以径直核对「禹吾无间然矣」的原文、白话导读与 Legge 英译。你不该发明活页没有写出的水利图表或英雄年表；你的诚实落在已发布的篇章地址上。",
        ],
        bodyEn: [
          "On the live page [The Analects · T'ai-po 8.21](https://www.lunyu.ai/en/analects/tai-bo/tai-bo-021), you can verify the “no flaw in Yu” wording directly—source, guide, and Legge side by side. You should not invent irrigation charts or hero dates the page does not show; your honesty is the published chapter URL.",
        ],
      },
      {
        headingZh: "不是君子通论，也不是诸公合传",
        headingEn: "Not a junzi treatise, not a multi-ruler bio",
        bodyZh: [
          "书中别处你还会遇见「尧舜其犹病诸」这一上限，或遇见发问的晚鲁国君。这篇笔记只停在尧、舜、禹作为治道标尺；它不是君子、忠恕或仁的通论重写，也不是诸公合传。若你想轻开一次晚鲁的门，可打开[《论语》里的鲁哀公是谁？](https://www.lunyu.ai/zh-Hans/blogs/duke-ai-of-lu-in-the-analects)，再回到这里看圣王标尺——两篇不要并成一篇。",
        ],
        bodyEn: [
          "Elsewhere you may meet “尧舜其犹病诸” as a limit even for Yao and Shun, or meet late Lu rulers who ask practical questions. This Note stays with Yao, Shun, and Yu as the book’s measure of rule; it is not a rewrite of junzi, zhongshu, or ren, and it is not a merged duke biography. If you want one late Lu door once, open [Who Was Duke Ai of Lu in the Analects?](https://www.lunyu.ai/en/blogs/duke-ai-of-lu-in-the-analects)—then return here for the sage-king measure, without blending the two essays.",
        ],
      },
      {
        headingZh: "你该怎样引用他们",
        headingEn: "How you should cite them",
        bodyZh: [
          "当你引用尧、舜、禹，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。你可以轻提检索意图，但不要发明 brief 没有给出的展示次数或历史年份。你的诚实落在篇章页上，而不在更顺口却无出处的改写里。",
        ],
        bodyEn: [
          "When you quote Yao, Shun, or Yu, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. You can mention search interest lightly if needed, but you should never invent impression counts or history dates the brief did not give. Your honesty is the passage page, not a smoother paraphrase that invents a saying.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的尧、舜、禹是谁？",
        questionEn: "Who are Yao, Shun, and Yu in the Analects?",
        answerZh:
          "你在《论语》里遇见的尧、舜、禹（亦检索为 yao shun yu、yaoshun），是书用作治道标尺的上古圣王。你最好的答案是书打开的门：尧则天、舜禹不与、禹无间然，以及人物索引上的相关章句——而不是文本外的圣王百科。",
        answerEn:
          "You meet Yao, Shun, and Yu (尧、舜、禹; also searched as yao shun yu, yao shun, or yaoshun) as the ancient sage kings the Analects uses as a measure of rule. Your best answer is the doors the book opens: Yao matching Heaven, Shun and Yu holding the empire lightly, Yu without flaw, and related scenes on the people index—not a modern sage-king encyclopedia outside the text.",
      },
      {
        questionZh: "为什么有人搜「尧舜禹」或 yaoshun？",
        questionEn: "Why do people search “yao shun yu” or “yaoshun”?",
        answerZh:
          "你往往想先弄清身份：是哪三个名字、哪次著名赞辞、哪扇篇章的门。搜到这些词之后，请打开活页章句，而不要依赖一篇会捏造章号或软化措辞的摘要。你把原文、白话导读与英译分层来读，阅读才站得住。",
        answerEn:
          "You often want a clear identity: which three names, which famous praise, which chapter door. Search those phrases, then open the live passages rather than a summary that invents chapter numbers or softens the wording. Your reading stays honest when you keep source, vernacular guide, and English translation in separate layers.",
      },
      {
        questionZh: "《泰伯》赞尧强调什么？",
        questionEn: "What does the T’ai-po praise of Yao emphasize?",
        answerZh:
          "你听到夫子称尧之为君大哉：唯天为大，唯尧则之；百姓简直找不到合适的名字来称颂那浩荡之德。你要把这读成对着「天」的治道标尺，而不是许可你去编宫廷轶事。你的下一步是泰伯那章活页，对照原文与白话导读，而不是贴到每场领导力演说上的口号。",
        answerEn:
          "You hear the Master call Yao great as a sovereign: only Heaven is grand, and only Yao corresponded to it; the people could find no name for that vast virtue. Hold that as a measure of rule against Heaven, not as permission to invent court anecdotes. Your next step is the live T’ai-po page, not a slogan you paste onto every leadership talk.",
      },
      {
        questionZh: "舜与禹怎样成对出现？",
        questionEn: "How do Shun and Yu appear as a paired measure?",
        answerZh:
          "你看见舜禹因有天下而不与受到赞叹，也可以在各自活页上读到禹「无间然」——菲食恶衣卑室，却尽心于鬼神与沟恤。你按《论语》里轻松与尽心成对的意思来读即可。你不该发明活页没有写出的洪水地图或职官履历。",
        answerEn:
          "You see Shun and Yu praised for holding the empire as if it were nothing, and you can read Yu’s “no flaw” scene—coarse living, care for spirits and water-channels—on its own live page. Read that as ease paired with tireless care in the Analects sense. You should not invent flood maps or ministry résumés the pages do not show.",
      },
      {
        questionZh: "怎样避免写成通史圣王传？",
        questionEn: "How do you keep this from becoming a Wikipedia dump?",
        answerZh:
          "你在别处还可能遇见尧舜授命之辞或「尧舜其犹病诸」——这里只点名消歧，不开万神殿长文。当句子只点到其中一位，请到人物索引核对可链篇章。你的习惯应是：三个名字，一组活页之门，而不是合并的史前编年。",
        answerEn:
          "You may also meet Yao–Shun succession language or “尧舜其犹病诸” elsewhere—light names only here, not a full pantheon essay. When a sentence only names one of them, check the people index for the linked chapters. Your habit should be three names, one set of live doors, not a merged prehistoric chronicle.",
      },
      {
        questionZh: "这篇笔记不是什么？",
        questionEn: "What is not this essay?",
        answerZh:
          "你在这里找不到君子/忠恕/仁的通论重写、诸公合传，或第二篇鲁哀公总览。那些主题只在圣王标尺轻轻碰到它们时才出现。你的下一步是篇章页或人物索引，而不是另一篇重复本站其他札记的总览。",
        answerEn:
          "You will not find here a junzi / zhongshu / ren treatise, a multi-duke biography, or a second Duke Ai overview meant to replace that Note. Those themes appear only where the sage-king measure lightly touches them. Your next step is a passage page or the entity index, not another overview that repeats other Notes on this site.",
      },
      {
        questionZh: "怎样避免 AI 编造尧舜禹语录？",
        questionEn: "How do you keep AI from inventing Yao–Shun–Yu quotes?",
        answerZh:
          "若你用模型当阅读助手，应粘贴活页原文再追问，而不是在没有出处时问「孔子一定怎样说尧」。你应一律拒绝新捏造的《论语》句子。你的核验路径始终是本站已发布的篇章地址，lunyu.ai。",
        answerEn:
          "If you use a model as a reading aid, you should paste the live passage text and ask for questions, not for “what Confucius must have said about Yao” without a source. Always refuse any newly minted Analects line. Your verification path is always the published chapter URL on this site, lunyu.ai.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读赞尧那一章",
        headingEn: "Read the Yao praise page next",
        bodyZh: [
          "当你准备打开最清楚的那扇「尧作为标尺」之门，请打开[论语 · 泰伯 8.19](https://www.lunyu.ai/zh-Hans/analects/tai-bo/tai-bo-019)，把原文、白话导读与英译并排对照。你问问自己：若「则天」要检查你的用人，你会先看什么——然后停住，回到文本，而不是回到一篇尧舜禹摘要。",
        ],
        bodyEn: [
          "When you are ready for the clearest Yao-as-measure door, open [The Analects · T'ai-po 8.19](https://www.lunyu.ai/en/analects/tai-bo/tai-bo-019) and read source, guide, and Legge side by side. Ask yourself what “matching Heaven” would check in your own appointments—then stop, and return to the live text rather than to a summary of Yao, Shun, and Yu.",
        ],
      },
    ],
  },
  {
    slug: "duke-ai-of-lu-in-the-analects",
    titleZh: "《论语》里的鲁哀公是谁？",
    titleEn: "Who Was Duke Ai of Lu in the Analects?",
    dekZh:
      "你搜「鲁哀公」或 Duke Ai of Lu 时，多半是想在《论语》一串国君名里把他安顿下来。在本站，你遇见他，是因为他的提问常打开几扇门——何为则民服、年饥用不足、以及问社。你不必先读完整王侯传；你可以直接打开他发问的篇章，看孔子与其门人怎样回答。",
    dekEn:
      'When you search "duke ai of lu," you usually want to place one Lu ruler among many names in the Analects. On this site you meet him as the late Lu duke whose questions open doors—how the people submit, what to do in a year of scarcity, and the land altars. You do not need a Wikipedia résumé first; you can read the scenes where he asks and notice how Confucius and his circle answer.',
    descriptionZh: "《论语》里的鲁哀公：用提问打开的门——何为则民服、年饥用不足、问社。链回可核对的原文。",
    descriptionEn:
      "Duke Ai of Lu in the Analects: the ruler whose questions open doors—how the people submit, a year of scarcity, and the land altars.",
    datePublished: "2026-09-20",
    dateModified: "2026-09-20",
    tagsZh: ["鲁哀公", "哀公", "为政"],
    tagsEn: ["duke ai", "Duke Ai of Lu", "Wei Chang"],
    related: [
      "/analects/wei-zheng/wei-zheng-019",
      "/index/duke-ai",
      "/analects/yan-yuan/yan-yuan-009",
      "/blogs/zai-wo-in-the-analects",
      "/blogs/duke-ding-of-lu-in-the-analects",
    ],
    cover: notesBlogImage(
      "duke-ai-of-lu-in-the-analects",
      "cover.jpg",
      "A Lu court audience — Duke Ai’s question to Confucius about how the people will submit",
      "鲁廷对问之席——哀公问孔子「何为则民服」",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "duke-ai-of-lu-in-the-analects",
        "inline-1.jpg",
        "Upright appointments set above the crooked — “raise the straight, set aside the crooked”",
        "直者举于枉者之上——「举直错诸枉」的用人意象",
        NOTES_INLINE_SIZE
      ),
      "inline-2": notesBlogImage(
        "duke-ai-of-lu-in-the-analects",
        "inline-2.jpg",
        "An empty grain measure at a quiet court table — scarcity-year counsel, not spectacle",
        "空量器置于素净廷案——年饥问计，而非灾异奇观",
        NOTES_INLINE_SIZE
      ),
    },
    sections: [
      {
        headingZh: "先按篇章认人，不靠王侯履历",
        headingEn: "Place him by the passages, not by a royal résumé",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，人物索引把他标为[鲁哀公](https://www.lunyu.ai/zh-Hans/index/duke-ai)——《论语》中向孔子及其圈子发问的鲁国国君。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与英译分开放，拒绝发明活页上没有的句子。",
        ],
        bodyEn: [
          "If you want a compact entry before you open each chapter page, the people index labels him as [Duke Ai of Lu](https://www.lunyu.ai/en/index/duke-ai)—the Lu ruler who questions Confucius and his circle in the Analects. That line is enough for you to start: follow the linked scenes, keep source text, guide, and English translation in their layers, and refuse to invent sayings the live pages do not show. Treat the index as a map of doors, not as a finished essay that replaces reading.",
        ],
      },
      {
        headingZh: "他的提问打开的三扇门",
        headingEn: "Three doors his questions open",
        bodyZh: [],
        bodyEn: [],
      },
      {
        headingZh: "何为则民服",
        headingEn: "How the people submit",
        imageSlot: "inline-1",
        bodyZh: [
          "有一场问答里，他问怎样做百姓才会服从。活页里孔子对曰：举直错诸枉，则民服；举枉错诸直，则民不服。你可以把这扇门读成「你举谁、你错谁」的用人判断，而不是逼人服从的口号。",
        ],
        bodyEn: [
          "In one exchange he asks what should be done to secure the submission of the people. Legge has Confucius reply: advance the upright and set aside the crooked, then the people will submit; advance the crooked and set aside the upright, then they will not. You can take that as a door about whom you raise and whom you set aside—not as a slogan for forcing obedience. When you cite it later, keep the Chinese source visible beside the English layer on the same live page.",
        ],
      },
      {
        headingZh: "年饥用不足",
        headingEn: "A year of scarcity",
        imageSlot: "inline-2",
        bodyZh: [
          "别处，他问有若：年饥、用不足，如之何。在活页[论语 · 颜渊 12.9](https://www.lunyu.ai/zh-Hans/analects/yan-yuan/yan-yuan-009)里，有若把他拉回到百姓是否足用——百姓足，君孰与不足。你该把这番劝告读成共足，而不是文本外编造的现代税表。",
        ],
        bodyEn: [
          "Elsewhere he asks You Ruo what to do when the year is scarce and expenditure falls short. On the live page [The Analects · Yen Yuan 12.9](https://www.lunyu.ai/en/analects/yan-yuan/yan-yuan-009), You Ruo points him back toward the people having enough—if the people have plenty, their prince will not want alone. You should read that counsel as shared sufficiency, not as a modern tax spreadsheet invented outside the text.",
        ],
      },
      {
        headingZh: "问社",
        headingEn: "The land altars",
        bodyZh: [
          "他还向宰我问社；那一场属于弟子冒险的解释，以及夫子闻之以后的克制。若你想读弟子一侧的哀公问社，可打开一次[《论语》里的宰我是谁？](https://www.lunyu.ai/zh-Hans/blogs/zai-wo-in-the-analects)，再回到这里看发问的国君。你不是在读第二篇传记；你是在追问：是谁把门打开。",
        ],
        bodyEn: [
          "He also asks Zai Wo about the land altars; that scene belongs with the disciple’s risky gloss—pine, cypress, chestnut, and “awe”—and the Master’s restraint afterward. If you want the disciple-side reading of 哀公问社, open [Who Was Zai Wo in the Analects?](https://www.lunyu.ai/en/blogs/zai-wo-in-the-analects) once—then return here for the ruler who asked. You are not reading a second biography; you are tracing who opened the door, then verifying the wording on the published chapter pages.",
        ],
      },
      {
        headingZh: "不是鲁定公，也不是卫灵公",
        headingEn: "Not Duke Ding, not Duke Ling",
        bodyZh: [
          "书中别处你还会遇见鲁定公或卫灵公——不同的国君，不同的问法。这篇笔记只停在鲁哀公。你不该把他们并成一篇「《论语》诸公合传」；需要时，请把每个名字扣回各自的活页章句。",
        ],
        bodyEn: [
          "Elsewhere in the book you may meet Duke Ding of Lu or Duke Ling of Wei—different rulers, different questions. This Note stays with Duke Ai alone; it is not a multi-duke biography and it does not retell their separate scenes. You should not merge them into one “dukes of the Analects” résumé; keep each name tied to its own live passages when you need them.",
        ],
      },
      {
        headingZh: "你该怎样引用他",
        headingEn: "How you should cite him",
        bodyZh: [
          "当你引用哀公的提问，应标明活页篇章地址，并说明用的是原文、白话导读还是英译。你可以轻提检索意图，但不要发明 brief 没有给出的展示次数或历史年份。你的诚实落在篇章页上，而不在更顺口却无出处的改写里。",
        ],
        bodyEn: [
          "When you quote Duke Ai’s questions, you should name the live chapter URL and say whether you used source Chinese, the modern guide, or Legge’s English. You can mention search interest lightly if needed, but you should never invent impression counts or history dates the brief did not give. Your honesty is the passage page, not a smoother paraphrase that invents a saying.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的鲁哀公是谁？",
        questionEn: "Who was Duke Ai of Lu in the Analects?",
        answerZh:
          "你在《论语》里遇见的鲁哀公（亦称哀公、Duke Ai of Lu、Ai Gong），是向孔子及其圈子发问的鲁国国君。你最好的答案是他提问打开的门：何为则民服、经有若的年饥问计、向宰我问社，以及人物索引上的相关章句——而不是文本外编造的现代王侯履历。",
        answerEn:
          "You meet Duke Ai (鲁哀公; also Ai Gong) as the Lu ruler who questions Confucius and his circle in these published scenes. Your best answer is the doors his questions open: how the people submit, scarcity-year counsel through You Ruo, the land-altar exchange with Zai Wo, and related scenes on the people index—not a modern royal biography invented outside the text.",
      },
      {
        questionZh: "为什么有人搜「鲁哀公」或 duke ai of lu？",
        questionEn: 'Why do people search "duke ai of lu"?',
        answerZh:
          "你往往想先弄清身份：是哪一位公、哪次著名发问、哪扇篇章的门。搜到这个词之后，请打开活页章句，而不要依赖一篇会捏造章号或软化答语的摘要。你把原文、白话导读与英译分层来读，阅读才站得住。",
        answerEn:
          "You often want a clear identity: which duke, which famous question, which chapter door. Search that phrase, then open the live passages rather than a summary that invents chapter numbers or softens the answers. Your reading stays honest when you keep source, vernacular guide, and English translation in separate layers.",
      },
      {
        questionZh: "「民服」那一场在说什么？",
        questionEn: "What is the “民服” exchange about?",
        answerZh:
          "你听到哀公问怎样使民服，孔子以举直错诸枉作答。你要把这读成用人与判断的教诲，而不是胁迫的许可。你的下一步是为政那章活页，对照原文与白话导读，而不是贴到每场职场争执上的口号。",
        answerEn:
          "You hear Duke Ai ask how to secure the people’s submission, and Confucius answer by advancing the upright and setting aside the crooked. Hold that as a staffing-and-judgment teaching, not as permission to coerce. Your next step is the live Wei Chang page, not a slogan you paste onto every workplace dispute.",
      },
      {
        questionZh: "年饥那一场呢？",
        questionEn: "What about the year of scarcity?",
        answerZh:
          "你看见他问有若：年成饥荒、用度不足怎么办；答复把他转向百姓是否足用。你按《论语》里的共足来读即可，并回到活页核对原文措辞。你不该发明活页没有写出的比例或财政图表。",
        answerEn:
          "You see him ask You Ruo what to do when the year is scarce and funds fall short; the reply turns him toward whether the people have enough. Read that as shared sufficiency in the Analects sense. You should not invent percentages or fiscal charts the live page does not show.",
      },
      {
        questionZh: "怎样避免把他和其他公混在一起？",
        questionEn: "How do you keep from mixing him with other dukes?",
        answerZh:
          "你在别处还可能遇见鲁定公或卫灵公——这里只点名消歧，不开新传。当章句只写「公」时，请到人物索引核对是哪一位。你的习惯应是：一个名字，一组可链篇章，而不是合并的宫廷编年。",
        answerEn:
          "You may also meet Duke Ding of Lu or Duke Ling of Wei elsewhere—light names only here, not new biographies. When a passage says “the duke,” check the people index for which ruler it is. Your habit should be one name, one set of linked chapters, not a merged court chronicle.",
      },
      {
        questionZh: "这篇笔记不是什么？",
        questionEn: "What is not this essay?",
        answerZh:
          "你在这里找不到诸公合传、君子/忠恕/仁的通论重写，或第二篇宰我总览。那些主题只在哀公的提问碰到它们时才出现。你的下一步是篇章页或人物索引，而不是另一篇重复本站其他札记的总览。",
        answerEn:
          "You will not find here a multi-duke biography, a rewrite of junzi / zhongshu / ren, or a second Zai Wo overview meant to replace that Note. Those themes appear only where Duke Ai’s questions touch them. Your next step is a passage page or the entity index, not another overview that repeats other Notes on this site.",
      },
      {
        questionZh: "怎样避免 AI 编造哀公语录？",
        questionEn: "How do you keep AI from inventing Duke Ai quotes?",
        answerZh:
          "若你用模型当阅读助手，应粘贴活页原文再追问，而不是在没有出处时问「孔子一定对哀公说过什么」。你应一律拒绝新捏造的《论语》句子。你的核验路径始终是本站已发布的篇章地址，lunyu.ai。",
        answerEn:
          "If you use a model as a reading aid, you should paste the live passage text and ask for questions, not for “what Confucius must have told the duke” without a source. Always refuse any newly minted Analects line. Your verification path is always the published chapter URL on this site, lunyu.ai.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读「民服」那一章",
        headingEn: "Read the “民服” page next",
        bodyZh: [
          "当你准备打开最清楚的那扇「民服与用人」之门，请打开[论语 · 为政 2.19](https://www.lunyu.ai/zh-Hans/analects/wei-zheng/wei-zheng-019)，把原文、白话导读与英译并排对照。你问问自己：当你希望别人跟从时，你举的是谁——然后停住，回到文本，而不是回到一篇哀公摘要。",
        ],
        bodyEn: [
          "When you are ready for the clearest submission-and-appointment door, open [The Analects · Wei Chang 2.19](https://www.lunyu.ai/en/analects/wei-zheng/wei-zheng-019) and read source, guide, and Legge side by side. Ask yourself whom you advance when you want people to follow—then stop, and return to the live text rather than to a summary of Duke Ai.",
        ],
      },
    ],
  },
  {
    slug: "zhongshu-reciprocity-in-the-analects",
    titleZh: "《论语》的忠恕：不是愚忠，也不是英文 Golden Rule",
    titleEn: "Zhongshu in the Analects: Loyalty, Reciprocity, and What They Are Not",
    dekZh:
      "你在金句卡或搜索摘要里碰到「忠恕」时，多半想要一对可核对的说法，而不是软口号。在《论语》里，这个名字把两步放在一起：把该尽的做尽，并在把你不愿承受的加给别人之前先停住。你可以先记住这个短拆，再打开本站活页，把原文、白话导读与英译分层来读。",
    dekEn:
      "When you meet zhongshu (忠恕) on a quote card or in a search snippet, you usually want a checkable pair, not a soft slogan. In the Analects the name holds two moves together: finishing what a matter asks of you, and stopping before you impose what you yourself would refuse. You can quote a short split here, then open the live passages on this site and keep source, guide, and Legge's English in their layers.",
    descriptionZh:
      "忠恕不是愚忠，也不等于一句「己所不欲」贴纸。拆开忠与恕，并链回可核对的原文。",
    descriptionEn:
      "Zhongshu is a paired Analects teaching—not blind loyalty and not a soft Golden Rule. Open the passages on this site.",
    datePublished: "2026-09-15",
    dateModified: "2026-09-16",
    tagsZh: ["忠恕", "恕", "论语"],
    tagsEn: ["zhongshu", "reciprocity", "Analects"],
    related: [
      "/analects/li-ren/li-ren-015",
      "/index/zhongshu",
      "/analects/wei-ling-gong/wei-ling-gong-023",
    ],
    cover: notesBlogImage(
      "zhongshu-reciprocity-in-the-analects",
      "cover.jpg",
      "Two complementary halves of one teaching — zhong and shu as a paired Analects door, not a Zen poster",
      "同一教诲的两半并置——忠与恕作为《论语》成对之门，而非禅意海报",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "zhongshu-reciprocity-in-the-analects",
        "inline-1.jpg",
        "A gift held back at the table’s midline — shu as “do not impose what you refuse,” not an empty bowl",
        "礼物停在桌线己侧——恕为「己所不欲勿施」，而非空碗静物",
        NOTES_INLINE_SIZE
      ),
      "inline-2": notesBlogImage(
        "zhongshu-reciprocity-in-the-analects",
        "inline-2.jpg",
        "Finishing an entrusted scroll versus trailing a raised seat — zhong is not blind loyalty",
        "办妥受托文书对照盲随高座——忠不等于愚忠",
        NOTES_INLINE_SIZE
      ),
    },
    sections: [
      {
        headingZh: "一句可以引用的短答",
        headingEn: "A short answer you can quote",
        bodyZh: [
          "你可以这样说：忠恕是《论语》里成对的教诲——不是愚忠，也不是一张告诉你「自己想要什么就给别人什么」的 Golden Rule 贴纸。本站实体索引[忠恕](https://www.lunyu.ai/zh-Hans/index/zhongshu)用两行写出同一条脊骨：忠是把这件事做尽；恕是先停住你不愿承受的那一下。你该把它当作走进篇章的门，而不是人格品牌或一键道德应用。",
        ],
        bodyEn: [
          "You can say it this way: zhongshu is a paired Analects teaching—not blind loyalty, and not a Golden Rule sticker that tells you to give others whatever you want. On this site the entity hub [Loyalty and reciprocity](https://www.lunyu.ai/en/index/zhongshu) states the same spine in two lines: zhong is finishing what the matter asks of you; shu is stopping before you impose what you yourself would refuse. You should treat that as a door into passages, not as a personality brand or a one-word morality app.",
        ],
      },
      {
        headingZh: "把这一对拆开",
        headingEn: "Split the pair",
        bodyZh: [],
        bodyEn: [],
      },
      {
        headingZh: "恕：先是禁令",
        headingEn: "Shu: a prohibition first",
        imageSlot: "inline-1",
        bodyZh: [
          "当你听见「恕」，常常会听见孔子答应子贡可以终身行之的那一言：己所不欲，勿施于人。那扇门是克制——你先停住，别把不愿承受的加给别人——不是一份「把你喜欢的礼物推给别人」的正面清单。你最好把禁令的方向看清楚，再拒绝把恕塌缩成现代「对人好一点」的海报。你的核对点是活页篇章，而不是把规则方向偷偷翻转的改写。",
        ],
        bodyEn: [
          "When you hear shu, you often hear the lifelong word Confucius grants when asked for one practice for life: what you do not want done to yourself, do not do to others. That door is a restraint—you stop before you impose—not a positive order to hand others your preferred gifts. You do best to keep the prohibition in view, then refuse to collapse shu into a modern “be nice” poster. Your check is the live chapter, not a paraphrase that flips the direction of the rule.",
        ],
      },
      {
        headingZh: "忠：不是「服从在上者」",
        headingEn: "Zhong: not “obey whoever is above you”",
        bodyZh: [
          "当你把忠读成英文里的 loyalty，很容易听成对某人或某职位的无条件服从。书里的忠出现在为人谋、言语与行事——把受托的事做尽——而不是谁坐得更高就给他一张空白支票。你不该拿「愚忠」去换这个字；那样读会拆掉书中与礼、与恕成对的条件。你把场景读完再定译名，比先选定一个英文赢家更稳。",
        ],
        bodyEn: [
          "When you meet English “loyalty,” you easily hear unconditional obedience to a person or office. In the book zhong shows up in planning for others, in speech, and in conducting affairs—doing fully what was entrusted—not as a blank check for whoever sits higher. You should not trade the word for “blind loyalty”; that reading breaks a pair the book keeps with li (ritual propriety) and with shu. Hold the romanization zhong beside the English gloss, and read each scene before you settle the word once.",
        ],
      },
      {
        headingZh: "两道章句之门",
        headingEn: "Two passage doors",
        bodyZh: [],
        bodyEn: [],
      },
      {
        headingZh: "曾子的概括：「忠恕而已矣」",
        headingEn: "Zengzi’s summary: “zhong and shu, and that is all”",
        bodyZh: [
          "你该先打开的一扇门，是里仁 4.15。孔子告诉曾子「吾道一以贯之」；夫子出去后，曾子对门人转述：夫子之道，忠恕而已矣。你听见的是弟子的归纳，不是孔子当场贴在墙上的定义。活页把原文、白话导读与公版英译分层摆着；忠恕二字仍在源文一行里可见。当你准备坐下来并排对照时，这一章就是本篇笔记的主门。",
        ],
        bodyEn: [
          "One door you should open first is Le Jin 4.15. Confucius tells Zengzi his way is threaded on one strand; after the Master leaves, Zengzi restates it for the other disciples: the Master’s way is zhong and shu, and that is all. You are hearing a disciple’s summary, not a definition Confucius posted on the wall. Legge’s public-domain English on that page paraphrases the pair rather than printing the Chinese syllables—zhongshu stays visible in the source line. When you are ready to sit with Chinese, guide, and Legge together, that chapter is the main door on this Note.",
        ],
      },
      {
        headingZh: "终身之言：「其恕乎」",
        headingEn: "The lifelong word: “is it not shu?”",
        bodyZh: [
          "第二扇门是卫灵公 15.23。子贡问有一言可以终身行之者乎；孔子答「其恕乎」，再说出那道禁令：己所不欲，勿施于人。你若要单独看这日常克制的全文，可打开[论语 · 卫灵公 15.23](https://www.lunyu.ai/zh-Hans/analects/wei-ling-gong/wei-ling-gong-023)。你把它当作走进恕的入口——而不是证明忠恕可以塌缩成一句英文 Golden Rule。若这句话抓住你，下一步仍是活页篇章，而不是另编章号的摘要。",
        ],
        bodyEn: [
          "A second door is Wei Ling Kung 15.23. Zi Gong asks whether one word can serve as a rule of practice for all one’s life; Confucius answers shu, then states the prohibition: what you do not want done to yourself, do not do to others. You can open [The Analects · Wei Ling Kung 15.23](https://www.lunyu.ai/en/analects/wei-ling-gong/wei-ling-gong-023) when you want that daily restraint in full. Hold it as a doorway into shu—not as proof that zhongshu collapses into one English Golden Rule. Your next move, if the line catches you, is the live chapter page, not a summary that invents extra numbers.",
        ],
      },
      {
        headingZh: "三种常见的塌缩",
        headingEn: "Common collapses to refuse",
        imageSlot: "inline-2",
        bodyZh: [
          "你会遇见三种容易的塌缩。第一，把忠读成对上位者的愚忠——请拒绝；书里臣事君以忠，前面还有君使臣以礼，别处也把忠测成把受托的事做尽。第二，把「己所不欲……」当成忠恕的全部，或当成常见 Golden Rule 那句「己所欲，施于人」——方向并不相同。第三，名字混淆：忠恕这组成对之教，不是弟子[仲弓](https://www.lunyu.ai/zh-Hans/index/zhong-gong)；若你找的是人，打开人物索引一次，然后离开这篇概念笔记。你也该把忠恕与仁、君子日常行为的通论笔记分开——本页只拆这一对，并打开门。",
        ],
        bodyEn: [
          "You will meet three easy collapses. First, reading zhong as blind loyalty to whoever is above you—refuse that; the book pairs minister’s zhong with the ruler’s li, and elsewhere tests zhong as finishing what was entrusted. Second, treating “what you do not want…” as the whole of zhongshu or as identical to the usual Golden Rule that tells you to give others what you want—the direction is not the same. Third, name confusion: zhongshu the teaching is not the disciple Zhong Gong; if you meant the person, open [Zhong Gong](https://www.lunyu.ai/en/index/zhong-gong) once and leave this concept Note. You should also keep zhongshu separate from a full rewrite of ren or junzi everyday-conduct essays—this page only splits the pair and opens doors.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的忠恕是什么？",
        questionEn: "What is zhongshu in the Analects?",
        answerZh:
          "你可以这样引用：忠恕是成对的教诲——忠是把这件事做尽，恕是先停住你不愿承受的那一下。它不是愚忠，不是软软的「对人好」口号，也不是一句英文 Golden Rule。你最短的诚实答案，仍应把你送回本站可核对的篇章地址，而不是一句励志改写。",
        answerEn:
          "You can quote this: zhongshu is a paired teaching—zhong as finishing what the matter asks of you, shu as stopping before you impose what you yourself would refuse. It is not blind loyalty, not a soft “be nice” slogan, and not a single English Golden Rule. Your shortest honest answer still sends you back to a passage URL on this site rather than to a motivational paraphrase.",
      },
      {
        questionZh: "「忠恕而已矣」是孔子说的吗？",
        questionEn: "Did Confucius say “zhong and shu, and that is all”?",
        answerZh:
          "你该把这句话记在曾子对门人的转述上（里仁 4.15），而不是假装孔子在当场贴出墙标。夫子说的是一以贯之；曾子在夫子出去后，才为门人点出忠与恕这一对。你的核对点是活页——原文、白话导读与英译——而不是抹掉谁说了哪一句的漂浮金句。",
        answerEn:
          "You should credit Zengzi’s restatement in Le Jin 4.15, not invent a wall slogan from Confucius’s own mouth in that scene. The Master speaks of an all-pervading unity; Zengzi names the pair for the other disciples after the Master leaves. Your check is the live chapter—source Chinese, guide, and Legge—rather than a floating meme that erases who said which line.",
      },
      {
        questionZh: "「己所不欲…」就是恕的全部吗？",
        questionEn: "Is “what you do not want done to yourself…” the whole of shu?",
        answerZh:
          "你在卫灵公 15.23 遇见这道禁令，作为终身一言，它是恕的日常入口——克制，不是正面礼物清单。你不该把它当成忠恕整对的全部，也不该把它翻成「自己想要的就给别人」。你诚实的读法，是守住禁令的方向，并把忠留作这一对的另一半。",
        answerEn:
          "You meet that prohibition as the lifelong word in Wei Ling Kung 15.23, and it is the daily door for shu—a restraint, not a positive gift list. You should not treat it as the entire pair zhongshu, nor flip it into “give others what you want.” Your honest reading keeps the prohibition’s direction and leaves zhong as the other half of the teaching.",
      },
      {
        questionZh: "忠该译成 loyalty 吗？",
        questionEn: "Should zhong be translated “loyalty”?",
        answerZh:
          "你可以用「忠诚」一类说法当 gloss，只要场景仍在眼前——为人谋、言语、受托之事——但你必须拒绝「愚忠」当本义。英译层常写 faithful 之类，没有一层能一次钉死汉字。你最少误导的做法，是把分层活页放在汉字旁边，而不是先选定一个英文赢家。",
        answerEn:
          "You can use “loyalty” as one English gloss if you keep the scenes in view—planning for others, speech, affairs entrusted—but you should refuse “blind loyalty” as the meaning. Legge and other layers often say “faithful” or similar; none settles the Chinese once. Your least-misleading move is the layered page beside the romanization zhong, not a single English winner.",
      },
      {
        questionZh: "忠恕就是仁吗？",
        questionEn: "Is zhongshu the same as ren?",
        answerZh:
          "你不该把它们并成一个词。仁是书中更宽的德之名，在许多门里被检验；忠恕是可以贯穿其道的成对教诲，却不是仁每一次出现的同义词。本篇笔记不重写仁与君子的日常行为通论。你的下一步仍停在忠恕篇章与实体索引，而不是另一份自助提纲。",
        answerEn:
          "You should not collapse them. Ren is a wider name of virtue the book tests in many doors; zhongshu is a paired teaching that can thread a way without becoming a synonym for every use of ren. This Note does not rewrite everyday ren and junzi conduct pages. Your next check stays on the zhongshu passages and the entity index, not on a second self-help outline.",
      },
      {
        questionZh: "忠恕就是 Golden Rule 吗？",
        questionEn: "Is zhongshu the Golden Rule?",
        answerZh:
          "你该拒绝简单的「是」。书中恕的门，禁止把你不愿承受的加给别人；常见 Golden Rule 却说「你想怎样被对待，就怎样对待别人」——方向不同。子贡那句更满的正面表述，正是孔子别处说「非尔所及」的。你应守住这个拆分，别把英文口号贴到这一对上。",
        answerEn:
          "You should refuse a simple yes. The Analects door for shu forbids imposing what you would refuse; the usual Golden Rule tells you to treat others as you want to be treated—the direction is not the same. Zi Gong’s fuller positive sentence is precisely what Confucius, elsewhere, says is not yet his. Your careful answer keeps that split instead of pasting one English slogan onto the pair.",
      },
      {
        questionZh: "接下来该去本站哪里？",
        questionEn: "Where should you go next on this site?",
        answerZh:
          "请先打开里仁 4.15，坐下来读成对归纳；若你想单独看终身一言的恕之禁令，再打开卫灵公 15.23。你把原文、白话导读与英译并排可见，并拒绝任何新捏造的「孔子说过」。你的核验路径始终是 lunyu.ai 已发布的地址，从下方主篇章门开始。",
        answerEn:
          "Open Le Jin 4.15 as your first sitting text for the paired summary, then Wei Ling Kung 15.23 when you want the lifelong shu prohibition alone. You keep source, guide, and Legge visible together and refuse any newly minted Confucius quote. Your verification path is always a published URL on lunyu.ai, starting with the main chapter door below.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "先打开这一句，再回索引",
        headingEn: "Open the line, then the index",
        bodyZh: [
          "当你准备用一页活页检验这一对，请打开[论语 · 里仁 4.15](https://www.lunyu.ai/zh-Hans/analects/li-ren/li-ren-015)，把原文、白话导读与英译并排来读。你问问自己：是否把忠塌成了盲从，或把恕塌成了软软的 Golden Rule。然后再回忠恕索引找更多门，并让这篇概念笔记与弟子传记分开。",
        ],
        bodyEn: [
          "When you are ready to test the pair against one live chapter, open [The Analects · Le Jin 4.15](https://www.lunyu.ai/en/analects/li-ren/li-ren-015) and read source, guide, and Legge side by side. Ask whether you have been collapsing zhong into blind obedience—or shu into a soft Golden Rule. Then return to the Loyalty and reciprocity index for more doors, and keep this concept Note separate from disciple biographies.",
        ],
      },
    ],
  },
  {
    slug: "zai-wo-in-the-analects",
    titleZh: "《论语》里的宰我是谁？",
    titleEn: "Who Was Zai Wo in the Analects?",
    dekZh:
      "你搜「宰我」时，多半是想在一串弟子名里把他安顿下来。在本站，你遇见他，是因为他的提问常引出尖锐答复——丧期、社主、仁者、以及言行是否相称。你不必先读完整弟子传；你可以直接打开他出现的篇章，看夫子怎样回答他。",
    dekEn:
      'When you search "zai wo," you are usually trying to place one disciple among many names. On this site you meet him as a speaker whose questions draw sharp replies—on mourning, altars, benevolence, and whether words match deeds. You do not need a full biography first; you can read the passages where he appears and notice how the Master answers him.',
    datePublished: "2026-09-14",
    dateModified: "2026-09-14",
    tagsZh: ["宰我", "弟子", "阳货"],
    tagsEn: ["zai wo", "disciple", "Yang Ho"],
    related: ["/analects/yang-huo/yang-huo-021", "/index/zai-wo"],
    cover: {
      src: "/images/blogs/zai-wo-in-the-analects/cover.jpg",
      alt: "Quiet study desk with open Analects and empty second seat — who was Zai Wo",
      altZh: "安静书案上摊开的《论语》与空出的第二席——宰我是谁",
      width: 1600,
      height: 900,
    },
    inlineImages: {
      "speech-and-conduct": {
        src: "/images/blogs/zai-wo-in-the-analects/speech-and-conduct.jpg",
        alt: "Ink sketch of spoken words beside a quiet practice path — speech tested by conduct",
        altZh: "墨色勾出的言语涟漪与静默践行之路——言语要经得起行为检验",
        width: 1200,
        height: 900,
      },
      "mourning-three-years": {
        src: "/images/blogs/zai-wo-in-the-analects/mourning-three-years.jpg",
        alt: "Calendar cycle of one year beside a longer care span — three years’ mourning question",
        altZh: "一年节令循环旁更长的照护弧线——三年之丧的追问",
        width: 1200,
        height: 900,
      },
    },
    sections: [
      {
        headingZh: "先按篇章认人，不靠履历表",
        headingEn: "Place him by the passages, not by a résumé",
        bodyZh: [
          "若你想在逐章展开之前先有一个入口，人物索引把他标为[宰我](https://www.lunyu.ai/zh-Hans/index/zai-wo)—孔门弟子，常因言行与礼制问题引发孔子的严厉辨析。这一行就够你起步：顺着相关章句读下去，把原文、白话导读与英译分开放，拒绝发明活页上没有的句子。",
        ],
        bodyEn: [
          'If you want a compact entry point before you open each chapter page, the people index labels him simply as [Zai Wo](https://www.lunyu.ai/en/index/zai-wo)—a disciple whose questions often provoke sharp teaching on ritual and conduct. That line is enough for you to start: follow the linked scenes, keep source text, guide, and English translation in their layers, and refuse to invent sayings the live pages do not show.',
        ],
      },
      {
        headingZh: "以言语见称——也以行为受检验",
        headingEn: "Named for speech—and tested by conduct",
        imageSlot: "speech-and-conduct",
        bodyZh: [
          "在一处弟子分科里，你看见宰我与子贡同列于「言语」。活页写：言语，宰我，子贡；旁边另有德行、政事、文学诸科。你可以把这当作传统记住的长项地图，而不是一张成绩单，好把后面更难的场面一笔勾销。当你把他和那些名字并读时，不妨问：你自己的「言语长项」，在行为跟不上时要付什么代价。",
          "昼寝那一章把这道缝隙压得更紧。活页里夫子论宰予昼寝，说「朽木不可雕也，粪土之墙，不可杇也」，又说起初听其言而信其行，如今听其言而观其行——「于予与改是」。你不必拿来嘲笑一个学生；你该停下来，别再让流利的话把「有没有做到」这件事糊过去。",
        ],
        bodyEn: [
          "In one grouping of disciples, you see Zai Wo listed with Zigong under speech. Legge's English on that page says that for ability in speech there were Tsai Wo and Tsze-kung, beside other pairs for virtue, administration, and literary acquirements. You can take that as a map of strengths the tradition remembered—not as a grade sheet that cancels the harder scenes. When you read him next to those other names, ask what your own \"speech strength\" costs when conduct lags.",
          'The daytime-sleep passage presses that gap. Legge has the Master say of Tsai Yu asleep by day: "Rotten wood cannot be carved; a wall of dirty earth will not receive the trowel," then: at first he heard people\'s words and trusted their conduct; now he hears their words and looks at their conduct—"It is from Yu that I have learned to make this change." You are not asked to mock a student; you are asked to stop letting fluent talk settle the question of practice.',
        ],
      },
      {
        headingZh: "逼出界线的提问",
        headingEn: "Questions that force a line",
        bodyZh: [
          "别处，宰我答哀公问社，举夏后氏以松、殷人以柏、周人以栗，并说周人用栗是要「使民战栗」。夫子闻之，活页给出：成事不说，遂事不谏，既往不咎。你听得到——在冒险的解释出口之后，是克制；这对你也有用：当你自己的巧解已经说出口，怎样收住。",
          "他还把仁逼向一个陷阱：若告诉仁者「井有仁焉」，是否跟下去？你在活页读到的答复是：君子可逝也，不可陷也；可欺也，不可罔也。当你在网上争「该不该冲」，这一句能拦住你把仁等同于盲目跳井。",
        ],
        bodyEn: [
          'Elsewhere Zai Wo answers Duke Ai about the altars of the land-spirits, naming pine, cypress, and chestnut, and tying the Zhou choice to making the people "in awe." When the Master hears it, Legge gives: things done need no more talk; things that have had their course need no remonstrance; things past need no blame. You can hear restraint after a risky gloss—useful when your own clever etymology has already left your mouth.',
          'He also presses benevolence toward a trap: if told "there is a man in the well," will the benevolent go in? The reply you meet in Legge is that a superior man may be made to go to the well but cannot be made to go down into it; he may be imposed upon, but he cannot be fooled. When you debate duty online, that line keeps you from equating ren with blind plunge.',
        ],
      },
      {
        headingZh: "你该慢慢读的三年之丧对话",
        headingEn: "The mourning exchange you should read slowly",
        imageSlot: "mourning-three-years",
        bodyZh: [
          "宰我最长的一场，是他争三年之丧太久、一年即可——君子三年不为礼乐则礼坏乐崩；旧谷既没、新谷既升、钻燧改火，期可已矣。夫子问：食稻衣锦，于女安乎？他说安。于是：女安，则为之——但君子居丧，食旨不甘、闻乐不乐、居处不安。宰我出后，夫子叹予之不仁，并提孩子三年免于父母之怀，与天下通丧，追问予也有三年之爱于其父母乎。你该把这场读成「安」与「爱」的对峙，而不是贴到每场家事争吵上的口号。",
        ],
        bodyEn: [
          "The longest Zai Wo scene is his argument that one year of mourning for parents is enough—rites and music would collapse if a superior man paused three years; grain and fire-wood cycles already turn in a year. The Master asks whether, after a year, eating good rice and wearing embroidered clothes would leave him at ease; Wo says yes. Then: if you feel at ease, do it—but a superior man in mourning does not enjoy pleasant food or music or easy lodging. After Wo leaves, the Master speaks of want of virtue, the three years a child stays in parents' arms, and the three years' mourning as universally observed—asking whether Yu enjoyed that three years' love. You should read that exchange as one drama of ease versus love, not as a slogan you paste onto every family quarrel.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的宰我是谁？",
        questionEn: "Who was Zai Wo in the Analects?",
        answerZh:
          "你在《论语》里遇见的宰我（又名宰予），是以言语见称、又以尖锐提问逼出硬教诲的弟子。你最好的答案是场景本身：问社、井有仁焉、昼寝、弟子分科，以及三年之丧的辩论——而不是文本外编造的现代履历。",
        answerEn:
          "You meet Zai Wo (also Tsai Wo / Tsai Yu in Legge) as a disciple remembered for speech and for questions that provoke hard teaching. Your best answer is the scenes themselves: altars, the well, daytime sleep, the disciple grouping, and the three-year mourning debate—not a modern résumé invented outside the text.",
      },
      {
        questionZh: "为什么有人搜「宰我」？",
        questionEn: 'Why do people search "zai wo"?',
        answerZh:
          "你往往想先弄清身份：是哪位弟子、哪次著名责备、哪场丧期争论。搜到这个词之后，请打开活页章句，而不要依赖一篇会捏造章号或软化夫子原话的摘要。你把原文、白话导读与英译分层来读，阅读才站得住。",
        answerEn:
          "You often want a clear identity: which disciple, which famous rebuke, which mourning argument. Search that phrase, then open the live passages rather than a summary that invents chapter numbers or softens the Master's words. Your reading stays honest when you keep source, vernacular guide, and English in separate layers.",
      },
      {
        questionZh: "他只是负面教材吗？",
        questionEn: "Was he only a negative example?",
        answerZh:
          "你会看见严厉的责备——朽木、不仁——同时也会看见他与子贡同列言语。你两面都要握住，别把他压扁成卡通反派。你的功课是察觉：什么时候流畅的论证已经跑在心安前面，而不是从《论语》里收集反派。",
        answerEn:
          "You will see sharp blame—rotten wood, want of virtue—yet you also see him listed for ability in speech beside Zigong. Hold both without flattening him into a cartoon villain. Your task is to notice when fluent argument outruns ease of conscience, not to collect villains from the Analects.",
      },
      {
        questionZh: "关于他，你该先读哪一章？",
        questionEn: "What should you read first about him?",
        answerZh:
          "若你想先看一场把双方声音都展足的对话，请从三年之丧那章入手，再对照昼寝、问社与井有仁焉等较短的试探。你随时可以回到人物索引那一行，免得在房间里听丢了究竟谁在说话。",
        answerEn:
          "If you want one scene that shows his voice and the Master's reply at full length, start with the mourning dialogue, then compare the shorter tests on sleep, altars, and the well. You can return to the people-index note anytime you lose the thread of who is speaking in the room.",
      },
      {
        questionZh: "怎样并用白话导读与原文？",
        questionEn: "How should you use Legge's English with the Chinese source?",
        answerZh:
          "你可以在同一页上对照原文与白话导读，需要时再看公版英译；不要假装某一层就是唯一措辞，也不要因为改写更顺口就发明一句「孔子说过」。你引用时，应标明自己用的是哪一层。",
        answerEn:
          "You can quote Legge as the site's public-domain English layer while you keep the Chinese source visible on the same page. Do not pretend the translation is the only wording, and do not invent a saying because a paraphrase feels smoother. Your citation should name which layer you used.",
      },
      {
        questionZh: "这篇笔记不是什么？",
        questionEn: "What is not this essay?",
        answerZh:
          "你在这里找不到完整的弟子传记、孝礼操作手册，或仁与君子的通论入门。那些主题只在宰我的提问把它们逼出来时才出现。你的下一步是篇章页，而不是另一篇重复本站其他阅读笔记的总览。",
        answerEn:
          "You will not find here a full disciple biography, a filial-ritual how-to, or a general primer on ren and the junzi. Those themes appear only where Zai Wo's questions force them. Your next step is the passage page, not a second overview that repeats other reading notes on this site.",
      },
      {
        questionZh: "怎样避免 AI 编造宰我语录？",
        questionEn: "How do you keep AI from inventing Zai Wo quotes?",
        answerZh:
          "若你用模型当阅读助手，应粘贴活页原文再追问，而不是在没有出处时问「孔子一定是什么意思」。你应一律拒绝新捏造的《论语》句子。你的核验路径始终是本站已发布的篇章地址，lunyu.ai。",
        answerEn:
          'If you use a model as a reading aid, you should paste the live passage text and ask for questions, not for "what Confucius must have meant" without a source. Always refuse any newly minted Analects line. Your verification path is always the published chapter URL on this site, lunyu.ai.',
      },
    ],
    afterFaqSections: [
      {
        headingZh: "接下来读三年之丧那一章",
        headingEn: "Read the mourning page next",
        bodyZh: [
          "当你准备坐下来读最长的那一场，请打开[论语 · 阳货 17.21](https://www.lunyu.ai/zh-Hans/analects/yang-huo/yang-huo-021)，把原文、白话导读与英译并排对照。你问问自己：在你自己的话里，「安」止于何处、「爱」起于何处——然后停住，回到文本，而不是回到一篇宰我摘要。",
        ],
        bodyEn: [
          "When you are ready to sit with the longest exchange, open [The Analects · Yang Ho 17.21](https://www.lunyu.ai/en/analects/yang-huo/yang-huo-021) and read source, guide, and Legge side by side. Ask yourself where ease ends and love begins in your own speech—then stop, and return to the text rather than to a summary of Zai Wo.",
        ],
      },
    ],
  },
  {
    slug: "what-is-a-junzi",
    titleZh: "《论语》里的「君子」是什么意思？",
    titleEn: "What Is a Junzi in the Analects?",
    dekZh:
      "你在搜索「君子是什么意思」时，多半想要可核对的名字，而不是成功学口号。在《论语》里，君子是行事与判断的角色——用学习、义、不被人知时能否自持来衡量——不是官职或出身。你可以先记住一句短定义，再打开本站活页，把原文、白话导读与英译分层来读。",
    dekEn:
      'When you search "what is a junzi," you usually want a checkable name, not a success slogan. In the Analects the junzi is a role of conduct and judgment—someone measured by learning, rightness, and how they hold themselves when unrecognized—not by office or pedigree. You can quote a short definition here, then open the lines themselves on this site and keep source, guide, and Legge\'s English in their layers.',
    descriptionZh:
      "君子不是成功学标签。一句可引用的定义、常见英译误区，以及可打开的原文入口。",
    descriptionEn:
      "Junzi is not a status label. A short Analects definition, translation map, and passage doors you can open on this site.",
    datePublished: "2026-09-14",
    dateModified: "2026-09-16",
    tagsZh: ["君子", "定义", "论语"],
    tagsEn: ["junzi", "definition", "Analects"],
    related: ["/analects/wei-zheng/wei-zheng-012", "/index/junzi", "/blogs/ren-junzi-and-everyday-conduct"],
    cover: notesBlogImage(
      "what-is-a-junzi",
      "cover.jpg",
      "Empty vessel outline beside a quiet study desk — junzi as not a fixed vessel (Analects 2.12)",
      "空器轮廓与素净书案——君子「不器」（《论语》为政 2.12）",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "what-is-a-junzi",
        "inline-1.jpg",
        "Soft paper slips with competing English glosses (gentleman, superior man, exemplary person) around an empty vessel — translation tension, not a ranking",
        "淡墨纸签上互相拉扯的英译标签（gentleman / superior man / exemplary person）环绕空器——译词张力，非排行",
        NOTES_INLINE_SIZE
      ),
      "inline-2": notesBlogImage(
        "what-is-a-junzi",
        "inline-2.jpg",
        "Misty fork in a path — restrained junzi / xiaoren contrast without cartoon villainy",
        "雾中分岔小路——克制的君子/小人对照，非卡通善恶脸谱",
        NOTES_INLINE_SIZE
      ),
    },
    sections: [
      {
        headingZh: "一句可以引用的短答",
        headingEn: "A short answer you can quote",
        bodyZh: [
          "你可以这样说：君子是书中用行事与判断来衡量的人，不是用等级来衡量的人。这个名字指向你如何学习、如何在义与利之间权衡，以及别人不注意你时你是否仍能自持。它不等于「成功人士」、名流，或出身徽章。本站实体索引[君子](https://www.lunyu.ai/zh-Hans/index/junzi)用一行写出同一条脊骨：君子可以无名、可以贫穷；这个名字不肯拿义去换利。你该把它当作走进篇章的门，而不是可贴在身上的人格品牌。",
        ],
        bodyEn: [
          "You can say it this way: a junzi is the person the book measures by conduct and judgment, not by rank. The name points to how you learn, how you weigh rightness against gain, and whether you stay steady when others take no note of you. It does not mean \"successful person,\" celebrity, or a badge of birth. On this site the entity hub [Junzi](https://www.lunyu.ai/en/index/junzi) states the same spine in one line: a junzi may go unnamed and may be poor; what the name will not trade away is rightness for profit. You should treat that as a door into passages, not as a personality brand you wear.",
        ],
      },
      {
        headingZh: "英译为什么互相拉扯",
        headingEn: "Why the English glosses fight each other",
        imageSlot: "inline-1",
        bodyZh: [
          "当你遇见 gentleman，你会带上阶层礼数与社交光泽——汉字并不要求这些。当你遇见 Legge 的 superior man，很容易听成社会等级，尽管他许多句子谈的是义、学与克制。「Exemplary person」试图躲开血统，却又可能听成现代榜样海报。你最好把拼音 junzi 留在眼前，再把每一层英译当 gloss——而不是一次钉死汉字的替换。你的核对点始终是活页篇章：同一页上的原文、白话导读与公版 Legge。",
        ],
        bodyEn: [
          'When you meet "gentleman," you inherit class manners and social polish the Chinese name does not require. When you meet Legge\'s "superior man," you easily hear social rank, even though many of his lines are about rightness, learning, and restraint. "Exemplary person" tries to dodge pedigree, yet it can sound like a modern role model poster. You do best to keep the romanization junzi in view, then read each English layer as a gloss—not as a replacement that settles the word once. Your check is always the live passage: source Chinese, modern guide, and public-domain Legge on the same page.',
        ],
      },
      {
        headingZh: "文本里的三道门",
        headingEn: "Three doors in the text",
        bodyZh: [],
        bodyEn: [],
      },
      {
        headingZh: "不器",
        headingEn: "Not a vessel",
        bodyZh: [
          "你该先打开的一句短文，是为政 2.12。Legge 译作：The accomplished scholar is not a utensil。器是指定用途的工具；君子不被收成一个官职、一种专长，或一种雇来就搁上架的功能。你可以让这句话拦住把人——包括你自己——压成单一技能标签的习惯。当你准备把中文与英文并排坐下来读时，这一章就是本篇笔记的主门。",
        ],
        bodyEn: [
          'One short line you should open first is Wei Chang 2.12. Legge gives: "The accomplished scholar is not a utensil." A vessel is a tool with one assigned use; the junzi is not stored as one office, one talent, or one function you hire and shelve. You can let that sentence stop a habit of reducing people—including yourself—to a single skill label. When you are ready to sit with the Chinese and the English together, that chapter is the main door on this Note.',
        ],
      },
      {
        headingZh: "人不知而不愠",
        headingEn: "Unmoved when unknown",
        bodyZh: [
          "书的开篇学而 1.1，把君子放在「人不知而不愠」之后。Legge 问：he is not a man of complete virtue, who feels no discomposure though men may take no note of him 吗。你没有拿到一套「如何经营名声」的手册；你拿到的是这个名字的第一个条件：被看见不是称号的代价。这里只轻轻点这扇门——本篇笔记不重写「怎么读」的长文。若这句话抓住你，下一步是活页篇章，而不是另编章号的摘要。",
        ],
        bodyEn: [
          'The book\'s opening chapter, Hsio R. 1.1, places the junzi after "men take no note of him." Legge asks whether he is not "a man of complete virtue, who feels no discomposure though men may take no note of him." You are not given a how-to for fame management; you are given a first condition of the name: recognition is not the price of the title. Hold that lightly here—this Note only points the door; it does not rewrite a how-to-read essay. Your next move, if the line catches you, is the live chapter page, not a summary that invents extra numbers.',
        ],
      },
      {
        headingZh: "义与利",
        headingEn: "Right vs profit",
        bodyZh: [
          "里仁 4.16 把对照放在你用的尺度上，而不是血统上。Legge：The mind of the superior man is conversant with righteousness; the mind of the mean man is conversant with gain。你可以听见义与利是两种权衡选择的方式。当你问君子「是」什么，这扇门用心灵常与什么相习来答——不是用财富、官职，或把其余所有人画成卡通反派。你引用时对着活页里仁章；不要把章号单独漂成口号。",
        ],
        bodyEn: [
          'Le Jin 4.16 sets the contrast on the measure you use, not on pedigree. Legge: "The mind of the superior man is conversant with righteousness; the mind of the mean man is conversant with gain." You can hear yi (rightness) against li (profit) as two ways of weighing a choice. When you ask what a junzi "is," this door answers by what the mind stays conversant with—not by wealth, office, or a villain cartoon of everyone else. Cite the live Le Jin page when you quote; do not float the number alone as if it were a slogan.',
        ],
      },
      {
        headingZh: "君子与小人（只作对照）",
        headingEn: "Junzi and xiaoren (contrast only)",
        imageSlot: "inline-2",
        bodyZh: [
          "你常会遇见小人与君子成对出现。在本站，这对标记的是尺度：利、偏党、同而不和、贫而无固——在它变成阶层侮辱或卡通反派之前。你该先读成对的那一行，并拒绝把「小人」扔成对陌生人的社会骂名。这一节停在对照；它不会变成日常习惯手册。若你要的是仁与君子的日常行事作为练习，那是本站另一篇笔记，不是把你带来的定义问题重写一遍。",
        ],
        bodyEn: [
          "You will often meet xiaoren paired with junzi. On this site that pairing marks a measure: profit, partiality, sameness without harmony, overflow in poverty—before it names a class insult or a cartoon villain. You should read the paired line first and refuse to turn \"small person\" into a social slur you throw at strangers. This section stops at contrast; it does not become a daily-habits handbook. If you want everyday ren and junzi conduct as practice, that is another Note on this site, not a rewrite of the definition question you brought here.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的君子是什么意思？",
        questionEn: "What does junzi mean in the Analects?",
        answerZh:
          "你可以这样引用：君子是一种行事与判断的角色——学习、义、不被人知时仍能自持——不是地位徽章，也不是成功的同义词。书在场景里检验这个名字，而不是塞进一个词典格子。你最短的诚实答案，仍应把你送回本站可核对的篇章地址，而不是一句励志改写。",
        answerEn:
          "You can quote this: a junzi is a role of conduct and judgment—learning, rightness, steadiness when unrecognized—not a status badge or a synonym for success. The book tests the name in scenes, not in a single dictionary box. Your shortest honest answer still sends you back to a passage URL on this site rather than to a motivational paraphrase.",
      },
      {
        questionZh: "哪个英译最不误导？",
        questionEn: "Which English word is least misleading?",
        answerZh:
          "你不该把任何一个当作终局。Gentleman 偷运阶层礼数；superior man 易听成等级；exemplary person 或听成海报。把 junzi 留在问题标题，再把 Legge 当汉字旁公版英译。你最少误导的做法是分层活页，不是先选定英文赢家。",
        answerEn:
          'You should treat none as final. "Gentleman" smuggles class manners; "superior man" is easily heard as rank; "exemplary person" can sound like a poster. Keep junzi in the title of your question, then use Legge as one public-domain layer beside the Chinese. Your least-misleading move is the layered page, not a single English winner.',
      },
      {
        questionZh: "有没有一句能定义君子？",
        questionEn: "Is there one sentence that defines junzi?",
        answerZh:
          "你不会找到一句对每个提问者都封死名字的句子。不同弟子听见不同条目——先行其言、不忧不惧、修己以敬——而书开篇就把君子系在学习、与不被人知而不愠上。你的「定义」是一簇门，不是可贴到每场职场谈话上的口号。",
        answerEn:
          'You will not find one line that closes the name for every asker. Different disciples hear different items—act before speaking, be without anxiety or fear, cultivate with reverence—and the book opens by tying the junzi to learning and to being unmoved when unknown. Your "definition" is a cluster of doors, not a slogan you paste onto every career talk.',
      },
      {
        questionZh: "君子可以贫穷或默默无闻吗？",
        questionEn: "Can a junzi be poor or unknown?",
        answerZh:
          "可以。开篇章已经把名字放在「人不知」之后；别处也允许固穷而不取消这个称号。你不该把君子等同于曝光、官职或安逸。贫穷或匿名仍可留下不肯拿去换利的义；那正是这个名字不肯卖掉的一部分。",
        answerEn:
          "Yes. The opening chapter already places the name after going unrecognized, and elsewhere the book allows firmness in want without canceling the title. You should not equate junzi with visibility, office, or comfort. Poverty or anonymity can still leave rightness untraded; that is part of what the name refuses to sell.",
      },
      {
        questionZh: "这和「做更好的人」建议页有何不同？",
        questionEn: 'How is this different from "be a better person" advice pages?',
        answerZh:
          "你在读的是定义与篇章门笔记，不是习惯教练。本页勾出词义、互相打架的英译，以及几扇你可打开的《论语》活门。仁与君子的日常行事，属于[仁、君子与日常行为](https://www.lunyu.ai/zh-Hans/blogs/ren-junzi-and-everyday-conduct)——链一次，不在此重写。你的下一步核对仍停在原文，而不是第二份自助提纲。",
        answerEn:
          "You are reading a definition and passage-door Note, not a habit coach. This page maps the word, the fighting English glosses, and a few live Analects doors you can open. Everyday ren and junzi conduct belongs to [Ren, Junzi, and Everyday Conduct](https://www.lunyu.ai/en/blogs/ren-junzi-and-everyday-conduct)—link once, do not rewrite it here. Your next check stays on source text, not on a second self-help outline.",
      },
      {
        questionZh: "小人只是反派吗？",
        questionEn: "Is the xiaoren simply a villain?",
        answerZh:
          "你不该把这对压扁成那样。小人通常先标出尺度的对照——利、偏党、同而不和——在它变成反派之前。请在活页上读成对的那一行；拒绝把半本书收成骂人话的卡通。你的任务是看清自己在用哪一种尺度，而不是从《论语》里收集敌人。",
        answerEn:
          "You should not flatten the pair that way. Xiaoren usually marks a contrast of measure—profit, partiality, conformity without harmony—before it names a villain. Read the paired line on the live pages; refuse a cartoon that turns half the book into insults. Your task is to notice which measure you are using, not to collect enemies from the Analects.",
      },
      {
        questionZh: "接下来该去本站哪里？",
        questionEn: "Where should you go next on this site?",
        answerZh:
          "请先打开「不器」那一短章，当作你第一次坐下的文本；若要更宽的地图，再从实体索引浏览更多君子诸句。你把原文、白话导读与 Legge 并排可见，并拒绝任何新捏造的「孔子说过」。你的核验路径始终是 lunyu.ai 已发布的地址。",
        answerEn:
          'Open the short "not a vessel" chapter as your first sitting text, then browse more junzi lines from the entity index when you want the wider map. You keep source, guide, and Legge visible together and refuse any newly minted Confucius quote. Your verification path is always a published URL on lunyu.ai.',
      },
    ],
    afterFaqSections: [
      {
        headingZh: "先打开这一句，再回索引",
        headingEn: "Open the line, then the index",
        bodyZh: [
          "当你准备用一句短文检验这个名字，请打开[论语 · 为政 2.12](https://www.lunyu.ai/zh-Hans/analects/wei-zheng/wei-zheng-012)，把原文、白话导读与 Legge 并排来读。你问问自己：是否把你自己——或别人——当成了单一用途的器。然后再回君子索引找更多门，并让这篇定义笔记与日常行事姊妹篇分开。",
        ],
        bodyEn: [
          "When you are ready to test the name against one short sentence, open [The Analects · Wei Chang 2.12](https://www.lunyu.ai/en/analects/wei-zheng/wei-zheng-012) and read source, guide, and Legge side by side. Ask whether you have been treating yourself—or someone else—as a single-use vessel. Then return to the Junzi index for more doors, and keep this definition Note separate from the everyday-conduct sister page.",
        ],
      },
    ],
  },
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
      "/blogs/learning-practice-and-review",
      "/blogs/ai-boundaries-for-classic-texts",
    ],
    ...notesCoverAndInlines(
      "how-to-read-the-analects",
      {
        altEn: "Quiet study desk with open Analects and one empty sentence line — how to read the Analects",
        altZh: "安静书案上摊开的《论语》与一行留白——如何读《论语》",
      },
      {
        altEn: "Three blank layered paper strips — original, guide, and translation as strata",
        altZh: "三层空白纸条叠放——原文、导读与英译的分层阅读",
      },
      {
        altEn: "Three quiet stones beside an open book — three reusable questions",
        altZh: "翻开书册旁三颗安静的卵石——可复用的三问",
      }
    ),
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
        imageSlot: "inline-1",
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
        imageSlot: "inline-2",
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
    ...notesCoverAndInlines(
      "ren-junzi-and-everyday-conduct",
      {
        altEn: "Two empty tea cups on wood — everyday kindness and conduct",
        altZh: "木案上两只空茶杯——日常待人中的仁",
      },
      {
        altEn: "Overlapping ink circles — ren lived in relationships",
        altZh: "交叠的水墨圆圈——关系中的仁",
      },
      {
        altEn: "Forked quiet path through mist — junzi and xiaoren diverge",
        altZh: "雾中分岔小径——君子与小人的分岔",
      }
    ),
    sections: [
      {
        headingZh: "仁从关系里显现",
        headingEn: "Ren appears in relationships",
        imageSlot: "inline-1",
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
        imageSlot: "inline-2",
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
    ...notesCoverAndInlines(
      "learning-practice-and-review",
      {
        altEn: "Open book with soft ink enso — learning and timely practice",
        altZh: "翻开书册与淡墨圆圈——学而时习",
      },
      {
        altEn: "Footprints on a path beside an open notebook — practice tests learning",
        altZh: "翻开笔记旁小径上的足迹——行为检验所学",
      },
      {
        altEn: "Soft ink loop returning to a quiet mark — revisiting one sentence",
        altZh: "淡墨回环落回一处墨迹——反复回访同一句",
      }
    ),
    sections: [
      {
        headingZh: "学习的检验在行为",
        headingEn: "Learning is tested in conduct",
        imageSlot: "inline-1",
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
        imageSlot: "inline-2",
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
    ...notesCoverAndInlines(
      "filial-conduct-ritual-and-care",
      {
        altEn: "Incense bowl and folded cloth on parchment — filial care and ritual",
        altZh: "宣纸上香炉与叠好的布巾——孝与礼",
      },
      {
        altEn: "Two ink hands offering care without kneeling drama — respect is not blind obedience",
        altZh: "两只水墨手势的递送——敬意而非盲从",
      },
      {
        altEn: "Empty bowl and folded cloth placed with care — form makes care visible",
        altZh: "空碗与叠好的布巾安静摆放——形式使关怀可见",
      }
    ),
    sections: [
      {
        headingZh: "孝不是单纯顺从",
        headingEn: "Filial conduct is not mere obedience",
        imageSlot: "inline-1",
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
        imageSlot: "inline-2",
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
    ...notesCoverAndInlines(
      "ai-boundaries-for-classic-texts",
      {
        altEn: "Open classic book beside an empty framed margin — classics and AI boundaries",
        altZh: "翻开的经典与空白边框——经典文本与边界",
      },
      {
        altEn: "Three blank paper layers over mist landscape — source, translation, and guide",
        altZh: "雾中三层空白纸条——源文、译文与导读分层",
      },
      {
        altEn: "Open classic page with bookmark and quiet citation space — quotable passages",
        altZh: "带书签的翻开书页与引文留白——可引用的章句页",
      }
    ),
    sections: [
      {
        headingZh: "先保护文本边界",
        headingEn: "Protect textual boundaries first",
        imageSlot: "inline-1",
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
        imageSlot: "inline-2",
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

const PASSAGE_PATH = /\/analects\/([a-z0-9-]+)\/([a-z0-9-]+)(?![a-z0-9-])/g;

function editorialPlainTexts(post: EditorialPost, locale: Locale) {
  const sections = post.sections.flatMap((section) =>
    locale === "zh-Hans" ? section.bodyZh : section.bodyEn
  );
  const faqs = (post.faqs ?? []).flatMap((faq) =>
    locale === "zh-Hans"
      ? [faq.questionZh, faq.answerZh]
      : [faq.questionEn, faq.answerEn]
  );
  const after = (post.afterFaqSections ?? []).flatMap((section) =>
    locale === "zh-Hans" ? section.bodyZh : section.bodyEn
  );
  return [locale === "zh-Hans" ? post.dekZh : post.dekEn, ...sections, ...faqs, ...after];
}

/** Passage paths a Note already cites in `related` or in an approved body link. */
function citedPassagePaths(post: EditorialPost) {
  const paths = new Set<string>();
  for (const relatedPath of post.related) {
    if (/^\/analects\/[a-z0-9-]+\/[a-z0-9-]+$/.test(relatedPath)) paths.add(relatedPath);
  }
  const blobs = [
    post.dekZh,
    post.dekEn,
    post.descriptionZh ?? "",
    post.descriptionEn ?? "",
    ...post.sections.flatMap((section) => [...section.bodyZh, ...section.bodyEn]),
    ...(post.faqs ?? []).flatMap((faq) => [
      faq.questionZh,
      faq.questionEn,
      faq.answerZh,
      faq.answerEn,
    ]),
    ...(post.afterFaqSections ?? []).flatMap((section) => [...section.bodyZh, ...section.bodyEn]),
  ];
  for (const blob of blobs) {
    for (const match of blob.matchAll(PASSAGE_PATH)) {
      paths.add(`/analects/${match[1]}/${match[2]}`);
    }
  }
  return [...paths];
}

const postsByPassage = new Map<string, EditorialPost[]>();
for (const post of editorialPosts) {
  for (const passagePath of citedPassagePaths(post)) {
    const list = postsByPassage.get(passagePath);
    if (list) list.push(post);
    else postsByPassage.set(passagePath, [post]);
  }
}

/** Notes that already list this path in `related`. */
export function editorialPostsForPath(path: string) {
  return editorialPosts.filter((post) => post.related.includes(path));
}

/** Notes that already list an index entry in `related` — used for the reverse index → Note link. */
export function editorialPostsForIndexSlug(slug: string) {
  return editorialPostsForPath(`/index/${slug}`);
}

/** Notes that cite this passage, for the reverse passage → Note link. */
export function editorialPostsForPassage(path: string) {
  return postsByPassage.get(path) ?? [];
}

/**
 * Label for a Note's related chip.
 * Body links that already use the target Note's title stay on the path label,
 * so the editorial "body link once" check is not doubled by the nav chip.
 */
export function relatedLinkLabel(locale: Locale, post: EditorialPost, relatedPath: string) {
  if (!relatedPath.startsWith("/blogs/")) return relatedPath;
  const target = getEditorialPost(relatedPath.slice("/blogs/".length));
  if (!target) return relatedPath;
  const title = postTitle(locale, target);
  const alreadyInBody = editorialPlainTexts(post, locale).some((text) =>
    text.includes(`[${title}](`)
  );
  return alreadyInBody ? relatedPath : title;
}

export function postTitle(locale: Locale, post: EditorialPost) {
  return t(locale, post.titleZh, post.titleEn);
}

export function postDek(locale: Locale, post: EditorialPost) {
  return t(locale, post.dekZh, post.dekEn);
}

export function postDescription(locale: Locale, post: EditorialPost) {
  return t(
    locale,
    post.descriptionZh ?? post.dekZh,
    post.descriptionEn ?? post.dekEn
  );
}

export function postTags(locale: Locale, post: EditorialPost) {
  return locale === "zh-Hans" ? post.tagsZh : post.tagsEn;
}

export function latestEditorialModifiedDate(fallback = "") {
  return editorialPosts.reduce(
    (latest, post) => (post.dateModified > latest ? post.dateModified : latest),
    fallback
  );
}

export function parseEditorialLinks(text: string): EditorialTextPart[] {
  const parts: EditorialTextPart[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(EDITORIAL_MARKDOWN_LINK)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    parts.push({ type: "link", label: match[1], href: match[2] });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }
  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

export function toEditorialHref(href: string): string {
  try {
    const url = new URL(href, `${siteUrl}/`);
    if (SITE_HOSTS.has(url.hostname)) {
      return `${url.pathname}${url.search}${url.hash}` || "/";
    }
  } catch {
    return href;
  }
  return href;
}

export function editorialImageUrl(image: EditorialImage) {
  if (image.src.startsWith("http://") || image.src.startsWith("https://")) return image.src;
  return `${siteUrl}${image.src.startsWith("/") ? image.src : `/${image.src}`}`;
}
