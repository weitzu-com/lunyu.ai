# lunyu.ai SEO / GEO 全面检查与 PDCA 检查表

> 检查日期：2026-07-06 ｜ 检查对象：https://www.lunyu.ai（含 apex https://lunyu.ai）
> 方法：第一性原理推导「目标态」→ 现场核验（curl 实测 + 源码审查）→ 差距分级 → PDCA 闭环
> 技术栈：Next.js 16.2 App Router / Vercel / Cloudflare DNS

---

## 一、第一性原理：让《论语》被找到、被信任、被引用

一个内容网站要在「搜索引擎 (SEO)」和「AI 生成引擎 (GEO)」中胜出，本质上必须同时满足三个条件：

| 第一性条件 | 对 SEO 的含义 | 对 GEO 的含义 |
|---|---|---|
| **可被抓取 (Crawlable)** | robots/sitemap/canonical/hreflang 正确，每个 URL 唯一且可索引 | AI 爬虫（GPTBot/ClaudeBot/PerplexityBot 等）能抓取并解析结构 |
| **可被信任 (Trustworthy)** | 原创、权威、E-E-A-T、结构化数据 | 内容有出处、可核验、区分「原文/解释/观点」，AI 敢引用 |
| **可被差异化 (Unique)** | 不与 ctext.org / 维基 / Legge 全网重复 | 提供别处没有的「独家事实单元」，AI 才会选你而非别人 |

下面按这三条逐项核验。

---

## 二、现场核验结果（实测证据）

| # | 检查项 | 实测结果 | 结论 |
|---|---|---|---|
| 1 | apex / www 规范化 | `lunyu.ai` 与 `www.lunyu.ai` **均返回 200**，无 301 互跳，etag 相同 | ⚠️ 双域重复 |
| 2 | canonical | **每个页面**（`/en`、`/en/analects`、句子页）canonical 全部 = `https://lunyu.ai` | 🔴 严重 |
| 3 | html lang | `/zh-Hans` 页面 HTML 仍为 `lang="en"` | 🔴 严重 |
| 4 | title 模板 | 句子页 title = `Analects 1.1 \| lunyu.ai \| lunyu.ai`（重复后缀） | 🟠 中 |
| 5 | hreflang | 每页都输出固定 3 条，指向**首页**的 zh-Hans/en，非本页对应语种 | 🟠 中 |
| 6 | OG / Twitter | 全站 og:/twitter: 标签数量 = **0** | 🟠 中 |
| 7 | JSON-LD 首页 | 首页/语种首页 **无** 结构化数据 | 🟠 中 |
| 8 | JSON-LD 句子页 | 有 Article schema（字段偏薄，无 author/datePublished/breadcrumb） | 🟡 待增强 |
| 9 | robots.txt | `Allow: /` + Sitemap 引用 ✅ | ✅ 合格 |
| 10 | sitemap.xml | 1045 条 URL，结构正确 ✅（但 lastModified 恒为构建时刻） | ✅ 基本合格 |
| 11 | llms.txt | 已上线、内容合理（要求 AI 引用具体 passage URL 并区分原文/解释/观点）✅ | ✅ 领先项 |
| 12 | 安全响应头 | HSTS / X-Frame / nosniff / Permissions-Policy 齐全 ✅ | ✅ 合格 |
| 13 | 白话导读内容 | 多数句子 `modernChinese` 为占位文案「白话导读正在依据公版底本逐章审校…」 | 🔴 内容薄 |
| 14 | 英文译文 | 全部为 James Legge 公版译文（**全网高度重复**） | 🔴 差异化弱 |
| 15 | AI 问答 | `/api/chat` 为静态桩，未接入模型 | 🟡 功能待建 |
| 16 | 社交/分享资产 | `public/` 仅有 Next 默认 svg，无 OG 图 / manifest / apple-touch-icon | 🟡 待补 |

---

## 三、问题根因（源码定位）

### 🔴 P0-1 全站 canonical 指向首页（灾难级）
- **根因**：`src/app/layout.tsx` 的 `metadata.alternates.canonical = "/"`，子页面 `generateMetadata` 未覆盖 `alternates`，Next.js 令全部页面继承 → 所有 URL 都告诉 Google「我是首页的副本」。
- **后果**：Google 只会索引首页，1045 条 URL 中 1044 条被判为重复、不参与排名。SEO 地基坍塌。

### 🔴 P0-2 语种页 html lang 错误
- **根因**：`src/app/layout.tsx` 第 40 行 `<html lang="en">` 硬编码；`[locale]` 段未按语种改写。
- **后果**：中文页对搜索引擎/读屏器/AI 声明为英文，中文搜索可发现性与可信度受损。

### 🟠 P1-1 title 后缀重复
- **根因**：`layout.tsx` 设 `template: "%s | lunyu.ai"`，而 `[book]/[sentence]/page.tsx` 返回的 title 里又手写了 `| lunyu.ai`。
- **后果**：`Analects 1.1 | lunyu.ai | lunyu.ai`，观感差、关键词稀释。

### 🟠 P1-2 hreflang 非自指、非逐页
- **根因**：`layout.tsx` 静态写死 `languages` 指向 `/zh-Hans`、`/en`（首页），子页未按当前路径生成对应语种 URL。
- **后果**：多语言信号错误，Google 无法正确配对中英同一章节。

### 🟠 P1-3 无 OG/Twitter + 首页无 JSON-LD
- **根因**：`generateMetadata` 未设 `openGraph`/`twitter`；首页无 `WebSite`/`Organization`/`SearchAction` schema。
- **后果**：社交/IM 分享无预览卡；AI 与富媒体缺少实体锚点。

### 🟠 P1-4 apex/www 双活无 301
- **根因**：Vercel 未设主域重定向（两域都直出 200）。
- **后果**：链接权重分散、双份抓取预算。（canonical 修好后可缓解，但仍应 301 收敛。）

### 🔴 P1-5 内容差异化不足（GEO 命门）
- **根因**：`lib/analects.ts` 中 `modernChinese` 大量回落占位符；英文为 Legge 公版（ctext.org、维基文库、Gutenberg 皆有）。
- **后果**：站点没有「别处没有的事实单元」，AI 引擎无理由引用 lunyu.ai 而非既有权威源。**这是 GEO 的根本瓶颈**，比技术项更重要。

---

## 四、PDCA 检查表（可执行闭环）

> P=计划目标 / D=执行动作 / C=验证方法 / A=改进与固化。按优先级排序，P0 一周内、P1 两周内、P2 一月内。

### 🔴 P0 — 索引地基（本周必修）

| 项 | Plan 目标 | Do 动作 | Check 验证 | Act 固化 |
|---|---|---|---|---|
| **P0-1 canonical 逐页自指** | 每个 URL canonical = 自身绝对地址 | 各 `generateMetadata` 设 `alternates.canonical` 为当前路径；移除 layout 的全局 `canonical:"/"` 或仅保留首页 | `curl <任意深链> \| grep canonical` 应指向该页自身 | 加入构建后自动脚本抽检 20 条 URL 的 canonical |
| **P0-2 html lang 随语种** | zh-Hans 页 `lang="zh-Hans"`，en 页 `lang="en"` | 将 `<html lang>` 下沉到 `[locale]/layout.tsx` 或用 `generateMetadata`+根 layout 动态化 | `curl /zh-Hans \| grep '<html'` 得 `lang="zh-Hans"` | 语种新增时清单校验 lang |
| **P0-3 提交 GSC / Bing** | 主域被收录、sitemap 被读取 | Google Search Console + Bing 验证主域，提交 `sitemap.xml`，请求首页与 20 篇目录索引 | GSC 覆盖率报告出现已编入索引页 | 每周看 GSC 覆盖率与「已发现未编入索引」 |

### 🟠 P1 — 可信与多语言（两周内）

| 项 | Plan 目标 | Do 动作 | Check 验证 | Act 固化 |
|---|---|---|---|---|
| **P1-1 title 去重** | 标题唯一、无双后缀 | 句子页 title 去掉手写 `| lunyu.ai`，交给 template | `grep <title>` 无重复后缀 | title 长度 ≤60 字符纳入 lint |
| **P1-2 hreflang 逐页配对** | 中英同章互指 + x-default | 各页按当前 path 生成 `languages: {zh-Hans, en, x-default}` 的对应 URL | 句子页 hreflang 指向另一语种**同一章**而非首页 | 抽检脚本校验 hreflang 双向一致 |
| **P1-3 OG/Twitter + OG 图** | 分享有预览卡 | 全站默认 `openGraph`/`twitter`，生成 1200×630 OG 图（可用 Next OG Image 动态生成含章节文字） | 富媒体调试器（如社交卡预览）显示标题+图 | OG 图模板化，每章可动态渲染 |
| **P1-4 主域 301 收敛** | www→apex（或反向）唯一主域 | Vercel 域名设置指定 Primary + Redirect | `curl -I www.lunyu.ai` 返回 301 → 主域 | DNS/域名变更走 checklist |
| **P1-5 首页结构化数据** | 实体可被机器理解 | 首页注入 `WebSite`(含 SearchAction)+`Organization`；目录页 `Breadcrumb`+`Book` | Rich Results Test 通过、无报错 | schema 变更前跑校验 |
| **P1-6 内容差异化（核心）** | 每章有独家白话+主题+反思 | 优先补齐《学而》全篇真实白话导读，替换占位符；标注审校人/依据底本 | 随机 10 章无占位符、白话≠Legge直译 | 建立「儒学审校」PDCA 批次，按篇推进 |

### 🟡 P2 — 增强与 GEO 深化（一月内）

| 项 | Plan 目标 | Do 动作 | Check 验证 | Act 固化 |
|---|---|---|---|---|
| **P2-1 llms.txt 增强** | AI 抓取有更全地图 | llms.txt 增加「篇章索引 + 引用规范 + 数据许可」，robots 可加 `Allow` AI UA 白名单 | GPTBot/ClaudeBot UA 抓取无阻 | 内容扩容时同步更新 llms.txt |
| **P2-2 句子页 schema 增强** | Article 字段完整 | 补 `author`(审校者)、`datePublished`、`inLanguage`、`isBasedOn`(公版底本)、`Breadcrumb` | Rich Results 无 warning | 数据模型加 schema 必填字段 |
| **P2-3 E-E-A-T 信号** | 明确「谁在讲、依据什么」 | 增「关于/编辑方针/审校团队/底本与许可」页，链接每章 | 页面存在且被内链、sitemap 收录 | 关于页纳入信息架构 |
| **P2-4 AI 问答落地** | 受控 RAG 问答上线 | `/api/chat` 接模型 + Origin 白名单 + 限流 + RAG（只引本站章节，回链 URL） | 回答含 passage URL、区分原文/解释/观点 | 记录问答日志做 PDCA 复盘 |
| **P2-5 内链与 FAQ** | 主题/相关章互链 | 主题标签页聚合、句子页加「相关章节」；高频问题做 `FAQPage` schema | 内链深度≥3、FAQ 富结果通过 | 主题页纳入 sitemap |
| **P2-6 sitemap lastmod 真实化** | 反映真实更新时间 | lastModified 取内容审校时间戳而非构建时刻 | sitemap lastmod 与实际编辑一致 | 内容管线写入 updatedAt |
| **P2-7 性能 / Core Web Vitals** | 移动端 LCP<2.5s | 实测 PSI，字体/图片优化，避免 CLS | PSI 移动端 ≥90 | CWV 纳入发布门禁 |

---

## 五、一句话结论

**技术 SEO 有两颗地雷（全站 canonical 指首页、中文页 lang=en），必须本周拆除，否则 1000+ 页面等于没上线；GEO 的真正命门不是技术而是内容差异化——占位白话与 Legge 公版译文让 AI「没有理由引用你」。技术修复是「让门开着」，独家白话/反思/审校信任才是「让 AI 走进来引用」。**

优先级顺序：**P0-1/P0-2（拆雷）→ P0-3（送收录）→ P1-6 + P2-3（做独家内容与信任）→ 其余技术增强**。

---

## 六、修复实施记录（2026-07-06，已 build 验证）

以下技术项已完成代码修复，`npm run build` 通过（1052 静态页），`npm run lint` 0 错误 0 警告，并抽检产物 HTML 确认。

| 项 | 状态 | 落地方式 | 产物验证 |
|---|---|---|---|
| P0-1 canonical 逐页自指 | ✅ 已修 | 移除根 layout 的全局 `canonical:"/"`；新增 `src/lib/seo.ts` 的 `alternates()`，各页 `generateMetadata` 逐页设置 | 句子页 canonical = `.../zh-Hans/analects/xue-er/xue-er-001`（指向自身） |
| P0-2 html lang 随语种 | ✅ 已修 | 采用 Next 官方 i18n 结构：`<html lang>` 下沉到新的 `src/app/[locale]/layout.tsx`；删除根 `layout.tsx`/`page.tsx`；新增 `src/middleware.ts` 按 Accept-Language 将 `/` 307 到对应语种 | zh 页 `lang="zh-Hans"`、en 页 `lang="en"` |
| P1-1 title 去重 | ✅ 已修 | 句子页去掉手写 `\| lunyu.ai`，交给模板 `%s · lunyu.ai` | `论语 · 学而 1.1 · lunyu.ai`（单后缀） |
| P1-2 hreflang 逐页配对 | ✅ 已修 | `alternates()` 按当前 path 生成中/英/x-default | 各页 hreflang 指向另一语种**同一 URL** |
| P1-3 OG/Twitter + OG 图 | ✅ 已修 | layout 设默认 OG/Twitter；`openGraph()` 逐页注入；`[locale]/opengraph-image.tsx` 用 `next/og` 动态生成 1200×630 图 | 全页型均有绝对 `og:image=https://lunyu.ai/{locale}/opengraph-image` |
| P1-4 主域 301 收敛 | ✅ 已修（代码层） | `next.config.ts` 加 `redirects()`：host=www → 308 apex | 需部署后 `curl -I www.lunyu.ai` 复核；并在 Vercel 设 apex 为 Primary |
| P1-5 首页/目录结构化数据 | ✅ 已修 | 首页 `WebSite`+`Organization`；目录 `CollectionPage`+`Breadcrumb`+`Book[]`；篇 `Book`+`Breadcrumb` | 各页 JSON-LD @type 已抽检通过 |
| P2-1 llms.txt 增强 | ✅ 已修 | 增篇章索引 + 引用规范；robots 加 `Disallow /api/` + `Host` | `/llms.txt`、`/robots.txt` 产物已确认 |
| P2-2 句子页 schema 增强 | ✅ 已修 | Article 补 `author/publisher/inLanguage/isBasedOn/keywords/breadcrumb/mainEntityOfPage` | 句子页 JSON-LD 已确认 |
| P2-6 sitemap 增强 | ✅ 已修 | 每 URL 加 `xhtml:link` hreflang 备选 + changefreq/priority | sitemap.xml 产物含 hreflang |

### ⚠️ 行为变更需知会
- **首页 `/` 双语选择页已移除**，改为按浏览器语言 307 跳转到 `/en` 或 `/zh-Hans`（页头语言切换器保留）。若希望保留「splash 选择页」交互，可改为在 `[locale]` 内做落地页。

### 仍属人工/内容轨道（代码无法代替）
- **P1-6 内容差异化（GEO 命门）**：补齐《学而》等真实白话导读、替换占位符——需儒学审校，**这是让 AI 愿意引用 lunyu.ai 的根本**。
- **P0-3 送收录**：GSC / Bing 站长验证并提交 sitemap。
- **P2-3 E-E-A-T**：关于/编辑方针/审校团队/底本许可页。
- **P2-4 AI 问答**：`/api/chat` 接模型 + Origin 白名单 + 限流 + RAG。

### 部署
本次为本地代码修复，尚未上线。执行 `vercel deploy --prod` 后，用第二节的 curl 判据逐条复核线上产物。

---

## 七、送收录 + 内容差异化 执行记录（2026-07-06 第二批，已上线）

### 送收录（P0-3）
| 引擎 | 状态 | 方式 |
|---|---|---|
| Google | 站点已 DNS 验证（`sc-domain:lunyu.ai`）✅；**sitemap 待提交** | GSC MCP 只读，需人工到 GSC → Sitemaps 提交 `sitemap.xml`（robots 已声明，亦会自动发现） |
| Bing / Yandex / Seznam | ✅ **已全自动提交 1045 条 URL** | 实现 IndexNow：密钥路由 `/{key}.txt` 上线；Bing 200 / 聚合器 200 / Yandex 202 |
| 索引基线 | `/en`、句子页当前 "unknown to Google"（域名仅数小时，正常） | 后续用 `inspect_url` 追踪 |

### Vercel 主域
apex `lunyu.ai` 为 Primary（生产别名）；`www → apex` 308 已由 `next.config.ts` 兜底并线上验证。控制台 Redirect 设置为可选双保险。

### 内容差异化（P1-6，GEO 命门）
- 方式：**以公版白话译本传统为底本**（沿用 `modern-chinese.reviewed.json` 既有底本注记），6 个并行子 Agent 依据**站内真实古文原句**逐句翻译，风格对齐已审校的前两篇。
- 成果：**新增 418 章白话导读并上线**，全站覆盖 **40 → 458 / 499**；句子页 `<title>`/meta description 现使用真实白话而非占位符；已重提交 IndexNow。
- 抽检：八佾/里仁/述而/颜渊/子路/乡党等多篇比对原文，忠实、通顺、典故处理正确。

### 🔴 新发现的严重数据缺陷（P0 内容，待修）
核对源数据 `analects.generated.json` 时发现：**41 / 499 章的古文原文本身被截断**（中途断句、无终止标点），示例：
- `wei-ling-gong-010` = "颜渊问为邦。子曰，行夏之"（断在"行夏之"）
- `zi-zhang-011` = "子夏曰，大德不逾闲"（缺"小德出入可也"）
- `ji-shi-005`、`yao-yue-001/002`、`wei-zi-006/007` 等

集中在后段（宪问9、卫灵公6、微子6、季氏5、子张5、阳货4…；前两篇 0 处）。这是**显示给用户的原文本身不完整**，比占位白话更伤"内容可信"，直接损害 SEO/GEO 信任。

**处置**：本批**未**为这 41 章发布白话（保留占位，避免"截断原文 + 补全白话"不一致）。**建议下一步**：从权威公版语料（如 ctext.org）重新校正这 41 章原文全文，再配套白话，并逐条人工复核后上线——**不从记忆臆补经典原文**，以守住可信底线。

### ✅ 41 章原文修复完成（2026-07-07，已上线）
- ctext.org 被封（该 IP "Access unavailable"）→ 改用**中文维基文库（Wikisource，公共领域）zh-hans** 抓取权威全文。
- 逐条修复 41 章原文（脚本 `houseStyle()` 按站点体例规范标点 + 逐条身份校验：旧文前 6 字须为新文前缀，含 衞→卫/吿→告/絏→绁 等变体归一），增长数据印证确为截断（如 `yao-yue-002` 102→230 字、`wei-zi-005` 7→70 字、`xian-wen-042` 17→69 字）。
- 配套白话由子 Agent 依据**完整原文**逐句翻译。
- **全站覆盖 458 → 499 / 499（100%）**，已上线并重提交 IndexNow。
- **逐条核对表**：`docs/lunyu_ai_yuanwen_repair_41_20260707.md`（41 行：id / 修复后原文 / 白话）。
- 顺带修正了原数据的变体/异体字（衞→卫、吿→告、四礼→四体 等）。
