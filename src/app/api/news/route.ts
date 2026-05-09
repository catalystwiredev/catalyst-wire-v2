import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/data/marketaux";
import { getMarketNews } from "@/lib/data/finnhub";

export const runtime = "nodejs";
export const revalidate = 10;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols  = searchParams.get("symbols")?.split(",").filter(Boolean) ?? [];
  const category = (searchParams.get("category") ?? "general") as "general" | "crypto" | "forex" | "merger";
  const limit    = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  try {
    const [marketaux, finnhub] = await Promise.allSettled([
      getNews({ symbols: symbols.length ? symbols : undefined, limit }),
      getMarketNews(category),
    ]);

    const mxArticles = marketaux.status === "fulfilled" ? marketaux.value : [];
    const fhArticles = finnhub.status  === "fulfilled" ? finnhub.value  : [];

    const combined = [
      ...mxArticles.map((a) => ({
        id:          a.uuid,
        title:       a.title,
        summary:     a.description,
        url:         a.url,
        image:       a.image_url,
        source:      a.source,
        publishedAt: a.published_at,
        sentiment:   a.sentiment,
        score:       a.sentiment_score,
        tickers:     a.tickers,
        provider:    "marketaux",
      })),
      ...fhArticles.map((a) => ({
        id:          String(a.id),
        title:       a.headline,
        summary:     a.summary,
        url:         a.url,
        image:       a.image || null,
        source:      a.source,
        publishedAt: new Date(a.datetime * 1000).toISOString(),
        sentiment:   "neutral" as const,
        score:       0,
        tickers:     a.related ? [a.related] : [],
        provider:    "finnhub",
      })),
    ]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);

    return NextResponse.json({ articles: combined, count: combined.length });
  } catch (err) {
    console.error("[api/news]", err);
    return NextResponse.json({ articles: [], count: 0, error: "Failed to fetch news" }, { status: 200 });
  }
}
