import { Locale, Sentence, sentenceUrl } from "@/lib/analects";

export type ReflectionAnswer = {
  sourceLabel: string;
  source: string;
  explanationLabel: string;
  explanation: string;
  inspirationLabel: string;
  inspiration: string;
  returnLabel: string;
  returnUrl: string;
  returnText: string;
};

function zhInspiration(question: string) {
  const normalized = question.trim();

  if (/行动|建议|做|实践|用/.test(normalized)) {
    return "今天只做一件小事：选一个具体关系或工作场景，把这句话变成可观察的行动。先让行为站住，再谈理解。";
  }

  if (/修正|反省|错|问题|提醒/.test(normalized)) {
    return "先把它当镜子，不当尺子：我是否只知道道理，却没有在语气、选择和日常动作里落实？";
  }

  if (/不愤不启|启发|困惑|不会|不懂/.test(normalized)) {
    return "先说清自己卡在哪里：是词义、处境，还是行动选择？卡点越具体，启发越不空泛。";
  }

  return "从第一性原理看，先分清原文讲的原则，再看自己当下最容易偏离原则的地方，最后只改一个可执行动作。";
}

function enInspiration(question: string) {
  const normalized = question.trim().toLowerCase();

  if (/action|practical|use|today|do/.test(normalized)) {
    return "Choose one concrete relationship or task today, and let this passage become visible in your conduct before explaining it.";
  }

  if (/correct|mistake|myself|reflection|remind/.test(normalized)) {
    return "Use the passage first as a mirror, not as a measuring stick for others: where do your words, choices, or habits fall short?";
  }

  if (/confused|stuck|understand|inspiration|question/.test(normalized)) {
    return "Name the exact point where you are stuck: the words, the situation, or the next action. A precise difficulty makes the reflection useful.";
  }

  return "From first principles, separate the source principle, your current situation, and one observable action you can improve today.";
}

export function buildReflectionAnswer(
  locale: Locale,
  question: string,
  sentence: Sentence
): ReflectionAnswer {
  if (locale === "zh-Hans") {
    return {
      sourceLabel: "原文",
      source: sentence.classicalChinese,
      explanationLabel: "解释",
      explanation: sentence.modernChinese,
      inspirationLabel: "现代启发",
      inspiration: zhInspiration(question),
      returnLabel: "回链",
      returnUrl: sentenceUrl(locale, sentence),
      returnText: `回到 ${sentence.bookNumber}.${String(sentence.sentenceNumber).padStart(2, "0")} 句子页`,
    };
  }

  return {
    sourceLabel: "Source",
    source: sentence.classicalChinese,
    explanationLabel: "Explanation",
    explanation: sentence.english,
    inspirationLabel: "Modern reflection",
    inspiration: enInspiration(question),
    returnLabel: "Backlink",
    returnUrl: sentenceUrl(locale, sentence),
    returnText: `Open passage ${sentence.bookNumber}.${String(sentence.sentenceNumber).padStart(2, "0")}`,
  };
}
