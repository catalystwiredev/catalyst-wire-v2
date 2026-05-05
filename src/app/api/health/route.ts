import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/azure-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  checks.env_sql_server   = process.env.AZURE_SQL_SERVER   ? "ok" : "MISSING";
  checks.env_sql_db       = process.env.AZURE_SQL_DATABASE  ? "ok" : "MISSING";
  checks.env_sql_user     = process.env.AZURE_SQL_USER      ? "ok" : "MISSING";
  checks.env_sql_password = process.env.AZURE_SQL_PASSWORD  ? "ok" : "MISSING";
  checks.env_nextauth_url = process.env.NEXTAUTH_URL        ? "ok" : "MISSING";
  checks.env_nextauth_sec = process.env.NEXTAUTH_SECRET     ? "ok" : "MISSING";

  try {
    const start = Date.now();
    const user = await getUserByEmail("__health_check_nonexistent__@catalyst-wire.internal");
    checks.db = `ok (${Date.now() - start}ms, user=${user === null ? "null as expected" : "unexpected"})`;
  } catch (err: any) {
    checks.db = `ERROR: ${err?.message ?? String(err)}`;
  }

  const allOk = Object.values(checks).every(v => v === "ok" || v.startsWith("ok ("));
  return NextResponse.json({ status: allOk ? "healthy" : "degraded", checks }, { status: allOk ? 200 : 500 });
}
