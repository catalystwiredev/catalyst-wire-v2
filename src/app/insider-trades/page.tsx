import Link from "next/link";
import { ArrowRight, UserCheck } from "lucide-react";

export const revalidate = 1800;

async function getTrades() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/insider-trades`, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.trades ?? [];
  } catch { return []; }
}

function relTime(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return iso?.slice(0, 10) ?? "—"; }
}

export default async function InsiderTradesPage() {
  const trades = await getTrades();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Form 4 · EDGAR</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Insider Trades</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Live Form 4 filings from SEC EDGAR — officer and director transactions in real time.</p>
        </div>
        <Link href="/register?plan=alpha" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Unlock signal scores <ArrowRight size={14} />
        </Link>
      </div>

      {trades.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-secondary)" }}>
          <UserCheck size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
          <div>No insider trades found. Try again shortly.</div>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Recent Form 4 Filings</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{trades.length} transactions</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Company", "Ticker", "Filed", "Price", "Chg%", "Filing"].map(h => (
                    <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trades.map((t: any, i: number) => {
                  const chgPct = t.quote?.changePct;
                  const isUp = chgPct != null && chgPct > 0;
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 16px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-primary)" }}>
                        {t.companyName ?? t.entityName ?? "—"}
                      </td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>
                        {t.ticker ?? "—"}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                        {relTime(t.filedAt)}
                      </td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "var(--text-primary)" }}>
                        {t.quote?.price != null ? `$${t.quote.price.toFixed(2)}` : "—"}
                      </td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 600, color: chgPct == null ? "var(--text-muted)" : isUp ? "var(--bull)" : "var(--bear)" }}>
                        {chgPct != null ? `${isUp ? "+" : ""}${chgPct.toFixed(2)}%` : "—"}
                      </td>
                      <td style={{ padding: "10px 16px" }}>
                        <a href={t.linkToFilingDetails} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontSize: 11, textDecoration: "none" }}>
                          View →
                        </a>
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
