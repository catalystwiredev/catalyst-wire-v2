import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export const revalidate = 900;

async function getFilings(form = "all") {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/sec-filings?form=${form}`, { next: { revalidate: 900 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.filings ?? [];
  } catch { return []; }
}

function FormBadge({ f }: { f: string }) {
  return (
    <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(0,153,255,0.25)", borderRadius: 5, padding: "1px 6px", whiteSpace: "nowrap" }}>
      {f}
    </span>
  );
}

function relTime(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return "—"; }
}

export default async function SECFilingsPage() {
  const filings = await getFilings("all");

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
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Latest SEC Filings</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{filings.length} filings</div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Form", "Company", "Filed", "Description"].map(h => (
                    <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filings.map((f: any, i: number) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 16px" }}><FormBadge f={f.formType ?? "—"} /></td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 600, color: "var(--text-primary)", maxWidth: 200 }}>
                      <a href={f.linkToFilingDetails} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
                        {f.companyName ?? f.entityName ?? "—"}
                      </a>
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 11, fontFamily: "monospace", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {relTime(f.filedAt)}
                    </td>
                    <td style={{ padding: "10px 16px", color: "var(--text-secondary)", fontSize: 12, maxWidth: 400 }}>
                      {f.description ?? f.periodOfReport ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
