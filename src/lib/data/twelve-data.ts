/**
 * Twelve Data — real-time and historical price data, supports stocks, FX, crypto, ETFs.
 * Secret: TWELVE-DATA-API-KEY (from Azure Key Vault)
 * Docs: https://twelvedata.com/docs
 */
import { getSecret } from "../azure-secrets";

const BASE = "https://api.twelvedata.com";

async function key(): Promise<string> {
  return await getSecret("TWELVE-DATA-API-KEY");
}

export interface TDQuote {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  previous_close: number;
  change: number;
  percent_change: number;
  is_market_open: boolean;
}

export async function getTwelveDataQuote(symbol: string): Promise<TDQuote | null> {
  const apiKey = await key();
  if (!apiKey) { 
    console.warn("[twelve-data] missing TWELVE-DATA-API-KEY"); 
    return null; 
  }
  try {
    const res = await fetch(`${BASE}/quote?symbol=${encodeURIComponent(symbol.toUpperCase())}&apikey=${apiKey}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) { 
      console.error("[twelve-data] quote HTTP", res.status); 
      return null; 
    }
    const d = await res.json();
    if (d.status === "error") { 
      console.error("[twelve-data] error:", d.message); 
      return null; 
    }
    return {
      symbol: d.symbol,
      name: d.name,
      exchange: d.exchange,
      currency: d.currency,
      open: parseFloat(d.open ?? "0"),
      high: parseFloat(d.high ?? "0"),
      low: parseFloat(d.low ?? "0"),
      close: parseFloat(d.close ?? "0"),
      volume: parseInt(d.volume ?? "0", 10),
      previous_close: parseFloat(d.previous_close ?? "0"),
      change: parseFloat(d.change ?? "0"),
      percent_change: parseFloat(d.percent_change ?? "0"),
      is_market_open: !!d.is_market_open,
    };
  } catch (err) {
    console.error("[twelve-data] quote fetch failed:", err);
    return null;
  }
}

export interface TDBar { 
  datetime: string; 
  open: number; 
  high: number; 
  low: number; 
  close: number; 
  volume: number; 
}

export async function getTwelveDataTimeSeries(
  symbol: string,
  interval: "1min" | "5min" | "15min" | "30min" | "1h" | "1day" = "1min",
  outputsize = 100,
  opts: { regularHoursOnly?: boolean } = {},
): Promise<TDBar[]> {
  const apiKey = await key();
  if (!apiKey) return [];

  const extendedHours = opts.regularHoursOnly ? "false" : "true";

  try {
    const res = await fetch(
      `${BASE}/time_series?symbol=${encodeURIComponent(symbol.toUpperCase())}&interval=${interval}&outputsize=${Math.min(outputsize, 5000)}&extended_hours=${extendedHours}&apikey=${apiKey}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const d = await res.json();
    if (d.status === "error" || !d.values) return [];
    return d.values.map((v: { datetime: string; open: string; high: string; low: string; close: string; volume: string }) => ({
      datetime: v.datetime,
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
      volume: parseInt(v.volume, 10),
    })).reverse(); // oldest -> newest
  } catch (err) {
    console.error("[twelve-data] time_series failed:", err);
    return [];
  }
}
