/**
 * Tiingo — IEX last-price snapshots, historical EOD bars, fundamentals, news.
 * Free plan: 50 req/hour, 1000 req/day, IEX-only.
 *
 * Docs: https://www.tiingo.com/documentation/general/overview
 * Key:  process.env.TIINGO_API_KEY (Key Vault: TIINGO-API-KEY)
 */

const BASE = "https://api.tiingo.com";

function authHeader(): Record<string, string> {
  const k = process.env.TIINGO_API_KEY ?? "";
  return k ? { Authorization: `Token ${k}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

export interface TiingoIEX {
  ticker:       string;
  timestamp:    string;
  open:         number | null;
  high:         number | null;
  low:          number | null;
  mid:          number | null;
  tngoLast:     number;
  prevClose:    number | null;
  volume:       number | null;
  bidPrice:     number | null;
  askPrice:     number | null;
  bidSize:      number | null;
  askSize:      number | null;
}

export async function getTiingoIEX(symbol: string): Promise<TiingoIEX | null> {
  if (!process.env.TIINGO_API_KEY) { console.warn("[tiingo] missing TIINGO_API_KEY"); return null; }
  try {
    const res = await fetch(`${BASE}/iex/${symbol.toUpperCase()}`, { headers: authHeader(), next: { revalidate: 30 } });
    if (!res.ok) { console.error("[tiingo] iex HTTP", res.status); return null; }
    const arr = await res.json() as TiingoIEX[];
    return arr[0] ?? null;
  } catch (err) {
    console.error("[tiingo] iex failed:", err);
    return null;
  }
}

export interface TiingoIntradayBar {
  date:   string;
  open:   number;
  high:   number;
  low:    number;
  close:  number;
  volume: number;
}

export async function getTiingoIntraday(symbol: string, opts: {
  resampleFreq?:    "1min" | "5min" | "15min" | "30min" | "1hour";
  startDate?:       string;
  endDate?:         string;
  limit?:           number;
  regularHoursOnly?: boolean;
} = {}): Promise<TiingoIntradayBar[]> {
  if (!process.env.TIINGO_API_KEY) return [];
  const { resampleFreq = "1min", startDate, endDate, limit = 100, regularHoursOnly = false } = opts;
  try {
    const params = new URLSearchParams({ resampleFreq });
    if (startDate) params.set("startDate", startDate);
    if (endDate)   params.set("endDate", endDate);
    // Default: include pre-market and after-hours bars; fill gaps for clean charts.
    if (!regularHoursOnly) {
      params.set("afterHours", "true");
      params.set("forceFill",  "true");
    }
    const res = await fetch(`${BASE}/iex/${symbol.toUpperCase()}/prices?${params}`, { headers: authHeader(), next: { revalidate: 60 } });
    if (!res.ok) return [];
    const arr = await res.json() as TiingoIntradayBar[];
    return arr.slice(-Math.min(limit, 5000));
  } catch (err) {
    console.error("[tiingo] intraday failed:", err);
    return [];
  }
}

export interface TiingoFundamentals {
  ticker:        string;
  marketCap:     number | null;
  peRatio:       number | null;
  pbRatio:       number | null;
  trailingPEG1Y: number | null;
}

export async function getTiingoFundamentalsDaily(symbol: string): Promise<TiingoFundamentals | null> {
  if (!process.env.TIINGO_API_KEY) return null;
  try {
    const res = await fetch(`${BASE}/tiingo/fundamentals/${symbol.toUpperCase()}/daily?token=${process.env.TIINGO_API_KEY}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const arr = await res.json() as Array<{ marketCap?: number; peRatio?: number; pbRatio?: number; trailingPEG1Y?: number }>;
    const latest = arr[arr.length - 1];
    if (!latest) return null;
    return {
      ticker:        symbol.toUpperCase(),
      marketCap:     latest.marketCap     ?? null,
      peRatio:       latest.peRatio       ?? null,
      pbRatio:       latest.pbRatio       ?? null,
      trailingPEG1Y: latest.trailingPEG1Y ?? null,
    };
  } catch (err) {
    console.error("[tiingo] fundamentals failed:", err);
    return null;
  }
}
