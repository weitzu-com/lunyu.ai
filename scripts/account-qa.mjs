import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const base = new URL(process.argv[2] || "http://localhost:3210").origin;
const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const accounts = [];
const anonymous = { cookies: new Map() };
const empty = { version: 1, answers: {}, reflections: {}, lastChapter: 0 };
const progress = (text) => ({ ...empty, reflections: { "the-first-question": text } });

async function api(actor, pathname, method = "GET", body, origin = base) {
  const response = await fetch(`${base}/api/account/${pathname}`, {
    method,
    headers: { "Content-Type": "application/json", Origin: origin, Cookie: [...actor.cookies].map(([k, v]) => `${k}=${v}`).join("; ") },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  for (const cookie of response.headers.getSetCookie()) {
    const [pair] = cookie.split(";");
    const i = pair.indexOf("=");
    if (pair.slice(i + 1)) actor.cookies.set(pair.slice(0, i), pair.slice(i + 1));
    else actor.cookies.delete(pair.slice(0, i));
  }
  const data = await response.json();
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.ok(!("access_token" in data) && !("refresh_token" in data));
  return { response, data };
}

try {
  const settings = await fetch(`${process.env.SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: process.env.SUPABASE_ANON_KEY } }).then(r => r.json());
  const testRegistration = settings.external?.email === true && settings.mailer_autoconfirm === true && settings.disable_signup === false;
  if (!testRegistration) console.log("Public registration configuration pending. Testing sessions and persistence with disposable admin-created test users; no mail will be sent.");
  const session = await api(anonymous, "session");
  assert.equal(session.data.configured, true);
  assert.equal(session.data.user, null);
  assert.equal(session.data.registrationAvailable, testRegistration, "Public registration must reflect the provider's actual configuration");
  assert.equal(session.data.capabilities.emailVerification, false);
  if (!testRegistration) {
    assert.match(session.data.registrationMessage, /注册暂未开放/);
    const unavailable = await api(anonymous, "register", "POST", { email: `qa-gated-${crypto.randomUUID()}@example.invalid`, password: crypto.randomBytes(24).toString("base64url"), name: "注册状态验证" });
    assert.equal(unavailable.response.status, 503);
    assert.equal(unavailable.data.code, "registration_unavailable");
    assert.match(unavailable.data.error, /注册暂未开放/);
    assert.equal(anonymous.cookies.size, 0, "Blocked registration must not create an authenticated session");
    console.log("PASS: live provider configuration disables public registration with a clear 503 and no session.");
  }
  assert.equal((await api(anonymous, "progress")).response.status, 401);
  assert.equal((await api(anonymous, "register", "POST", { email: "invalid", password: "short" })).response.status, 400);
  assert.equal((await api(anonymous, "login", "POST", {}, "https://foreign.example")).response.status, 403);

  for (let i = 0; i < 2; i++) {
    const actor = { cookies: new Map(), email: `qa-${crypto.randomUUID()}@example.invalid`, password: crypto.randomBytes(24).toString("base64url") };
    accounts.push(actor);
    if (!testRegistration) {
      const { data, error } = await admin.auth.admin.createUser({ email: actor.email, password: actor.password, email_confirm: true, user_metadata: { name: `测试同学${i}` } });
      assert.equal(error, null);
      actor.id = data.user.id;
    }
    const registered = testRegistration
      ? await api(actor, "register", "POST", { email: actor.email, password: actor.password, name: `测试同学${i}` })
      : await api(actor, "login", "POST", { email: actor.email, password: actor.password });
    assert.equal(registered.response.status, testRegistration ? 201 : 200, registered.data.error);
    actor.id = registered.data.user?.id;
    assert.ok(actor.id);
    if (testRegistration) assert.equal(registered.data.requiresEmailConfirmation, false);
    assert.equal(registered.data.user.emailVerified, false);
    const sessionCookies = registered.response.headers.getSetCookie().filter(c => !/Max-Age=0/i.test(c));
    assert.ok(sessionCookies.length > 0);
    assert.ok(sessionCookies.every(c => /HttpOnly/i.test(c) && /SameSite=Lax/i.test(c)));
    if (base.startsWith("https:")) assert.ok(sessionCookies.every(c => /Secure/i.test(c)));
    assert.equal((await api(actor, "session")).data.user.id, actor.id);
    assert.equal((await api(actor, "progress")).data.save, null);
  }

  const [a, b] = accounts;
  const created = await api(a, "progress", "PUT", { progress: progress("A 的旅程"), expectedRevision: null });
  assert.equal(created.response.status, 200, created.data.error);
  assert.equal(created.data.save.revision, 1);
  assert.equal((await api(b, "progress")).data.save, null, "Accounts must not share progress");
  const staleCreate = await api(a, "progress", "PUT", { progress: empty, expectedRevision: null });
  assert.equal(staleCreate.response.status, 409);
  assert.equal(staleCreate.data.save.progress.reflections["the-first-question"], "A 的旅程");
  const concurrent = await Promise.all(["设备一", "设备二"].map(text => api(a, "progress", "PUT", { progress: progress(text), expectedRevision: 1 })));
  assert.deepEqual(concurrent.map(r => r.response.status).sort(), [200, 409]);
  assert.equal((await api(a, "progress")).data.save.revision, 2);
  assert.equal((await api(a, "progress", "PUT", { progress: { ...empty, answers: { injected: "choice" } }, expectedRevision: 2 })).response.status, 400);

  // A separate Supabase client simulates an attacker bypassing the app routes.
  const direct = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: directLoginError } = await direct.auth.signInWithPassword({ email: b.email, password: b.password });
  assert.equal(directLoginError, null);
  const other = await direct.from("game_progress").select("*").eq("user_id", a.id);
  assert.equal(other.error, null);
  assert.deepEqual(other.data, [], "RLS must hide another player's journey");
  const forged = await direct.from("game_progress").insert({ user_id: a.id, progress: empty });
  assert.ok(forged.error, "RLS must reject writing another player's journey");
  const limiter = await direct.rpc("check_account_rate_limit", { bucket_keys: ["forbidden"], attempt_limit: 1, window_seconds: 1 });
  assert.ok(limiter.error, "Players must not invoke service-only rate limiter");
  await direct.auth.signOut();

  await api(a, "logout", "POST");
  assert.equal((await api(a, "session")).data.user, null);
  assert.equal((await api(a, "progress")).response.status, 401);
  assert.equal((await api(a, "login", "POST", { email: a.email, password: "incorrect-password" })).response.status, 401);
  const loggedIn = await api(a, "login", "POST", { email: a.email, password: a.password });
  assert.equal(loggedIn.response.status, 200);
  assert.equal((await api(a, "progress")).data.save.revision, 2, "Progress must persist after logout and a new login");
  console.log(`PASS: ${testRegistration ? "registration, " : ""}login/logout, HttpOnly sessions, account isolation, database RLS, optimistic conflicts, simultaneous saves, validation, CSRF, and persistence.`);
} finally {
  for (const account of accounts) if (account.id) {
    const { error } = await admin.auth.admin.deleteUser(account.id);
    if (error) throw new Error(`Could not clean up disposable QA user ${account.id}: ${error.code}`);
  }
  console.log(`Cleaned up ${accounts.filter(a => a.id).length} disposable QA accounts.`);
}
