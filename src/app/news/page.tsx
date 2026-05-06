import { getNews } from "@/lib/data/marketaux";
import { getMarketNews } from "@/lib/data/finnhub";
import { NewsClient } from "./NewsClient";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Newspaper } from "lucide-react";
import { auth } from "@/lib/auth";

export const revalidate = 120;

export default async function NewsPage() {
  const [session, mxArticles, fhArticles] = await Promise.all([
    auth(),
    getNews({ limit: 20 }).catch(() => []),
    getMarketNews("general").catch(() => []),
  ]);
  const isPremium = (session?.user as any)?.plan !== "free";

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

  const lockedCount = isPremium ? 0 : Math.max(0, combined.length - 6);

  const positiveCount = combined.filter(a => a.sentiment === "positive" || (a.score ?? 0) > 0).length;
  const negativeCount = combined.filter(a => a.sentiment === "negative" || (a.score ?? 0) < 0).length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <ScrollReveal>
        <DataPageHeader
          label="Intelligence Feed · Live"
          labelColor="#0090f0"
          icon={Newspaper}
          iconColor="#0090f0"
          iconGlow="rgba(0,144,240,0.35)"
          title="News & Market Intelligence"
          description="AI-scored headlines across stocks, biotech, crypto, earnings, and congressional disclosures — from Marketaux and Finnhub in real time."
          stats={[
            { label:"Total Articles",  value: combined.length,  color:"#0090f0" },
            { label:"Bullish",         value: positiveCount,    color:"#00e676" },
            { label:"Bearish",         value: negativeCount,    color:"#ff4d4d" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock full feed"
        />
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <NewsClient articles={combined} lockedCount={lockedCount} />
      </ScrollReveal>
    </div>
  );
}
