import type { GeographyConnection, GeographyPlace } from "@/lib/geography-types";

export const placeKindLabels: Record<GeographyPlace["kind"], string> = {
  state: "邦国",
  settlement: "城邑",
  landscape: "山川",
  region: "地域",
  site: "具体场所",
};

export const placeRelationLabels: Record<GeographyConnection["relation"], string> = {
  activity: "活动记载",
  origin: "籍贯记载",
  mentioned: "文献提及",
  planned: "志愿／计划",
};

export const placeRelationDescriptions: Record<GeographyConnection["relation"], string> = {
  activity: "文献记述人物曾在此求学、任职、出使、居留或行经；仍需结合各条记载的年代与争议阅读。",
  origin: "文献所记的籍贯或出生地。古代国属与现代出生地点不能直接画等号。",
  mentioned: "出现在人物言论、典故或相关叙事中的地点，不据此认定人物亲自到访。",
  planned: "记有意向、设想、邀请或中止的计划，不据此认定已经发生行程。",
};

export function geographyPath(slug?: string) {
  return `/zh-Hans/places${slug ? `/${slug}` : ""}`;
}
