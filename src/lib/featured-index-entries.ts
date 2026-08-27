import type { FeaturedIndexContent, LocalizedText } from "@/lib/featured-index";

const editorialNote: LocalizedText = {
  zh: "此页是索引上的判断与选读，不是新的校勘本。原文、白话导读与英译仍分层留在各章句页。",
  en: "This page judges and selects. It is not a new critical edition. Source text, guide, and translation remain layered on each passage page.",
};

const sharedHeadings = {
  editorialNote,
  confusionsHeading: { zh: "容易混淆的地方", en: "Easy confusions" } satisfies LocalizedText,
  featuredHeading: { zh: "选读", en: "Featured passages" } satisfies LocalizedText,
  viewAllLabel: { zh: "查看全部相关章句", en: "View all related passages" } satisfies LocalizedText,
  practiceHeading: { zh: "今天可以做的一件事", en: "What you can do today" } satisfies LocalizedText,
  faqHeading: { zh: "常见问题", en: "Frequently asked questions" } satisfies LocalizedText,
  relatedHeading: { zh: "相关词条", en: "Related entries" } satisfies LocalizedText,
  booksHeading: { zh: "回到二十篇", en: "Back to the twenty books" } satisfies LocalizedText,
};

function wordPage(
  content: Omit<FeaturedIndexContent, keyof typeof sharedHeadings | "usesHeading"> &
    Partial<Pick<FeaturedIndexContent, keyof typeof sharedHeadings>>
): FeaturedIndexContent {
  return {
    ...sharedHeadings,
    usesHeading: { zh: "书中怎么用这个字", en: "How the word is used in the book" },
    ...content,
  };
}

function personPage(
  content: Omit<FeaturedIndexContent, keyof typeof sharedHeadings | "usesHeading"> &
    Partial<Pick<FeaturedIndexContent, keyof typeof sharedHeadings>>
): FeaturedIndexContent {
  return {
    ...sharedHeadings,
    usesHeading: { zh: "书中怎么出现这个人", en: "How the person appears in the book" },
    ...content,
  };
}

export const moreFeaturedIndexBySlug: Record<string, FeaturedIndexContent> = {
  li: wordPage({
    slug: "li",
    subtitle: {
      zh: "礼不是把仪式做完，而是把敬意收进可以核对的形式。",
      en: "Li is not finishing a ceremony. It is reverence given a form that can be checked.",
    },
    metaDescription: {
      zh: "礼在《论语》里不是空场面，也不是刑法。此页说明它不是玉帛钟鼓，也不是齐之以刑，并链回克己复礼、礼之本与礼云礼云等原文。",
      en: "Li in the Analects is not empty ceremony and not criminal law. This page says what it is not—jade and silk, or aligning the people by punishment—and sends you to 克己复礼, 礼之本, and 礼云礼云.",
    },
    uses: [
      {
        title: { zh: "礼之用，和为贵", en: "Harmony must still be regulated by li" },
        body: {
          zh: "有子说和为贵，随即补上：只知和而不以礼节之，亦不可行。礼在这里是节，不是把场面做热闹。",
          en: "Youzi prizes harmony, then adds the limit: harmony without the restraint of li will not work. Li here is a measure, not a festive mood.",
        },
        sentenceId: "xue-er-012",
      },
      {
        title: { zh: "林放问礼之本", en: "Lin Fang asks for the root of li" },
        body: {
          zh: "孔子先称大哉问，再把礼从奢、丧从表面的完备拉回俭与哀戚。礼的根本不是排场。",
          en: "Confucius calls the question great, then pulls ritual back from luxury and polished mourning to frugality and grief. The root is not display.",
        },
        sentenceId: "ba-yi-004",
      },
      {
        title: { zh: "克己复礼为仁", en: "Returning to li is the work of ren" },
        body: {
          zh: "颜渊问仁，得到的节目是非礼勿视听言动。礼在这里是对自己的界限，不是对外人的规矩手册。",
          en: "When Yan Yuan asks about ren, the items are: do not look, listen, speak, or move contrary to li. The form is a limit on the self, not a manual for managing others.",
        },
        sentenceId: "yan-yuan-001",
      },
      {
        title: { zh: "礼云礼云，玉帛云乎哉", en: "Is li only jade and silk?" },
        body: {
          zh: "把礼说成玉帛，把乐说成钟鼓，正是书要拆开的误会。器物可以在，敬意可以不在。",
          en: "To reduce li to jade and silk, and music to bells and drums, is the confusion the book names. The vessels can remain after reverence has gone.",
        },
        sentenceId: "yang-huo-011",
      },
      {
        title: { zh: "齐之以礼，不是齐之以刑", en: "Align by li, not by punishment" },
        body: {
          zh: "政与刑让人求免；德与礼让人有耻且格。礼在治国章里对抗的是刑罚，不是“没有规则”。",
          en: "Government and punishment make people seek escape. Virtue and li give shame and a place to stand. In the political chapters, li is set against penalty, not against having any rule.",
        },
        sentenceId: "wei-zheng-003",
      },
    ],
    confusions: [
      {
        title: { zh: "礼不是空仪式", en: "Li is not empty ceremony" },
        body: {
          zh: "《阳货》直接问：礼云礼云，玉帛云乎哉。入太庙每事问，也被人当成“不知礼”，孔子却说“是礼也”。会不会走流程，和敬不敬，不是同一件事。",
          en: "Book 17 asks whether li is only jade and silk. Asking about each matter in the ancestral temple is mocked as ignorance; Confucius calls the asking itself li. Knowing the program and having reverence are not the same act.",
        },
      },
      {
        title: { zh: "礼不是法", en: "Li is not law" },
        body: {
          zh: "“道之以政，齐之以刑”与“道之以德，齐之以礼”对举。礼要的是耻与格，不是用条文把人管住。把礼读成古代刑法或公司制度，会把这组对文读丢。",
          en: "“Guide by government, align by punishment” is set against “guide by virtue, align by li.” Li asks for shame and correction, not for a statute that pins people down. Reading it as archaic criminal law, or as a company policy, erases the contrast.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选可以直接回答“礼在书里做什么、不是什么”的章句。其余原文中出现“礼”字的章句，收在选读之后。",
      en: "These passages are enough to answer what li does in the book, and what it is not. Other source passages that contain 礼 follow under “view all.”",
    },
    featuredSentenceIds: [
      "xue-er-012",
      "wei-zheng-003",
      "wei-zheng-005",
      "ba-yi-003",
      "ba-yi-004",
      "ba-yi-015",
      "ba-yi-017",
      "li-ren-013",
      "tai-bo-002",
      "tai-bo-008",
      "yan-yuan-001",
      "yang-huo-011",
    ],
    practice: {
      zh: "今天只选一件将做的事，用颜渊问仁的四目核对：这一视、听、言、动，还在礼里吗？不在，就停。不必把礼写成日程表。",
      en: "Take one act you were about to do. Check it by the four items given to Yan Yuan: is this looking, hearing, speaking, or moving still inside li? If not, stop. This is not a ritual calendar.",
    },
    practiceSentenceId: "yan-yuan-001",
    faqs: [
      {
        question: { zh: "“礼之用，和为贵”是谁说的？", en: "Who says that harmony is the most precious use of li?" },
        answer: {
          zh: "有子，不是孔子。开卷论礼的第一句就不是“子曰”。引用时不要改署。",
          en: "Youzi, not Confucius. The book's first teaching on li is not marked 子曰. Do not reassign the speaker.",
        },
      },
      {
        question: { zh: "英文该用 ritual、rites，还是 propriety？", en: "Which English word: ritual, rites, or propriety?" },
        answer: {
          zh: "Legge 常用 the rules of propriety。ritual 容易让人只想到场面。本站标题保留 Li，并要求回到原文。",
          en: "Legge often writes “the rules of propriety.” Ritual easily shrinks the word to ceremony. This site keeps Li in the title and sends you back to the Chinese.",
        },
      },
      {
        question: { zh: "“不学礼，无以立”在本站哪一句？", en: "Where is “without learning li, one cannot take a stand”?" },
        answer: {
          zh: "常见的过庭之训把“不学诗，无以言”与“不学礼，无以立”连在一起。本站季氏 16.13（ji-shi-013）只收到“不学诗，无以言”；“不知礼，无以立”在尧曰 yao-yue-003。引用请用稳定 URL。",
          en: "The courtyard teaching often pairs “without the Songs, one cannot speak” with “without li, one cannot stand.” On this site Ji Shi 16.13 (ji-shi-013) has only the first half. “Without knowing li, one cannot take a stand” is Yao Yue yao-yue-003. Cite the stable URL.",
        },
      },
      {
        question: { zh: "人而不仁，礼还有用吗？", en: "If a person lacks ren, is li still of use?" },
        answer: {
          zh: "《八佾》说人而不仁，如礼何。礼不能从仁里拆出去单独生效。这不是取消礼，而是拒绝把礼做成空壳。",
          en: "Book 3 asks: if a person is not ren, what has he to do with li? Li does not work as a shell peeled off from ren. The line refuses empty form; it does not abolish form.",
        },
      },
      {
        question: { zh: "管仲算知礼吗？", en: "Did Guan Zhong know li?" },
        answer: {
          zh: "有人问管仲知礼乎。孔子举塞门、反坫，说管氏而知礼，孰不知礼。功业与知礼在书中可以分开判断。",
          en: "Asked whether Guan Zhong knew li, Confucius points to the screen wall and the drinking stand: if that is knowing li, who does not know it? Achievement and ritual knowledge can be judged apart.",
        },
      },
      {
        question: { zh: "“事君尽礼”为什么被人当成谄？", en: "Why is serving a ruler with full li taken for flattery?" },
        answer: {
          zh: "《八佾》记下这个误会：礼被看成讨好。书要你分开尽礼与谄，正如它分开礼与玉帛。",
          en: "Book 3 records the confusion: full ritual service is taken for flattery. The book asks you to separate li from ingratiation, as it separates li from jade and silk.",
        },
      },
    ],
    relatedSlugs: ["ren", "junzi", "xue", "zhongshu", "yue-music", "yan-yuan", "xia-shang-zhou"],
  }),

  zhongshu: wordPage({
    slug: "zhongshu",
    subtitle: {
      zh: "忠是把这件事做尽；恕是先停住你不愿承受的那一下。",
      en: "Zhong is finishing what the matter asks of you. Shu is stopping before you impose what you yourself would refuse.",
    },
    metaDescription: {
      zh: "忠恕在《论语》里不是愚忠，也不是英文 Golden Rule。此页说明恕是禁令、忠不是盲从，并链回忠恕而已矣与己所不欲（本站 15.23）。",
      en: "Zhongshu in the Analects is not blind loyalty and not the Golden Rule. This page treats shu as a prohibition, zhong as something other than obedience, and links 忠恕而已矣 with 己所不欲 (15.23 on this site).",
    },
    uses: [
      {
        title: { zh: "忠恕而已矣", en: "Zhong and shu, and that is all" },
        body: {
          zh: "孔子说吾道一以贯之，门人不明。曾子转述：夫子之道，忠恕而已矣。这是弟子的归纳，不是孔子当众写下的定义。",
          en: "Confucius says his way is threaded on one strand. The disciples do not understand. Zengzi restates it: the Master's way is zhong and shu, and that is all. It is a disciple's summary, not a definition Confucius posted to the room.",
        },
        sentenceId: "li-ren-015",
      },
      {
        title: { zh: "其恕乎", en: "Is it not shu?" },
        body: {
          zh: "子贡问可以终身行之的一言，孔子答恕：己所不欲，勿施于人。日常入口是这一禁令。",
          en: "Asked for one word to practice for life, Confucius answers shu: what you do not want done to you, do not do to others. The daily door is a restraint.",
        },
        sentenceId: "wei-ling-gong-023",
      },
      {
        title: { zh: "为人谋而不忠乎", en: "In planning for others, have I not been zhong?" },
        body: {
          zh: "曾子自省的第一问是为人谋。忠在这里是把受托的事做尽，不是对一个人无条件服从。",
          en: "Zengzi's first daily question is whether, in planning for others, he has been zhong. The word here is doing fully what was entrusted, not unconditional obedience to a person.",
        },
        sentenceId: "xue-er-004",
      },
      {
        title: { zh: "君使臣以礼，臣事君以忠", en: "Zhong answers li; it does not erase it" },
        body: {
          zh: "定公问君臣，孔子先说君使臣以礼，再说臣事君以忠。忠被放在礼之后，不是单独成立的愚忠。",
          en: "Duke Ding asks about ruler and minister. Confucius puts the ruler's li first, then the minister's zhong. Zhong is not a one-sided duty that survives the loss of li.",
        },
        sentenceId: "ba-yi-019",
      },
      {
        title: { zh: "子贡先说了一句更满的话", en: "Zi Gong first offers a fuller sentence" },
        body: {
          zh: "子贡说：我不欲人之加诸我，吾亦欲无加诸人。孔子答：非尔所及也。书里真正给出的终身一言，仍是禁令式的恕。",
          en: "Zi Gong says he does not want things imposed on him, and wants to impose nothing on others. Confucius says this is not yet within his reach. The lifelong word the book actually grants is still the prohibition of shu.",
        },
        sentenceId: "gong-ye-chang-011",
      },
    ],
    confusions: [
      {
        title: { zh: "恕是禁令，不是 Golden Rule", en: "Shu is a prohibition, not the Golden Rule" },
        body: {
          zh: "“己所不欲，勿施于人”是不要把你不愿承受的加给别人。常见英文 Golden Rule 是“你想要的，也给别人”。方向相反。子贡那句更满的表述，孔子并未许他已经做得到。",
          en: "“What you do not want done to yourself, do not do to others” forbids imposing what you would refuse. The usual Golden Rule tells you to give others what you want. The direction is not the same. Zi Gong's fuller sentence is precisely what Confucius says is not yet his.",
        },
      },
      {
        title: { zh: "忠不是盲从", en: "Zhong is not blind loyalty" },
        body: {
          zh: "忠出现在为人谋、行之以忠、言忠信，也出现在君臣章。可君臣章先要求君以礼使臣。把忠读成愚忠，是把书中成对的条件拆掉。",
          en: "Zhong appears in planning for others, in conducting government, and in speech. In the ruler-minister chapter it comes only after the ruler's li. Reading it as blind loyalty breaks a pair the book insists on keeping.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选可以直接回答“忠恕在书里做什么、不是什么”的章句。其余原文中出现忠或恕的章句，收在选读之后。",
      en: "These passages are enough to answer what zhong and shu do in the book, and what they are not. Other source passages that contain 忠 or 恕 follow under “view all.”",
    },
    featuredSentenceIds: [
      "xue-er-004",
      "ba-yi-019",
      "li-ren-015",
      "gong-ye-chang-011",
      "gong-ye-chang-018",
      "shu-er-024",
      "yan-yuan-002",
      "yan-yuan-014",
      "wei-ling-gong-005",
      "wei-ling-gong-023",
    ],
    practice: {
      zh: "选一件你几乎要加给别人的事，只问：这一下，是不是我自己也不愿承受的？若是，就勿施。回到卫灵公 15.23，不要改写成“把我想要的给别人”。",
      en: "Choose one thing you were about to impose. Ask only: would I refuse this if it came toward me? If so, do not do it. Return to Wei Ling Gong 15.23; do not rewrite it as giving others what you want.",
    },
    practiceSentenceId: "wei-ling-gong-023",
    faqs: [
      {
        question: { zh: "“忠恕而已矣”是孔子亲口说的吗？", en: "Did Confucius himself say “zhong and shu, and that is all”?" },
        answer: {
          zh: "不是当众下的定义。孔子说一以贯之，曾子对门人转述为忠恕。说话者是曾子。",
          en: "It is not a definition delivered to the room. Confucius says one thread runs through it; Zengzi restates that thread to the others as zhong and shu. The speaker of the formula is Zengzi.",
        },
      },
      {
        question: { zh: "“己所不欲，勿施于人”是 15.24 吗？", en: "Is “what you do not want done to yourself” Analects 15.24?" },
        answer: {
          zh: "部分通行编号标为卫灵公 15.24。本站此句是 wei-ling-gong-023，篇内序号 15.23。另一处“己所不欲，勿施于人”在颜渊 yan-yuan-002（仲弓问仁）。引用请用稳定 URL。",
          en: "Some received numberings call it Wei Ling Gong 15.24. On this site it is wei-ling-gong-023, numbered 15.23. The other “do not do to others what you do not want” is Yan Yuan yan-yuan-002, in the answer to Zhong Gong. Cite the stable URL.",
        },
      },
      {
        question: { zh: "英文该把忠译成 loyalty 吗？", en: "Should zhong be translated as loyalty?" },
        answer: {
          zh: "loyalty 容易滑向愚忠。书中的忠更近于把受托的事做尽、说话可靠。恕不要译成 Golden Rule。本站标题分开保留这些字。",
          en: "Loyalty slides toward blind allegiance. In the book, zhong is closer to doing fully what was entrusted, and to speech that can be counted on. Do not translate shu as the Golden Rule. This site keeps the Chinese words in view.",
        },
      },
      {
        question: { zh: "谁问出了恕？", en: "Who asked the question that produces shu?" },
        answer: {
          zh: "子贡。终身行之的一言，是他问出来的。答案属于问答，不属于一句无主名言。",
          en: "Zi Gong. The lifelong word is an answer to his question. It belongs to a dialogue, not to an ownerless proverb.",
        },
      },
      {
        question: { zh: "忠就是仁吗？", en: "Is zhong the same as ren?" },
        answer: {
          zh: "令尹子文被许为忠矣，孔子仍说未知，焉得仁。忠可以被承认，仁仍可以按下。",
          en: "The chief minister Ziwen is granted zhong, and Confucius still says he does not know that this is ren. Zhong can be acknowledged while ren is withheld.",
        },
      },
      {
        question: { zh: "“主忠信”是忠恕吗？", en: "Is “hold to zhong and xin” the same as zhongshu?" },
        answer: {
          zh: "不是同一个词组。主忠信反复出现，讲的是持守与交友。忠恕是曾子对一以贯之的归纳，加上子贡问出的恕。不要把所有“忠”字并进一个标题。",
          en: "They are not the same phrase. “Hold to zhong and xin” recurs as a rule of conduct and friendship. Zhongshu is Zengzi's account of the one thread, plus the shu asked by Zi Gong. Do not pour every 忠 into one heading.",
        },
      },
    ],
    relatedSlugs: ["ren", "zi-gong", "zeng-zi", "confucius", "junzi", "xin", "yan-yuan"],
  }),

  junzi: wordPage({
    slug: "junzi",
    subtitle: {
      zh: "君子可以无名、可以穷，却不能把义换成利。",
      en: "A junzi may go unnamed and may be poor. What the name will not trade away is rightness for profit.",
    },
    metaDescription: {
      zh: "君子在《论语》里不是成功人士，小人也不是阶级骂人。此页说明人不知而不愠、喻于义与固穷，并链回可核对的原文。",
      en: "Junzi in the Analects is not a successful person, and xiaoren is not only a class insult. This page sends you to being unmoved when unknown, measuring by rightness, and remaining firm in poverty.",
    },
    uses: [
      {
        title: { zh: "人不知而不愠", en: "Unmoved when unrecognized" },
        body: {
          zh: "开卷就把君子放在“人不知”之后。这个名字的第一条件不是被看见。",
          en: "The book opens by placing the junzi after “men take no note of him.” The first condition of the name is not being seen.",
        },
        sentenceId: "xue-er-001",
      },
      {
        title: { zh: "君子不器", en: "A junzi is not a vessel" },
        body: {
          zh: "器是被指定用途的用具。君子不被收成一种职能、一个职位、一项才干。",
          en: "A vessel is a tool with one assigned use. The junzi is not stored as one function, one office, or one talent.",
        },
        sentenceId: "wei-zheng-012",
      },
      {
        title: { zh: "君子喻于义，小人喻于利", en: "The junzi is moved by rightness" },
        body: {
          zh: "对照的轴是义与利，不是门第。小人在这里是度量的名字，不是对某一阶层的骂名。",
          en: "The contrast turns on rightness and profit, not on pedigree. Xiaoren here is a name for a measure, not a slur aimed at a class.",
        },
        sentenceId: "li-ren-016",
      },
      {
        title: { zh: "文质彬彬", en: "Substance and pattern in balance" },
        body: {
          zh: "质胜文则野，文胜质则史。君子不是只会把话说圆的人，也不是只有朴野。",
          en: "Native substance without pattern is rusticity; pattern without substance is clerkish polish. The junzi is neither a smooth talker nor mere roughness.",
        },
        sentenceId: "yong-ye-016",
      },
      {
        title: { zh: "君子和而不同", en: "Harmony without sameness" },
        body: {
          zh: "和不是附和。小人同而不和：可以一致，却没有真正的协调。",
          en: "Harmony is not conformity. The small person is the same and not in accord: agreement without coordination.",
        },
        sentenceId: "zi-lu-023",
      },
    ],
    confusions: [
      {
        title: { zh: "君子不是“成功的人”", en: "The junzi is not a successful person" },
        body: {
          zh: "君子可以不被人知，可以固穷，可以无终食之间违仁。闻达、事功、才干都不是这个名字的条件。把君子读成成功学，开卷第一句就读不下去。",
          en: "A junzi may go unrecognized, may remain firm in poverty, and still not leave ren for the space of a meal. Fame, office, and talent are not the name's conditions. Read as success talk, the opening sentence already fails.",
        },
      },
      {
        title: { zh: "小人不是专用来骂出身", en: "Xiaoren is not only a class insult" },
        body: {
          zh: "小人常与君子成对：喻于利、比而不周、同而不和、穷斯滥。它可以是未立的度量，不必先是对某一阶层的侮辱。先读对照，再决定要不要听到骂声。",
          en: "Xiaoren is usually paired with junzi: moved by profit, partial, conforming without harmony, overflowing in poverty. It can name an unformed measure before it names a social insult. Read the contrast first.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选可以直接回答“君子在书里做什么、不是什么”的章句。其余原文中出现“君子”的章句，收在选读之后。",
      en: "These passages are enough to answer what the junzi does in the book, and what the name is not. Other source passages that contain 君子 follow under “view all.”",
    },
    featuredSentenceIds: [
      "xue-er-001",
      "wei-zheng-012",
      "wei-zheng-014",
      "li-ren-005",
      "li-ren-016",
      "yong-ye-016",
      "shu-er-036",
      "yan-yuan-004",
      "zi-lu-023",
      "xian-wen-029",
      "wei-ling-gong-001",
      "wei-ling-gong-020",
    ],
    practice: {
      zh: "今天你要责怪别人之前，先打开“君子求诸己”：这一求，是先落在自己身上，还是先落在对方身上？只改这一处指向。",
      en: "Before you blame someone today, open “the junzi seeks it in himself.” Ask only whether the demand lands first on you or on the other person. Change that direction, not your whole character.",
    },
    practiceSentenceId: "wei-ling-gong-020",
    faqs: [
      {
        question: { zh: "“君子务本”是孔子说的吗？", en: "Does Confucius say “the junzi attends to the root”?" },
        answer: {
          zh: "不是。说话者是有子。开卷第二句就把君子放在弟子口中。不要见君子就署孔子。",
          en: "No. The speaker is Youzi. The book's second passage already puts junzi in a disciple's mouth. Do not credit every junzi line to Confucius.",
        },
      },
      {
        question: { zh: "英文该用 gentleman、superior man，还是 exemplary person？", en: "Which English word: gentleman, superior man, or exemplary person?" },
        answer: {
          zh: "gentleman 带阶层与礼貌；Legge 的 superior man 也容易读成高人一等。本站标题保留 Junzi，并要求回到义、礼、学这些原文条件。",
          en: "Gentleman carries class and manners. Legge's “superior man” is easily heard as social rank. This site keeps Junzi in the title and sends you back to rightness, li, and learning.",
        },
      },
      {
        question: { zh: "问君子时，答案是同一句吗？", en: "Is there one answer when someone asks about the junzi?" },
        answer: {
          zh: "不是。子贡得到先行其言，司马牛得到不忧不惧，子路得到修己以敬。问者不同，节目不同。",
          en: "No. Zi Gong is told to act before speaking, Sima Niu to be without worry or fear, Zi Lu to cultivate himself with reverence. The asker changes the items.",
        },
      },
      {
        question: { zh: "君子可以穷吗？", en: "Can a junzi be poor?" },
        answer: {
          zh: "可以。在陈绝粮，子路问君子亦有穷乎。孔子说君子固穷，小人穷斯滥矣。穷不是取消这个名字的条件。",
          en: "Yes. Cut off in Chen, Zi Lu asks whether a junzi too can be in straits. Confucius says the junzi remains firm in poverty; the small person, in poverty, overflows. Poverty does not cancel the name.",
        },
      },
      {
        question: { zh: "“君子不器”是 2.12 吗？", en: "Is “the junzi is not a vessel” 2.12?" },
        answer: {
          zh: "本站是 wei-zheng-012，为政 2.12。引用请用 URL，不要只写章节号。",
          en: "On this site it is wei-zheng-012, Wei Zheng 2.12. Cite the URL; do not cite the number alone.",
        },
      },
      {
        question: { zh: "小人是不是就是坏人？", en: "Is the xiaoren simply a villain?" },
        answer: {
          zh: "书常用小人来标出对照：利、比、同、滥。它首先是未立的度量，不必先译成 villain。要看具体对文。",
          en: "The book uses xiaoren to mark a contrast: profit, partiality, sameness, overflow. It names an unformed measure before it names a villain. Read the paired line.",
        },
      },
    ],
    relatedSlugs: ["ren", "li", "xiaoren", "xue", "zhongshu", "confucius", "yi"],
  }),

  xue: wordPage({
    slug: "xue",
    subtitle: {
      zh: "学在《论语》里是把自己练住，不是把材料记完。",
      en: "Learning in the Analects is holding yourself to a practice, not finishing a pile of material.",
    },
    metaDescription: {
      zh: "学在《论语》里不是科举刷题，习也不是复习软件。此页说明学而时习、为己之学与学而不思，并链回可核对的原文。",
      en: "Xue in the Analects is not exam cramming, and 习 is not a review app. This page sends you to learning with timely practice, learning for oneself, and learning without thought.",
    },
    uses: [
      {
        title: { zh: "学而时习之", en: "Learn and practice it in due time" },
        body: {
          zh: "开卷第一字是学，紧接着是习。习是反复去做，不是把已经记住的再点一遍。",
          en: "The book opens on xue, then immediately on xi. Xi is doing the thing again, not tapping a card you already recognize.",
        },
        sentenceId: "xue-er-001",
      },
      {
        title: { zh: "学而不思则罔", en: "Learning without thought is vacuity" },
        body: {
          zh: "学与思互相校正。只堆材料会罔，只空想会殆。学不是把书搬进脑子里存放。",
          en: "Learning and thought correct each other. Material without thought is a blank; thought without learning is peril. Xue is not storage.",
        },
        sentenceId: "wei-zheng-015",
      },
      {
        title: { zh: "古之学者为己", en: "The old learning was for the self" },
        body: {
          zh: "为己是把自己做成；为人是做给别人看。这是学的方向，不是自私的许可。",
          en: "Learning for the self is making the self. Learning for others is display. The line gives a direction, not a license to be selfish.",
        },
        sentenceId: "xian-wen-025",
      },
      {
        title: { zh: "吾十有五而志于学", en: "At fifteen, the will was set on learning" },
        body: {
          zh: "学是一条从十五到七十的长线，不是一个学期的科目。志于学，不是志于名。",
          en: "Learning is a line from fifteen to seventy, not a term's syllabus. The will is set on learning, not on a name.",
        },
        sentenceId: "wei-zheng-004",
      },
      {
        title: { zh: "好仁不好学，其蔽也愚", en: "Ren without learning becomes folly" },
        body: {
          zh: "仁、知、信、直、勇、刚，离开学都会有蔽。学在这里是给德性加校正，不是给德性加证书。",
          en: "Ren, knowledge, trustworthiness, directness, courage, and firmness each take a defect when learning is refused. Xue here corrects virtue; it does not certify it.",
        },
        sentenceId: "yang-huo-008",
      },
    ],
    confusions: [
      {
        title: { zh: "学不是考试刷题", en: "Xue is not exam cramming" },
        body: {
          zh: "子张学干禄，孔子把他拉回阙疑、慎言、慎行。学也，禄在其中矣，说的是学在先，不是把学收成应试技术。古之学者为己，更直接挡住“学给别人看”。",
          en: "When Zi Zhang studies with an eye to office, Confucius pulls him back to leaving gaps, and to careful speech and action. “In learning, emolument is therein” keeps learning first; it does not shrink learning to examination technique. “The old learning was for the self” blocks display.",
        },
      },
      {
        title: { zh: "习是练习，不是复习软件", en: "Xi is practice, not a review app" },
        body: {
          zh: "时习之是按时去做已经学的事。性相近、习相远的习，也是反复养成，不是把旧笔记再看一遍。本站不把习写成打卡。",
          en: "“Practice it in due time” means doing what has been learned. In “by nature close, by practice far apart,” xi is also formation by repetition, not rereading old notes. This site does not rewrite xi as a streak.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选可以直接回答“学在书里做什么、不是什么”的章句。其余原文中出现“学”的章句，收在选读之后。",
      en: "These passages are enough to answer what xue does in the book, and what it is not. Other source passages that contain 学 follow under “view all.”",
    },
    featuredSentenceIds: [
      "xue-er-001",
      "xue-er-014",
      "wei-zheng-004",
      "wei-zheng-011",
      "wei-zheng-015",
      "yong-ye-002",
      "xian-wen-025",
      "wei-ling-gong-030",
      "yang-huo-002",
      "yang-huo-008",
      "ji-shi-009",
      "zi-zhang-013",
    ],
    practice: {
      zh: "不要新开一份书单。取出一句已经读过的原文，今天只做一次“时习之”：按它改一件小事。习是做，不是再标记“已复习”。",
      en: "Do not open a new reading list. Take one source sentence you have already read, and practice it once today: change one small act by it. Xi is doing, not marking a card reviewed.",
    },
    practiceSentenceId: "xue-er-001",
    faqs: [
      {
        question: { zh: "开卷“学而时习之”是谁说的？", en: "Who speaks the opening “learn and practice it in due time”?" },
        answer: {
          zh: "子曰。紧接着的“君子务本”却是有子，“吾日三省”是曾子。同一篇里，说话者已经在换。",
          en: "The Master. The next “junzi attends to the root” is Youzi; the daily self-examination is Zengzi. Speakers already change inside the first book.",
        },
      },
      {
        question: { zh: "英文该用 learning 还是 study？", en: "Which English word: learning or study?" },
        answer: {
          zh: "study 容易变成科目与应试。learning 仍不够，因为它可以不含习。本站标题保留 Xue，并要求看见习、思、为己。",
          en: "Study slides toward a subject and an examination. Learning is still incomplete if it drops xi. This site keeps Xue in the title and asks you to see practice, thought, and learning for the self.",
        },
      },
      {
        question: { zh: "“不学礼，无以立”在本站吗？", en: "Is “without learning li, one cannot stand” on this site?" },
        answer: {
          zh: "常见过庭之训的后半，本站季氏 16.13 没收全；ji-shi-013 只到“不学诗，无以言”。“不知礼，无以立”在尧曰 yao-yue-003。不要按记忆中的对句去找一个不存在的编号。",
          en: "The usual second half of the courtyard teaching is not complete in this site's Ji Shi 16.13; ji-shi-013 ends at “without the Songs, one cannot speak.” “Without knowing li, one cannot stand” is Yao Yue yao-yue-003. Do not hunt a remembered pair under a number this edition does not use.",
        },
      },
      {
        question: { zh: "谁被称作好学？", en: "Who is called fond of learning?" },
        answer: {
          zh: "哀公、季康子问弟子孰为好学，孔子两答颜回，并说今也则亡。好学在书中是稀有判断，不是奖状。",
          en: "Duke Ai and Ji Kangzi ask which disciple is fond of learning. Confucius twice names Yan Hui, and says that now there is none. Fondness for learning is a rare judgment, not a badge.",
        },
      },
      {
        question: { zh: "“学而优则仕”是孔子说的吗？", en: "Does Confucius say “when learning has surplus, take office”?" },
        answer: {
          zh: "不是。说话者是子夏，在《子张》。不要把十九篇弟子的话提前署给孔子。",
          en: "No. The speaker is Zixia, in Book 19. Do not move a disciple's line in Zi Zhang up to Confucius.",
        },
      },
      {
        question: { zh: "“温故而知新”算学吗？", en: "Does “warming the old and knowing the new” count as xue?" },
        answer: {
          zh: "算学的方法，但本站 wei-zheng-011 原文没有“学”字，所以不会自动出现在“学”的全部相关里。此页仍把它放进选读，因为它说明复习不是把旧的原样保存。",
          en: "It is a method of learning, but wei-zheng-011 does not contain the character 学, so it does not automatically join the full “related” dump. This page still features it, because it shows that review is not storing the old unchanged.",
        },
      },
      {
        question: { zh: "性相近，习相远的习，是复习吗？", en: "In “by practice they grow far apart,” is xi review?" },
        answer: {
          zh: "不是。那里的习是反复养成，与学而时习之的习同向：都是做出来的距离，不是记忆软件里的间隔重复。",
          en: "No. Xi there is formation by repetition. It faces the same way as the opening “practice it in due time”: a distance made by doing, not spaced repetition in an app.",
        },
      },
    ],
    relatedSlugs: ["ren", "li", "junzi", "confucius", "yan-yuan", "shi", "zhongshu"],
  }),

  yi: wordPage({
    slug: "yi",
    subtitle: {
      zh: "义不是一张先写好的规则表，而是利、勇、诺言与处境逼近时，仍肯问这一件事做得正不正。",
      en: "Yi is not a rulebook written in advance. It is the judgment that still asks what is right when gain, courage, promises, and circumstance press in.",
    },
    metaDescription: {
      zh: "义在《论语》里不是抽象口号，也不是反对一切利益。此页从义与利、信近于义、见利思义和勇而无义划清边界，并链回原文章句。",
      en: "Yi in the Analects is not an abstract slogan or a rejection of gain. Read how rightness judges promises, profit, courage, and action in the source text.",
    },
    uses: [
      {
        title: { zh: "信近于义，言可复也", en: "A promise must first be near yi" },
        body: {
          zh: "有子先用义限制信：话要合于义，才可以兑现。义不是守诺之后的装饰，而是决定这个诺言该不该守的尺度。",
          en: "Youzi first limits trustworthiness by yi: only words near what is right can be made good. Yi is not decoration after a promise; it judges whether the promise should bind at all.",
        },
        sentenceId: "xue-er-013",
      },
      {
        title: { zh: "无适也，无莫也，义之与比", en: "Neither fixed for nor fixed against" },
        body: {
          zh: "君子不先规定凡事必可或必不可，而与义相亲。这里的义是一种临事判断，不是一句脱离处境的绝对口号。",
          en: "The junzi is not fixed beforehand for or against everything, but sides with yi. Here rightness is judgment in a situation, not an absolute slogan detached from it.",
        },
        sentenceId: "li-ren-010",
      },
      {
        title: { zh: "君子喻于义，小人喻于利", en: "Yi and gain are different measures" },
        body: {
          zh: "这句不是说君子看不见利益，而是说最后用什么来理解和裁断。利可以进入处境，不能成为唯一尺度。",
          en: "The line does not say a junzi cannot see benefit. It asks which measure finally interprets and decides. Gain may enter the situation; it cannot be the only measure.",
        },
        sentenceId: "li-ren-016",
      },
      {
        title: { zh: "不义而富且贵，于我如浮云", en: "The objection is to unjust gain" },
        body: {
          zh: "浮云所拒的是不义而得的富贵，不是把贫困本身写成美德。义在这里判断取得富贵的路径。",
          en: "What becomes a floating cloud is wealth and rank gained without yi. Poverty itself is not praised. Yi judges the way wealth and rank are acquired.",
        },
        sentenceId: "shu-er-015",
      },
      {
        title: { zh: "义以为质，礼以行之，信以成之", en: "Yi is the substance, not the whole performance" },
        body: {
          zh: "义给君子以质，仍要用礼行之、用逊出之、用信成之。合宜的判断必须进入形式、态度与兑现，才成为行动。",
          en: "Yi gives the junzi substance, but li enacts it, humility expresses it, and xin completes it. Right judgment must pass into form, manner, and fulfillment before it becomes conduct.",
        },
        sentenceId: "wei-ling-gong-017",
      },
    ],
    confusions: [
      {
        title: { zh: "义不是固定规则", en: "Yi is not a fixed rule" },
        body: {
          zh: "“无适也，无莫也”先撤掉一概而论，再说义之与比。把义写成任何处境都原样套用的条文，会丢掉这句的次序。",
          en: "“Neither for nor against” removes the blanket answer before the text says to side with yi. Turning yi into a clause applied unchanged everywhere loses that order.",
        },
      },
      {
        title: { zh: "义不要求守住每一个诺言", en: "Yi does not require every promise to be kept" },
        body: {
          zh: "《学而》不是说言出必行，而是说信近于义，言可复也。若承诺本身不义，机械兑现并不会使它变正。",
          en: "Book 1 does not say every utterance must be carried through. It says words can be fulfilled when xin is near yi. Mechanical fulfillment cannot make a wrongful promise right.",
        },
      },
      {
        title: { zh: "义不是逞勇，也不是逢利便退", en: "Yi is neither bravado nor flight from every gain" },
        body: {
          zh: "见义不为被说成无勇；勇而无义又会作乱、为盗。见得思义也不是见利就逃，而是先让义裁断。勇与利都要受义约束。",
          en: "Failing to act when yi is seen lacks courage, while courage without yi produces disorder or robbery. Thinking of yi at the sight of gain is not automatic retreat. Both courage and gain are answerable to judgment.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选能说明义如何裁断诺言、利益、勇气与行动的章句。其余原文中出现“义”字的章句，收在选读之后。",
      en: "These passages show yi judging promises, gain, courage, and action. Other source passages that contain the character 义 follow under “view all.”",
    },
    featuredSentenceIds: [
      "xue-er-013",
      "wei-zheng-024",
      "li-ren-010",
      "li-ren-016",
      "yong-ye-020",
      "shu-er-003",
      "shu-er-015",
      "yan-yuan-010",
      "xian-wen-013",
      "wei-ling-gong-017",
      "ji-shi-010",
      "yang-huo-023",
    ],
    practice: {
      zh: "今天遇到一项利益或一个承诺时，先停在“见得思义”这四个字上：写下你会得到什么，再写下怎样取得才正当。只据第二行决定下一步。",
      en: "At one gain or promise today, pause at “on seeing gain, think of yi.” Write what you would get, then write what way of getting it would be right. Let the second line decide the next act.",
    },
    practiceSentenceId: "ji-shi-010",
    faqs: [
      {
        question: { zh: "义该译作 rightness、righteousness，还是 justice？", en: "Should yi be translated as rightness, righteousness, or justice?" },
        answer: {
          zh: "Legge 常用 righteousness 或 what is right。justice 容易只剩制度正义，rightness 又可能太轻。本站标题保留 Yi，并把判断交还具体章句。",
          en: "Legge often uses “righteousness” or “what is right.” Justice can narrow the word to institutions; rightness can sound too light. This page keeps Yi and returns the judgment to each passage.",
        },
      },
      {
        question: { zh: "义和礼是同一个东西吗？", en: "Are yi and li the same thing?" },
        answer: {
          zh: "不是。《卫灵公》把义说成质，把礼说成行之的形式，又加上逊与信。它们相连，不可互换。",
          en: "No. Wei Ling Gong calls yi the substance and li the way it is enacted, then adds humility and xin. They work together but are not interchangeable.",
        },
      },
      {
        question: { zh: "“君子喻于义，小人喻于利”是在反对赚钱？", en: "Does “the junzi understands yi; the small person gain” oppose earning money?" },
        answer: {
          zh: "原文区分的是裁断尺度。另有“不义而富且贵”，明确把问题放在“不义而得”，不是富贵本身。",
          en: "The source distinguishes measures of judgment. Another line objects specifically to wealth and rank gained without yi, not to wealth and rank as such.",
        },
      },
      {
        question: { zh: "“见义不为，无勇也”是不是要求马上行动？", en: "Does “seeing yi and not acting lacks courage” demand immediate action?" },
        answer: {
          zh: "不能脱开“勇而无义，为乱、为盗”来读。先要见得是义，勇才有方向；冲动本身不是义。",
          en: "Not when read beside “courage without yi makes disorder or robbery.” Yi must first be seen; only then does courage have direction. Impulse is not yi.",
        },
      },
      {
        question: { zh: "“信近于义”是谁说的？", en: "Who says that xin must be near yi?" },
        answer: {
          zh: "有子，不是孔子。这句话也没有把信与义并成同义词，而是用义给承诺划界。",
          en: "Youzi, not Confucius. The sentence does not make xin and yi synonyms; it uses yi to set a boundary for promises.",
        },
      },
      {
        question: { zh: "为什么“义”的全部相关只有原文命中？", en: "Why does the full Yi list only use source-text matches?" },
        answer: {
          zh: "索引的“全部相关”只认古文原文里的“义”，不认白话导读或英译里补出的义、right、justice。选读负责判断，自动列表负责守住版本边界。",
          en: "The full list recognizes 义 in the classical source, not words added by the Chinese guide or English translation. Editorial selection supplies judgment; the automatic list keeps the edition boundary.",
        },
      },
    ],
    relatedSlugs: ["junzi", "li", "xin", "ren", "zhongshu", "confucius", "zi-lu"],
  }),

  xin: wordPage({
    slug: "xin",
    subtitle: {
      zh: "信不是把每句话硬做到底，而是让话可核对、让行动可托付，并让不义的承诺停在兑现之前。",
      en: "Xin is not forcing every word through. It makes speech checkable and action dependable, while stopping a wrongful promise before fulfillment.",
    },
    metaDescription: {
      zh: "信在《论语》里不是轻信，也不是言出必行。此页从信近于义、听言观行、民无信不立和信而后劳其民说明可信如何成立。",
      en: "Xin in the Analects is neither credulity nor keeping every utterance. Read how yi, observed conduct, friendship, and public trust bound trustworthiness.",
    },
    uses: [
      {
        title: { zh: "与朋友交而不信乎", en: "Trustworthiness with friends" },
        body: {
          zh: "曾子把与朋友相交是否可信列入每日自省。信先是检查自己，不是要求别人先信我。",
          en: "Zengzi puts trustworthiness with friends inside daily self-examination. Xin begins by checking oneself, not by demanding that others trust first.",
        },
        sentenceId: "xue-er-004",
      },
      {
        title: { zh: "信近于义，言可复也", en: "Words become fulfillable near yi" },
        body: {
          zh: "有子不给“说过就必须做”背书。他先问这句话是否近义，再说言可复。信有边界。",
          en: "Youzi does not endorse “if it was said, it must be done.” He first asks whether the word is near yi, and only then says it can be fulfilled. Xin has a boundary.",
        },
        sentenceId: "xue-er-013",
      },
      {
        title: { zh: "人而无信，不知其可也", en: "Without xin, the vehicle cannot move" },
        body: {
          zh: "大车、小车缺了关键的连接就不能行。比喻说的不是受欢迎，而是一个人若不可托付，协作便没有着力点。",
          en: "A large or small carriage cannot move without its connecting piece. The image is not popularity: when a person cannot be relied on, cooperation has no point of purchase.",
        },
        sentenceId: "wei-zheng-022",
      },
      {
        title: { zh: "听其言而观其行", en: "Hear the words and observe the conduct" },
        body: {
          zh: "宰予使孔子改掉听言而信行。这里的信有“相信”之义，而书给出的办法不是多疑，是把话放到行动里核对。",
          en: "Zai Yu makes Confucius change from hearing words and trusting the conduct to hearing words and observing it. Here xin includes belief, and the remedy is not suspicion but verification in action.",
        },
        sentenceId: "gong-ye-chang-009",
      },
      {
        title: { zh: "民无信不立", en: "Public trust is what remains" },
        body: {
          zh: "子贡把足食、足兵、民信逐层追问。孔子最后保留民信。这里不是私人诚实清单，而是共同体能否站立。",
          en: "Zi Gong presses through food, arms, and the people's trust. Public trust is what Confucius finally retains. This is not a private honesty checklist; it is whether a polity can stand.",
        },
        sentenceId: "yan-yuan-007",
      },
      {
        title: { zh: "信而后劳其民，信而后谏", en: "Trust must precede burden and remonstrance" },
        body: {
          zh: "子夏把次序说得很清楚：未信而使民劳，会被看成伤害；未信而谏，会被看成毁谤。正确的话也不能跳过关系条件。",
          en: "Zixia makes the order explicit: burden people before trust and they feel injured; remonstrate before trust and it sounds like slander. Even a correct word cannot skip the relation that lets it be heard.",
        },
        sentenceId: "zi-zhang-010",
      },
    ],
    confusions: [
      {
        title: { zh: "信不是言出必行", en: "Xin is not carrying out every word" },
        body: {
          zh: "“言必信，行必果”在《子路》只被放到较低一等，还被说成硁硁然小人。书要可靠，不要顽固地兑现错误。",
          en: "“Every word kept, every act carried through” is placed in a lower rank in Zi Lu and called the obstinacy of a small person. The book asks for dependability, not stubborn fulfillment of error.",
        },
      },
      {
        title: { zh: "信不是轻信", en: "Xin is not credulity" },
        body: {
          zh: "听言而信行被改成听言观行；不逆诈、不亿不信也仍以先觉为贤。既不预设别人欺骗，也不取消核对。",
          en: "Trusting conduct from words alone is replaced by observing conduct. Refusing to anticipate deceit is still paired with noticing it early. The book neither presumes fraud nor abandons verification.",
        },
      },
      {
        title: { zh: "信不只属于私人关系", en: "Xin is not only private" },
        body: {
          zh: "朋友相交要信，治国也要敬事而信；民无信则国不立。把信缩成“做一个诚实的人”，会丢掉制度与公共行动的承托。",
          en: "Friends require xin, and governing a state requires reverent work and xin; without public trust, the state does not stand. “Be honest” is too small for the institutional weight the word carries.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选能说明信如何被义限制、被行动核对、又如何承托朋友与政治的章句。其余原文中出现“信”字的章句，收在选读之后。",
      en: "These passages show xin limited by yi, checked in conduct, and carrying friendship and government. Other source passages that contain 信 follow under “view all.”",
    },
    featuredSentenceIds: [
      "xue-er-004",
      "xue-er-005",
      "xue-er-007",
      "xue-er-013",
      "wei-zheng-022",
      "gong-ye-chang-009",
      "shu-er-024",
      "yan-yuan-007",
      "zi-lu-020",
      "wei-ling-gong-005",
      "yang-huo-008",
      "zi-zhang-010",
    ],
    practice: {
      zh: "取一个今天要作出的承诺，先把它改写成可核对的一句话，再问它是否“近于义”。若做不到或不正当，现在就缩小或撤回，不把失信推迟到以后。",
      en: "Take one promise you are about to make. Rewrite it as a checkable sentence, then ask whether it is near yi. If it is impossible or wrong, narrow or withdraw it now instead of postponing failure.",
    },
    practiceSentenceId: "xue-er-013",
    faqs: [
      {
        question: { zh: "信是 trust、trustworthiness，还是 belief？", en: "Is xin trust, trustworthiness, or belief?" },
        answer: {
          zh: "三种用法都能在书中看到：言而有信偏可信，民信偏公共信任，信而好古与听言信行又有相信之义。本站标题用 Trustworthiness，但不抹平语境。",
          en: "All three appear: 言而有信 leans toward trustworthiness, 民信 toward public trust, while 信而好古 and 信其行 include belief. The title uses Trustworthiness without flattening those contexts.",
        },
      },
      {
        question: { zh: "《论语》要求所有承诺都兑现吗？", en: "Does the Analects require every promise to be fulfilled?" },
        answer: {
          zh: "不。“信近于义，言可复也”把义放在兑现之前；“言必信，行必果”也没有得到最高评价。",
          en: "No. “When xin is near yi, words can be fulfilled” places yi before fulfillment, and “every word kept, every act carried through” does not receive the highest judgment.",
        },
      },
      {
        question: { zh: "“吾日三省吾身”是谁说的？", en: "Who says “I examine myself three times daily”?" },
        answer: {
          zh: "曾子，不是孔子。其中第二问才是与朋友交而不信乎。引用时要保留说话者。",
          en: "Zengzi, not Confucius. Its second question asks about being untrustworthy with friends. Keep the speaker when citing it.",
        },
      },
      {
        question: { zh: "“民无信不立”是在说个人信用吗？", en: "Is “without trust the people cannot stand” about personal credit?" },
        answer: {
          zh: "那是子贡问政的结尾，语境是食、兵与民对统治的信任。个人的“人而无信”另在《为政》2.22。",
          en: "It closes Zi Gong's question about government, after food, arms, and the people's trust in rule. The personal “a person without xin” is a different passage, Wei Zheng 2.22.",
        },
      },
      {
        question: { zh: "“言必信，行必果”为什么不是最高赞语？", en: "Why is “every word kept, every act carried through” not the highest praise?" },
        answer: {
          zh: "孔子把这种硁硁然放在士的较低一等，并称小人。没有义与学习的校正，果决会变成固执。",
          en: "Confucius places that obstinacy in a lower rank of the shi and calls it small. Without correction by yi and learning, firmness becomes rigidity.",
        },
      },
      {
        question: { zh: "为什么白话里写“诚信”的章不自动进来？", en: "Why do passages whose guide says “trust” not enter automatically?" },
        answer: {
          zh: "自动相关只匹配古文原文里的“信”。白话导读与英译是解释层，不能反过来扩张底本索引。",
          en: "Automatic related passages match 信 in the classical source only. The Chinese guide and English translation are interpretive layers; they do not enlarge the base-text index.",
        },
      },
    ],
    relatedSlugs: ["yi", "zhongshu", "junzi", "zeng-zi", "zi-gong", "zheng", "xue"],
  }),

  xiao: wordPage({
    slug: "xiao",
    subtitle: {
      zh: "孝不是把父母的话一概照做，也不是供养完成便算数；《论语》把它追到敬、色、忧与礼的具体处。",
      en: "Xiao is neither obeying every parental word nor completing material support. The Analects presses it into reverence, manner, concern, and li.",
    },
    metaDescription: {
      zh: "孝在《论语》里不是盲从或只给父母物质供养。此页辨析无违、能养、色难与孝弟为仁之本，并链回不同问者的原文答案。",
      en: "Xiao in the Analects is not blind obedience or material support alone. Read how li, reverence, manner, and concern shape filial conduct in the source.",
    },
    uses: [
      {
        title: { zh: "孝弟也者，其为仁之本与", en: "Youzi calls filial conduct a root of ren" },
        body: {
          zh: "说话者是有子，句末还是“与”的问断。孝弟被放在务本的起点，不等于仁的全部，也不是孔子亲下的唯一公式。",
          en: "The speaker is Youzi, and the line ends as a question. Xiao and fraternal respect are placed at the root of the work, not made the whole of ren or Confucius's sole formula.",
        },
        sentenceId: "xue-er-002",
      },
      {
        title: { zh: "无违：生事、死葬、祭之以礼", en: "“Do not disobey” is explained through li" },
        body: {
          zh: "孟懿子得到“无违”，孔子随后亲自向樊迟解释：生事、死葬、祭之以礼。原文没有说父母的每个要求都不可拒绝。",
          en: "Meng Yizi receives “do not disobey,” and Confucius then explains it to Fan Chi: serve the living, bury the dead, and sacrifice according to li. The source does not say every parental request must be obeyed.",
        },
        sentenceId: "wei-zheng-005",
      },
      {
        title: { zh: "父母唯其疾之忧", en: "Let parents have only illness to worry about" },
        body: {
          zh: "孟武伯问孝，答案落在父母之忧。它把孝拉回会使亲者担心的具体生命，不给一条抽象家训。",
          en: "Meng Wubo asks about xiao, and the answer lands on parental worry over illness. It returns filial conduct to a vulnerable life that causes concern, not an abstract family maxim.",
        },
        sentenceId: "wei-zheng-006",
      },
      {
        title: { zh: "能养，不敬，何以别乎", en: "Support without reverence is not enough" },
        body: {
          zh: "子游问孝，孔子把“能养”压低：犬马也能得到供养。区分不在有没有付钱或送饭，而在敬。",
          en: "When Ziyou asks, Confucius lowers the claim of material support: dogs and horses also receive feeding. The distinction is not payment or food, but reverence.",
        },
        sentenceId: "wei-zheng-007",
      },
      {
        title: { zh: "色难", en: "Manner is the difficult part" },
        body: {
          zh: "子夏问孝，代劳、有酒食让长者先用都不够。最难的是脸色与态度。孝在这里不是任务完成率。",
          en: "When Zixia asks, doing the work and serving food first are not enough. The difficult part is the face and manner. Xiao is not a completion rate for family tasks.",
        },
        sentenceId: "wei-zheng-008",
      },
    ],
    confusions: [
      {
        title: { zh: "孝不是盲从", en: "Xiao is not blind obedience" },
        body: {
          zh: "“无违”不能从孔子自己的解释里剪出来。解释落在礼，不是把任何命令都变成正当。把孝直接译成 obedience，会删掉这层限制。",
          en: "“Do not disobey” cannot be cut away from Confucius's own explanation, which lands on li. It does not make every command right. Translating xiao simply as obedience deletes that limit.",
        },
      },
      {
        title: { zh: "孝不等于物质供养", en: "Xiao is not material support alone" },
        body: {
          zh: "能养、服劳、酒食都被书主动列出，又主动说不够。敬与色不是额外加分，而是把供养变成人伦之事的条件。",
          en: "Support, labor, and food are all named and then judged insufficient. Reverence and manner are not bonus points; they are what make support a human relation.",
        },
      },
      {
        title: { zh: "孝弟是根，不是仁的全部", en: "Filial conduct is a root, not the whole of ren" },
        body: {
          zh: "有子说的是“其为仁之本与”。《论语》另有克己复礼、爱人、恕等问仁答案。把孝写成仁的完整定义，会把这些问答排除出去。",
          en: "Youzi says it may be a root of becoming ren. The Analects also answers questions about ren with restraint, loving others, and shu. Making xiao the whole definition excludes those dialogues.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选能说明孝如何落在敬、礼、忧与态度上的章句。其余原文中出现“孝”字的章句，收在选读之后。",
      en: "These passages show xiao taking form in reverence, li, concern, and manner. Other source passages that contain 孝 follow under “view all.”",
    },
    featuredSentenceIds: [
      "xue-er-002",
      "xue-er-006",
      "xue-er-011",
      "wei-zheng-005",
      "wei-zheng-006",
      "wei-zheng-007",
      "wei-zheng-008",
      "wei-zheng-021",
      "li-ren-020",
      "xian-jin-004",
      "zi-zhang-018",
    ],
    practice: {
      zh: "今天与父母、长辈或承担照护关系的人说一次话，只练“色难”：在开口前放下不耐烦的脸色，先把对方的问题听完，再回答。",
      en: "In one conversation today with a parent, elder, or someone in a relation of care, practice only “the manner is difficult”: release the impatient face, hear the question through, then answer.",
    },
    practiceSentenceId: "wei-zheng-008",
    faqs: [
      {
        question: { zh: "“无违”是不是父母说什么都要听？", en: "Does “do not disobey” mean doing whatever parents say?" },
        answer: {
          zh: "孔子在同一章向樊迟解释为生事、死葬、祭之以礼。答案受礼约束，原文没有把父母的每句话都变成命令。",
          en: "In the same passage Confucius explains it to Fan Chi as serving, burying, and sacrificing according to li. The answer is bounded by li; it does not turn every parental word into a command.",
        },
      },
      {
        question: { zh: "“孝弟为仁之本”是谁说的？", en: "Who says filial conduct is a root of ren?" },
        answer: {
          zh: "有子。原文是“孝弟也者，其为仁之本与”，不是“子曰”，也保留问断语气。",
          en: "Youzi. The source says “孝弟也者，其为仁之本与”; it is not marked “the Master said,” and it retains a questioning cadence.",
        },
      },
      {
        question: { zh: "为什么四个人问孝得到不同答案？", en: "Why do four askers receive different answers about xiao?" },
        answer: {
          zh: "孟懿子、孟武伯、子游、子夏各问一次，答案落在礼、忧、敬、色。问者与缺口不同，书没有把四答压成一句定义。",
          en: "Meng Yizi, Meng Wubo, Ziyou, and Zixia each ask once; the replies land on li, concern, reverence, and manner. Different askers expose different lacks, and the book does not compress them into one definition.",
        },
      },
      {
        question: { zh: "给父母生活费就算孝吗？", en: "Is providing money to parents enough for xiao?" },
        answer: {
          zh: "《为政》直接说能养不够，又说服劳、酒食也不够。物质支持重要，但原文用敬与色判断它成不成人伦。",
          en: "Wei Zheng explicitly says support is insufficient, then says labor and food are insufficient too. Material care matters, but reverence and manner determine the human relation in the source.",
        },
      },
      {
        question: { zh: "“三年无改于父之道”在本站有几处？", en: "Where does “not changing the father's way for three years” appear?" },
        answer: {
          zh: "《学而》xue-er-011 与《里仁》li-ren-020 都有。它是古代继承与丧制语境中的判断，不能脱离两章直接改写成现代家庭的普遍命令。",
          en: "It appears at xue-er-011 and li-ren-020. It is a judgment within ancient succession and mourning contexts, not a universal modern family command that can be lifted out unchanged.",
        },
      },
      {
        question: { zh: "为什么白话导读里谈孝的句子不都进索引？", en: "Why does every guide passage about filial care not enter the index?" },
        answer: {
          zh: "自动相关只匹配古文原文里的“孝”。导读可以解释一个动作具有孝意，但解释层不能反过来改变底本的词语分布。",
          en: "Automatic related passages match 孝 in the classical source only. A guide may interpret an act as filial, but an interpretive layer cannot rewrite the word distribution of the base text.",
        },
      },
    ],
    relatedSlugs: ["ren", "li", "you-zi", "zeng-zi", "xue", "zheng", "min-zijian"],
  }),

  zheng: wordPage({
    slug: "zheng",
    subtitle: {
      zh: "政不是一套管人的技巧；《论语》先问在位者能否正己、取信、举贤，并让刑罚退到德与礼之后。",
      en: "Zheng is not a toolkit for managing others. The Analects first asks whether the person in office can rectify the self, earn trust, raise the worthy, and put punishment behind virtue and li.",
    },
    metaDescription: {
      zh: "政在《论语》里不是管理术或以刑求齐。此页从为政以德、政者正也、民无信不立、举贤才与正名说明政治先约束在位者。",
      en: "Government in the Analects is not management technique or rule by punishment. Read how virtue, self-rectification, trust, appointments, and names shape office.",
    },
    uses: [
      {
        title: { zh: "为政以德，譬如北辰", en: "Govern through virtue, like the north star" },
        body: {
          zh: "北辰居其所而众星共之，强调的是在位者所立的方向，不是操作群众的技巧。政从自身的位置与德性开始。",
          en: "The north star stays in its place while the other stars turn toward it. The image concerns the direction established by the person in office, not a technique for manipulating a crowd.",
        },
        sentenceId: "wei-zheng-001",
      },
      {
        title: { zh: "政刑使民免，德礼使民有耻且格", en: "Punishment produces escape; virtue and li produce correction" },
        body: {
          zh: "政与刑可以让人只求免罪；德与礼才把行为带到羞耻与自我归正。这里不是取消规则，而是拒绝把免罚当成政治完成。",
          en: "Administration and punishment can make people seek only escape. Virtue and li bring shame and self-correction. The contrast does not abolish rules; it refuses to treat avoiding penalty as completed government.",
        },
        sentenceId: "wei-zheng-003",
      },
      {
        title: { zh: "民无信不立", en: "A polity cannot stand without public trust" },
        body: {
          zh: "子贡逼问食、兵、信何者可去，孔子最后保留民信。政治资源不是只有粮食与武力，还包括人民是否相信共同秩序。",
          en: "Zi Gong asks which of food, arms, and trust can be given up. Confucius finally retains public trust. Political resources are not only supplies and force, but whether people can rely on the shared order.",
        },
        sentenceId: "yan-yuan-007",
      },
      {
        title: { zh: "政者正也", en: "To govern is to rectify" },
        body: {
          zh: "季康子问政，孔子把政拉回正：子帅以正，孰敢不正。它先要求领头者，不先把问题推给被治理者。",
          en: "Asked by Ji Kangzi, Confucius pulls zheng back to rectification: lead with correctness, and who will dare not be correct? The demand falls first on the leader, not the governed.",
        },
        sentenceId: "yan-yuan-017",
      },
      {
        title: { zh: "子为政，焉用杀", en: "Why should governing require killing?" },
        body: {
          zh: "季康子提议杀无道以就有道，孔子拒绝：在位者欲善，民会趋善。风草之喻把政治责任再次放回上位者。",
          en: "Ji Kangzi proposes killing the unprincipled to reach the Way. Confucius refuses: if the ruler desires good, the people turn toward good. The wind-and-grass image again returns responsibility upward.",
        },
        sentenceId: "yan-yuan-019",
      },
      {
        title: { zh: "先有司，赦小过，举贤才", en: "Assign offices, pardon small faults, raise the worthy" },
        body: {
          zh: "仲弓得到的是用人的次序，不是领袖独断：先让职事有人负责，容小过，举所知的贤才，也相信别人不会舍弃你不知道的人。",
          en: "Zhong Gong receives an order of appointment, not a license for solitary command: staff the offices, pardon small faults, raise the worthy you know, and trust others not to neglect those you do not.",
        },
        sentenceId: "zi-lu-002",
      },
    ],
    confusions: [
      {
        title: { zh: "政不是管理技巧目录", en: "Zheng is not a catalogue of management techniques" },
        body: {
          zh: "同样问政，子贡得到信，季康子得到正与不杀，子路得到先之劳之，子夏得到无欲速。答案随职责与缺口而变，不是一份万能清单。",
          en: "The same question yields trust for Zi Gong, rectification and no killing for Ji Kangzi, leading and labor for Zi Lu, and no haste for Zixia. Replies follow responsibility and lack; they are not one universal checklist.",
        },
      },
      {
        title: { zh: "政不是靠刑罚把人管齐", en: "Government is not aligning people by punishment" },
        body: {
          zh: "《为政》明说政刑只能使民免而无耻，《颜渊》又拒绝以杀求道。规则仍在，但强制不能代替德、礼与取信。",
          en: "Wei Zheng says administration and punishment produce escape without shame; Yan Yuan rejects killing as the road to order. Rules remain, but coercion cannot replace virtue, li, and trust.",
        },
      },
      {
        title: { zh: "正名不是文字管制", en: "Rectifying names is not policing vocabulary" },
        body: {
          zh: "正名章的链条是名、言、事、礼乐、刑罚与百姓手足。要求是所名必须可言，所言必须可行；重点在名称、责任与行动相符。",
          en: "The chain in the rectification passage runs through names, speech, affairs, li and music, punishments, and the people's action. A name must be speakable and speech actionable: title, responsibility, and conduct must fit.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选能说明政如何约束在位者、建立信任、用人并限制强制的章句。其余原文中出现“政”或“为政”的章句，收在选读之后。",
      en: "These passages show government binding officeholders, building trust, appointing people, and limiting coercion. Other source passages that contain 政 or 为政 follow under “view all.”",
    },
    featuredSentenceIds: [
      "wei-zheng-001",
      "wei-zheng-003",
      "wei-zheng-021",
      "yan-yuan-007",
      "yan-yuan-014",
      "yan-yuan-017",
      "yan-yuan-019",
      "zi-lu-001",
      "zi-lu-002",
      "zi-lu-003",
      "zi-lu-013",
      "zi-lu-017",
      "yao-yue-002",
    ],
    practice: {
      zh: "今天在要求别人改正一件事之前，先写下你在同一件事上示范了什么。若自己没有可见的正，先改这一处，再开口要求。",
      en: "Before asking someone to correct one thing today, write down what you have visibly modeled in that same matter. If your own conduct supplies no correction, change that first, then make the request.",
    },
    practiceSentenceId: "zi-lu-013",
    faqs: [
      {
        question: { zh: "“政者正也”是政的完整定义吗？", en: "Is “to govern is to rectify” a complete definition of zheng?" },
        answer: {
          zh: "不是词典定义，是孔子对季康子的判断。别的问政章还谈德、礼、信、用人、劳民与无欲速，不能被一个字谜收尽。",
          en: "It is a judgment addressed to Ji Kangzi, not a dictionary definition. Other government dialogues concern virtue, li, trust, appointments, labor, and haste; a wordplay cannot exhaust them.",
        },
      },
      {
        question: { zh: "孔子反对刑罚吗？", en: "Does Confucius reject punishment altogether?" },
        answer: {
          zh: "《为政》把政刑与德礼对举，说前者只能使民求免；正名章仍提到刑罚不中。书限制刑罚的政治位置，没有假装刑罚不存在。",
          en: "Wei Zheng contrasts administration and punishment with virtue and li, saying the former produces mere escape. The rectification passage still mentions punishments going awry. The book limits their political place; it does not pretend they do not exist.",
        },
      },
      {
        question: { zh: "正名是不是要求所有人使用官方词语？", en: "Does rectifying names require everyone to use official vocabulary?" },
        answer: {
          zh: "原章关心名不正如何导致言不顺、事不成，最后要求名可言、言可行。核心是名实与责任，不是列禁词。",
          en: "The passage asks how crooked names make speech fail and affairs collapse, ending with names that can be spoken and speech that can be enacted. Its center is accountable fit, not a banned-word list.",
        },
      },
      {
        question: { zh: "为什么不同人问政，答案不一样？", en: "Why do different askers receive different answers about government?" },
        answer: {
          zh: "子贡、季康子、子路、仲弓、子夏各处在不同角色，也暴露不同问题。问答是针对性的训练，不是从同一本管理手册抄出的章节。",
          en: "Zi Gong, Ji Kangzi, Zi Lu, Zhong Gong, and Zixia occupy different roles and reveal different failures. The dialogues are targeted instruction, not excerpts from one management manual.",
        },
      },
      {
        question: { zh: "民无信不立是否说信比粮食更重要？", en: "Does “without trust the people cannot stand” say trust always matters more than food?" },
        answer: {
          zh: "子贡是在“必不得已而去”的极端追问里逐项删减。原文不是日常预算公式，而是把政治最后不能失去的成立条件逼出来。",
          en: "Zi Gong removes items only under the extreme condition that one must be given up. The passage is not a routine budget formula; it forces out the final condition government cannot lose.",
        },
      },
      {
        question: { zh: "“不在其位，不谋其政”是不是叫人不要关心公共事务？", en: "Does “not in the office, do not plan its government” forbid public concern?" },
        answer: {
          zh: "原句划的是职位与职责边界。它不能自动推出普通人不得讨论公共善；同书还记录大量不在君位的人问政、议政。",
          en: "The line draws a boundary around office and responsibility. It does not automatically forbid ordinary concern for public good; the same book records many people outside rulership asking and arguing about government.",
        },
      },
    ],
    relatedSlugs: ["xin", "yi", "li", "junzi", "confucius", "zi-lu", "zi-gong"],
  }),

  confucius: personPage({
    slug: "confucius",
    subtitle: {
      zh: "《论语》写的是别人记下的孔子，不是孔子署名的一本专著。",
      en: "The Analects is Confucius as others wrote him down, not a monograph he signed.",
    },
    metaDescription: {
      zh: "孔子不是《论语》的署名作者，“子曰”也不等于全书每一句。此页说明述而不作、不自许圣仁，并链回可核对的原文，而不是把所有子曰堆在此人页。",
      en: "Confucius is not the signed author of the Analects, and “the Master said” is not every line in the book. This page sends you to transmitting without creating and to the refusal of sagehood, instead of dumping every 子曰 here.",
    },
    uses: [
      {
        title: { zh: "述而不作", en: "Transmitting, not creating" },
        body: {
          zh: "他自己说述而不作，信而好古。这是书中的自我定位：传，而不是以作者自居。",
          en: "He says of himself that he transmits and does not create, that he trusts and loves the old. The book locates him as a transmitter, not as an author in the modern sense.",
        },
        sentenceId: "shu-er-001",
      },
      {
        title: { zh: "其为人也", en: "What sort of man he is" },
        body: {
          zh: "叶公问孔子于子路，子路不对。孔子自己补：发愤忘食，乐以忘忧，不知老之将至。要看他，先看这句，而不是先看后来的圣号。",
          en: "The Duke of She asks Zi Lu about Confucius; Zi Lu does not answer. Confucius supplies the description: he is so intent he forgets to eat, so glad he forgets anxiety, and does not notice old age arriving. Start here, not with later holy titles.",
        },
        sentenceId: "shu-er-018",
      },
      {
        title: { zh: "若圣与仁，则吾岂敢", en: "He will not claim sagehood or ren" },
        body: {
          zh: "圣与仁，他不敢居。肯承认的是为之不厌、诲人不倦。孔子页若写成“圣人自述”，已经走错。",
          en: "Of sagehood and ren he says he would not dare. What he will claim is not growing weary in the work, and not growing weary in teaching. A Confucius page that reads as a saint's self-portrait has already left the book.",
        },
        sentenceId: "shu-er-033",
      },
      {
        title: { zh: "天将以夫子为木铎", en: "A wooden-tongued bell" },
        body: {
          zh: "仪封人见过他，对门人说天将以夫子为木铎。这是旁人的判断，不是孔子给自己的封面。",
          en: "The border warden of Yi, after seeing him, tells the disciples that Heaven means to use the Master as a wooden-tongued bell. It is another man's judgment, not Confucius's cover copy.",
        },
        sentenceId: "ba-yi-024",
      },
      {
        title: { zh: "温、良、恭、俭、让", en: "Mild, good, respectful, frugal, yielding" },
        body: {
          zh: "子贡解释夫子何以能闻其政：不是求来的，是气象使人告诉他。孔子页上的“求”，常被后学写得比子贡更贪。",
          en: "Zi Gong explains how the Master comes to hear of a state's government: not by seeking it, but by a manner that makes people tell him. Later portraits often make Confucius hungrier for influence than Zi Gong does.",
        },
        sentenceId: "xue-er-010",
      },
    ],
    confusions: [
      {
        title: { zh: "孔子不是这部书的署名作者", en: "Confucius is not the signed author of the book" },
        body: {
          zh: "书中有子曰、有子曰、曾子曰、子夏曰，也有孔子对曰。它是弟子后学编成的记录，不是孔子签了名的专著。述而不作，说的也是他不愿以作者自居。",
          en: "The book has “the Master said,” “Youzi said,” “Zengzi said,” “Zixia said,” and “Confucius replied.” It is a record compiled by later disciples, not a monograph he signed. “Transmitting, not creating” is also a refusal to stand as author.",
        },
      },
      {
        title: { zh: "“子曰”不等于《论语》每一句", en: "“The Master said” is not every line in the Analects" },
        body: {
          zh: "开卷第二、四句就是有子、曾子。子夏论学，子贡论宫墙，都不署孔子。本站也不把所有“子曰”倒进孔子页的相关列表；那份列表只收原文出现孔子、夫子、仲尼的章。",
          en: "The second and fourth passages of Book 1 already belong to Youzi and Zengzi. Zixia on learning and Zi Gong on the palace wall are not labeled Confucius. This site also does not pour every 子曰 into Confucius's related list; that list only includes source lines that name 孔子, 夫子, or 仲尼.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选能说明“书中的孔子是谁、不是谁”的章句，而不是把最先出现的十二条“孔子”堆在这里。其余原文点名孔子、夫子、仲尼的章句，收在选读之后。",
      en: "These passages are chosen to show who Confucius is in the book, and who he is not. They are not the first twelve hits on his name. Other source passages that name 孔子, 夫子, or 仲尼 follow under “view all.”",
    },
    featuredSentenceIds: [
      "shu-er-001",
      "shu-er-018",
      "shu-er-020",
      "shu-er-033",
      "wei-zheng-004",
      "xue-er-010",
      "ba-yi-024",
      "zi-han-006",
      "gong-ye-chang-012",
      "li-ren-015",
      "zi-zhang-022",
      "wei-zi-006",
    ],
    practice: {
      zh: "今天要引用一句“孔子说”之前，先打开原章看说话者。先从曾子的“吾日三省吾身”核对：若署名已经错了，就不要再传。",
      en: "Before you quote “Confucius said” today, open the passage and look at the speaker. Start with Zengzi's daily self-examination. If the attribution is already wrong, do not pass it on.",
    },
    practiceSentenceId: "xue-er-004",
    faqs: [
      {
        question: { zh: "《论语》是孔子写的吗？", en: "Did Confucius write the Analects?" },
        answer: {
          zh: "不是他署名的著作。书是弟子后学编次的问答与行事记录。他自己说述而不作。",
          en: "It is not a work he signed. The book is a compiled record of questions, answers, and conduct. He himself says he transmits and does not create.",
        },
      },
      {
        question: { zh: "“子曰”和“孔子曰”“孔子对曰”有分别吗？", en: "Do “the Master said,” “Confucius said,” and “Confucius replied” differ?" },
        answer: {
          zh: "有。子曰最常见；孔子对曰多是对国君或权臣；孔子曰在季氏等篇更整齐。分别提醒你：这不是同一支笔一次写完的讲义。",
          en: "Yes. 子曰 is the common mark. 孔子对曰 is often an answer to a ruler or minister. 孔子曰 is more regular in books such as Ji Shi. The variation is a reminder that this is not one lecture written in one sitting.",
        },
      },
      {
        question: { zh: "哪些常被错署给孔子？", en: "Which lines are commonly mis-credited to Confucius?" },
        answer: {
          zh: "君子务本是有子，吾日三省是曾子，博学笃志切问近思是子夏。先看句首，再决定能不能写“孔子说”。",
          en: "“The junzi attends to the root” is Youzi. The daily self-examination is Zengzi. Broad learning, firm purpose, earnest questioning, and close thought is Zixia. Read the opening attribution before you write “Confucius said.”",
        },
      },
      {
        question: { zh: "英文 Confucius 和中文孔丘、仲尼怎么对应？", en: "How do Confucius, Kong Qiu, and Zhongni relate?" },
        answer: {
          zh: "孔子是尊称，丘是名，仲尼是字。Confucius 是后来的拉丁写法。本站人物页用 Confucius / 孔子，引原文时保持原称。",
          en: "孔子 is the honorific, Qiu the personal name, Zhongni the courtesy name. Confucius is a later Latin form. This page uses Confucius / 孔子, and keeps the source title when quoting.",
        },
      },
      {
        question: { zh: "为什么孔子页没有把所有“子曰”列出来？", en: "Why does this page not list every “the Master said”?" },
        answer: {
          zh: "那样会把一部书收成一个人的名言集。相关列表只收原文出现孔子、夫子、仲尼的章；选读再从中另选，并补入述而不作、子不语等必须看见的句子。",
          en: "That would collapse the book into a quotation dump. The related list only includes source lines that name 孔子, 夫子, or 仲尼. The featured list is chosen from those, and also includes lines you must see, such as transmitting without creating and what he would not discuss.",
        },
      },
      {
        question: { zh: "孔子承认自己是圣人吗？", en: "Did Confucius call himself a sage?" },
        answer: {
          zh: "不。若圣与仁，则吾岂敢。太宰称圣，他也只从“吾少也贱，故多能”说起。",
          en: "No. Of sagehood and ren he would not dare. When the Grand Minister calls him a sage, he begins from “I was poor when young, therefore I can do many humble things.”",
        },
      },
      {
        question: { zh: "“己所不欲”该写成孔子语录第几条？", en: "Which number should “what you do not want done to yourself” have in a Confucius quote list?" },
        answer: {
          zh: "不要只写章节号。本站此句是 wei-ling-gong-023，卫灵公 15.23；部分编号作 15.24。问者是子贡。",
          en: "Do not cite a chapter number alone. On this site the sentence is wei-ling-gong-023, Wei Ling Gong 15.23; some numberings call it 15.24. The asker is Zi Gong.",
        },
      },
    ],
    relatedSlugs: ["yan-yuan", "zi-gong", "zeng-zi", "you-zi", "ren", "junzi", "xue", "zhongshu"],
  }),

  "yan-yuan": personPage({
    slug: "yan-yuan",
    subtitle: {
      zh: "颜渊被写成几乎不违仁的人，不是一张“完美学生”奖状。",
      en: "Yan Yuan is written as a man who could stay near ren for months. That is a description, not a badge that says “perfect student.”",
    },
    metaDescription: {
      zh: "颜渊在《论语》里不是“完美学生”口号。此页说明三月不违仁是描述、好学是稀有判断，并链回克己复礼、箪食陋巷与哭回等原文。",
      en: "Yan Yuan in the Analects is not the slogan “perfect student.” This page treats three months without leaving ren as description, fondness for learning as a rare judgment, and links 克己复礼, the humble lane, and the mourning for Hui.",
    },
    uses: [
      {
        title: { zh: "问仁，得克己复礼", en: "He asks about ren and is given restraint" },
        body: {
          zh: "颜渊问仁，孔子给功夫，不给称号。回虽不敏，请事斯语：他自己把话收成要做的事。",
          en: "Yan Yuan asks about ren. Confucius gives a discipline, not a title. “Though I am not quick, I will practice these words”: Hui takes the sentence as work.",
        },
        sentenceId: "yan-yuan-001",
      },
      {
        title: { zh: "其心三月不违仁", en: "His mind did not leave ren for three months" },
        body: {
          zh: "这是时长上的观察：其余弟子只是日月至焉。近仁被写成一种持续，不是一枚可以佩戴的印。",
          en: "This is an observation about duration: the others reach ren only by days or months. Nearness is written as continuance, not as a seal you can wear.",
        },
        sentenceId: "yong-ye-005",
      },
      {
        title: { zh: "一箪食，一瓢饮", en: "A single bowl of food, a single gourd of drink" },
        body: {
          zh: "贤哉回也，说的是不改其乐，不是清贫本身可夸。乐在陋巷里被看见，仍是描述，不是招生广告。",
          en: "“Worthy indeed was Hui” points to joy that does not change, not to poverty as a boast. The joy is seen in a humble lane; it is still a description, not a recruiting poster.",
        },
        sentenceId: "yong-ye-009",
      },
      {
        title: { zh: "有颜回者好学", en: "There was Yan Hui, who was fond of learning" },
        body: {
          zh: "好学的内容被说成不迁怒、不贰过。不幸短命死矣，今也则亡：好学在这里是悼词，不是年级第一。",
          en: "Fondness for learning is spelled out as not transferring anger and not repeating a fault. He died young; now there is none. The judgment is an elegy, not a class rank.",
        },
        sentenceId: "yong-ye-002",
      },
      {
        title: { zh: "天丧予", en: "Heaven is destroying me" },
        body: {
          zh: "颜渊死，孔子哭之恸。门人要厚葬，他说不可。疼爱与拒绝偶像化，写在同一组章里。",
          en: "When Yan Yuan dies, Confucius mourns beyond measure. The disciples want a lavish burial; he says no. Grief and the refusal to make an idol sit in the same group of passages.",
        },
        sentenceId: "xian-jin-008",
      },
    ],
    confusions: [
      {
        title: { zh: "颜渊不是“完美学生”口号", en: "Yan Yuan is not the slogan “perfect student”" },
        body: {
          zh: "书说他如愚、非助我者、屡空，也说未见其止。完美学生是后世总结。按口号读，会把这些未完成的句子抹平。",
          en: "The book also says he seemed stupid, that he was no help, that he was often empty, and that Confucius saw him go forward and never stop. “Perfect student” is a later slogan. Read as a slogan, the unfinished sentences disappear.",
        },
      },
      {
        title: { zh: "近仁是描述，不是徽章", en: "Nearness to ren is described, not awarded" },
        body: {
          zh: "三月不违仁是观察其心，不是授衔。孔子自己还说若圣与仁则吾岂敢。把颜渊写成已经领到仁的人，是把描述收成奖状。",
          en: "Three months without leaving ren watches the mind; it does not confer a rank. Confucius himself will not claim sagehood or ren. Writing Yan Yuan as a man who already holds ren turns description into a badge.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选能说明颜渊在书里如何被问、被看、被哭的章句。其余原文出现颜渊、颜回、回也的章句，收在选读之后。",
      en: "These passages show how Yan Yuan is asked, seen, and mourned. Other source passages that name 颜渊, 颜回, or 回也 follow under “view all.”",
    },
    featuredSentenceIds: [
      "wei-zheng-009",
      "gong-ye-chang-008",
      "yong-ye-002",
      "yong-ye-005",
      "yong-ye-009",
      "zi-han-010",
      "zi-han-020",
      "xian-jin-008",
      "xian-jin-010",
      "yan-yuan-001",
      "wei-ling-gong-010",
    ],
    practice: {
      zh: "不要立志“做颜渊”。取出克己复礼的四目，今天只守其中一项：非礼的那一视、听、言、或动，停一次。近仁从这一次停住开始，不从自称开始。",
      en: "Do not resolve to “be Yan Yuan.” Take the four items of returning to li, and keep one of them today: stop one look, hearing, word, or movement that is outside li. Nearness begins in that stop, not in a claim.",
    },
    practiceSentenceId: "yan-yuan-001",
    faqs: [
      {
        question: { zh: "颜渊、颜回、回也是同一个人吗？", en: "Are Yan Yuan, Yan Hui, and Hui the same person?" },
        answer: {
          zh: "是。颜渊是字，回是名。本站此页同时收入这几种称呼。",
          en: "Yes. Yuan is the courtesy name, Hui the personal name. This page collects the forms the source text uses.",
        },
      },
      {
        question: { zh: "“贤哉回也”是谁说的？", en: "Who says “worthy indeed was Hui”?" },
        answer: {
          zh: "孔子。同一组里还有哀公、季康子问谁好学，答案也是他。不要把这些句子写成颜渊的自我介绍。",
          en: "Confucius. In the same group, Duke Ai and Ji Kangzi ask who is fond of learning; the answer is again Hui. These are not Yan Yuan's self-introduction.",
        },
      },
      {
        question: { zh: "德行科是不是第一名？", en: "Is the “virtuous conduct” list a ranking?" },
        answer: {
          zh: "《先进》举德行：颜渊、闵子骞、冉伯牛、仲弓。这是分类，不是现代榜单。言语、政事、文学并列，不构成总分。",
          en: "Book 11 names virtuous conduct: Yan Yuan, Min Zijian, Ran Boniu, Zhong Gong. It is a grouping, not a modern ranking. Speech, government, and letters stand beside it; there is no total score.",
        },
      },
      {
        question: { zh: "颜渊是不是孔子指定的继承人？", en: "Was Yan Yuan named as Confucius's successor?" },
        answer: {
          zh: "书没有这样的委任。有的是好学、不违仁、哭回，以及“予不得视犹子也”。不要把悼词写成传位。",
          en: "The book records no such appointment. It records fondness for learning, not leaving ren, the mourning, and “I could not treat him as my son.” Do not turn an elegy into a succession.",
        },
      },
      {
        question: { zh: "英文 Yan Yuan 和 Yan Hui 哪一个对？", en: "Which English name: Yan Yuan or Yan Hui?" },
        answer: {
          zh: "都可以，对应字与名。本站标题用 Yan Yuan，与中文“颜渊”一致；原文出现回、颜回时保持原字。",
          en: "Either is right: courtesy name or personal name. This page titles him Yan Yuan, matching 颜渊, and keeps 回 / 颜回 when the source uses them.",
        },
      },
      {
        question: { zh: "克己复礼是颜渊的定义吗？", en: "Is “restrain the self and return to li” Yan Yuan's definition of ren?" },
        answer: {
          zh: "那是孔子答他的节目。樊迟、仲弓问仁，得到的不是同一句。不要把这一答收成颜渊的标签，也不要收成全书定义。",
          en: "It is the program Confucius gives him. Fan Chi and Zhong Gong are given other sentences. Do not make this reply Yan Yuan's label, or the book's only definition.",
        },
      },
    ],
    relatedSlugs: ["confucius", "ren", "li", "xue", "zi-gong", "junzi", "zhong-gong"],
  }),

  "zi-gong": personPage({
    slug: "zi-gong",
    subtitle: {
      zh: "子贡的锋利在问，不在把话说圆。",
      en: "Zi Gong's edge is the question, not the polished answer.",
    },
    metaDescription: {
      zh: "子贡在《论语》里不是佞者。此页说明言语不是巧言，并指出是他问出了恕（本站 wei-ling-gong-023，15.23；部分编号 15.24）。",
      en: "Zi Gong in the Analects is not a slick talker. This page separates speech from ning, and notes that his question produces shu (wei-ling-gong-023, 15.23; some editions 15.24).",
    },
    uses: [
      {
        title: { zh: "问一言，而得恕", en: "He asks for one word and is given shu" },
        body: {
          zh: "可以终身行之者乎，是子贡的问题。没有这问，书里就不会在这里落到“其恕乎”。",
          en: "“Is there one word that can be practiced for life?” is Zi Gong's question. Without it, the book does not arrive here at “is it not shu?”",
        },
        sentenceId: "wei-ling-gong-023",
      },
      {
        title: { zh: "我不欲人之加诸我", en: "He first tries a fuller sentence" },
        body: {
          zh: "子贡先把推己说成双向的满句。孔子说非尔所及也。他不是已经完成恕的人，是把问题问到边界的人。",
          en: "Zi Gong first states reciprocity as a full two-sided sentence. Confucius says it is not yet within his reach. He is not a man who has finished shu; he is the man who pushes the question to its edge.",
        },
        sentenceId: "gong-ye-chang-011",
      },
      {
        title: { zh: "言语：宰我，子贡", en: "Speech: Zai Wo and Zi Gong" },
        body: {
          zh: "先进把子贡放在言语。这是能力的分类，不是指控他佞。佞在书中另有名字，并且被远离。",
          en: "Book 11 places Zi Gong under speech. That is a grouping of ability, not a charge of ning. Slick speech has another name in the book, and is to be kept far off.",
        },
        sentenceId: "xian-jin-002",
      },
      {
        title: { zh: "女器也。瑚琏也", en: "A vessel — a hu-lian vessel" },
        body: {
          zh: "子贡问自己何如，孔子说他是器，而且是宗庙里的瑚琏。有用之才被承认，同时也被标出：还不是不器的君子。",
          en: "Asked what he is like, Zi Gong is told he is a vessel, and a hu-lian vessel of the ancestral temple. Usefulness is granted, and so is the limit: he is not yet the junzi who is not a vessel.",
        },
        sentenceId: "gong-ye-chang-003",
      },
      {
        title: { zh: "问政：民无信不立", en: "He asks about government until trust remains" },
        body: {
          zh: "子贡一层层追问足食、足兵、民信何先。答案是他问出来的，不是他预先会说的外交辞令。",
          en: "Zi Gong presses through food, arms, and the people's trust. The famous close is produced by his questioning, not by a diplomat's prepared line.",
        },
        sentenceId: "yan-yuan-007",
      },
    ],
    confusions: [
      {
        title: { zh: "言语、外交不是佞", en: "Speech and diplomacy are not ning" },
        body: {
          zh: "佞是书要远的那种口给。子贡被放在言语，被称达，能出使不辱君命；他也被提醒方人、恶徼以为知。有锋芒的问，和取悦的佞，不是同一条路。",
          en: "Ning is the slickness the book wants kept far off. Zi Gong is placed under speech, called penetrating, and able to carry a mission without disgrace. He is also warned about judging others and about taking cleverness for knowledge. A sharp question and ingratiating talk are not the same road.",
        },
      },
      {
        title: { zh: "恕是他问出来的，不是他做成的招牌", en: "Shu is the answer his question produces, not his badge" },
        body: {
          zh: "终身一言落在子贡的提问上。他自己那句“吾亦欲无加诸人”，孔子说还未及。不要把恕写成子贡的成就清单。",
          en: "The lifelong word falls on Zi Gong's question. His own “I also want to impose nothing on others” is judged not yet within reach. Do not write shu as an item on his résumé.",
        },
      },
    ],
    featuredIntro: {
      zh: "下面只选能说明子贡如何问、如何被划界的章句，而不是把他出现的前十二条都堆上。其余原文出现子贡、赐也的章句，收在选读之后。",
      en: "These passages show how Zi Gong asks and how he is bounded. They are not his first twelve appearances. Other source passages that name 子贡 or 赐也 follow under “view all.”",
    },
    featuredSentenceIds: [
      "xue-er-015",
      "gong-ye-chang-003",
      "gong-ye-chang-011",
      "yong-ye-028",
      "xian-jin-002",
      "yan-yuan-007",
      "xian-wen-018",
      "xian-wen-031",
      "wei-ling-gong-023",
      "yang-huo-019",
      "zi-zhang-022",
      "zi-zhang-023",
    ],
    practice: {
      zh: "今天只学他的问法，不学他的口才。在你要加给别人一件事之前，先问出那句终身之言：己所不欲，能否勿施？本站此句是卫灵公 15.23。",
      en: "Learn his way of asking, not his fluency. Before you impose one thing today, ask the lifelong question: if you would not want it, can you refrain? On this site that sentence is Wei Ling Gong 15.23.",
    },
    practiceSentenceId: "wei-ling-gong-023",
    faqs: [
      {
        question: { zh: "子贡和赐是同一个人吗？", en: "Are Zi Gong and Ci the same person?" },
        answer: {
          zh: "是。赐是名，子贡是字。孔子常呼赐也。",
          en: "Yes. Ci is the personal name, Zi Gong the courtesy name. Confucius often addresses him as Ci.",
        },
      },
      {
        question: { zh: "“己所不欲，勿施于人”是子贡说的吗？", en: "Does Zi Gong say “what you do not want done to yourself”?" },
        answer: {
          zh: "问是子贡的，答是孔子的。本站 wei-ling-gong-023，卫灵公 15.23；部分编号 15.24。子贡自己的表述在公冶长 gong-ye-chang-011，并被判为未及。",
          en: "The question is Zi Gong's; the answer is Confucius's. On this site: wei-ling-gong-023, Wei Ling Gong 15.23; some numberings 15.24. Zi Gong's own formulation is Gongye Chang gong-ye-chang-011, and is judged not yet reached.",
        },
      },
      {
        question: { zh: "言语科是不是说他会说话就好？", en: "Does the “speech” grouping mean he is merely eloquent?" },
        answer: {
          zh: "不是。同一书还说巧言令色鲜矣仁，又要远佞人。子贡的问政、问仁、问一言，是把话问到事情的骨头上。",
          en: "No. The same book says fine words are rarely ren, and tells you to keep far from plausible talkers. Zi Gong's questions on government, ren, and the one word drive speech onto the bone of the matter.",
        },
      },
      {
        question: { zh: "谁说子贡贤于仲尼？", en: "Who says Zi Gong is worthier than Zhongni?" },
        answer: {
          zh: "叔孙武叔、陈子禽说过这类话。子贡用宫墙、日月拒绝。人物页若把子贡写成“其实比老师更高”，是在重复被他挡下的话。",
          en: "Shusun Wushu and Chen Ziqin say this sort of thing. Zi Gong refuses it with the palace wall and the sun and moon. A page that promotes him above the teacher repeats the praise he turned away.",
        },
      },
      {
        question: { zh: "子贡是第一弟子吗？", en: "Is Zi Gong the foremost disciple?" },
        answer: {
          zh: "他自己说何敢望回。孔子也说弗如也，吾与女弗如也。货殖、言语、问学，都不是一张总冠军奖状。",
          en: "He himself says he would not dare look toward Hui. Confucius agrees they are not equal. Trade, speech, and questioning are not a championship.",
        },
      },
      {
        question: { zh: "子贡方人为什么被说？", en: "Why is Zi Gong criticized for ranking people?" },
        answer: {
          zh: "《宪问》记子贡方人，孔子说赐也贤乎哉，夫我则不暇。会问，仍可能把力气用在评人。这正是言语与佞之间要守的界。",
          en: "Book 14 records Zi Gong ranking others. Confucius asks whether Ci is so worthy, and says he himself has no leisure for that. The gift of questioning can still be spent on judging people. That is the line between speech and ning.",
        },
      },
    ],
    relatedSlugs: ["zhongshu", "confucius", "yan-yuan", "ren", "junzi", "guan-zhong", "zi-lu"],
  }),
};
