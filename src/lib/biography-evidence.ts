import portraitResearch from "@/data/biography-portrait-research.json";
import worksResearch from "@/data/biography-works-research.json";
import type { PortraitRecord, WorksResearch } from "@/lib/biography-evidence-types";
import type { BiographySource } from "@/lib/biography-types";

export const portraitRecords = portraitResearch.records as PortraitRecord[];
export const portraitSources = portraitResearch.sources as BiographySource[];
export const worksRecords = (worksResearch as WorksResearch).records;
export const worksSources = (worksResearch as WorksResearch).sources;

export function getBiographyEvidence(slug: string) {
  const portrait = portraitRecords.find((record) => record.slug === slug);
  const writings = worksRecords.find((record) => record.slug === slug);
  if (!portrait || !writings) throw new Error(`Missing biography evidence: ${slug}`);
  return { portrait, writings };
}
