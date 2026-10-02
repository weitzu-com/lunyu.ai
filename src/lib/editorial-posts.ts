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
