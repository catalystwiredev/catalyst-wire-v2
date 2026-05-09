import { Activity, TrendingUp, Percent, DollarSign, BarChart3 } from "lucide-react";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";

export const revalidate = 1800;

interface Indicator {
  id: string; title: string; value: number | null; date: string | null; units: string; frequency: string;
}

async function getMacro(): Promise<Indicator[]> {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/macro`, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.indicators ?? [];
  } catch { return []; }
}

function colorFor(id: string): string {
  if (/RATE|FED|TREASURY/i.test(id))    return "#0090f0";
  if (/CPI|INFLATION|PCE/i.test(id))    return "#ff4d4d";
  if (/GDP|UNEMPLOYMENT/i.test(id))     return "#00e676";
  if (/VIX|VOLAT/i.test(id))            return "#a78bfa";
  return "#f59e0b";
}

function iconFor(id: string) {
  if (/RATE|FED/i.test(id))         return Percent;
  if (/CPI|PCE|INFLATION/i.test(id)) return TrendingUp;
  if (/GDP|EMPLOY/i.test(id))       return BarChart3;
  if (/DOLLAR|DXY/i.test(id))       return DollarSign;
  return Activity;
}

function formatValue(v: number | null, units: string): string {
  if (v == null) return "—";
  if (/percent|%/i.test(units)) return `${v.toFixed(2)}%`;
  if (Math.abs(v) >= 1_000_000)  return `${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000)      return `${(v / 1_000).toFixed(2)}K`;
  return v.toFixed(2);
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
        {indicators.length === 0 ? (
          <div style={{ textAlign: "center", padding: 72, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(18px)", border: "1px solid rgba(0,144,240,0.12)", borderRadius: 18 }}>
            <Activity size={28} style={{ color: "#0090f0", opacity: 0.7, marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Macro data temporarily unavailable</div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>FRED indicators refresh hourly. Check back shortly.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {indicators.map(ind => {
              const color = colorFor(ind.id);
              const Icon = iconFor(ind.id);
              return (
                <div key={ind.id} style={{
                  background: "rgba(8,14,26,0.65)", backdropFilter: "blur(16px)",
                  border: `1px solid ${color}20`, borderRadius: 14, padding: 20,
                  display: "flex", flexDirection: "column", gap: 12, transition: "border-color 0.15s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}14`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                      {ind.frequency}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4, lineHeight: 1.3 }}>{ind.title}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "ui-monospace, monospace", color, textShadow: `0 0 24px ${color}55` }}>
                      {formatValue(ind.value, ind.units)}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                    <span style={{ fontFamily: "ui-monospace, monospace" }}>{ind.id}</span>
                    <span>{ind.date ?? "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
