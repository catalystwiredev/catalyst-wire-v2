import { Bitcoin } from "lucide-react";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { getTopBinancePairs, type BinanceTicker } from "@/lib/data/binance";
import { CryptoLiveBoard } from "./CryptoLiveBoard";
import { tierAtLeast, shouldShowUpgradeCTA } from "@/lib/tier";

export const dynamic = "force-dynamic";

export default async function CryptoPage() {
  const session = await auth();
  const pairs: BinanceTicker[] = await getTopBinancePairs(24).catch(() => []);

  const isPremium = tierAtLeast(session, "alpha");

  const totalVolume = pairs.reduce((sum, p) => sum + p.quoteVolume, 0);
  const gainers = pairs.filter(p => p.priceChangePercent > 0).length;
  const losers = pairs.filter(p => p.priceChangePercent < 0).length;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="Crypto Markets · 24/7 Live"
          labelColor="#f59e0b"
          icon={Bitcoin}
          iconColor="#f59e0b"
          iconGlow="rgba(245,158,11,0.35)"
          title="Crypto Intelligence"
          description="Real-time top USDT pairs from Binance by 24h volume. Streaming updates, never closes. Includes pre-market, after-hours, weekend, and holiday coverage."
          stats={[
            { label: "Top Pairs", value: pairs.length, color: "#f59e0b" },
            { label: "Gainers 24h", value: gainers, color: "#00e676" },
            { label: "Losers 24h", value: losers, color: "#ff4d4d" },
            { label: "24h Volume", value: totalVolume > 1e9 ? `$${(totalVolume / 1e9).toFixed(1)}B` : `$${(totalVolume / 1e6).toFixed(1)}M`, color: "#a78bfa" },
          ]}
          isPremium={isPremium}
          upgradeHref="/pricing"
          upgradeLabel="Unlock Arbitrage Scanner"
          shouldShowUpgradeCTA={shouldShowUpgradeCTA(session)}
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        {pairs.length === 0 ? (
          <div style={{ textAlign: "center", padding: 72, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(18px)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 18 }}>
            <Bitcoin size={28} style={{ color: "#f59e0b", opacity: 0.7, marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Crypto data unavailable</div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>Binance public stream is temporarily unreachable.</div>
          </div>
        ) : (
          <CryptoLiveBoard initialPairs={pairs} />
        )}
      </ScrollReveal>
    </div>
  );
}
