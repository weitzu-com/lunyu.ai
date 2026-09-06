import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import type { AccountUser } from "./types";

export class AccountError extends Error {
  constructor(message: string, public status = 400, public code = "invalid_request") { super(message); }
}

export function accountConfigured() {
  return Boolean((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY) &&
    (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}

export const accountCapabilities = {
  emailVerification: false,
  passwordRecovery: false,
  cloudProgress: true,
};

/** Server-only auth: tokens never enter browser JavaScript or JSON responses. */
export async function createAccountClient(timeoutMs = 12000) {
  if (!accountConfigured()) throw new AccountError("账号服务尚未配置，请先以游客身份体验。", 503, "not_configured");
  const jar = await cookies();
  return createServerClient(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY)!,
    {
      global: { fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs) }) },
      cookieOptions: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" },
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (items) => {
          for (const { name, value, options } of items) {
            jar.set(name, value, { ...options, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
          }
        },
      },
    },
  );
}

export async function expireAccountCookies() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return;
  const prefix = `sb-${new URL(url).hostname.split(".")[0]}-auth-token`;
  const jar = await cookies();
  for (const { name } of jar.getAll()) {
    if (name === prefix || name.startsWith(`${prefix}.`) || name === `${prefix}-code-verifier`) {
      jar.set(name, "", { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 0 });
    }
  }
}

export function publicUser(user: User): AccountUser {
  return {
    id: user.id,
    email: user.email || "",
    name: typeof user.user_metadata?.name === "string" ? user.user_metadata.name.slice(0, 40) : "同学",
    // Auto-confirmed email is an account identifier, not proof of email ownership.
    emailVerified: false,
  };
}

export async function requireAccount(expectedId?: string | null) {
  const client = await createAccountClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) throw new AccountError("请先登录，再同步你的旅程。", 401, "unauthenticated");
  if (expectedId && user.id !== expectedId) throw new AccountError("另一页面切换了账号，请重新读取当前账号。", 409, "account_changed");
  return { client, user };
}

export function accountJson(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "private, no-store", "Pragma": "no-cache", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" } });
}

export function accountFailure(error: unknown) {
  if (error instanceof AccountError) return accountJson({ error: error.message, code: error.code }, error.status);
  return accountJson({ error: "账号服务暂时无法连接，请稍后重试。你的本地旅程仍会保留。", code: "service_unavailable" }, 503);
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new AccountError("请求来源无效，请刷新页面后重试。", 403, "invalid_origin");
  }
}

export async function readAccountBody(request: Request, limit = 32768): Promise<Record<string, unknown>> {
  assertSameOrigin(request);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new AccountError("请使用 JSON 提交。", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new AccountError("请填写完整信息。");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new AccountError("提交内容过长。", 413); }
    chunks.push(value);
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch { throw new AccountError("提交内容无效。"); }
}

export function credentials(body: Record<string, unknown>, registering = false) {
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : "同学";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AccountError("请输入有效的邮箱地址。", 400, "invalid_email");
  if (password.length < (registering ? 8 : 1) || password.length > 128) throw new AccountError(registering ? "密码须为 8 至 128 个字符。" : "请输入正确的密码。", 400, "invalid_password");
  if (registering && (name.length < 1 || name.length > 40)) throw new AccountError("称呼须为 1 至 40 个字符。", 400, "invalid_name");
  return { email, password, name };
}
