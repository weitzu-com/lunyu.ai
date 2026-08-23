// IndexNow ownership key — verifies lunyu.ai may submit URLs to Bing / Yandex / Seznam.
// Served at https://lunyu.ai/0d395b7937ed1e80d4f83035261cf2b8.txt
export const dynamic = "force-static";

export function GET() {
  return new Response("0d395b7937ed1e80d4f83035261cf2b8", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
