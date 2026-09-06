export type BiographySource = {
  id: string;
  title: string;
  url: string;
  kind: "primary" | "academic" | "institutional";
  note: string;
};

export type Citation = { sourceId: string; locator: string };

export type TimelineEvent = {
  /** BCE years are negative. An unknown year is null, never zero. */
  year: number | null;
  endYear?: number;
  dateLabel: string;
  certainty: "recorded" | "approximate" | "disputed" | "undated";
  title: string;
  description: string;
  citations: Citation[];
};

export type BiographyProfile = {
  slug: string;
  name: string;
  courtesyName: string;
  aliases: string[];
  role: "teacher" | "disciple";
  group: string;
  lifespan: string;
  origin: string;
  summary: string;
  biography: string[];
  events: TimelineEvent[];
  citations: Citation[];
  featured: boolean;
};
