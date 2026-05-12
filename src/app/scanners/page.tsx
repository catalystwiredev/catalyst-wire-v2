"use client";
import Link from "next/link";
import { ScanLine, TrendingUp, Zap, ArrowRight, RefreshCw } from "lucide-react";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { LiveBadge } from "@/components/LiveBadge";
import { tierAtLeast, shouldShowUpgradeCTA } from "@/lib/tier";

interface ScanResult {
  Ticker?: string; ticker?: string;
  EventType?: string; type?: string;
  Description?: string; description?: string;
  Verdict?: string; verdict?: string;
  ImpactScore?: number; impactScore?: number;
  price?: number; change?: number; changePct?: number;
}

function ScoreBadge({ s }: { s: number }) {
  const c = s >= 80 ? "var(--bull)" : s >= 60 ? "var(--accent)" : "var(--neutral)";
  return <span style={{ fontFamily: "monospace", fontWeight: 700, color: c, fontSize: 15 }}>{s}</span>;
}

function VerdictPill({ v }: { v: string }) {
  const c = v === "Bullish" ? "pill-bull" : v === "Bearish" ? "pill-bear" : "pill-neutral";
  return <span className={`pill ${c}`}>{v}</span>;
}

export default function ScannersPage() {
  const { data, isFetching, lastUpdated, refresh } = useAutoRefresh<{ results: ScanResult[]; generated: string }>(
    { results: [], generated: "" },
    "/api/scanners",
    { intervalMs: 5_000 }
  );

  const results = data.results ?? [];
  const generated = data.generated ?? "";
  const loading = isFetching && results.length === 0;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Market Intelligence</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Momentum Scanner</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Live catalysts ranked by AI impact score, enriched with real-time price data.</p>
        <div style={{ marginTop: 12 }}>
          <LiveBadge isFetching={isFetching} lastUpdated={lastUpdated} label="Live · 5s" color="#00e676" />
        </div>
      </div>

      {/* Momentum Scanner */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "16px 20px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "rgba(0,230,118,0.12)", border: "1px solid rgba(0,230,118,0.25)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} style={{ color: "var(--bull)" }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>Catalyst Momentum Scanner</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: "rgba(0,230,118,0.15)", color: "var(--bull)", border: "1px solid rgba(0,230,118,0.3)" }}>LIVE</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>AI-scored catalysts with live price data from Finnhub.</p>
            </div>
          </div>
          <button onClick={refresh} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-elevated)", color: "var(--text-secondary)", padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, border: "1px solid var(--border-medium)", cursor: "pointer" }}>
            <RefreshCw size={12} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} /> Refresh
          </button>
        </div>

        {loading && results.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)" }}>Loading live catalysts…</div>
        ) : results.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)" }}>No catalysts found. Scan again shortly.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Ticker", "Event", "Verdict", "Score", "Price", "Chg%"].map(h => (
                    <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const ticker = r.Ticker ?? r.ticker ?? "";
                  const score = r.ImpactScore ?? r.impactScore ?? 0;
                  const verdict = r.Verdict ?? r.verdict ?? "Neutral";
                  const eventType = r.EventType ?? r.type ?? "Event";
                  const chgPct = r.changePct;
                  const isUp = chgPct != null && chgPct > 0;
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>{ticker}</td>
                      <td style={{ padding: "10px 16px", color: "var(--text-secondary)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{eventType}</td>
                      <td style={{ padding: "10px 16px" }}><VerdictPill v={verdict} /></td>
                      <td style={{ padding: "10px 16px" }}><ScoreBadge s={score} /></td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace" }}>{r.price != null ? `$${r.price.toFixed(2)}` : "—"}</td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 600, color: chgPct == null ? "var(--text-muted)" : isUp ? "var(--bull)" : "var(--bear)" }}>
                        {chgPct != null ? `${isUp ? "+" : ""}${chgPct.toFixed(2)}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {generated && <div style={{ padding: "8px 20px", fontSize: 10, color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>Last updated {new Date(generated).toLocaleTimeString()}</div>}
      </div>

      {/* Premium scanners */}
      {[
        { icon: ScanLine, label: "Volume Spike Detector", desc: "5x+ volume surges above 30-day baseline detected before price confirmation.", badge: "ALPHA" },
        { icon: Zap, label: "Catalyst Velocity Scanner", desc: "Ranks securities by density and quality of catalysts in a rolling 7-day window.", badge: "ALPHA" },
      ].map(s => (
        <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "16px 20px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, background: "rgba(0,153,255,0.1)", border: "1px solid rgba(0,153,255,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{s.label}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: "rgba(0,153,255,0.15)", color: "var(--accent)", border: "1px solid rgba(0,153,255,0.3)" }}>{s.badge}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{s.desc}</p>
              </div>
            </div>
            <Link href="/pricing" style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "#fff", padding: "7px 16px", borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              Unlock <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ padding: "36px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Alpha plan required to access this scanner.
          </div>
        </div>
      ))}
    </div>
  );
}
