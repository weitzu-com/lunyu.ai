import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

if (!process.env.POSTGRES_URL) throw new Error("POSTGRES_URL is required. Use node --env-file=.env.local scripts/migrate-accounts.mjs");
const sql = postgres(process.env.POSTGRES_URL, { ssl: "require", max: 1, connect_timeout: 20 });
try {
  await sql.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(hashtext('lunyu-account-migrations'))`;
    await tx`create table if not exists public.app_migrations (version text primary key, applied_at timestamptz not null default now())`;
    await tx`alter table public.app_migrations enable row level security`;
    await tx`revoke all on public.app_migrations from public, anon, authenticated`;
    const directory = path.resolve("supabase/migrations");
    for (const version of (await fs.readdir(directory)).filter((name) => name.endsWith(".sql")).sort()) {
      const existing = await tx`select version from public.app_migrations where version = ${version}`;
      if (existing.length) { console.log(`Already applied: ${version}`); continue; }
      await tx.unsafe(await fs.readFile(path.join(directory, version), "utf8"));
      await tx`insert into public.app_migrations(version) values (${version})`;
      console.log(`Applied: ${version}`);
    }
  });
} finally { await sql.end(); }
