import Link from "next/link";
import { geographyConnections, geographyCoverage, geographyPlaces } from "@/lib/geography";

const relationLabels = { activity: "活动记载", origin: "籍贯记载", mentioned: "文中提及", planned: "志愿／计划" };

export function PersonGeography({ personSlug }: { personSlug: string }) {
  const connections = geographyConnections.filter((connection) => connection.personSlug === personSlug);
  const coverage = geographyCoverage.find((record) => record.personSlug === personSlug);
  const places = geographyPlaces.filter((place) => connections.some((connection) => connection.placeSlug === place.slug));
  return (
    <section id="geography" className="scroll-mt-6 border-t border-rule py-10" aria-labelledby="person-geography-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="person-geography-heading" className="font-cjk text-3xl">活动与地理</h2>
        <Link href="/zh-Hans/places" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">浏览地理图志 →</Link>
      </div>
      <p className="mt-4 text-base leading-8 text-ink-soft">{places.length ? "从籍贯、出仕、行旅与谈话所涉地点继续阅读。文中提及或未成行的计划，分别标注，不等同于亲历。" : coverage?.reason ?? "现有传记缺少可定位的籍贯或活动记载，暂不为此人推定地点。"}</p>
      {places.length > 0 && <ul className="mt-6 grid gap-x-6 sm:grid-cols-2">
        {places.map((place) => {
          const records = connections.filter((connection) => connection.placeSlug === place.slug);
          const relations = [...new Set(records.map((connection) => connection.relation))];
          return <li key={place.slug} className="border-t border-rule py-4">
            <Link href={`/zh-Hans/places/${place.slug}`} className="inline-flex min-h-11 items-center gap-2 font-cjk text-xl underline decoration-rule underline-offset-4 hover:decoration-ink">{place.name}<span aria-hidden="true">↗</span></Link>
            <p className="mt-1 text-sm leading-7 text-ink-soft">{relations.map((relation) => relationLabels[relation]).join(" · ")}</p>
            <p className="mt-2 text-sm leading-7 text-ink-soft">{[...new Set(records.map((record) => record.title))].join("；")}</p>
          </li>;
        })}
      </ul>}
    </section>
  );
}
