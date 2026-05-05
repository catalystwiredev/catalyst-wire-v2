/**
 * Alpha Vantage API — free tier (25 req/day), premium available
 * Sign up: https://www.alphavantage.co/support/#api-key
 * Env: ALPHA_VANTAGE_KEY
 *
 * Free endpoints used:
 *  - TIME_SERIES_INTRADAY (1min, 5min, 15min, 30min, 60min)
 *  - GLOBAL_QUOTE (latest price)
 *  - NEWS_SENTIMENT (news + AI sentiment score per ticker)
 *  - OVERVIEW (company fundamentals)
 *  - EARNINGS (historical EPS, surprise %)
 */

const BASE = "https://www.alphavantage.co/query";

function key(): string {
  const k = process.env.ALPHA_VANTAGE_KEY;
  if (!k) throw new Error("ALPHA_VANTAGE_KEY not set");
  return k;
}

export interface Quote {
  symbol:        string;
  open:          number;
  high:          number;
  low:           number;
  price:         number;
  volume:        number;
  prevClose:     number;
  change:        number;
  changePct:     number;
  latestTradingDay: string;
}

export interface NewsSentimentItem {
  title:       string;
  url:         string;
  publishedAt: string;
  source:      string;
  overallScore: number;   // -1 to 1
  relevanceScore: number; // 0 to 1 for this ticker
  tickers:     string[];
}

export interface EarningsRecord {
  fiscalDateEnding:     string;
  reportedEPS:          number | null;
  estimatedEPS:         number | null;
  surprise:             number | null;
  surprisePct:          number | null;
}

/** Get a real-time quote for a ticker */
export async function getQuote(ticker: string): Promise<Quote | null> {
  const url = `${BASE}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${key()}`;
  const res  = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = await res.json();
  const q = data?.["Global Quote"];
  if (!q || !q["01. symbol"]) return null;
  return {
    symbol:           q["01. symbol"],
    open:             parseFloat(q["02. open"]),
    high:             parseFloat(q["03. high"]),
    low:              parseFloat(q["04. low"]),
    price:            parseFloat(q["05. price"]),
    volume:           parseInt(q["06. volume"], 10),
    prevClose:        parseFloat(q["08. previous close"]),
    change:           parseFloat(q["09. change"]),
    changePct:        parseFloat(q["10. change percent"].replace("%", "")),
    latestTradingDay: q["07. latest trading day"],
  };
}

/** Get AI news sentiment for one or more tickers (free tier: 50 articles) */
export async function getNewsSentiment(tickers: string[], limit = 20): Promise<NewsSentimentItem[]> {
  const tickerStr = tickers.join(",");
  const url = `${BASE}?function=NEWS_SENTIMENT&tickers=${encodeURIComponent(tickerStr)}&limit=${limit}&sort=LATEST&apikey=${key()}`;
  const res  = await fetch(url, { next: { revalidate: 120 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.feed ?? []).map((item: any) => ({
    title:         item.title,
    url:           item.url,
    publishedAt:   item.time_published,
    source:        item.source,
    overallScore:  parseFloat(item.overall_sentiment_score ?? "0"),
    relevanceScore: parseFloat(item.ticker_sentiment?.[0]?.relevance_score ?? "0"),
    tickers:       (item.ticker_sentiment ?? []).map((t: any) => t.ticker),
  }));
}

/** Get historical earnings surprises for a ticker */
export async function getEarnings(ticker: string): Promise<EarningsRecord[]> {
  const url = `${BASE}?function=EARNINGS&symbol=${encodeURIComponent(ticker)}&apikey=${key()}`;
  const res  = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.quarterlyEarnings ?? []).slice(0, 8).map((e: any) => ({
    fiscalDateEnding: e.fiscalDateEnding,
    reportedEPS:      e.reportedEPS     === "None" ? null : parseFloat(e.reportedEPS),
    estimatedEPS:     e.estimatedEPS    === "None" ? null : parseFloat(e.estimatedEPS),
    surprise:         e.surprise        === "None" ? null : parseFloat(e.surprise),
    surprisePct:      e.surprisePercentage === "None" ? null : parseFloat(e.surprisePercentage),
  }));
}

/** Get company overview / fundamentals */
export async function getOverview(ticker: string): Promise<Record<string, string> | null> {
  const url = `${BASE}?function=OVERVIEW&symbol=${encodeURIComponent(ticker)}&apikey=${key()}`;
  const res  = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.Symbol ? data : null;
}
