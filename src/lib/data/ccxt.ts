/**
 * CCXT — unified REST API across 100+ crypto exchanges.
 * Covers Binance, Coinbase, Kraken, OKX, Bybit, and more.
 * No API key required for public market data (quotes, OHLCV, order books).
 *
 * Docs: https://docs.ccxt.com
 * Note: always run in Node.js runtime (not edge) — CCXT is a heavy CommonJS module.
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
  symbol:       string;
  exchange:     string;
  last:         number;
  bid:          number;
  ask:          number;
  high:         number;
  low:          number;
  volume:       number;
  quoteVolume:  number;
  percentage:   number;
  timestamp:    number;
}

export interface CCXTCandle {
  timestamp: number;
  open:      number;
  high:      number;
  low:       number;
  close:     number;
  volume:    number;
}

export interface CCXTOrderBookLevel {
  price:    number;
  amount:   number;
}

export interface CCXTOrderBook {
  symbol:   string;
  exchange: string;
  bids:     CCXTOrderBookLevel[];
  asks:     CCXTOrderBookLevel[];
  timestamp: number;
}

// Lazy exchange instance cache — avoids re-creating clients on every request.
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

type CCXTExchangeInstance = {
  fetchTicker: (symbol: string) => Promise<{
    symbol: string; last: number; bid: number; ask: number;
    high: number; low: number; baseVolume: number; quoteVolume: number;
    percentage: number; timestamp: number;
  }>;
  fetchOHLCV: (symbol: string, interval: string, since?: number, limit?: number) => Promise<number[][]>;
  fetchOrderBook: (symbol: string, limit?: number) => Promise<{
    bids: number[][]; asks: number[][]; timestamp: number;
  }>;
  loadMarkets: () => Promise<unknown>;
  markets: Record<string, unknown>;
};

/**
 * Real-time ticker for any symbol on any supported exchange.
 * @param exchange  Exchange id (e.g. "binance")
 * @param symbol    Unified CCXT symbol (e.g. "BTC/USDT")
 */
export async function getCCXTTicker(exchange: SupportedExchange, symbol: string): Promise<CCXTTicker | null> {
  try {
    const ex = await getExchange(exchange) as CCXTExchangeInstance;
    const t = await ex.fetchTicker(symbol);
    return {
      symbol:      t.symbol,
      exchange,
      last:        t.last,
      bid:         t.bid,
      ask:         t.ask,
      high:        t.high,
      low:         t.low,
      volume:      t.baseVolume,
      quoteVolume: t.quoteVolume,
      percentage:  t.percentage,
      timestamp:   t.timestamp,
    };
  } catch (err) {
    console.error(`[ccxt] ticker failed ${exchange}/${symbol}:`, err);
    return null;
  }
}

/**
 * OHLCV candlestick history.
 * @param interval  CCXT timeframe string: "1m"|"5m"|"15m"|"1h"|"4h"|"1d"
 */
export async function getCCXTCandles(
  exchange: SupportedExchange,
  symbol: string,
  interval: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" = "1h",
  limit = 100,
): Promise<CCXTCandle[]> {
  try {
    const ex = await getExchange(exchange) as CCXTExchangeInstance;
    const ohlcv = await ex.fetchOHLCV(symbol, interval, undefined, limit);
    return ohlcv.map(([timestamp, open, high, low, close, volume]) => ({
      timestamp, open, high, low, close, volume,
    }));
  } catch (err) {
    console.error(`[ccxt] candles failed ${exchange}/${symbol}:`, err);
    return [];
  }
}

/** Order book snapshot (bids + asks). */
export async function getCCXTOrderBook(
  exchange: SupportedExchange,
  symbol: string,
  limit = 20,
): Promise<CCXTOrderBook | null> {
  try {
    const ex = await getExchange(exchange) as CCXTExchangeInstance;
    const book = await ex.fetchOrderBook(symbol, limit);
    return {
      symbol,
      exchange,
      bids: book.bids.map(([price, amount]) => ({ price, amount })),
      asks: book.asks.map(([price, amount]) => ({ price, amount })),
      timestamp: book.timestamp,
    };
  } catch (err) {
    console.error(`[ccxt] order book failed ${exchange}/${symbol}:`, err);
    return null;
  }
}

/**
 * Compare the same symbol across multiple exchanges — useful for spotting
 * price discrepancies and spread arbitrage opportunities.
 */
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
