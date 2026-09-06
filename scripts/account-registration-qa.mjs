import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const compile = path => ts.transpileModule(fs.readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const settingsSource = compile("src/lib/auth/registration.ts");
let clock = 0;
let settings = { external: { email: true }, mailer_autoconfirm: false, disable_signup: false };
let unavailable = false;
let requests = 0;
const exports = {};
vm.runInNewContext(settingsSource, {
  exports, require: name => { assert.equal(name, "server-only"); return {}; },
  process: { env: { SUPABASE_URL: "https://project.example.invalid", SUPABASE_PUBLISHABLE_KEY: "public-test-key" } },
  Date: { now: () => clock }, AbortSignal,
  async fetch(url, options) {
    assert.equal(url, "https://project.example.invalid/auth/v1/settings");
    assert.equal(options.cache, "no-store");
    requests++;
    if (unavailable) throw new Error("Provider offline");
    return { ok: true, json: async () => settings };
  },
});
assert.equal((await exports.registrationStatus()).registrationAvailable, false);
settings.mailer_autoconfirm = true;
assert.equal((await exports.registrationStatus()).registrationAvailable, false);
assert.equal(requests, 1, "Only project-wide settings may use the brief cache");
clock += 5001;
assert.equal((await exports.registrationStatus()).registrationAvailable, true, "Provider configuration changes must open registration without a new build");
assert.equal((await exports.registrationStatus()).registrationMessage, "");
for (const invalid of [
  { external: { email: false }, mailer_autoconfirm: true, disable_signup: false },
  { external: { email: true }, mailer_autoconfirm: true, disable_signup: true },
  {},
]) {
  settings = invalid; clock += 5001;
  assert.equal((await exports.registrationStatus()).registrationAvailable, false);
}
unavailable = true; clock += 5001;
assert.match((await exports.registrationStatus()).registrationMessage, /暂时无法检查/);

let sdkCalls = 0;
const route = {};
class AccountError extends Error { constructor(message, status, code) { super(message); this.status = status; this.code = code; } }
vm.runInNewContext(compile("src/app/api/account/register/route.ts"), {
  exports: route,
  require(name) {
    if (name === "@/lib/auth/registration") return { registrationStatus: async () => ({ registrationAvailable: false, registrationMessage: "注册暂未开放" }) };
    if (name === "@/lib/auth/rate-limit") return { limitAccountAttempts: async () => { throw new Error("Disabled registration must stop before attempts are consumed"); } };
    if (name === "@/lib/auth/server") return {
      AccountError, readAccountBody: async () => ({}), credentials: () => ({ email: "test@example.invalid", password: "test-password", name: "Test" }),
      createAccountClient: async () => { sdkCalls++; throw new Error("Must not create users while registration is unavailable"); },
      accountFailure: error => ({ status: error.status, code: error.code }),
    };
    throw new Error(`Unexpected import ${name}`);
  },
});
const denied = await route.POST({});
assert.equal(denied.status, 503);
assert.equal(denied.code, "registration_unavailable");
assert.equal(sdkCalls, 0);
console.log("PASS: provider-backed registration gating, automatic reopening after cache expiry, fail-closed settings errors, and 503 before the registration SDK.");
