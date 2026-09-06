import { geographyImages, geographyImageByPlaceSlug } from "@/data/geography-images";
import type { GeographyPlace } from "@/lib/geography-types";

export function getPlacePhoto(placeSlug: string) {
  const key = geographyImageByPlaceSlug[placeSlug];
  return key ? geographyImages[key] : undefined;
}

export function placeMapPath(slug: string) {
  return `/geography/maps/${slug}.svg`;
}

export function getPlaceVisual(place: GeographyPlace) {
  const photo = getPlacePhoto(place.slug);
  return photo ?? {
    src: placeMapPath(place.slug),
    alt: `${place.name}${place.coordinates ? "地望参照图" : "地理关系示意图"}`,
    caption: place.coordinates ? "本站绘制的现代地望参照图；点位不是古代疆界。" : "本站绘制的地理关系图；此条不采用单点坐标，具体地望与范围见正文。",
    width: 960,
    height: 640,
  };
}
