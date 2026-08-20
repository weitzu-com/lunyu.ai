import { getAllSentences } from "@/lib/analects";
import { editorialPosts, postDek, postTitle } from "@/lib/editorial-posts";
import { localizedUrl, siteName, siteUrl } from "@/lib/site";
import { contentModifiedDate } from "@/lib/site";

type FeedItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc2822(dateString: string) {
  return new Date(`${dateString}T00:00:00.000Z`).toUTCString();
}

export function GET() {
  const sentences = getAllSentences().slice(0, 45);
  const items: FeedItem[] = [
    ...sentences.map((sentence) => ({
      title: `${sentence.bookNumber}.${sentence.sentenceNumber} · ${sentence.classicalChinese.slice(0, 24)}`,
      link: localizedUrl("en", `/analects/${sentence.bookSlug}/${sentence.id}`),
      description: sentence.english,
      pubDate: toRfc2822(contentModifiedDate),
      guid: localizedUrl("en", `/analects/${sentence.bookSlug}/${sentence.id}`),
    })),
    ...editorialPosts.map((post) => ({
      title: postTitle("en", post),
      link: localizedUrl("en", `/blogs/${post.slug}`),
      description: postDek("en", post),
      pubDate: toRfc2822(post.datePublished),
      guid: localizedUrl("en", `/blogs/${post.slug}`),
    })),
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} updates</title>
    <link>${siteUrl}/en</link>
    <description>Recent editorial posts and Analects passage updates from lunyu.ai</description>
    <language>en-US</language>
    <lastBuildDate>${toRfc2822(contentModifiedDate)}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items
      .map(
        (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`
      )
      .join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=600",
    },
  });
}
