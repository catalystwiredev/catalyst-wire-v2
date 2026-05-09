import { NextRequest, NextResponse } from "next/server";
import { getLatestRates, getCrossRate, getFXHistory, getMajorPairs, getFXCurrencies } from "@/lib/data/frankfurter";

export const runtime = "nodejs";
export const revalidate = 30;

/**
 * Forex rates endpoint — ECB rates via Frankfurter (no API key).
 * Updates once per ECB business day ~16:00 CET. Weekend rates serve last Friday close.
 *
 * Query params:
 *   mode      "latest" | "cross" | "history" | "majors" | "currencies" (default: "majors")
 *   base      Base currency (default: "USD")
 *   targets   Comma-separated target currencies for "latest" mode
 *   from      Target currency for "cross" and start date for "history" (YYYY-MM-DD)
 *   to        Target currency for "cross" and end date for "history"
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode    = searchParams.get("mode") ?? "majors";
  const base    = (searchParams.get("base") ?? "USD").toUpperCase();

  try {
    if (mode === "currencies") {
      const currencies = await getFXCurrencies();
      return NextResponse.json({ currencies });
    }

    if (mode === "majors") {
      const rates = await getMajorPairs();
      if (!rates) return NextResponse.json({ error: "Rates unavailable" }, { status: 503 });
      return NextResponse.json(rates);
    }

    if (mode === "latest") {
      const targets = searchParams.get("targets")?.split(",").map(t => t.trim().toUpperCase());
      const rates = await getLatestRates(base, targets);
      if (!rates) return NextResponse.json({ error: "Rates unavailable" }, { status: 503 });
      return NextResponse.json(rates);
    }

    if (mode === "cross") {
      const from = searchParams.get("from")?.toUpperCase() ?? "USD";
      const to   = searchParams.get("to")?.toUpperCase()   ?? "EUR";
      const rate = await getCrossRate(from, to);
      if (rate === null) return NextResponse.json({ error: "Currency pair not found" }, { status: 404 });
      return NextResponse.json({ from, to, rate });
    }

    if (mode === "history") {
      const from   = searchParams.get("from") ?? new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10);
      const to     = searchParams.get("to")   ?? new Date().toISOString().slice(0, 10);
      const target = (searchParams.get("target") ?? "EUR").toUpperCase();
      const history = await getFXHistory(from, base, target, to);
      return NextResponse.json({ base, target, from, to, history });
    }

    return NextResponse.json({ error: "Unknown mode" }, { status: 400 });

  } catch (err) {
    console.error("[api/forex]", err);
    return NextResponse.json({ error: "Forex data unavailable" }, { status: 500 });
  }
}
