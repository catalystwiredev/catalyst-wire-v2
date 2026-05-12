import { LineChart } from "lucide-react";
import { getStockBars } from "@/lib/data/alpaca";
import { getYahooBars } from "@/lib/data/yahoo-finance";
import { getSignalsForSymbol } from "@/lib/azure-db";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { ChartClient } from "./ChartClient";
import { LiveQuoteTicker } from "./LiveQuoteTicker";
import { tierAtLeast, shouldShowUpgradeCTA } from "@/lib/tier";

export const dynamic = "force-dynamic";

export default async function ChartPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();

  const [session, signals] = await Promise.all([
    auth(),
    getSignalsForSymbol(symbol, 50).catch(() => []),
  ]);

  if (!session?.user) {
    // In production this would redirect, but for chart we allow public view with limits
  }

  const isPremium = tierAtLeast(session, "alpha");

  // Primary: Alpaca IEX
  let bars = await getStockBars(symbol, { timeframe: "1Min", limit: 200 }).catch(() => []);
  let provider = "Alpaca IEX";

  // Fallback: Yahoo Finance for extended hours / weekends
  if (bars.length < 5) {
    const end = new Date();
    const start = new Date(end.getTime() - 230 * 60_000);
    const yahooBars = await getYahooBars(symbol, { interval: "1m", period1: start, period2: end }).catch(() => []);
    bars = yahooBars.slice(-200);
    provider = "Yahoo Finance";
  }

  const latestSignal = signals[0];
  const lastBar = bars[bars.length - 1];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label={`${symbol} · 1-Minute Bars`}
          labelColor="#0090f0"
          icon={LineChart}
          iconColor="#0090f0"
          iconGlow="rgba(0,144,240,0.35)"
          title={symbol}
          description={`${symbol} live chart with AI signal overlay. ${bars.length} bars via ${provider}${latestSignal ? ` · Latest signal: ${latestSignal.direction} @ ${latestSignal.confidence}%` : ""}. Includes pre-market & after-hours.`}
          stats={[
            { label: "Last Price", value: lastBar ? `$${lastBar.c.toFixed(2)}` : "—", color: "#0090f0" },
            { label: "Bars Loaded", value: bars.length, color: "#a78bfa" },
            { label: "AI Signals", value: signals.length, color: "#f59e0b" },
            { label: "Latest Signal", value: latestSignal ? `${latestSignal.direction} ${latestSignal.confidence}%` : "—", color: latestSignal?.direction === "DOWN" ? "#ff4d4d" : "#00e676" },
          ]}
          isPremium={isPremium}
          upgradeHref="/pricing"
          upgradeLabel="Unlock Full Live Features"
          shouldShowUpgradeCTA={shouldShowUpgradeCTA(session)}
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <LiveQuoteTicker symbol={symbol} />
        <ChartClient 
          symbol={symbol} 
          initialBars={bars} 
          initialSignal={latestSignal ?? null} 
          isPremium={isPremium} 
        />
      </ScrollReveal>
    </div>
  );
}
