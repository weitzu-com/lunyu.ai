import { createAccountClient } from "@/lib/auth/server";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const redirect = new URL("/zh-Hans/game", url.origin);
  if (code) {
    try {
      const client = await createAccountClient();
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (error) redirect.searchParams.set("account", "confirmation-failed");
    } catch { redirect.searchParams.set("account", "confirmation-failed"); }
  } else redirect.searchParams.set("account", "confirmation-failed");
  return new Response(null, { status: 303, headers: { Location: redirect.toString(), "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
}
