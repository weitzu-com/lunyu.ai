import Link from "next/link";
import { parseEditorialLinks, toEditorialHref } from "@/lib/editorial-posts";

export function EditorialParagraph({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  if (!text.includes("](")) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p className={className}>
      {parseEditorialLinks(text).map((part, index) =>
        part.type === "link" ? (
          <Link
            key={`${part.href}:${part.label}:${index}`}
            href={toEditorialHref(part.href)}
            className="underline decoration-[color-mix(in_srgb,var(--ink)_32%,transparent)] underline-offset-[0.22em] hover:text-cinnabar hover:decoration-cinnabar"
          >
            {part.label}
          </Link>
        ) : (
          part.value
        )
      )}
    </p>
  );
}
