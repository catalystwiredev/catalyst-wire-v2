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
  "8-K":     "Material event disclosure",
  "4":       "Insider transaction",
  "10-K":    "Annual report",
  "10-Q":    "Quarterly report",
  "S-1":     "IPO registration",
  "SC 13G":  "Beneficial ownership (passive)",
  "SC 13D":  "Beneficial ownership (active)",
  "DEF 14A": "Proxy statement",
};

const FORM_COLORS: Record<string, string> = {
  "8-K":     "#f59e0b",
  "4":       "#0099ff",
  "10-K":    "#a78bfa",
  "10-Q":    "#60a5fa",
  "S-1":     "#f472b6",
  "SC 13G":  "#34d399",
  "SC 13D":  "#00e676",
  "DEF 14A": "#94a3b8",
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
    <div style={{ background:"rgba(8,14,26,0.70)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden", boxShadow:"0 4px 32px rgba(0,0,0,0.4)" }}>
      <div style={{ padding:"14px 20px", background:"rgba(4,8,18,0.60)", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center", backdropFilter:"blur(8px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span className="live-dot"/>
          <span style={{ fontSize:13, fontWeight:700, letterSpacing:"-0.01em" }}>SEC Filings</span>
        </div>
        <div style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"monospace" }}>{filings.length} filings · click to expand</div>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width:28 }}/>
              {["Form", "Company", "Filed", "Description"].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filings.map((f: any, i: number) => {
              const open = expanded.has(i);
              const fColor = FORM_COLORS[f.formType ?? ""] ?? "var(--text-muted)";
              return (
                <>
                  <tr
                    key={`r-${i}`}
                    onClick={() => toggle(i)}
                    className="glass-row"
                    style={{ cursor:"pointer", background: open ? "rgba(0,153,255,0.05)" : "transparent" }}
                  >
                    <td style={{ paddingLeft:14, paddingRight:6, color:"var(--text-muted)", width:28 }}>
                      {open ? <ChevronDown size={13}/> : <ChevronRight size={13}/>}
                    </td>
                    <td>
                      <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:fColor, background:`${fColor}15`, border:`1px solid ${fColor}30`, borderRadius:5, padding:"2px 7px", whiteSpace:"nowrap", boxShadow:`0 0 8px ${fColor}20` }}>
                        {f.formType ?? "—"}
                      </span>
                    </td>
                    <td style={{ fontFamily:"monospace", fontWeight:600, color:"var(--accent)", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {f.companyName ?? f.entityName ?? "—"}
                    </td>
                    <td style={{ fontSize:11, fontFamily:"monospace", color:"var(--text-secondary)", whiteSpace:"nowrap" }}>
                      {relTime(f.filedAt)}
                    </td>
                    <td style={{ color:"var(--text-secondary)", fontSize:12, maxWidth:380, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {f.description ?? f.periodOfReport ?? "—"}
                    </td>
                  </tr>

                  {open && (
                    <tr key={`e-${i}`}>
                      <td colSpan={5} style={{ padding:"0 16px 18px 48px", background:"rgba(0,153,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:14, paddingTop:14 }}>
                          <div>
                            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:5 }}>Form Type</div>
                            <div style={{ fontSize:13, fontWeight:700, color:fColor }}>{f.formType}</div>
                            <div style={{ fontSize:11, color:"var(--text-secondary)", marginTop:3 }}>{FORM_LABELS[f.formType ?? ""] ?? "SEC regulatory filing"}</div>
                          </div>
                          <div>
                            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:5 }}>Filer</div>
                            <div style={{ fontSize:13, fontWeight:500 }}>{f.companyName ?? f.entityName ?? "—"}</div>
                            {f.ticker && <div style={{ fontSize:11, fontFamily:"monospace", color:"var(--accent)", marginTop:3, letterSpacing:"0.05em" }}>${f.ticker}</div>}
                          </div>
                          <div>
                            <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:5 }}>Period</div>
                            <div style={{ fontSize:13 }}>{f.periodOfReport ?? "—"}</div>
                            <div style={{ fontSize:11, color:"var(--text-secondary)", marginTop:3 }}>Filed: {f.filedAt ? new Date(f.filedAt).toLocaleDateString() : "—"}</div>
                          </div>
                          {f.description && (
                            <div style={{ gridColumn:"1 / -1" }}>
                              <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:5 }}>Description</div>
                              <div style={{ fontSize:12, color:"var(--text-secondary)", lineHeight:1.7 }}>{f.description}</div>
                            </div>
                          )}
                          {f.linkToFilingDetails && (
                            <div style={{ gridColumn:"1 / -1", paddingTop:4 }}>
                              <a
                                href={f.linkToFilingDetails}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display:"inline-flex", alignItems:"center", gap:7, color:"#fff", fontSize:12, fontWeight:600, textDecoration:"none", background:"linear-gradient(135deg, rgba(0,153,255,0.8), rgba(0,102,204,0.8))", border:"1px solid rgba(0,153,255,0.3)", borderRadius:8, padding:"6px 14px", boxShadow:"0 0 16px rgba(0,153,255,0.2)", transition:"box-shadow 0.15s" }}
                              >
                                <ExternalLink size={11}/> View on SEC EDGAR
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
