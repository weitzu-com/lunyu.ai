import { NextRequest, NextResponse } from "next/server";
import { allSentences, getSentence, Locale, locales, Sentence } from "@/lib/analects";
import { buildReflectionAnswer } from "@/lib/confucius-reflection";

export const runtime = "nodejs";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const buckets = new Map<string, { count: number; resetAt: number }>();

function configuredOrigins() {
  return (process.env.CHAT_ALLOWED_ORIGINS ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function defaultOrigins() {
  const productionOrigins = ["https://lunyu.ai", "https://www.lunyu.ai"];
  if (process.env.NODE_ENV === "production") return productionOrigins;
  return [...productionOrigins, "http://localhost:3000", "http://127.0.0.1:3000"];
}

function originAllowed(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  return new Set([...configuredOrigins(), ...defaultOrigins()]).has(origin);
}

function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin");
  return origin && originAllowed(request)
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        Vary: "Origin",
      }
    : { Vary: "Origin" };
}

function clientKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function rateLimited(request: NextRequest) {
  const now = Date.now();
  const key = clientKey(request);
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS;
}

function normalizeLocale(value: unknown): Locale {
  return value === "zh-Hans" || value === "en" ? value : "zh-Hans";
}

function tokens(input: string) {
  const latin = input.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const cjk = input.match(/[\u4e00-\u9fff]/g) ?? [];
  return [...new Set([...latin, ...cjk])].filter((token) => token.length > 0);
}

function scoreSentence(sentence: Sentence, queryTokens: string[]) {
  const haystack = `${sentence.classicalChinese} ${sentence.modernChinese} ${sentence.english} ${sentence.themes.join(" ")}`.toLowerCase();
  return queryTokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

function retrieveSentence(question: string, sentenceId: unknown) {
  if (typeof sentenceId === "string") {
    const selected = getSentence(sentenceId);
    if (selected) return selected;
  }

  const queryTokens = tokens(question);
  if (queryTokens.length === 0) return allSentences[0];

  return allSentences
    .map((sentence) => ({ sentence, score: scoreSentence(sentence, queryTokens) }))
    .sort((a, b) => b.score - a.score)[0]?.sentence ?? allSentences[0];
}

function logChatEvent(request: NextRequest, sentenceId: string, question: string) {
  if (process.env.NODE_ENV !== "production" && process.env.CHAT_LOG_EVENTS !== "true") return;
  console.info(
    JSON.stringify({
      event: "chat.static_rag",
      sentenceId,
      questionLength: question.length,
      clientKey: clientKey(request).slice(0, 48),
      mode: "token-free-rag-static",
    })
  );
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: originAllowed(request) ? 204 : 403,
    headers: corsHeaders(request),
  });
}

export async function POST(request: NextRequest) {
  const headers = corsHeaders(request);

  if (!originAllowed(request)) {
    return NextResponse.json(
      { error: "Origin is not allowed for the controlled chat endpoint." },
      { status: 403, headers }
    );
  }

  if (rateLimited(request)) {
    return NextResponse.json(
      { error: "Too many chat requests. Please wait and try again." },
      { status: 429, headers }
    );
  }

  const body = await request.json().catch(() => ({}));
  const question = typeof body.question === "string" ? body.question.trim().slice(0, 160) : "";
  const locale = normalizeLocale(body.locale);
  const sentence = retrieveSentence(question, body.sentenceId);

  if (!question) {
    return NextResponse.json(
      {
        mode: "token-free-rag-static",
        locales: Object.keys(locales),
        prompt: locale === "zh-Hans" ? "请围绕某一句《论语》提出一个具体卡点。" : "Ask a specific question about one Analects passage.",
      },
      { headers }
    );
  }

  logChatEvent(request, sentence.id, question);
  const answer = buildReflectionAnswer(locale, question, sentence);

  return NextResponse.json(
    {
      mode: "token-free-rag-static",
      controls: {
        modelApi: "disabled",
        originAllowlist: "enabled",
        rateLimit: `${MAX_REQUESTS}/minute best-effort in-memory`,
        ragKnowledgeBase: "Analects passage corpus",
      },
      sentenceId: sentence.id,
      locale,
      sourceText: answer.source,
      explanation: answer.explanation,
      modernReflection: answer.inspiration,
      returnUrl: answer.returnUrl,
      answer,
    },
    { headers }
  );
}
