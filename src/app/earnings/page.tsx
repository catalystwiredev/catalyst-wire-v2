import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { EarningsTable } from "@/components/tables/EarningsTable";

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
        <EarningsTable earnings={earnings} />
      )}
    </div>
  );
}
