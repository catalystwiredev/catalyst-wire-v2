import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight, Lock, Crown } from "lucide-react";
import { auth } from "@/lib/auth";

export const revalidate = 3600;

async function getThemes() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/themes`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.themes ?? [];
  } catch { return []; }
}

const THEME_DESCS: Record<string, string> = {
  AI:       "Semiconductor, cloud, and software companies driving the AI infrastructure buildout.",
  Biotech:  "Clinical-stage and commercial biotech with upcoming catalysts and high conviction AI scores.",
  Defense:  "Defense contractors benefiting from increased global military spending cycles.",
  EV:       "EV manufacturers navigating demand slowdown and competitive margin compression.",
  Energy:   "Solar, wind, and hydrogen companies tied to IRA incentive funding cycles.",
  Crypto:   "Public equities with direct bitcoin treasury or mining exposure.",
  CyberSec: "Cloud-native security platforms with strong NRR and expanding TAM from AI threat vectors.",
  Space:    "Commercial launch, satellite broadband, and advanced air mobility.",
};

const FREE_THEMES = new Set(["AI", "Biotech", "Defense"]);

const THEME_COLORS: Record<string, string> = {
  AI:       "#0099ff",
  Biotech:  "#f472b6",
  Defense:  "#f59e0b",
  EV:       "#00e676",
  Energy:   "#34d399",
  Crypto:   "#a78bfa",
  CyberSec: "#60a5fa",
  Space:    "#e879f9",
};

export default async function ThemesPage() {
  const [session, themes] = await Promise.all([auth(), getThemes()]);
  const isPremium = (session?.user as any)?.plan !== "free";

  const visible = isPremium ? themes : themes.filter((t: any) => FREE_THEMES.has(t.name));
  const locked  = isPremium ? [] : themes.filter((t: any) => !FREE_THEMES.has(t.name));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32, display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Market Intelligence</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 8 }}>Stock Themes & Rankings</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Curated baskets grouped by sector theme with live 1-day performance data.</p>
        </div>
        {isPremium ? (
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(0,230,118,0.1)", border:"1px solid rgba(0,230,118,0.25)", color:"var(--bull)", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:700 }}>
            <Crown size={14}/> All {themes.length} Themes Unlocked
          </div>
        ) : (
          <Link href="/pricing" style={{ display:"inline-flex", alignItems:"center", gap:7, background:"var(--accent)", color:"#fff", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:600, textDecoration:"none" }}>
            Unlock all themes <ArrowRight size={14}/>
          </Link>
        )}
      </div>

      {themes.length === 0 ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--text-secondary)", background:"rgba(8,14,26,0.6)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 }}>
          No theme data available right now.
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
            {visible.map((theme: any) => <ThemeCard key={theme.slug} theme={theme} />)}
            {locked.map((theme: any) => (
              <div key={theme.slug} style={{ background:"rgba(8,14,26,0.6)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:22, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", inset:0, backdropFilter:"blur(8px)", background:"rgba(4,8,18,0.80)", zIndex:2, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:16 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, textAlign:"center" }}>
                    <div style={{ width:40, height:40, background:"rgba(0,153,255,0.1)", border:"1px solid rgba(0,153,255,0.2)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Lock size={18} style={{ color:"var(--accent)" }}/>
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>{theme.name}</div>
                    <Link href="/pricing" style={{ fontSize:12, fontWeight:600, color:"#fff", textDecoration:"none", display:"flex", alignItems:"center", gap:5, background:"linear-gradient(135deg, #0099ff, #0066cc)", padding:"6px 16px", borderRadius:7, boxShadow:"0 0 16px rgba(0,153,255,0.3)" }}>
                      Unlock with Alpha <ArrowRight size={11}/>
                    </Link>
                  </div>
                </div>
                <ThemeCard theme={theme} />
              </div>
            ))}
          </div>

          {!isPremium && (
            <div style={{ marginTop:32, textAlign:"center" }}>
              <p style={{ fontSize:13, color:"var(--text-secondary)", marginBottom:14 }}>Unlock all {themes.length} themes with an Alpha plan — from $29/mo.</p>
              <Link href="/pricing" style={{ display:"inline-flex", alignItems:"center", gap:7, background:"linear-gradient(135deg, #0099ff, #0066cc)", color:"#fff", padding:"11px 24px", borderRadius:9, fontSize:14, fontWeight:700, textDecoration:"none", boxShadow:"0 0 24px rgba(0,153,255,0.3)" }}>
                View plans <ArrowRight size={13}/>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ThemeCard({ theme }: { theme: any }) {
  const chg = theme.avgChange1d ?? 0;
  const isUp = chg >= 0;
  const desc = THEME_DESCS[theme.name] ?? theme.description ?? "";
  const color = THEME_COLORS[theme.name] ?? "var(--accent)";

  return (
    <div style={{ background:"rgba(8,14,26,0.70)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:22, position:"relative", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.3)", transition:"border-color 0.2s, box-shadow 0.2s" }}>
      <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, background:`radial-gradient(circle, ${color}18, transparent 70%)`, pointerEvents:"none" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:16, fontWeight:800, marginBottom:4, letterSpacing:"-0.01em" }}>{theme.name}</div>
          <p style={{ fontSize:12, color:"var(--text-secondary)", lineHeight:1.6 }}>{desc}</p>
        </div>
        <div style={{ textAlign:"right", flexShrink:0, marginLeft:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"flex-end", color:isUp ? "var(--bull)" : "var(--bear)", fontWeight:800, fontSize:17, fontFamily:"monospace", textShadow:isUp?"0 0 12px rgba(0,230,118,0.5)":"0 0 12px rgba(255,61,87,0.5)" }}>
            {isUp ? <TrendingUp size={15}/> : <TrendingDown size={15}/>}
            {isUp ? "+" : ""}{chg.toFixed(2)}%
          </div>
          <div style={{ fontSize:9, color:"var(--text-muted)", letterSpacing:"0.08em", marginTop:3, textTransform:"uppercase" }}>1D Return</div>
        </div>
      </div>

      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
        {(theme.tickers ?? []).map((t: string) => (
          <span key={t} style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, padding:"2px 8px", background:`${color}12`, border:`1px solid ${color}25`, borderRadius:5, color }}>
            ${t}
          </span>
        ))}
      </div>

      {theme.topMover && (
        <div style={{ fontSize:11, color:"var(--text-muted)" }}>
          Top mover: <span style={{ color:isUp ? "var(--bull)" : "var(--bear)", fontWeight:700, fontFamily:"monospace" }}>
            {theme.topMover} {theme.topMoverPct != null ? `${theme.topMoverPct >= 0 ? "+" : ""}${theme.topMoverPct.toFixed(2)}%` : ""}
          </span>
        </div>
      )}
    </div>
  );
}
