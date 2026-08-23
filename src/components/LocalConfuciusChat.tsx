"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Locale, Sentence, t } from "@/lib/analects";
import { buildReflectionAnswer, ReflectionAnswer } from "@/lib/confucius-reflection";

type Message = {
  role: "user" | "assistant";
  text?: string;
  answer?: ReflectionAnswer;
};

const zhPrompts = [
  "这句话今天怎么用？",
  "它在提醒我修正什么？",
  "给我一个行动建议。",
];

const enPrompts = [
  "How can I use this today?",
  "What should I correct in myself?",
  "Give me one practical action.",
];

export function LocalConfuciusChat({
  locale,
  sentence,
}: {
  locale: Locale;
  sentence: Sentence;
}) {
  const prompts = locale === "zh-Hans" ? zhPrompts : enPrompts;
  const initial = useMemo<Message>(
    () => ({
      role: "assistant",
      text: t(
        locale,
        "这里是免 token 的本地启发框。它不调用模型、不上传问题，只依据本章原文、白话导读和固定规则给出启发。",
        "This is a token-free local reflection box. It calls no model, uploads no question, and only uses this passage, its guide, and fixed rules."
      ),
    }),
    [locale]
  );
  const [messages, setMessages] = useState<Message[]>([initial]);
  const [input, setInput] = useState("");

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    const answer = buildReflectionAnswer(locale, trimmed, sentence);
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", answer },
    ]);
    setInput("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <section className="mt-6 border-y border-cinnabar bg-surface px-4 py-5 sm:px-6" aria-labelledby="h-local-chat">
      <div className="flex items-start gap-3">
        <span className="reading-dot mt-2" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 id="h-local-chat" className="font-serif text-2xl leading-snug text-ink">
            {t(locale, "问于孔子：本地启发", "Ask Confucius: local reflection")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-base">
            {t(
              locale,
              "不愤不启：先问清卡点，再给启发。当前为本地规则模式，不调用模型、不上传问题，回答严格区分原文、解释与现代启发。",
              "No model API is called. This local rule mode uploads nothing and keeps source, explanation, and reflection separate."
            )}
          </p>
          <div className="mt-4 grid gap-2 border-y border-rule py-4 font-ui text-xs leading-6 text-ink-soft sm:grid-cols-3">
            <div>{t(locale, "本地规则回答", "Local rule response")}</div>
            <div>{t(locale, "固定句子知识库", "Fixed passage context")}</div>
            <div>{t(locale, "模型问答上线前保持人工边界", "Human boundaries before model-backed chat")}</div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => ask(prompt)}
                className="chip"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="mt-5 max-h-96 space-y-3 overflow-auto border-y border-rule py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={message.role === "user" ? "text-right" : "text-left"}
              >
                {message.answer ? (
                  <div className="inline-block w-full max-w-full border border-rule bg-surface-sunken p-4 text-left">
                    {[
                      [message.answer.sourceLabel, message.answer.source],
                      [message.answer.explanationLabel, message.answer.explanation],
                      [message.answer.inspirationLabel, message.answer.inspiration],
                    ].map(([label, value]) => (
                      <section key={label} className="border-b border-rule py-3 first:pt-0 last:border-b-0">
                        <h3 className="label">{label}</h3>
                        <p className="mt-2 text-sm leading-7 text-ink">{value}</p>
                      </section>
                    ))}
                    <Link
                      href={message.answer.returnUrl}
                      className="ui-button mt-3 text-xs"
                    >
                      {message.answer.returnText}
                    </Link>
                  </div>
                ) : (
                  <div
                    className={`inline-block max-w-full whitespace-pre-line border px-4 py-3 text-left text-sm leading-7 ${
                    message.role === "user"
                      ? "border-ink bg-paper text-ink"
                      : "border-rule bg-surface-sunken text-ink"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label htmlFor={`local-chat-${sentence.id}`} className="sr-only">
              {t(locale, "输入你的问题", "Enter your question")}
            </label>
            <input
              id={`local-chat-${sentence.id}`}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={160}
              placeholder={t(locale, "围绕这一句提问...", "Ask about this passage...")}
              className="min-h-11 min-w-0 flex-1 border border-rule bg-paper px-3 py-2 font-ui text-sm text-ink outline-none transition-colors duration-300 focus:border-ink"
            />
            <button
              type="submit"
              className="ui-button border-ink bg-ink text-paper hover:bg-ink"
            >
              {t(locale, "启发", "Reflect")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
