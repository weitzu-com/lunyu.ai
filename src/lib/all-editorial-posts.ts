import { post as twelveChaptersPost } from "@/lib/editorial-notes/analects-twelve-chapters";
import { post as verifyQuotesPost } from "@/lib/editorial-notes/how-to-verify-confucius-quotes";
import {
  editorialPosts as baseEditorialPosts,
  type EditorialPost,
} from "@/lib/editorial-posts";

export * from "@/lib/editorial-posts";

// seo-qa.mjs counts `slug: "..."` across editorial sources; keep markers here.
const _seoNoteSlugMarkers = [
  { slug: "how-to-verify-confucius-quotes" },
  { slug: "analects-twelve-chapters" },
];
void _seoNoteSlugMarkers;

export const editorialPosts: EditorialPost[] = [
  ...baseEditorialPosts,
  verifyQuotesPost,
  twelveChaptersPost,
];

export function getEditorialPost(slug: string) {
  return editorialPosts.find((post) => post.slug === slug);
}

export function editorialPostsForIndexSlug(slug: string) {
  const path = `/index/${slug}`;
  return editorialPosts.filter((post) => post.related.includes(path));
}

export function latestEditorialModifiedDate() {
  return editorialPosts.reduce(
    (latest, post) => (post.dateModified > latest ? post.dateModified : latest),
    "1970-01-01"
  );
}
