import { NextResponse } from "next/server";
import { searchDrugApplications, getDrugRecalls } from "@/lib/data/openfda";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  try {
    const [appsResult, recallsResult] = await Promise.allSettled([
      searchDrugApplications("PDUFA OR approval OR NDA OR BLA", 20),
      getDrugRecalls(10),
    ]);

    const applications = appsResult.status   === "fulfilled" ? appsResult.value   : [];
    const recalls      = recallsResult.status === "fulfilled" ? recallsResult.value : [];

    return NextResponse.json({ applications, recalls, generated: new Date().toISOString() });
  } catch (err) {
    console.error("[api/fda]", err);
    return NextResponse.json({ applications: [], recalls: [], generated: new Date().toISOString(), error: "Failed to fetch FDA data" });
  }
}
