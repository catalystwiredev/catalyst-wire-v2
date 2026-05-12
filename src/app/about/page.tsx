import Link from "next/link";
import { Zap, Target, BookOpen, Heart, ArrowRight, Mail } from "lucide-react";

const PILLARS = [
  {
    icon: Zap,
    title: "Speed",
    body: "Market-moving catalysts are identified and scored in real time. We prioritize fresh data and low-latency pipelines."
  },
  {
    icon: Target,
    title: "Precision",
    body: "AI scoring combined with transparent logic. Every catalyst links back to its original source."
  },
  {
    icon: BookOpen,
    title: "Transparency",
    body: "No black boxes. You can always see the underlying data and reasoning behind each signal."
  },
  {
    icon: Heart,
    title: "Accessibility",
    body: "Institutional-grade tools built for traders on any budget. Strong free tier with fair paid plans."
  },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 60 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 12 }}>Our Story</div>
        <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 20 }}>
          Built by a trader.<br />
          <span style={{ background: "linear-gradient(135deg, #33b5ff, #00d97e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            For every trader.
          </span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 640, marginBottom: 24 }}>
          Catalyst Wire was created because institutional traders had real-time catalyst intelligence while everyone else was left guessing. 
          I built this platform as a solo developer and active trader to close that gap.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Get started free <ArrowRight size={14}/>
          </Link>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--bg-elevated)", color: "var(--text-secondary)", padding: "10px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1px solid var(--border-medium)" }}>
            <Mail size={14}/> Get in touch
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: 64 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 24 }}>What we stand for</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 22 }}>
              <div style={{ width: 36, height: 36, background: "var(--accent-dim)", border: "1px solid var(--accent-glow)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon size={17} style={{ color: "var(--accent)" }}/>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{title}</div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 16, padding: 32, marginBottom: 48 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ width: 72, height: 72, background: "linear-gradient(135deg, var(--accent), var(--bull))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, flexShrink: 0, color: "#fff" }}>AG</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Founder & Developer</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Angel Gomez</h3>
            <div style={{ fontSize: 13, color: "var(--accent)", marginBottom: 14 }}>Solo Developer & Active Trader</div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              I built Catalyst Wire because I got tired of paying for fragmented, delayed, or low-quality catalyst tools.
              Everything you see here is written and maintained by me.
            </p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", background: "linear-gradient(135deg, rgba(0,153,255,0.08), rgba(0,230,118,0.05))", border: "1px solid rgba(0,153,255,0.18)", borderRadius: 16, padding: "40px 32px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Ready to trade smarter?</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.7 }}>
          Start with the free tier. No credit card required.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "11px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Start free <ArrowRight size={14}/>
          </Link>
          <Link href="/donate" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--bear-dim)", color: "var(--bear)", border: "1px solid var(--bear-border)", padding: "11px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            <Heart size={14}/> Support the project
          </Link>
        </div>
      </div>
    </div>
  );
}
