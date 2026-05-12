import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: 24, 
      background: "var(--bg-base)" 
    }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ marginBottom: 24 }}>
          <CheckCircle size={64} style={{ color: "var(--bull)", marginBottom: 16 }} />
        </div>
        
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 700, 
          letterSpacing: "-0.03em", 
          marginBottom: 12 
        }}>
          Account created successfully
        </h1>
        
        <p style={{ 
          fontSize: 16, 
          color: "var(--text-secondary)", 
          lineHeight: 1.7, 
          marginBottom: 40 
        }}>
          Your free account is ready. You now have access to live catalysts, charts, and market intelligence.
        </p>

        <Link 
          href="/dashboard" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 10, 
            background: "var(--accent)", 
            color: "#fff", 
            padding: "14px 36px", 
            borderRadius: 10, 
            fontSize: 15, 
            fontWeight: 600, 
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(0,144,240,0.3)"
          }}
        >
          Go to Dashboard <ArrowRight size={18} />
        </Link>

        <p style={{ 
          marginTop: 32, 
          fontSize: 13, 
          color: "var(--text-muted)" 
        }}>
          Need help getting started? Check out the <Link href="/live-catalysts" style={{ color: "var(--accent)" }}>Live Catalysts feed</Link>.
        </p>
      </div>
    </div>
  );
}
