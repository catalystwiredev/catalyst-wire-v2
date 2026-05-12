import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import { auth } from "@/lib/auth";
import { ThemesLive } from "./ThemesLive";
import { tierAtLeast, shouldShowUpgradeCTA } from "@/lib/tier";

export const dynamic = "force-dynamic";

async function getThemes() {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/themes`, { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.themes ?? [];
  } catch { return []; }
}

export default async function ThemesPage() {
  const [session, themes] = await Promise.all([auth(), getThemes()]);

  const isPremium = tierAtLeast(session, "alpha");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 72px" }}>
      <div style={{ marginBottom: 32, display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 8 }}>Market Intelligence</div>
          <h1 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 8 }}>Stock Themes & Rankings</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Curated baskets grouped by sector theme with live 1-day performance data.</p>
        </div>
        {isPremium ? (
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(0,230,118,0.1)", border:"1px solid rgba(0,230,118,0.25)", color:"var(--bull)", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:700 }}>
            <Crown size={14}/> All {themes.length} Themes Unlocked
          </div>
        ) : (
          <Link href="/pricing" style={{ display:"inline-flex", alignItems:"center", gap:7, background:"var(--accent)", color:"#fff", padding:"10px 20px", borderRadius:8, fontSize:13, fontWeight:600, textDecoration:"none" }}>
            Unlock all themes <ArrowRight size={14}/>
          </Link>
        )}
      </div>
      <ThemesLive initialThemes={themes} isPremium={isPremium} />
    </div>
  );
}
