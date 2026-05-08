/**
 * NewsAPI.org — real-time global news headlines + full-text article search.
 * Free plan: 100 req/day, last 1 month of articles.
 *
 * Docs: https://newsapi.org/docs
 * Key:  process.env.NEWSAPI_ORG_API_KEY (Key Vault: NEWSAPI-ORG-API-KEY)
 */

const BASE = "https://newsapi.org/v2";

function key(): string {
  return process.env.NEWSAPI_ORG_API_KEY ?? "";
}

export interface NewsArticle {
  source:      string;
  author:      string | null;
  title:       string;
  description: string | null;
  url:         string;
  urlToImage:  string | null;
  publishedAt: string;
  content:     string | null;
}

interface RawArticle {
  source?: { name?: string };
  author?: string | null;
  title?: string;
  description?: string | null;
  url?: string;
  urlToImage?: string | null;
  publishedAt?: string;
  content?: string | null;
}

function map(a: RawArticle): NewsArticle {
  return {
    source:      a.source?.name ?? "Unknown",
    author:      a.author ?? null,
    title:       a.title ?? "",
    description: a.description ?? null,
    url:         a.url ?? "",
    urlToImage:  a.urlToImage ?? null,
    publishedAt: a.publishedAt ?? "",
    content:     a.content ?? null,
  };
}

export async function getTopHeadlines(opts: {
  category?: "business" | "technology" | "general" | "health" | "science" | "sports" | "entertainment";
  country?:  string;
  pageSize?: number;
} = {}): Promise<NewsArticle[]> {
  const { category = "business", country = "us", pageSize = 20 } = opts;
  const apiKey = key();
  if (!apiKey) { console.warn("[newsapi] missing NEWSAPI_ORG_API_KEY"); return []; }

  try {
    const url = `${BASE}/top-headlines?country=${country}&category=${category}&pageSize=${Math.min(pageSize, 100)}&apiKey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) { console.error("[newsapi] HTTP", res.status); return []; }
    const d = await res.json() as { articles?: RawArticle[]; status?: string };
    if (d.status !== "ok") return [];
    return (d.articles ?? []).map(map);
  } catch (err) {
    console.error("[newsapi] top-headlines failed:", err);
    return [];
  }
}

export async function searchNews(query: string, opts: {
  pageSize?:  number;
  sortBy?:    "relevancy" | "popularity" | "publishedAt";
  language?:  string;
  from?:      string;
} = {}): Promise<NewsArticle[]> {
  const { pageSize = 20, sortBy = "publishedAt", language = "en", from } = opts;
  const apiKey = key();
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      q:        query,
      pageSize: String(Math.min(pageSize, 100)),
      sortBy,
      language,
      apiKey,
    });
    if (from) params.set("from", from);
    const res = await fetch(`${BASE}/everything?${params}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const d = await res.json() as { articles?: RawArticle[] };
    return (d.articles ?? []).map(map);
  } catch (err) {
    console.error("[newsapi] search failed:", err);
    return [];
  }
}
