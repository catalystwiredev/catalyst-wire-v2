"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Wifi, WifiOff } from "lucide-react";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";

interface BinanceTicker {
  symbol: string; lastPrice: number; priceChangePercent: number; priceChange: number;
  highPrice: number; lowPrice: number; volume: number; quoteVolume: number; count: number;
}

export function CryptoLiveBoard({ initialPairs }: { initialPairs: BinanceTicker[] }) {
  const symbols = useMemo(() => initialPairs.map(p => p.symbol), [initialPairs]);
  const { tickers, status } = useBinanceTicker(symbols);

  // Merge initial server data with live WebSocket updates
  const merged = initialPairs.map(p => {
    const live = tickers[p.symbol];
    return live ? { ...p, ...live } : p;
  });

  const statusColor = status === "open" ? "#00e676" : status === "error" ? "#ff4d4d" : "#6a84a0";
  const StatusIcon  = status === "open" ? Wifi : WifiOff;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 12px", borderRadius: 6,
          background: `${statusColor}10`, border: `1px solid ${statusColor}30`,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          color: statusColor,
        }}>
          <StatusIcon size={11} />
          {status === "open" ? "Live · Binance WS" : status === "connecting" ? "Connecting…" : "Offline"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {merged.map(t => {
          const up = t.priceChangePercent >= 0;
          const color = up ? "#00e676" : "#ff4d4d";
          const Icon = up ? TrendingUp : TrendingDown;
          const base = t.symbol.replace("USDT", "");

          return (
            <div key={t.symbol} style={{
              background: "rgba(8,14,26,0.65)", backdropFilter: "blur(16px)",
              border: `1px solid ${color}20`, borderRadius: 14, padding: 18,
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "ui-monospace, monospace" }}>{base}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "ui-monospace, monospace" }}>
                    {t.symbol}
                  </div>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color, background: `${color}14`, border: `1px solid ${color}28`, padding: "3px 8px", borderRadius: 5 }}>
                  <Icon size={11} />
                  {up ? "+" : ""}{t.priceChangePercent.toFixed(2)}%
                </span>
              </div>

              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "ui-monospace, monospace", color, textShadow: `0 0 20px ${color}50` }}>
                ${t.lastPrice < 1 ? t.lastPrice.toFixed(6) : t.lastPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 10, color: "var(--text-secondary)" }}>
                <div>
                  <div style={{ color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>24h High</div>
                  <div style={{ fontFamily: "ui-monospace, monospace", color: "#00e676" }}>${t.highPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>24h Low</div>
                  <div style={{ fontFamily: "ui-monospace, monospace", color: "#ff4d4d" }}>${t.lowPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <span>Vol: {(t.quoteVolume / 1e6).toFixed(1)}M</span>
                <span>{t.count.toLocaleString()} trades</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
