import { Sparkles } from "lucide-react";
import { getRecentSignals } from "@/lib/azure-db";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { SignalsClient } from "./SignalsClient";

export const revalidate = 30;

export default async function SignalsPage() {
  const [session, signals] = await Promise.all([
    auth(),
    getRecentSignals({ limit: 50 }).catch(() => []),
  ]);
  const isPremium = (session?.user as any)?.plan !== "free";

  const upCount   = signals.filter(s => s.direction === "UP").length;
  const downCount = signals.filter(s => s.direction === "DOWN").length;
  const highConf  = signals.filter(s => s.confidence >= 70).length;

  // Free tier: latest 8 only; premium gets the full feed (and live stream)
  const visible = isPremium ? signals : signals.slice(0, 8);

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="AI Signal Feed · Live"
          labelColor="#a78bfa"
          icon={Sparkles}
          iconColor="#a78bfa"
          iconGlow="rgba(167,139,250,0.35)"
          title="AI Momentum Signals"
          description="Live momentum signals from the Catalyst Harvester engine. Every minute, Chronos-Bolt forecasts the next 5 minutes of price action and we publish a structured edge score."
          stats={[
            { label: "Total Signals",   value: signals.length, color: "#a78bfa" },
            { label: "Bullish (UP)",    value: upCount,        color: "#00e676" },
            { label: "Bearish (DOWN)",  value: downCount,      color: "#ff4d4d" },
            { label: "High Confidence", value: highConf,       color: "#f59e0b" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock live stream"
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <SignalsClient initialSignals={visible} isPremium={isPremium} totalCount={signals.length} />
      </ScrollReveal>
    </div>
  );
}
