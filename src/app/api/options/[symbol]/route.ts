import { NextRequest, NextResponse } from "next/server";
import { getYahooOptionChain } from "@/lib/data/yahoo-finance";
import { auth } from "@/lib/auth";
import { tierAtLeast } from "@/lib/tier";

export const runtime = "nodejs";
export const revalidate = 60;

/**
 * Yahoo options chain with strikes, IV, OI, volume.
 * Tier gated: Alpha+ only (institutional-grade options data is a paid feature).
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ symbol: string }> }) {
  const session = await auth();
  if (!tierAtLeast(session, "alpha")) {
    return NextResponse.json({ error: "Alpha tier required for options chains" }, { status: 403 });
  }

  const { symbol } = await ctx.params;
  const expiration = new URL(req.url).searchParams.get("expiration") ?? undefined;

  const chain = await getYahooOptionChain(symbol, expiration);
  if (!chain) {
    return NextResponse.json({ error: "No options data", symbol }, { status: 404 });
  }
  return NextResponse.json(chain);
}
