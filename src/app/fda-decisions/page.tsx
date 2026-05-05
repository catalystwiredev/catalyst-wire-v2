import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";

export const revalidate = 3600;

async function getFDAData() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/fda`, { next: { revalidate: 3600 } });
    if (!res.ok) return { applications: [], recalls: [] };
    return await res.json();
  } catch { return { applications: [], recalls: [] }; }
}

function StatusBadge({ s }: { s: string }) {
  const upper = (s ?? "").toUpperCase();
  const color = upper.includes("AP") ? "var(--bull)" : upper.includes("COMPLETE") ? "var(--accent)" : upper.includes("WITHDRAW") ? "var(--bear)" : "var(--neutral)";
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: `${color}18`, color, border: `1px solid ${color}40`, whiteSpace: "nowrap" }}>{upper}</span>;
}

export default async function FDADecisionsPage() {
  const { applications, recalls } = await getFDAData();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "#f472b6", textTransform: "uppercase", marginBottom: 8 }}>OpenFDA · Biotech</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>FDA Decisions</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Live NDA, BLA, and drug application data from the FDA drug database.</p>
        </div>
        <Link href="/register?plan=alpha" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Unlock PDUFA calendar <ArrowRight size={14} />
        </Link>
      </div>

      {/* Drug Applications */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>Drug Applications (NDA/BLA)</div>
        {applications.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)" }}>
            <FlaskConical size={28} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
            <div>No applications found at this time.</div>
          </div>
        ) : (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
                    {["App #", "Sponsor", "Brand Name", "Generic Name", "Status", "Review Priority"].map(h => (
                      <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 20).map((a: any, i: number) => {
                    const latestSub = a.submissions?.[0];
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "var(--accent)" }}>{a.application_number ?? "—"}</td>
                        <td style={{ padding: "10px 14px", fontSize: 12, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.sponsor_name ?? "—"}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 600, fontSize: 12 }}>{a.brand_name ?? "—"}</td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{a.generic_name ?? a.drug_substance_name ?? "—"}</td>
                        <td style={{ padding: "10px 14px" }}>
                          {latestSub?.submission_status ? <StatusBadge s={latestSub.submission_status} /> : "—"}
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 11, color: "var(--text-secondary)" }}>
                          {latestSub?.review_priority ?? "Standard"}
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

      {/* Drug Recalls */}
      {recalls.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>Recent Drug Recalls</div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
                    {["Product", "Firm", "Reason", "Date", "Status"].map(h => (
                      <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recalls.slice(0, 10).map((r: any, i: number) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 14px", fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.product_description ?? "—"}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12 }}>{r.recalling_firm ?? "—"}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-secondary)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason_for_recall ?? "—"}</td>
                      <td style={{ padding: "10px 14px", fontSize: 11, fontFamily: "monospace" }}>{r.recall_initiation_date ?? "—"}</td>
                      <td style={{ padding: "10px 14px" }}>{r.status ? <StatusBadge s={r.status} /> : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
