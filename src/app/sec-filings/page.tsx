import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { SecFilingsTable } from "@/components/tables/SecFilingsTable";

export const revalidate = 900;

async function getFilings() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/sec-filings`, { next: { revalidate: 900 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.filings ?? [];
  } catch { return []; }
}

export default async function SECFilingsPage() {
  const filings = await getFilings();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>SEC EDGAR</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>SEC Filings</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>8-K, Form 4, 10-K, 10-Q — live from EDGAR within minutes of publication.</p>
        </div>
        <Link href="/register?plan=alpha" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Unlock AI parsing <ArrowRight size={14} />
        </Link>
      </div>

      {filings.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-secondary)" }}>
          <FileText size={32} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
          <div>No filings found. Try again shortly.</div>
        </div>
      ) : (
        <SecFilingsTable filings={filings} />
      )}
    </div>
  );
}
