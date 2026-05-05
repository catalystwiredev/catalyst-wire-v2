"use client";

interface Article {
  id: string; title: string; url: string;
  source: string; sentiment: string; score: number; tickers: string[];
}

function SentimentBadge({ s }: { s: string }) {
  const isBull = s === "positive" || s === "bull";
  const isBear = s === "negative" || s === "bear";
  const c = isBull ? "var(--bull)" : isBear ? "var(--bear)" : "var(--neutral)";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, color: c, background: `${c}18`, border: `1px solid ${c}40` }}>
      {isBull ? "BULLISH" : isBear ? "BEARISH" : "NEUTRAL"}
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

export function NewsCard({ item, date }: { item: Article; date: string }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      <div
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start", transition: "border-color 0.15s", marginBottom: 2 }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", fontSize: 13, minWidth: 52, paddingTop: 1 }}>
          {item.tickers[0] ? `$${item.tickers[0]}` : "MKT"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <SentimentBadge s={item.sentiment}/>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{date}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {item.source}</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, color: "var(--text-primary)", margin: 0 }}>{item.title}</p>
        </div>
        <ScoreBadge score={item.score}/>
      </div>
    </a>
  );
}
