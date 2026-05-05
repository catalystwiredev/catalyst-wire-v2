import Link from "next/link";
import { ScanLine, TrendingUp, Volume2, Zap, ArrowRight, Lock, Star } from "lucide-react";

const SCANNERS = [
  {
    id: "momentum", icon: TrendingUp, label: "Momentum Scanner", badge: "LIVE", badgeColor: "var(--bull)",
    desc: "Stocks with accelerating price + volume divergence from 20-day baseline. Ranked by momentum score.",
    cols: ["Ticker", "Price", "% Change", "Volume Surge", "Momentum Score", "Catalyst"],
    rows: [
      { ticker:"NVDA", price:"$892.40", chg:"+4.2%", vol:"3.8x avg", score:94, cat:"Earnings Beat", bull:true },
      { ticker:"MRNA", price:"$71.20",  chg:"+7.1%", vol:"6.2x avg", score:91, cat:"FDA Decision",  bull:true },
      { ticker:"AAPL", price:"$196.50", chg:"+1.8%", vol:"1.9x avg", score:78, cat:"Insider Buy",   bull:true },
      { ticker:"META", price:"$488.30", chg:"+3.3%", vol:"2.7x avg", score:85, cat:"Guidance Raise", bull:true },
    ],
    premium: false,
  },
  {
    id: "volume", icon: Volume2, label: "Volume Spike Detector", badge: "ALPHA", badgeColor: "var(--accent)",
    desc: "Real-time detection of unusual volume surges (5x+ above 30-day average) before price confirmation.",
    cols: ["Ticker", "Price", "Volume", "vs Average", "Score", "Status"],
    rows: [],
    premium: true,
  },
  {
    id: "catalyst", icon: Zap, label: "Catalyst Velocity Scanner", badge: "ALPHA", badgeColor: "var(--accent)",
    desc: "Ranks securities by the density and quality of catalysts in a rolling 7-day window.",
    cols: ["Ticker", "Catalysts (7d)", "Avg Score", "Net Sentiment", "Velocity", "Top Event"],
    rows: [],
    premium: true,
  },
];

function ScoreBadge({ s }: { s: number }) {
  const c = s >= 80 ? "var(--bull)" : s >= 60 ? "var(--accent)" : "var(--neutral)";
  return <span style={{ fontFamily: "monospace", fontWeight: 700, color: c, fontSize: 15 }}>{s}</span>;
}

export default function ScannersPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Market Intelligence</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Momentum Scanners</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Real-time and batch scans for momentum, volume, and catalyst concentration across all instruments.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {SCANNERS.map(scanner => {
          const Icon = scanner.icon;
          return (
            <div key={scanner.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, background: `${scanner.badgeColor}18`, border: `1px solid ${scanner.badgeColor}30`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} style={{ color: scanner.badgeColor }}/>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{scanner.label}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: `${scanner.badgeColor}20`, color: scanner.badgeColor, border: `1px solid ${scanner.badgeColor}40` }}>{scanner.badge}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{scanner.desc}</p>
                  </div>
                </div>
                {scanner.premium && (
                  <Link href="/pricing" style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "#fff", padding: "7px 16px", borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>
                    <Star size={12}/> Unlock
                  </Link>
                )}
              </div>

              {scanner.premium ? (
                <div style={{ padding: "48px 24px", textAlign: "center", position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <Lock size={22} style={{ color: "var(--accent)" }}/>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Alpha plan required</div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 340, lineHeight: 1.6 }}>Upgrade to Alpha to access real-time volume spike detection, catalyst velocity rankings, and all premium scanners.</p>
                    <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "#fff", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", marginTop: 4 }}>
                      View plans <ArrowRight size={13}/>
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        {scanner.cols.map(c => (
                          <th key={c} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scanner.rows.map((row: any, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>${row.ticker}</td>
                          <td style={{ padding: "10px 16px" }}>{row.price}</td>
                          <td style={{ padding: "10px 16px", color: row.bull ? "var(--bull)" : "var(--bear)", fontWeight: 600 }}>{row.chg}</td>
                          <td style={{ padding: "10px 16px", color: "var(--text-secondary)" }}>{row.vol}</td>
                          <td style={{ padding: "10px 16px" }}><ScoreBadge s={row.score}/></td>
                          <td style={{ padding: "10px 16px", color: "var(--text-secondary)" }}>{row.cat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
