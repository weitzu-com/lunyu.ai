import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfuciusGame } from "@/components/game/ConfuciusGame";
import { getGameCharacters } from "@/lib/game-characters";
import { jsonLd, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "与孔子同行 · 孔子一生互动叙事游戏",
  description: "从少年志学到暮年传道，走过孔子一生的八个阶段。在16个故事情境中作出选择，与孔门弟子同行，读懂《论语》，留下你的学思手记。免费游玩，78位孔门人物3D卡通画像，注册登录后可同步旅程与手记。",
  alternates: { canonical: `${siteUrl}/zh-Hans/game` },
  openGraph: { title: "与孔子同行 · 一生八章，步履不停", description: "走进春秋，在故事与选择中体验孔子的一生。", url: `${siteUrl}/zh-Hans/game`, locale: "zh_CN", type: "website" },
};

export default async function GamePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "zh-Hans") notFound();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "VideoGame", name: "与孔子同行", description: "基于《论语》《史记》等传世文献改编的孔子一生互动叙事游戏。", url: `${siteUrl}/zh-Hans/game`, inLanguage: "zh-Hans", genre: ["Educational", "Interactive fiction"], gamePlatform: "Web browser", isAccessibleForFree: true, educationalUse: "学习孔子生平与《论语》思想" }) }} /><ConfuciusGame characters={getGameCharacters()} /></>;
}
