"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { HistoricalPortrait } from "@/lib/biography-evidence-types";

export function PortraitImage({ image, name, children }: { image: HistoricalPortrait; name: string; children?: ReactNode }) {
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const [zoomFailed, setZoomFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <>
      <a
        className="people-portrait-zoom"
        href={image.assetPath}
        target="_blank"
        rel="noreferrer"
        aria-label={`放大${name}的后世画像并查看来源`}
        aria-haspopup="dialog"
        onClick={(event) => {
          if (!dialog.current?.showModal) return;
          event.preventDefault();
          setOpen(true);
          dialog.current.showModal();
        }}
      >
        {failed ? <span className="biography-image-fallback">画像暂未加载<span>点此查看原图</span></span> : (
          <Image src={image.assetPath} width={image.width} height={image.height} alt={`${name}的后世画像；不代表经证实的本人容貌`} className="biography-portrait-image" sizes="(min-width: 1024px) 256px, (min-width: 640px) 160px, 112px" loading="eager" onError={() => setFailed(true)} />
        )}
        <span className="people-portrait-zoom-label" aria-hidden="true">放大画像 ↗</span>
      </a>
      <dialog ref={dialog} className="people-portrait-dialog" aria-labelledby={titleId} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="people-portrait-dialog-content">
          <div className="people-portrait-dialog-bar"><h2 id={titleId}>{name} · 后世画像</h2><button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="关闭画像，返回人物页">关闭 <span aria-hidden="true">×</span></button></div>
          <div className="people-portrait-dialog-body">
            {open && (zoomFailed ? <p className="biography-image-fallback">大图暂未加载，可使用下方图像来源查看。</p> : <Image src={image.assetPath} width={image.width} height={image.height} alt={`${image.title}，后世绘制，非生前写真`} sizes="(max-width: 639px) 90vw, 560px" className="people-portrait-full-image" onError={() => setZoomFailed(true)} />)}
            <div className="people-portrait-dialog-notes">{children}</div>
          </div>
        </div>
      </dialog>
      <noscript><div className="people-portrait-dialog-notes">{children}</div></noscript>
    </>
  );
}
