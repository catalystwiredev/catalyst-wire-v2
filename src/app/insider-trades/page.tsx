import Link from "next/link";
import { ArrowRight, UserCheck } from "lucide-react";
import { InsiderTradesTable } from "@/components/tables/InsiderTradesTable";

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
        <InsiderTradesTable trades={trades} />
      )}
    </div>
  );
}
