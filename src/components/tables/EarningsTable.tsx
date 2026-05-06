"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

function fmt(v: number | null | undefined, prefix = "", suffix = "") {
  if (v == null) return "—";
  const n = Number(v);
  if (isNaN(n)) return "—";
  if (Math.abs(n) >= 1e9) return `${prefix}${(n / 1e9).toFixed(2)}B${suffix}`;
  if (Math.abs(n) >= 1e6) return `${prefix}${(n / 1e6).toFixed(2)}M${suffix}`;
  return `${prefix}${n.toFixed(2)}${suffix}`;
}

function surprise(actual: number | null | undefined, estimate: number | null | undefined) {
  if (actual == null || estimate == null || estimate === 0) return null;
  return ((actual - estimate) / Math.abs(estimate)) * 100;
}

export function EarningsTable({ earnings }: { earnings: any[] }) {
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
        <div style={{ fontSize: 13, fontWeight: 600 }}>Upcoming Earnings — Next 60 Days</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{earnings.length} reports · Click any row to expand</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "8px 12px", width: 28 }}/>
              {["Date", "Ticker", "EPS Est", "EPS Actual", "Rev Est", "Rev Actual", "Quarter"].map(h => (
                <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {earnings.map((e: any, i: number) => {
              const open = expanded.has(i);
              const hasActual = e.epsActual != null;
              const beat = hasActual && e.epsActual >= (e.epsEstimate ?? 0);
              const epsSurprise = surprise(e.epsActual, e.epsEstimate);
              const revSurprise = surprise(e.revenueActual, e.revenueEstimate);
              return (
                <>
                  <tr key={`r-${i}`} onClick={() => toggle(i)} style={{ borderBottom: open ? "none" : "1px solid var(--border)", cursor: "pointer", background: open ? "var(--bg-elevated)" : "transparent", transition: "background 0.15s" }}>
                    <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>
                      {open ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "var(--text-secondary)", fontSize: 12 }}>{e.date}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>{e.symbol}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace" }}>{fmt(e.epsEstimate, "$")}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", color: hasActual ? (beat ? "var(--bull)" : "var(--bear)") : "var(--text-muted)" }}>
                      {hasActual ? fmt(e.epsActual, "$") : "—"}
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace" }}>{fmt(e.revenueEstimate, "$")}</td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace", color: "var(--text-muted)" }}>
                      {e.revenueActual ? fmt(e.revenueActual, "$") : "—"}
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-secondary)" }}>
                      {e.quarter ? `Q${e.quarter} ${e.year ?? ""}` : "—"}
                    </td>
                  </tr>
                  {open && (
                    <tr key={`e-${i}`} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td colSpan={8} style={{ padding: "0 16px 16px 48px", background: "var(--bg-elevated)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, paddingTop: 14 }}>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Report Date</div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>{e.date}</div>
                            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                              {e.quarter ? `Q${e.quarter} ${e.year ?? ""}` : "—"}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>EPS Analysis</div>
                            {hasActual ? (
                              <>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  {beat ? <TrendingUp size={14} style={{ color: "var(--bull)" }}/> : <TrendingDown size={14} style={{ color: "var(--bear)" }}/>}
                                  <span style={{ fontWeight: 700, color: beat ? "var(--bull)" : "var(--bear)" }}>{beat ? "BEAT" : "MISS"}</span>
                                </div>
                                <div style={{ fontSize: 12, marginTop: 4 }}>
                                  Actual: <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{fmt(e.epsActual, "$")}</span>
                                  {" vs Est: "}<span style={{ fontFamily: "monospace" }}>{fmt(e.epsEstimate, "$")}</span>
                                </div>
                                {epsSurprise != null && (
                                  <div style={{ fontSize: 11, color: epsSurprise > 0 ? "var(--bull)" : "var(--bear)", fontFamily: "monospace", marginTop: 2 }}>
                                    {epsSurprise > 0 ? "+" : ""}{epsSurprise.toFixed(1)}% surprise
                                  </div>
                                )}
                              </>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
                                <Minus size={14}/> <span style={{ fontSize: 12 }}>Pending · Est: {fmt(e.epsEstimate, "$")}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Revenue Analysis</div>
                            {e.revenueActual ? (
                              <>
                                <div style={{ fontSize: 12 }}>
                                  Actual: <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{fmt(e.revenueActual, "$")}</span>
                                </div>
                                <div style={{ fontSize: 12, marginTop: 2 }}>
                                  Est: <span style={{ fontFamily: "monospace" }}>{fmt(e.revenueEstimate, "$")}</span>
                                </div>
                                {revSurprise != null && (
                                  <div style={{ fontSize: 11, color: revSurprise > 0 ? "var(--bull)" : "var(--bear)", fontFamily: "monospace", marginTop: 2 }}>
                                    {revSurprise > 0 ? "+" : ""}{revSurprise.toFixed(1)}% surprise
                                  </div>
                                )}
                              </>
                            ) : (
                              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                Pending · Est: {fmt(e.revenueEstimate, "$")}
                              </div>
                            )}
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
