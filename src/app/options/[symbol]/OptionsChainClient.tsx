"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Greeks { delta: number; gamma: number; theta: number; vega: number; rho: number; }
interface OptionContract {
  contractSymbol: string; strike: number; lastPrice: number; bid: number; ask: number;
  volume: number; openInterest: number; impliedVolatility: number; inTheMoney: boolean;
  expiration: string; greeks: Greeks;
}
interface OptionChain {
  symbol: string; expiration: string; expirations: string[]; underlyingPrice: number;
  calls: OptionContract[]; puts: OptionContract[];
}

type ChainSide = "calls" | "puts";

export function OptionsChainClient({ chain }: { chain: OptionChain }) {
  const [side, setSide] = useState<ChainSide>("calls");
  const router = useRouter();

  const contracts = side === "calls" ? chain.calls : chain.puts;
  const sideColor = side === "calls" ? "#00e676" : "#ff4d4d";

  // Sort by strike ascending; mark ATM closest strike
  const sorted = useMemo(() => [...contracts].sort((a, b) => a.strike - b.strike), [contracts]);
  const atmIndex = useMemo(() => {
    let best = 0, bestDist = Infinity;
    sorted.forEach((c, i) => {
      const d = Math.abs(c.strike - chain.underlyingPrice);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }, [sorted, chain.underlyingPrice]);

  function changeExpiration(iso: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("expiration", iso);
    router.push(url.pathname + url.search);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "inline-flex", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["calls", "puts"] as ChainSide[]).map(s => (
            <button
              key={s}
              onClick={() => setSide(s)}
              style={{
                padding: "8px 18px",
                background: side === s ? (s === "calls" ? "rgba(0,230,118,0.14)" : "rgba(255,77,77,0.14)") : "transparent",
                color:      side === s ? (s === "calls" ? "#00e676" : "#ff4d4d") : "var(--text-secondary)",
                border: "none",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <select
          value={chain.expiration}
          onChange={(e) => changeExpiration(e.target.value)}
          style={{
            padding: "8px 14px",
            background: "rgba(8,14,26,0.65)",
            border: "1px solid rgba(167,139,250,0.25)",
            borderRadius: 8,
            color: "var(--text-primary)",
            fontSize: 12,
            fontFamily: "ui-monospace, monospace",
            cursor: "pointer",
          }}
        >
          {chain.expirations.map(exp => (
            <option key={exp} value={exp} style={{ background: "#0a0e1a" }}>
              {exp.slice(0, 10)}
            </option>
          ))}
        </select>

        <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {sorted.length} contracts
        </span>
      </div>

      {/* Chain table */}
      <div style={{ background: "rgba(8,14,26,0.65)", backdropFilter: "blur(16px)", border: `1px solid ${sideColor}20`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.3)" }}>
                {["Strike", "Last", "Bid", "Ask", "Vol", "OI", "IV", "Δ", "Γ", "Θ", "ν", "ρ"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "right", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => {
                const isATM = i === atmIndex;
                return (
                  <tr key={c.contractSymbol} style={{
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    background: isATM ? `${sideColor}08` : c.inTheMoney ? "rgba(255,255,255,0.02)" : "transparent",
                  }}>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", fontWeight: 700, color: isATM ? sideColor : "var(--text-primary)" }}>
                      ${c.strike.toFixed(2)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "var(--text-primary)" }}>
                      ${c.lastPrice.toFixed(2)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "var(--text-secondary)" }}>
                      {c.bid.toFixed(2)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "var(--text-secondary)" }}>
                      {c.ask.toFixed(2)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "var(--text-muted)" }}>
                      {c.volume.toLocaleString()}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "var(--text-muted)" }}>
                      {c.openInterest.toLocaleString()}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "#a78bfa" }}>
                      {(c.impliedVolatility * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "#0090f0" }}>
                      {c.greeks.delta.toFixed(3)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "#00e676" }}>
                      {c.greeks.gamma.toFixed(4)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "#ff4d4d" }}>
                      {c.greeks.theta.toFixed(3)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "#f59e0b" }}>
                      {c.greeks.vega.toFixed(3)}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "ui-monospace, monospace", color: "var(--text-muted)" }}>
                      {c.greeks.rho.toFixed(3)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Greeks legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 10, color: "var(--text-muted)", padding: "0 6px" }}>
        <span><strong style={{ color: "#0090f0" }}>Δ delta</strong> price sensitivity</span>
        <span><strong style={{ color: "#00e676" }}>Γ gamma</strong> Δ rate of change</span>
        <span><strong style={{ color: "#ff4d4d" }}>Θ theta</strong> $/day decay</span>
        <span><strong style={{ color: "#f59e0b" }}>ν vega</strong> per 1% IV</span>
        <span><strong>ρ rho</strong> per 1% rate</span>
      </div>
    </div>
  );
}
