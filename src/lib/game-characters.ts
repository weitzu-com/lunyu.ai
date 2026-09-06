import manifest from "@/data/game-character-manifest.json";
import { biographyProfiles } from "@/lib/biographies";

export type GameCharacter = {
  slug: string;
  name: string;
  courtesyName: string;
  aliases: string[];
  group: string;
  summary: string;
  role: "teacher" | "disciple";
  originalAsset: string;
  originalSource: string;
  cartoonAsset: string;
};

export function getGameCharacters(): GameCharacter[] {
  return manifest.map((record) => {
    const profile = biographyProfiles.find((item) => item.slug === record.slug);
    if (!profile) throw new Error(`Unknown game character: ${record.slug}`);
    return {
      ...record,
      cartoonAsset: record.cartoonAsset.replace(/\.png$/, ".webp"),
      courtesyName: profile.courtesyName,
      aliases: profile.aliases,
      group: profile.role === "teacher" ? "老师" : profile.group,
      summary: profile.summary,
      role: profile.role,
    };
  });
}
