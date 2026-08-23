#!/usr/bin/env node
/**
 * Cloudflare grey-cloud (DNS-only) hardening for lunyu.ai.
 *
 * Architecture decision (2026-07-07): Cloudflare is the authoritative DNS
 * provider only. Vercel owns the CDN, TLS, DDoS and edge. Therefore every
 * record here is DNS-only (grey cloud, proxied=false) and we do NOT touch
 * Cloudflare proxy settings (WAF / cache / Brotli / HSTS) — under grey cloud
 * traffic never passes through Cloudflare, so those settings are inert.
 *
 * What this script guarantees (idempotent, safe to re-run):
 *   1. DNS reconcile — apex A → Vercel, www CNAME → cname.vercel-dns.com.
 *   2. DNSSEC        — enabled; prints the DS record to add at the registrar.
 *   3. CAA           — 0 issue "letsencrypt.org" (Vercel's CA), blocks mis-issuance.
 *   4. Email anti-spoofing — adds null-MX + SPF -all + DMARC p=reject ONLY when
 *      the domain has no existing mail records (never clobbers Feishu/Resend/etc).
 *
 * Env (see .env.example):
 *   CLOUDFLARE_API_TOKEN   token with Zone:Read + DNS:Edit on the lunyu.ai zone
 *   CLOUDFLARE_ZONE_ID     dda35d5392292eef899a42cb8403df13
 *   CLOUDFLARE_DOMAIN      lunyu.ai
 *   VERCEL_APEX_A_TARGET   76.76.21.21           (Vercel apex anycast IP)
 *   VERCEL_WWW_CNAME       cname.vercel-dns.com  (Vercel www CNAME target)
 *   HARDEN_EMAIL           "false" to skip the email anti-spoofing step
 */
import process from "node:process";

const token = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const domain = process.env.CLOUDFLARE_DOMAIN || "lunyu.ai";
const wwwCname = process.env.VERCEL_WWW_CNAME || "cname.vercel-dns.com";
const hardenEmail = process.env.HARDEN_EMAIL !== "false";

if (!token || !zoneId) {
  console.error("Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID.");
  process.exit(1);
}

async function cf(path, init = {}) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(JSON.stringify(data.errors || data, null, 2));
  }
  return data.result;
}

const list = (query) => cf(`/zones/${zoneId}/dns_records?${query}`);
const create = (body) =>
  cf(`/zones/${zoneId}/dns_records`, { method: "POST", body: JSON.stringify(body) });
const destroy = (id) =>
  cf(`/zones/${zoneId}/dns_records/${id}`, { method: "DELETE" });

const isVercelTarget = (c = "") => /vercel-dns/.test(c);

/**
 * Ensure `name` resolves to Vercel, DNS-only, without clobbering a working
 * setup. Modern Vercel hands out a per-project CNAME target
 * (e.g. <hash>.vercel-dns-016.com) that auto-follows Vercel's IPs, so if a
 * DNS-only CNAME → *vercel-dns* already exists we leave it alone. Only when
 * nothing points at Vercel do we create a fresh CNAME → cname.vercel-dns.com.
 */
async function ensureVercelHost(name) {
  const records = await list(`name=${encodeURIComponent(name)}`);
  const good = records.find(
    (r) => r.type === "CNAME" && isVercelTarget(r.content) && r.proxied === false
  );
  if (good) {
    console.log(`  CNAME ${name} -> ${good.content} (DNS-only, kept)`);
    return;
  }
  // Nothing valid — clear strays (A/AAAA/other CNAME) and create the default.
  for (const r of records) await destroy(r.id);
  const target = wwwCname.replace(/\.$/, "");
  await create({ type: "CNAME", name, content: target, proxied: false, ttl: 1 });
  console.log(`  CNAME ${name} -> ${target} (DNS-only, created)`);
}

const ensureApex = () => ensureVercelHost(domain);
const ensureWww = () => ensureVercelHost(`www.${domain}`);

/** Enable DNSSEC and surface the DS record for the registrar. */
async function ensureDNSSEC() {
  let ds = await cf(`/zones/${zoneId}/dnssec`);
  if (ds.status !== "active") {
    ds = await cf(`/zones/${zoneId}/dnssec`, {
      method: "PATCH",
      body: JSON.stringify({ status: "active" }),
    });
  }
  console.log(`  DNSSEC status: ${ds.status}`);
  if (ds.ds) {
    console.log("  >>> Add this DS record at your registrar (GoDaddy/etc):");
    console.log(`      ${ds.ds}`);
  } else if (ds.status === "pending") {
    console.log("  >>> DNSSEC pending — re-run to print the DS record once ready.");
  }
}

/** Authorize only Let's Encrypt (Vercel's CA) to issue certificates. */
async function ensureCAA() {
  const records = await list(`type=CAA&name=${encodeURIComponent(domain)}`);
  const has = records.some(
    (r) => r.data?.tag === "issue" && String(r.data?.value).includes("letsencrypt.org")
  );
  if (!has) {
    await create({
      type: "CAA",
      name: domain,
      data: { flags: 0, tag: "issue", value: "letsencrypt.org" },
      ttl: 1,
    });
  }
  console.log(`  CAA   ${domain} 0 issue "letsencrypt.org"`);
}

/** Add anti-spoofing records ONLY if the domain sends no mail today. */
async function ensureEmail() {
  if (!hardenEmail) {
    console.log("  Email hardening skipped (HARDEN_EMAIL=false).");
    return;
  }
  const mx = await list(`type=MX`);
  const txtApex = await list(`type=TXT&name=${encodeURIComponent(domain)}`);
  const hasSpf = txtApex.some((r) => /v=spf1/i.test(r.content));
  const dmarcName = `_dmarc.${domain}`;
  const txtDmarc = await list(`type=TXT&name=${encodeURIComponent(dmarcName)}`);
  const hasDmarc = txtDmarc.length > 0;

  if (mx.length > 0 || hasSpf) {
    // Existing mail setup (Feishu/Resend/…) — never clobber. Only add DMARC if missing.
    if (!hasDmarc) {
      await create({
        type: "TXT",
        name: dmarcName,
        content: "v=DMARC1; p=quarantine; sp=quarantine; adkim=s; aspf=s",
        ttl: 1,
      });
      console.log(`  TXT   ${dmarcName} DMARC quarantine (added; existing mail preserved)`);
    } else {
      console.log("  Email records present (MX/SPF/DMARC) — left untouched.");
    }
    return;
  }

  // No mail on this domain → lock it down hard.
  await create({ type: "MX", name: domain, content: ".", priority: 0, ttl: 1 }); // null MX (RFC 7505)
  await create({ type: "TXT", name: domain, content: "v=spf1 -all", ttl: 1 });
  if (!hasDmarc) {
    await create({
      type: "TXT",
      name: dmarcName,
      content: "v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s",
      ttl: 1,
    });
  }
  console.log("  Email: null-MX + SPF -all + DMARC p=reject (no-mail lockdown).");
}

async function main() {
  console.log(`Cloudflare grey-cloud hardening for ${domain}\n--- DNS ---`);
  await ensureApex();
  await ensureWww();
  console.log("--- Security ---");
  await ensureDNSSEC();
  await ensureCAA();
  console.log("--- Email ---");
  await ensureEmail();
  console.log("\nDone. All records are DNS-only (grey cloud); Vercel serves traffic.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
