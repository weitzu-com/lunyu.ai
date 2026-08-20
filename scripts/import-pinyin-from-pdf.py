#!/usr/bin/env python3
"""Import passage pinyin from the annotated Analects PDF.

The PDF uses horizontal Chinese text with pinyin above each character.  This
script extracts the pinyin by coordinates, groups the PDF text into books, then
maps the continuous per-book pinyin stream onto the existing site data.  The PDF
edition and the site data do not split every chapter identically, so alignment is
done by book text instead of by chapter number.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

import pdfplumber

try:
    from opencc import OpenCC
except ImportError as exc:  # pragma: no cover - runtime guidance
    raise SystemExit(
        "Missing dependency: opencc-python-reimplemented. "
        "Install with `python3 -m pip install opencc-python-reimplemented`."
    ) from exc


PINYIN_RE = re.compile(r"[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹḿ]+")
CJK_RE = re.compile(r"[\u3400-\u9fff\U00020000-\U0002EBEF]")
PINYIN_CHARS = set("āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹḿ")
PUNCTUATION = set("，。？！：；、。「」『』（）()《》〈〉·—,.:;!?[]【】 ")
VARIANT_NORMALIZATION = {
    "愼": "慎",
    "吿": "告",
    "擧": "举",
    "泛": "凡",
    "徧": "遍",
    "爲": "为",
    "說": "说",
    "説": "说",
}


@dataclass
class PdfEntry:
    pdf_page: int
    number_on_page: str
    text: str
    chars: list[str]
    pinyin: list[str | None]


def is_pinyin_char(text: str) -> bool:
    return bool(PINYIN_RE.fullmatch(text))


def is_main_text_char(char: dict[str, Any]) -> bool:
    text = char["text"]
    if text.startswith("(cid:") or text == "⃝":
        return False
    if not 17 <= char["size"] <= 22:
        return False
    return bool(CJK_RE.fullmatch(text) or text in PUNCTUATION)


def cluster_lines(chars: list[dict[str, Any]], tolerance: float) -> list[dict[str, Any]]:
    lines: list[dict[str, Any]] = []
    for char in sorted(chars, key=lambda c: (c["top"], c["x0"])):
        for line in lines:
            if abs(line["top"] - char["top"]) <= tolerance:
                line["chars"].append(char)
                line["top"] = (
                    line["top"] * (len(line["chars"]) - 1) + char["top"]
                ) / len(line["chars"])
                break
        else:
            lines.append({"top": char["top"], "chars": [char]})

    for line in lines:
        line["chars"].sort(key=lambda c: c["x0"])
    return sorted(lines, key=lambda line: line["top"])


def pinyin_words(chars: list[dict[str, Any]]) -> list[dict[str, Any]]:
    words: list[list[dict[str, Any]]] = []
    for line in cluster_lines(chars, tolerance=2.0):
        current: list[dict[str, Any]] = []
        last_x = None
        for char in line["chars"]:
            if last_x is not None and char["x0"] - last_x > 1.0:
                if current:
                    words.append(current)
                    current = []
            current.append(char)
            last_x = char["x1"]
        if current:
            words.append(current)

    result: list[dict[str, Any]] = []
    for word in words:
        text = "".join(char["text"] for char in word)
        if PINYIN_RE.fullmatch(text):
            result.append(
                {
                    "text": text,
                    "x0": min(char["x0"] for char in word),
                    "x1": max(char["x1"] for char in word),
                    "top": sum(char["top"] for char in word) / len(word),
                }
            )
    return result


def digits_near(chars: list[dict[str, Any]], top: float) -> str | None:
    digits = [
        char
        for char in chars
        if char["text"].isdigit()
        and char["x0"] < 90
        and abs(char["top"] - top) < 10
        and 8 <= char["size"] <= 13
    ]
    if not digits:
        return None
    return "".join(char["text"] for char in sorted(digits, key=lambda c: c["x0"]))


def extract_pdf_entries(pdf_path: Path) -> list[PdfEntry]:
    entries: list[PdfEntry] = []
    current: PdfEntry | None = None

    with pdfplumber.open(pdf_path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            page_chars = page.chars
            main_lines = cluster_lines(
                [char for char in page_chars if is_main_text_char(char)],
                tolerance=4.0,
            )
            page_pinyin_chars = [
                char
                for char in page_chars
                if 7.5 <= char["size"] <= 10.2 and is_pinyin_char(char["text"])
            ]

            for line in main_lines:
                line_chars = line["chars"]
                han_chars = [char for char in line_chars if CJK_RE.fullmatch(char["text"])]
                if not han_chars:
                    continue

                top = sum(char["top"] for char in han_chars) / len(han_chars)
                if top < 65 or top > 645:
                    continue

                row_pinyin_chars = [
                    char for char in page_pinyin_chars if top - 18 <= char["top"] <= top - 2
                ]
                if not row_pinyin_chars:
                    continue

                start_number = digits_near(page_chars, top)
                line_text = "".join(char["text"] for char in line_chars)
                line_han = [char for char in line_chars if CJK_RE.fullmatch(char["text"])]
                if (
                    not start_number
                    and len(line_han) <= 4
                    and min(char["x0"] for char in line_han) > 150
                ):
                    continue
                syllables_by_index: dict[int, list[str]] = {}
                centers = [((char["x0"] + char["x1"]) / 2, index) for index, char in enumerate(line_han)]
                for pinyin_char in sorted(row_pinyin_chars, key=lambda char: char["x0"]):
                    center_x = (pinyin_char["x0"] + pinyin_char["x1"]) / 2
                    distance, index = min(
                        (abs(center_x - han_center), index) for han_center, index in centers
                    )
                    if distance <= 18:
                        syllables_by_index.setdefault(index, []).append(pinyin_char["text"])

                assigned: list[tuple[str, str | None]] = []
                for index, char in enumerate(line_han):
                    center_x = (char["x0"] + char["x1"]) / 2
                    syllable = "".join(syllables_by_index.get(index, [])) or None
                    assigned.append((char["text"], syllable))

                if start_number:
                    if current is not None:
                        entries.append(current)
                    current = PdfEntry(
                        pdf_page=page_number,
                        number_on_page=start_number,
                        text=line_text,
                        chars=[char for char, _ in assigned],
                        pinyin=[pinyin for _, pinyin in assigned],
                    )
                elif current is not None:
                    current.text += line_text
                    current.chars.extend(char for char, _ in assigned)
                    current.pinyin.extend(pinyin for _, pinyin in assigned)

    if current is not None:
        entries.append(current)
    return entries


def normalize_char(char: str, converter: OpenCC) -> str:
    converted = converter.convert(char)
    return VARIANT_NORMALIZATION.get(converted, converted)


def normalize_text(text: str, converter: OpenCC) -> str:
    chars = [
        normalize_char(char, converter)
        for char in text
        if CJK_RE.fullmatch(char)
    ]
    return "".join(chars)


def split_pdf_books(entries: list[PdfEntry]) -> list[list[PdfEntry]]:
    starts = [index for index, entry in enumerate(entries) if entry.number_on_page == "1"]
    return [
        entries[start : starts[position + 1] if position + 1 < len(starts) else len(entries)]
        for position, start in enumerate(starts)
    ]


def build_pdf_book_stream(entries: list[PdfEntry], converter: OpenCC) -> tuple[str, list[str | None]]:
    chars: list[str] = []
    pinyin: list[str | None] = []
    for entry in entries:
        for char, syllable in zip(entry.chars, entry.pinyin):
            chars.append(normalize_char(char, converter))
            pinyin.append(syllable)
    return "".join(chars), pinyin


def align_book_pinyin(book: dict[str, Any], pdf_entries: list[PdfEntry], converter: OpenCC) -> list[str]:
    pdf_text, pdf_pinyin = build_pdf_book_stream(pdf_entries, converter)
    unique_pdf_pinyin: dict[str, str] = {}
    ambiguous_chars: set[str] = set()
    for char, syllable in zip(pdf_text, pdf_pinyin):
        if not syllable:
            continue
        existing = unique_pdf_pinyin.get(char)
        if existing is None:
            unique_pdf_pinyin[char] = syllable
        elif existing != syllable:
            ambiguous_chars.add(char)
    for char in ambiguous_chars:
        unique_pdf_pinyin.pop(char, None)

    target_sentences = [
        normalize_text(sentence["classicalChinese"], converter) for sentence in book["sentences"]
    ]
    target_text = "".join(target_sentences)

    matcher = SequenceMatcher(a=target_text, b=pdf_text, autojunk=False)
    mapped: list[str | None] = [None] * len(target_text)
    for tag, a0, a1, b0, b1 in matcher.get_opcodes():
        if tag == "equal":
            for offset in range(a1 - a0):
                mapped[a0 + offset] = pdf_pinyin[b0 + offset]
        elif tag == "replace" and (a1 - a0) == (b1 - b0):
            for offset in range(a1 - a0):
                mapped[a0 + offset] = pdf_pinyin[b0 + offset]

    for index, syllable in enumerate(mapped):
        if syllable is None:
            mapped[index] = unique_pdf_pinyin.get(target_text[index])

    cursor = 0
    result: list[str] = []
    missing: list[str] = []
    for sentence, normalized in zip(book["sentences"], target_sentences):
        syllables = mapped[cursor : cursor + len(normalized)]
        cursor += len(normalized)
        if any(syllable is None for syllable in syllables):
            missing.append(sentence["id"])
        result.append(" ".join(syllable or "?" for syllable in syllables))

    if missing:
        raise ValueError(
            f"Could not fully align {book['slug']} passages: {', '.join(missing[:8])}"
        )
    return result


def import_pinyin(pdf_path: Path, input_json: Path, output_json: Path) -> None:
    converter = OpenCC("t2s")
    data = json.loads(input_json.read_text(encoding="utf-8"))
    entries = extract_pdf_entries(pdf_path)
    pdf_books = split_pdf_books(entries)

    if len(pdf_books) != len(data["books"]):
        raise ValueError(f"Expected 20 PDF books, found {len(pdf_books)}")

    updated = 0
    for book, pdf_book_entries in zip(data["books"], pdf_books):
        pinyin_values = align_book_pinyin(book, pdf_book_entries, converter)
        for sentence, pinyin in zip(book["sentences"], pinyin_values):
            sentence["pinyin"] = pinyin
            updated += 1

    output_json.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    print(f"Updated {updated} passages with pinyin from {pdf_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--pdf",
        default="books/论语-2012-繁体横排注音版.pdf",
        type=Path,
        help="Annotated Analects PDF path.",
    )
    parser.add_argument(
        "--input",
        default="src/data/analects.generated.json",
        type=Path,
        help="Input generated Analects JSON.",
    )
    parser.add_argument(
        "--output",
        default="src/data/analects.generated.json",
        type=Path,
        help="Output JSON path.",
    )
    args = parser.parse_args()
    import_pinyin(args.pdf, args.input, args.output)


if __name__ == "__main__":
    main()
