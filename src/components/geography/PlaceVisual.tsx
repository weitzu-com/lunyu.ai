import Image from "next/image";
import type { GeographyPlace } from "@/lib/geography-types";
import { getPlacePhoto, getPlaceVisual, placeMapPath } from "@/lib/geography-visuals";
import { geographyImageProcessing } from "@/data/geography-images";

export function PlaceVisual({ place, compact = false, priority = false }: { place: GeographyPlace; compact?: boolean; priority?: boolean }) {
  const visual = getPlaceVisual(place);
  const photo = getPlacePhoto(place.slug);
  return (
    <figure className={`geography-visual ${compact ? "geography-visual-compact" : "geography-visual-detail"}`}>
      <div className="geography-visual-scene" data-geography-tilt>
        <div className="geography-visual-board">
          <Image src={visual.src} alt={visual.alt} width={visual.width} height={visual.height} sizes={compact ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 50vw, 100vw"} priority={priority} className={`block w-full ${compact ? "aspect-[3/2] object-contain" : "h-auto"}`} />
          <div className="geography-visual-label" aria-hidden="true"><span>{place.name}</span><span>{photo ? "图像档案" : "地理示意"}</span></div>
        </div>
      </div>
      <figcaption className="border-t border-rule px-4 py-3 text-sm leading-7 text-ink-soft">
        {compact ? (photo ? <>{visual.caption.split("。")[0]}。<span className="block">{photo.creator} · {photo.license} · 图源见详情</span></> : `${place.name} · ${place.coordinates ? "地望参照图" : "地理关系图"}`) : <>
          <p>{visual.caption}</p>
          {!photo && <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={placeMapPath(place.slug)} target="_blank" rel="noreferrer">查看原尺寸示意图 ↗</a>}
          {photo ? <><p className="mt-2">{photo.creator} · <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={photo.sourceUrl} target="_blank" rel="noreferrer">图片出处 ↗</a> · <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license} ↗</a></p><p>{geographyImageProcessing}</p></> : <p className="mt-2">地理依据见本页文献；图形由 lunyu.ai 绘制。</p>}
        </>}
      </figcaption>
    </figure>
  );
}
