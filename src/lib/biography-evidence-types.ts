import type { BiographySource, Citation } from "@/lib/biography-types";

export type HistoricalPortrait = {
  src: string;
  assetPath: string;
  width: number;
  height: number;
  title: string;
  artist: string;
  dateLabel: string;
  collection: string;
  sourceUrl: string;
  licenseLabel: string;
  licenseUrl: string;
  identityNote: string;
  catalogUrl?: string;
  credit?: string;
};

export type PortraitRecord = {
  slug: string;
  status: "verified" | "unverified";
  summary: string;
  image?: HistoricalPortrait;
};

export type RelatedWork = {
  title: string;
  attributionLabel: string;
  statusLabel: string;
  dateLabel: string;
  description: string;
  citations: Citation[];
};

export type WorksRecord = {
  slug: string;
  summary: string;
  works: RelatedWork[];
  citations: Citation[];
};

export type WorksResearch = { sources: BiographySource[]; records: WorksRecord[] };
