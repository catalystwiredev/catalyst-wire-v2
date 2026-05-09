import { NextResponse } from "next/server";
import { getCatalysts } from "@/lib/azure-db";
import { getMacroSnapshot } from "@/lib/data/fred";
import { getNews } from "@/lib/data/marketaux";

export const runtime = "nodejs";
export const revalidate = 5;

/**
 * Unified dashboard payload — catalysts + macro + news in one response.
 * Used by DashboardClient's auto-refresh poll for low-latency updates.
 */
export async function GET() {
  try {
    const [catalysts, macroRaw, news] = await Promise.all([
      getCatalysts({ premiumOnly: false, limit: 50 }).catch(() => []),
      getMacroSnapshot().catch(() => null),
      getNews({ limit: 5 }).catch(() => []),
    ]);

    const macro = macroRaw
      ? Object.entries(macroRaw).slice(0, 6).map(([id, s]) => {
          const series = s as { title?: string; latestValue?: number; units?: string; latestDate?: string };
          return {
            id,
            title: series?.title ?? id,
            value: series?.latestValue ?? null,
            units: series?.units ?? "",
            date:  series?.latestDate ?? "",
          };
        })
      : [];

    return NextResponse.json({ catalysts, macro, news, generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("[api/dashboard]", err);
    return NextResponse.json({ catalysts: [], macro: [], news: [], error: "Failed to fetch dashboard data" }, { status: 200 });
  }
}
