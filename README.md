# lunyu.ai

`lunyu.ai` 的使命：让世界任何角落的人，都能用自己的语言看懂《论语》，也能听懂《论语》；让《论语》在 AI 的加持下，服务幸福社会与幸福人类。

本项目优先建立“内容可信、翻译可控、音频可听、AI 受控、搜索可发现、运维可闭环”的网站全生命周期工作流，再进入代码实现。

## 当前单一真相来源

- [完整网站全生命周期工作流 v2](docs/lunyu_ai_website_workflow_20260706.md)

## 本地开发

```bash
npm install
npm run dev
```

## 来源与部署一致性

```bash
npm run qa:provenance -- --checkout-only
npm run qa:provenance
```

第一条检查 `origin`、GitHub `main` 与当前 checkout 的基线；第二条还会读取
`https://www.lunyu.ai/.well-known/provenance`，严格比对 Vercel 的仓库、生产分支、
部署 ID 和提交 SHA。退出码 `1` 表示来源或部署已过期，`2` 表示 GitHub 或生产站
不可访问，二者不会混为同一种失败。

## 部署

- Vercel：`vercel deploy --prod`
- Cloudflare 自动化：设置 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ZONE_ID` 后运行 `npm run cf:setup`
  - 根域默认写入 `A lunyu.ai 76.76.21.21`
  - `www` 默认写入 `A www.lunyu.ai 76.76.21.21`
  - 默认 `CLOUDFLARE_PROXIED=false`，先让 Vercel 完成域名验证

## Google Analytics

- GA4 媒体资源：`544292853`；网站数据流：`15209449510`（`https://www.lunyu.ai`）；公开衡量 ID：`G-7KQTRXVXF4`。
- 所有语种共用的根布局通过 `@next/third-parties/google` 加载 Google Analytics，仅在 `VERCEL_ENV=production` 时启用；开发环境和 Vercel Preview 不发送正式统计。
- 保持 GA4 数据流的增强型衡量及“基于浏览器历史记录事件的网页更改”开启，由 Google 标签自动记录首次访问和站内路由切换，避免重复发送 `page_view`。
- 发布后在浏览器 Network 检查 `gtag/js?id=G-7KQTRXVXF4` 及带有 `tid=G-7KQTRXVXF4` 的 `g/collect` 请求，并在 GA4 实时报告核验收数。CSP 的采集域名依据 [Google 官方指南](https://developers.google.com/tag-platform/security/guides/csp)配置。

## 第一阶段目标

1. 建立《论语》原文、章节、注释、白话、英译、跨语种翻译的数据模型。
2. 建立 200+ 语种翻译与 TTS 音频生产流水线。
3. 建立 AI 讲解、问答、学习路径与文化语境保护机制。
4. 建立 MVP 网站：阅读、听读、逐句解释、语种切换、搜索、AI 问答。
5. 建立质量控制：儒学专家、人类译审、自动检测、用户反馈闭环。
6. 建立生命周期闭环：SEO/GEO、安全成本、发布回滚、三 Agent 运维、PDCA 复盘。
