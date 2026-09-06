import type { TimelineEvent } from "@/lib/biography-types";

export const certaintyLabels: Record<TimelineEvent["certainty"], string> = {
  recorded: "纪年记载",
  approximate: "约年／推定",
  disputed: "记载／年代有争议",
  undated: "年代不详",
};

export function compareEvents(a: TimelineEvent, b: TimelineEvent) {
  return (a.year ?? Number.POSITIVE_INFINITY) - (b.year ?? Number.POSITIVE_INFINITY);
}

export function biographyPath(slug?: string) {
  return `/zh-Hans/people${slug ? `/${slug}` : ""}`;
}

export function eventAnchor(index: number) {
  return `event-${index + 1}`;
}
