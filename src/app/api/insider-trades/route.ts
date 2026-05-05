import { NextResponse } from "next/server";
import { getRecentForm4s, EdgarFiling } from "@/lib/data/sec-edgar";
import { getQuote } from "@/lib/data/finnhub";

export const runtime = "nodejs";
export const revalidate = 1800;

interface QuoteData {
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

export async function GET() {
  try {
    const form4s = await getRecentForm4s(40);

    // Extract up to 10 unique tickers from filings
    const tickers: string[] = [];
    for (const f of form4s) {
      const t = f.ticker;
      if (t && !tickers.includes(t) && tickers.length < 10) {
        tickers.push(t);
      }
    }

    // Fetch live quotes for unique tickers in parallel
    const quoteResults = await Promise.allSettled(
      tickers.map((ticker) => getQuote(ticker).then((q) => ({ ticker, q })))
    );

    const quoteMap = new Map<string, QuoteData>();
    for (const r of quoteResults) {
      if (r.status === "fulfilled" && r.value.q) {
        const { ticker, q } = r.value;
        quoteMap.set(ticker, {
          price:     q.c,
          change:    q.d,
          changePct: q.dp,
          high:      q.h,
          low:       q.l,
          open:      q.o,
          prevClose: q.pc,
        });
      }
    }

    const trades = form4s.map((f: EdgarFiling) => ({
      ...f,
      quote: f.ticker ? quoteMap.get(f.ticker) : undefined,
    }));

    return NextResponse.json({ trades, generated: new Date().toISOString() });
  } catch (err) {
    console.error("[api/insider-trades]", err);
    return NextResponse.json({ trades: [], generated: new Date().toISOString(), error: "Failed to fetch insider trades" });
  }
}
