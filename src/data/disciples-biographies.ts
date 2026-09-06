import type {
  BiographyProfile,
  BiographySource,
  Citation,
  TimelineEvent,
} from "@/lib/biography-types";

/**
 * Scope: the 35 + 42 named entries in Shiji 67, rather than a harmonized list
 * assembled from later temple rosters. Unknown dates intentionally stay null.
 */
export const discipleSources: BiographySource[] = [
  {
    id: "disciples-shiji-67",
    title: "《史记》卷六十七·仲尼弟子列传",
    url: "https://zh.wikisource.org/wiki/史記/卷067",
    kind: "primary",
    note: "司马迁所编弟子合传；本文依其前三十五人、后四十二人的名录建立档案。公版原文，生年若由年龄差推算会另作标记。",
  },
  {
    id: "disciples-shiji-commentary",
    title: "《史记》卷六十七·集解、索隐、正义",
    url: "https://zh.wikisource.org/zh-hant/史記三家註/卷067",
    kind: "primary",
    note: "古代注本保留异名、年龄异说及宰予与阚止的辨误。注家意见与《史记》正文分开处理。",
  },
  {
    id: "disciples-analects",
    title: "《论语》公版原文",
    url: "https://zh.wikisource.org/wiki/論語/全覽",
    kind: "primary",
    note: "以篇名和章的起句定位，避免不同版本分章数的差异。多数师生问答不载发生年份。",
  },
  {
    id: "disciples-zuozhuan-ai",
    title: "《春秋左氏传》·哀公",
    url: "https://zh.wikisource.org/wiki/春秋左氏傳/哀公",
    kind: "primary",
    note: "以鲁哀公纪年定位：元年为公元前494年。公元前年份为传统纪年换算；传末闰月的跨年问题保留说明。",
  },
  {
    id: "disciples-zuozhuan-ding",
    title: "《春秋左氏传》·定公",
    url: "https://zh.wikisource.org/wiki/春秋左氏傳/定公",
    kind: "primary",
    note: "鲁定公十二年为公元前498年、十五年为公元前495年；用于子路与子贡的编年事迹。",
  },
];

const shiji = (name: string): Citation => ({
  sourceId: "disciples-shiji-67",
  locator: `卷六十七·${name}段`,
});
const analects = (locator: string): Citation => ({
  sourceId: "disciples-analects",
  locator,
});
const zuo = (locator: string): Citation => ({
  sourceId: "disciples-zuozhuan-ai",
  locator,
});
const undated = (
  title: string,
  description: string,
  citations: Citation[],
  dateLabel = "年份未详",
): TimelineEvent => ({
  year: null,
  dateLabel,
  certainty: "undated",
  title,
  description,
  citations,
});
const recorded = (
  year: number,
  title: string,
  description: string,
  citations: Citation[],
  dateLabel = `公元前${-year}年`,
): TimelineEvent => ({
  year,
  dateLabel,
  certainty: "recorded",
  title,
  description,
  citations,
});

type DiscipleSeed = {
  slug: string;
  name: string;
  courtesyName: string;
  aliases?: string[];
  group?: string;
  origin?: string;
  ageGap?: number;
  lifespan?: string;
  summary: string;
  biography: string[];
  events: TimelineEvent[];
  citations?: Citation[];
  featured?: boolean;
};

function disciple(seed: DiscipleSeed): BiographyProfile {
  const birthYear = seed.ageGap === undefined ? null : -551 + seed.ageGap;
  const birth: TimelineEvent[] = birthYear === null ? [] : [{
    year: birthYear,
    dateLabel: `约公元前${-birthYear}年`,
    certainty: "approximate",
    title: "出生（据年龄差推算）",
    description: `《史记》记${seed.name}少孔子${seed.ageGap}岁。以孔子生于公元前551年的通行纪年为基准，推算约生于公元前${-birthYear}年；这不是独立的出生纪年记录。`,
    citations: [shiji(seed.name)],
  }];
  return {
    slug: seed.slug,
    name: seed.name,
    courtesyName: seed.courtesyName === "未载" ? "" : seed.courtesyName,
    aliases: seed.aliases ?? [],
    role: "disciple",
    group: seed.group ?? "其他弟子",
    lifespan: seed.lifespan ?? (birthYear === null ? "生卒年不详" : `约前${-birthYear}年生，卒年不详`),
    origin: seed.origin ?? "籍贯未详（本传未载）",
    summary: seed.summary,
    biography: seed.biography,
    events: [...birth, ...seed.events],
    citations: [shiji(seed.name), ...(seed.citations ?? [])],
    featured: seed.featured ?? false,
  };
}

const substantialDisciples: BiographyProfile[] = [
  disciple({
    slug: "yan-hui", name: "颜回", courtesyName: "子渊", aliases: ["颜渊"],
    group: "德行", origin: "鲁国", ageGap: 30, featured: true,
    lifespan: "约前521年生，先于孔子去世；卒年有争议",
    summary: "以好学与德行见称的弟子，安于贫居，孔子屡次称许；早逝令孔子深恸。",
    biography: [
      "颜回是鲁国人，字子渊。《论语》将他列在德行一科，记孔子赞许他不迁怒、不重犯过错，虽生活清贫，仍不改变求学的志趣。",
      "师生问仁时，孔子以克己复礼相告。关于颜回的死亡，早期材料能确认他先于孔子去世，却不能仅凭《论语》给出确年；《史记》正文的年龄叙述与后来的纪年解释也不完全一致，本页不把流行卒年写作定论。",
    ],
    events: [
      undated("问仁与修身", "向孔子问仁，得到克己复礼、非礼勿视听言动的回答。问答发生年份未载。", [analects("《颜渊》·“颜渊问仁”章")]),
      undated("贫居而好学", "《论语》保存孔子称许他居陋巷而不改其乐，以及好学、不迁怒、不贰过的记载。", [analects("《雍也》·“贤哉回也”章、哀公问好学章")]),
      { year: null, dateLabel: "先于公元前479年；确年有争议", certainty: "disputed", title: "早逝，孔子痛哭", description: "《论语·先进》连续记颜渊死、孔子哭之恸及门人议葬，却未注明哪一年。《史记》记二十九岁发白、早死；不能据此把前481年或其他说法当成确定卒年。", citations: [shiji("颜回"), analects("《先进》·“颜渊死”诸章")] },
    ],
  }),
  disciple({
    slug: "min-sun", name: "闵损", courtesyName: "子骞", aliases: ["闵子骞"],
    group: "德行", ageGap: 15, featured: true,
    summary: "德行科弟子，以孝行、谨言和对出仕的审慎态度见于《论语》。",
    biography: [
      "闵损字子骞。《论语》记孔子赞许其孝，并称其言谈沉静；他对鲁国改建长府提出保留旧制的意见，得到孔子肯定。",
      "季氏想请他担任费宰，他辞谢并表示若再来召请便退居汶水之北。早期材料没有给出这些谈话的发生年份，也没有可靠的卒年记录。",
    ],
    events: [
      undated("辞谢费宰之召", "季氏使人请他任费宰，闵子骞托使者辞谢，表达远离这项任命的意愿。", [analects("《雍也》·“季氏使闵子骞为费宰”章")]),
      undated("议长府，主张沿用旧制", "鲁人准备改作长府，闵子骞认为可以沿用旧制，孔子称许其话虽不多，却能切中要点。", [analects("《先进》·“鲁人为长府”章")]),
    ],
  }),
  disciple({
    slug: "ran-geng", name: "冉耕", courtesyName: "伯牛", aliases: ["冉伯牛"],
    group: "德行", featured: true,
    summary: "列于德行科，患病时孔子亲自探望；早期传记所记事迹很少。",
    biography: [
      "冉耕字伯牛。《史记》称孔子认为他有德行，《论语·先进》亦将他列在德行科。",
      "伯牛生病，孔子探望并从窗牖执其手，为有德之人遭此疾病而悲叹。原文没有病名和确年，本页不把后世对病症的解释当作诊断，也不补写生卒年。",
    ],
    events: [undated("患病，孔子探望", "孔子从窗牖握着伯牛的手，感叹他的遭遇。具体病症与发生年份，原文都没有明确说明。", [analects("《雍也》·“伯牛有疾”章"), shiji("冉耕")])],
  }),
  disciple({
    slug: "ran-yong", name: "冉雍", courtesyName: "仲弓", aliases: ["仲弓"],
    group: "德行", featured: true,
    summary: "德行科弟子，曾任季氏宰，向孔子请教仁与为政。",
    biography: [
      "冉雍字仲弓。孔子认为他可以承担治理职责，《论语》保存了他问仁、问政的谈话，而不以门第限制对其才能的评价。",
      "任季氏宰时，仲弓请教如何从政，孔子从先有司、赦小过、举贤才作答。《史记》本传未载他的年龄差或卒年，不能照抄后出的精确生卒表。",
    ],
    events: [
      undated("任季氏宰并问政", "仲弓担任季氏家宰，问政于孔子；孔子建议先安排好属官、宽赦小过、选举贤才。", [analects("《子路》·“仲弓为季氏宰”章")]),
      undated("问仁：敬人及推己及人", "孔子以出门如见大宾、使民如承大祭，以及己所不欲勿施于人作答；仲弓表示愿努力实行。", [analects("《颜渊》·“仲弓问仁”章")]),
    ],
  }),
  disciple({
    slug: "ran-qiu", name: "冉求", courtesyName: "子有", aliases: ["冉有"],
    group: "政事", ageGap: 29, featured: true,
    summary: "长期参与季氏政务，前484年率鲁军御齐，也因为季氏聚敛受到孔子批评。",
    biography: [
      "冉求字子有，通称冉有，是《论语》所列政事科弟子。孔子认可他治理赋役的能力，也注意到他做事容易退缩，教学时有意鼓励他。",
      "《左传》记录他在鲁哀公十一年率左师抗齐，是弟子中具有明确编年事迹的人物。同年季氏问田赋，他转达孔子的意见；《论语》还保存孔子严厉批评他替季氏增加财富的文字，但不能把这段无年问答自动等同于某一次赋税改革。",
    ],
    events: [
      recorded(-484, "率左师抵御齐军", "鲁哀公十一年春，齐军入侵，冉求提出守御意见并率左师作战，樊迟任车右。鲁军取得战果，齐军夜退。", [zuo("哀公十一年春·齐为鄎故伐鲁、师及齐师战于郊")]),
      recorded(-484, "就田赋问题请教孔子", "同年冬，季孙欲以田赋，使冉有请教孔子。孔子私下主张征敛从薄，并批评不依礼制而贪取无厌。", [zuo("哀公十一年冬·季孙欲以田赋")]),
      recorded(-481, "奉季康子命劝说子路", "小邾的射携句绎来奔，要求子路为信约作保。季康子使冉有去劝子路，子路仍以不愿赞助不臣之事而拒绝。", [zuo("哀公十四年春·小邾射以句绎来奔")]),
      recorded(-472, "赴宋吊丧", "鲁哀公二十三年春，宋景曹去世，季康子使冉有前往吊丧、送葬并致送礼物。这也是他在孔子去世后仍参与政务的记载。", [zuo("哀公二十三年春·宋景曹卒、季康子使冉有吊")]),
      undated("因替季氏聚敛受批评", "《论语》记冉求为季氏聚敛，孔子批评并让弟子鸣鼓攻之；该章本身不载年份。", [analects("《先进》·“季氏富于周公”章")]),
    ],
    citations: [zuo("哀公十一年春、冬；十四年春；二十三年春")],
  }),
  disciple({
    slug: "zhong-you", name: "仲由", courtesyName: "子路", aliases: ["季路", "子路"],
    group: "政事", origin: "卞（鲁地）", ageGap: 9, lifespan: "约前542—前480年", featured: true,
    summary: "勇敢率直的政事科弟子，曾为季氏及卫国孔氏办事，前480年死于卫国内乱。",
    biography: [
      "仲由字子路，卞人，年龄与孔子较接近。《史记》写他性情勇直，受孔子礼教而入门；《论语》保存他问政、问君子、与孔子互相直言的许多谈话。",
      "他曾任季氏宰，后来在卫国孔悝处任职。《左传》哀公十五年闰月记卫乱，子路不肯因危险放弃所受职责，入城遇害；本页依传的纪年列前480年，并保留年末闰月的文本背景。",
    ],
    events: [
      undated("从学及参与政务", "《史记》记子路入孔门后任季氏宰、蒲大夫，并记他问政时得到先之、劳之、无倦的劝告；各次任职年月未载。", [shiji("仲由"), analects("《子路》·“子路问政”章")]),
      recorded(-498, "为季氏宰，参与堕三都", "鲁定公十二年，仲由任季氏宰，参与削弱三桓私邑城防的行动；《左传》本年记叔孙堕郈、季孙将堕费及费人反抗。", [{ sourceId: "disciples-zuozhuan-ding", locator: "定公十二年夏·仲由为季氏宰，将堕三都" }]),
      recorded(-481, "拒为来奔者作保", "小邾的射携句绎来奔，要求由子路担保信约。子路认为替不臣者成全其言等于认可其义，虽经冉有劝说仍拒绝。", [zuo("哀公十四年春·小邾射以句绎来奔")]),
      recorded(-480, "劝齐国陈瓘善待鲁国", "鲁哀公十五年秋，陈瓘赴楚经过卫国，仲由见他，劝陈氏善待鲁国以等待时机。", [zuo("哀公十五年秋·齐陈瓘如楚过卫")]),
      recorded(-480, "死于卫国政变", "卫太子蒯聩进入孔氏并控制孔悝。子路从外入城，拒绝逃避所食之禄对应的责任，战斗中冠缨被击断，结缨而死。", [zuo("哀公十五年闰月·季子将入、结缨而死"), shiji("仲由")], "公元前480年（哀公十五年闰月）"),
    ],
    citations: [zuo("哀公十四年春、十五年秋及闰月"), { sourceId: "disciples-zuozhuan-ding", locator: "定公十二年夏" }],
  }),
  disciple({
    slug: "zai-yu", name: "宰予", courtesyName: "子我", aliases: ["宰我"],
    group: "言语", featured: true,
    summary: "以辩才列言语科，敢于就礼制提出疑问；关于其卷入齐乱的记载，古注已提出辨误。",
    biography: [
      "宰予字子我，《史记》称他善于言辩，《论语》将他列在言语科。他与孔子讨论三年之丧的期限，也因昼寝受到批评，展示了孔门中真实而不总是意见相同的讨论。",
      "《史记》正文说他在齐与田常作乱而遭族诛；《索隐》指出这可能与同字子我的阚止混淆。因此本页保留争议，不写成已经证实的死因或卒年。",
    ],
    events: [
      undated("讨论三年之丧", "宰我提出服丧一年是否足够，孔子从子女受父母抚育与内心能否安然的角度回答。", [analects("《阳货》·“宰我问：三年之丧”章")]),
      undated("昼寝受到批评", "《论语》记宰予昼寝，孔子批评，并谈到听其言还要观察其行。原文未载年月。", [analects("《公冶长》·“宰予昼寝”章")]),
      { year: null, dateLabel: "卒年未详；死因记载有争议", certainty: "disputed", title: "齐乱记载的同名辨误", description: "《史记》正文写宰我卷入田常之乱；司马贞《索隐》指出《左传》所记阚止也字子我，怀疑传闻混淆。本页不将此据为宰予前481年死亡的定论。", citations: [shiji("宰予"), { sourceId: "disciples-shiji-commentary", locator: "卷六十七·宰予段末索隐（阚止字子我辨误）" }] },
    ],
  }),
  disciple({
    slug: "duanmu-ci", name: "端木赐", courtesyName: "子贡", aliases: ["子贡", "子贛"],
    group: "言语", origin: "卫国", ageGap: 31, featured: true,
    summary: "兼具辩才、外交实践与经商经验的弟子；《左传》留有多次可编年的交涉记录。",
    biography: [
      "端木赐字子贡，卫国人，列于言语科。他向孔子问仁、问政、问交友，也多次向他人解释和维护孔子的学问。《史记》还记他随时转货、经营积财，最终卒于齐，但没有提供确切卒年。",
      "《左传》能落实他的若干外交年份。《史记》关于子贡周旋齐、吴、越、晋而影响五国的长篇叙事，则需要与各国编年逐项辨析，本页不把整段游说故事拆成未经核验的逐年履历。",
    ],
    events: [
      recorded(-495, "观看邾隐公朝鲁", "鲁定公十五年春，子贡观看邾隐公与鲁定公相见，评论他们执玉、受玉的举止与礼仪。《左传》把评论写成对前途的判断，本页只据此记录其在场观礼。", [{ sourceId: "disciples-zuozhuan-ding", locator: "定公十五年春·邾隐公来朝、子贡观焉" }]),
      recorded(-488, "应对吴国太宰嚭", "鲁哀公七年夏，吴国要求季康子出面，季康子使子贡辞谢。子贡以礼及大国威逼小国的处境作答。", [zuo("哀公七年夏·康子使子贡辞")]),
      recorded(-483, "在橐皋答复重申盟约之请", "鲁哀公十二年夏，吴国要求寻盟，子贡说明盟约依赖守信，不在反复举行仪式。", [zuo("哀公十二年夏·公会吴于橐皋")]),
      recorded(-483, "交涉释放卫侯", "同年秋，吴人围住卫侯居所。子贡见太宰嚭，指出拘留卫侯会损害同盟并使诸侯恐惧，吴方随后放卫侯归国。", [zuo("哀公十二年秋·子贡见大宰、乃舍卫侯")]),
      recorded(-480, "随鲁使赴齐议和", "鲁哀公十五年冬，子贡作为子服景伯的副使赴齐，与陈成子交涉鲁齐关系；记载接着说明齐归还成邑。", [zuo("哀公十五年冬·子服景伯如齐、子贛为介")]),
      recorded(-479, "评论鲁哀公的诔辞", "孔子去世后，子贡评论鲁哀公生前不能用孔子、死后却作诔，以及诔辞称谓失当的问题。", [zuo("哀公十六年夏四月·孔丘卒、子贛曰")]),
      undated("经商，后卒于齐", "《史记》记子贡经营积财，曾在鲁、卫参与政事，最后卒于齐。传文没有给出他的确切卒年。", [shiji("端木赐")], "晚年，确年未详"),
    ],
    citations: [zuo("哀公七年、十二年、十五年、十六年"), { sourceId: "disciples-zuozhuan-ding", locator: "定公十五年春" }],
  }),
  disciple({
    slug: "yan-yan", name: "言偃", courtesyName: "子游", aliases: ["子游"],
    group: "文学", origin: "吴国", ageGap: 45, featured: true,
    summary: "来自吴国的文学科弟子，任武城宰时以礼乐教化为政。",
    biography: [
      "言偃字子游，《史记》明确记为吴人，少孔子四十五岁。《论语》把他列在文学科，此处的文学指礼乐、文献等学习，不等于今天的文学专业。",
      "子游担任武城宰，孔子到访时听见弦歌。他以从老师处所学的道理解释治理，孔子认可其回答。《论语·子张》还保存他与子夏一门关于教学次序的意见分歧，年份未载。",
    ],
    events: [
      undated("为武城宰，以礼乐施教", "孔子经过武城听见弦歌，以割鸡用牛刀相戏。子游引述君子学道则爱人的教诲，孔子对门人肯定他的回答。", [analects("《阳货》·“子之武城”章"), shiji("言偃")]),
      undated("讨论教学的本末", "子游认为子夏门人长于洒扫应对，却应继续追究根本；子夏回应教学应辨先后。《论语》保存两者论学的差异。", [analects("《子张》·“子夏之门人小子”章")]),
    ],
  }),
  disciple({
    slug: "bu-shang", name: "卜商", courtesyName: "子夏", aliases: ["子夏"],
    group: "文学", ageGap: 44, featured: true,
    summary: "文学科弟子，以问《诗》与传授学问见称；孔子去世后在西河教学。",
    biography: [
      "卜商字子夏，少孔子四十四岁。他以诗句追问礼的意义，受到孔子启发式的肯定。《论语·子张》集中保存他的论学之语，涉及每日学习、自省以及君子处世。",
      "《史记》记孔子去世后他居西河教授，并为魏文侯师；此为传文记载，但任师起年、具体讲学地点和卒年仍需另考。本页不采用常见而缺乏此处直接纪年依据的前420年卒说。",
    ],
    events: [
      undated("问《诗》，由绘事讨论礼", "子夏由巧笑、美目等诗句问义，孔子答绘事后素；子夏进一步发问礼是否在后，获孔子称许。", [analects("《八佾》·“子夏问曰：巧笑倩兮”章")]),
      undated("西河讲学", "《史记》记孔子去世后，子夏在西河教授，并为魏文侯师。传文未记这一活动的起止年，本页仅保留先后关系。", [shiji("卜商")], "孔子去世后（前479年以后），确年未详"),
      undated("形成教学群体", "《论语·子张》多见子夏论学，并写到其门人与子张、子游的交流，显示了他从弟子到授业者的角色。", [analects("《子张》·“子夏之门人问交于子张”章、“子夏之门人小子”章")]),
    ],
  }),
  disciple({
    slug: "zhuansun-shi", name: "颛孙师", courtesyName: "子张", aliases: ["子张"],
    origin: "陈国", ageGap: 48, featured: true,
    summary: "好问为政、求仕与士的品格，留下将忠信笃敬之教写于衣带的记载。",
    biography: [
      "颛孙师字子张，陈人，少孔子四十八岁。他多次向孔子请教求仕、通达、仁与行事，孔子强调慎言慎行，以及言忠信、行笃敬。",
      "《史记》把问行的谈话放在从游陈蔡受困的背景下；《论语》该章没有独立纪年，因此本页不强行填某一年。《论语·子张》也记他答复子夏门人的交友之问。",
    ],
    events: [
      undated("问求仕之道", "子张问如何得禄，孔子回答要广闻多见、对疑与险有所保留，减少言行中的过失。", [analects("《为政》·“子张学干禄”章")]),
      undated("问行，将教诲写于衣带", "问何以行于世，孔子以忠信笃敬作答，子张写在衣带上。《史记》系于陈蔡之困，未提供独立确年。", [analects("《卫灵公》·“子张问行”章"), shiji("颛孙师")]),
      undated("与后学谈交友", "子夏门人向子张问交友，子张提出尊贤容众、嘉善矜不能的意见。", [analects("《子张》·“子夏之门人问交于子张”章")]),
    ],
  }),
  disciple({
    slug: "zeng-shen", name: "曾参", courtesyName: "子舆", aliases: ["曾子"],
    origin: "南武城", ageGap: 46, featured: true,
    summary: "以省身、忠恕与孝道著称，孔门学问向后世传授的重要人物。",
    biography: [
      "曾参字子舆，《史记》记为南武城人、少孔子四十六岁。《论语》保存他的每日省察、以仁为己任等论说，并记他用忠恕解释孔子的贯通之道。",
      "《史记》把《孝经》的传授、写作与他相联，属于古代传承说，应与现代对成书过程的研究区别。《论语·泰伯》记其病中训诫，却不提供卒年，本页不把前435年作为确定纪年。",
    ],
    events: [
      undated("论日常省察", "曾子以办事是否尽心、与朋友交往是否守信、所传所学是否温习，说明自己的日常省察。", [analects("《学而》·“曾子曰：吾日三省吾身”章")]),
      undated("以忠恕解释老师之道", "孔子说自己的道一以贯之，离开后，曾子向门人解释为忠恕而已。", [analects("《里仁》·“子曰：参乎”章")]),
      undated("病中训诫门人", "《泰伯》记曾子患病时召门弟子，并与孟敬子讨论君子所贵之道。原文没有载明年份，无法据此确定卒年。", [analects("《泰伯》·“曾子有疾”两章")], "晚年，确年未详"),
    ],
  }),
  disciple({
    slug: "tantai-mieming", name: "澹台灭明", courtesyName: "子羽", aliases: ["澹台子羽"],
    origin: "武城", ageGap: 39, featured: true,
    summary: "不以捷径行事、非公事不见卿大夫；《史记》记其南游授徒。",
    biography: [
      "澹台灭明字子羽，武城人。《论语》记子游称赞他不走小径、非公事不至自己的居室，从具体行动见其品格。",
      "《史记》叙述孔子起初因相貌低估他，后来因其修行和影响而反省；又记他南游至江，追随弟子三百。活动没有确年，年龄差在古注中另有异说，页面只按正文标作推算。",
    ],
    events: [
      undated("获子游推荐", "孔子问子游在武城是否得到人才，子游举澹台灭明，称其行不由径，非公事不至于室。", [analects("《雍也》·“子游为武城宰”章")]),
      undated("南游至江，传授学问", "《史记》记他南游至江，有三百弟子追随，名声传至诸侯；传文未给出出发或讲学年份。", [shiji("澹台灭明")]),
    ],
  }),
  disciple({
    slug: "mi-buqi", name: "宓不齐", courtesyName: "子贱", aliases: ["宓子贱"],
    ageGap: 30, featured: true,
    summary: "曾任单父宰，《史记》以他向当地贤者学习的治理实践立传。",
    biography: [
      "宓不齐字子贱，少孔子三十岁。孔子称赞他是君子，并以他说明地方社会的贤者能够影响人的成长。",
      "《史记》记他任单父宰后回报孔子，说当地有五位比自己贤能的人教他如何治理。这段政务履历没有确年，本页不把后世弹琴而治的扩展故事直接当成编年记录。",
    ],
    events: [undated("任单父宰，向当地贤者学习", "子贱向孔子报告，单父有五位贤于自己的人教他治理；孔子感叹他所治理的地方太小。", [shiji("宓不齐"), analects("《公冶长》·“子谓子贱”章")])],
  }),
  disciple({
    slug: "yuan-xian", name: "原宪", courtesyName: "子思", aliases: ["原思"],
    featured: true,
    summary: "关注出处与羞耻，生活清贫而坚持所学；字子思，与孔子之孙孔伋应当区分。",
    biography: [
      "原宪字子思，《论语》又称原思，记他为宰时辞受禄粟，以及向孔子问耻。《史记》沿用问答，将其作为守道而贫的弟子书写。",
      "《史记》记孔子卒后，子贡来访原宪，原宪区分无财之贫与学道不能行之病。这是未定年的后事；他并非后世常称子思的孔伋，本页不合并两人的传承履历。",
    ],
    events: [
      undated("任宰而辞粟", "原思任宰，获粟九百而辞谢，孔子让他勿辞，并可分给邻里乡党。", [analects("《雍也》·“原思为之宰”章")]),
      undated("问耻与仁", "原宪就有道、无道时取禄的问题问耻，又问克制争胜、自夸、怨恨与欲望是否便是仁。", [analects("《宪问》·“宪问耻”章及“克伐怨欲”章"), shiji("原宪")]),
      undated("贫居，答子贡之问", "孔子去世后，子贡来访，原宪说自己是贫而非病；《史记》没有为这次会面注明年份。", [shiji("原宪")], "孔子去世后（前479年以后），确年未详"),
    ],
  }),
  disciple({
    slug: "gongye-chang", name: "公冶长", courtesyName: "子长", origin: "齐国（《史记》本传）",
    summary: "孔子认为其虽曾被囚却非其罪，并将女儿嫁给他。",
    biography: ["《史记》称公冶长为齐人、字子长。《论语》记孔子认为他可以婚配，虽曾身在缧绁之中，却并非他的罪过，于是把女儿嫁给他。", "早期这段记载没有说明获囚原因，也没有纪年。本页不以会鸟语等后起传说填补履历。"],
    events: [undated("获孔子认可，成为其女婿", "孔子不以曾被囚的经历否定公冶长，认为他非有罪之人，并以女妻之。", [analects("《公冶长》·“子谓公冶长”章"), shiji("公冶长")])],
  }),
  disciple({
    slug: "nangong-kuo", name: "南宫括", courtesyName: "子容", aliases: ["南容", "南宫适"],
    summary: "重视德行与慎言，反复诵读《白圭》，孔子以兄长之女妻之。",
    biography: ["《史记》以南宫括、字子容立传，把《论语》中南容、南宫适的相关言行合载。他重视德行、慎言，孔子将兄长的女儿嫁给他。", "本页依本传合载保留异名，但不进一步把他与南宫敬叔的身份关系写作已证事实；姓名异同和婚事的发生年月均需区别考证。"],
    events: [undated("重诵《白圭》，获孔子认可", "南容反复诵《白圭》相关诗句，孔子以兄之子妻之；《史记》另记其以羿、奡与禹、稷问德。", [analects("《先进》·“南容三复白圭”章"), analects("《宪问》·“南宫适问于孔子”章"), shiji("南宫括")])],
  }),
  disciple({
    slug: "gongxi-ai", name: "公皙哀", courtesyName: "季次",
    summary: "《史记》以未尝出仕的选择记述这位弟子。",
    biography: ["公皙哀字季次。《史记》记孔子谈到天下无道、众人纷纷为家臣或在都邑出仕时，独举季次未尝仕。", "本传没有其出生、死亡、具体活动年份及籍贯。这里保留文献中的出处态度，不为其补造仕宦或隐居地点。"],
    events: [undated("未尝出仕", "《史记》以孔子对季次不仕的评语立传，除此之外没有明确的编年事迹。", [shiji("公皙哀")])],
  }),
  disciple({
    slug: "zeng-dian", name: "曾蒧", courtesyName: "皙", aliases: ["曾点", "曾皙"], featured: true,
    summary: "在侍坐谈志时描述暮春浴沂、风雩、咏归的愿景，获得孔子赞同。",
    biography: ["《史记》以曾蒧为名，字皙；通常又写作曾点、曾皙。与子路、冉有、公西华一同侍坐时，他从鼓瑟中起身，回答孔子对志向的询问。", "他的回答描绘暮春与冠者童子浴沂、风乎舞雩、咏而归的生活，孔子表示赞同。该章呈现志向与理想，并非已经发生于某年的游记。"],
    events: [undated("侍坐言志", "曾皙描述暮春与同伴浴沂、风雩、咏归的愿望。孔子感叹赞同他的志向；这不是可据季节推得具体年份的出游记录。", [analects("《先进》·“子路、曾皙、冉有、公西华侍坐”章"), shiji("曾蒧")])],
  }),
  disciple({
    slug: "yan-wuyao", name: "颜无繇", courtesyName: "路", aliases: ["颜路"],
    summary: "颜回之父，与儿子先后从学孔子；因颜回丧事见于《论语》。",
    biography: ["颜无繇字路。《史记》明确说他是颜回的父亲，父子在不同时间从学孔子。", "颜回死后，颜路因家贫请孔子出车以为外椁，孔子以身份与自己葬子之例作答。这不能独立确定颜回的卒年，更不能据此确定颜路的生卒年。"],
    events: [undated("为颜回丧事向孔子求车", "颜回去世后，颜路请孔子之车以为椁，孔子回答自己葬鲤时也有棺无椁，并未应允。", [analects("《先进》·“颜渊死，颜路请子之车”章"), shiji("颜无繇")])],
  }),
  disciple({
    slug: "shang-qu", name: "商瞿", courtesyName: "子木", origin: "鲁国", ageGap: 29,
    summary: "《史记》所记孔门《易》学传承人物。",
    biography: ["商瞿是鲁人，字子木。《史记》称孔子把《易》传给他，并列出由商瞿以下传至汉代的师承线索。", "这是司马迁记录的经学传承，不是每次授受都有年月的履历。传中也保存与其生子有关的故事，本页不将预测故事转换为确定事件年表。"],
    events: [undated("受《易》并传授后学", "《史记》记孔子传《易》于商瞿，商瞿再传楚人馯臂子弘，继而列出后续师承；授受年份未载。", [shiji("商瞿")])],
  }),
  disciple({
    slug: "gao-chai", name: "高柴", courtesyName: "子羔", aliases: ["子羔"], ageGap: 30, featured: true,
    summary: "曾获子路安排任费宰，前480年卫乱时出城，与坚持入城的子路相遇。",
    biography: ["高柴字子羔。《论语》记子路使他为费宰，引出孔子对子路轻忽学习与任职准备的批评。", "《左传》哀公十五年闰月记子羔离开卫城，途中劝子路不要再入城冒险。哀公十七年又记他回答孟武伯有关会盟礼仪的问题，说明他活过孔子去世之年；卒年仍未详。"],
    events: [
      undated("子路使其为费宰", "子路安排子羔做费宰，孔子担心这会害了年轻人；师生由此讨论任职实践与读书学习。", [analects("《先进》·“子路使子羔为费宰”章"), shiji("高柴")]),
      recorded(-480, "卫乱时出城，劝止子路", "卫国政变发生时，子羔出城，与准备入城的子路相遇，说明城门已闭并劝他避免灾难。子路仍入城，子羔离去。", [zuo("哀公十五年闰月·季子将入，遇子羔将出")], "公元前480年（哀公十五年闰月）"),
      recorded(-478, "答会盟执牛耳之问", "鲁与齐盟于蒙，孟武伯问会盟时谁执牛耳，高柴举鄫衍与发阳的先例回答。", [zuo("哀公十七年十二月·公会齐侯盟于蒙、武伯问于高柴")]),
    ],
    citations: [zuo("哀公十五年闰月、十七年十二月")],
  }),
  disciple({
    slug: "qidiao-kai", name: "漆雕开", courtesyName: "子开",
    summary: "孔子劝其出仕，他以尚未充分确信自己的学养作答，孔子为之欣喜。",
    biography: ["漆雕开字子开，此从《史记》正文。《论语》保存孔子使他出仕、他辞以尚未能信的短篇问答。", "孔子对这份审慎表示欣喜。原文没有写他随后何时出仕，也没有生卒和明确籍贯记录；古籍中另见字的异说，暂不据此拼接其他生平。"],
    events: [undated("审慎回应出仕建议", "孔子劝漆雕开出仕，他回答自己对所学尚未充分确信，孔子感到高兴。", [analects("《公冶长》·“子使漆雕开仕”章"), shiji("漆雕开")])],
  }),
  disciple({
    slug: "gongbo-liao", name: "公伯缭", courtesyName: "子周", aliases: ["公伯寮"],
    summary: "因向季孙诉子路而见于《论语》，《史记》将其列入弟子传。",
    biography: ["公伯缭字子周，《论语》写作公伯寮。他向季孙诉子路，子服景伯向孔子转告，并表示自己有能力处置公伯寮。", "孔子以道之行废在命作答。本页依《史记》名单收录，并不因为进入名单就将其行为改写成褒扬故事。"],
    events: [undated("向季孙诉子路", "公伯缭诉子路，子服景伯转告孔子；孔子认为道的行废并非公伯寮能够决定。", [analects("《宪问》·“公伯寮愬子路于季孙”章"), shiji("公伯缭")])],
  }),
  disciple({
    slug: "sima-geng", name: "司马耕", courtesyName: "子牛", aliases: ["司马牛"],
    lifespan: "生年不详；《左传》哀公十四年条续述其卒",
    summary: "向孔子问仁、问君子，得到谨言、内省与不忧不惧的回答。",
    biography: ["司马耕字子牛，《论语》称司马牛。《史记》写他多言而躁，孔子对其问仁强调说话审慎，对其问君子强调内省无愧。", "《论语》还记他忧无兄弟，子夏加以宽慰。《左传》哀公十四年记司马牛交还邑、圭离宋，并接着叙述在齐、吴之间流亡，最后卒于鲁郭门外；本页区分本年出奔与未分别标月的后续行程。"],
    events: [
      recorded(-481, "交还封邑与圭，离开宋国", "宋国桓魋之乱后，司马牛交还邑与圭，前往齐国。《左传》在本年条下接续记他离齐赴吴、被遣返，最后客死鲁国城外；后续各程未分别注明月份。", [zuo("哀公十四年六月·司马牛致其邑与珪焉")]),
      undated("问仁、问君子", "孔子以仁者言语审慎、君子内省不疚相答，把重心放在真实行事而非说辞。", [analects("《颜渊》·“司马牛问仁”章、“司马牛问君子”章"), shiji("司马耕")]),
      undated("忧无兄弟，子夏相慰", "司马牛感叹别人都有兄弟、自己独无，子夏以敬而无失、与人恭而有礼相劝。", [analects("《颜渊》·“司马牛忧曰”章")]),
    ],
    citations: [zuo("哀公十四年六月·司马牛流亡及卒于鲁郭门外")],
  }),
  disciple({
    slug: "fan-xu", name: "樊须", courtesyName: "子迟", aliases: ["樊迟"], ageGap: 36, featured: true,
    summary: "既有问仁、问智和问农事的记载，也在前484年参加鲁国御齐作战。",
    biography: ["樊须字子迟，通称樊迟。《论语》多见他问仁、问智，孔子曾以爱人、知人作答；他还请求学习耕稼与园圃。", "《左传》哀公十一年记他作为冉求车右参加御齐作战，并提出渡沟进军的办法。其年龄差在不同古籍中有异说，此页出生推算仅注明《史记》正文三十六岁之说。"],
    events: [
      recorded(-484, "为冉求车右，参加御齐", "齐军伐鲁，樊迟任冉求的车右。鲁军不肯越沟时，他指出士卒尚不信任主将，并提出先行越沟以带动众人。", [zuo("哀公十一年春·冉求帅左师、樊迟为右及师不逾沟")]),
      undated("问仁与智", "樊迟向孔子问仁与智，孔子以爱人、知人回答，继而讨论举直错枉；樊迟退而向子夏请益。", [analects("《颜渊》·“樊迟问仁。子曰：爱人”章")]),
      undated("请学稼圃", "樊迟请求学习种田种菜，孔子说自己不如老农老圃，并在他离开后说明为政者应着重礼义信。", [analects("《子路》·“樊迟请学稼”章")]),
    ],
    citations: [zuo("哀公十一年春")],
  }),
  disciple({
    slug: "you-ruo", name: "有若", courtesyName: "", aliases: ["有子"], ageGap: 43, featured: true,
    summary: "《论语》以有子称之，论孝弟、礼与和；孔子死后曾受到弟子群体推重。",
    biography: ["《史记》正文记有若少孔子四十三岁，《论语》保存有子关于孝弟、信义及礼之用的论说。古籍另有年龄差记载，故这里只列依正文推算的约生年。", "《左传》哀公八年记有若参与鲁人拟夜袭吴军的选卒，计划后来被叫停。《史记》另记孔子去世后弟子因他状似孔子而推其为师的故事，未给确年。"],
    events: [
      recorded(-487, "列入拟袭吴军的选卒", "鲁哀公八年，吴军伐鲁，微虎选徒三百拟夜袭吴王住处，有若在其中；有人劝季孙避免徒损国士，行动随后停止。", [zuo("哀公八年春·微虎欲宵攻王舍、有若与焉")]),
      undated("论礼与和", "有子说明礼的实行以和为贵，同时提醒仅求和而不用礼节制，仍不可行。", [analects("《学而》·“有子曰：礼之用”章")]),
      undated("孔子卒后受到推重", "《史记》记弟子思慕孔子，因有若形貌相似而推他为师，随后又有不能回答所问的故事；无具体年份可考。", [shiji("有若")], "孔子去世后（前479年以后），确年未详"),
    ],
    citations: [zuo("哀公八年春")],
  }),
  disciple({
    slug: "gongxi-chi", name: "公西赤", courtesyName: "子华", aliases: ["公西华"], ageGap: 42, featured: true,
    summary: "关心礼仪与师生问答，曾使齐，侍坐言志时愿在宗庙会同中担任礼仪职事。",
    biography: ["公西赤字子华，《论语》常称公西华。他曾出使齐国，冉有为其母请粟，孔子由此说明救急与续富的区别。", "在侍坐言志章中，他愿在宗庙、会同之事中学习担任小相；又曾问孔子为什么对冉有、子路相同的问题给出不同回答。以上各事都没有独立年份。"],
    events: [
      undated("出使齐国", "公西赤出使齐国，冉有替其母请粟。孔子认为他乘肥马、衣轻裘，强调君子周急不继富。", [analects("《雍也》·“子华使于齐”章"), shiji("公西赤")]),
      undated("侍坐言志，愿学礼仪职事", "公西华说自己愿端章甫，在宗庙、会同中学习担任小相，孔子随后肯定其所言关乎诸侯礼事。", [analects("《先进》·“子路、曾皙、冉有、公西华侍坐”章")]),
      undated("追问同问异答的缘由", "子路与冉有同问闻斯行诸，孔子回答不同；公西华追问，孔子解释是因两人一进一退而施教。", [analects("《先进》·“子路问：闻斯行诸”章")]),
    ],
  }),
  disciple({
    slug: "wuma-shi", name: "巫马施", courtesyName: "子旗", aliases: ["巫马旗", "巫马期"], ageGap: 30,
    summary: "转告陈司败关于鲁昭公知礼的质疑，保留师生面对批评的一段对话。",
    biography: ["巫马施字子旗，《论语》中写作巫马期，《史记》叙事又称巫马旗。他把陈司败有关鲁昭公婚姻与知礼的质疑转告孔子。", "孔子说自己有过错总有人指出，是自己的幸运。事件不载年；昭公曾在位并不能单独决定这场问答发生于哪一年。"],
    events: [undated("转告陈司败的质疑", "陈司败质疑孔子称鲁昭公知礼，巫马施转告，孔子回应有过而能被人知晓是自己的幸运。", [analects("《述而》·“陈司败问：昭公知礼乎”章"), shiji("巫马施")])],
  }),
];

// These six entries end the first group of 35. The text supplies ages, but no
// independently dated career. Age-derived births must not become exact dates.
const ageOnlyDisciples: BiographyProfile[] = [
  { slug: "liang-zhan", name: "梁鳣", courtesyName: "叔鱼", ageGap: 29 },
  { slug: "yan-xing", name: "颜幸", courtesyName: "子柳", ageGap: 46 },
  { slug: "ran-ru", name: "冉孺", courtesyName: "子鲁", ageGap: 50 },
  { slug: "cao-xu", name: "曹恤", courtesyName: "子循", ageGap: 50 },
  { slug: "bo-qian", name: "伯虔", courtesyName: "子析", ageGap: 50 },
  { slug: "gongsun-long", name: "公孙龙", courtesyName: "子石", ageGap: 53 },
].map((entry) => disciple({
  ...entry,
  summary: `《史记》载${entry.name}字${entry.courtesyName}，少孔子${entry.ageGap}岁；仕履与卒年未详。`,
  biography: [
    `《史记·仲尼弟子列传》在前组三十五人的末尾载${entry.name}，字${entry.courtesyName}，少孔子${entry.ageGap}岁。出生年份仅能依所选孔子生年作约略推算。`,
    entry.name === "公孙龙"
      ? "此人为孔门弟子、字子石，不能与战国时期论白马的同名公孙龙混为一人。本传没有他的确切任职和卒年。"
      : "本传没有进一步写明其籍贯、任职、行旅和卒年。未找到可据本传落实到具体年份的生平事件，档案保留这一空缺。",
  ],
  events: [undated("从学记名", "列于《史记》前三十五位弟子中；本条除姓名、字和年龄差外，没有给出可编年的经历。", [shiji(entry.name)])],
}));

/** The final 42 entries are transcribed separately, preserving the roster's
 * rare names and missing courtesy names. A blank record is not a blank life. */
const rosterEntries: Array<{
  slug: string;
  name: string;
  courtesyName: string;
  aliases?: string[];
  note?: string;
}> = [
  { slug: "ran-ji", name: "冉季", courtesyName: "子产" },
  { slug: "gongzu-gouzi", name: "公祖句兹", courtesyName: "子之" },
  { slug: "qin-zu", name: "秦祖", courtesyName: "子南" },
  { slug: "qidiao-duo", name: "漆雕哆", courtesyName: "子敛" },
  { slug: "yan-gao", name: "颜高", courtesyName: "子骄" },
  { slug: "qidiao-tufu", name: "漆雕徒父", courtesyName: "未载" },
  { slug: "rangsi-chi", name: "壤驷赤", courtesyName: "子徒" },
  { slug: "shang-ze", name: "商泽", courtesyName: "未载" },
  { slug: "shizuo-shu", name: "石作蜀", courtesyName: "子明" },
  { slug: "ren-buqi", name: "任不齐", courtesyName: "选" },
  { slug: "gongliang-ru", name: "公良孺", courtesyName: "子正" },
  { slug: "hou-chu", name: "后处", courtesyName: "子里" },
  { slug: "qin-ran", name: "秦冉", courtesyName: "开" },
  { slug: "gongxia-shou", name: "公夏首", courtesyName: "乘" },
  { slug: "xirong-zhen", name: "奚容箴", courtesyName: "子皙" },
  { slug: "gongjian-ding", name: "公肩定", courtesyName: "子中" },
  { slug: "yan-zu", name: "颜祖", courtesyName: "襄" },
  { slug: "qiao-dan", name: "鄡单", courtesyName: "子家" },
  { slug: "goujing-jiang", name: "句井疆", courtesyName: "未载" },
  { slug: "hanfu-hei", name: "罕父黑", courtesyName: "子索" },
  { slug: "qin-shang", name: "秦商", courtesyName: "子丕" },
  { slug: "shen-dang", name: "申党", courtesyName: "周", note: "本页依《史记》正文写申党；与其他文献中的申枨、申堂等名称是否及如何对应，需另作文本考证，不凭同姓拼合生平。" },
  { slug: "yan-zhipu", name: "颜之仆", courtesyName: "叔" },
  { slug: "rong-qi", name: "荣旂", courtesyName: "子祈" },
  { slug: "xian-cheng", name: "县成", courtesyName: "子祺" },
  { slug: "zuoren-ying", name: "左人郢", courtesyName: "行" },
  { slug: "yan-ji", name: "燕伋", courtesyName: "思" },
  { slug: "zheng-guo", name: "郑国", courtesyName: "子徒", note: "郑国在此是《史记》所列人物姓名，不是把诸侯国当成人物。异本姓名问题不在本页强行合并。" },
  { slug: "qin-fei", name: "秦非", courtesyName: "子之" },
  { slug: "shi-zhichang", name: "施之常", courtesyName: "子恒" },
  { slug: "yan-kuai", name: "颜哙", courtesyName: "子声" },
  { slug: "bushu-cheng", name: "步叔乘", courtesyName: "子车" },
  { slug: "yuan-kangji", name: "原亢籍", courtesyName: "未载", note: "所据《史记》正文作“原亢籍”，未写“字”；本页保留连写形式，不自行将“籍”断为字。" },
  { slug: "yue-ke", name: "乐欬", courtesyName: "子声" },
  { slug: "lian-jie", name: "廉絜", courtesyName: "庸" },
  { slug: "shuzhong-hui", name: "叔仲会", courtesyName: "子期" },
  { slug: "yan-he", name: "颜何", courtesyName: "冉" },
  { slug: "di-hei", name: "狄黑", courtesyName: "皙" },
  { slug: "bang-xun", name: "邦巽", courtesyName: "子敛" },
  { slug: "kong-zhong", name: "孔忠", courtesyName: "未载" },
  { slug: "gongxi-yuru", name: "公西舆如", courtesyName: "子上" },
  { slug: "gongxi-zhen", name: "公西葴", courtesyName: "子上", note: "公西葴与公西舆如在所据正文中分列，虽均字子上，此处仍按原名录保留两个条目，不凭同字合并。" },
];

const rosterDisciples: BiographyProfile[] = rosterEntries.map((entry) => disciple({
  ...entry,
  summary: entry.courtesyName === "未载"
    ? `《史记》末组四十二弟子之一，仅存姓名；字及可编年生平未详。`
    : `《史记》末组四十二弟子之一，字${entry.courtesyName}；生卒与可编年事迹未详。`,
  biography: [
    `《史记·仲尼弟子列传》在“其四十有二人，无年及不见书传者纪于左”之后列出${entry.name}${entry.courtesyName === "未载" ? "，本条没有注明字" : `，字${entry.courtesyName}`}。这是本页收录其为孔门弟子档案的直接依据。`,
    entry.note ?? "所据条目不载生卒、籍贯、任职或行旅年份。后世孔庙名录、地方传说及族谱可另作研究，不能仅凭姓名为其补造一份逐年简历。",
  ],
  events: [undated("见于弟子名录", `《史记》卷六十七末组列有${entry.name}${entry.courtesyName === "未载" ? "" : `，字${entry.courtesyName}`}。原文无独立纪年，暂不能排入某一个历史年份。`, [{ sourceId: "disciples-shiji-67", locator: `卷六十七·末组四十二人名录·${entry.name}条` }])],
}));

export const discipleBiographies: BiographyProfile[] = [
  ...substantialDisciples,
  ...ageOnlyDisciples,
  ...rosterDisciples,
];
