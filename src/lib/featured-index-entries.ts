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
