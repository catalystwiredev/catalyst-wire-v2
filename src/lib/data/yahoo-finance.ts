/**
 * Yahoo Finance — quotes, options chains with Greeks, insiders, fundamentals.
 * Uses the official `yahoo-finance2` package. NO API key required (Yahoo public endpoints).
 *
 * Tier gating: callers should check `tierAtLeast(session, "alpha")` before exposing
 * options chains or insider data to free users.
 */
import YahooFinance from "yahoo-finance2";

// v3+ requires explicit instantiation. Lazy-init shared client.
let _yf: InstanceType<typeof YahooFinance> | null = null;
function yf(): InstanceType<typeof YahooFinance> {
  if (!_yf) {
    _yf = new YahooFinance();
    // Suppress noisy survey notice. Type is loose because methods vary by version.
    (_yf as unknown as { suppressNotices?: (n: string[]) => void }).suppressNotices?.(["yahooSurvey"]);
  }
  return _yf;
}

export interface YFQuote {
  symbol:        string;
  shortName:     string | null;
  regularMarketPrice:         number;
  regularMarketChangePercent: number;
  regularMarketVolume:        number;
  regularMarketDayHigh:       number | null;
  regularMarketDayLow:        number | null;
  marketCap:     number | null;
  currency:      string | null;

  // Extended-hours fields — present when the upstream session is active.
  // Pre-market: ~4 AM – 9:30 AM ET. Post-market: 4 PM – 8 PM ET.
  preMarketPrice:          number | null;
  preMarketChangePercent:  number | null;
  preMarketTime:           string | null;     // ISO 8601
  postMarketPrice:         number | null;
  postMarketChangePercent: number | null;
  postMarketTime:          string | null;
}

function asISO(d: unknown): string | null {
  if (d instanceof Date) return d.toISOString();
  if (typeof d === "string") return d;
  return null;
}

export async function getYahooQuote(symbol: string): Promise<YFQuote | null> {
  try {
    const q = await yf().quote(symbol.toUpperCase());
    if (!q) return null;
    return {
      symbol:    q.symbol,
      shortName: q.shortName ?? null,
      regularMarketPrice:         q.regularMarketPrice         ?? 0,
      regularMarketChangePercent: q.regularMarketChangePercent ?? 0,
      regularMarketVolume:        q.regularMarketVolume        ?? 0,
      regularMarketDayHigh:       q.regularMarketDayHigh       ?? null,
      regularMarketDayLow:        q.regularMarketDayLow        ?? null,
      marketCap:                  q.marketCap                  ?? null,
      currency:                   q.currency                   ?? null,
      preMarketPrice:             q.preMarketPrice             ?? null,
      preMarketChangePercent:     q.preMarketChangePercent     ?? null,
      preMarketTime:              asISO(q.preMarketTime),
      postMarketPrice:            q.postMarketPrice            ?? null,
      postMarketChangePercent:    q.postMarketChangePercent    ?? null,
      postMarketTime:             asISO(q.postMarketTime),
    };
  } catch (err) {
    console.error("[yahoo-finance] quote failed:", symbol, err);
    return null;
  }
}

/**
 * Cross-session bar history including pre-market and after-hours candles.
 * Use this as a richer alternative to Alpaca's IEX feed for the chart page.
 *
 * @param interval  "1m" | "2m" | "5m" | "15m" | "30m" | "1h" | "1d" (Yahoo enums)
 * @param period1   start (Date or unix seconds) — defaults to 24h ago
 * @param period2   end   (Date or unix seconds) — defaults to now
 */
export async function getYahooBars(symbol: string, opts: {
  interval?: "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "1h" | "1d";
  period1?:  Date | number;
  period2?:  Date | number;
} = {}): Promise<{ t: string; o: number; h: number; l: number; c: number; v: number }[]> {
  const interval = opts.interval ?? "1m";
  const period2  = opts.period2  ?? new Date();
  const period1  = opts.period1  ?? new Date(Date.now() - 24 * 60 * 60_000);

  try {
    // yahoo-finance2 chart() returns quotes (regular + pre/post when includePrePost=true)
    const r = await yf().chart(symbol.toUpperCase(), { period1, period2, interval, includePrePost: true });
    const quotes = r?.quotes ?? [];
    return quotes
      .filter(q => q.open != null && q.high != null && q.low != null && q.close != null)
      .map(q => ({
        t: q.date instanceof Date ? q.date.toISOString() : String(q.date),
        o: Number(q.open),
        h: Number(q.high),
        l: Number(q.low),
        c: Number(q.close),
        v: Number(q.volume ?? 0),
      }));
  } catch (err) {
    console.error("[yahoo-finance] bars failed:", symbol, err);
    return [];
  }
}

export interface YFOptionContract {
  contractSymbol:    string;
  strike:            number;
  lastPrice:         number;
  bid:               number;
  ask:               number;
  volume:            number;
  openInterest:      number;
  impliedVolatility: number;
  inTheMoney:        boolean;
  expiration:        string;
}

export interface YFOptionChain {
  symbol:      string;
  expiration:  string;
  underlyingPrice: number;
  calls:       YFOptionContract[];
  puts:        YFOptionContract[];
}

export async function getYahooOptionChain(symbol: string, expirationISO?: string): Promise<YFOptionChain | null> {
  try {
    const opts: { date?: Date } = {};
    if (expirationISO) opts.date = new Date(expirationISO);
    const chain = await yf().options(symbol.toUpperCase(), opts);
    if (!chain || !chain.options?.[0]) return null;

    const o = chain.options[0];
    const expISO = o.expirationDate instanceof Date ? o.expirationDate.toISOString() : new Date().toISOString();
    const map = (c: { contractSymbol?: string; strike?: number; lastPrice?: number; bid?: number; ask?: number; volume?: number; openInterest?: number; impliedVolatility?: number; inTheMoney?: boolean }): YFOptionContract => ({
      contractSymbol:    c.contractSymbol ?? "",
      strike:            c.strike ?? 0,
      lastPrice:         c.lastPrice ?? 0,
      bid:               c.bid ?? 0,
      ask:               c.ask ?? 0,
      volume:            c.volume ?? 0,
      openInterest:      c.openInterest ?? 0,
      impliedVolatility: c.impliedVolatility ?? 0,
      inTheMoney:        c.inTheMoney ?? false,
      expiration:        expISO,
    });

    return {
      symbol:           symbol.toUpperCase(),
      expiration:       expISO,
      underlyingPrice:  chain.quote?.regularMarketPrice ?? 0,
      calls:            (o.calls ?? []).map(map),
      puts:             (o.puts  ?? []).map(map),
    };
  } catch (err) {
    console.error("[yahoo-finance] options failed:", symbol, err);
    return null;
  }
}

export interface YFInsiderTransaction {
  filer:           string;
  relation:        string;
  transactionDate: string;
  transactionType: string;
  shares:          number;
  value:           number | null;
}

export async function getYahooInsiders(symbol: string): Promise<YFInsiderTransaction[]> {
  try {
    const r = await yf().quoteSummary(symbol.toUpperCase(), { modules: ["insiderTransactions"] });
    const txns = r?.insiderTransactions?.transactions ?? [];
    return txns.map((t: { filerName?: string; filerRelation?: string; startDate?: Date | string; transactionText?: string; shares?: number; value?: number | { raw?: number } }) => {
      const date = typeof t.startDate === "string" ? t.startDate : (t.startDate instanceof Date ? t.startDate.toISOString() : "");
      const val = typeof t.value === "object" ? t.value?.raw : t.value;
      return {
        filer:           t.filerName ?? "",
        relation:        t.filerRelation ?? "",
        transactionDate: date,
        transactionType: t.transactionText ?? "",
        shares:          t.shares ?? 0,
        value:           typeof val === "number" ? val : null,
      };
    });
  } catch (err) {
    console.error("[yahoo-finance] insiders failed:", symbol, err);
    return [];
  }
}

export interface YFFundamentals {
  symbol:           string;
  marketCap:        number | null;
  trailingPE:       number | null;
  forwardPE:        number | null;
  dividendYield:    number | null;
  earningsGrowth:   number | null;
  revenueGrowth:    number | null;
  profitMargins:    number | null;
  beta:             number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow:  number | null;
}

export async function getYahooFundamentals(symbol: string): Promise<YFFundamentals | null> {
  try {
    const r = await yf().quoteSummary(symbol.toUpperCase(), {
      modules: ["summaryDetail", "defaultKeyStatistics", "financialData"],
    });
    const sd = r?.summaryDetail;
    const ks = r?.defaultKeyStatistics;
    const fd = r?.financialData;
    if (!sd && !ks && !fd) return null;
    return {
      symbol:           symbol.toUpperCase(),
      marketCap:        sd?.marketCap        ?? null,
      trailingPE:       sd?.trailingPE       ?? null,
      forwardPE:        sd?.forwardPE        ?? null,
      dividendYield:    sd?.dividendYield    ?? null,
      earningsGrowth:   fd?.earningsGrowth   ?? null,
      revenueGrowth:    fd?.revenueGrowth    ?? null,
      profitMargins:    fd?.profitMargins    ?? null,
      beta:             ks?.beta             ?? null,
      fiftyTwoWeekHigh: sd?.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow:  sd?.fiftyTwoWeekLow  ?? null,
    };
  } catch (err) {
    console.error("[yahoo-finance] fundamentals failed:", symbol, err);
    return null;
  }
}
