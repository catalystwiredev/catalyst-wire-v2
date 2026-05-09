import { NextRequest, NextResponse } from "next/server";
import { getStockBars } from "@/lib/data/alpaca";
import { getYahooBars } from "@/lib/data/yahoo-finance";

export const runtime = "nodejs";
export const revalidate = 60;

// Alpaca timeframe → Yahoo interval
const TF_TO_YAHOO = {
  "1Min":  "1m",
  "5Min":  "5m",
  "15Min": "15m",
  "1Hour": "1h",
  "1Day":  "1d",
} as const;

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const timeframe = (searchParams.get("timeframe") ?? "1Min") as "1Min" | "5Min" | "15Min" | "1Hour" | "1Day";
  const limit     = Math.min(Number(searchParams.get("limit") ?? 200), 1000);

  const minutesPerBar = { "1Min": 1, "5Min": 5, "15Min": 15, "1Hour": 60, "1Day": 1440 }[timeframe];
  const end   = new Date();
  const start = new Date(end.getTime() - (limit + 30) * minutesPerBar * 60_000);

  try {
    // Primary: Alpaca IEX (fast, accurate during regular market hours)
    const alpacaBars = await getStockBars(symbol, {
      timeframe,
      limit,
      start: start.toISOString(),
      end:   end.toISOString(),
    });

    if (alpacaBars.length >= 5) {
      return NextResponse.json({ symbol: symbol.toUpperCase(), timeframe, count: alpacaBars.length, bars: alpacaBars, provider: "alpaca" });
    }

    // Fallback: Yahoo Finance — covers pre-market (4AM), after-hours (8PM), and weekends
    // includePrePost is enabled by default in getYahooBars()
    const yahooInterval = TF_TO_YAHOO[timeframe];
    const yahooBars = await getYahooBars(symbol, {
      interval: yahooInterval,
      period1:  start,
      period2:  end,
    });

    const bars = yahooBars.slice(-limit);
    return NextResponse.json({ symbol: symbol.toUpperCase(), timeframe, count: bars.length, bars, provider: "yahoo" });

  } catch (err) {
    console.error("[api/bars]", err);
    return NextResponse.json({ symbol: symbol.toUpperCase(), timeframe, count: 0, bars: [], error: "Failed to fetch bars" });
  }
}
