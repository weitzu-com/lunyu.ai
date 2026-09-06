import { AccountError, accountFailure, accountJson, createAccountClient, credentials, publicUser, readAccountBody } from "@/lib/auth/server";
import { limitAccountAttempts } from "@/lib/auth/rate-limit";
import { registrationStatus } from "@/lib/auth/registration";
export async function POST(request: Request) {
  try {
    const { email, password, name } = credentials(await readAccountBody(request, 4096), true);
    const status = await registrationStatus();
    if (!status.registrationAvailable) throw new AccountError(status.registrationMessage, 503, "registration_unavailable");
    await limitAccountAttempts(request, email, "register");
    const client = await createAccountClient();
    const { data, error } = await client.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: `${new URL(request.url).origin}/api/account/confirm` } });
    if (error) {
      if (error.status === 429) throw new AccountError("尝试次数较多，请稍后重试。", 429, "rate_limited");
      if (error.code === "user_already_exists" || error.code === "email_exists") throw new AccountError("此邮箱已注册，请切换到登录。", 409, "already_registered");
      throw new AccountError("暂时无法注册，请检查邮箱和密码后重试。", 400, "registration_failed");
    }
    return accountJson({ user: data.session && data.user ? publicUser(data.user) : null, requiresEmailConfirmation: !data.session, message: data.session ? "账号已创建，可以保存你的旅程。" : "请查收验证邮件，验证后再登录。" }, 201);
  } catch (error) { return accountFailure(error); }
}
