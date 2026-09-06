import { accountCapabilities, accountConfigured, accountFailure, accountJson, createAccountClient, publicUser } from "@/lib/auth/server";
import { registrationStatus } from "@/lib/auth/registration";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    if (!accountConfigured()) return accountJson({ configured: false, registrationAvailable: false, registrationMessage: "账号服务尚未配置，请先以游客身份体验。", user: null, capabilities: { ...accountCapabilities, cloudProgress: false } });
    const client = await createAccountClient();
    const { data: { user }, error } = await client.auth.getUser();
    if (error && error.name !== "AuthSessionMissingError" && error.status !== 401 && error.status !== 403) return accountFailure(error);
    return accountJson({ configured: true, ...await registrationStatus(), user: user ? publicUser(user) : null, capabilities: accountCapabilities });
  } catch (error) { return accountFailure(error); }
}
