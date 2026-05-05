import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getWatchlist, addWatchlistItem, removeWatchlistItem } from "@/lib/azure-db";

const addSchema = z.object({
  symbol:    z.string().min(1).max(20).toUpperCase(),
  name:      z.string().max(200).default(""),
  assetType: z.enum(["stock", "etf", "crypto", "forex", "futures", "option"]).default("stock"),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const items  = await getWatchlist(userId).catch(() => []);
  return NextResponse.json({ items, count: items.length });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body   = await req.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const userId = (session.user as any).id;
  const { symbol, name, assetType } = parsed.data;
  await addWatchlistItem(userId, symbol, name || symbol, assetType);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol")?.toUpperCase();
  if (!symbol) return NextResponse.json({ error: "symbol required" }, { status: 400 });

  const userId = (session.user as any).id;
  await removeWatchlistItem(userId, symbol);
  return NextResponse.json({ ok: true });
}
