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

const zhArticleLater =
  "中文全文将于稍后发布。此页目前只保留英文札记；下面的简体文字是预告，不是已完稿的完整文章。";
const zhFaqLater =
  "中文解答将随全文于稍后发布。请先阅读本页英文问答，不要把这句预告当成已完成的简体札记。";

export const editorialPosts: EditorialPost[] = [
  {
    slug: "zhongshu-reciprocity-in-the-analects",
    titleZh: "《论语》的忠恕：不是愚忠，也不是英文 Golden Rule",
    titleEn: "Zhongshu in the Analects: Loyalty, Reciprocity, and What They Are Not",
    dekZh: zhArticleLater,
    dekEn:
      "When you meet zhongshu (忠恕) on a quote card or in a search snippet, you usually want a checkable pair, not a soft slogan. In the Analects the name holds two moves together: finishing what a matter asks of you, and stopping before you impose what you yourself would refuse. You can quote a short split here, then open the live passages on this site and keep source, guide, and Legge's English in their layers.",
    descriptionEn:
      "Zhongshu is a paired Analects teaching—not blind loyalty and not a soft Golden Rule. Open the passages on this site.",
    datePublished: "2026-09-15",
    dateModified: "2026-09-15",
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
      "Two symmetrical empty seats across quiet blank space — zhong and shu as a paired teaching, not a slogan poster",
      "对称空席与双向留白——忠与恕作为成对之教，而非口号海报",
      { width: 1200, height: 630 }
    ),
    inlineImages: {
      "inline-1": notesBlogImage(
        "zhongshu-reciprocity-in-the-analects",
        "inline-1.jpg",
        "Empty bowl beside a soft boundary line — shu as a restrained “do not unto others” limit, not a threat",
        "空碗与淡墨边界——恕作为「己所不欲」的克制边界，而非恐吓",
        NOTES_INLINE_SIZE
      ),
      "inline-2": notesBlogImage(
        "zhongshu-reciprocity-in-the-analects",
        "inline-2.jpg",
        "Misty fork between an upright measured path and a bent following trail — zhong is not blind loyalty",
        "雾中分岔：直立有度之路与盲从弯道——忠不等于愚忠",
        NOTES_INLINE_SIZE
      ),
    },
    sections: [
      {
        headingZh: "一句可以引用的短答",
        headingEn: "A short answer you can quote",
        bodyZh: [zhArticleLater],
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
        bodyZh: [zhArticleLater],
        bodyEn: [
          "When you hear shu, you often hear the lifelong word Confucius grants when asked for one practice for life: what you do not want done to yourself, do not do to others. That door is a restraint—you stop before you impose—not a positive order to hand others your preferred gifts. You do best to keep the prohibition in view, then refuse to collapse shu into a modern “be nice” poster. Your check is the live chapter, not a paraphrase that flips the direction of the rule.",
        ],
      },
      {
        headingZh: "忠：不是「服从在上者」",
        headingEn: "Zhong: not “obey whoever is above you”",
        bodyZh: [zhArticleLater],
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
        bodyZh: [zhArticleLater],
        bodyEn: [
          "One door you should open first is Le Jin 4.15. Confucius tells Zengzi his way is threaded on one strand; after the Master leaves, Zengzi restates it for the other disciples: the Master’s way is zhong and shu, and that is all. You are hearing a disciple’s summary, not a definition Confucius posted on the wall. Legge’s public-domain English on that page paraphrases the pair rather than printing the Chinese syllables—zhongshu stays visible in the source line. When you are ready to sit with Chinese, guide, and Legge together, that chapter is the main door on this Note.",
        ],
      },
      {
        headingZh: "终身之言：「其恕乎」",
        headingEn: "The lifelong word: “is it not shu?”",
        bodyZh: [zhArticleLater],
        bodyEn: [
          "A second door is Wei Ling Kung 15.23. Zi Gong asks whether one word can serve as a rule of practice for all one’s life; Confucius answers shu, then states the prohibition: what you do not want done to yourself, do not do to others. You can open [The Analects · Wei Ling Kung 15.23](https://www.lunyu.ai/en/analects/wei-ling-gong/wei-ling-gong-023) when you want that daily restraint in full. Hold it as a doorway into shu—not as proof that zhongshu collapses into one English Golden Rule. Your next move, if the line catches you, is the live chapter page, not a summary that invents extra numbers.",
        ],
      },
      {
        headingZh: "三种常见的塌缩",
        headingEn: "Common collapses to refuse",
        imageSlot: "inline-2",
        bodyZh: [zhArticleLater],
        bodyEn: [
          "You will meet three easy collapses. First, reading zhong as blind loyalty to whoever is above you—refuse that; the book pairs minister’s zhong with the ruler’s li, and elsewhere tests zhong as finishing what was entrusted. Second, treating “what you do not want…” as the whole of zhongshu or as identical to the usual Golden Rule that tells you to give others what you want—the direction is not the same. Third, name confusion: zhongshu the teaching is not the disciple Zhong Gong; if you meant the person, open [Zhong Gong](https://www.lunyu.ai/en/index/zhong-gong) once and leave this concept Note. You should also keep zhongshu separate from a full rewrite of ren or junzi everyday-conduct essays—this page only splits the pair and opens doors.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的忠恕是什么？",
        questionEn: "What is zhongshu in the Analects?",
        answerZh: zhFaqLater,
        answerEn:
          "You can quote this: zhongshu is a paired teaching—zhong as finishing what the matter asks of you, shu as stopping before you impose what you yourself would refuse. It is not blind loyalty, not a soft “be nice” slogan, and not a single English Golden Rule. Your shortest honest answer still sends you back to a passage URL on this site rather than to a motivational paraphrase.",
      },
      {
        questionZh: "「忠恕而已矣」是孔子说的吗？",
        questionEn: "Did Confucius say “zhong and shu, and that is all”?",
        answerZh: zhFaqLater,
        answerEn:
          "You should credit Zengzi’s restatement in Le Jin 4.15, not invent a wall slogan from Confucius’s own mouth in that scene. The Master speaks of an all-pervading unity; Zengzi names the pair for the other disciples after the Master leaves. Your check is the live chapter—source Chinese, guide, and Legge—rather than a floating meme that erases who said which line.",
      },
      {
        questionZh: "「己所不欲…」就是恕的全部吗？",
        questionEn: "Is “what you do not want done to yourself…” the whole of shu?",
        answerZh: zhFaqLater,
        answerEn:
          "You meet that prohibition as the lifelong word in Wei Ling Kung 15.23, and it is the daily door for shu—a restraint, not a positive gift list. You should not treat it as the entire pair zhongshu, nor flip it into “give others what you want.” Your honest reading keeps the prohibition’s direction and leaves zhong as the other half of the teaching.",
      },
      {
        questionZh: "忠该译成 loyalty 吗？",
        questionEn: "Should zhong be translated “loyalty”?",
        answerZh: zhFaqLater,
        answerEn:
          "You can use “loyalty” as one English gloss if you keep the scenes in view—planning for others, speech, affairs entrusted—but you should refuse “blind loyalty” as the meaning. Legge and other layers often say “faithful” or similar; none settles the Chinese once. Your least-misleading move is the layered page beside the romanization zhong, not a single English winner.",
      },
      {
        questionZh: "忠恕就是仁吗？",
        questionEn: "Is zhongshu the same as ren?",
        answerZh: zhFaqLater,
        answerEn:
          "You should not collapse them. Ren is a wider name of virtue the book tests in many doors; zhongshu is a paired teaching that can thread a way without becoming a synonym for every use of ren. This Note does not rewrite everyday ren and junzi conduct pages. Your next check stays on the zhongshu passages and the entity index, not on a second self-help outline.",
      },
      {
        questionZh: "忠恕就是 Golden Rule 吗？",
        questionEn: "Is zhongshu the Golden Rule?",
        answerZh: zhFaqLater,
        answerEn:
          "You should refuse a simple yes. The Analects door for shu forbids imposing what you would refuse; the usual Golden Rule tells you to treat others as you want to be treated—the direction is not the same. Zi Gong’s fuller positive sentence is precisely what Confucius, elsewhere, says is not yet his. Your careful answer keeps that split instead of pasting one English slogan onto the pair.",
      },
      {
        questionZh: "接下来该去本站哪里？",
        questionEn: "Where should you go next on this site?",
        answerZh: zhFaqLater,
        answerEn:
          "Open Le Jin 4.15 as your first sitting text for the paired summary, then Wei Ling Kung 15.23 when you want the lifelong shu prohibition alone. You keep source, guide, and Legge visible together and refuse any newly minted Confucius quote. Your verification path is always a published URL on lunyu.ai, starting with the main chapter door below.",
      },
    ],
    afterFaqSections: [
      {
        headingZh: "先打开这一句，再回索引",
        headingEn: "Open the line, then the index",
        bodyZh: [zhArticleLater],
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
    dekZh: zhArticleLater,
    dekEn:
      'When you search "what is a junzi," you usually want a checkable name, not a success slogan. In the Analects the junzi is a role of conduct and judgment—someone measured by learning, rightness, and how they hold themselves when unrecognized—not by office or pedigree. You can quote a short definition here, then open the lines themselves on this site and keep source, guide, and Legge\'s English in their layers.',
    descriptionEn:
      "Junzi is not a status label. A short Analects definition, translation map, and passage doors you can open on this site.",
    datePublished: "2026-09-14",
    dateModified: "2026-09-14",
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
        bodyZh: [zhArticleLater],
        bodyEn: [
          "You can say it this way: a junzi is the person the book measures by conduct and judgment, not by rank. The name points to how you learn, how you weigh rightness against gain, and whether you stay steady when others take no note of you. It does not mean \"successful person,\" celebrity, or a badge of birth. On this site the entity hub [Junzi](https://www.lunyu.ai/en/index/junzi) states the same spine in one line: a junzi may go unnamed and may be poor; what the name will not trade away is rightness for profit. You should treat that as a door into passages, not as a personality brand you wear.",
        ],
      },
      {
        headingZh: "英译为什么互相拉扯",
        headingEn: "Why the English glosses fight each other",
        imageSlot: "inline-1",
        bodyZh: [zhArticleLater],
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
        bodyZh: [zhArticleLater],
        bodyEn: [
          'One short line you should open first is Wei Chang 2.12. Legge gives: "The accomplished scholar is not a utensil." A vessel is a tool with one assigned use; the junzi is not stored as one office, one talent, or one function you hire and shelve. You can let that sentence stop a habit of reducing people—including yourself—to a single skill label. When you are ready to sit with the Chinese and the English together, that chapter is the main door on this Note.',
        ],
      },
      {
        headingZh: "人不知而不愠",
        headingEn: "Unmoved when unknown",
        bodyZh: [zhArticleLater],
        bodyEn: [
          'The book\'s opening chapter, Hsio R. 1.1, places the junzi after "men take no note of him." Legge asks whether he is not "a man of complete virtue, who feels no discomposure though men may take no note of him." You are not given a how-to for fame management; you are given a first condition of the name: recognition is not the price of the title. Hold that lightly here—this Note only points the door; it does not rewrite a how-to-read essay. Your next move, if the line catches you, is the live chapter page, not a summary that invents extra numbers.',
        ],
      },
      {
        headingZh: "义与利",
        headingEn: "Right vs profit",
        bodyZh: [zhArticleLater],
        bodyEn: [
          'Le Jin 4.16 sets the contrast on the measure you use, not on pedigree. Legge: "The mind of the superior man is conversant with righteousness; the mind of the mean man is conversant with gain." You can hear yi (rightness) against li (profit) as two ways of weighing a choice. When you ask what a junzi "is," this door answers by what the mind stays conversant with—not by wealth, office, or a villain cartoon of everyone else. Cite the live Le Jin page when you quote; do not float the number alone as if it were a slogan.',
        ],
      },
      {
        headingZh: "君子与小人（只作对照）",
        headingEn: "Junzi and xiaoren (contrast only)",
        imageSlot: "inline-2",
        bodyZh: [zhArticleLater],
        bodyEn: [
          "You will often meet xiaoren paired with junzi. On this site that pairing marks a measure: profit, partiality, sameness without harmony, overflow in poverty—before it names a class insult or a cartoon villain. You should read the paired line first and refuse to turn \"small person\" into a social slur you throw at strangers. This section stops at contrast; it does not become a daily-habits handbook. If you want everyday ren and junzi conduct as practice, that is another Note on this site, not a rewrite of the definition question you brought here.",
        ],
      },
    ],
    faqs: [
      {
        questionZh: "《论语》里的君子是什么意思？",
        questionEn: "What does junzi mean in the Analects?",
        answerZh: zhFaqLater,
        answerEn:
          "You can quote this: a junzi is a role of conduct and judgment—learning, rightness, steadiness when unrecognized—not a status badge or a synonym for success. The book tests the name in scenes, not in a single dictionary box. Your shortest honest answer still sends you back to a passage URL on this site rather than to a motivational paraphrase.",
      },
      {
        questionZh: "哪个英译最不误导？",
        questionEn: "Which English word is least misleading?",
        answerZh: zhFaqLater,
        answerEn:
          'You should treat none as final. "Gentleman" smuggles class manners; "superior man" is easily heard as rank; "exemplary person" can sound like a poster. Keep junzi in the title of your question, then use Legge as one public-domain layer beside the Chinese. Your least-misleading move is the layered page, not a single English winner.',
      },
      {
        questionZh: "有没有一句能定义君子？",
        questionEn: "Is there one sentence that defines junzi?",
        answerZh: zhFaqLater,
        answerEn:
          'You will not find one line that closes the name for every asker. Different disciples hear different items—act before speaking, be without anxiety or fear, cultivate with reverence—and the book opens by tying the junzi to learning and to being unmoved when unknown. Your "definition" is a cluster of doors, not a slogan you paste onto every career talk.',
      },
      {
        questionZh: "君子可以贫穷或默默无闻吗？",
        questionEn: "Can a junzi be poor or unknown?",
        answerZh: zhFaqLater,
        answerEn:
          "Yes. The opening chapter already places the name after going unrecognized, and elsewhere the book allows firmness in want without canceling the title. You should not equate junzi with visibility, office, or comfort. Poverty or anonymity can still leave rightness untraded; that is part of what the name refuses to sell.",
      },
      {
        questionZh: "这和「做更好的人」建议页有何不同？",
        questionEn: 'How is this different from "be a better person" advice pages?',
        answerZh: zhFaqLater,
        answerEn:
          "You are reading a definition and passage-door Note, not a habit coach. This page maps the word, the fighting English glosses, and a few live Analects doors you can open. Everyday ren and junzi conduct belongs to [Ren, Junzi, and Everyday Conduct](https://www.lunyu.ai/en/blogs/ren-junzi-and-everyday-conduct)—link once, do not rewrite it here. Your next check stays on source text, not on a second self-help outline.",
      },
      {
        questionZh: "小人只是反派吗？",
        questionEn: "Is the xiaoren simply a villain?",
        answerZh: zhFaqLater,
        answerEn:
          "You should not flatten the pair that way. Xiaoren usually marks a contrast of measure—profit, partiality, conformity without harmony—before it names a villain. Read the paired line on the live pages; refuse a cartoon that turns half the book into insults. Your task is to notice which measure you are using, not to collect enemies from the Analects.",
      },
      {
        questionZh: "接下来该去本站哪里？",
        questionEn: "Where should you go next on this site?",
        answerZh: zhFaqLater,
        answerEn:
          'Open the short "not a vessel" chapter as your first sitting text, then browse more junzi lines from the entity index when you want the wider map. You keep source, guide, and Legge visible together and refuse any newly minted Confucius quote. Your verification path is always a published URL on lunyu.ai.',
      },
    ],
    afterFaqSections: [
      {
        headingZh: "先打开这一句，再回索引",
        headingEn: "Open the line, then the index",
        bodyZh: [zhArticleLater],
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
