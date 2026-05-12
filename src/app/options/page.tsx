import Link from "next/link";
import { Calculator, Search } from "lucide-react";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { tierAtLeast, shouldShowUpgradeCTA } from "@/lib/tier";

export const dynamic = "force-dynamic";

const POPULAR = [
  { symbol: "SPY", name: "S&P 500 ETF", sector: "Index", color: "#0090f0" },
  { symbol: "QQQ", name: "Nasdaq 100 ETF", sector: "Index", color: "#a78bfa" },
  { symbol: "AAPL", name: "Apple", sector: "Tech", color: "#00e676" },
  { symbol: "NVDA", name: "Nvidia", sector: "AI", color: "#10b981" },
  { symbol: "TSLA", name: "Tesla", sector: "EV", color: "#ff4d4d" },
  { symbol: "MSFT", name: "Microsoft", sector: "Tech", color: "#0090f0" },
  { symbol: "META", name: "Meta", sector: "Tech", color: "#0090f0" },
  { symbol: "AMD", name: "AMD", sector: "Semis", color: "#f59e0b" },
  { symbol: "GOOG", name: "Alphabet", sector: "Tech", color: "#0090f0" },
  { symbol: "AMZN", name: "Amazon", sector: "E-com", color: "#f59e0b" },
  { symbol: "COIN", name: "Coinbase", sector: "Crypto", color: "#f59e0b" },
  { symbol: "GLD", name: "Gold ETF", sector: "Metals", color: "#f6c90e" },
];

export default async function OptionsLanding() {
  const session = await auth();
  const isPremium = tierAtLeast(session, "alpha");

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="Options Chains · Greeks"
          labelColor="#a78bfa"
          icon={Calculator}
          iconColor="#a78bfa"
          iconGlow="rgba(167,139,250,0.35)"
          title="Options Intelligence"
          description="Full options chains with implied volatility, open interest, volume, and complete Black-Scholes Greeks (delta, gamma, theta, vega, rho)."
          stats={[
            { label: "Popular Tickers", value: POPULAR.length, color: "#a78bfa" },
            { label: "Greeks", value: "5", color: "#0090f0" },
            { label: "Source", value: "Yahoo", color: "#00e676" },
          ]}
          isPremium={isPremium}
          upgradeHref="/pricing"
          upgradeLabel="Unlock Full Options Intelligence"
          shouldShowUpgradeCTA={shouldShowUpgradeCTA(session)}
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <div style={{ background: "rgba(8,14,26,0.65)", backdropFilter: "blur(16px)", border: "1px solid rgba(167,139,250,0.12)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Search size={16} style={{ color: "#a78bfa" }} />
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.05em", margin: 0 }}>Quick Lookup</h2>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 18, lineHeight: 1.6 }}>
            Pick a symbol to view its full options chain — every strike, every expiration, with computed Greeks for risk analysis.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {POPULAR.map(t => (
              <Link
                key={t.symbol}
                href={`/options/${t.symbol}`}
                style={{
                  display: "flex", flexDirection: "column", gap: 4,
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${t.color}25`, borderRadius: 10,
                  textDecoration: "none", color: "var(--text-primary)",
                  transition: "border-color 0.15s, transform 0.15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "ui-monospace, monospace", color: t.color }}>{t.symbol}</span>
                  <span style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{t.sector}</span>
                </div>
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{t.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
