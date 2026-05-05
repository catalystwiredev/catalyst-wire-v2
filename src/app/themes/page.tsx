import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight, Lock } from "lucide-react";

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

export default async function ThemesPage() {
  const themes = await getThemes();
  const visible = themes.filter((t: any) => FREE_THEMES.has(t.name));
  const locked  = themes.filter((t: any) => !FREE_THEMES.has(t.name));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Market Intelligence</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Stock Themes & Rankings</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Curated baskets grouped by sector theme with live 1-day performance data.</p>
      </div>

      {themes.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-secondary)" }}>Loading theme data…</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
            {visible.map((theme: any) => <ThemeCard key={theme.slug} theme={theme} />)}
            {locked.map((theme: any) => (
              <div key={theme.slug} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 22, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(6px)", background: "rgba(8,12,20,0.75)", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <Lock size={18} style={{ color: "var(--accent)" }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{theme.name}</div>
                    <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      Unlock with Alpha <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
                <ThemeCard theme={theme} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>Unlock all {themes.length} themes with an Alpha plan.</p>
            <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              View plans <ArrowRight size={13} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function ThemeCard({ theme }: { theme: any }) {
  const chg = theme.avgChange1d ?? 0;
  const isUp = chg >= 0;
  const desc = THEME_DESCS[theme.name] ?? theme.description ?? "";

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{theme.name}</div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{desc}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", color: isUp ? "var(--bull)" : "var(--bear)", fontWeight: 700, fontSize: 15, fontFamily: "monospace" }}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isUp ? "+" : ""}{chg.toFixed(2)}%
          </div>
          <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.06em", marginTop: 2 }}>1D RETURN</div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
        {(theme.tickers ?? []).map((t: string) => (
          <span key={t} style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, padding: "2px 8px", background: "var(--bg-elevated)", border: "1px solid var(--border-medium)", borderRadius: 5, color: "var(--accent)" }}>
            ${t}
          </span>
        ))}
      </div>

      {theme.topMover && (
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
          Top mover: <span style={{ color: isUp ? "var(--bull)" : "var(--bear)", fontWeight: 600, fontFamily: "monospace" }}>{theme.topMover} {theme.topMoverPct != null ? `${theme.topMoverPct >= 0 ? "+" : ""}${theme.topMoverPct.toFixed(2)}%` : ""}</span>
        </div>
      )}
    </div>
  );
}
