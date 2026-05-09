import { NextRequest, NextResponse } from "next/server";
import { getBinanceTicker, getBinanceKlines, getTopBinancePairs } from "@/lib/data/binance";
import { getCCXTTicker, getCCXTCandles, getCCXTArbitrageSnapshot, type SupportedExchange } from "@/lib/data/ccxt";

export const runtime = "nodejs";
export const revalidate = 5;

/**
 * Crypto data endpoint — Binance REST + CCXT multi-exchange.
 *
 * Query params:
 *   symbol    Binance symbol (e.g. "BTCUSDT") or CCXT unified (e.g. "BTC/USDT")
 *   exchange  ccxt exchange id — triggers CCXT path (default: binance direct)
 *   mode      "ticker" | "candles" | "top" | "arbitrage" (default: "ticker")
 *   interval  Candle interval (default: "1h")
 *   limit     Number of candles / top pairs (default: 50)
 *   exchanges Comma-separated list for arbitrage mode (default: "binance,kraken,coinbase")
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol   = searchParams.get("symbol") ?? "BTCUSDT";
  const exchange = searchParams.get("exchange") as SupportedExchange | null;
  const mode     = searchParams.get("mode") ?? "ticker";
  const interval = (searchParams.get("interval") ?? "1h") as "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
  const limit    = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 500);

  try {
    if (mode === "top") {
      const pairs = await getTopBinancePairs(limit);
      return NextResponse.json({ pairs });
    }

    if (mode === "arbitrage") {
      const exchanges = (searchParams.get("exchanges") ?? "binance,kraken,coinbase")
        .split(",")
        .map(e => e.trim()) as SupportedExchange[];
      const ccxtSymbol = symbol.includes("/") ? symbol : `${symbol.slice(0, -4)}/${symbol.slice(-4)}`;
      const snapshot = await getCCXTArbitrageSnapshot(ccxtSymbol, exchanges);
      return NextResponse.json({ symbol: ccxtSymbol, exchanges: snapshot });
    }

    if (exchange) {
      // CCXT path — unified symbol format required ("BTC/USDT")
      const ccxtSymbol = symbol.includes("/") ? symbol : `${symbol.slice(0, -4)}/${symbol.slice(-4)}`;

      if (mode === "candles") {
        const candles = await getCCXTCandles(exchange, ccxtSymbol, interval, limit);
        return NextResponse.json({ symbol: ccxtSymbol, exchange, interval, candles });
      }

      const ticker = await getCCXTTicker(exchange, ccxtSymbol);
      if (!ticker) return NextResponse.json({ error: "Symbol not found", symbol: ccxtSymbol, exchange }, { status: 404 });
      return NextResponse.json(ticker);
    }

    // Default: Binance direct path
    if (mode === "candles") {
      const candles = await getBinanceKlines(symbol, interval, limit);
      return NextResponse.json({ symbol, interval, candles });
    }

    const ticker = await getBinanceTicker(symbol);
    if (!ticker) return NextResponse.json({ error: "Symbol not found", symbol }, { status: 404 });
    return NextResponse.json(ticker);

  } catch (err) {
    console.error("[api/crypto]", err);
    return NextResponse.json({ error: "Crypto data unavailable" }, { status: 500 });
  }
}
