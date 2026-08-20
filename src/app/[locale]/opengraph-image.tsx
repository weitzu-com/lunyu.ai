import { ImageResponse } from "next/og";
import { Locale, locales, t } from "@/lib/analects";
import { siteName } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh-Hans";
  const title = t(
    locale,
    "《论语》二十篇 · 499 章逐句可读",
    "The Analects · 499 passages, passage by passage"
  );
  const subtitle = t(
    locale,
    "简体原文 · 审校白话 · James Legge 公版英译 · 句子级索引",
    "Simplified Chinese source · reviewed guide · Legge translation · passage index"
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #faf8f3 0%, #f3ede2 45%, #fffdf9 100%)",
          color: "#1c1a17",
          padding: "56px 64px",
          fontFamily: isZh
            ? '"Noto Serif SC", "Source Han Serif SC", serif'
            : '"Source Serif 4", "Georgia", serif',
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 22,
                background: "#b44b3c",
                color: "#faf8f3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 54,
                fontWeight: 700,
                boxShadow: "0 12px 34px rgba(180, 75, 60, 0.22)",
              }}
            >
              论
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.01em" }}>{siteName}</div>
              <div style={{ fontSize: 18, color: "#6b6660", marginTop: 6 }}>
                {t(locale, "敬天爱人 · 止于至善", "Respect Heaven, love people, seek the good")}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 18,
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(28, 26, 23, 0.12)",
              color: "#6b6660",
            }}
          >
            {locales[locale].label}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 920 }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "#4f4a44" }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 20, color: "#6b6660", lineHeight: 1.4 }}>
            {t(
              locale,
              "原文、导读、译文和反思分层呈现，方便核验与引用。",
              "Source text, guide, translation, and reflection are separated for verification and citation."
            )}
          </div>
          <div style={{ fontSize: 16, color: "#9a938a" }}>lunyu.ai</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

