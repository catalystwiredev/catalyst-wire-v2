import Link from "next/link";
import { Newspaper, TrendingUp, FlaskConical, Bitcoin, Landmark, BarChart2, ExternalLink, Lock, ArrowRight } from "lucide-react";
import { getNews } from "@/lib/data/marketaux";
import { getMarketNews } from "@/lib/data/finnhub";
import dayjs from "dayjs";

export const revalidate = 120;

const CATEGORIES = [
  { id: "all",    label: "All News",      icon: Newspaper },
  { id: "market", label: "Market",        icon: TrendingUp },
  { id: "biotech",label: "Biotech / FDA", icon: FlaskConical },
  { id: "crypto", label: "Crypto",        icon: Bitcoin },
  { id: "congress",label:"Congressional", icon: Landmark },
  { id: "earnings",label:"Earnings",      icon: BarChart2 },
];

function SentimentBadge({ s }: { s: string }) {
  const isBull = s === "positive" || s === "bull";
  const isBear = s === "negative" || s === "bear";
  const c = isBull ? "var(--bull)" : isBear ? "var(--bear)" : "var(--neutral)";
  const label = isBull ? "BULLISH" : isBear ? "BEARISH" : "NEUTRAL";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, color: c, background: `${c}18`, border: `1px solid ${c}40` }}>
      {label}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const display = Math.round(Math.abs(score) * 100);
  const c = display >= 70 ? "var(--bull)" : display >= 40 ? "var(--accent)" : "var(--neutral)";
  return (
    <div style={{ textAlign: "right", flexShrink: 0 }}>
      <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 18, color: c }}>{display}</div>
      <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.06em" }}>AI SCORE</div>
    </div>
  );
}

export default async function NewsPage() {
  const [mxArticles, fhArticles] = await Promise.all([
    getNews({ limit: 20 }).catch(() => []),
    getMarketNews("general").catch(() => []),
  ]);

  type Article = {
    id: string; title: string; summary: string; url: string;
    source: string; publishedAt: string; sentiment: string;
    score: number; tickers: string[];
  };

  const combined: Article[] = [
    ...mxArticles.map((a) => ({
      id: a.uuid, title: a.title, summary: a.description, url: a.url,
      source: a.source, publishedAt: a.published_at,
      sentiment: a.sentiment, score: a.sentiment_score,
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

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {CATEGORIES.map(({ id, label, icon: Icon }) => (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: id === "all" ? "var(--accent)" : "var(--bg-elevated)", color: id === "all" ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border-medium)", fontSize: 12, fontWeight: 500 }}>
            <Icon size={12}/> {label}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {visible.map((item) => (
          <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start", transition: "border-color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", fontSize: 13, minWidth: 52, paddingTop: 1 }}>
                {item.tickers[0] ? `$${item.tickers[0]}` : "MKT"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                  <SentimentBadge s={item.sentiment}/>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{dayjs(item.publishedAt).fromNow?.() ?? dayjs(item.publishedAt).format("MMM D")}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {item.source}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, color: "var(--text-primary)", marginBottom: 0 }}>{item.title}</p>
              </div>
              <ScoreBadge score={item.score}/>
            </div>
          </a>
        ))}

        {locked.length > 0 && (
          <div style={{ position: "relative" }}>
            {locked.slice(0, 8).map((item) => (
              <div key={item.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 2, filter: "blur(2px)", pointerEvents: "none", userSelect: "none" }}>
                <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", fontSize: 13, minWidth: 52 }}>
                  {item.tickers[0] ? `$${item.tickers[0]}` : "MKT"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{item.title}</p>
                </div>
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

      {!locked.length && (
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>Unlock real-time news across all categories with an Alpha plan.</p>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            View plans <ExternalLink size={13}/>
          </Link>
        </div>
      )}
    </div>
  );
}
