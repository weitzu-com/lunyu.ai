import Image from "next/image";
import type { Locale } from "@/lib/analects";
import { editorialImageAlt, type EditorialImage } from "@/lib/editorial-posts";

export function EditorialFigure({
  image,
  locale,
  priority = false,
  className,
}: {
  image: EditorialImage;
  locale: Locale;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <Image
        src={image.src}
        alt={editorialImageAlt(locale, image)}
        width={image.width}
        height={image.height}
        sizes="(min-width: 1152px) 72rem, calc(100vw - 2rem)"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="h-auto w-full border border-rule bg-surface"
      />
    </figure>
  );
}
