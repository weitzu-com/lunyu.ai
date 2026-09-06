import "server-only";
import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { AccountError } from "./server";

/** Persisted limits work across Vercel instances; only salted hashes are stored. */
export async function limitAccountAttempts(request: Request, email: string, action: "login" | "register") {
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!secret || !url) throw new AccountError("账号服务尚未配置完成，请稍后再试。", 503, "not_configured");
  const address = process.env.VERCEL ? (request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim() : "local";
  const digest = (value: string) => createHmac("sha256", secret).update(`${action}:${value}`).digest("hex");
  const client = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(12000) }) } });
  const { data, error } = await client.rpc("check_account_rate_limit", {
    bucket_keys: [digest(`ip:${address}`), digest(`email:${email}`)],
    attempt_limit: action === "register" ? 10 : 30,
    window_seconds: action === "register" ? 3600 : 900,
  });
  if (error) throw new AccountError("账号服务暂时无法连接，请稍后重试。", 503, "service_unavailable");
  if (!data) throw new AccountError("尝试次数较多，请稍后再试。", 429, "rate_limited");
}
