"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

const DEMO_PIN = "1234";

function verdictColor(verdict: string) {
  if (!verdict) return "#f59e0b";
  const v = verdict.toLowerCase();
  if (v === "bullish") return "#00e676";
  if (v === "bearish") return "#ff3d57";
  return "#f59e0b";
}

function scoreColor(score: number) {
  if (score >= 80) return "#00e676";
  if (score >= 60) return "#0099ff";
  return "#f59e0b";
}

export function TerminalUnlock({ initialData }: { initialData: any[] }) {
  const [state, setState] = useState<"locked" | "entering" | "open">("locked");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function unlock() {
    if (pin !== DEMO_PIN) { setError("Incorrect PIN"); return; }
    setState("open");
  }

  if (state === "locked") {
    return (
      <>
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
          <Lock className="text-zinc-500" size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Terminal Locked</h3>
          <p className="text-zinc-500 font-mono text-sm">AUTHENTICATION REQUIRED: UTPB_STUDENT_ID</p>
        </div>
        <button
          onClick={() => setState("entering")}
          className="px-8 py-3 bg-white text-black font-bold rounded-md hover:bg-zinc-200 transition-colors"
        >
          ACCESS TERMINAL
        </button>
      </>
    );
  }

  if (state === "entering") {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <p className="text-zinc-500 font-mono text-sm">ENTER ACCESS PIN</p>
        <input
          type="password"
          placeholder="• • • •"
          value={pin}
          autoFocus
          onChange={(e) => { setPin(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && unlock()}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-md text-white font-mono text-center text-lg tracking-widest outline-none focus:border-emerald-500 transition-colors"
        />
        {error && <p className="text-red-500 font-mono text-xs">{error}</p>}
        <div className="flex gap-3 w-full">
          <button onClick={unlock} className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-zinc-200 transition-colors">
            UNLOCK
          </button>
          <button onClick={() => { setState("locked"); setPin(""); setError(""); }} className="px-6 py-3 border border-zinc-700 text-zinc-400 rounded-md hover:border-zinc-500 transition-colors">
            CANCEL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-left">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-emerald-500 font-mono text-xs tracking-widest">
          LIVE FEED — {initialData.length} CATALYSTS
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              {["Ticker", "Type", "Description", "Verdict", "Score"].map((h) => (
                <th key={h} className="px-3 py-2 text-left text-[10px] font-mono tracking-widest text-zinc-600 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {initialData.map((row, i) => {
              const ticker = row.ticker ?? row.Ticker ?? "";
              const type = row.type ?? row.EventType ?? "";
              const description = row.description ?? row.Description ?? "";
              const verdict = row.verdict ?? row.Verdict ?? "";
              const score = row.impactScore ?? row.ImpactScore ?? 0;
              return (
                <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                  <td className="px-3 py-3 font-mono font-bold text-sky-400">${ticker}</td>
                  <td className="px-3 py-3 font-mono text-xs text-zinc-500 whitespace-nowrap">{type.replace(/_/g, " ")}</td>
                  <td className="px-3 py-3 text-zinc-400 max-w-xs truncate">{description}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ color: verdictColor(verdict), background: `${verdictColor(verdict)}18`, border: `1px solid ${verdictColor(verdict)}40` }}>
                      {verdict.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono font-bold" style={{ color: scoreColor(score) }}>{score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
