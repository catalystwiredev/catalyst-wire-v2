import { auth } from "@/lib/auth";
import { getCatalysts } from "@/lib/azure-db";
import { getMacroSnapshot } from "@/lib/data/fred";
import { getNews } from "@/lib/data/marketaux";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Star, Building2, Zap, TrendingUp, TrendingDown, Newspaper, ArrowRight, BarChart2 } from "lucide-react";

export const revalidate = 120;

function verdictColor(v: string) { return v === "Bullish" ? "var(--bull)" : v === "Bearish" ? "var(--bear)" : "var(--neutral)"; }
function scoreColor(s: number)   { return s >= 80 ? "var(--bull)" : s >= 60 ? "var(--accent)" : "var(--neutral)"; }

function MacroCard({ title, value, units, date }: { title: string; value: number | null; units: string; date: string }) {
  const display = value !== null ? value.toFixed(units.includes("%") || units.toLowerCase().includes("percent") ? 2 : 2) : "—";
  const isRate  = units.toLowerCase().includes("percent") || units.includes("%");
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: "var(--text-primary)" }}>
        {display}{isRate ? "%" : ""}
      </div>
      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>{date}</div>
    </div>
  );
}

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
  const pm      = planMeta[plan] ?? planMeta.free;
  const PlanIcon = pm.icon;

  const bullish  = catalysts.filter((c: any) => (c.Verdict ?? c.verdict) === "Bullish").length;
  const bearish  = catalysts.filter((c: any) => (c.Verdict ?? c.verdict) === "Bearish").length;
  const avgScore = catalysts.length
    ? Math.round(catalysts.reduce((a: number, c: any) => a + (c.ImpactScore ?? c.impactScore ?? 0), 0) / catalysts.length)
    : 0;

  const macro = macroRaw ? Object.entries(macroRaw).slice(0, 6).map(([id, s]: [string, any]) => ({
    id, title: s?.title ?? id, value: s?.latestValue ?? null, units: s?.units ?? "", date: s?.latestDate ?? "",
  })) : [];

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

      {/* Two-column layout: catalyst feed + side panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Left: Catalyst feed */}
        <div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ padding: "14px 16px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="live-dot"/>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Live Catalyst Feed</span>
              </div>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{isPremium ? "Real-time · up to 50 signals" : "Delayed · 10 signal limit"}</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Ticker", "Type", "Description", "Verdict", "Score"].map(h => (
                      <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {catalysts.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                      No signals yet — data populates as SEC filings and news events are scored.
                    </td></tr>
                  ) : catalysts.map((row: any, i: number) => {
                    const ticker  = row.Ticker      ?? row.ticker      ?? "";
                    const type    = (row.EventType  ?? row.type        ?? "").replace(/_/g, " ");
                    const desc    = row.Description ?? row.description ?? "";
                    const verdict = row.Verdict     ?? row.verdict     ?? "";
                    const score   = row.ImpactScore ?? row.impactScore ?? 0;
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.12s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                        onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}>
                        <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, color: "var(--accent)", whiteSpace: "nowrap" }}>${ticker}</td>
                        <td style={{ padding: "10px 16px", color: "var(--text-muted)", fontSize: 11, whiteSpace: "nowrap" }}>{type}</td>
                        <td style={{ padding: "10px 16px", color: "var(--text-secondary)", maxWidth: 280 }}>{desc}</td>
                        <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, color: verdictColor(verdict), background: `${verdictColor(verdict)}18`, border: `1px solid ${verdictColor(verdict)}40` }}>
                            {verdict.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, color: scoreColor(score), whiteSpace: "nowrap" }}>{score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* News panel */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Newspaper size={14} style={{ color: "var(--accent)" }}/>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Latest News</span>
              </div>
              <Link href="/news" style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>View all <ArrowRight size={10}/></Link>
            </div>
            {newsRaw.length === 0 ? (
              <div style={{ padding: "20px 16px", fontSize: 13, color: "var(--text-muted)" }}>News unavailable — check API key.</div>
            ) : newsRaw.map((a, i) => {
              const sent  = a.sentiment === "positive" ? "var(--bull)" : a.sentiment === "negative" ? "var(--bear)" : "var(--neutral)";
              const score = Math.round(Math.abs(a.sentiment_score) * 100);
              return (
                <a key={a.uuid} href={a.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: i < newsRaw.length - 1 ? "1px solid var(--border)" : "none", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: sent, background: `${sent}18`, border: `1px solid ${sent}30`, borderRadius: 20, padding: "1px 7px" }}>
                        {a.sentiment?.toUpperCase() ?? "NEUTRAL"}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{a.source}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.45, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{a.title}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "monospace", color: sent }}>{score}</div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)" }}>SCORE</div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right: Macro panel */}
        <div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart2 size={14} style={{ color: "var(--accent)" }}/>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Macro Indicators</span>
            </div>
            <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {macro.length === 0 ? (
                <div style={{ fontSize: 13, color: "var(--text-muted)", padding: "8px 0" }}>Macro data unavailable — check FRED_API_KEY.</div>
              ) : macro.map(m => (
                <MacroCard key={m.id} title={m.title} value={m.value} units={m.units} date={m.date}/>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 14, padding: "16px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Quick Access</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { href: "/live-catalysts", label: "Live Catalysts",   color: "var(--bull)" },
                { href: "/sec-filings",    label: "SEC Filings",      color: "var(--accent)" },
                { href: "/news",           label: "News Feed",        color: "var(--accent)" },
                { href: "/earnings",       label: "Earnings Calendar",color: "var(--gold)" },
                { href: "/calculators",    label: "Calculators",      color: "var(--text-secondary)" },
                { href: "/watchlist",      label: "Watchlist",        color: "var(--text-secondary)" },
              ].map(({ href, label, color }) => (
                <Link key={href} href={href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, background: "var(--bg-elevated)", border: "1px solid var(--border)", textDecoration: "none", fontSize: 13, color, fontWeight: 500, transition: "border-color 0.15s" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-medium)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)")}>
                  {label}
                  <ArrowRight size={12} style={{ color: "var(--text-muted)" }}/>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
