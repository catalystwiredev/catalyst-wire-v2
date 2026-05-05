import { NextResponse } from "next/server";
import { getCatalysts, Catalyst } from "@/lib/azure-db";
import { getQuote } from "@/lib/data/finnhub";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ScannerResult extends Catalyst {
  price?:     number;
  change?:    number;
  changePct?: number;
  volume?:    number;
}

export async function GET() {
  try {
    const catalysts = await getCatalysts({ limit: 20 });

    // Collect up to 15 unique tickers
    const tickers: string[] = [];
    for (const c of catalysts) {
      const ticker = c.Ticker ?? c.ticker;
      if (ticker && !tickers.includes(ticker) && tickers.length < 15) {
        tickers.push(ticker);
      }
    }

    // Fetch live Finnhub quotes in parallel
    const quoteResults = await Promise.allSettled(
      tickers.map((ticker) => getQuote(ticker).then((q) => ({ ticker, q })))
    );

    const quoteMap = new Map<string, { price: number; change: number; changePct: number; volume?: number }>();
    for (const r of quoteResults) {
      if (r.status === "fulfilled" && r.value.q) {
        const { ticker, q } = r.value;
        quoteMap.set(ticker, {
          price:     q.c,
          change:    q.d,
          changePct: q.dp,
        });
      }
    }

    const results: ScannerResult[] = catalysts
      .map((c) => {
        const ticker = c.Ticker ?? c.ticker;
        const quote  = ticker ? quoteMap.get(ticker) : undefined;
        return {
          ...c,
          price:     quote?.price,
          change:    quote?.change,
          changePct: quote?.changePct,
        };
      })
      .sort((a, b) => {
        const aScore = a.ImpactScore ?? a.impactScore ?? 0;
        const bScore = b.ImpactScore ?? b.impactScore ?? 0;
        return bScore - aScore;
      });

    return NextResponse.json({ results, generated: new Date().toISOString() });
  } catch (err) {
    console.error("[api/scanners]", err);
    return NextResponse.json({ results: [], generated: new Date().toISOString(), error: "Failed to fetch scanner data" });
  }
}
