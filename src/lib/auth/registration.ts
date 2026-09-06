import "server-only";

export type RegistrationStatus = { registrationAvailable: boolean; registrationMessage: string };
let cached: { expires: number; status: RegistrationStatus } | undefined;

/** Public project settings contain no users or secrets. Briefly cache only this
 * project-wide capability, never any session or request-scoped client. */
export async function registrationStatus(): Promise<RegistrationStatus> {
  if (cached && cached.expires > Date.now()) return cached.status;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  let status: RegistrationStatus;
  try {
    if (!url || !key) throw new Error("Missing configuration");
    const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key }, cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Settings unavailable");
    const settings = await response.json();
    // This release has no public SMTP or verification/recovery workflow.
    const available = settings.external?.email === true && settings.mailer_autoconfirm === true && settings.disable_signup === false;
    status = { registrationAvailable: available, registrationMessage: available ? "" : "新账号注册暂未开放，账号服务正在完成设置。你可以先以游客身份体验，旅程会保存在此设备。" };
  } catch {
    status = { registrationAvailable: false, registrationMessage: "暂时无法检查注册服务，请稍后重试。你仍可以继续游客旅程。" };
  }
  cached = { expires: Date.now() + 5000, status };
  return status;
}
