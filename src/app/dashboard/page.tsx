import { auth } from "@/lib/auth";
import { getCatalysts } from "@/lib/azure-db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Star, Building2, Zap } from "lucide-react";

function verdictColor(v: string) { return v === "Bullish" ? "var(--bull)" : v === "Bearish" ? "var(--bear)" : "var(--neutral)"; }
function scoreColor(s: number) { return s >= 80 ? "var(--bull)" : s >= 60 ? "var(--accent)" : "var(--neutral)"; }

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const plan      = (session.user as any).plan ?? "free";
  const isPremium = plan !== "free";
  const catalysts = await getCatalysts({ premiumOnly: false, limit: isPremium ? 50 : 10 }).catch(() => []);

  const planMeta: any = {
    free:          { label:"Catalyst",     color:"var(--text-secondary)", icon:Zap },
    alpha:         { label:"Alpha",        color:"var(--accent)",         icon:Star },
    institutional: { label:"Institutional",color:"var(--gold)",           icon:Building2 },
  };
  const pm      = planMeta[plan] ?? planMeta.free;
  const PlanIcon = pm.icon;

  const bullish  = catalysts.filter((c: any) => (c.Verdict ?? c.verdict) === "Bullish").length;
  const bearish  = catalysts.filter((c: any) => (c.Verdict ?? c.verdict) === "Bearish").length;
  const avgScore = catalysts.length
    ? Math.round(catalysts.reduce((a: number, c: any) => a + (c.ImpactScore ?? c.impactScore ?? 0), 0) / catalysts.length)
    : 0;

  return (
    <div style={{ padding:"32px 24px", maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:32 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <h1 style={{ fontSize:"clamp(20px,2.5vw,28px)", fontWeight:700, letterSpacing:"-0.02em" }}>
              Welcome back, {session.user.name ?? session.user.email?.split("@")[0]}
            </h1>
            <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:`${pm.color}18`, border:`1px solid ${pm.color}40`, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, color:pm.color }}>
              <PlanIcon size={11}/> {pm.label}
            </span>
          </div>
          <div style={{ fontSize:14, color:"var(--text-secondary)" }}>
            {isPremium ? "Real-time feed active" : "Free plan — upgrade for real-time signals"}
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {!isPremium && (
            <Link href="/pricing" style={{ display:"inline-flex", alignItems:"center", gap:7, background:"var(--accent)", color:"#fff", padding:"9px 18px", borderRadius:8, fontSize:13, fontWeight:600, textDecoration:"none" }}>
              <Star size={13}/> Upgrade to Alpha
            </Link>
          )}
          <Link href="/account" style={{ display:"inline-flex", alignItems:"center", gap:7, background:"var(--bg-elevated)", color:"var(--text-secondary)", padding:"9px 18px", borderRadius:8, fontSize:13, fontWeight:500, textDecoration:"none", border:"1px solid var(--border)" }}>
            Account
          </Link>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12, marginBottom:32 }}>
        {[
          { label:"Signals loaded", value:catalysts.length, color:"var(--accent)" },
          { label:"Bullish",        value:bullish,          color:"var(--bull)" },
          { label:"Bearish",        value:bearish,          color:"var(--bear)" },
          { label:"Avg AI score",   value:avgScore,         color:"var(--neutral)" },
        ].map(s => (
          <div key={s.label} style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:10, padding:"16px 20px" }}>
            <div style={{ fontSize:26, fontWeight:700, color:s.color, fontFamily:"monospace", marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:12, color:"var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"var(--bg-card)", border:"1px solid var(--border-medium)", borderRadius:14, overflow:"hidden" }}>
        <div style={{ padding:"14px 16px", background:"var(--bg-surface)", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span className="live-dot"/>
            <span style={{ fontSize:15, fontWeight:600 }}>Live Catalyst Feed</span>
          </div>
          <span style={{ fontSize:12, color:"var(--text-muted)" }}>{isPremium ? "Real-time · up to 50 signals" : "Delayed · 10 signal limit"}</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border)" }}>
                {["Ticker","Type","Description","Verdict","Score"].map(h => (
                  <th key={h} style={{ padding:"8px 16px", textAlign:"left", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catalysts.length === 0 ? (
                <tr><td colSpan={5} style={{ padding:"32px 16px", textAlign:"center", color:"var(--text-muted)", fontSize:13 }}>
                  No signals yet — add data via the Azure SQL Query Editor or trigger the Form 4 worker.
                </td></tr>
              ) : catalysts.map((row: any, i: number) => {
                const ticker  = row.Ticker  ?? row.ticker  ?? "";
                const type    = (row.EventType ?? row.type ?? "").replace(/_/g, " ");
                const desc    = row.Description ?? row.description ?? "";
                const verdict = row.Verdict ?? row.verdict ?? "";
                const score   = row.ImpactScore ?? row.impactScore ?? 0;
                return (
                  <tr key={i} style={{ borderBottom:"1px solid var(--border)", transition:"background 0.12s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  >
                    <td style={{ padding:"10px 16px", fontFamily:"monospace", fontWeight:700, color:"var(--accent)", whiteSpace:"nowrap" }}>${ticker}</td>
                    <td style={{ padding:"10px 16px", color:"var(--text-muted)", fontSize:11, whiteSpace:"nowrap" }}>{type}</td>
                    <td style={{ padding:"10px 16px", color:"var(--text-secondary)", maxWidth:340 }}>{desc}</td>
                    <td style={{ padding:"10px 16px", whiteSpace:"nowrap" }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, color:verdictColor(verdict), background:`${verdictColor(verdict)}18`, border:`1px solid ${verdictColor(verdict)}40` }}>
                        {verdict.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding:"10px 16px", fontFamily:"monospace", fontWeight:700, color:scoreColor(score), whiteSpace:"nowrap" }}>{score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
