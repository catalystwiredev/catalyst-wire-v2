import { NextRequest, NextResponse } from "next/server";
import { getEarningsCalendar } from "@/lib/data/finnhub";

export const runtime = "nodejs";
export const revalidate = 30;

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const now = new Date();
  const defaultTo = new Date(now);
  defaultTo.setDate(defaultTo.getDate() + 60);

  const from = searchParams.get("from") ?? toYMD(now);
  const to   = searchParams.get("to")   ?? toYMD(defaultTo);

  try {
    const raw = await getEarningsCalendar(from, to);

    const todayStr = toYMD(now);
    const earnings = raw
      .filter((e) => e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 50);

    return NextResponse.json({ earnings, generated: new Date().toISOString() });
  } catch (err) {
    console.error("[api/earnings]", err);
    return NextResponse.json({ earnings: [], generated: new Date().toISOString(), error: "Failed to fetch earnings calendar" });
  }
}
