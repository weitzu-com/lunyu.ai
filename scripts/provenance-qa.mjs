#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const expected = {
  remote: "github.com/weitzu-com/lunyu.ai",
  repositoryOwner: "weitzu-com",
  repositorySlug: "lunyu.ai",
  productionBranch: "main",
  productionHost: "www.lunyu.ai",
};

const options = new Set(process.argv.slice(2));
const allowedOptions = new Set(["--checkout-only"]);
const unknownOptions = [...options].filter((option) => !allowedOptions.has(option));

if (unknownOptions.length > 0) {
  console.error(`[provenance][INVALID] unknown option(s): ${unknownOptions.join(", ")}`);
  process.exit(64);
}

const checkoutOnly = options.has("--checkout-only");
const failures = [];
const blockers = [];

function fail(code, message) {
  failures.push(`[provenance][STALE][${code}] ${message}`);
}

function block(code, message) {
  blockers.push(`[provenance][BLOCKED][${code}] ${message}`);
}

function git(args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    const stderr = error?.stderr?.toString().trim();
    throw new Error(stderr || error?.message || `git ${args.join(" ")} failed`);
  }
}

function gitRef(ref) {
  try {
    return git(["rev-parse", "--verify", ref]);
  } catch {
    return null;
  }
}

function normalizeRemote(remote) {
  return remote
    .trim()
    .replace(/^git@github\.com:/, "github.com/")
    .replace(/^ssh:\/\/git@github\.com\//, "github.com/")
    .replace(/^https?:\/\/github\.com\//, "github.com/")
    .replace(/\.git\/?$/, "")
    .replace(/\/$/, "");
}

function isAncestor(ancestor, descendant) {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", ancestor, descendant], {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

function readRemoteMainSha() {
  const suppliedSha = process.env.PROVENANCE_EXPECTED_MAIN_SHA?.trim();
  if (suppliedSha) {
    if (!/^[0-9a-f]{40}$/i.test(suppliedSha)) {
      fail(
        "INVALID_SHA_OVERRIDE",
        "PROVENANCE_EXPECTED_MAIN_SHA must be a full 40-character Git SHA."
      );
      return null;
    }
    console.log(`[provenance] using externally verified main SHA ${suppliedSha}`);
    return suppliedSha.toLowerCase();
  }

  try {
    const output = git(["ls-remote", "--exit-code", "origin", "refs/heads/main"]);
    const sha = output.split(/\s+/)[0]?.toLowerCase();
    if (!/^[0-9a-f]{40}$/.test(sha ?? "")) {
      block("GITHUB_MAIN_UNREADABLE", `origin returned no full SHA for ${expected.productionBranch}.`);
      return null;
    }
    return sha;
  } catch (error) {
    block(
      "GITHUB_UNREACHABLE",
      `cannot read origin/${expected.productionBranch}: ${error.message}`
    );
    return null;
  }
}

function validateCheckout(remoteMainSha) {
  let originUrl;
  let head;
  let branch;

  try {
    git(["rev-parse", "--is-inside-work-tree"]);
    originUrl = git(["remote", "get-url", "origin"]);
    head = git(["rev-parse", "HEAD"]).toLowerCase();
    branch = git(["branch", "--show-current"]) || "(detached)";
  } catch (error) {
    fail("CHECKOUT_INVALID", error.message);
    return;
  }

  if (normalizeRemote(originUrl) !== expected.remote) {
    fail(
      "WRONG_REMOTE",
      `origin is ${originUrl}; expected https://${expected.remote}.git`
    );
  }

  const worktreeChanges = git(["status", "--porcelain", "--untracked-files=normal"]);
  if (worktreeChanges) {
    const changedPaths = worktreeChanges
      .split("\n")
      .slice(0, 5)
      .map((line) => line.slice(3))
      .join(", ");
    fail(
      "DIRTY_WORKTREE",
      `checkout has uncommitted paths (${changedPaths}); HEAD cannot identify the source tree exactly.`
    );
  }

  if (!remoteMainSha) return;

  const localMain = gitRef("refs/heads/main")?.toLowerCase();
  const trackingMain = gitRef("refs/remotes/origin/main")?.toLowerCase();

  if (localMain && localMain !== remoteMainSha) {
    fail(
      "LOCAL_MAIN_STALE",
      `local main is ${localMain}; GitHub main is ${remoteMainSha}.`
    );
  }
  if (trackingMain && trackingMain !== remoteMainSha) {
    fail(
      "TRACKING_MAIN_STALE",
      `origin/main is ${trackingMain}; GitHub main is ${remoteMainSha}. Run git fetch --prune origin.`
    );
  }

  if (!gitRef(`${remoteMainSha}^{commit}`)) {
    fail(
      "MAIN_OBJECT_MISSING",
      `checkout does not contain GitHub main ${remoteMainSha}; fetch origin before trusting this tree.`
    );
  } else if (!isAncestor(remoteMainSha, head)) {
    fail(
      "WRONG_BASELINE",
      `HEAD ${head} is not descended from GitHub main ${remoteMainSha}.`
    );
  }

  if (branch === expected.productionBranch && head !== remoteMainSha) {
    fail(
      "MAIN_DIVERGED",
      `checked-out main is ${head}; GitHub main is ${remoteMainSha}.`
    );
  }

  console.log(
    `[provenance] checkout branch=${branch} head=${head} baseline=${remoteMainSha}`
  );
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function validateDeployment(remoteMainSha) {
  if (!remoteMainSha) return;

  const liveUrl = new URL(
    process.env.PROVENANCE_LIVE_URL?.trim() ||
      `https://${expected.productionHost}/.well-known/provenance`
  );
  liveUrl.searchParams.set("qa", Date.now().toString());

  let response;
  try {
    response = await fetch(liveUrl, {
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      redirect: "error",
    });
  } catch (error) {
    block("PRODUCTION_UNREACHABLE", `cannot fetch ${liveUrl.origin}${liveUrl.pathname}: ${error.message}`);
    return;
  }

  if (!response.ok) {
    fail(
      "DEPLOYED_METADATA_MISSING",
      `${liveUrl.origin}${liveUrl.pathname} returned HTTP ${response.status}; production has no current provenance document.`
    );
    return;
  }

  let document;
  try {
    document = await response.json();
  } catch (error) {
    fail("DEPLOYED_METADATA_INVALID", `production response is not JSON: ${error.message}`);
    return;
  }

  const checks = [
    [document.schemaVersion === 1, "SCHEMA_MISMATCH", `schemaVersion is ${document.schemaVersion ?? "missing"}; expected 1.`],
    [document.deployment?.provider === "vercel", "PROVIDER_MISMATCH", `provider is ${text(document.deployment?.provider) || "missing"}; expected vercel.`],
    [document.deployment?.environment === "production", "ENVIRONMENT_MISMATCH", `environment is ${text(document.deployment?.environment) || "missing"}; expected production.`],
    [text(document.deployment?.id).startsWith("dpl_"), "DEPLOYMENT_ID_MISSING", "VERCEL_DEPLOYMENT_ID is missing."],
    [document.deployment?.projectProductionUrl === expected.productionHost, "PRODUCTION_HOST_MISMATCH", `projectProductionUrl is ${text(document.deployment?.projectProductionUrl) || "missing"}; expected ${expected.productionHost}.`],
    [document.git?.provider === "github", "GIT_PROVIDER_MISMATCH", `git provider is ${text(document.git?.provider) || "missing"}; expected github.`],
    [document.git?.repositoryOwner === expected.repositoryOwner, "REPO_OWNER_MISMATCH", `repository owner is ${text(document.git?.repositoryOwner) || "missing"}; expected ${expected.repositoryOwner}.`],
    [document.git?.repositorySlug === expected.repositorySlug, "REPO_SLUG_MISMATCH", `repository slug is ${text(document.git?.repositorySlug) || "missing"}; expected ${expected.repositorySlug}.`],
    [document.git?.commitRef === expected.productionBranch, "PRODUCTION_BRANCH_MISMATCH", `deployed ref is ${text(document.git?.commitRef) || "missing"}; expected ${expected.productionBranch}.`],
    [document.git?.commitSha === remoteMainSha, "DEPLOYED_SHA_STALE", `deployed SHA is ${text(document.git?.commitSha) || "missing"}; GitHub main is ${remoteMainSha}.`],
  ];

  for (const [passes, code, message] of checks) {
    if (!passes) fail(code, message);
  }

  console.log(
    `[provenance] production deployment=${text(document.deployment?.id) || "missing"} sha=${text(document.git?.commitSha) || "missing"}`
  );
}

const remoteMainSha = readRemoteMainSha();
validateCheckout(remoteMainSha);
if (!checkoutOnly) await validateDeployment(remoteMainSha);

for (const message of blockers) console.error(message);
for (const message of failures) console.error(message);

if (blockers.length > 0) process.exit(2);
if (failures.length > 0) process.exit(1);

console.log(
  checkoutOnly
    ? "[provenance][PASS] checkout matches the current GitHub production baseline."
    : "[provenance][PASS] checkout and deployed metadata match GitHub main."
);
