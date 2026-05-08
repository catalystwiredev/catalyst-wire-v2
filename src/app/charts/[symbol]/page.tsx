import { LineChart } from "lucide-react";
import { getStockBars } from "@/lib/data/alpaca";
import { getSignalsForSymbol } from "@/lib/azure-db";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { ChartClient } from "./ChartClient";

export const revalidate = 60;

export default async function ChartPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();

  const [session, bars, signals] = await Promise.all([
    auth(),
    getStockBars(symbol, { timeframe: "1Min", limit: 200 }).catch(() => []),
    getSignalsForSymbol(symbol, 50).catch(() => []),
  ]);

  const isPremium = (session?.user as any)?.plan !== "free";
  const latestSignal = signals[0];
  const lastBar      = bars[bars.length - 1];

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
          description={`Live ${symbol} chart with AI prediction overlay. ${bars.length} bars from Alpaca IEX feed${latestSignal ? ` · latest signal: ${latestSignal.direction} @ ${latestSignal.confidence}%` : ""}.`}
          stats={[
            { label: "Last Price",  value: lastBar    ? `$${lastBar.c.toFixed(2)}`         : "—", color: "#0090f0" },
            { label: "Bars",        value: bars.length,                                          color: "#a78bfa" },
            { label: "AI Signals",  value: signals.length,                                       color: "#f59e0b" },
            { label: "Latest",      value: latestSignal ? `${latestSignal.direction} ${latestSignal.confidence}%` : "—", color: latestSignal?.direction === "DOWN" ? "#ff4d4d" : "#00e676" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock live updates"
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <ChartClient symbol={symbol} initialBars={bars} initialSignal={latestSignal ?? null} isPremium={isPremium} />
      </ScrollReveal>
    </div>
  );
}
