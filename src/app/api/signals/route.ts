import { NextRequest, NextResponse } from "next/server";
import { getRecentSignals, getSignalsForSymbol } from "@/lib/azure-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol        = searchParams.get("symbol");
  const limit         = Math.min(Number(searchParams.get("limit") ?? 50), 500);
  const minConfidence = Math.max(0, Math.min(100, Number(searchParams.get("minConfidence") ?? 0)));

  try {
    const signals = symbol
      ? await getSignalsForSymbol(symbol, limit)
      : await getRecentSignals({ limit, minConfidence });
    return NextResponse.json({ signals, count: signals.length, generated: new Date().toISOString() });
  } catch (err) {
    console.error("[api/signals] fetch failed:", err);
    return NextResponse.json({ signals: [], count: 0, error: "Failed to fetch signals" }, { status: 200 });
  }
}
