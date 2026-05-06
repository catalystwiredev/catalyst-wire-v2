"use client";
import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";

function relTime(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return iso?.slice(0, 10) ?? "—"; }
}

export function InsiderTradesTable({ trades }: { trades: any[] }) {
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
      <div style={{ padding:"14px 20px", background:"rgba(4,8,18,0.60)", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span className="live-dot"/>
          <span style={{ fontSize:13, fontWeight:700, letterSpacing:"-0.01em" }}>Recent Form 4 Filings</span>
        </div>
        <div style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"monospace" }}>{trades.length} transactions · click to expand</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width:28 }}/>
              {["Company", "Ticker", "Filed", "Price", "Chg%", "Filing"].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((t: any, i: number) => {
              const open = expanded.has(i);
              const chgPct = t.quote?.changePct;
              const isUp = chgPct != null && chgPct > 0;
              return (
                <>
                  <tr key={`r-${i}`} onClick={() => toggle(i)} style={{ borderBottom: open ? "none" : "1px solid var(--border)", cursor: "pointer", background: open ? "var(--bg-elevated)" : "transparent", transition: "background 0.15s" }}>
                    <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>
                      {open ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </td>
                    <td style={{ padding: "10px 16px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-primary)" }}>
                      {t.companyName ?? t.entityName ?? "—"}
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>
                      {t.ticker ?? "—"}
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                      {relTime(t.filedAt)}
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "var(--text-primary)" }}>
                      {t.quote?.price != null ? `$${t.quote.price.toFixed(2)}` : "—"}
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 600, color: chgPct == null ? "var(--text-muted)" : isUp ? "var(--bull)" : "var(--bear)" }}>
                      {chgPct != null ? `${isUp ? "+" : ""}${chgPct.toFixed(2)}%` : "—"}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <a href={t.linkToFilingDetails} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: "var(--accent)", fontSize: 11, textDecoration: "none" }}>
                        View →
                      </a>
                    </td>
                  </tr>
                  {open && (
                    <tr key={`e-${i}`} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td colSpan={7} style={{ padding: "0 16px 16px 48px", background: "var(--bg-elevated)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, paddingTop: 14 }}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Company</div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{t.companyName ?? t.entityName ?? "—"}</div>
                            {t.ticker && <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--accent)", marginTop: 2 }}>{t.ticker}</div>}
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Current Price</div>
                            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>
                              {t.quote?.price != null ? `$${t.quote.price.toFixed(2)}` : "—"}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Day Change</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {chgPct != null ? (
                                <>
                                  {isUp ? <TrendingUp size={16} style={{ color: "var(--bull)" }}/> : <TrendingDown size={16} style={{ color: "var(--bear)" }}/>}
                                  <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: isUp ? "var(--bull)" : "var(--bear)" }}>
                                    {isUp ? "+" : ""}{chgPct.toFixed(2)}%
                                  </span>
                                </>
                              ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                            </div>
                            {t.quote?.change != null && (
                              <div style={{ fontSize: 11, color: isUp ? "var(--bull)" : "var(--bear)", fontFamily: "monospace", marginTop: 2 }}>
                                {t.quote.change > 0 ? "+" : ""}{t.quote.change.toFixed(2)} today
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Filing Time</div>
                            <div style={{ fontSize: 13 }}>{t.filedAt ? new Date(t.filedAt).toLocaleString() : "—"}</div>
                          </div>
                          {t.description && (
                            <div style={{ gridColumn: "1 / -1" }}>
                              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Filing Details</div>
                              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{t.description}</div>
                            </div>
                          )}
                          <div style={{ gridColumn: "1 / -1", paddingTop: 4 }}>
                            <a href={t.linkToFilingDetails} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent)", fontSize: 12, fontWeight: 600, textDecoration: "none", background: "var(--accent-dim)", border: "1px solid var(--accent-glow)", borderRadius: 7, padding: "5px 12px" }}>
                              <ExternalLink size={12}/> View Form 4 on EDGAR
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
