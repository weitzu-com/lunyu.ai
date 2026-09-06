import { AccountError, accountFailure, accountJson, readAccountBody, requireAccount } from "@/lib/auth/server";
import { parseGameProgress } from "@/lib/game-progress";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const { client, user } = await requireAccount(request.headers.get("x-lunyu-account-id"));
    const { data, error } = await client.from("game_progress").select("progress,revision,updated_at").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    return accountJson({ save: data ? { progress: data.progress, revision: data.revision, updatedAt: data.updated_at } : null });
  } catch (error) { return accountFailure(error); }
}
export async function PUT(request: Request) {
  try {
    const body = await readAccountBody(request);
    const { client } = await requireAccount(request.headers.get("x-lunyu-account-id"));
    const raw = body.progress;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new AccountError("旅程存档格式无效。");
    const input = raw as Record<string, unknown>;
    const progress = parseGameProgress(JSON.stringify(input));
    if (input.version !== 1 || input.lastChapter !== progress.lastChapter ||
      !input.answers || typeof input.answers !== "object" || Array.isArray(input.answers) ||
      !input.reflections || typeof input.reflections !== "object" || Array.isArray(input.reflections) ||
      Object.entries(input.answers).some(([k, v]) => progress.answers[k] !== v) ||
      Object.entries(input.reflections).some(([k, v]) => progress.reflections[k] !== v)) throw new AccountError("旅程存档包含无效内容，请刷新后重试。");
    const revision = body.expectedRevision;
    if (revision !== null && (!Number.isSafeInteger(revision) || Number(revision) < 1)) throw new AccountError("请先读取云端存档，再保存旅程。", 400, "revision_required");
    const { data, error } = await client.rpc("save_game_progress", { next_progress: progress, expected_revision: revision });
    if (error) throw error;
    if (data.conflict) return accountJson({ code: "conflict", error: "另一台设备更新了旅程，请选择要保留的存档。", save: data.save }, 409);
    return accountJson({ save: data.save });
  } catch (error) { return accountFailure(error); }
}
