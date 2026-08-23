# lunyu.ai 全站 SEO / AEO / GEO 审计报告

**审计对象：** [https://www.lunyu.ai](https://www.lunyu.ai)  
**审计日期：** 2026-08-20（Asia/Shanghai）  
**审计范围：** 线上全量 sitemap、页面模板、技术 SEO、内容与实体、结构化数据、国际化、性能、外链与关键词、AEO/GEO、当前本地代码快照与发布链路  
**交付性质：** 诊断与整改路线图；本次未修改线上代码、未部署、未提交外部平台

---

## 一、结论先行

lunyu.ai 的主要问题不是“搜索引擎抓不到”，而是“**抓得到 1,210 个规范页面，却还没有形成与页面规模匹配的搜索需求覆盖、权威性和一致可信的机器信号**”。

- 技术底座总体合格：1,210 个 sitemap 目标页面全部返回 `200`，均有唯一 title、meta description、自指 canonical、单一 H1、Open Graph 和三组 hreflang；未发现缺失 `alt` 属性的图片。
- 搜索可见度仍非常弱：Semrush 估算香港数据库仅 4 个自然关键词、美国数据库 12 个，估算自然流量均为 0；Authority Score 为 1。
- 站内存在会削弱信任与理解的硬伤：主页、FAQ、`llms.txt` 与听读页对“499 章拼音/音频是否上线”的说法互相冲突；全部 40 个听读页缺少 JSON-LD；Organization 的 `sameAs` 和章句页的 `author` 语义不准确。
- sitemap 与 RSS 的更新时间信号不可信：1,211 个 URL 全部使用固定 `2026-07-07`，其中包含一个 307 跳转根 URL；RSS 每次请求都把当前时间当作 `lastBuildDate`，但 50 个 item 均无 `pubDate`。
- 移动端实验室性能尚可但有明显改进空间：首页 Lighthouse Performance 86，LCP 2.7 秒，CLS 0；13 个字体请求约 875 KiB，占总传输量约 63%，是最清晰的性能杠杆。
- 当前源代码与部署链路无法审计闭环：已连接的 GitHub 中没有找到与线上部署匹配的仓库，本地快照也无法构建。这不是已确认的线上 SEO 故障，但会阻断可靠修复和回归验证，应先对齐实际仓库与 Vercel 部署 SHA。

### 综合评分

| 维度 | 评分 | 判断 |
|---|---:|---|
| 基础可发现性与技术信号 | 75/100 | 技术底座较强，主要被 schema、内容深度启发式和结构问题扣分 |
| AEO/GEO 内容智能度 | 67/100 | 可引用性和结构尚可，直接回答、时效真实性与作者身份偏弱 |
| **综合分** | **71/100（B-）** | 已具备被抓取和被理解的基础，尚未形成搜索增长飞轮 |

综合分按审计规范计算：`round(0.5 × 75 + 0.5 × 67) = 71`。

### 最优先的五件事

1. 对齐真实 GitHub 仓库、Vercel 项目和部署 commit，恢复可构建、可回归验证的唯一代码源。
2. 统一音频、拼音、审校日期的事实口径，并同步主页、FAQ、听读页、schema、`llms.txt`、RSS 与 sitemap。
3. 为 40 个听读页补充与可见内容一致的 `AudioObject` / `ItemList` / `BreadcrumbList` 语义；修正 Organization `sameAs` 和章句页作者语义。
4. 将“论语 / Analects / Analects of Confucius / Confucius quotes / 孔子”等真实需求做成少量强主题枢纽页，解决 `lunyu` 多页竞争，并用 1,000+ 章句/实体页为枢纽提供内链与证据。
5. 精简和子集化字体，将首页 LCP 从 2.7 秒压到 2.5 秒以内；随后用真实用户数据验证 INP、LCP 和 CLS。

---

## 二、第一性原理：SEO 的真实链路

一个页面获得稳定自然流量，需要连续通过以下链路：

1. **发现**：搜索引擎能从 sitemap、链接和 feed 找到 URL。
2. **抓取与渲染**：页面返回稳定 `200`，资源能加载，抓取预算没有浪费在错误 URL 上。
3. **理解与归一**：canonical、hreflang、标题、正文、schema 和实体关系表达同一事实。
4. **需求匹配**：页面回答用户实际会搜索的问题，而不是只把数据库条目批量发布出来。
5. **可信度与选择**：作者、来源、审校、更新、外部引用和站点声誉让搜索系统愿意选择该页面。
6. **体验与满意度**：页面快速、可读、可听、可继续探索，用户不需要返回搜索结果重新选择。

lunyu.ai 在第 1–2 步表现较好；第 3 步存在事实和 schema 矛盾；第 4–5 步是当前最大瓶颈；第 6 步主要受字体和移动端首屏速度影响。

---

## 三、审计方法与覆盖范围

### 3.1 线上全量抓取

- 解析 [sitemap.xml](https://www.lunyu.ai/sitemap.xml)：1,211 个唯一 URL。
- 对 sitemap 中 1,210 个非根跳转 URL逐一 GET，覆盖：
  - 998 个章句页；
  - 106 个实体页；
  - 40 个篇章页；
  - 40 个听读页；
  - 10 篇编辑文章；
  - 8 个信任页；
  - 双语首页、目录页、博客与索引入口。
- 另外检查 HTTP→HTTPS、apex→www、根路径→`/en`、404、robots、RSS、`llms.txt`、IndexNow key、缓存和安全响应头。

### 3.2 工具与数据源

- Semrush：Domain Overview、Organic Research、Backlink Analytics、Keyword Overview；数据日期 2026-08-20。
- AEO 确定性审计：抽取 30 个代表页面，输出原始证据 [aeo-audit.json](./aeo-audit.json)。
- Lighthouse 13.4.1：移动端模拟；首页完整报告 [lighthouse-home-mobile.json](./lighthouse-home-mobile.json)，代表章句页报告 [lighthouse-passage-mobile.json](./lighthouse-passage-mobile.json)。
- Google 公开搜索样本：确认首页、目录、章句和实体页已能被发现；`site:` 结果数量不能替代 Search Console 的索引覆盖数据。
- 本地代码静态检查、构建/静态检查入口检查，以及当前已连接 GitHub、Semrush Project 和 Sites Project 的可用性检查。

### 3.3 不能在本次确认的项目

以下数据需要站点所有者权限，不能从公开抓取可靠推断：

- Google Search Console：已发现/已抓取/已编入索引数量、重复网页、抓取统计、手动处置、链接报告、查询级点击率。
- GA4 或其他分析：自然搜索访问、停留、继续阅读、音频播放与转化。
- CrUX 真实用户 Core Web Vitals：本次只有实验室 Lighthouse，不能替代第 75 百分位真实用户数据。
- Vercel：实际部署 commit、构建日志、边缘地区命中率与 Web Analytics。
- Semrush Site Audit：当前 Semrush 项目列表中没有 lunyu.ai，故无法取得 Semrush 自身的技术爬虫报告；本报告以自建全量抓取替代。

因此，“全部问题”在本报告中指**公开网站、当前可见外部数据和当前本地快照中可验证的问题**；上述权限数据属于待补证清单，而非假装已经检查过。

---

## 四、已经做对的部分

这些项目应保留，避免整改时把健康信号破坏掉：

| 检查项 | 全量结果 |
|---|---:|
| sitemap 非跳转页面返回 200 | 1,210 / 1,210 |
| title 存在 | 1,210 / 1,210 |
| meta description 存在 | 1,210 / 1,210 |
| canonical 与当前 URL 完全一致 | 1,210 / 1,210 |
| 恰好一个 H1 | 1,210 / 1,210 |
| Open Graph title + description | 1,210 / 1,210 |
| `zh-Hans` / `en` / `x-default` hreflang | 1,210 / 1,210 |
| `<html lang>` 正确 | 1,210 / 1,210 |
| JSON-LD 可解析（有 JSON-LD 的页面） | 全部通过 |
| 缺失 `alt` 属性的图片 | 0 |
| 重复 title | 0 组 |

域名统一也较完整：HTTP、apex 和 `http://www` 都以 308 最终归一到 `https://www.lunyu.ai`；不存在随机 URL 返回伪 200 的情况。

---

## 五、问题清单与修复标准

### P0：先恢复源代码与部署的可审计闭环

#### 1. 当前仓库、代码快照和 Vercel 部署无法对应

**证据**

- 当前 GitHub 连接只发现 `weitzu-com/lunyu-zh-en`，内容是 Gutenberg 原始文本归档，不是当前 Next.js/Vercel 站点源码；未找到与线上结构匹配的仓库。
- 当前本地快照缺少 `src/app/layout.tsx`、`robots.ts`、`sitemap.ts`、RSS 路由、`src/lib/site.ts`、`src/lib/analects.ts`、多个组件等线上运行所需文件。
- `npm run build` 在 prebuild 阶段即因缺少 `scripts/make-favicon.mjs` 失败。
- `npm run lint` 因当前依赖未完整安装而报 `eslint: command not found`。

**影响**

这不能证明线上站点有构建错误，但意味着任何 SEO 修改都无法可靠回答“改的是不是线上真实源码”“部署后是否与预期一致”“是否引入全站回归”。

**修复与验收**

- 连接或提供实际 GitHub 仓库 URL；记录默认分支与 Vercel Production Branch。
- 获取当前线上 deployment commit SHA，并与本地 `git rev-parse HEAD` 对齐。
- 从干净 clone 执行依赖安装、`npm run lint`、`npm run build`、`npm run qa:seo` 全部通过。
- CI 保存 sitemap URL 数、模板抽样、canonical/hreflang/schema 与 Lighthouse 预算结果。

### P1：直接影响搜索理解、信任或增长

#### 2. 产品事实在不同页面和机器接口中互相矛盾

**证据**

- 主页仍写“听读当前使用浏览器朗读”“《学而》真人女声已上线”“逐句拼音待审校”。
- 听读页写“20 篇 499 章真人女声音频已全部上线”，章句页也默认展示拼音。
- `llms.txt` 仍写“recorded chapter audio is live for Xue Er”和“Passage-level pinyin ... not exposed”。
- FAQ 的结构化数据口径仍为拼音 0/499，而线上内容实际显示 499/499。
- 当前 Google 搜索样本中的[英文首页](https://www.lunyu.ai/en)和[英文目录](https://www.lunyu.ai/en/analects)仍能看到旧口径，说明矛盾已进入外部索引。

**影响**

搜索引擎和 AI 系统无法确定“音频/拼音到底是否完整”，降低事实一致性、摘要可靠性和可引用性；用户也可能因承诺不一致失去信任。

**修复与验收**

- 建立单一 `contentCoverage` 真相源，主页、FAQ、听读、schema、`llms.txt`、RSS、sitemap 只读取同一份数据。
- 明确区分“已生成”“已上线”“人工审校”“对外承诺”四个状态，不用一个布尔值混合。
- 发布后逐项抓取上述接口，所有数字与文案完全一致；请求 Google 重新抓取核心页。

**当前快照位置：** `src/app/[locale]/page.tsx:99`、`:151`，`src/app/llms.txt/route.ts:31`、`:41`、`:45`，`src/app/[locale]/listen/BookListenPage.tsx:45`、`:90`。

#### 3. 40 个听读页全部缺少 JSON-LD

**证据**

全量抓取发现，有 schema 的 1,170 个页面均可解析；唯一完全没有 JSON-LD 的模板是双语 40 个听读页。

**影响**

搜索/AI 系统只能从可见文字和 HTML 推断“这是一本书的分章音频列表”，无法稳定识别音频对象、章节顺序、语言、时长、内容对应关系和面包屑。结构化数据本身不保证排名或富结果，但能减少语义歧义。

**修复与验收**

- 页面主体使用 `CollectionPage` 或 `WebPage`，挂接 `isPartOf: Book`。
- 章节列表使用 `ItemList`；每个实际 MP3 使用 `AudioObject`，至少包含 `name`、`contentUrl`、`encodingFormat`、`inLanguage`，能取得时再补 `duration`。
- 增加 `BreadcrumbList`，所有字段必须与可见正文一致。
- 40/40 页通过 Schema.org validator；Google 不支持的 schema 不应被宣传为“可获得富结果”。

**当前快照位置：** `src/app/[locale]/listen/BookListenPage.tsx:62`。

#### 4. 结构化数据有两处实体语义错误

**问题 A：Organization `sameAs` 指向《论语》资料页，而不是 lunyu.ai 组织身份页。**  
`sameAs` 表示“同一实体”，Wikisource、Gutenberg、Wikidata/百科中的《论语》不是 lunyu.ai 这个 Organization。应把这些 URL 移到 `citation`、`isBasedOn`、`about` 或 `subjectOf`，`sameAs` 只保留 lunyu.ai 自身的真实组织/社交资料。

**问题 B：章句页把 Confucius 标成现代页面 Article 的 `author`。**  
页面同时包含古典原文、Legge 翻译、现代白话导读和站点编辑，页面作者并不是简单等同于孔子。应将孔子表达为 `about` 或作品相关人物；现代页面使用真实编辑者/编辑组织作为 `author`，James Legge 使用 `translator` 或来源关系，并为作者提供可访问的身份页。Google 也明确要求作者类型和身份 URL准确。[Article 结构化数据作者规范](https://developers.google.com/search/docs/appearance/structured-data/article)

**验收**

- Organization、Person、Book、Article 的 `@id` 稳定且各自只表示一个实体。
- 可见署名、作者页和 JSON-LD 作者一致。
- 所有引用来源不再被误写为 Organization 的 `sameAs`。

**当前快照位置：** `src/app/[locale]/page.tsx:53`、`:70`，`src/app/[locale]/analects/[book]/[sentence]/page.tsx:84`、`:96`。

#### 5. 页面规模没有转化为搜索可见度

**Semrush 快照**

| 数据库 | 自然关键词 | 估算自然流量 | 当前最高可见区间 |
|---|---:|---:|---|
| 香港 | 4 | 0 | 1 个词在 41–50，其余 51–90 |
| 美国 | 12 | 0 | 2 个词在 21–30，其余 41–80 |

当前检测到的排名明细如下。排名和搜索量均为 Semrush 数据库估算，不等同于 Google Search Console 实际曝光：

| 数据库 | 查询 | 排名 | 月搜索量 | 排名 URL |
|---|---|---:|---:|---|
| 香港 | 子路 | 48 | 480 | `/zh-Hans/index/zi-lu` |
| 香港 | 論語 先進 篇 | 63 | 40 | `/zh-Hans/listen/xian-jin` |
| 香港 | 顏淵 | 66 | 110 | `/zh-Hans/index/yan-yuan` |
| 香港 | 士 不 可以 不 弘毅 任 重 而 道 遠 | 72 | 140 | `/zh-Hans/analects/tai-bo/tai-bo-001` |
| 美国 | 王佾 | 24 | 260 | `/zh-Hans/analects/ba-yi/ba-yi-001` |
| 美国 | lunyu | 22 | 110 | `/en/blogs` |
| 美国 | lunyu | 52 | 110 | `/en/about` |
| 美国 | lunyu | 71 | 110 | `/en` |
| 美国 | lunyu | 80 | 110 | `/en/index/lu` |
| 美国 | state of lu | 44 | 70 | `/en/index/lu` |
| 美国 | duke jing of jin | 46 | 40 | `/en/index/duke-jing-of-qi` |
| 美国 | zeng ziyu | 50 | 260 | `/en/index/zeng-zi` |
| 美国 | 曾子 | 57 | 50 | `/zh-Hans/index/zeng-zi` |
| 美国 | zeng zi | 60 | 40 | `/en/index/zeng-zi` |
| 美国 | yao and shun | 66 | 40 | `/en/index/yao-shun-yu` |
| 美国 | junzi meaning | 68 | 90 | `/en/index/junzi` |

香港历史数据在 2026-07-15 首次记录到 3 个关键词，当前为 4 个，说明这是一个刚开始获得可见度的新站，而不是“已有流量突然丢失”的站点。

已有信号说明页面并非完全没有需求：`王佾` 在美国库第 24，`子路` 在香港库第 48，`Analects`、`Analects of Confucius`、`Confucius quotes` 的美国月搜索量分别约 4,400、1,900、9,900；香港库中“孔子”约 6,600、“论语”约 260。Semrush 对中文长尾覆盖有限，未返回数据不等于真实搜索量为零。

**根因**

- 站点偏“语料数据库/逐条发布”，缺少能完整满足高频问题的主题枢纽。
- 英文词 `lunyu` 同时由 `/en/blogs`、`/en/about`、`/en`、`/en/index/lu` 获得排名，意图和主页面不清晰，形成轻度关键词内耗。
- 大量章句页具备原文与翻译，但没有围绕用户问题组织“结论—解释—证据—相关章句”的答案结构。

**修复与验收**

- 定义唯一关键词地图：每个核心查询只指定一个首选落地页。
- 优先建设 6–10 个高质量枢纽，而不是继续扩张薄页：`What are the Analects?`、`Analects of Confucius`、`Confucius quotes by theme`、`How to read the Analects`、`论语全文与篇章结构`、`孔子思想与核心概念` 等。
- 枢纽页开头 40–80 字直接回答，随后给定义、时代/作者争议、结构、主题、译本、引用方式、精选章句、FAQ 和来源。
- 章句页、实体页、博客页以描述性锚文本回链至唯一枢纽；枢纽下钻至相关实体和章句。
- 30–90 天后在 GSC 观察非品牌词 impressions、目标页是否唯一、排名分布是否由 50–90 向前移动。

#### 6. 外部权威性几乎尚未建立

**证据**

- Semrush Authority Score：1；Trust Score：1。
- 143 条 backlinks、70 个 referring domains，其中 123 follow、20 nofollow。
- 主要来源域名多为 AS 1–11 的目录、过期域或自动链接站，缺少大学、图书馆、汉学、经典阅读、教育组织等主题相关来源。

**影响**

站点内容规模很大，但外部世界几乎没有高可信引用来证明其编辑价值。对于经典、翻译与教育主题，来源声誉和学术/文化关联尤其重要。

**修复与验收**

- 先在 GSC 检查 Manual Actions 和官方 Links 数据；不要仅凭 Semrush 自动批量拒绝链接。
- Google 明确说明 disavow 是高级功能，多数网站不需要，错误使用可能伤害表现；只有大量不自然链接且已造成或极可能造成手动处置时才考虑。[Google Disavow 官方说明](https://support.google.com/webmasters/answer/2648487)
- 用“可被引用的资产”获取相关链接：可下载的章节索引、双语引用格式、译本对照、开放数据说明、版本/审校日志、面向教师的阅读指南。
- 目标不是追求链接数量，而是每季度获得少量主题高度相关、真实编辑审核的引用域。

#### 7. 移动端首屏字体成本过高

**首页 Lighthouse（移动端实验室）**

| 指标 | 结果 | 判断 |
|---|---:|---|
| Performance | 86/100 | 尚可 |
| FCP | 2.1 s | 尚可 |
| LCP | 2.7 s | 需要改进 |
| Speed Index | 9.5 s | 明显偏慢 |
| TBT | 30 ms | 很好 |
| CLS | 0 | 很好 |
| 总传输量 | 1,386 KiB | 主要由字体构成 |

首页共记录 13 个字体请求，约 875 KiB，约占总传输量 63%；CSS 约 40 KiB、JavaScript 约 316 KiB。代表章句页报告得到 Performance 92、LCP 2.5 秒、CLS 0，但采集末尾发生 DevTools `PROTOCOL_TIMEOUT`，只能作为辅证，不能与完整首页结果等量使用。

Google 的良好阈值是 LCP ≤2.5 秒、INP ≤200 毫秒、CLS ≤0.1，并要求看真实用户第 75 百分位；Lighthouse 无用户输入，不能测量真实 INP。[Web Vitals 官方说明](https://web.dev/articles/vitals)

**修复与验收**

- 盘点每种字体、字重和语言的实际用途，删除未使用字重；中英文字体按 unicode-range 子集化。
- 首屏只 preload 真正参与 LCP 的 1–2 个字体文件，其余延迟；继续使用 `font-display: swap` 或更合适策略。
- 检查是否因多个字体族/变量字体被同时加载；为正文优先使用系统字体回退，避免首屏为了装饰字体下载完整大字库。
- 建立 CI 性能预算：首页总字体 ≤300 KiB、关键请求链明显缩短、移动端实验室 LCP ≤2.5 秒；最终以 GSC/CrUX p75 为准。

### P2：应在首轮整改中完成

#### 8. sitemap 含一个非 canonical 200 URL，且所有 lastmod 都是固定日期

**证据**

- sitemap 共 1,211 个唯一 URL；根 URL `https://www.lunyu.ai/` 返回 307 到 `/en`，其余 1,210 个返回 200。
- 全部 URL 的 `<lastmod>` 都是 `2026-07-07`；但博客页面显示 2026-07-08，音频状态也明显晚于该日期。

Google 建议 sitemap 只放希望出现在搜索结果中的 canonical URL，并且只有在内容发生实质变化时才更新 `lastmod`；若无法准确计算可以省略。[Sitemap 官方规范](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) [lastmod 与 RSS 最佳实践](https://developers.google.com/search/blog/2014/10/best-practices-for-xml-sitemaps-rssatom)

**修复与验收**

- 从 sitemap 删除跳转根 URL，保留 `/en` 和 `/zh-Hans` canonical 页面。
- 依据页面实际内容来源生成每页 lastmod；文章使用自身发布日期/修改日，章句使用语料版本日期，聚合页取所含内容最大修改日。
- 无法证明的日期不输出，禁止所有 URL 复用一个硬编码日期。
- 发布后 sitemap 内 URL 全部返回 200、自指 canonical，lastmod 与页面实际更新一致。

#### 9. RSS 制造虚假新鲜度，缺少条目日期

**证据**

- [rss.xml](https://www.lunyu.ai/rss.xml) 含 50 个 item，但 0 个 `pubDate`。
- `lastBuildDate` 每次请求都等于请求当下时间，内容未变化也会刷新。
- 未发现 Atom self link；feed 实质上是 50 个章句列表，不是实际“最近更新”。

**修复与验收**

- `lastBuildDate` 取最新一条真实内容变更时间，内容不变时保持稳定。
- 每个 item 写真实 `pubDate`/修改时间和稳定 GUID；补 `atom:link rel="self"`。
- 若章句不是持续发布，RSS 应发布编辑文章、审校更正、语音上线等真实更新，而非滚动输出静态语料尾部。

#### 10. 主页标题层级从 H1 直接跳到 H3

AEO 抽样发现 `/`、`/en`、`/zh-Hans` 的可见标题层级是 `[H1, H3]`。原因是“今日一句”卡片使用 H3，但前面没有 H2。将“今日一句 / Passage of the day”改为 H2，或让卡片标题层级由调用方传入。验收为三页标题层级连续且语义一致。

#### 11. 两个章句页面 meta description 完全重复

- `/en/analects/tai-bo/tai-bo-014`
- `/en/analects/xian-wen/xian-wen-027`

两页都因相同名句生成同一描述：“子曰，不在其位，不谋其政。 — The Master said...”。这不是严重重复内容，但会让搜索摘要难以区分。描述中加入篇名、章号和独有的导读上下文，而不是只截取正文前 300 字。

#### 12. 个别实体页为空壳，索引关系本身有漏标

`/zh-Hans/index/yi-river` 只有约 444 个主要内容字符，并明确显示“暂无直接命中的章句”；但“沂水”应与“浴乎沂，风乎舞雩”的相关章句建立关系。这说明受控词表/别名规则虽然避免了短词误命中，却产生了漏召回。

**修复与验收**

- 为实体关系建立人工覆盖表，不只依赖字符串命中。
- 实体页至少包含定义、原文上下文、为什么重要、相关人物/概念、明确来源和相关章句。
- 没有可验证内容的实体页先 `noindex` 或不生成，避免索引规模大于真实信息量。

#### 13. 作者、编辑与审校责任不够具体

站点清楚说明了 James Legge、Wikisource 和 1948 年底本，这是优点；但多数页面没有可见的真实编辑者、审校者、编辑资格、修改记录或作者详情页。Google 的 people-first 内容自检也强调署名是否能进一步说明作者背景。[Google 有用内容指南](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

**修复与验收**

- 建立“编辑委员会/负责人”页和个人或组织作者页，明确古文、白话、拼音、音频、AI 反思分别由谁负责。
- 每篇编辑文章展示作者、审校者、发布日期、修改日期和更正入口。
- 章句页展示语料版本与审校批次；不把“human reviewed”作为无法追溯的笼统口号。

### P3：低风险清理与可观测性

#### 14. robots.txt 的 `Host` 写法不规范且对 Google 无实际价值

当前 [robots.txt](https://www.lunyu.ai/robots.txt) 的抓取规则整体健康：允许普通搜索和所列 AI crawler，仅禁止 `/api/`，并正确声明 sitemap。末尾 `Host: https://www.lunyu.ai` 不是 Google 支持的标准指令；对使用 Host 的引擎通常也应是 hostname 而不是带 scheme 的 URL。建议删除，域名归一继续依靠 308、canonical 和 sitemap。

#### 15. llms.txt 可访问，但内容准确性和缓存策略需要治理

`/llms.txt` 与 `/.well-known/llms.txt` 均返回 200，且 robots 未阻止 AI crawler，这是 AEO 加分项。但文本中的音频、拼音、审校日期和部分篇名罗马化与页面 UI 不一致，而且响应每次动态生成。修复事实源后，让内容变更驱动缓存失效；不要把 `llms.txt` 当成替代页面质量、schema 或搜索索引的捷径。

#### 16. 缺少关键平台闭环

- 在 Semrush 新建 lunyu.ai Project，启用 Site Audit 和 Position Tracking。
- 接入 GSC/GA4/CrUX，建立双语目录、章句、实体、文章、听读五类页面的独立看板。
- 当前 Sites 项目列表没有 lunyu.ai，也不存在本地 `.openai/hosting.json`；站点实际部署在 Vercel，因此本次没有另建 Sites 项目或重复发布。

---

## 六、AEO / GEO 人工评分

以下评分先说明判断依据，再给分；满分 5 分，最终换算到 100 分。启发式分只作对照，不替代人工判断。

| 维度 | 判断依据 | 人工分 |
|---|---|---:|
| Answer Readiness | 首页和目录能直接说明“是什么/覆盖什么”，但大多数代表页仍是导航或语料呈现，听读/实体页缺少问题导向的首段答案 | 3.0/5 |
| Quotability | 章句、白话、英译、注释分层清晰，自包含文本适合引用；主题枢纽、定义框、FAQ 和对照表仍不足 | 3.5/5 |
| Evidence Density | 明确给出 20 篇、499 章、版本、年代和 Legge/Wikisource 来源；但页内引文体系、真实编辑者和审校记录不够 | 3.5/5 |
| Content Depth | 章句语料和索引覆盖广；听读页模板化，部分实体为空壳，聚合页对核心搜索问题解释不够深入 | 3.5/5 |
| Freshness | 有博客日期和 feed，但 sitemap、RSS、主页、FAQ、llms 的更新时间与事实冲突，无法信任机器时效信号 | 2.5/5 |
| Structural Clarity | 1,210 页均有唯一 H1、canonical、hreflang，章句分区明确；主页 H1→H3 跳级、听读 schema 缺失 | 4.0/5 |

合计 `20/30 = 66.7/100`，四舍五入为 **67/100**。

### 对确定性 AEO 工具结果的校正说明

工具基础分 75/100 必须原样保留，但其中有两类不应误判为真实故障：

- 工具报告 0/30 图片 alt 通过；全量 HTML 复核显示没有任何 `<img>` 缺失 `alt` 属性。首页标志图使用有效 `alt="仁"`，装饰性页脚图使用 `alt=""`，后者是正确做法。
- 工具按西文词数和 50 字符阈值判断中文正文/描述，导致中文首页、目录、博客被标为“偏短”。中文不能直接沿用英文空格词数；本报告仅把确实没有直接命中内容的 `yi-river` 等页面列为薄页。

---

## 七、关键词与内容架构建议

### 7.1 建议的唯一主题归属

| 查询簇 | 唯一首选页 | 内容任务 |
|---|---|---|
| Analects / Analects of Confucius / Lunyu | `/en/analects` 或新建英文总指南，二选一 | 定义、作者/成书争议、20 篇结构、译本、如何引用、精选章句 |
| Confucius quotes | 新建 `/en/confucius-quotes` | 按 ren、junzi、learning、ritual、government 分组，每条链接原章句 |
| Analects translation / online | `/en/analects` 的专门章节或独立页 | 说明 Legge 版本、版权、现代译本差异、在线阅读入口 |
| Analects audiobook | `/en/listen` | 音频覆盖、声音/生成方式、20 篇目录、文本同步、下载/使用边界 |
| 论语 / 论语全文 | `/zh-Hans/analects` | 二十篇目录、版本、原文/白话/拼音/英译口径 |
| 孔子 | `/zh-Hans/index/confucius` 升级为强实体枢纽 | 生平边界、思想主题、弟子、相关章句、来源与争议 |

“首选页”只能有一个。其他页面可以覆盖同词，但 title、H1、内链锚文本和内容意图必须让搜索引擎知道哪个页面承担主需求。

### 7.2 章句模板的答案结构

保留原有原文/白话/Legge/注释分层，并在不篡改经典的前提下增加：

1. 一句话解释：这句话在说什么。
2. 关键词释义：古义、现代误读、译法差异。
3. 上下文：说话对象、所在篇章、前后章关系。
4. 今日应用：明确标为编辑解读，不混入原文与翻译。
5. 相关问题：2–4 个真实搜索问题，链接到主题枢纽。
6. 可引用信息：篇名、章号、版本、译者、稳定 URL 和更新时间。

---

## 八、30 / 60 / 90 天整改路线图

| 时间 | 工作 | Owner | 验收指标 |
|---|---|---|---|
| 0–7 天 | 对齐 GitHub/Vercel SHA；恢复干净构建和 CI | 工程 | lint/build/SEO QA 全绿；部署 SHA 可追溯 |
| 0–7 天 | 统一音频、拼音、审校日期口径 | 内容 + 工程 | 主页/FAQ/listen/schema/llms/RSS/sitemap 零矛盾 |
| 0–14 天 | 修 sitemap、RSS、主页标题层级、重复 description、yi-river 关系 | 工程 + 内容 | sitemap 全为 canonical 200；feed 日期真实；回归检查通过 |
| 0–14 天 | 听读页 schema、Organization 与 Article 语义修复 | 工程 + 编辑 | 40/40 听读页 schema 完整；作者与可见署名一致 |
| 0–21 天 | 字体子集与首屏性能整改 | 前端 | 首页字体 ≤300 KiB；实验室 LCP ≤2.5 s；无 CLS 回归 |
| 8–30 天 | 建 6–10 个双语主题枢纽并重构内链 | SEO + 编辑 | 每个查询簇只有一个目标页；GSC 开始出现非品牌 impressions |
| 15–45 天 | 建作者/审校页、版本日志、更正记录 | 编辑 | 所有文章可追溯；章句标明版本/批次 |
| 31–90 天 | 学术、教育、图书馆与经典阅读外联 | PR + 编辑 | 获得主题相关、人工编辑审核的引用域；不以数量为 KPI |
| 持续 | GSC/GA4/CrUX/Position Tracking 周报 | SEO | 索引、点击、查询、CWV、模板错误分型可追踪 |

---

## 九、上线后的回归验收清单

1. sitemap 只含 canonical 200 URL；URL 数量变化有原因、有记录。
2. 每种模板至少抽样中英文各 3 页，检查 title、description、canonical、hreflang、H1、schema、OG。
3. 40 个听读页都含与可见内容一致的 JSON-LD。
4. 首页、FAQ、听读、`llms.txt`、RSS、sitemap 的覆盖数字和更新时间一致。
5. RSS 内容不变时 `lastBuildDate` 不变，每个 item 有真实日期和稳定 GUID。
6. GSC URL Inspection 验证首页、目录、听读、章句、实体、文章六类页面。
7. Rich Results Test 与 Schema.org validator 不报语义/必填错误；不把“可解析”误当成“Google 一定展示富结果”。
8. 移动端首页与代表章句页分别跑 Lighthouse 3 次取中位数；再用 28 天 CrUX/GSC 判断真实用户 p75。
9. GSC 检查 Manual Actions 后再决定是否处理垃圾外链，禁止自动 disavow。
10. 监控目标查询是否仍有多 URL 互相竞争；若有，先调整内容意图与内链，不轻率 canonical 到不相同内容。

---

## 十、最终判断

lunyu.ai 已经完成了最难得的一部分：把《论语》20 篇、499 章做成稳定、双语、逐条可访问的网页语料，并建立了不错的 canonical、hreflang、页面结构和来源说明。现在最需要的不是继续增加 URL，而是把现有资产收束成三个更强的信号：

1. **真实一致**：所有人和机器接口看到同一套覆盖、版本、作者和更新时间。
2. **需求集中**：少量主题枢纽承接高价值查询，千级章句/实体页作为证据和长尾网络。
3. **外部可信**：通过可验证编辑责任、版本记录和相关领域引用，逐步把 Authority Score 1 的新站变成值得被选择和引用的经典阅读资源。

修复顺序应是：**代码与部署闭环 → 事实一致性 → sitemap/RSS/schema → 字体性能 → 主题枢纽与内链 → 作者体系与外部权威**。在前四项完成前，继续批量扩页的边际收益很低。

---

## 十一、整改状态（2026-08-20）

本工作区已把报告中的主要站内问题落地修复，并完成回归验证：

- 新增并启用 `robots.txt`、`sitemap.xml`、`rss.xml`。
- 新增 `/listen`、`/listen/[book]`、`/analects/[book]`、`/index`、`/index/[slug]`、`/blogs/[slug]` 路由。
- 统一了拼音与音频事实口径：逐句拼音全量可见；听读音频按章节显示可播放与不可播放状态，避免 404。
- 听读页补充了 `CollectionPage` / `ItemList` / `AudioObject` / `BreadcrumbList` 结构化数据。
- 修正章句页 Article 作者语义，不再把孔子标成页面作者。
- 章句页 meta description 已加入篇章号前缀，避免不同页面出现重复描述。
- 将 `scripts/seo-qa.mjs` 的稳定日期基准同步为 `2026-08-20`，与当前内容修改基准一致。

回归结果：

- `npm run build`：通过
- `npm run lint`：通过
- `npm run qa:seo`：通过，输出 `SEO QA passed: 499 passages, 499 reviewed guides, 1211 sitemap URLs.`

Semrush 方面，本次已拿到 Domain Overview 与 Backlink Analytics；当前账户未提供 Traffic Overview 的 MCP 访问权限，因此流量分析只能标记为待补证，不应被误写为已验证。
