import { auth } from "@/lib/auth";
import { getCatalysts } from "@/lib/azure-db";
import { getMacroSnapshot } from "@/lib/data/fred";
import { getNews } from "@/lib/data/marketaux";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Star, Building2, Zap } from "lucide-react";
import { DashboardClient } from "./DashboardClient";

export const revalidate = 120;

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const plan      = (session.user as any).plan ?? "free";
  const isPremium = plan !== "free";

  const [catalysts, macroRaw, newsRaw] = await Promise.all([
    getCatalysts({ premiumOnly: false, limit: isPremium ? 50 : 10 }).catch(() => []),
    getMacroSnapshot().catch(() => null),
    getNews({ limit: 5 }).catch(() => []),
  ]);

  const planMeta: any = {
    free:          { label: "Catalyst",      color: "var(--text-secondary)", icon: Zap },
    alpha:         { label: "Alpha",         color: "var(--accent)",          icon: Star },
    institutional: { label: "Institutional", color: "var(--gold)",            icon: Building2 },
  };
  const pm       = planMeta[plan] ?? planMeta.free;
  const PlanIcon = pm.icon;

  const bullish  = catalysts.filter((c: any) => (c.Verdict ?? c.verdict) === "Bullish").length;
  const bearish  = catalysts.filter((c: any) => (c.Verdict ?? c.verdict) === "Bearish").length;
  const avgScore = catalysts.length
    ? Math.round(catalysts.reduce((a: number, c: any) => a + (c.ImpactScore ?? c.impactScore ?? 0), 0) / catalysts.length)
    : 0;

  const macro = macroRaw
    ? Object.entries(macroRaw).slice(0, 6).map(([id, s]: [string, any]) => ({
        id, title: s?.title ?? id, value: s?.latestValue ?? null, units: s?.units ?? "", date: s?.latestDate ?? "",
      }))
    : [];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h1 style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Welcome back, {session.user.name ?? session.user.email?.split("@")[0]}
            </h1>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${pm.color}18`, border: `1px solid ${pm.color}40`, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: pm.color }}>
              <PlanIcon size={11}/> {pm.label}
            </span>
          </div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            {isPremium ? "Real-time feed active" : "Free plan — upgrade for real-time signals"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!isPremium && (
            <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--accent)", color: "#fff", padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <Star size={13}/> Upgrade to Alpha
            </Link>
          )}
          <Link href="/account" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--bg-elevated)", color: "var(--text-secondary)", padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none", border: "1px solid var(--border)" }}>
            Account
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Signals loaded", value: catalysts.length, color: "var(--accent)" },
          { label: "Bullish",        value: bullish,          color: "var(--bull)" },
          { label: "Bearish",        value: bearish,          color: "var(--bear)" },
          { label: "Avg AI score",   value: avgScore,         color: "var(--neutral)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "monospace", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <DashboardClient catalysts={catalysts} macro={macro} news={newsRaw} isPremium={isPremium}/>
    </div>
  );
}
