import { AccountError, accountFailure, accountJson, assertSameOrigin, createAccountClient, expireAccountCookies } from "@/lib/auth/server";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const client = await createAccountClient(5000);
    const expectedId = request.headers.get("x-lunyu-account-id");
    let user;
    try { user = (await client.auth.getUser()).data.user; } catch { /* Still clear the local cookies when the provider is unreachable. */ }
    if (expectedId && user && expectedId !== user.id) throw new AccountError("另一页面切换了账号，请刷新后再退出。", 409, "account_changed");
    // Even if Supabase is temporarily unavailable, invalidate this browser's
    // HttpOnly cookies. Never strand someone on a signed-in shared device.
    try { await client.auth.signOut({ scope: "local" }); } catch { /* Local invalidation still follows. */ }
    await expireAccountCookies();
    return accountJson({ ok: true });
  } catch (error) { return accountFailure(error); }
}
