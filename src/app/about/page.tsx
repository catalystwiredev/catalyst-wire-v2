import Link from "next/link";
import { Zap, Target, BookOpen, Heart, ArrowRight, Mail } from "lucide-react";

const PILLARS = [
  { icon: Zap,      title: "Speed",          body: "Market-moving catalysts surface and expire in minutes. Every second of delay is alpha left on the table. We engineered for sub-second detection." },
  { icon: Target,   title: "Precision",      body: "Raw filings mean nothing without context. Our AI pipeline scores, categorizes, and cross-references every event against historical outcomes." },
  { icon: BookOpen, title: "Transparency",   body: "Every score links to its source. We tell you exactly which SEC form, earnings transcript, or congressional disclosure triggered the signal." },
  { icon: Heart,    title: "Accessibility",  body: "Institutional-grade intelligence shouldn't require institutional budgets. We built the free tier we wished existed when we started trading." },
];

const TIMELINE = [
  { date: "2024 Q3", event: "Idea born — frustrated by scattered, expensive data during a biotech PDUFA event." },
  { date: "2024 Q4", event: "First prototype parsing SEC EDGAR filings with keyword scoring." },
  { date: "2025 Q1", event: "Azure SQL + Web PubSub backend wired up. TradingView integration live." },
  { date: "2025 Q2", event: "Congressional trades + FDA calendar pipelines deployed. Private beta launched." },
  { date: "2025 Q4", event: "Public launch. Stripe monetization. 12,000+ instruments covered." },
  { date: "2026 →",  event: "AI conviction v2, real-time news NLP, UTPB academic data partnerships." },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>

      <div style={{ marginBottom: 60 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 12 }}>Our Story</div>
        <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 20 }}>
          Built by a trader.<br />
          <span className="gradient-text">For every trader.</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 640, marginBottom: 24 }}>
          Catalyst Wire was born from a simple frustration: institutional desks had real-time catalyst feeds. Retail traders had Twitter and hope. That gap was unacceptable. One UTPB student decided to close it.
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
            <div style={{ fontSize: 13, color: "var(--accent)", marginBottom: 14 }}>Computer Science — University of Texas of the Permian Basin</div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
              I&apos;m a solo developer and active trader who built Catalyst Wire because the tools I wanted didn&apos;t exist at a price I could afford. I handle everything — architecture, data pipelines, front-end design, AI scoring, DevOps, and customer support.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              Catalyst Wire runs on Azure infrastructure, SEC EDGAR public APIs, academic financial databases available through UTPB, and a custom NLP pipeline for real-time event scoring. Every dollar of revenue goes directly back into more data sources, faster infrastructure, and better features.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 28 }}>How we got here</h2>
        <div style={{ borderLeft: "2px solid var(--border-medium)", paddingLeft: 24, display: "flex", flexDirection: "column", gap: 24 }}>
          {TIMELINE.map(({ date, event }) => (
            <div key={date} style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: -31, top: 4, width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg-base)" }}/>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", marginBottom: 4 }}>{date}</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{event}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", background: "linear-gradient(135deg, rgba(0,153,255,0.08), rgba(0,230,118,0.05))", border: "1px solid rgba(0,153,255,0.18)", borderRadius: 16, padding: "40px 32px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Join the platform</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.7 }}>
          Start with the free tier. No card needed. Upgrade when the signals prove their worth.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "11px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            Start free trial <ArrowRight size={14}/>
          </Link>
          <Link href="/donate" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--bear-dim)", color: "var(--bear)", border: "1px solid var(--bear-border)", padding: "11px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            <Heart size={14}/> Support the project
          </Link>
        </div>
      </div>
    </div>
  );
}
