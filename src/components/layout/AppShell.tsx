"use client";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TradingTape } from "./TradingTape";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, height:"var(--tape-h)", background:"var(--bg-surface)", borderBottom:"1px solid var(--border)" }}>
        <TradingTape />
      </div>
      <div style={{ display:"flex", marginTop:"var(--tape-h)", minHeight:"calc(100vh - var(--tape-h))" }}>
        <Sidebar open={open} onToggle={() => setOpen(o => !o)} />
        <main style={{ flex:1, marginLeft: open ? "var(--sidebar-open)" : "var(--sidebar-w)", transition:"margin-left 0.3s cubic-bezier(0.4,0,0.2,1)", minWidth:0 }}>
          {children}
        </main>
      </div>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:39, backdropFilter:"blur(2px)" }} />
      )}
    </>
  );
}
