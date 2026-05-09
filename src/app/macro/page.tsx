import { Activity } from "lucide-react";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import { getMacroSnapshot } from "@/lib/data/fred";
import { MacroLive } from "./MacroLive";

export const revalidate = 600;

interface Indicator {
  id: string; title: string; value: number | null; date: string | null; units: string; frequency: string;
}

async function getMacro(): Promise<Indicator[]> {
  try {
    const snapshot = await getMacroSnapshot();
    return Object.entries(snapshot).map(([id, series]) => ({
      id,
      title:     series?.title         ?? id,
      value:     series?.latestValue   ?? null,
      date:      series?.latestDate    ?? null,
      units:     series?.units         ?? "",
      frequency: series?.frequency     ?? "",
    }));
  } catch { return []; }
}

export default async function MacroPage() {
  const [session, indicators] = await Promise.all([auth(), getMacro()]);
  const isPremium = (session?.user as { plan?: string } | undefined)?.plan !== "free";

  const withData = indicators.filter(i => i.value != null).length;
  const newest   = indicators.reduce<string>((acc, i) => (i.date && i.date > acc) ? i.date : acc, "");

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="Macro Indicators · FRED"
          labelColor="#0090f0"
          icon={Activity}
          iconColor="#0090f0"
          iconGlow="rgba(0,144,240,0.35)"
          title="Macro Intelligence"
          description="Federal Reserve economic indicators — rates, inflation, employment, growth, and volatility. Sourced live from FRED, refreshed hourly."
          stats={[
            { label: "Indicators",  value: indicators.length, color: "#0090f0" },
            { label: "Live Series", value: withData,          color: "#00e676" },
            { label: "Latest",      value: newest ? newest.slice(0, 10) : "—", color: "#a78bfa" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock historical charts"
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <MacroLive initialIndicators={indicators} />
      </ScrollReveal>
    </div>
  );
}
