import Link from "next/link";
import { Newspaper, TrendingUp, FlaskConical, Bitcoin, Landmark, BarChart2, ArrowRight, Lock } from "lucide-react";
import { getNews } from "@/lib/data/marketaux";
import { getMarketNews } from "@/lib/data/finnhub";
import dayjs from "dayjs";
import { NewsCard } from "./NewsCard";

export const revalidate = 120;

const CATEGORIES = [
  { id: "all",     label: "All News",      icon: Newspaper },
  { id: "market",  label: "Market",        icon: TrendingUp },
  { id: "biotech", label: "Biotech / FDA", icon: FlaskConical },
  { id: "crypto",  label: "Crypto",        icon: Bitcoin },
  { id: "congress",label: "Congressional", icon: Landmark },
  { id: "earnings",label: "Earnings",      icon: BarChart2 },
];

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

  const visible = combined.slice(0, 6);
  const locked  = combined.slice(6);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Intelligence Feed</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>News & Market Intelligence</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>AI-scored headlines across stocks, biotech, crypto, earnings, and congressional disclosures.</p>
      </div>

      {/* Category filter row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {CATEGORIES.map(({ id, label, icon: Icon }) => (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: id === "all" ? "var(--accent)" : "var(--bg-elevated)", color: id === "all" ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border-medium)", fontSize: 12, fontWeight: 500 }}>
            <Icon size={12}/> {label}
          </div>
        ))}
      </div>

      {/* Live articles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {visible.map((item) => (
          <NewsCard key={item.id} item={item} date={dayjs(item.publishedAt).format("MMM D")}/>
        ))}

        {locked.length > 0 && (
          <div style={{ position: "relative" }}>
            {locked.slice(0, 8).map((item) => (
              <div key={item.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 2, filter: "blur(2px)", pointerEvents: "none", userSelect: "none" }}>
                <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", fontSize: 13, minWidth: 52 }}>
                  {item.tickers[0] ? `$${item.tickers[0]}` : "MKT"}
                </div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>{item.title}</p>
              </div>
            ))}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, var(--bg-base) 60%)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 12, padding: "18px 28px", textAlign: "center" }}>
                <Lock size={18} style={{ color: "var(--accent)" }}/>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{locked.length} more articles available with Alpha</p>
                <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "#fff", padding: "8px 18px", borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  Upgrade to Alpha <ArrowRight size={12}/>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
