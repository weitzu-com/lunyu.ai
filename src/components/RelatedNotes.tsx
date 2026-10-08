import Link from "next/link";
import { Locale, t } from "@/lib/analects";
import { EditorialPost, postTitle } from "@/lib/editorial-posts";

export function RelatedNotes({
  locale,
  posts,
}: {
  locale: Locale;
  posts: EditorialPost[];
}) {
  if (posts.length === 0) return null;
  return (
    <section
      className="mt-6 border-y border-rule bg-surface px-4 py-5 sm:px-6"
      aria-labelledby="h-related-notes"
    >
      <h2 id="h-related-notes" className="label">
        {t(locale, "相关札记", "Related notes")}
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/${locale}/blogs/${post.slug}`} className="chip">
            {postTitle(locale, post)}
          </Link>
        ))}
      </div>
    </section>
  );
}
