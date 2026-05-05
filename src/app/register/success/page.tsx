import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"var(--bg-base)" }}>
      <div style={{ maxWidth:480, textAlign:"center" }}>
        <CheckCircle size={56} style={{ color:"var(--bull)", marginBottom:24 }}/>
        <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.02em", marginBottom:12 }}>You're in.</h1>
        <p style={{ fontSize:15, color:"var(--text-secondary)", lineHeight:1.7, marginBottom:32 }}>
          Your 7-day free trial is active. You will not be charged until the trial ends. Cancel any time from your account page.
        </p>
        <Link href="/dashboard" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--accent)", color:"#fff", padding:"12px 32px", borderRadius:8, fontSize:15, fontWeight:600, textDecoration:"none" }}>
          Go to dashboard →
        </Link>
      </div>
    </div>
  );
}
