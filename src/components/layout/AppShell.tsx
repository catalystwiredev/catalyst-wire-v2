"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TradingTape } from "./TradingTape";
import { SearchModal } from "@/components/SearchModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, height:"var(--tape-h)", background:"var(--bg-surface)", borderBottom:"1px solid var(--border)" }}>
        <TradingTape />
      </div>
      <div style={{ display:"flex", marginTop:"var(--tape-h)", minHeight:"calc(100vh - var(--tape-h))" }}>
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} onSearchOpen={() => setSearchOpen(true)}/>
        <main style={{ flex:1, marginLeft: sidebarOpen ? "var(--sidebar-open)" : "var(--sidebar-w)", transition:"margin-left 0.3s cubic-bezier(0.4,0,0.2,1)", minWidth:0 }}>
          {children}
        </main>
      </div>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:39, backdropFilter:"blur(2px)" }} />
      )}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)}/>
    </>
  );
}
