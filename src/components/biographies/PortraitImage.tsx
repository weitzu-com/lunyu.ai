"use client";

import Image from "next/image";
import { useState } from "react";
import type { HistoricalPortrait } from "@/lib/biography-evidence-types";

export function PortraitImage({ image, name }: { image: HistoricalPortrait; name: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="biography-image-fallback" role="status">
      <p className="font-cjk text-xl">图像暂未加载</p>
      <p className="mt-3 text-sm leading-7 text-ink-soft">可通过下方的馆藏与图像来源查看原图。</p>
    </div>
  ) : (
    <Image
      src={image.assetPath}
      width={image.width}
      height={image.height}
      alt={`${name}的后世画像，${image.title}；不代表经证实的本人容貌`}
      className="biography-portrait-image"
      sizes="(max-width: 639px) 280px, 320px"
      onError={() => setFailed(true)}
    />
  );
}
