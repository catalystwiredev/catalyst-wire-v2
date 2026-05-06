import { getNews } from "@/lib/data/marketaux";
import { getMarketNews } from "@/lib/data/finnhub";
import { NewsClient } from "./NewsClient";

export const revalidate = 120;

export default async function NewsPage() {
  const [mxArticles, fhArticles] = await Promise.all([
    getNews({ limit: 20 }).catch(() => []),
    getMarketNews("general").catch(() => []),
  ]);

  const combined = [
    ...mxArticles.map((a) => ({
      id: a.uuid, title: a.title, summary: a.description, url: a.url,
      source: a.source, publishedAt: a.published_at,
      sentiment: a.sentiment as string, score: a.sentiment_score,
      tickers: a.tickers,
    })),
    ...fhArticles.slice(0, 10).map((a) => ({
      id: String(a.id), title: a.headline, summary: a.summary, url: a.url,
      source: a.source, publishedAt: new Date(a.datetime * 1000).toISOString(),
      sentiment: "neutral", score: 0,
      tickers: a.related ? [a.related] : [],
    })),
  ]
    .filter((a, i, arr) => arr.findIndex(b => b.title === a.title) === i)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 30);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Intelligence Feed</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>News & Market Intelligence</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>AI-scored headlines across stocks, biotech, crypto, earnings, and congressional disclosures.</p>
      </div>
      <NewsClient articles={combined} lockedCount={Math.max(0, combined.length - 6)} />
    </div>
  );
}
