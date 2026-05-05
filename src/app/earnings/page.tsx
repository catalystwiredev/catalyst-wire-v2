import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export const revalidate = 3600;

async function getEarnings() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/earnings`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.earnings ?? [];
  } catch { return []; }
}

function ScoreBadge({ n }: { n: number }) {
  const c = n >= 80 ? "var(--bull)" : n >= 60 ? "var(--accent)" : "var(--neutral)";
  return <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: c, background: `${c}15`, border: `1px solid ${c}40`, borderRadius: 6, padding: "1px 7px" }}>{n}</span>;
}

function fmt(v: number | null | undefined, prefix = "", suffix = "") {
  if (v == null) return "—";
  const n = Number(v);
  if (isNaN(n)) return "—";
  if (Math.abs(n) >= 1e9) return `${prefix}${(n / 1e9).toFixed(1)}B${suffix}`;
  if (Math.abs(n) >= 1e6) return `${prefix}${(n / 1e6).toFixed(1)}M${suffix}`;
  return `${prefix}${n.toFixed(2)}${suffix}`;
}

export default async function EarningsPage() {
  const earnings = await getEarnings();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Earnings Calendar</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Earnings Intelligence</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Live earnings calendar — EPS estimates, revenue targets, and historical patterns.</p>
        </div>
        <Link href="/register?plan=alpha" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Unlock AI analysis <ArrowRight size={14} />
        </Link>
      </div>

      {earnings.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-secondary)" }}>
          <Calendar size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
          <div>No upcoming earnings found. Check back soon.</div>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Upcoming Earnings — Next 60 Days</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{earnings.length} reports</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Date", "Ticker", "EPS Est", "EPS Actual", "Rev Est", "Rev Actual", "Quarter"].map(h => (
                    <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {earnings.map((e: any, i: number) => {
                  const hasActual = e.epsActual != null;
                  const beat = hasActual && e.epsActual >= (e.epsEstimate ?? 0);
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "var(--text-secondary)", fontSize: 12 }}>{e.date}</td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>{e.symbol}</td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace" }}>{fmt(e.epsEstimate, "$")}</td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", color: hasActual ? (beat ? "var(--bull)" : "var(--bear)") : "var(--text-muted)" }}>
                        {hasActual ? fmt(e.epsActual, "$") : "—"}
                      </td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace" }}>{fmt(e.revenueEstimate, "$")}</td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "var(--text-muted)" }}>
                        {e.revenueActual ? fmt(e.revenueActual, "$") : "—"}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-secondary)" }}>
                        {e.quarter ? `Q${e.quarter} ${e.year ?? ""}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
