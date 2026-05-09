import { NextRequest, NextResponse } from "next/server";
import { getYahooOptionChain } from "@/lib/data/yahoo-finance";

export const runtime = "nodejs";
export const revalidate = 60;

/**
 * Options chain — full strikes, IV, OI, volume, and Black-Scholes Greeks.
 * Source: Yahoo Finance (yahoo-finance2). No API key required.
 *
 * Query params:
 *   expiration  ISO date string to fetch a specific expiry (default: nearest)
 *
 * Response includes `expirations[]` — all available expiry dates for the symbol.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await ctx.params;
  const expiration = new URL(req.url).searchParams.get("expiration") ?? undefined;

  const chain = await getYahooOptionChain(symbol, expiration);
  if (!chain) {
    return NextResponse.json({ error: "No options data", symbol }, { status: 404 });
  }
  return NextResponse.json(chain);
}
