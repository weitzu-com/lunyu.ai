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

## 部署

- Vercel：`vercel deploy --prod`
- Cloudflare 自动化：设置 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ZONE_ID` 后运行 `npm run cf:setup`
  - 根域默认写入 `A lunyu.ai 76.76.21.21`
  - `www` 默认写入 `A www.lunyu.ai 76.76.21.21`
  - 默认 `CLOUDFLARE_PROXIED=false`，先让 Vercel 完成域名验证

## 第一阶段目标

1. 建立《论语》原文、章节、注释、白话、英译、跨语种翻译的数据模型。
2. 建立 200+ 语种翻译与 TTS 音频生产流水线。
3. 建立 AI 讲解、问答、学习路径与文化语境保护机制。
4. 建立 MVP 网站：阅读、听读、逐句解释、语种切换、搜索、AI 问答。
5. 建立质量控制：儒学专家、人类译审、自动检测、用户反馈闭环。
6. 建立生命周期闭环：SEO/GEO、安全成本、发布回滚、三 Agent 运维、PDCA 复盘。
