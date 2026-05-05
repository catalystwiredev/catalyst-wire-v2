import Link from "next/link";
import { Newspaper, TrendingUp, FlaskConical, Bitcoin, Landmark, BarChart2, ExternalLink, Lock, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { id: "all",         label: "All News",         icon: Newspaper },
  { id: "market",      label: "Market",           icon: TrendingUp },
  { id: "biotech",     label: "Biotech / FDA",    icon: FlaskConical },
  { id: "crypto",      label: "Crypto",           icon: Bitcoin },
  { id: "congress",    label: "Congressional",    icon: Landmark },
  { id: "earnings",    label: "Earnings",         icon: BarChart2 },
];

const NEWS = [
  { id:1, cat:"market",   ticker:"SPX",  time:"2m ago",  title:"S&P 500 surges 1.2% on strong jobs data, tech leads recovery", sentiment:"bull", score:82, source:"Reuters",       free:true },
  { id:2, cat:"biotech",  ticker:"MRNA", time:"7m ago",  title:"FDA grants Priority Review to Moderna's next-gen mRNA flu vaccine candidate", sentiment:"bull", score:91, source:"FDA.gov",        free:true },
  { id:3, cat:"earnings", ticker:"NVDA", time:"12m ago", title:"NVIDIA Q1 results beat estimates by 18%; data center revenue up 427% YoY", sentiment:"bull", score:96, source:"NVIDIA IR",     free:true },
  { id:4, cat:"crypto",   ticker:"BTC",  time:"18m ago", title:"Bitcoin ETF inflows hit $842M in single day as institutional demand accelerates", sentiment:"bull", score:78, source:"CoinDesk",     free:true },
  { id:5, cat:"congress", ticker:"LMT",  time:"24m ago", title:"Sen. Tuberville discloses $50K–$100K purchase of Lockheed Martin shares", sentiment:"bull", score:74, source:"SEC EDGAR",     free:false },
  { id:6, cat:"market",   ticker:"TSLA", time:"31m ago", title:"Tesla Cybertruck recall expanded to 46,000 units over accelerator pedal concern", sentiment:"bear", score:71, source:"NHTSA",         free:false },
  { id:7, cat:"biotech",  ticker:"BIIB", time:"38m ago", title:"Biogen Alzheimer's drug shows 35% cognitive decline reduction in Phase 3 trial extension", sentiment:"bull", score:89, source:"NEJM",          free:false },
  { id:8, cat:"earnings", ticker:"AAPL", time:"45m ago", title:"Apple Services revenue hits $24B quarterly record; CEO signals AI hardware supercycle", sentiment:"bull", score:85, source:"Apple IR",      free:false },
  { id:9, cat:"market",   ticker:"GLD",  time:"52m ago", title:"Gold breaks $3,200/oz as central banks accelerate reserve diversification", sentiment:"bull", score:77, source:"Bloomberg",     free:false },
  {id:10, cat:"crypto",   ticker:"ETH",  time:"1h ago",  title:"Ethereum staking yield drops to 3.1% amid validator queue surge post-upgrade", sentiment:"bear", score:62, source:"Etherscan",     free:false },
];

function SentimentBadge({ s }: { s: string }) {
  const c = s === "bull" ? "var(--bull)" : "var(--bear)";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, color: c, background: `${c}18`, border: `1px solid ${c}40` }}>
      {s === "bull" ? "BULLISH" : "BEARISH"}
    </span>
  );
}

export default function NewsPage() {
  const visible = NEWS.filter(n => n.free);
  const locked  = NEWS.filter(n => !n.free);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Intelligence Feed</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>News & Market Intelligence</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>AI-scored headlines across stocks, biotech, crypto, earnings, and congressional disclosures.</p>
      </div>

      {/* Category filter pills (visual only — full interactivity requires upgrade) */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {CATEGORIES.map(({ id, label, icon: Icon }) => (
          <button key={id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, background: id === "all" ? "var(--accent)" : "var(--bg-elevated)", color: id === "all" ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border-medium)", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
            <Icon size={12}/> {label}
          </button>
        ))}
      </div>

      {/* News list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {visible.map(item => (
          <div key={item.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", fontSize: 13, minWidth: 52, paddingTop: 1 }}>${item.ticker}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                <SentimentBadge s={item.sentiment}/>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.time}</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {item.source}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, color: "var(--text-primary)", marginBottom: 0 }}>{item.title}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 18, color: item.score >= 80 ? "var(--bull)" : item.score >= 60 ? "var(--accent)" : "var(--neutral)" }}>{item.score}</div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.06em" }}>AI SCORE</div>
            </div>
          </div>
        ))}

        {/* Locked rows */}
        {locked.map(item => (
          <div key={item.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(6px)", background: "rgba(8,12,20,0.65)", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Lock size={16} style={{ color: "var(--accent)" }}/>
                <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  Upgrade to unlock <ArrowRight size={11}/>
                </Link>
              </div>
            </div>
            <div style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", fontSize: 13, minWidth: 52, paddingTop: 1, filter: "blur(4px)" }}>${item.ticker}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, color: "var(--text-primary)", filter: "blur(4px)" }}>{item.title}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, filter: "blur(4px)" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 18 }}>{item.score}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>Unlock real-time news across all categories with an Alpha plan.</p>
        <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          View plans <ExternalLink size={13}/>
        </Link>
      </div>
    </div>
  );
}
