"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

function StatusBadge({ s }: { s: string }) {
  const u = (s ?? "").toUpperCase();
  const c = u.includes("AP") ? "var(--bull)" : u.includes("COMPLETE") ? "var(--accent)" : u.includes("WITHDRAW") || u.includes("CRL") ? "var(--bear)" : "var(--neutral)";
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: `${c}18`, color: c, border: `1px solid ${c}40`, whiteSpace: "nowrap" }}>{u}</span>;
}

export function FDAApplicationsTable({ applications }: { applications: any[] }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Drug Applications (NDA/BLA)</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{applications.length} applications · Click any row to expand</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
              <th style={{ padding: "8px 12px", width: 28 }}/>
              {["App #", "Sponsor", "Brand Name", "Generic Name", "Status", "Review Priority"].map(h => (
                <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.slice(0, 20).map((a: any, i: number) => {
              const open = expanded.has(i);
              const latestSub = a.submissions?.[0];
              return (
                <>
                  <tr key={`r-${i}`} onClick={() => toggle(i)} style={{ borderBottom: open ? "none" : "1px solid var(--border)", cursor: "pointer", background: open ? "var(--bg-elevated)" : "transparent", transition: "background 0.15s" }}>
                    <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>
                      {open ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "#f472b6" }}>{a.application_number ?? "—"}</td>
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
                  {open && (
                    <tr key={`e-${i}`} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td colSpan={7} style={{ padding: "0 16px 16px 48px", background: "var(--bg-elevated)" }}>
                        <div style={{ paddingTop: 14 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 16 }}>
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Sponsor</div>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{a.sponsor_name ?? "—"}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Application</div>
                              <div style={{ fontSize: 13, fontFamily: "monospace", color: "#f472b6" }}>{a.application_number}</div>
                              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{a.application_type ?? "NDA"}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Drug</div>
                              <div style={{ fontSize: 13, fontWeight: 700 }}>{a.brand_name ?? "—"}</div>
                              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{a.generic_name ?? a.drug_substance_name ?? "—"}</div>
                            </div>
                            {latestSub && (
                              <div>
                                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Latest Submission</div>
                                <div><StatusBadge s={latestSub.submission_status ?? "—"} /></div>
                                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6 }}>
                                  {latestSub.submission_type && <span>Type: {latestSub.submission_type}</span>}
                                  {latestSub.submission_number && <span> #{latestSub.submission_number}</span>}
                                </div>
                              </div>
                            )}
                          </div>

                          {a.submissions && a.submissions.length > 1 && (
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                                Submission History ({a.submissions.length} total)
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                {a.submissions.slice(0, 5).map((sub: any, si: number) => (
                                  <div key={si} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 10px", background: "var(--bg-card)", borderRadius: 7, fontSize: 11 }}>
                                    <StatusBadge s={sub.submission_status ?? "—"} />
                                    <span style={{ color: "var(--text-secondary)" }}>{sub.submission_type} #{sub.submission_number}</span>
                                    {sub.review_priority && <span style={{ color: "var(--text-muted)" }}>· {sub.review_priority}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div style={{ paddingTop: 12 }}>
                            <a
                              href={`https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=${(a.application_number ?? "").replace(/[^0-9]/g, "")}`}
                              target="_blank" rel="noopener noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#f472b6", fontSize: 12, fontWeight: 600, textDecoration: "none", background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.25)", borderRadius: 7, padding: "5px 12px" }}>
                              <ExternalLink size={12}/> View on FDA.gov
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FDARecallsTable({ recalls }: { recalls: any[] }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Recent Drug Recalls</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{recalls.length} recalls · Click any row to expand</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
              <th style={{ padding: "8px 12px", width: 28 }}/>
              {["Product", "Firm", "Reason", "Date", "Status"].map(h => (
                <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recalls.slice(0, 10).map((r: any, i: number) => {
              const open = expanded.has(i);
              return (
                <>
                  <tr key={`r-${i}`} onClick={() => toggle(i)} style={{ borderBottom: open ? "none" : "1px solid var(--border)", cursor: "pointer", background: open ? "var(--bg-elevated)" : "transparent", transition: "background 0.15s" }}>
                    <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>
                      {open ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.product_description ?? "—"}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12 }}>{r.recalling_firm ?? "—"}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-secondary)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason_for_recall ?? "—"}</td>
                    <td style={{ padding: "10px 14px", fontSize: 11, fontFamily: "monospace" }}>{r.recall_initiation_date ?? "—"}</td>
                    <td style={{ padding: "10px 14px" }}>{r.status ? <StatusBadge s={r.status} /> : "—"}</td>
                  </tr>
                  {open && (
                    <tr key={`e-${i}`} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td colSpan={6} style={{ padding: "0 16px 16px 48px", background: "var(--bg-elevated)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, paddingTop: 14 }}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Product</div>
                            <div style={{ fontSize: 13, lineHeight: 1.5 }}>{r.product_description ?? "—"}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Recalling Firm</div>
                            <div style={{ fontSize: 13 }}>{r.recalling_firm ?? "—"}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Classification</div>
                            <div style={{ fontSize: 13 }}>{r.classification ?? "—"}</div>
                            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{r.voluntary_mandated ?? "—"}</div>
                          </div>
                          <div style={{ gridColumn: "1 / -1" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Reason for Recall</div>
                            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{r.reason_for_recall ?? "—"}</div>
                          </div>
                          {r.product_quantity && (
                            <div>
                              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Quantity</div>
                              <div style={{ fontSize: 12 }}>{r.product_quantity}</div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
