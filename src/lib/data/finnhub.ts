/**
 * Finnhub API — free tier, real-time stock data + news + earnings
 * Env: FINNHUB_API_KEY
 * Docs: https://finnhub.io/docs/api
 */

const BASE = "https://finnhub.io/api/v1";

function key(): string {
  const k = process.env.FINNHUB_API_KEY;
  if (!k) throw new Error("FINNHUB_API_KEY not set");
  return k;
}

export interface FinnhubNews {
  id:       number;
  category: string;
  datetime: number;
  headline: string;
  image:    string;
  related:  string;
  source:   string;
  summary:  string;
  url:      string;
}

export interface FinnhubEarnings {
  symbol:         string;
  date:           string;
  epsActual:      number | null;
  epsEstimate:    number | null;
  revenueActual:  number | null;
  revenueEstimate: number | null;
  quarter:        number;
  year:           number;
}

export interface InsiderTransaction {
  name:         string;
  share:        number;
  change:       number;
  filingDate:   string;
  transactionDate: string;
  transactionCode: string;
  transactionPrice: number;
}

/** Get company news for a ticker (last N days) */
export async function getCompanyNews(ticker: string, from: string, to: string): Promise<FinnhubNews[]> {
  const url = `${BASE}/company-news?symbol=${encodeURIComponent(ticker)}&from=${from}&to=${to}&token=${key()}`;
  const res  = await fetch(url, { next: { revalidate: 120 } });
  if (!res.ok) return [];
  return res.json();
}

/** Get general market news by category */
export async function getMarketNews(category: "general" | "forex" | "crypto" | "merger" = "general"): Promise<FinnhubNews[]> {
  const url = `${BASE}/news?category=${category}&token=${key()}`;
  const res  = await fetch(url, { next: { revalidate: 120 } });
  if (!res.ok) return [];
  return res.json();
}

/** Get upcoming earnings calendar */
export async function getEarningsCalendar(from: string, to: string): Promise<FinnhubEarnings[]> {
  const url = `${BASE}/calendar/earnings?from=${from}&to=${to}&token=${key()}`;
  const res  = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.earningsCalendar ?? []).map((e: any) => ({
    symbol:           e.symbol,
    date:             e.date,
    epsActual:        e.epsActual,
    epsEstimate:      e.epsEstimate,
    revenueActual:    e.revenueActual,
    revenueEstimate:  e.revenueEstimate,
    quarter:          e.quarter,
    year:             e.year,
  }));
}

/** Get insider transactions (Form 4 equivalent) for a ticker */
export async function getInsiderTransactions(ticker: string): Promise<InsiderTransaction[]> {
  const url = `${BASE}/stock/insider-transactions?symbol=${encodeURIComponent(ticker)}&token=${key()}`;
  const res  = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.data ?? []).slice(0, 20).map((t: any) => ({
    name:               t.name,
    share:              t.share,
    change:             t.change,
    filingDate:         t.filingDate,
    transactionDate:    t.transactionDate,
    transactionCode:    t.transactionCode,
    transactionPrice:   t.transactionPrice,
  }));
}

/** Get real-time quote */
export async function getQuote(ticker: string): Promise<{ c: number; d: number; dp: number; h: number; l: number; o: number; pc: number } | null> {
  const url = `${BASE}/quote?symbol=${encodeURIComponent(ticker)}&token=${key()}`;
  const res  = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) return null;
  return res.json();
}
