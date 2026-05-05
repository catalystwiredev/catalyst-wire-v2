import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Star, Building2, Zap, ArrowRight } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { BillingPortalButton } from "@/components/BillingPortalButton";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const plan = (session.user as any).plan ?? "free";
  const planMeta: any = {
    free:          { label:"Catalyst (Free)", color:"var(--text-secondary)", icon:Zap },
    alpha:         { label:"Alpha",           color:"var(--accent)",         icon:Star },
    institutional: { label:"Institutional",   color:"var(--gold)",           icon:Building2 },
  };
  const pm      = planMeta[plan] ?? planMeta.free;
  const PlanIcon = pm.icon;

  return (
    <div style={{ padding:"32px 24px", maxWidth:640, margin:"0 auto" }}>
      <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.02em", marginBottom:32 }}>Account</h1>

      <div style={{ background:"var(--bg-card)", border:"1px solid var(--border-medium)", borderRadius:14, padding:24, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:16 }}>Profile</div>
        {[
          { label:"Name",  value:session.user.name  ?? "—" },
          { label:"Email", value:session.user.email ?? "—" },
          { label:"Plan",  value:pm.label },
        ].map(row => (
          <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
            <span style={{ fontSize:13, color:"var(--text-secondary)" }}>{row.label}</span>
            <span style={{ fontSize:13, color:"var(--text-primary)", fontFamily:row.label==="Email"?"monospace":"inherit" }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ background:"var(--bg-card)", border:"1px solid var(--border-medium)", borderRadius:14, padding:24, marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:16 }}>Subscription</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:40, height:40, background:`${pm.color}18`, border:`1px solid ${pm.color}30`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <PlanIcon size={20} style={{ color:pm.color }}/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:600, color:"var(--text-primary)" }}>{pm.label}</div>
              <div style={{ fontSize:12, color:"var(--text-secondary)" }}>{plan==="free"?"Free forever":"Active subscription"}</div>
            </div>
          </div>
          {plan === "free" ? (
            <Link href="/pricing" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--accent)", color:"#fff", padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:600, textDecoration:"none" }}>
              Upgrade <ArrowRight size={13}/>
            </Link>
          ) : (
            <BillingPortalButton/>
          )}
        </div>
      </div>

      <div style={{ background:"var(--bg-card)", border:"1px solid var(--border-medium)", borderRadius:14, padding:24 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--text-muted)", marginBottom:16 }}>Session</div>
        <SignOutButton/>
      </div>
    </div>
  );
}
