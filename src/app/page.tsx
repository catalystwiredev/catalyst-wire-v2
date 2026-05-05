import { HeroSection } from "@/components/home/HeroSection";
import { TradingViewChart } from "@/components/home/TradingViewChart";
import { FeatureCards } from "@/components/home/FeatureCards";
import { TierTable } from "@/components/home/TierTable";
import { WhyDifferent } from "@/components/home/WhyDifferent";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <HeroSection/>
      <TradingViewChart/>
      <FeatureCards/>
      <TierTable/>
      <WhyDifferent/>
      <section style={{ padding:"0 24px 80px" }}>
        <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center", background:"var(--bg-card)", border:"1px solid rgba(255,61,87,0.20)", borderRadius:16, padding:"40px 32px" }}>
          <Heart size={28} style={{ color:"var(--bear)", marginBottom:16 }}/>
          <h2 style={{ fontSize:24, fontWeight:700, marginBottom:10, letterSpacing:"-0.02em" }}>Support Catalyst Wire</h2>
          <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.7, marginBottom:24 }}>
            Catalyst Wire is built entirely by one person — a UTPB student and solo developer. Every donation directly funds new data sources, infrastructure, and features. If this platform has helped your trading, consider supporting its growth.
          </p>
          <Link href="/donate" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--bear-dim)", color:"var(--bear)", border:"1px solid var(--bear-border)", padding:"10px 24px", borderRadius:8, fontSize:14, fontWeight:600, textDecoration:"none" }}>
            <Heart size={15}/> Make a donation
          </Link>
        </div>
      </section>
      <footer style={{ borderTop:"1px solid var(--border)", padding:"32px 24px", background:"var(--bg-surface)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div>
            <span style={{ fontFamily:"monospace", fontWeight:700, fontSize:16, color:"var(--text-primary)" }}>catalyst<span style={{ color:"var(--accent)" }}>wire</span></span>
            <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:4 }}>© 2026 Catalyst Wire. For informational purposes only. Not financial advice.</div>
          </div>
          <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
            {["Pricing","About","Privacy","Terms","Contact","Donate"].map(l=>(
              <Link key={l} href={`/${l.toLowerCase()}`} style={{ fontSize:13, color:"var(--text-secondary)", textDecoration:"none" }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
