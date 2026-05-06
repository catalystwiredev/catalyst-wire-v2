"use client";
import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronRight } from "lucide-react";

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

const FORM_LABELS: Record<string, string> = {
  "8-K":  "Material event disclosure",
  "4":    "Insider transaction",
  "10-K": "Annual report",
  "10-Q": "Quarterly report",
  "S-1":  "IPO registration",
  "SC 13G": "Beneficial ownership (passive)",
  "SC 13D": "Beneficial ownership (active)",
  "DEF 14A": "Proxy statement",
};

export function SecFilingsTable({ filings }: { filings: any[] }) {
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
        <div style={{ fontSize: 13, fontWeight: 600 }}>Latest SEC Filings</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{filings.length} filings · Click any row to expand</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "8px 12px", width: 28 }}/>
              {["Form", "Company", "Filed", "Description"].map(h => (
                <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filings.map((f: any, i: number) => {
              const open = expanded.has(i);
              return (
                <>
                  <tr key={`r-${i}`} onClick={() => toggle(i)} style={{ borderBottom: open ? "none" : "1px solid var(--border)", cursor: "pointer", background: open ? "var(--bg-elevated)" : "transparent", transition: "background 0.15s" }}>
                    <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>
                      {open ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(0,153,255,0.25)", borderRadius: 5, padding: "1px 6px", whiteSpace: "nowrap" }}>
                        {f.formType ?? "—"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 600, color: "var(--accent)", maxWidth: 200 }}>
                      {f.companyName ?? f.entityName ?? "—"}
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 11, fontFamily: "monospace", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {relTime(f.filedAt)}
                    </td>
                    <td style={{ padding: "10px 16px", color: "var(--text-secondary)", fontSize: 12, maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {f.description ?? f.periodOfReport ?? "—"}
                    </td>
                  </tr>
                  {open && (
                    <tr key={`e-${i}`} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td colSpan={5} style={{ padding: "0 16px 16px 48px", background: "var(--bg-elevated)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, paddingTop: 12 }}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Form Type</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{f.formType}</div>
                            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{FORM_LABELS[f.formType ?? ""] ?? "SEC regulatory filing"}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Filer</div>
                            <div style={{ fontSize: 13 }}>{f.companyName ?? f.entityName ?? "—"}</div>
                            {f.ticker && <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--accent)", marginTop: 2 }}>{f.ticker}</div>}
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Period</div>
                            <div style={{ fontSize: 13 }}>{f.periodOfReport ?? "—"}</div>
                            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>Filed: {f.filedAt ? new Date(f.filedAt).toLocaleString() : "—"}</div>
                          </div>
                          {f.description && (
                            <div style={{ gridColumn: "1 / -1" }}>
                              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Description</div>
                              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.description}</div>
                            </div>
                          )}
                          {f.linkToFilingDetails && (
                            <div style={{ gridColumn: "1 / -1", paddingTop: 4 }}>
                              <a href={f.linkToFilingDetails} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent)", fontSize: 12, fontWeight: 600, textDecoration: "none", background: "var(--accent-dim)", border: "1px solid var(--accent-glow)", borderRadius: 7, padding: "5px 12px" }}>
                                <ExternalLink size={12}/> View on SEC EDGAR
                              </a>
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
