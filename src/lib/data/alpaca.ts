/**
 * Alpaca Markets — historical bars via raw HTTPS (no SDK, zero runtime deps).
 * Docs: https://docs.alpaca.markets/reference/stockbars
 *
 * Uses ALPACA_KEY_ID + ALPACA_SECRET_KEY env vars. The harvester uses the same creds.
 * Free IEX feed only (`feed=iex`); upgrade to SIP via plan if needed.
 */

const ALPACA_DATA = "https://data.alpaca.markets/v2";

export interface Bar {
  t: string;   // ISO 8601 timestamp
  o: number;   // open
  h: number;   // high
  l: number;   // low
  c: number;   // close
  v: number;   // volume
}

interface AlpacaBarRaw {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  n?: number;
  vw?: number;
}

export async function getStockBars(symbol: string, opts: {
  timeframe?: "1Min" | "5Min" | "15Min" | "1Hour" | "1Day";
  limit?:     number;
  start?:     string;   // ISO 8601
  end?:       string;
} = {}): Promise<Bar[]> {
  const { timeframe = "1Min", limit = 100, start, end } = opts;

  const keyId  = process.env.ALPACA_KEY_ID  ?? "";
  const secret = process.env.ALPACA_SECRET_KEY ?? "";
  if (!keyId || !secret) return [];

  const params = new URLSearchParams({
    symbols:   symbol.toUpperCase(),
    timeframe,
    limit:     String(Math.min(Math.max(limit, 1), 10000)),
    feed:      "iex",
    sort:      "asc",
  });
  if (start) params.set("start", start);
  if (end)   params.set("end", end);

  const url = `${ALPACA_DATA}/stocks/bars?${params}`;

  try {
    const res = await fetch(url, {
      headers: {
        "APCA-API-KEY-ID":     keyId,
        "APCA-API-SECRET-KEY": secret,
        "Accept":              "application/json",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`[alpaca] bars HTTP ${res.status} ${res.statusText} for ${symbol}`);
      return [];
    }
    const data = await res.json() as { bars?: Record<string, AlpacaBarRaw[]> };
    const bars = data.bars?.[symbol.toUpperCase()] ?? [];
    return bars.map(b => ({ t: b.t, o: b.o, h: b.h, l: b.l, c: b.c, v: b.v }));
  } catch (err) {
    console.error("[alpaca] bars fetch failed:", err);
    return [];
  }
}
