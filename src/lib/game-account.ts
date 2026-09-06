"use client";

import { useEffect, useSyncExternalStore } from "react";
import { emptyProgress, getProgressSnapshot, parseGameProgress, saveProgress, subscribeProgress, type GameProgress } from "@/lib/game-progress";
import type { AccountUser, CloudGameSave } from "@/lib/auth/types";
export type { AccountUser } from "@/lib/auth/types";
export type CloudSave = CloudGameSave;
type SyncStatus = "loading" | "guest" | "checking" | "synced" | "saving" | "conflict" | "error";
type AccountSnapshot = { configured: boolean; registrationAvailable: boolean; registrationMessage: string; user: AccountUser | null; status: SyncStatus; error: string; cloud: CloudSave | null; savedAt: string | null };
const initial: AccountSnapshot = { configured: true, registrationAvailable: false, registrationMessage: "正在检查注册服务。", user: null, status: "loading", error: "", cloud: null, savedAt: null };
const OWNER_KEY = "lunyu-journey-owner-v2";
const SESSION_EVENT = "lunyu-account-session-v2";
const GUEST_DRAFT = "lunyu-guest-draft-v2";
let snapshot = initial;
let epoch = 0;
let fingerprint = "";
let revision: number | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let active = false;
let mounts = 0;
let cleanup: (() => void) | undefined;
let writePromise: Promise<void> | null = null;
let writeEpoch = -1;
let sessionPromise: Promise<void> | null = null;
let sessionSequence = 0;
let applyingProgress = false;
const listeners = new Set<() => void>();
const serialize = (progress: GameProgress) => JSON.stringify({ answers: progress.answers, reflections: progress.reflections, lastChapter: progress.lastChapter });
function update(patch: Partial<AccountSnapshot>) { snapshot = { ...snapshot, ...patch }; listeners.forEach((listener) => listener()); }
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function storageGet(key: string) { try { return localStorage.getItem(key); } catch { return null; } }
function setOwner(id: string | null) { try { if (id) localStorage.setItem(OWNER_KEY, id); else localStorage.removeItem(OWNER_KEY); } catch { /* Optional storage. */ } }
function draftKey(id: string) { return `lunyu-account-draft-v2:${id}`; }
function rememberDraft(id: string | null, progress: GameProgress) { try { sessionStorage.setItem(id ? draftKey(id) : GUEST_DRAFT, JSON.stringify(progress)); } catch { /* Keep in-memory progress. */ } }
function storedDraft(id: string | null): GameProgress | null { try { const raw = sessionStorage.getItem(id ? draftKey(id) : GUEST_DRAFT); return raw === null ? null : parseGameProgress(raw); } catch { return null; } }
function savedDraft(id: string | null) { return storedDraft(id) ?? emptyProgress; }
function removeDraft(id: string) { try { sessionStorage.removeItem(draftKey(id)); } catch { /* Optional recovery. */ } }
function hasProgress(progress: GameProgress) { return Object.keys(progress.answers).length > 0 || Object.values(progress.reflections).some((note) => note.trim()); }
function replaceLocal(progress: GameProgress) {
  applyingProgress = true;
  try { saveProgress(progress); } finally { applyingProgress = false; }
  window.dispatchEvent(new Event("lunyu-cloud-loaded"));
}
function broadcastSession() { try { localStorage.setItem(SESSION_EVENT, `${Date.now()}:${Math.random()}`); } catch { /* Focus refresh remains available. */ } }
async function request(path: string, body?: unknown, method = "POST", accountId = snapshot.user?.id) {
  const response = await fetch(`/api/account/${path}`, {
    method: body === undefined ? "GET" : method,
    headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...(accountId ? { "X-Lunyu-Account-Id": accountId } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin", cache: "no-store", keepalive: body !== undefined,
  });
  const data = await response.json().catch(() => ({ error: "服务暂时没有响应，请稍后重试。" }));
  return { response, data };
}
function applyCloud(save: CloudSave) {
  const progress = parseGameProgress(JSON.stringify(save.progress));
  fingerprint = serialize(progress); revision = save.revision;
  if (snapshot.user) setOwner(snapshot.user.id);
  replaceLocal(progress);
  if (snapshot.user) removeDraft(snapshot.user.id);
  update({ status: "synced", cloud: save, savedAt: save.updatedAt, error: "" });
}
async function readCloud(expectedEpoch: number) {
  update({ status: "checking", error: "" });
  try {
    const { response, data } = await request("progress");
    if (epoch !== expectedEpoch) return;
    if (data.code === "account_changed" || response.status === 401) { void initialize(true); return; }
    if (!response.ok) throw new Error(data.error || "读取云端进度失败，请重试。");
    const cloud: CloudSave | null = data.save;
    const local = getProgressSnapshot();
    revision = cloud?.revision ?? null;
    const hasRecovery = snapshot.user && storedDraft(snapshot.user.id) !== null;
    if (cloud && (hasProgress(local) || hasRecovery) && serialize(local) !== serialize(cloud.progress)) { update({ status: "conflict", cloud }); return; }
    if (cloud) { applyCloud(cloud); return; }
    fingerprint = serialize(emptyProgress);
    update({ status: "synced", cloud: null, savedAt: null });
    if (hasProgress(local)) await writeCloud(local, expectedEpoch);
  } catch (error) { if (epoch === expectedEpoch) update({ status: "error", error: error instanceof Error ? error.message : "云端连接失败。" }); }
}
function writeCloud(progress: GameProgress, expectedEpoch = epoch): Promise<void> {
  if (!snapshot.user || expectedEpoch !== epoch) return Promise.resolve();
  if (writePromise) return writeEpoch === expectedEpoch ? writePromise : writePromise.then(() => writeCloud(progress, expectedEpoch));
  const accountId = snapshot.user.id;
  const promise = (async () => {
    update({ status: "saving", error: "" });
    rememberDraft(accountId, progress);
    try {
      const { response, data } = await request("progress", { progress, expectedRevision: revision }, "PUT", accountId);
      if (epoch !== expectedEpoch) return;
      if (data.code === "account_changed" || response.status === 401) { void initialize(true); return; }
      if (response.status === 409) { update({ status: "conflict", cloud: data.save ?? null }); return; }
      if (!response.ok) throw new Error(data.error || "云端保存失败，你的进度仍在此设备。");
      const save = data.save as CloudSave;
      revision = save.revision; fingerprint = serialize(progress);
      if (serialize(getProgressSnapshot()) === fingerprint) removeDraft(accountId);
      update({ status: "synced", cloud: save, savedAt: save.updatedAt });
    } catch (error) { if (epoch === expectedEpoch) update({ status: "error", error: error instanceof Error ? error.message : "保存失败，请重试。" }); }
  })();
  writePromise = promise;
  writeEpoch = expectedEpoch;
  void promise.finally(() => { if (writePromise === promise) writePromise = null; if (epoch === expectedEpoch) queueSave(); });
  return promise;
}
function queueSave() {
  if (applyingProgress) return;
  clearTimeout(timer);
  if (!snapshot.user) return;
  const owner = storageGet(OWNER_KEY);
  if (owner && owner !== snapshot.user.id) { void initialize(true); return; }
  const progress = getProgressSnapshot();
  if (serialize(progress) !== fingerprint) rememberDraft(snapshot.user.id, progress);
  if (snapshot.status !== "synced" || serialize(progress) === fingerprint) return;
  timer = setTimeout(() => void writeCloud(getProgressSnapshot()), 700);
}
function prepareAccount(user: AccountUser | null) {
  const localOwner = storageGet(OWNER_KEY);
  const local = getProgressSnapshot();
  // The owner marker survives a reload while the in-memory user does not.
  // Preserve its cache before an expired session restores the guest journey.
  if (localOwner && localOwner !== user?.id) rememberDraft(localOwner, local);
  if (!localOwner && user) rememberDraft(null, local);
  setOwner(user?.id ?? null);
  // If another tab already switched the shared cache to this user, preserve its
  // newest edits. Clearing that cache here would erase the other tab's draft.
  if (!user && localOwner) replaceLocal(savedDraft(null));
  else if (user && localOwner !== user.id) {
    const recovery = storedDraft(user.id);
    if (recovery) replaceLocal(recovery);
    else if (localOwner) replaceLocal(emptyProgress);
  }
}
async function initialize(force = false): Promise<void> {
  if (sessionPromise && !force) return sessionPromise;
  const previousEpoch = epoch;
  const sequence = ++sessionSequence;
  const promise = (async () => {
    try {
      const { response, data } = await request("session");
      if (epoch !== previousEpoch || sequence !== sessionSequence) return;
      if (!response.ok) throw new Error(data.error || "账号服务暂时不可用。");
      const user: AccountUser | null = data.user ?? null;
      update({ registrationAvailable: data.registrationAvailable === true, registrationMessage: data.registrationMessage || "" });
      // A focus refresh must not invalidate an in-flight write or its revision.
      if (!force && user?.id === snapshot.user?.id && !["loading", "guest"].includes(snapshot.status)) { queueSave(); return; }
      clearTimeout(timer);
      const expectedEpoch = ++epoch;
      prepareAccount(user);
      revision = null; fingerprint = "";
      update({ configured: data.configured !== false, user, status: user ? "checking" : "guest", cloud: null, savedAt: null, error: "" });
      if (user) await readCloud(expectedEpoch);
    } catch (error) { update({ status: snapshot.user ? "error" : "guest", error: error instanceof Error ? error.message : "账号服务暂时不可用。" }); }
  })();
  sessionPromise = promise;
  void promise.finally(() => { if (sessionPromise === promise) sessionPromise = null; });
  return promise;
}
export async function flushAccountProgress() {
  clearTimeout(timer);
  if (!snapshot.user) return;
  const expectedEpoch = epoch;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (writePromise) await writePromise;
    // Another flusher can begin the next batch while this await resumes.
    if (writePromise) continue;
    if (epoch !== expectedEpoch) throw new Error("账号已切换，请检查当前账号后重试。");
    if (snapshot.status !== "synced") throw new Error("请先完成云端同步或选择要保留的进度，再退出账号。");
    if (serialize(getProgressSnapshot()) === fingerprint) return;
    await writeCloud(getProgressSnapshot(), expectedEpoch);
  }
  throw new Error("还有进度没有同步，请重试保存后再退出。");
}
function backgroundFlush() { if (snapshot.user && ["synced", "saving"].includes(snapshot.status)) void flushAccountProgress().catch(() => { /* Local draft stays recoverable. */ }); }
export function useGameAccount() {
  const value = useSyncExternalStore(subscribe, () => snapshot, () => initial);
  useEffect(() => {
    mounts++;
    if (!active) {
      active = true;
      const unsubscribe = subscribeProgress(queueSave);
      const onStorage = (event: StorageEvent) => { if (event.key === SESSION_EVENT || event.key === OWNER_KEY) void initialize(true); };
      const onVisibility = () => { if (document.visibilityState === "hidden") backgroundFlush(); else void initialize(); };
      window.addEventListener("storage", onStorage);
      window.addEventListener("pagehide", backgroundFlush);
      document.addEventListener("visibilitychange", onVisibility);
      cleanup = () => { unsubscribe(); window.removeEventListener("storage", onStorage); window.removeEventListener("pagehide", backgroundFlush); document.removeEventListener("visibilitychange", onVisibility); };
      void initialize();
    }
    return () => { if (--mounts === 0) { backgroundFlush(); active = false; cleanup?.(); } };
  }, []);
  return value;
}
async function adoptUser(user: AccountUser) {
  const expectedEpoch = ++epoch;
  ++sessionSequence;
  clearTimeout(timer);
  prepareAccount(user);
  revision = null; fingerprint = "";
  update({ user, configured: true, status: "checking", cloud: null, savedAt: null, error: "" });
  broadcastSession();
  await readCloud(expectedEpoch);
}
export async function signInAccount(email: string, password: string) {
  if (snapshot.user) await flushAccountProgress();
  const { response, data } = await request("login", { email, password });
  if (!response.ok) throw new Error(data.error || "登录失败，请检查邮箱和密码。");
  await adoptUser(data.user);
}
export async function registerAccount(name: string, email: string, password: string) {
  if (snapshot.user) await flushAccountProgress();
  const { response, data } = await request("register", { name, email, password });
  if (!response.ok) throw new Error(data.error || "注册未完成，请稍后重试。");
  if (data.requiresEmailConfirmation) return data.message || "请检查邮箱中的确认邮件，再回来登录。";
  await adoptUser(data.user);
  return null;
}
export async function signOutAccount(options: { discardUnsynced?: boolean } = {}) {
  if (!options.discardUnsynced) await flushAccountProgress();
  else { ++epoch; ++sessionSequence; }
  clearTimeout(timer);
  const accountId = snapshot.user?.id;
  let result;
  try { result = await request("logout", {}); } catch {
    update({ status: "error", error: "网络不可用，尚未安全退出。请联网后重试。" });
    throw new Error("目前无法连接网站，尚未安全退出。请联网后重试；你可以先导出手记。浏览器中的进度仍会保留。");
  }
  const { response, data } = result;
  if (!response.ok) { if (data.code === "account_changed") void initialize(true); throw new Error(data.error || "退出未完成，请重试。"); }
  ++epoch; ++sessionSequence; fingerprint = ""; revision = null;
  if (accountId) removeDraft(accountId);
  setOwner(null);
  update({ user: null, status: "guest", cloud: null, savedAt: null, error: "" });
  replaceLocal(savedDraft(null));
  broadcastSession();
}
export async function resolveAccountProgress(use: "local" | "cloud") {
  if (use === "cloud" && snapshot.cloud) { applyCloud(snapshot.cloud); return; }
  revision = snapshot.cloud?.revision ?? null;
  await writeCloud(getProgressSnapshot());
}
export async function retryAccountSync() { if (!snapshot.user) await initialize(); else await readCloud(epoch); }
