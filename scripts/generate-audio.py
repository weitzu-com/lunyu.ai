#!/usr/bin/env python3
"""为《论语》生成朗读音频（火山引擎豆包语音·音频生成 HTTP）。

用法:
  python3 scripts/generate-audio.py --book xue-er --start 1 --end 5
  python3 scripts/generate-audio.py --book xue-er --whole-book

密钥: 从 .env.local / .env / 环境变量读取 VOLC_TTS_API_KEY（新版控制台 API Key）。
接口文档: https://www.volcengine.com/docs/6561/2550782
输出（丰田命名规范）:
  tts/01_论语音频_魏子男声/NN_篇名第N/篇名第N_NNN.mp3        （逐章）
  tts/01_论语音频_魏子男声/NN_篇名第N/篇名第N_整篇.mp3        （整篇合并）
  tts/01_论语音频_魏子男声/NN_篇名第N/篇名第N_整篇_带章号.mp3  （--whole-book）
"""

import argparse
import base64
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import unicodedata
import urllib.request
import urllib.error
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data" / "analects.generated.json"
# 输出根：魏子复刻音色的成品音频库（中文篇名文件夹 + slug 文件名）
OUT_BASE = ROOT / "tts" / "01_论语音频_魏子男声"

TTS_URL = "https://openspeech.bytedance.com/api/v3/tts/create"
# 声音复刻（S_ 开头音色）走 v1 接口 + volcano_icl 集群
TTS_V1_URL = "https://openspeech.bytedance.com/api/v1/tts"
ENV_NAME = "VOLC_TTS_API_KEY"
# 默认音色：用户本人的复刻音色；命令行 --speaker 可覆盖
DEFAULT_SPEAKER = "S_92Usafi82"
# 大模型预置音色的回退顺序（仅当 --speaker 传入非 S_ 音色时使用）
SPEAKERS = ["zh_male_yuanboxiaoshu_moon_bigtts", "zh_female_shuangkuaisisi_moon_bigtts"]


CJK_RE = re.compile(r"[㐀-鿿\U00020000-\U0002EBEF]")  # 含扩展区生僻字如𬶍𫐐
# 带调拼音字母 -> (基础字母, 声调数字)；ü 记作 v（火山 py 音标格式）
TONE_MARKS = {
    "ā": ("a", 1), "á": ("a", 2), "ǎ": ("a", 3), "à": ("a", 4),
    "ē": ("e", 1), "é": ("e", 2), "ě": ("e", 3), "è": ("e", 4),
    "ī": ("i", 1), "í": ("i", 2), "ǐ": ("i", 3), "ì": ("i", 4),
    "ō": ("o", 1), "ó": ("o", 2), "ǒ": ("o", 3), "ò": ("o", 4),
    "ū": ("u", 1), "ú": ("u", 2), "ǔ": ("u", 3), "ù": ("u", 4),
    "ǖ": ("v", 1), "ǘ": ("v", 2), "ǚ": ("v", 3), "ǜ": ("v", 4),
    "ü": ("v", 0),
    "ń": ("n", 2), "ň": ("n", 3), "ǹ": ("n", 4), "ḿ": ("m", 2),
}


def pinyin_to_numbered(syllable: str) -> str:
    """带调拼音 -> 数字调拼音（yuè -> yue4，轻声 -> 5，ü -> v）。"""
    tone = 5
    out = []
    for ch in unicodedata.normalize("NFC", syllable):
        if ch in TONE_MARKS:
            base, t = TONE_MARKS[ch]
            out.append(base)
            if t:
                tone = t
        else:
            out.append(ch)
    return "".join(out) + str(tone)


def default_readings(text: str) -> tuple[list[str], list[str]] | None:
    """用 pypinyin 计算两组默认读音：词库音（短语感知+变调）与单字常用音。
    TTS 引擎的词库与 pypinyin 不同，PDF 注音与任一基准不符即需标注。"""
    try:
        from pypinyin import Style, lazy_pinyin
    except ImportError:
        return None
    phrase = lazy_pinyin(
        text,
        style=Style.TONE3,
        neutral_tone_with_five=True,
        tone_sandhi=True,
        errors=lambda chars: list(chars),
    )
    single = [
        lazy_pinyin(ch, style=Style.TONE3, neutral_tone_with_five=True)[0]
        if CJK_RE.match(ch)
        else ch
        for ch in text
    ]
    return phrase, single


def build_ssml(text: str, pinyin: str) -> tuple[str | None, list[str]]:
    """按注音版校正读音生成 SSML：只标注 PDF 注音与默认读音不同的字（引擎对
    phoneme 数量有上限，整句全标会 500）。返回 (ssml, 差异字列表)；
    拼音与汉字数不对齐时返回 (None, [])，回退纯文本。"""
    syllables = pinyin.split()
    defaults = default_readings(text)
    if defaults is not None and len(defaults[0]) != len(text):
        defaults = None
    parts: list[str] = []
    diffs: list[str] = []
    i = 0
    for pos, ch in enumerate(text):
        if CJK_RE.match(ch):
            if i >= len(syllables):
                return None, []
            ph = pinyin_to_numbered(syllables[i])
            if defaults is None:
                need = True
                note = ""
            else:
                phrase, single = defaults[0][pos], defaults[1][pos]
                need = ph != phrase or ph != single
                note = f"(词{phrase}/单{single})"
            if need:
                parts.append(f'<phoneme alphabet="py" ph="{ph}">{ch}</phoneme>')
                diffs.append(f"{ch}:{ph}{note}")
            else:
                parts.append(ch)
            i += 1
        else:
            parts.append(ch)
    if i != len(syllables):
        return None, []
    if not diffs:
        return None, []  # 无差异字，纯文本即可
    return "<speak>" + "".join(parts) + "</speak>", diffs


# 实测引擎对 SSML 总长约 1000+ 字符会 500（与标签数无关），留安全边际
MAX_SSML_LEN = 900


def split_segments(text: str, pinyin: str, puncts: str = "。？！；") -> list[tuple[str, str]]:
    """按指定标点把 (文本, 拼音) 切成对齐的小段。"""
    syllables = pinyin.split()
    segments: list[tuple[str, str]] = []
    buf: list[str] = []
    start = 0
    count = 0
    for ch in text:
        buf.append(ch)
        if CJK_RE.match(ch):
            count += 1
        if ch in puncts:
            segments.append(("".join(buf), " ".join(syllables[start : start + count])))
            start += count
            count = 0
            buf = []
    if buf:
        segments.append(("".join(buf), " ".join(syllables[start : start + count])))
    return segments


def build_ssml_chunks(text: str, pinyin: str) -> tuple[list[tuple[str, str | None]], list[str]]:
    """生成待合成块列表 [(文本, ssml或None)]。超长句按句末标点分块，每块 SSML ≤ MAX_SSML_LEN。"""
    ssml, diffs = build_ssml(text, pinyin)
    if ssml is None or len(ssml) <= MAX_SSML_LEN:
        return [(text, ssml)], diffs
    chunks: list[tuple[str, str | None]] = []
    cur_t, cur_p = "", ""

    def emit(t: str, p: str) -> None:
        s, _ = build_ssml(t, p)
        if s is not None and len(s) > MAX_SSML_LEN:
            raise SystemExit(f"单段 SSML 仍超长（{len(s)}），无更细标点可分: {t[:30]}…")
        chunks.append((t, s))

    def flush() -> None:
        nonlocal cur_t, cur_p
        if not cur_t:
            return
        s, _ = build_ssml(cur_t, cur_p)
        if s is None or len(s) <= MAX_SSML_LEN:
            chunks.append((cur_t, s))
        else:
            # 整句仍超长：按逗号/顿号/冒号再细分并贪心打包
            sub_t, sub_p = "", ""
            for t2, p2 in split_segments(cur_t, cur_p, "，、：。？！；"):
                cand_t, cand_p = sub_t + t2, (sub_p + " " + p2).strip()
                s2, _ = build_ssml(cand_t, cand_p)
                if s2 is not None and len(s2) > MAX_SSML_LEN and sub_t:
                    emit(sub_t, sub_p)
                    sub_t, sub_p = t2, p2
                else:
                    sub_t, sub_p = cand_t, cand_p
            if sub_t:
                emit(sub_t, sub_p)
        cur_t, cur_p = "", ""

    for t, p in split_segments(text, pinyin):
        cand_t, cand_p = cur_t + t, (cur_p + " " + p).strip()
        s, _ = build_ssml(cand_t, cand_p)
        if s is not None and len(s) > MAX_SSML_LEN and cur_t:
            flush()
            cur_t, cur_p = t, p
        else:
            cur_t, cur_p = cand_t, cand_p
    flush()
    return chunks, diffs


def book_dir_name(book: dict) -> str:
    """篇文件夹名，如「学而第一」。"""
    return f"{book['zhTitle']}第{num_to_cn(book['number'])}"


def book_out_dir(book: dict) -> Path:
    """篇文件夹：丰田 NN_主题 规范，如「01_学而第一」。"""
    return OUT_BASE / f"{book['number']:02d}_{book_dir_name(book)}"


def chapter_path(book: dict, n: int) -> Path:
    """逐章文件：主体_内容 规范，如「学而第一_001.mp3」。"""
    return book_out_dir(book) / f"{book_dir_name(book)}_{n:03d}.mp3"


def merged_path(book: dict, suffix: str = "") -> Path:
    """整篇合并版路径，如 01_学而第一/学而第一_整篇.mp3。"""
    return book_out_dir(book) / f"{book_dir_name(book)}_整篇{suffix}.mp3"


CN_DIGITS = "零一二三四五六七八九"


def num_to_cn(n: int) -> str:
    if n <= 10:
        return "十" if n == 10 else CN_DIGITS[n]
    if n < 20:
        return "十" + CN_DIGITS[n % 10]
    tens, ones = divmod(n, 10)
    return CN_DIGITS[tens] + "十" + (CN_DIGITS[ones] if ones else "")


def title_pinyin(text: str) -> str:
    """播报文本（章号/篇名）的带调拼音，仅含汉字音节。"""
    try:
        from pypinyin import Style, lazy_pinyin
    except ImportError:
        return ""
    return " ".join(lazy_pinyin(text, style=Style.TONE, errors=lambda chars: []))


def announced(sentence: dict) -> tuple[str, str]:
    """给章节文本加「第N章。」播报前缀，并补齐对应拼音。"""
    prefix = f"第{num_to_cn(sentence['sentenceNumber'])}章。"
    prefix_py = title_pinyin(prefix)
    if not prefix_py:
        return sentence["classicalChinese"], sentence.get("pinyin", "")
    text = prefix + sentence["classicalChinese"]
    pinyin = (prefix_py + " " + sentence.get("pinyin", "")).strip()
    return text, pinyin


def load_credential() -> str:
    val = os.environ.get(ENV_NAME, "").strip()
    if val:
        return val
    for name in (".env.local", ".env"):
        p = ROOT / name
        if p.exists():
            for line in p.read_text().splitlines():
                line = line.strip()
                if line.startswith(ENV_NAME + "="):
                    val = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if val:
                        return val
    sys.exit(f"未找到 {ENV_NAME}。请通过环境变量或 .env.local 提供新版控制台 API Key。")


def tts_request(credential: str, speaker: str, text: str) -> bytes:
    """调用新版音频生成 HTTP 接口，返回 mp3 字节。"""
    payload = {
        "model": "seed-audio-1.0",
        "text_prompt": text,
        "reference": {"speaker": speaker},
        "audio_config": {
            "format": "mp3",
            "sample_rate": 24000,
            "speech_rate": -8,
            "loudness_rate": 0,
            "pitch_rate": 0,
        },
    }
    req = urllib.request.Request(
        TTS_URL,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "X-Api-Key": credential,
            "X-Api-Request-Id": str(uuid.uuid4()),
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        msg = json.loads(resp.read().decode("utf-8"))
    code = msg.get("code", 0)
    if code not in (0, 20000000):
        raise RuntimeError(f"TTS 返回错误 code={code} message={msg.get('message')}")
    if msg.get("audio"):
        return base64.b64decode(msg["audio"])
    if msg.get("url"):
        with urllib.request.urlopen(msg["url"], timeout=120) as audio_resp:
            return audio_resp.read()
    raise RuntimeError(f"TTS 返回成功但未包含 audio/url: {sorted(msg.keys())}")


def tts_request_v1(
    credential: str, voice_type: str, text: str, speed_ratio: float, text_type: str = "plain"
) -> bytes:
    """声音复刻 v1 接口（volcano_icl 集群），一次性返回完整 mp3 字节。"""
    payload = {
        "app": {"cluster": "volcano_icl"},
        "user": {"uid": "lunyu-ai"},
        "audio": {
            "voice_type": voice_type,
            "encoding": "mp3",
            "speed_ratio": speed_ratio,
        },
        "request": {
            "reqid": str(uuid.uuid4()),
            "text": text,
            "text_type": text_type,
            "operation": "query",
        },
    }
    req = urllib.request.Request(
        TTS_V1_URL,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-api-key": credential,
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        msg = json.loads(resp.read().decode("utf-8"))
    if msg.get("code") != 3000:  # v1 接口 3000 = 成功
        raise RuntimeError(f"TTS v1 返回错误 code={msg.get('code')} message={msg.get('message')}")
    if not msg.get("data"):
        raise RuntimeError("TTS v1 返回成功但 data 为空")
    return base64.b64decode(msg["data"])


def synthesize(
    credential: str,
    text: str,
    label: str,
    speaker: str = DEFAULT_SPEAKER,
    speed_ratio: float = 1.0,
    ssml: str | None = None,
) -> tuple[bytes, str]:
    """合成一段音频。S_ 开头的复刻音色走 v1 接口且不回退；预置音色带回退。
    ssml 非空时（仅复刻音色支持）按逐字注音合成。返回 (音频, 实际speaker)。"""
    if speaker.startswith("S_"):
        try:
            if ssml:
                return tts_request_v1(credential, speaker, ssml, speed_ratio, "ssml"), speaker
            return tts_request_v1(credential, speaker, text, speed_ratio), speaker
        except (RuntimeError, urllib.error.HTTPError, urllib.error.URLError) as e:
            detail = e
            if isinstance(e, urllib.error.HTTPError):
                try:
                    detail = f"HTTP {e.code}: {e.read().decode('utf-8', 'ignore')[:300]}"
                except Exception:
                    detail = f"HTTP {e.code}"
            raise SystemExit(f"[{label}] 复刻音色 {speaker} 合成失败: {detail}")
    last_err = None
    for spk in SPEAKERS:
        try:
            audio = tts_request(credential, spk, text)
            return audio, spk
        except (RuntimeError, urllib.error.HTTPError, urllib.error.URLError) as e:
            detail = e
            if isinstance(e, urllib.error.HTTPError):
                try:
                    detail = f"HTTP {e.code}: {e.read().decode('utf-8', 'ignore')[:300]}"
                except Exception:
                    detail = f"HTTP {e.code}"
            print(f"  [{label}] speaker={spk} 失败: {detail}", flush=True)
            last_err = e
    raise SystemExit(f"[{label}] 所有音色均失败，最后错误: {last_err}")


def synth_to_file(
    credential: str,
    text: str,
    pinyin: str,
    out: Path,
    label: str,
    speaker: str,
    speed_ratio: float,
) -> tuple[int, list[str], int]:
    """合成一条音频到文件。SSML 超长自动按句切块合成再拼接。
    返回 (文件字节数, 校正字列表, 块数)。"""
    chunks, diffs = build_ssml_chunks(text, pinyin) if pinyin else ([(text, None)], [])
    if len(chunks) == 1:
        audio, _ = synthesize(credential, chunks[0][0], label, speaker, speed_ratio, chunks[0][1])
        out.write_bytes(audio)
    else:
        tmp_parts: list[Path] = []
        try:
            for j, (t, sml) in enumerate(chunks, 1):
                audio, _ = synthesize(credential, t, f"{label}.{j}", speaker, speed_ratio, sml)
                p = out.with_name(f"{out.stem}.part{j}.mp3")
                p.write_bytes(audio)
                tmp_parts.append(p)
                time.sleep(0.3)
            concat_mp3(tmp_parts, out)
        finally:
            for p in tmp_parts:
                p.unlink(missing_ok=True)
    return out.stat().st_size, diffs, len(chunks)


def concat_mp3(parts: list[Path], out: Path) -> None:
    if not shutil.which("ffmpeg"):
        raise SystemExit("未找到 ffmpeg，无法合并 mp3 分段。")
    out.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".txt", delete=False) as fp:
        list_file = Path(fp.name)
        for part in parts:
            fp.write(f"file '{part.resolve().as_posix()}'\n")
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(list_file),
                "-c",
                "copy",
                str(out),
            ],
            check=True,
        )
    finally:
        list_file.unlink(missing_ok=True)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--book", default="xue-er", help="篇 slug，如 xue-er")
    ap.add_argument("--start", type=int, default=1, help="起始章号（含）")
    ap.add_argument("--end", type=int, default=5, help="结束章号（含）")
    ap.add_argument("--whole-book", action="store_true", help="生成整篇，并合并为单个 mp3")
    ap.add_argument("--suffix", default="", help="整篇输出文件名后缀，如 -unified")
    ap.add_argument("--speaker", default=DEFAULT_SPEAKER, help="音色：S_ 开头为复刻音色（v1），否则为预置大模型音色")
    ap.add_argument("--speed-ratio", type=float, default=1.0, help="语速倍率（仅复刻音色生效），如 0.9 略慢")
    args = ap.parse_args()

    credential = load_credential()
    data = json.loads(DATA.read_text())
    book = next((b for b in data["books"] if b["slug"] == args.book), None)
    if not book:
        sys.exit(f"未找到篇: {args.book}")

    out_dir = book_out_dir(book)
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.whole_book:
        part_dir = out_dir / "_parts"
        part_dir.mkdir(parents=True, exist_ok=True)
        parts: list[Path] = []
        print(f"《论语·{book['zhTitle']}》整篇（带章号播报），共 {len(book['sentences'])} 章", flush=True)
        for s in book["sentences"]:
            n = s["sentenceNumber"]
            out = part_dir / f"{book_dir_name(book)}_{n:03d}.mp3"
            text, pinyin = announced(s)
            if n == 1:
                title = f"论语，{book['zhTitle']}第{num_to_cn(book['number'])}。"
                title_py = title_pinyin(title)
                text = title + text
                pinyin = (title_py + " " + pinyin).strip()
            size, diffs, n_chunks = synth_to_file(
                credential, text, pinyin, out, f"{args.book}-{n:03d}", args.speaker, args.speed_ratio
            )
            parts.append(out)
            tag = f"校正{len(diffs)}字" + (f", {n_chunks}块" if n_chunks > 1 else "")
            print(f"[{n:02d}] -> {out.relative_to(ROOT)} ({size/1024:.1f} KB, {tag})", flush=True)
            time.sleep(0.5)
        whole = merged_path(book, args.suffix or "_带章号")
        concat_mp3(parts, whole)
        print(f"完成: {whole.relative_to(ROOT)}", flush=True)
        return

    sentences = [
        s for s in book["sentences"] if args.start <= s["sentenceNumber"] <= args.end
    ]
    print(f"《论语·{book['zhTitle']}》第 {args.start}-{args.end} 章，共 {len(sentences)} 条", flush=True)

    ok = 0
    for s in sentences:
        n = s["sentenceNumber"]
        out = chapter_path(book, n)
        text = s["classicalChinese"]
        size, diffs, n_chunks = synth_to_file(
            credential, text, s.get("pinyin", ""), out, f"{args.book}-{n:03d}",
            args.speaker, args.speed_ratio,
        )
        tag = f"校正{len(diffs)}字: {' '.join(diffs)}" if diffs else "纯文本"
        if n_chunks > 1:
            tag += f"（{n_chunks}块合成）"
        print(f"[{n:02d}] {text[:24]}… ({len(text)} 字, {tag})", flush=True)
        print(f"  -> {out.relative_to(ROOT)} ({size/1024:.1f} KB)", flush=True)
        ok += 1
        time.sleep(0.5)  # 轻微限速，避免触发 QPS 限制

    print(f"完成: {ok}/{len(sentences)}", flush=True)


if __name__ == "__main__":
    main()
