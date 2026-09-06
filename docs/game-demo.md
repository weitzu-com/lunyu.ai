# 与孔子同行 · Demo

## 从第一性原理到玩法

理解思想需要遇到它试图解决的问题；形成判断需要选择、反馈与反思；理解一个人的一生需要看到处境随时间变化。因此循环为：进入处境 → 选择行动 → 观察得失 → 回到原典 → 写下现实中的实践。

- 八章按孔子生命阶段前进，16 个情境、48 个选项，约 25 分钟。
- 每项选择均有独立后果与哲学反思，仁／智／勇合计均为 3，不设唯一满分答案。
- 完成前章开启后章；已完成故事可以回看，不重复增加积分。
- 同行弟子页连接现有人物年表；故事和每个选择附典籍依据，并标明情境改编。
- 选择与手记仅保存于当前浏览器，无账号、无跨设备同步；可导出 Markdown 手记。
- 第一版为中文、单人互动叙事 demo；视觉是春秋意象图，不是历史地理地图。

史料、年代及改编边界见 [game-content-notes.md](game-content-notes.md)。

## 本地运行

Node 24–26，安装依赖后：

```sh
npm ci
npm run build
npm run start -- --port 3210 --hostname 127.0.0.1
```

访问 http://localhost:3210/zh-Hans/game，或 /game 跳转。
开发时可以运行 `npm run dev -- --port 3211`。

## 验收

```sh
npm run lint
node scripts/game-qa.mjs
npm run build
npm run qa:seo
npm run qa:biographies -- --built
npm run qa:coverage
```

浏览器检查：375/414/768/1024/1440 宽度无横向溢出；逐一走完 16 幕；刷新后继续；查看每项反馈来源；在章结尾输入手记并刷新核对；完成八章显示最终积累；导出手记包含选择和个人笔记；重开先确认再清除；无存储权限时仍可玩并提示无法持久保存。

## 发布

从独立干净分支提交 PR，通过 GitHub quality 和 Vercel Preview 检查后合并，自动部署至 www.lunyu.ai。验证生产 provenance SHA 与合并提交一致，并验证 /game、/zh-Hans/game、双语首页游戏入口。
