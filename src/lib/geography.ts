import { geographyAdditionalSources, geographyConnections, geographyPlaces as placeRecords } from "@/data/geography";
import { biographyProfiles, biographySources } from "@/lib/biographies";
import type { GeographyPersonCoverage } from "@/lib/geography-types";

export { geographyConnections };
const kindOrder = { state: 0, settlement: 1, landscape: 2, region: 3, site: 4 };
const personCount = (slug: string) => new Set(geographyConnections.filter((record) => record.placeSlug === slug).map((record) => record.personSlug)).size;
/** Begin with states, then cities, landscapes, regions and sites; within each
 * category place the locations shared by the most people first. */
export const geographyPlaces = [...placeRecords].sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind] || personCount(b.slug) - personCount(a.slug));
export type { GeographyPlace, GeographyConnection, GeographyKind, GeographyRelation } from "@/lib/geography-types";
export const geographyModifiedDate = "2026-09-06";
export const geographySources = [...biographySources, ...geographyAdditionalSources];

export function getGeographyPlace(slug: string) {
  return geographyPlaces.find((place) => place.slug === slug);
}

export function getPlaceConnections(slug: string) {
  return geographyConnections.filter((connection) => connection.placeSlug === slug);
}

export function getPersonPlaces(personSlug: string) {
  const slugs = new Set(geographyConnections.filter((connection) => connection.personSlug === personSlug).map((connection) => connection.placeSlug));
  return geographyPlaces.filter((place) => slugs.has(place.slug));
}

/** Every current person is reviewed, including the unlocated roster entries.
 * A planned place is documented but must not be counted as a historical visit.
 */
export const geographyCoverage: GeographyPersonCoverage[] = biographyProfiles.map((person) => {
  const connections = geographyConnections.filter((connection) => connection.personSlug === person.slug);
  const placeSlugs = [...new Set(connections.map((connection) => connection.placeSlug))];
  const status = !connections.length ? "unlocated" : connections.every((connection) => connection.relation === "mentioned") ? "mentioned-only" : "documented";
  const reason = status === "unlocated"
    ? "当前人物档案与已核对的引用段落没有可可靠落实的专名地点；从学孔子不能代替个人行旅证据，姓名和画像收藏地也不作活动地。"
    : status === "mentioned-only"
      ? "地名见于人物所谈事件、他人的行程或有争议的记载，现有证据不足以把它们认定为本人到访。"
      : person.slug === "gongliang-ru"
        ? "本传名录条未载行旅；《孔子世家》另有随行至匡、蒲的明确记载，本索引据跨篇章证据补充关联。"
        : "已按籍贯、活动、意向和事件提及分别记录；有地理关联不等于每条都证明实际到访，也不等于行程已经完整复原。";
  return { personSlug: person.slug, status, placeSlugs, reason };
});
