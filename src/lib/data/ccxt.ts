/**
 * CCXT — unified REST API across 100+ crypto exchanges.
 * No API key required for public market data.
 * Tier gating will be enforced at the page/component level.
 */
export const runtime = "nodejs";

export type SupportedExchange =
  | "binance"
  | "coinbase"
  | "kraken"
  | "okx"
  | "bybit"
  | "kucoin"
  | "gate"
  | "mexc";

export interface CCXTTicker {
  symbol: string;
  exchange: string;
  last: number;
  bid: number;
  ask: number;
  high: number;
  low: number;
  volume: number;
  quoteVolume: number;
  percentage: number;
  timestamp: number;
}

export interface CCXTCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CCXTOrderBookLevel {
  price: number;
  amount: number;
}

export interface CCXTOrderBook {
  symbol: string;
  exchange: string;
  bids: CCXTOrderBookLevel[];
  asks: CCXTOrderBookLevel[];
  timestamp: number;
}

// Lazy exchange instance cache
const exchangeCache = new Map<string, unknown>();

async function getExchange(name: SupportedExchange) {
  if (exchangeCache.has(name)) return exchangeCache.get(name);

  const ccxt = await import("ccxt");
  const ExchangeClass = (ccxt as unknown as Record<string, new () => unknown>)[name];
  if (!ExchangeClass) throw new Error(`[ccxt] Unknown exchange: ${name}`);

  const instance = new ExchangeClass();
  exchangeCache.set(name, instance);
  return instance;
}

export async function getCCXTTicker(exchange: SupportedExchange, symbol: string): Promise<CCXTTicker | null> {
  try {
    const ex = await getExchange(exchange) as any;
    const t = await ex.fetchTicker(symbol);
    return {
      symbol: t.symbol,
      exchange,
      last: t.last,
      bid: t.bid,
      ask: t.ask,
      high: t.high,
      low: t.low,
      volume: t.baseVolume,
      quoteVolume: t.quoteVolume,
      percentage: t.percentage,
      timestamp: t.timestamp,
    };
  } catch (err) {
    console.error(`[ccxt] ticker failed ${exchange}/${symbol}:`, err);
    return null;
  }
}

export async function getCCXTCandles(
  exchange: SupportedExchange,
  symbol: string,
  interval: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" = "1h",
  limit = 100,
): Promise<CCXTCandle[]> {
  try {
    const ex = await getExchange(exchange) as any;
    const ohlcv = await ex.fetchOHLCV(symbol, interval, undefined, limit);
    return ohlcv.map(([timestamp, open, high, low, close, volume]: number[]) => ({
      timestamp, open, high, low, close, volume,
    }));
  } catch (err) {
    console.error(`[ccxt] candles failed ${exchange}/${symbol}:`, err);
    return [];
  }
}

export async function getCCXTOrderBook(
  exchange: SupportedExchange,
  symbol: string,
  limit = 20,
): Promise<CCXTOrderBook | null> {
  try {
    const ex = await getExchange(exchange) as any;
    const book = await ex.fetchOrderBook(symbol, limit);
    return {
      symbol,
      exchange,
      bids: book.bids.map(([price, amount]: number[]) => ({ price, amount })),
      asks: book.asks.map(([price, amount]: number[]) => ({ price, amount })),
      timestamp: book.timestamp,
    };
  } catch (err) {
    console.error(`[ccxt] order book failed ${exchange}/${symbol}:`, err);
    return null;
  }
}

export async function getCCXTArbitrageSnapshot(
  symbol: string,
  exchanges: SupportedExchange[] = ["binance", "kraken", "coinbase"],
): Promise<CCXTTicker[]> {
  const results = await Promise.allSettled(
    exchanges.map(ex => getCCXTTicker(ex, symbol))
  );
  return results
    .filter((r): r is PromiseFulfilledResult<CCXTTicker> => r.status === "fulfilled" && r.value !== null)
    .map(r => r.value);
}
