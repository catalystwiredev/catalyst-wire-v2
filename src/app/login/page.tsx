"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Eye, EyeOff, AlertCircle, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  const input: React.CSSProperties = {
    width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-medium)",
    borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "var(--text-primary)",
    outline: "none", transition: "border-color 0.15s",
  };

  return (
    <div style={{ minHeight: "calc(100vh - var(--tape-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: "var(--accent-dim)", border: "1px solid var(--accent-glow)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} style={{ color: "var(--accent)" }}/>
            </div>
            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>
              catalyst<span style={{ color: "var(--accent)" }}>wire</span>
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 16, padding: 28 }}>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bear-dim)", border: "1px solid var(--bear-border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "var(--bear)" }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }}/> {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required autoComplete="email"
              style={input}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor  = "var(--border-medium)")}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
                PASSWORD
              </label>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password"
                style={{ ...input, paddingRight: 44 }}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                onBlur={e => (e.target.style.borderColor  = "var(--border-medium)")}
              />
              <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "var(--accent-dim)" : "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.15s" }}>
            <LogIn size={15}/> {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          No account?{" "}
          <Link href="/register" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
            Create one free →
          </Link>
        </p>
        <p style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
          7-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
}
