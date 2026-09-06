import type { Citation, TimelineEvent } from "@/lib/biography-types";

export type GeographyKind = "state" | "settlement" | "landscape" | "region" | "site";
export type GeographyRelation = "activity" | "origin" | "mentioned" | "planned";

export type GeographyPlace = {
  slug: string;
  name: string;
  aliases: string[];
  kind: GeographyKind;
  summary: string;
  description: string[];
  modernLocation: string;
  /** Explains the uncertainty and what an optional point represents. */
  locationNote: string;
  coordinates?: { latitude: number; longitude: number };
  /** Historical or explanatory containment, never an inferred visit. */
  parentSlugs: string[];
  citations: Citation[];
};

export type GeographyConnection = {
  personSlug: string;
  placeSlug: string;
  relation: GeographyRelation;
  title: string;
  description: string;
  citations: Citation[];
  eventTitle?: string;
  certainty?: TimelineEvent["certainty"];
  evidence?: "explicit" | "contextual";
};

export type GeographyPersonCoverage = {
  personSlug: string;
  status: "documented" | "mentioned-only" | "unlocated";
  placeSlugs: string[];
  reason: string;
};
