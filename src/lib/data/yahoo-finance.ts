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
    };
  } catch (err) {
    console.error("[yahoo-finance] quote failed:", symbol, err);
    return null;
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
