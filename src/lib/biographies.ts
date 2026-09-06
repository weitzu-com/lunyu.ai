import { confuciusBiography, confuciusSources } from "@/data/confucius-biography";
import { discipleBiographies, discipleSources } from "@/data/disciples-biographies";
import { compareEvents } from "@/lib/biography-utils";

export const biographyModifiedDate = "2026-09-06";
export const biographyProfiles = [confuciusBiography, ...discipleBiographies].map((profile) => ({
  ...profile,
  events: [...profile.events].sort(compareEvents),
}));
export const biographySources = [...confuciusSources, ...discipleSources];

export function getBiography(slug: string) {
  return biographyProfiles.find((profile) => profile.slug === slug);
}
