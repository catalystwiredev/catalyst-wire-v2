import { NextRequest, NextResponse } from "next/server";
import { getRecent8Ks, getRecentForm4s, searchFilings } from "@/lib/data/sec-edgar";

export const runtime = "nodejs";
export const revalidate = 900;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const form = searchParams.get("form") ?? "all";

  try {
    let filings;

    if (form === "8-K") {
      filings = await getRecent8Ks(40);
    } else if (form === "Form 4" || form === "Form+4" || form === "4") {
      filings = await getRecentForm4s(40);
    } else if (form !== "all") {
      // arbitrary form type passed in query
      filings = await searchFilings({ forms: [form], limit: 40 });
    } else {
      // default: 20 of each, combined
      const [eightKs, form4s] = await Promise.allSettled([
        getRecent8Ks(20),
        getRecentForm4s(20),
      ]);
      const ks  = eightKs.status === "fulfilled" ? eightKs.value : [];
      const f4s = form4s.status  === "fulfilled" ? form4s.value  : [];
      filings = [...ks, ...f4s];
    }

    const sorted = filings
      .sort((a, b) => (b.filedAt ?? "").localeCompare(a.filedAt ?? ""))
      .slice(0, 40);

    return NextResponse.json({ filings: sorted, generated: new Date().toISOString() });
  } catch (err) {
    console.error("[api/sec-filings]", err);
    return NextResponse.json({ filings: [], generated: new Date().toISOString(), error: "Failed to fetch SEC filings" });
  }
}
