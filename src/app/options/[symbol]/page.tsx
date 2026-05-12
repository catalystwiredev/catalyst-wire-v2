import { Calculator } from "lucide-react";
import Link from "next/link";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { tierAtLeast, shouldShowUpgradeCTA } from "@/lib/tier";
import { OptionsChainClient } from "./OptionsChainClient";

export const dynamic = "force-dynamic";

interface Greeks { delta: number; gamma: number; theta: number; vega: number; rho: number; }
interface OptionContract {
  contractSymbol: string; strike: number; lastPrice: number; bid: number; ask: number;
  volume: number; openInterest: number; impliedVolatility: number; inTheMoney: boolean;
  expiration: string; greeks: Greeks;
}
interface OptionChain {
  symbol: string; expiration: string; expirations: string[]; underlyingPrice: number;
  calls: OptionContract[]; puts: OptionContract[];
}

async function getChain(symbol: string, expiration?: string): Promise<OptionChain | null> {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const url = `${base}/api/options/${symbol}${expiration ? `?expiration=${encodeURIComponent(expiration)}` : ""}`;
    const res = await fetch(url, { 
      cache: "no-store" 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export default async function OptionsSymbolPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ expiration?: string }>;
}) {
  const { symbol: rawSymbol } = await params;
  const { expiration } = await searchParams;
  const symbol = rawSymbol.toUpperCase();

  const [session, chain] = await Promise.all([auth(), getChain(symbol, expiration)]);

  const isPremium = tierAtLeast(session, "alpha");

  const callCount = chain?.calls.length ?? 0;
  const putCount = chain?.puts.length ?? 0;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1400, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label={`${symbol} Options · Live Chain`}
          labelColor="#a78bfa"
          icon={Calculator}
          iconColor="#a78bfa"
          iconGlow="rgba(167,139,250,0.35)"
          title={`${symbol} Options`}
          description={chain
            ? `Underlying $${chain.underlyingPrice.toFixed(2)} · ${chain.expirations.length} expiry dates · Black-Scholes Greeks computed in-app`
            : `Options chain unavailable for ${symbol}`}
          stats={[
            { label: "Spot", value: chain ? `$${chain.underlyingPrice.toFixed(2)}` : "—", color: "#0090f0" },
            { label: "Calls", value: callCount, color: "#00e676" },
            { label: "Puts", value: putCount, color: "#ff4d4d" },
            { label: "Expirations", value: chain?.expirations.length ?? 0, color: "#a78bfa" },
          ]}
          isPremium={isPremium}
          upgradeHref="/pricing"
          upgradeLabel="Unlock Full Options Intelligence"
          shouldShowUpgradeCTA={shouldShowUpgradeCTA(session)}
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        {!chain ? (
          <div style={{ textAlign: "center", padding: 72, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(18px)", border: "1px solid rgba(167,139,250,0.12)", borderRadius: 18 }}>
            <Calculator size={28} style={{ color: "#a78bfa", opacity: 0.7, marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No options data for {symbol}</div>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 18 }}>This symbol may not have options listed, or the data source is temporarily unavailable.</div>
            <Link href="/options" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 8, color: "#a78bfa", textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
              ← Back to options
            </Link>
          </div>
        ) : (
          <OptionsChainClient chain={chain} />
        )}
      </ScrollReveal>
    </div>
  );
}
