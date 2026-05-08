import { HeroSection } from "@/components/home/HeroSection";
import { TradingViewChart } from "@/components/home/TradingViewChart";
import { FeatureCards } from "@/components/home/FeatureCards";
import { TierTable } from "@/components/home/TierTable";
import { WhyDifferent } from "@/components/home/WhyDifferent";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { tierAtLeast } from "@/lib/tier";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  const interactiveCharts = tierAtLeast(session, "alpha");

  return (
    <>
      <HeroSection/>

      <ScrollReveal delay={0}>
        <TradingViewChart interactive={interactiveCharts}/>
      </ScrollReveal>

      <ScrollReveal delay={0}>
        <FeatureCards/>
      </ScrollReveal>

      <ScrollReveal delay={0}>
        <TierTable/>
      </ScrollReveal>

      <ScrollReveal delay={0}>
        <WhyDifferent/>
      </ScrollReveal>

      {/* Support section */}
      <ScrollReveal delay={0}>
        <section style={{ padding:"0 24px 80px" }}>
          <div style={{ maxWidth:660, margin:"0 auto", position:"relative", overflow:"hidden", background:"rgba(8,14,26,0.75)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", border:"1px solid rgba(255,61,87,0.18)", borderRadius:20, padding:"48px 40px", textAlign:"center" }}>
            {/* Glow */}
            <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:300, height:200, background:"radial-gradient(circle, rgba(255,61,87,0.12) 0%, transparent 70%)", pointerEvents:"none", filter:"blur(30px)" }}/>
            <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg, transparent, rgba(255,61,87,0.40), transparent)" }}/>
            <div style={{ position:"relative" }}>
              <div style={{ width:56, height:56, background:"rgba(255,61,87,0.10)", border:"1px solid rgba(255,61,87,0.25)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 0 24px rgba(255,61,87,0.20)" }}>
                <Heart size={24} style={{ color:"var(--bear)" }}/>
              </div>
              <h2 style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:800, letterSpacing:"-0.025em", marginBottom:12, lineHeight:1.2 }}>Support Catalyst Wire</h2>
              <p style={{ fontSize:14.5, color:"var(--text-secondary)", lineHeight:1.75, marginBottom:28, maxWidth:460, margin:"0 auto 28px" }}>
                Built by one solo developer and active trader — no VC funding, no team. Every donation directly funds new data sources, better infrastructure, and faster features.
              </p>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <Link href="/donate" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(135deg, rgba(255,61,87,0.9), rgba(220,30,60,0.9))", color:"#fff", border:"1px solid rgba(255,61,87,0.4)", padding:"12px 26px", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none", boxShadow:"0 0 24px rgba(255,61,87,0.25)" }}>
                  <Heart size={15}/> Make a donation
                </Link>
                <Link href="/pricing" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.04)", color:"var(--text-secondary)", border:"1px solid rgba(255,255,255,0.09)", padding:"12px 26px", borderRadius:10, fontSize:14, fontWeight:500, textDecoration:"none" }}>
                  View pricing <ArrowRight size={14}/>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"36px 24px", background:"rgba(4,8,18,0.80)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
          <div>
            <span style={{ fontFamily:"monospace", fontWeight:800, fontSize:17, color:"var(--text-primary)", letterSpacing:"-0.02em" }}>
              catalyst<span style={{ color:"var(--accent)", textShadow:"0 0 12px rgba(0,144,240,0.5)" }}>wire</span>
            </span>
            <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:5, lineHeight:1.5 }}>
              © 2026 Catalyst Wire. For informational purposes only.<br/>Not financial advice. Past performance does not guarantee future results.
            </div>
          </div>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
            {["Pricing","About","Privacy","Terms","Contact","Donate"].map(l=>(
              <Link key={l} href={`/${l.toLowerCase()}`} style={{ fontSize:12.5, color:"var(--text-muted)", textDecoration:"none", fontWeight:500, transition:"color 0.2s" }}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
