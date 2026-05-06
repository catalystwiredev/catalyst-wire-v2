import { Zap, FileText } from "lucide-react";
import { searchFilings } from "@/lib/data/sec-edgar";
import { FilingsTable } from "./FilingsTable";
import { DataPageHeader } from "@/components/DataPageHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { auth } from "@/lib/auth";
import dayjs from "dayjs";

export const revalidate = 300;

export default async function LiveCatalystsPage() {
  const session = await auth();
  const isPremium = (session?.user as any)?.plan !== "free";
  const thirtyDaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");

  const [form4, form8k] = await Promise.all([
    searchFilings({ forms: ["4"],   dateFrom: thirtyDaysAgo, limit: 20 }).catch(() => []),
    searchFilings({ forms: ["8-K"], dateFrom: thirtyDaysAgo, limit: 20 }).catch(() => []),
  ]);

  const all     = [...form4, ...form8k].sort((a, b) => new Date(b.filedAt).getTime() - new Date(a.filedAt).getTime()).slice(0, 30);
  const visible = isPremium ? all : all.slice(0, 8);
  const locked  = isPremium ? [] : all.slice(8);

  return (
    <div style={{ padding:"32px 24px", maxWidth:1200, margin:"0 auto" }}>
      <ScrollReveal>
        <DataPageHeader
          label="Live Feed · Updating every 5 min"
          labelColor="#0090f0"
          icon={Zap}
          iconColor="#0090f0"
          iconGlow="rgba(0,144,240,0.35)"
          title="Live Catalysts"
          description="Real-time SEC filings — Form 4 insider trades, 8-K material events, and ownership changes scored as they hit EDGAR."
          stats={[
            { label:"Form 4 Filings",   value: form4.length,   color:"#0090f0" },
            { label:"8-K Events",       value: form8k.length,  color:"#a78bfa" },
            { label:"Total Signals",    value: all.length,     color:"#00e676" },
          ]}
          isPremium={isPremium}
          upgradeHref="/register?plan=alpha"
          upgradeLabel="Unlock real-time feed"
          premiumLabel="Alpha Access Active"
        />
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:28 }}>
          {[
            { label:"Form 4 Filings", value: form4.length,  icon: FileText, color:"#0090f0",  glow:"rgba(0,144,240,0.25)" },
            { label:"8-K Events",     value: form8k.length, icon: FileText, color:"#a78bfa",  glow:"rgba(167,139,250,0.25)" },
            { label:"Signals Today",  value: all.length,    icon: Zap,      color:"#00e676",  glow:"rgba(0,230,118,0.25)" },
          ].map(({ label, value, icon:Icon, color, glow }) => (
            <div key={label} style={{ background:"rgba(8,14,26,0.70)", backdropFilter:"blur(18px)", border:`1px solid ${color}20`, borderRadius:14, padding:"16px 20px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-20, right:-10, width:80, height:80, background:`radial-gradient(circle, ${glow} 0%, transparent 70%)`, filter:"blur(15px)", pointerEvents:"none" }}/>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
                <Icon size={13} style={{ color }}/>
                <span style={{ fontSize:10, color:"var(--text-muted)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
              </div>
              <div style={{ fontSize:26, fontWeight:800, fontFamily:"monospace", color, textShadow:`0 0 16px ${color}60` }}>{value}</div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <FilingsTable visible={visible} locked={locked}/>
      </ScrollReveal>
    </div>
  );
}
