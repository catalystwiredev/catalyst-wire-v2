import { NextRequest, NextResponse } from "next/server";
import { getStockBars } from "@/lib/data/alpaca";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const timeframe = (searchParams.get("timeframe") ?? "1Min") as "1Min" | "5Min" | "15Min" | "1Hour" | "1Day";
  const limit     = Math.min(Number(searchParams.get("limit") ?? 200), 1000);

  // Default window: last `limit` minutes for 1Min, etc.
  const minutesPerBar = { "1Min": 1, "5Min": 5, "15Min": 15, "1Hour": 60, "1Day": 1440 }[timeframe];
  const end   = new Date();
  const start = new Date(end.getTime() - (limit + 30) * minutesPerBar * 60_000);

  try {
    const bars = await getStockBars(symbol, {
      timeframe,
      limit,
      start: start.toISOString(),
      end:   end.toISOString(),
    });
    return NextResponse.json({ symbol: symbol.toUpperCase(), timeframe, count: bars.length, bars });
  } catch (err) {
    console.error("[api/bars]", err);
    return NextResponse.json({ symbol: symbol.toUpperCase(), timeframe, count: 0, bars: [], error: "Failed to fetch bars" });
  }
}
