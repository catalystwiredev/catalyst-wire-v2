import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight, Lock } from "lucide-react";

const THEMES = [
  {
    id:"ai",        label:"Artificial Intelligence",   pct:"+34.2%", dir:"up",  score:94,
    tickers:["NVDA","MSFT","GOOG","META","AMD","PLTR","AI","SNOW"],
    desc:"Semiconductor, cloud, and software companies driving the AI infrastructure buildout.",
    free:true,
  },
  {
    id:"biotech",   label:"Biotech & Genomics",        pct:"+18.7%", dir:"up",  score:82,
    tickers:["MRNA","BIIB","REGN","VRTX","ILMN","CRSP","BEAM","EDIT"],
    desc:"Clinical-stage and commercial biotech with upcoming catalysts and high conviction AI scores.",
    free:true,
  },
  {
    id:"defense",   label:"Defense & Aerospace",       pct:"+22.1%", dir:"up",  score:87,
    tickers:["LMT","RTX","NOC","GD","BA","HII","LHX","KTOS"],
    desc:"Defense contractors benefiting from increased global military spending cycles.",
    free:true,
  },
  {
    id:"ev",        label:"Electric Vehicles",          pct:"-12.4%", dir:"down", score:58,
    tickers:["TSLA","RIVN","LCID","NIO","LI","XPEV","FSR","NKLA"],
    desc:"EV manufacturers navigating demand slowdown and competitive margin compression.",
    free:false,
  },
  {
    id:"energy",    label:"Renewable Energy",           pct:"+9.3%",  dir:"up",  score:71,
    tickers:["NEE","ENPH","SEDG","FSLR","RUN","PLUG","BE","SPWR"],
    desc:"Solar, wind, and hydrogen companies tied to IRA incentive funding cycles.",
    free:false,
  },
  {
    id:"crypto",    label:"Crypto-Adjacent Equities",   pct:"+41.8%", dir:"up",  score:89,
    tickers:["COIN","MARA","RIOT","MSTR","CLSK","HUT","BTBT","BTDR"],
    desc:"Public equities with direct bitcoin treasury or mining exposure.",
    free:false,
  },
  {
    id:"cyber",     label:"Cybersecurity",              pct:"+16.5%", dir:"up",  score:80,
    tickers:["CRWD","PANW","ZS","FTNT","S","OKTA","QLYS","TENB"],
    desc:"Cloud-native security platforms with strong NRR and expanding TAM from AI threat vectors.",
    free:false,
  },
  {
    id:"space",     label:"Space & Satellite",          pct:"+28.3%", dir:"up",  score:83,
    tickers:["SPCE","RKLB","ASTS","LUNR","ACHR","JOBY","LILM","KTOS"],
    desc:"Commercial launch, satellite broadband, and advanced air mobility.",
    free:false,
  },
];

const PERIOD_LABELS = ["1W","1M","3M","YTD","1Y"];

export default function ThemesPage() {
  const visible = THEMES.filter(t => t.free);
  const locked  = THEMES.filter(t => !t.free);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Market Intelligence</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Stock Themes & Rankings</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Curated baskets of securities grouped by sector theme. Ranked by AI momentum score.</p>
      </div>

      {/* Period selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {PERIOD_LABELS.map((p, i) => (
          <button key={p} style={{ padding: "5px 14px", borderRadius: 6, background: i === 2 ? "var(--accent)" : "var(--bg-elevated)", color: i === 2 ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border-medium)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{p}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
        {visible.map(theme => (
          <ThemeCard key={theme.id} theme={theme}/>
        ))}
        {locked.map(theme => (
          <div key={theme.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 22, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(6px)", background: "rgba(8,12,20,0.7)", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Lock size={18} style={{ color: "var(--accent)" }}/>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{theme.label}</div>
                <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  Unlock with Alpha <ArrowRight size={11}/>
                </Link>
              </div>
            </div>
            <ThemeCard theme={theme}/>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>Unlock all {locked.length + visible.length} themes with an Alpha plan.</p>
        <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          View plans <ArrowRight size={13}/>
        </Link>
      </div>
    </div>
  );
}

function ThemeCard({ theme }: { theme: typeof THEMES[0] }) {
  const isUp = theme.dir === "up";
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{theme.label}</div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{theme.desc}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", color: isUp ? "var(--bull)" : "var(--bear)", fontWeight: 700, fontSize: 15, fontFamily: "monospace" }}>
            {isUp ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {theme.pct}
          </div>
          <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.06em", marginTop: 2 }}>3M RETURN</div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
        {theme.tickers.map(t => (
          <span key={t} style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, padding: "2px 8px", background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", borderRadius: 5, color: "var(--accent)" }}>${t}</span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>AI Momentum Score</div>
        <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 18, color: theme.score >= 80 ? "var(--bull)" : theme.score >= 65 ? "var(--accent)" : "var(--neutral)" }}>{theme.score}</div>
      </div>
      <div style={{ marginTop: 6, height: 4, background: "var(--border-medium)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${theme.score}%`, background: theme.score >= 80 ? "var(--bull)" : theme.score >= 65 ? "var(--accent)" : "var(--neutral)", borderRadius: 2 }}/>
      </div>
    </div>
  );
}
