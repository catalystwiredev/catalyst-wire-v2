/**
 * Marketaux News API — financial news with AI sentiment scoring
 * Secret: MARKETAUX-API-KEY (from Azure Key Vault)
 * Docs: https://www.marketaux.com/documentation
 */
import { getSecret } from "../azure-secrets";

const BASE = "https://api.marketaux.com/v1";

async function key(): Promise<string> {
  return await getSecret("MARKETAUX-API-KEY");
}

export interface MarketauxArticle {
  uuid: string;
  title: string;
  description: string;
  url: string;
  image_url: string | null;
  published_at: string;
  source: string;
  sentiment: "positive" | "negative" | "neutral";
  sentiment_score: number;
  tickers: string[];
  entities: { name: string; type: string; sentiment_score: number }[];
}

/** Get financial news */
export async function getNews(opts: {
  symbols?: string[];
  search?: string;
  language?: string;
  limit?: number;
  filterEntities?: boolean;
} = {}): Promise<MarketauxArticle[]> {
  const { symbols, search, language = "en", limit = 10, filterEntities = true } = opts;
  const apiKey = await key();

  const params = new URLSearchParams({
    api_token: apiKey,
    language,
    limit: String(Math.min(limit, 50)),
    filter_entities: String(filterEntities),
    sort: "published_desc",
  });
  if (symbols?.length) params.set("symbols", symbols.join(","));
  if (search) params.set("search", search);

  try {
    const res = await fetch(`${BASE}/news/all?${params.toString()}`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data ?? []).map((a: any) => ({
      uuid: a.uuid,
      title: a.title,
      description: a.description,
      url: a.url,
      image_url: a.image_url ?? null,
      published_at: a.published_at,
      source: a.source,
      sentiment: a.entities?.[0]?.sentiment ?? "neutral",
      sentiment_score: parseFloat(a.entities?.[0]?.sentiment_score ?? "0"),
      tickers: (a.entities ?? []).filter((e: any) => e.type === "equity").map((e: any) => e.symbol).filter(Boolean),
      entities: (a.entities ?? []).map((e: any) => ({ 
        name: e.name, 
        type: e.type, 
        sentiment_score: parseFloat(e.sentiment_score ?? "0") 
      })),
    }));
  } catch (err) {
    console.error("[marketaux] news fetch failed:", err);
    return [];
  }
}

/** Get sentiment aggregate for a specific ticker */
export async function getTickerSentiment(symbol: string, limit = 20): Promise<{ bullishPct: number; bearishPct: number; neutralPct: number; avgScore: number }> {
  const articles = await getNews({ symbols: [symbol], limit }).catch(() => []);
  if (!articles.length) return { bullishPct: 0, bearishPct: 0, neutralPct: 0, avgScore: 0 };

  const bull = articles.filter(a => a.sentiment === "positive").length;
  const bear = articles.filter(a => a.sentiment === "negative").length;
  const neutral = articles.length - bull - bear;

  let totalScore = 0;
  for (const a of articles) {
    totalScore += a.sentiment_score ?? 0;
  }
  const avgScore = totalScore / articles.length;

  return {
    bullishPct: Math.round((bull / articles.length) * 100),
    bearishPct: Math.round((bear / articles.length) * 100),
    neutralPct: Math.round((neutral / articles.length) * 100),
    avgScore: Math.round(avgScore * 100) / 100,
  };
}
