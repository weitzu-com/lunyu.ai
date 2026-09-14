import { Locale, t } from "@/lib/analects";
import { siteUrl } from "@/lib/site";

export type EditorialImage = {
  src: string;
  alt: string;
  altZh?: string;
  width: number;
  height: number;
};

export type EditorialInlineImageSlot = "speech-and-conduct" | "mourning-three-years";

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

export function editorialImageAlt(locale: Locale, image: EditorialImage) {
  return locale === "zh-Hans" && image.altZh ? image.altZh : image.alt;
}
