"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, Zap, BarChart2, Database, Server, ArrowRight } from "lucide-react";

const IMPACT = [
  { icon: Database, title: "$5",   desc: "Covers one API integration for a month (CoinGecko, FRED, Alpha Vantage)." },
  { icon: BarChart2,title: "$15",  desc: "Funds a full month of Azure SQL compute for the live catalyst database." },
  { icon: Server,   title: "$30",  desc: "Pays for App Service + Redis Cache streaming for one calendar month." },
  { icon: Zap,      title: "$50+", desc: "Enables a new premium data source integration (options flow, Bloomberg partial)." },
];

const AMOUNTS = [500, 1000, 1500, 2500, 5000, 10000];
const LABELS  = ["$5", "$10", "$15", "$25", "$50", "$100"];

export default function DonatePage() {
  const [selected, setSelected] = useState(1500);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selected }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, background: "rgba(255,61,87,0.12)", border: "2px solid rgba(255,61,87,0.3)", borderRadius: "50%", marginBottom: 20 }}>
          <Heart size={28} style={{ color: "var(--bear)" }}/>
        </div>
        <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14 }}>Support Catalyst Wire</h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
          Catalyst Wire is built by one person — a solo developer and active trader. No VC funding, no team, no safety net. Every donation directly fuels infrastructure, data sources, and new features.
        </p>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Where your money goes</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 40 }}>
        {IMPACT.map(({ icon: Icon, title, desc }) => (
          <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 16px" }}>
            <Icon size={18} style={{ color: "var(--accent)", marginBottom: 10 }}/>
            <div style={{ fontSize: 17, fontWeight: 800, fontFamily: "monospace", marginBottom: 6 }}>{title}</div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,61,87,0.25)", borderRadius: 16, padding: 32, textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Make a one-time donation</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.7 }}>
          Any amount is appreciated. You&apos;ll receive a personal thank-you and your name listed (optionally) in our contributors section.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
          {AMOUNTS.map((amt, i) => (
            <button key={amt} onClick={() => setSelected(amt)}
              style={{ padding: "8px 20px", borderRadius: 8, background: selected === amt ? "var(--bear)" : "var(--bg-elevated)", border: `1px solid ${selected === amt ? "var(--bear)" : "var(--border-medium)"}`, color: selected === amt ? "#fff" : "var(--text-primary)", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
              {LABELS[i]}
            </button>
          ))}
        </div>

        {error && <p style={{ fontSize: 12, color: "var(--bear)", marginBottom: 12 }}>{error}</p>}

        <button onClick={checkout} disabled={loading}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bear)", color: "#fff", padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, border: "none" }}>
          <Heart size={16}/>
          {loading ? "Redirecting to Stripe…" : `Donate ${LABELS[AMOUNTS.indexOf(selected)] ?? `$${(selected/100).toFixed(0)}`} via Stripe`}
        </button>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>Processed securely via Stripe. You&apos;ll be redirected to a hosted payment page.</p>
      </div>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12, padding: 22 }}>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Prefer a subscription? <Link href="/pricing" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Upgrading to Alpha</Link> is the best ongoing way to support the project — you get premium access and fund development at the same time.
        </p>
        <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, color: "var(--accent)", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
          See pricing plans <ArrowRight size={13}/>
        </Link>
      </div>
    </div>
  );
}
