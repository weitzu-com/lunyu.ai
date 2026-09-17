import type { EditorialImage, EditorialPost } from "@/lib/editorial-posts";

const NOTES_COVER_SIZE = { width: 1600, height: 900 };
const NOTES_INLINE_SIZE = { width: 1200, height: 900 };

function notesBlogImage(
  slug: string,
  file: "cover.jpg" | "inline-1.jpg" | "inline-2.jpg",
  altEn: string,
  altZh: string,
  size: { width: number; height: number }
): EditorialImage {
  return {
    src: `/images/blogs/${slug}/${file}`,
    altEn,
    altZh,
    width: size.width,
    height: size.height,
  };
}

export function notesCoverAndInlines(
  slug: string,
  cover: { altEn: string; altZh: string },
  inline1: { altEn: string; altZh: string },
  inline2: { altEn: string; altZh: string }
): Pick<EditorialPost, "cover" | "inlineImages"> {
  return {
    cover: notesBlogImage(slug, "cover.jpg", cover.altEn, cover.altZh, NOTES_COVER_SIZE),
    inlineImages: {
      "inline-1": notesBlogImage(slug, "inline-1.jpg", inline1.altEn, inline1.altZh, NOTES_INLINE_SIZE),
      "inline-2": notesBlogImage(slug, "inline-2.jpg", inline2.altEn, inline2.altZh, NOTES_INLINE_SIZE),
    },
  };
}
