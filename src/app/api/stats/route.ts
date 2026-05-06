import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 300;

const EDGAR = "https://efts.sec.gov/LATEST/search-index";
const UA    = { "User-Agent": "CatalystWire/1.0 catalystwiredev@gmail.com" };

async function edgarCount(params: Record<string, string>): Promise<number> {
  const q = new URLSearchParams(params);
  try {
    const r = await fetch(`${EDGAR}?${q}&_source=form_type&hits.hits.total.relation=eq`, { headers: UA, next: { revalidate: 300 } });
    if (!r.ok) return 0;
    const d = await r.json();
    return d?.hits?.total?.value ?? 0;
  } catch { return 0; }
}

export async function GET() {
  const today    = new Date().toISOString().split("T")[0];
  const weekAgo  = new Date(Date.now() - 7  * 86400000).toISOString().split("T")[0];
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];

  const [totalToday, form4Week, eightKWeek, totalMonth] = await Promise.all([
    edgarCount({ dateRange: "custom", startdt: today,    enddt: today }),
    edgarCount({ forms: "4",    dateRange: "custom", startdt: weekAgo,  enddt: today }),
    edgarCount({ forms: "8-K",  dateRange: "custom", startdt: weekAgo,  enddt: today }),
    edgarCount({ dateRange: "custom", startdt: monthAgo, enddt: today }),
  ]);

  return NextResponse.json({
    catalystsToday:    totalToday,
    insiderFilingsWeek: form4Week,
    materialEventsWeek: eightKWeek,
    totalFilingsMonth:  totalMonth,
    dataSources:        14,
    instrumentsCovered: 12000,
    generatedAt:        new Date().toISOString(),
  });
}
