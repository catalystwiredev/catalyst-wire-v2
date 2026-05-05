import { NextResponse } from "next/server";
import { getEarningsCalendar } from "@/lib/data/finnhub";
import { searchDrugApplications, getDrugRecalls } from "@/lib/data/openfda";
import { searchFilings } from "@/lib/data/sec-edgar";

export const runtime = "nodejs";
export const revalidate = 3600;

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function GET() {
  try {
    const today = new Date();
    const sixtyDaysOut = new Date(today);
    sixtyDaysOut.setDate(sixtyDaysOut.getDate() + 60);

    const [earningsResult, fdaAppsResult, ipoFilingsResult] = await Promise.allSettled([
      getEarningsCalendar(toYMD(today), toYMD(sixtyDaysOut)),
      searchDrugApplications("cancer OR alzheimer OR immunotherapy", 20),
      searchFilings({ forms: ["S-1", "S-11"], limit: 15 }),
    ]);

    const earnings =
      earningsResult.status === "fulfilled" ? earningsResult.value : [];
    const fdaApps =
      fdaAppsResult.status === "fulfilled" ? fdaAppsResult.value : [];
    const ipoFilings =
      ipoFilingsResult.status === "fulfilled" ? ipoFilingsResult.value : [];

    return NextResponse.json({
      earnings,
      fdaApps,
      ipoFilings,
      generated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[api/calendars]", err);
    return NextResponse.json({
      earnings: [],
      fdaApps: [],
      ipoFilings: [],
      generated: new Date().toISOString(),
      error: "Failed to fetch calendar data",
    });
  }
}
