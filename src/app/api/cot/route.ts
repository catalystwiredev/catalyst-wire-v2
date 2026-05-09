import { NextRequest, NextResponse } from "next/server";
import { getRecentCOTReports, netPositioning } from "@/lib/data/cftc";
import { auth } from "@/lib/auth";
import { tierAtLeast } from "@/lib/tier";

export const runtime = "nodejs";
export const revalidate = 30;

/**
 * CFTC Commitment of Traders — institutional positioning data.
 * Free tier sees this week's S&P only; Alpha+ unlocks full market filter + history.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  const isPremium = tierAtLeast(session, "alpha");

  const url = new URL(req.url);
  const marketContains = url.searchParams.get("market") ?? (isPremium ? undefined : "S&P 500");
  const limit          = isPremium ? Math.min(Number(url.searchParams.get("limit") ?? 50), 200) : 5;

  const rows = await getRecentCOTReports({ marketContains, limit });
  const enriched = rows.map(r => ({ ...r, net: netPositioning(r) }));
  return NextResponse.json({ count: enriched.length, rows: enriched, premium: isPremium });
}
