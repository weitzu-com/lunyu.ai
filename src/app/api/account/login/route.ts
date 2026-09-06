import { AccountError, accountFailure, accountJson, createAccountClient, credentials, publicUser, readAccountBody } from "@/lib/auth/server";
import { limitAccountAttempts } from "@/lib/auth/rate-limit";
export async function POST(request: Request) {
  try {
    const { email, password } = credentials(await readAccountBody(request, 4096));
    await limitAccountAttempts(request, email, "login");
    const client = await createAccountClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      if (error?.status === 429) throw new AccountError("尝试次数较多，请稍后重试。", 429, "rate_limited");
      throw new AccountError("邮箱或密码不正确，请再试一次。", 401, "invalid_credentials");
    }
    return accountJson({ user: publicUser(data.user) });
  } catch (error) { return accountFailure(error); }
}
