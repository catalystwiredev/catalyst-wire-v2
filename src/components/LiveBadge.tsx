"use client";

import { Wifi, RefreshCw } from "lucide-react";

interface Props {
  isFetching:  boolean;
  lastUpdated: number | null;
  label?:      string;
  color?:      string;
}

function timeAgo(ms: number): string {
  const sec = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (sec < 5)  return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

export function LiveBadge({ isFetching, lastUpdated, label = "Live", color = "#00e676" }: Props) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 11px", borderRadius: 6,
      background: `${color}10`, border: `1px solid ${color}30`,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      color, fontFamily: "ui-monospace, monospace",
    }}>
      {isFetching
        ? <RefreshCw size={11} style={{ animation: "spin 0.8s linear infinite" }} />
        : <Wifi size={11} />
      }
      <span>{label}</span>
      {lastUpdated && (
        <span style={{ opacity: 0.65, fontWeight: 500 }}>· {timeAgo(lastUpdated)}</span>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}
