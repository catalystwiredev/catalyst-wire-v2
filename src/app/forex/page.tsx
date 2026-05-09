import { Globe } from "lucide-react";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";

export const revalidate = 3600;

interface FXResponse { base: string; date: string; rates: Record<string, number>; }

async function getForex(): Promise<FXResponse | null> {
  try {
    const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/forex?mode=majors`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

const PAIR_META: Record<string, { name: string; flag: string; color: string }> = {
  EUR: { name: "Euro",            flag: "🇪🇺", color: "#0090f0" },
  GBP: { name: "British Pound",   flag: "🇬🇧", color: "#a78bfa" },
  JPY: { name: "Japanese Yen",    flag: "🇯🇵", color: "#ff4d4d" },
  CHF: { name: "Swiss Franc",     flag: "🇨🇭", color: "#f59e0b" },
  CAD: { name: "Canadian Dollar", flag: "🇨🇦", color: "#00e676" },
  AUD: { name: "Australian Dollar", flag: "🇦🇺", color: "#10b981" },
  CNY: { name: "Chinese Yuan",    flag: "🇨🇳", color: "#ef4444" },
  MXN: { name: "Mexican Peso",    flag: "🇲🇽", color: "#84cc16" },
  BRL: { name: "Brazilian Real",  flag: "🇧🇷", color: "#22c55e" },
};

export default async function ForexPage() {
  const [session, fx] = await Promise.all([auth(), getForex()]);
  const isPremium = (session?.user as { plan?: string } | undefined)?.plan !== "free";

  const pairs = fx ? Object.entries(fx.rates) : [];
  const date  = fx?.date ?? "—";

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="Forex · ECB Reference"
          labelColor="#00e676"
          icon={Globe}
          iconColor="#00e676"
          iconGlow="rgba(0,230,118,0.35)"
          title="Currency Markets"
          description="Live forex rates from the European Central Bank reference fix. Updates daily on ECB business days. Weekend rates serve last Friday close."
          stats={[
            { label: "Base Currency",  value: fx?.base ?? "USD",  color: "#00e676" },
            { label: "Major Pairs",    value: pairs.length,        color: "#0090f0" },
            { label: "Last Fix",       value: date,                color: "#a78bfa" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock historical pairs"
        />
      </ScrollReveal>

      <ScrollReveal delay={150}>
        {!fx ? (
          <div style={{ textAlign: "center", padding: 72, color: "var(--text-secondary)", background: "rgba(8,14,26,0.65)", backdropFilter: "blur(18px)", border: "1px solid rgba(0,230,118,0.12)", borderRadius: 18 }}>
            <Globe size={28} style={{ color: "#00e676", opacity: 0.7, marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Forex rates unavailable</div>
            <div style={{ fontSize: 13, opacity: 0.6 }}>ECB reference rates refresh once per business day around 16:00 CET.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {pairs.map(([currency, rate]) => {
              const meta = PAIR_META[currency] ?? { name: currency, flag: "🌐", color: "#6a84a0" };
              const inverse = 1 / rate;
              return (
                <div key={currency} style={{
                  background: "rgba(8,14,26,0.65)", backdropFilter: "blur(16px)",
                  border: `1px solid ${meta.color}20`, borderRadius: 14, padding: 20,
                  display: "flex", flexDirection: "column", gap: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{meta.flag}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "ui-monospace, monospace", color: meta.color }}>
                        {fx.base}/{currency}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{meta.name}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "ui-monospace, monospace", color: meta.color, textShadow: `0 0 24px ${meta.color}55` }}>
                      {rate < 0.01 ? rate.toExponential(3) : rate.toFixed(4)}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "ui-monospace, monospace" }}>
                      1 {currency} = {inverse.toFixed(4)} {fx.base}
                    </div>
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
