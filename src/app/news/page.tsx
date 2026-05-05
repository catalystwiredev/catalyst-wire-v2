import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function Page() {
  return (
    <div style={{ padding:"32px 24px", maxWidth:800, margin:"0 auto" }}>
      <div style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", color:"var(--accent)", textTransform:"uppercase", marginBottom:10 }}>Coming Soon</div>
      <h1 style={{ fontSize:32, fontWeight:700, letterSpacing:"-0.02em", marginBottom:12 }}>News</h1>
      <p style={{ fontSize:15, color:"var(--text-secondary)", lineHeight:1.7, marginBottom:28 }}>This section is actively being built. Sign up to get early access when it launches.</p>
      <Link href="/register" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--accent)", color:"#fff", padding:"10px 22px", borderRadius:8, fontSize:14, fontWeight:600, textDecoration:"none" }}>
        Get early access <ArrowRight size={14}/>
      </Link>
    </div>
  );
}
