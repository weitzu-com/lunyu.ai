import type { GeographyPlace } from "@/lib/geography-types";
import baseMap from "@/data/geography-base-map.json";
import { GeographyAtlas, type AtlasPlace } from "./GeographyAtlas";
import "./geography-atlas.css";

const contextSlugs = new Set(["lu", "qi", "wei", "song", "zheng", "chen", "chu", "wu", "jin", "zhou", "yue"]);
const x = (longitude: number) => 62 + ((longitude - 109) / 13) * 658;
const y = (latitude: number) => 365 - ((latitude - 29) / 10) * 305;
const inFrame = (longitude: number, latitude: number) => longitude >= 109 && longitude <= 122 && latitude >= 29 && latitude <= 39;

/** Send only map summaries and projected modern waterways to the interactive atlas. */
export function GeographyMap({ places, selectedSlug }: { places: GeographyPlace[]; selectedSlug?: string }) {
  const atlasPlaces: AtlasPlace[] = places.map((place) => ({
    slug: place.slug,
    name: place.name,
    kind: place.kind,
    modernLocation: place.modernLocation,
    locationNote: place.locationNote,
    context: contextSlugs.has(place.slug),
    ...(place.coordinates ? { coordinates: place.coordinates } : {}),
    ...(place.coordinates && inFrame(place.coordinates.longitude, place.coordinates.latitude)
      ? { point: { x: x(place.coordinates.longitude), y: y(place.coordinates.latitude) } }
      : {}),
  }));
  const rivers = baseMap.rivers.map((river, index) => {
    let drawing = false;
    const path = river.coordinates.map(([longitude, latitude]) => {
      if (!inFrame(longitude, latitude)) { drawing = false; return ""; }
      const command = drawing ? "L" : "M";
      drawing = true;
      return `${command}${x(longitude).toFixed(1)},${y(latitude).toFixed(1)}`;
    }).join(" ");
    return { id: index, path };
  });
  return <GeographyAtlas key={selectedSlug ?? "directory"} places={atlasPlaces} rivers={rivers} initialSelectedSlug={selectedSlug} sourceUrl={baseMap.licenseUrl} />;
}
