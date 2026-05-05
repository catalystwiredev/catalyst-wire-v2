/**
 * Marketaux News API — financial news with AI sentiment scoring
 * Env: MARKETAUX_API_KEY
 * Docs: https://www.marketaux.com/documentation
 *
 * Free tier: 100 req/day, 3 articles/request
 * Paid tiers give more articles, real-time, and filtering
 */

const BASE = "https://api.marketaux.com/v1";

function key(): string {
  const k = process.env.MARKETAUX_API_KEY;
  if (!k) throw new Error("MARKETAUX_API_KEY not set");
  return k;
}

export interface MarketauxArticle {
  uuid:         string;
  title:        string;
  description:  string;
  url:          string;
  image_url:    string | null;
  published_at: string;
  source:       string;
  sentiment:    "positive" | "negative" | "neutral";
  sentiment_score: number;  // -1 to 1
  tickers:      string[];
  entities:     { name: string; type: string; sentiment_score: number }[];
}

/** Get financial news — optionally filter by tickers or search terms */
export async function getNews(opts: {
  symbols?:    string[];   // e.g. ["AAPL","NVDA"]
  search?:     string;
  language?:   string;
  limit?:      number;
  filterEntities?: boolean;
} = {}): Promise<MarketauxArticle[]> {
  const { symbols, search, language = "en", limit = 10, filterEntities = true } = opts;

  const params = new URLSearchParams({
    api_token:       key(),
    language,
    limit:           String(Math.min(limit, 50)),
    filter_entities: String(filterEntities),
    sort:            "published_desc",
  });
  if (symbols?.length) params.set("symbols", symbols.join(","));
  if (search)          params.set("search",  search);

  const res = await fetch(`${BASE}/news/all?${params.toString()}`, { next: { revalidate: 120 } });
  if (!res.ok) return [];

  const data = await res.json();
  return (data?.data ?? []).map((a: any) => ({
    uuid:            a.uuid,
    title:           a.title,
    description:     a.description,
    url:             a.url,
    image_url:       a.image_url ?? null,
    published_at:    a.published_at,
    source:          a.source,
    sentiment:       a.entities?.[0]?.sentiment ?? "neutral",
    sentiment_score: parseFloat(a.entities?.[0]?.sentiment_score ?? "0"),
    tickers:         (a.entities ?? []).filter((e: any) => e.type === "equity").map((e: any) => e.symbol).filter(Boolean),
    entities:        (a.entities ?? []).map((e: any) => ({ name: e.name, type: e.type, sentiment_score: parseFloat(e.sentiment_score ?? "0") })),
  }));
}

/** Get sentiment aggregate for a specific ticker */
export async function getTickerSentiment(symbol: string, limit = 20): Promise<{ bullishPct: number; bearishPct: number; neutralPct: number; avgScore: number }> {
  const articles = await getNews({ symbols: [symbol], limit }).catch(() => []);
  if (!articles.length) return { bullishPct: 0, bearishPct: 0, neutralPct: 0, avgScore: 0 };

  const bull    = articles.filter(a => a.sentiment === "positive").length;
  const bear    = articles.filter(a => a.sentiment === "negative").length;
  const neutral = articles.length - bull - bear;
  const avgScore = articles.reduce((acc, a) => acc + a.sentiment_score, 0) / articles.length;

  return {
    bullishPct: Math.round((bull    / articles.length) * 100),
    bearishPct: Math.round((bear    / articles.length) * 100),
    neutralPct: Math.round((neutral / articles.length) * 100),
    avgScore:   Math.round(avgScore * 100) / 100,
  };
}
