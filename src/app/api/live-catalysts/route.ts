import { NextRequest, NextResponse } from "next/server";
import { searchFilings } from "@/lib/data/sec-edgar";
import { getInsiderTransactions } from "@/lib/data/finnhub";
import dayjs from "dayjs";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type   = searchParams.get("type") ?? "all";   // all | insider | sec
  const ticker = searchParams.get("ticker") ?? "";

  const thirtyDaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");

  try {
    const [edgarResult, insiderResult] = await Promise.allSettled([
      type !== "insider"
        ? searchFilings({ forms: ["4", "8-K", "SC 13D", "SC 13G"], dateFrom: thirtyDaysAgo, query: ticker || undefined, limit: 25 })
        : Promise.resolve([]),
      type !== "sec" && ticker
        ? getInsiderTransactions(ticker)
        : Promise.resolve([]),
    ]);

    const filings   = edgarResult.status   === "fulfilled" ? edgarResult.value   : [];
    const insiders  = insiderResult.status === "fulfilled" ? insiderResult.value : [];

    const catalysts = filings.map((f) => ({
      id:          f.id,
      type:        "sec_filing",
      form:        f.form,
      entity:      f.entity_name,
      ticker:      f.ticker ?? ticker,
      date:        f.file_date,
      period:      f.period,
      url:         f.url,
      verdict:     f.form === "4" ? "Insider Activity" : f.form === "8-K" ? "Material Event" : "Regulatory Filing",
    }));

    const transactions = insiders.map((t, i) => ({
      id:          `insider_${ticker}_${i}`,
      type:        "insider_trade",
      form:        t.transactionCode,
      entity:      t.name,
      ticker:      ticker,
      date:        t.filingDate,
      period:      t.transactionDate,
      shares:      t.change,
      price:       t.transactionPrice,
      verdict:     t.change > 0 ? "Buy" : "Sell",
    }));

    const all = [...catalysts, ...transactions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({ catalysts: all, count: all.length });
  } catch (err) {
    console.error("[api/live-catalysts]", err);
    return NextResponse.json({ catalysts: [], count: 0, error: "Failed to fetch live catalysts" }, { status: 200 });
  }
}
