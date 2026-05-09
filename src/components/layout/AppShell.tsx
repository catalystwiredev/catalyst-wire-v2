"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TradingTape } from "./TradingTape";
import { SearchModal } from "@/components/SearchModal";
import { ScrollBackground } from "@/components/ScrollBackground";

function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [visible, setVisible] = useState(true);
  const [key, setKey] = useState(path);
  const prev = useRef(path);

  useEffect(() => {
    if (prev.current === path) return;
    prev.current = path;
    setVisible(false);
    const t = setTimeout(() => { setKey(path); setVisible(true); }, 120);
    return () => clearTimeout(t);
  }, [path]);

  return (
    <div
      key={key}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1)",
        minHeight: "100%",
      }}
    >
      {children}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    }
    function onScroll() { setScrolled(window.scrollY > 12); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Living ombre canvas — sits behind everything */}
      <ScrollBackground />

      {/* Ticker tape */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "var(--tape-h)",
        background: scrolled
          ? "rgba(1,4,8,0.92)"
          : "rgba(1,4,8,0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(0,144,240,0.15)"
          : "1px solid rgba(255,255,255,0.05)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}>
        <TradingTape />
      </div>

      <div style={{ display: "flex", marginTop: "var(--tape-h)", minHeight: "calc(100vh - var(--tape-h))", position: "relative", zIndex: 1 }}>
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} onSearchOpen={() => setSearchOpen(true)} />

        <main style={{
          flex: 1,
          marginLeft: sidebarOpen ? "var(--sidebar-open)" : "var(--sidebar-w)",
          transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)",
          minWidth: 0,
          position: "relative",
          zIndex: 1,
        }}>
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>

      {/* Sidebar overlay — only on narrow viewports (mobile drawer pattern).
          On desktop the sidebar pushes content via marginLeft, so dimming
          the main content would just hurt readability. */}
      {sidebarOpen && (
        <div
          className="cw-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(3px)",
            zIndex: 39,
            transition: "opacity 0.2s",
          }}
        />
      )}
      <style>{`
        @media (min-width: 900px) {
          .cw-sidebar-overlay { display: none; }
        }
      `}</style>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
