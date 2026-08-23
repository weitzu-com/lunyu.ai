# 论语·魏子朗读音频库

《论语》全 20 篇 499 章 AI 朗读音频，魏子复刻音色（火山引擎 S_92Usafi82），逐字对照 2012 繁体注音版 PDF 校正破音字读音（说=yuè、弟=tì、省=xǐng、乘=shèng 等）。

## 命名规范（丰田 5S）

```
NN_篇名第N/                    ← 两位序号_篇名，按篇目顺序排列
├── 篇名第N_001.mp3            ← 逐章（001–NNN 对应章号）
├── 篇名第N_整篇.mp3            ← 整篇合并（逐章无缝拼接）
└── 篇名第N_整篇_带章号.mp3     ← 整篇带「第N章」播报（可选）
```

## 技术参数

- 格式：MP3，24 kHz，160 kbps；平均响度 -18.6 dB（P5–P95 差 2.1 dB）
- 总量：499 逐章 + 20 整篇，总时长约 99 分钟
- 生成日期：2026-07-08

## 再生成

```bash
cd ~/Desktop/03_工作_工具/03_网站项目/lunyu.ai
.venv/bin/python scripts/generate-all-books.py            # 全量（断点续跑，已有文件跳过）
.venv/bin/python scripts/generate-audio.py --book xue-er --start 1 --end 5   # 指定篇章
.venv/bin/python scripts/generate-audio.py --book xue-er --whole-book        # 整篇带章号
```

重新生成某章：删除对应 mp3 后跑全量脚本即可。密钥在 `.env.local`（VOLC_TTS_API_KEY）。
