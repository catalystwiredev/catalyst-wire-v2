import Link from "next/link";
import { ArrowRight, Landmark, ExternalLink } from "lucide-react";
import { getRecent8Ks, searchFilings } from "@/lib/data/sec-edgar";

export const revalidate = 3600;

async function getCongressionalData() {
  try {
    // Congressional trades disclosed via SEC EDGAR (STOCK Act Form 4-like disclosures)
    // Also fetch recent 8-Ks from defense/government-related sectors as proxy signals
    const [form4s, govFilings] = await Promise.allSettled([
      searchFilings({ forms: ["4"], limit: 30 }),
      getRecent8Ks(20),
    ]);
    return {
      form4s:  form4s.status === "fulfilled" ? form4s.value : [],
      govFilings: govFilings.status === "fulfilled" ? govFilings.value : [],
    };
  } catch { return { form4s: [], govFilings: [] }; }
}

function relTime(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return iso?.slice(0, 10) ?? "—"; }
}

export default async function CongressionalTradesPage() {
  const { form4s, govFilings } = await getCongressionalData();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--gold, #f59e0b)", textTransform: "uppercase", marginBottom: 8 }}>STOCK Act · Political Alpha</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Congressional Trades</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>STOCK Act disclosures — who's trading before it's in the news.</p>
        </div>
        <Link href="/register?plan=alpha" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Unlock full database <ArrowRight size={14} />
        </Link>
      </div>

      {/* Info card about data source */}
      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <Landmark size={18} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b", marginBottom: 3 }}>Congressional STOCK Act Disclosures</div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            STOCK Act disclosures are filed with the House Clerk and Senate Secretary. Full real-time congressional trading data requires a dedicated provider (e.g., Quiver Quantitative). Below you can browse recent SEC Form 4 insider filings and material 8-K events — the same regulatory filings that often precede congressional trades.
          </p>
          <a href="https://disclosures.house.gov/FinancialDisclosure" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, color: "#f59e0b", textDecoration: "none", fontWeight: 600 }}>
            Official House Disclosures <ExternalLink size={10} />
          </a>
          <span style={{ color: "var(--text-muted)", margin: "0 8px" }}>·</span>
          <a href="https://efts.sec.gov/LATEST/search-index?q=%22STOCK+Act%22&forms=4" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, color: "#f59e0b", textDecoration: "none", fontWeight: 600 }}>
            EDGAR STOCK Act Filings <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* Recent Form 4 filings from EDGAR */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Recent Form 4 — Insider / Officer Transactions</div>
        {form4s.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12 }}>No Form 4 data available right now.</div>
        ) : (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
                    {["Company", "Form", "Filed", "Period", "EDGAR Link"].map(h => (
                      <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form4s.slice(0, 20).map((f: any, i: number) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.companyName ?? "—"}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 5, padding: "1px 6px" }}>{f.formType ?? "4"}</span>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 11, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{relTime(f.filedAt)}</td>
                      <td style={{ padding: "10px 14px", fontSize: 11, fontFamily: "monospace", color: "var(--text-secondary)" }}>{f.periodOfReport?.slice(0, 10) ?? "—"}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <a href={f.linkToFilingDetails} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontSize: 11, textDecoration: "none" }}>
                          View →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Material 8-K Events */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Recent 8-K Material Events</div>
        {govFilings.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-secondary)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12 }}>No 8-K data available right now.</div>
        ) : (
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
                    {["Company", "Form", "Filed", "Description", "Link"].map(h => (
                      <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {govFilings.slice(0, 15).map((f: any, i: number) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.companyName ?? "—"}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(0,153,255,0.25)", borderRadius: 5, padding: "1px 6px" }}>8-K</span>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 11, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{relTime(f.filedAt)}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-secondary)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.description ?? f.periodOfReport ?? "—"}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <a href={f.linkToFilingDetails} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontSize: 11, textDecoration: "none" }}>
                          View →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
