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
  file: "cover.jpg" | "inline-1.jpg" | "inline-2.jpg",
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

/** Notes that already list an index entry in `related` — used for the reverse index → Note link. */
export function editorialPostsForIndexSlug(slug: string) {
  const path = `/index/${slug}`;
  return editorialPosts.filter((post) => post.related.includes(path));
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
