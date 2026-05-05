import Link from "next/link";
import { Calendar, FlaskConical, BarChart2, Rocket, ArrowRight, ExternalLink } from "lucide-react";

export const revalidate = 3600;

async function getCalendarData() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/calendars`, { next: { revalidate: 3600 } });
    if (!res.ok) return { earnings: [], fdaApps: [], ipoFilings: [] };
    return await res.json();
  } catch { return { earnings: [], fdaApps: [], ipoFilings: [] }; }
}

function fmt(v: number | null | undefined, prefix = "", suffix = "") {
  if (v == null || isNaN(Number(v))) return "—";
  const n = Number(v);
  if (Math.abs(n) >= 1e9) return `${prefix}${(n / 1e9).toFixed(1)}B${suffix}`;
  if (Math.abs(n) >= 1e6) return `${prefix}${(n / 1e6).toFixed(1)}M${suffix}`;
  return `${prefix}${n.toFixed(2)}${suffix}`;
}

function relTime(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return iso?.slice(0, 10) ?? "—"; }
}

function StatusBadge({ s }: { s: string }) {
  const u = (s ?? "").toUpperCase();
  const c = u.includes("AP") ? "var(--bull)" : u.includes("COMPLETE") ? "var(--accent)" : u.includes("WITHDRAW") || u.includes("CRL") ? "var(--bear)" : "var(--neutral)";
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: `${c}15`, color: c, border: `1px solid ${c}35`, whiteSpace: "nowrap" }}>{u}</span>;
}

function SectionHeader({ icon: Icon, title, count, color = "var(--accent)" }: { icon: any; title: string; count?: number; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 32, height: 32, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={16} style={{ color }} />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2>
      {count != null && <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{count} items</span>}
    </div>
  );
}

export default async function CalendarsPage() {
  const { earnings, fdaApps, ipoFilings } = await getCalendarData();

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Event Intelligence</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>FDA · Earnings · IPO Calendars</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Upcoming high-impact market events sourced live from Finnhub, OpenFDA, and SEC EDGAR.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

        {/* Earnings Calendar */}
        <section>
          <SectionHeader icon={BarChart2} title="Earnings Calendar" count={earnings?.length} color="var(--bull)" />
          {!earnings?.length ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}>No upcoming earnings data available right now.</div>
          ) : (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
                      {["Date", "Ticker", "EPS Estimate", "EPS Actual", "Revenue Estimate", "Revenue Actual", "Quarter"].map(h => (
                        <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.slice(0, 30).map((e: any, i: number) => {
                      const beat = e.epsActual != null && e.epsActual >= (e.epsEstimate ?? 0);
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "9px 14px", fontFamily: "monospace", fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{e.date}</td>
                          <td style={{ padding: "9px 14px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>{e.symbol}</td>
                          <td style={{ padding: "9px 14px", fontFamily: "monospace" }}>{fmt(e.epsEstimate, "$")}</td>
                          <td style={{ padding: "9px 14px", fontFamily: "monospace", color: e.epsActual != null ? (beat ? "var(--bull)" : "var(--bear)") : "var(--text-muted)" }}>
                            {e.epsActual != null ? fmt(e.epsActual, "$") : "—"}
                          </td>
                          <td style={{ padding: "9px 14px", fontFamily: "monospace" }}>{fmt(e.revenueEstimate, "$")}</td>
                          <td style={{ padding: "9px 14px", fontFamily: "monospace", color: "var(--text-muted)" }}>{e.revenueActual ? fmt(e.revenueActual, "$") : "—"}</td>
                          <td style={{ padding: "9px 14px", fontSize: 11, color: "var(--text-secondary)" }}>{e.quarter ? `Q${e.quarter} ${e.year ?? ""}` : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* FDA Drug Applications */}
        <section>
          <SectionHeader icon={FlaskConical} title="FDA Drug Applications (NDA/BLA)" count={fdaApps?.length} color="#f472b6" />
          {!fdaApps?.length ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}>No FDA application data available right now.</div>
          ) : (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
                      {["App #", "Sponsor", "Brand Name", "Generic Name", "Status", "Priority"].map(h => (
                        <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fdaApps.slice(0, 20).map((a: any, i: number) => {
                      const sub = a.submissions?.[0];
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "9px 14px", fontFamily: "monospace", fontSize: 11, color: "#f472b6" }}>{a.application_number ?? "—"}</td>
                          <td style={{ padding: "9px 14px", fontSize: 12, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.sponsor_name ?? "—"}</td>
                          <td style={{ padding: "9px 14px", fontWeight: 600, fontSize: 12 }}>{a.brand_name ?? "—"}</td>
                          <td style={{ padding: "9px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{a.generic_name ?? a.drug_substance_name ?? "—"}</td>
                          <td style={{ padding: "9px 14px" }}>{sub?.submission_status ? <StatusBadge s={sub.submission_status} /> : "—"}</td>
                          <td style={{ padding: "9px 14px", fontSize: 11, color: "var(--text-secondary)" }}>{sub?.review_priority ?? "Standard"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* IPO Filings (S-1) */}
        <section>
          <SectionHeader icon={Rocket} title="IPO Filings (S-1 Registrations)" count={ipoFilings?.length} color="var(--accent)" />
          {!ipoFilings?.length ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 13 }}>No recent S-1 filings found.</div>
          ) : (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
                      {["Company", "Form", "Filed", "Description", "EDGAR"].map(h => (
                        <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ipoFilings.map((f: any, i: number) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "9px 14px", fontWeight: 600, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.companyName ?? f.entityName ?? "—"}</td>
                        <td style={{ padding: "9px 14px" }}>
                          <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(0,153,255,0.25)", borderRadius: 5, padding: "1px 6px" }}>{f.formType}</span>
                        </td>
                        <td style={{ padding: "9px 14px", fontSize: 11, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{relTime(f.filedAt)}</td>
                        <td style={{ padding: "9px 14px", fontSize: 12, color: "var(--text-secondary)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.description ?? f.periodOfReport ?? "—"}</td>
                        <td style={{ padding: "9px 14px" }}>
                          <a href={f.linkToFilingDetails} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontSize: 11, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>
                            View <ExternalLink size={9}/>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      <div style={{ marginTop: 36, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>Unlock full calendar access with an Alpha plan — including AI conviction scores on every event.</p>
        <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          <Calendar size={13}/> View plans <ArrowRight size={13}/>
        </Link>
      </div>
    </div>
  );
}
