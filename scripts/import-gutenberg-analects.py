#!/usr/bin/env python3
import json
import re
import urllib.request
from pathlib import Path

import opencc
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
WIKISOURCE_BASE = "https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_1/Confucian_Analects"
OUT = ROOT / "src" / "data" / "analects.generated.json"

BOOKS = [
    ("xue-er", "学而", "Hsio R."),
    ("wei-zheng", "为政", "Wei Chang"),
    ("ba-yi", "八佾", "Pa Yih"),
    ("li-ren", "里仁", "Le Jin"),
    ("gong-ye-chang", "公冶长", "Kung-ye Ch'ang"),
    ("yong-ye", "雍也", "Yung Yey"),
    ("shu-er", "述而", "Shu R."),
    ("tai-bo", "泰伯", "T'ai-po"),
    ("zi-han", "子罕", "Tsze Han"),
    ("xiang-dang", "乡党", "Heang Tang"),
    ("xian-jin", "先进", "Hsien Tsin"),
    ("yan-yuan", "颜渊", "Yen Yuan"),
    ("zi-lu", "子路", "Tsze-lu"),
    ("xian-wen", "宪问", "Hsien Wan"),
    ("wei-ling-gong", "卫灵公", "Wei Ling Kung"),
    ("ji-shi", "季氏", "Ke She"),
    ("yang-huo", "阳货", "Yang Ho"),
    ("wei-zi", "微子", "Wei Tsze"),
    ("zi-zhang", "子张", "Tsze-chang"),
    ("yao-yue", "尧曰", "Yao Yueh"),
]

ROMANS = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "XIII",
    "XIV",
    "XV",
    "XVI",
    "XVII",
    "XVIII",
    "XIX",
    "XX",
]

CN_NUM = {
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "七": 7,
    "八": 8,
    "九": 9,
    "十": 10,
}

CHINESE_CHAPTER_RE = re.compile(r"[【〖](?:第)?([一二三四五六七八九十廿卅]+)章[】〗]")
ENGLISH_CHAPTER_RE = re.compile(r"^Chapter\s+[IVXLCDM]+\.?\s*(.*)", re.I)


def cn_num_to_int(text: str) -> int:
    text = text.strip().replace("廿", "二十").replace("卅", "三十")
    if text == "十":
        return 10
    if text.startswith("十"):
        return 10 + CN_NUM.get(text[1:], 0)
    if text.endswith("十"):
        return CN_NUM[text[0]] * 10
    if "十" in text:
        left, right = text.split("十", 1)
        return CN_NUM[left] * 10 + CN_NUM.get(right, 0)
    if len(text) == 2:
        return CN_NUM[text[0]] * 10 + CN_NUM[text[1]]
    return CN_NUM[text]


def clean_chinese(text: str, converter: opencc.OpenCC) -> str:
    text = re.sub(r"[【〖][^】〗]*[】〗]", "", text)
    text = text.replace("、", "，")
    text = re.sub(r"\s+", "", text).strip("，")
    return converter.convert(text)


def clean_english(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def read_url(url: str) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "lunyu.ai content importer; source verification for a public-domain Analects edition"
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def parse_book(roman: str, converter: opencc.OpenCC) -> tuple[dict[int, str], dict[int, str]]:
    html = read_url(f"{WIKISOURCE_BASE}/{roman}")
    soup = BeautifulSoup(html, "html.parser")
    content = soup.select_one(".mw-parser-output")
    if content is None:
        raise RuntimeError(f"Could not find page content for book {roman}")

    chinese: dict[int, str] = {}
    english: dict[int, str] = {}
    last_english_number: int | None = None

    for paragraph in content.find_all("p"):
        text = paragraph.get_text(" ", strip=True)
        if not text:
            continue
        if "Retrieved from" in text:
            break

        chinese_match = CHINESE_CHAPTER_RE.search(text)
        if chinese_match:
            number = cn_num_to_int(chinese_match.group(1))
            chinese[number] = clean_chinese(text, converter)
            last_english_number = None
            continue

        english_match = ENGLISH_CHAPTER_RE.match(text)
        if english_match:
            number = max(english.keys(), default=0) + 1
            english[number] = clean_english(english_match.group(1))
            last_english_number = number
            continue

        if last_english_number and not re.search(r"[\u3400-\u9fff]", text):
            english[last_english_number] = clean_english(
                f"{english[last_english_number]} {text}"
            )

    return chinese, english


def validate_book(slug: str, chinese: dict[int, str], english: dict[int, str]) -> None:
    if not chinese:
        raise RuntimeError(f"{slug}: no Chinese chapters parsed")

    expected = list(range(1, max(chinese) + 1))
    missing_chinese = [number for number in expected if number not in chinese]
    missing_english = [number for number in expected if number not in english]

    if missing_chinese:
        raise RuntimeError(f"{slug}: missing Chinese chapters {missing_chinese}")
    if missing_english:
        raise RuntimeError(f"{slug}: missing English chapters {missing_english}")


def main() -> None:
    converter = opencc.OpenCC("t2s")
    books_out = []

    for index, roman in enumerate(ROMANS):
        slug, zh_title, en_title = BOOKS[index]
        chinese, english = parse_book(roman, converter)
        validate_book(slug, chinese, english)

        chapters = []
        for chapter_number in range(1, max(chinese) + 1):
            chapters.append(
                {
                    "id": f"{slug}-{chapter_number:03d}",
                    "bookSlug": slug,
                    "bookNumber": index + 1,
                    "sentenceNumber": chapter_number,
                    "classicalChinese": chinese[chapter_number],
                    "pinyin": "",
                    "modernChinese": "白话导读待审校。当前版本先保证《论语》简体原文与 James Legge 英译逐章完整对应。",
                    "english": english[chapter_number],
                    "themes": ["analects", slug],
                    "notes": [
                        "底本：Wikisource 整理的 James Legge《The Chinese Classics》公版中英文本。",
                        "中文由繁体转为简体，后续白话解释需逐章审校。",
                    ],
                }
            )

        books_out.append(
            {
                "slug": slug,
                "number": index + 1,
                "zhTitle": zh_title,
                "enTitle": en_title,
                "chapterCount": len(chapters),
                "sentences": chapters,
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "source": WIKISOURCE_BASE,
                "sourceNote": "Wikisource transcription of James Legge's public-domain Chinese-English Analects from The Chinese Classics. Chinese converted from traditional to simplified with OpenCC.",
                "books": books_out,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps({book["slug"]: book["chapterCount"] for book in books_out}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
