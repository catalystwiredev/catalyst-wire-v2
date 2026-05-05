"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, X, Zap, Star, Building2, ArrowRight, Shield, Clock } from "lucide-react";

const TIERS = [
  {
    id: "free", label: "Catalyst", price: { monthly: 0, annual: 0 }, color: "var(--text-secondary)", icon: Zap,
    desc: "Everything you need to get started with catalyst-driven trading.",
    cta: "Get started free", ctaHref: "/register",
    features: [
      { label: "10 catalyst signals / day",         included: true },
      { label: "SEC filings preview (4 rows)",       included: true },
      { label: "Insider trades preview",             included: true },
      { label: "Congressional trades preview",       included: true },
      { label: "FDA decisions preview",              included: true },
      { label: "Earnings preview",                   included: true },
      { label: "TradingView charts",                 included: true },
      { label: "Real-time signals",                  included: false },
      { label: "Full data feeds (50+ rows)",         included: false },
      { label: "AI conviction scores",               included: false },
      { label: "Momentum scanners",                  included: false },
      { label: "Specialized calendars",              included: false },
      { label: "Stock theme rankings",               included: false },
      { label: "API access",                         included: false },
      { label: "Priority support",                   included: false },
    ],
  },
  {
    id: "alpha", label: "Alpha", price: { monthly: 29, annual: 23 }, color: "var(--accent)", icon: Star,
    badge: "Most Popular",
    desc: "Real-time intelligence for serious retail traders and active investors.",
    cta: "Start 7-day free trial", ctaHref: null, plan: "alpha",
    features: [
      { label: "Unlimited catalyst signals",         included: true },
      { label: "Full SEC filings feed",              included: true },
      { label: "Full insider trades feed",           included: true },
      { label: "Full congressional trades feed",     included: true },
      { label: "Full FDA decisions feed",            included: true },
      { label: "Full earnings intelligence",         included: true },
      { label: "TradingView charts",                 included: true },
      { label: "Real-time signals",                  included: true },
      { label: "AI conviction scores (0-100)",       included: true },
      { label: "Momentum scanners",                  included: true },
      { label: "FDA / IPO / Earnings calendars",     included: true },
      { label: "Stock theme rankings",               included: true },
      { label: "API access",                         included: false },
      { label: "Dedicated account manager",          included: false },
      { label: "Custom data exports",                included: false },
    ],
  },
  {
    id: "inst", label: "Institutional", price: { monthly: 79, annual: 63 }, color: "var(--gold)", icon: Building2,
    desc: "Full-stack intelligence for funds, prop desks, and power users.",
    cta: "Start 7-day free trial", ctaHref: null, plan: "inst",
    features: [
      { label: "Unlimited catalyst signals",         included: true },
      { label: "Full SEC filings feed",              included: true },
      { label: "Full insider trades feed",           included: true },
      { label: "Full congressional trades feed",     included: true },
      { label: "Full FDA decisions feed",            included: true },
      { label: "Full earnings intelligence",         included: true },
      { label: "TradingView charts",                 included: true },
      { label: "Real-time signals",                  included: true },
      { label: "AI conviction scores (0-100)",       included: true },
      { label: "Momentum scanners",                  included: true },
      { label: "FDA / IPO / Earnings calendars",     included: true },
      { label: "Stock theme rankings",               included: true },
      { label: "REST API + webhooks",                included: true },
      { label: "Priority support (< 4h SLA)",        included: true },
      { label: "Custom data exports (CSV/JSON)",     included: true },
    ],
  },
];

const FAQS = [
  { q: "Is the 7-day trial really free?", a: "Yes — no credit card required to start. You're only charged after the trial ends if you choose to continue." },
  { q: "Can I cancel anytime?", a: "Absolutely. Cancel from your account dashboard with one click. No cancellation fees, no hassle." },
  { q: "What payment methods do you accept?", a: "All major credit and debit cards via Stripe, the industry standard for secure payments." },
  { q: "What does 'real-time signals' mean?", a: "Free-plan signals are delayed 15–60 minutes. Alpha and Institutional plans receive signals within seconds of detection." },
  { q: "Do you offer student or academic discounts?", a: "Yes — email us from your .edu address for a 40% academic discount on any paid plan." },
  { q: "What is the API for?", a: "Institutional subscribers get REST API access to stream catalyst events into their own systems, bots, or dashboards." },
];

export default function PricingPage() {
  const [annual, setAnnual]   = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  async function startCheckout(plan: string) {
    setLoading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: annual ? `${plan}_annual` : plan }),
    });
    const data = await res.json();
    if (data.url) { window.location.href = data.url; }
    else {
      // not logged in — send to register
      window.location.href = "/register";
    }
    setLoading(null);
  }

  return (
    <div style={{ padding: "48px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 12 }}>Transparent Pricing</div>
        <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
          Intelligence that <span className="gradient-text">pays for itself</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto 28px" }}>
          One missed catalyst can cost more than a year of Alpha. Start free, upgrade when it clicks.
        </p>

        {/* Billing toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 40, padding: "6px 8px" }}>
          <button onClick={() => setAnnual(false)} style={{ padding: "6px 18px", borderRadius: 32, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: !annual ? "var(--accent)" : "transparent", color: !annual ? "#fff" : "var(--text-secondary)", transition: "all 0.2s" }}>
            Monthly
          </button>
          <button onClick={() => setAnnual(true)} style={{ padding: "6px 18px", borderRadius: 32, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: annual ? "var(--accent)" : "transparent", color: annual ? "#fff" : "var(--text-secondary)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
            Annual <span style={{ fontSize: 10, fontWeight: 700, background: "var(--bull-dim)", color: "var(--bull)", border: "1px solid var(--bull-border)", borderRadius: 10, padding: "1px 6px" }}>SAVE 20%</span>
          </button>
        </div>
      </div>

      {/* Tier cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 20, marginBottom: 64 }}>
        {TIERS.map(tier => {
          const Icon = tier.icon;
          const price = annual ? tier.price.annual : tier.price.monthly;
          const isPopular = "badge" in tier;
          return (
            <div key={tier.id} style={{ background: "var(--bg-card)", border: `1px solid ${isPopular ? tier.color + "50" : "var(--border-medium)"}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", position: "relative", boxShadow: isPopular ? `0 0 32px ${tier.color}15` : "none" }}>
              {isPopular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 14px", borderRadius: 20 }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, background: `${tier.color}18`, border: `1px solid ${tier.color}30`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} style={{ color: tier.color }}/>
                </div>
                <span style={{ fontSize: 17, fontWeight: 700, color: tier.color }}>{tier.label}</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "monospace" }}>
                  {price === 0 ? "Free" : `$${price}`}
                </span>
                {price > 0 && <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 4 }}>/ mo</span>}
                {annual && price > 0 && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>billed annually (${price * 12}/yr)</div>}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>{tier.desc}</p>

              {tier.ctaHref ? (
                <Link href={tier.ctaHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: tier.id === "free" ? "var(--bg-elevated)" : tier.color, color: tier.id === "free" ? "var(--text-primary)" : "#fff", border: tier.id === "free" ? "1px solid var(--border-medium)" : "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 600, textDecoration: "none", marginBottom: 24 }}>
                  {tier.cta} <ArrowRight size={14}/>
                </Link>
              ) : (
                <button onClick={() => startCheckout(tier.plan!)} disabled={loading === tier.plan} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: loading === tier.plan ? `${tier.color}40` : tier.color, color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: loading === tier.plan ? "not-allowed" : "pointer", marginBottom: 24, width: "100%" }}>
                  {loading === tier.plan ? "Loading…" : <>{tier.cta} <ArrowRight size={14}/></>}
                </button>
              )}

              <ul style={{ listStyle: "none", flex: 1 }}>
                {tier.features.map(f => (
                  <li key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", fontSize: 13, color: f.included ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {f.included
                      ? <Check size={14} style={{ color: "var(--bull)", flexShrink: 0 }}/>
                      : <X     size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }}/>
                    }
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Trust badges */}
      <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", marginBottom: 72, padding: "24px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        {[
          { icon: Shield, label: "256-bit SSL encryption" },
          { icon: Clock,  label: "Cancel anytime, no fees" },
          { icon: Zap,    label: "Instant account activation" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
            <Icon size={15} style={{ color: "var(--accent)" }}/> {label}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 28, textAlign: "center" }}>
          Frequently asked questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {FAQS.map(({ q, a }) => (
            <details key={q} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px" }}>
              <summary style={{ fontSize: 14, fontWeight: 600, cursor: "pointer", color: "var(--text-primary)", listStyle: "none" }}>
                {q}
              </summary>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 10 }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
