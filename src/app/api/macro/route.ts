import { NextResponse } from "next/server";
import { getMacroSnapshot } from "@/lib/data/fred";

export const runtime = "nodejs";
export const revalidate = 30;

export async function GET() {
  try {
    const snapshot = await getMacroSnapshot();

    const formatted = Object.entries(snapshot).map(([id, series]) => ({
      id,
      title:       series?.title ?? id,
      value:       series?.latestValue ?? null,
      date:        series?.latestDate  ?? null,
      units:       series?.units       ?? "",
      frequency:   series?.frequency   ?? "",
    }));

    return NextResponse.json({ indicators: formatted, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("[api/macro]", err);
    return NextResponse.json({ indicators: [], error: "Failed to fetch macro data" }, { status: 200 });
  }
}
