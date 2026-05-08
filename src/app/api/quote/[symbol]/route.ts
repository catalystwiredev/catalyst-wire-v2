import { NextRequest, NextResponse } from "next/server";
import { getYahooQuote } from "@/lib/data/yahoo-finance";
import { getTwelveDataQuote } from "@/lib/data/twelve-data";
import { getQuote as getFinnhubQuote } from "@/lib/data/finnhub";

export const runtime = "nodejs";
export const revalidate = 30;

/**
 * Unified real-time quote endpoint with automatic provider fallback.
 *   Yahoo (free, always-on) → Twelve Data → Finnhub
 *
 * Free tier: any visitor can hit this. Yahoo's underlying data is public.
 * No tier gate here — quote API is the foundation, not a premium feature.
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await ctx.params;
  const sym = symbol.toUpperCase();

  // Yahoo first — most accurate, always-on, no key required, includes pre/post fields
  const yahoo = await getYahooQuote(sym);
  if (yahoo && yahoo.regularMarketPrice > 0) {
    const preMarket = yahoo.preMarketPrice != null ? {
      price:  yahoo.preMarketPrice,
      change: yahoo.preMarketChangePercent,
      time:   yahoo.preMarketTime,
    } : null;
    const postMarket = yahoo.postMarketPrice != null ? {
      price:  yahoo.postMarketPrice,
      change: yahoo.postMarketChangePercent,
      time:   yahoo.postMarketTime,
    } : null;
    // Active session label — useful for the chart header badge
    const session = preMarket  ? "pre-market"
                  : postMarket ? "after-hours"
                  : "regular";
    return NextResponse.json({
      symbol:   sym,
      price:    yahoo.regularMarketPrice,
      change:   yahoo.regularMarketChangePercent,
      volume:   yahoo.regularMarketVolume,
      high:     yahoo.regularMarketDayHigh,
      low:      yahoo.regularMarketDayLow,
      name:     yahoo.shortName,
      currency: yahoo.currency,
      session,
      preMarket,
      postMarket,
      provider: "yahoo",
    });
  }

  const td = await getTwelveDataQuote(sym);
  if (td && td.close > 0) {
    return NextResponse.json({
      symbol:   td.symbol,
      price:    td.close,
      change:   td.percent_change,
      volume:   td.volume,
      high:     td.high,
      low:      td.low,
      name:     td.name,
      currency: td.currency,
      provider: "twelve-data",
    });
  }

  const fh = await getFinnhubQuote(sym);
  if (fh && fh.c > 0) {
    return NextResponse.json({
      symbol:   sym,
      price:    fh.c,
      change:   fh.dp,
      volume:   null,
      high:     fh.h,
      low:      fh.l,
      name:     null,
      currency: "USD",
      provider: "finnhub",
    });
  }

  return NextResponse.json({ error: "No quote data available", symbol: sym }, { status: 404 });
}
