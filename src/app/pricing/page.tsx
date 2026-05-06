"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Check, X, Zap, Star, Building2, ArrowRight,
  Shield, Clock, Lock, Sparkles, TrendingUp,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

/* ── Tier definitions ──────────────────────────────────────────── */
const TIERS = [
  {
    id: "free", label: "Catalyst", color: "#6a84a0", glow: "rgba(106,132,160,0.3)",
    icon: Zap, price: { monthly: 0, annual: 0 },
    desc: "Everything you need to start trading with catalyst intelligence.",
    cta: "Get started free", ctaHref: "/register", plan: null,
    features: [
      { label: "10 catalyst signals / day",        on: true  },
      { label: "SEC filings preview (4 rows)",      on: true  },
      { label: "Insider trades preview",            on: true  },
      { label: "Congressional trades preview",      on: true  },
      { label: "FDA decisions preview",             on: true  },
      { label: "Earnings preview",                  on: true  },
      { label: "TradingView charts",                on: true  },
      { label: "Real-time signals",                 on: false },
      { label: "Full data feeds (unlimited rows)",  on: false },
      { label: "AI conviction scores (0–100)",      on: false },
      { label: "Momentum scanners",                 on: false },
      { label: "FDA / IPO / Earnings calendars",    on: false },
      { label: "Stock theme rankings",              on: false },
      { label: "REST API + webhooks",               on: false },
      { label: "Priority support",                  on: false },
    ],
  },
  {
    id: "alpha", label: "Alpha", color: "#0090f0", glow: "rgba(0,144,240,0.45)",
    icon: Star, price: { monthly: 29, annual: 23 },
    badge: "Most Popular",
    desc: "Real-time intelligence for serious retail traders and active investors.",
    cta: "Start 7-day free trial", ctaHref: null, plan: "alpha",
    features: [
      { label: "Unlimited catalyst signals",        on: true },
      { label: "Full SEC filings feed",             on: true },
      { label: "Full insider trades feed",          on: true },
      { label: "Full congressional trades feed",    on: true },
      { label: "Full FDA decisions feed",           on: true },
      { label: "Full earnings intelligence",        on: true },
      { label: "TradingView charts",                on: true },
      { label: "Real-time signals",                 on: true },
      { label: "AI conviction scores (0–100)",      on: true },
      { label: "Momentum scanners",                 on: true },
      { label: "FDA / IPO / Earnings calendars",    on: true },
      { label: "Stock theme rankings",              on: true },
      { label: "REST API + webhooks",               on: false },
      { label: "Dedicated account manager",         on: false },
      { label: "Custom data exports",               on: false },
    ],
  },
  {
    id: "inst", label: "Institutional", color: "#f6c90e", glow: "rgba(246,201,14,0.4)",
    icon: Building2, price: { monthly: 79, annual: 63 },
    desc: "Full-stack intelligence for funds, prop desks, and power users.",
    cta: "Start 7-day free trial", ctaHref: null, plan: "inst",
    features: [
      { label: "Unlimited catalyst signals",        on: true },
      { label: "Full SEC filings feed",             on: true },
      { label: "Full insider trades feed",          on: true },
      { label: "Full congressional trades feed",    on: true },
      { label: "Full FDA decisions feed",           on: true },
      { label: "Full earnings intelligence",        on: true },
      { label: "TradingView charts",                on: true },
      { label: "Real-time signals",                 on: true },
      { label: "AI conviction scores (0–100)",      on: true },
      { label: "Momentum scanners",                 on: true },
      { label: "FDA / IPO / Earnings calendars",    on: true },
      { label: "Stock theme rankings",              on: true },
      { label: "REST API + webhooks",               on: true },
      { label: "Priority support (< 4h SLA)",       on: true },
      { label: "Custom data exports (CSV/JSON)",    on: true },
    ],
  },
] as const;

const FAQS = [
  { q: "Is the 7-day trial really free?",         a: "Yes — no credit card required to start. You're only charged after the trial ends if you choose to continue." },
  { q: "Can I cancel anytime?",                   a: "Absolutely. Cancel from your account dashboard with one click. No cancellation fees, no hassle." },
  { q: "What payment methods do you accept?",     a: "All major credit and debit cards via Stripe. Institutional plans also support wire transfer." },
  { q: "What does 'real-time signals' mean?",     a: "Free-plan signals are delayed 15–60 minutes. Alpha and Institutional plans receive signals within seconds of detection." },
  { q: "Do you offer student or academic discounts?", a: "Yes — email us from your .edu address for a 40% academic discount on any paid plan." },
  { q: "What is the API for?",                    a: "Institutional subscribers get REST API + webhook access to stream catalyst events into their own systems, bots, or dashboards." },
];

/* ── 3-D tilt card ─────────────────────────────────────────────── */
function TierCard({ tier, annual, onCheckout, loading }: {
  tier: typeof TIERS[number];
  annual: boolean;
  onCheckout: (plan: string) => void;
  loading: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = tier.icon;
  const price = annual ? tier.price.annual : tier.price.monthly;
  const isPopular = "badge" in tier && tier.badge;

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateZ(6px)`;
  }, []);

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`pricing-card${isPopular ? " pricing-card-popular" : ""} holographic`}
      style={{
        borderColor: isPopular ? `${tier.color}35` : undefined,
        transformStyle: "preserve-3d",
        transition: "transform 0.08s linear, border-color 0.25s, box-shadow 0.25s",
      }}
    >
      {/* Top shimmer line */}
      <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:`linear-gradient(90deg, transparent, ${tier.color}60, transparent)`, pointerEvents:"none" }}/>

      {/* Ambient glow orb */}
      <div style={{ position:"absolute", top:-40, right:-30, width:160, height:160, background:`radial-gradient(circle, ${tier.glow} 0%, transparent 70%)`, pointerEvents:"none", filter:"blur(30px)" }}/>

      {/* Popular badge */}
      {isPopular && (
        <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg, ${tier.color}, #0060a0)`, color:"#fff", fontSize:10, fontWeight:800, letterSpacing:"0.12em", padding:"4px 16px", borderRadius:20, boxShadow:`0 0 20px ${tier.glow}`, whiteSpace:"nowrap" }}>
          ✦ MOST POPULAR ✦
        </div>
      )}

      {/* Icon + label */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
        <div style={{ width:46, height:46, background:`${tier.color}14`, border:`1px solid ${tier.color}30`, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 20px ${tier.glow}` }}>
          <Icon size={20} style={{ color:tier.color, filter:`drop-shadow(0 0 5px ${tier.color})` }}/>
        </div>
        <span style={{ fontSize:20, fontWeight:800, color:tier.color, letterSpacing:"-0.02em", textShadow:`0 0 20px ${tier.glow}` }}>{tier.label}</span>
      </div>

      {/* Price */}
      <div style={{ marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:4 }}>
          <span style={{ fontSize:46, fontWeight:900, fontFamily:"monospace", letterSpacing:"-0.04em", color:price === 0 ? "var(--text-primary)" : tier.color, textShadow:price > 0 ? `0 0 30px ${tier.glow}` : "none", lineHeight:1 }}>
            {price === 0 ? "Free" : `$${price}`}
          </span>
          {price > 0 && <span style={{ fontSize:13, color:"var(--text-muted)", marginBottom:6 }}>/mo</span>}
        </div>
        {annual && price > 0 && (
          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:4 }}>
            billed annually · <span style={{ color:"var(--bull)" }}>${(price * 12).toLocaleString()}/yr</span>
          </div>
        )}
        {!annual && price > 0 && (
          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:4 }}>
            or <span style={{ color:tier.color }}>${tier.price.annual}/mo</span> billed annually
          </div>
        )}
      </div>

      <p style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.7, marginBottom:22 }}>{tier.desc}</p>

      {/* CTA */}
      {tier.ctaHref ? (
        <Link
          href={tier.ctaHref}
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, background:"rgba(255,255,255,0.06)", color:"var(--text-primary)", border:"1px solid rgba(255,255,255,0.10)", borderRadius:10, padding:"13px 0", fontSize:14, fontWeight:600, textDecoration:"none", marginBottom:24, transition:"background 0.15s" }}
        >
          {tier.cta} <ArrowRight size={14}/>
        </Link>
      ) : (
        <button
          onClick={() => tier.plan && onCheckout(tier.plan)}
          disabled={loading === tier.plan}
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, background:loading === tier.plan ? `${tier.color}40` : `linear-gradient(135deg, ${tier.color}, ${tier.id === "inst" ? "#e07b00" : "#0060a0"})`, color:"#fff", border:"none", borderRadius:10, padding:"13px 0", fontSize:14, fontWeight:700, cursor:loading === tier.plan ? "not-allowed" : "pointer", marginBottom:24, width:"100%", boxShadow:loading === tier.plan ? "none" : `0 0 28px ${tier.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`, transition:"box-shadow 0.2s, opacity 0.15s", letterSpacing:"0.01em" }}
        >
          {loading === tier.plan
            ? <><span style={{ display:"inline-block", animation:"spin-slow 1s linear infinite", fontSize:16 }}>⟳</span> Processing…</>
            : <>{tier.cta} <ArrowRight size={14}/></>
          }
        </button>
      )}

      {/* Features */}
      <ul style={{ listStyle:"none", flex:1, display:"flex", flexDirection:"column", gap:1 }}>
        {tier.features.map(f => (
          <li key={f.label} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", fontSize:12.5, color:f.on ? "var(--text-primary)" : "var(--text-muted)", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
            {f.on
              ? <Check size={13} style={{ color:"var(--bull)", flexShrink:0, filter:"drop-shadow(0 0 4px rgba(0,217,126,0.5))" }}/>
              : <X     size={13} style={{ color:"rgba(255,255,255,0.15)", flexShrink:0 }}/>
            }
            {f.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── FAQ accordion item ────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{ background:"rgba(6,10,22,0.70)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", border:`1px solid ${open ? "rgba(0,144,240,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius:12, padding:"16px 20px", cursor:"pointer", transition:"border-color 0.2s", userSelect:"none" }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:14, fontWeight:600, color:"var(--text-primary)" }}>{q}</span>
        <span style={{ color:"var(--accent)", fontSize:18, flexShrink:0, transition:"transform 0.2s", transform:open?"rotate(45deg)":"rotate(0deg)" }}>+</span>
      </div>
      {open && (
        <p style={{ fontSize:13, color:"var(--text-secondary)", lineHeight:1.75, marginTop:12, borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:12 }}>{a}</p>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function PricingPage() {
  const [annual,  setAnnual]  = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  async function startCheckout(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: annual ? `${plan}_annual` : plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else window.location.href = "/register";
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ padding:"48px 24px 100px", maxWidth:1200, margin:"0 auto", position:"relative", zIndex:1 }}>

      {/* ── Header ── */}
      <ScrollReveal direction="up">
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,144,240,0.08)", border:"1px solid rgba(0,144,240,0.2)", borderRadius:20, padding:"6px 16px", marginBottom:18 }}>
            <Sparkles size={13} style={{ color:"var(--accent)" }}/>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", color:"var(--accent)", textTransform:"uppercase" }}>Transparent Pricing</span>
          </div>
          <h1 style={{ fontSize:"clamp(32px,4.5vw,58px)", fontWeight:900, letterSpacing:"-0.035em", lineHeight:1.08, marginBottom:18 }}>
            Intelligence that{" "}
            <span style={{ background:"linear-gradient(135deg, #33b5ff, #00d97e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              pays for itself.
            </span>
          </h1>
          <p style={{ fontSize:17, color:"var(--text-secondary)", maxWidth:520, margin:"0 auto 32px", lineHeight:1.7 }}>
            One missed catalyst can cost more than a year of Alpha. Start free, upgrade when it clicks.
          </p>

          {/* Billing toggle */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:2, background:"rgba(6,10,22,0.80)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:40, padding:"4px" }}>
            <button
              onClick={() => setAnnual(false)}
              style={{ padding:"8px 22px", borderRadius:36, border:"none", fontSize:13, fontWeight:600, cursor:"pointer", background:!annual ? "linear-gradient(135deg, #0090f0, #0060c0)" : "transparent", color:!annual ? "#fff" : "var(--text-secondary)", boxShadow:!annual ? "0 0 16px rgba(0,144,240,0.35)" : "none", transition:"all 0.2s" }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{ padding:"8px 22px", borderRadius:36, border:"none", fontSize:13, fontWeight:600, cursor:"pointer", background:annual ? "linear-gradient(135deg, #0090f0, #0060c0)" : "transparent", color:annual ? "#fff" : "var(--text-secondary)", boxShadow:annual ? "0 0 16px rgba(0,144,240,0.35)" : "none", transition:"all 0.2s", display:"flex", alignItems:"center", gap:8 }}
            >
              Annual
              <span style={{ fontSize:9, fontWeight:800, background:"rgba(0,217,126,0.15)", color:"var(--bull)", border:"1px solid rgba(0,217,126,0.3)", borderRadius:10, padding:"2px 7px", letterSpacing:"0.04em" }}>
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Tier cards ── */}
      <ScrollReveal direction="up" delay={100}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:22, marginBottom:72 }}>
          {TIERS.map(tier => (
            <TierCard
              key={tier.id}
              tier={tier}
              annual={annual}
              onCheckout={startCheckout}
              loading={loading}
            />
          ))}
        </div>
      </ScrollReveal>

      {/* ── Trust strip ── */}
      <ScrollReveal direction="up" delay={60}>
        <div style={{ display:"flex", justifyContent:"center", gap:48, flexWrap:"wrap", marginBottom:80, padding:"28px 32px", background:"rgba(5,9,18,0.70)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16 }}>
          {[
            { icon:Shield,      label:"256-bit SSL encryption",        sub:"Powered by Stripe" },
            { icon:Clock,       label:"Cancel anytime, no fees",       sub:"Self-serve cancellation" },
            { icon:Zap,         label:"Instant account activation",    sub:"Signals in under 60s" },
            { icon:Lock,        label:"No credit card for free trial", sub:"7 days, no commitment" },
            { icon:TrendingUp,  label:"Live EDGAR + Finnhub data",     sub:"3+ real data sources" },
          ].map(({ icon:Icon, label, sub }) => (
            <div key={label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, minWidth:130 }}>
              <div style={{ width:38, height:38, background:"rgba(0,144,240,0.08)", border:"1px solid rgba(0,144,240,0.16)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={16} style={{ color:"var(--accent)" }}/>
              </div>
              <span style={{ fontSize:12, fontWeight:600, color:"var(--text-primary)", textAlign:"center" }}>{label}</span>
              <span style={{ fontSize:10, color:"var(--text-muted)", textAlign:"center" }}>{sub}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* ── FAQ ── */}
      <ScrollReveal direction="up">
        <div style={{ maxWidth:720, margin:"0 auto" }}>
          <h2 style={{ fontSize:"clamp(22px,2.5vw,32px)", fontWeight:800, letterSpacing:"-0.025em", marginBottom:32, textAlign:"center" }}>
            Frequently asked questions
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {FAQS.map(item => <FaqItem key={item.q} {...item}/>)}
          </div>
        </div>
      </ScrollReveal>

      {/* ── Bottom CTA ── */}
      <ScrollReveal direction="scale" delay={100}>
        <div style={{ marginTop:80, textAlign:"center", padding:"48px 32px", background:"rgba(0,144,240,0.05)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", border:"1px solid rgba(0,144,240,0.15)", borderRadius:22, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:400, height:200, background:"radial-gradient(ellipse at center, rgba(0,144,240,0.15), transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:1, background:"linear-gradient(90deg, transparent, rgba(0,144,240,0.4), transparent)" }}/>
          <h3 style={{ fontSize:"clamp(20px,2.5vw,30px)", fontWeight:800, letterSpacing:"-0.02em", marginBottom:12 }}>
            Ready to trade with an edge?
          </h3>
          <p style={{ fontSize:15, color:"var(--text-secondary)", marginBottom:24 }}>
            Join thousands of traders using Catalyst Wire to catch moves before they happen.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/register" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(135deg, #0090f0, #0060c0)", color:"#fff", padding:"13px 30px", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none", boxShadow:"0 0 32px rgba(0,144,240,0.4), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
              Start free trial <ArrowRight size={15}/>
            </Link>
            <Link href="/live-catalysts" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.05)", backdropFilter:"blur(8px)", color:"var(--text-primary)", padding:"13px 30px", borderRadius:10, border:"1px solid rgba(255,255,255,0.10)", fontSize:14, fontWeight:500, textDecoration:"none" }}>
              <span className="live-dot"/> View live feed
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
