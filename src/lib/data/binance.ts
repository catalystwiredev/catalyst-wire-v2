/**
 * Binance Public REST API — crypto quotes, OHLCV bars, 24h stats.
 * No API key required for public market data.
 * Tier gating will be enforced at the page/component level.
 */
const BASE = "https://api.binance.com/api/v3";

export interface BinanceTicker {
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
  lastPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  openPrice: number;
  count: number;
}

export interface BinanceKline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
}

export interface BinanceOrderBookEntry {
  price: number;
  quantity: number;
}

export interface BinanceOrderBook {
  symbol: string;
  bids: BinanceOrderBookEntry[];
  asks: BinanceOrderBookEntry[];
}

/** 24-hour rolling window ticker statistics */
export async function getBinanceTicker(symbol: string): Promise<BinanceTicker | null> {
  try {
    const res = await fetch(
      `${BASE}/ticker/24hr?symbol=${symbol.toUpperCase()}`,
      { next: { revalidate: 15 } }
    );
    if (!res.ok) return null;
    const d = await res.json();
    return {
      symbol: d.symbol,
      priceChange: parseFloat(d.priceChange),
      priceChangePercent: parseFloat(d.priceChangePercent),
      lastPrice: parseFloat(d.lastPrice),
      highPrice: parseFloat(d.highPrice),
      lowPrice: parseFloat(d.lowPrice),
      volume: parseFloat(d.volume),
      quoteVolume: parseFloat(d.quoteVolume),
      openPrice: parseFloat(d.openPrice),
      count: d.count,
    };
  } catch (err) {
    console.error("[binance] ticker failed:", symbol, err);
    return null;
  }
}

/** Batch 24h tickers (use sparingly) */
export async function getBinanceTickers(symbols?: string[]): Promise<BinanceTicker[]> {
  try {
    const url = symbols?.length
      ? `${BASE}/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols.map(s => s.toUpperCase())))}`
      : `${BASE}/ticker/24hr`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [data];
    return arr.map((d: Record<string, string | number>) => ({
      symbol: d.symbol as string,
      priceChange: parseFloat(d.priceChange as string),
      priceChangePercent: parseFloat(d.priceChangePercent as string),
      lastPrice: parseFloat(d.lastPrice as string),
      highPrice: parseFloat(d.highPrice as string),
      lowPrice: parseFloat(d.lowPrice as string),
      volume: parseFloat(d.volume as string),
      quoteVolume: parseFloat(d.quoteVolume as string),
      openPrice: parseFloat(d.openPrice as string),
      count: d.count as number,
    }));
  } catch (err) {
    console.error("[binance] tickers failed:", err);
    return [];
  }
}

/** OHLCV candlestick bars */
export async function getBinanceKlines(
  symbol: string,
  interval: "1m" | "3m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d" = "1m",
  limit = 100,
): Promise<BinanceKline[]> {
  try {
    const res = await fetch(
      `${BASE}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${Math.min(limit, 1000)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data: unknown[][] = await res.json();
    return data.map(k => ({
      openTime: k[0] as number,
      open: parseFloat(k[1] as string),
      high: parseFloat(k[2] as string),
      low: parseFloat(k[3] as string),
      close: parseFloat(k[4] as string),
      volume: parseFloat(k[5] as string),
      closeTime: k[6] as number,
    }));
  } catch (err) {
    console.error("[binance] klines failed:", symbol, err);
    return [];
  }
}

/** Top-of-book order book */
export async function getBinanceOrderBook(symbol: string, limit: 5 | 10 | 20 | 50 | 100 = 20): Promise<BinanceOrderBook | null> {
  try {
    const res = await fetch(
      `${BASE}/depth?symbol=${symbol.toUpperCase()}&limit=${limit}`,
      { next: { revalidate: 5 } }
    );
    if (!res.ok) return null;
    const d = await res.json();
    return {
      symbol: symbol.toUpperCase(),
      bids: (d.bids as string[][]).map(([price, qty]) => ({ price: parseFloat(price), quantity: parseFloat(qty) })),
      asks: (d.asks as string[][]).map(([price, qty]) => ({ price: parseFloat(price), quantity: parseFloat(qty) })),
    };
  } catch (err) {
    console.error("[binance] order book failed:", symbol, err);
    return null;
  }
}

/** Top USDT pairs by volume */
export async function getTopBinancePairs(limit = 20): Promise<BinanceTicker[]> {
  const all = await getBinanceTickers();
  return all
    .filter(t => t.symbol.endsWith("USDT"))
    .sort((a, b) => b.quoteVolume - a.quoteVolume)
    .slice(0, limit);
}
